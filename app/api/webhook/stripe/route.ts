import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, hasStripeCredentials } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmationEmail, sendAdminOrderNotification, resend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth";
import { generateCustomizationPDF, convertImageToPDF } from "@/lib/pdf-customization";

export const runtime = "nodejs";

function log(...args: unknown[]) {
  if (process.env.NODE_ENV !== 'production') console.log("[WEBHOOK]", ...args);
}
function logError(...args: unknown[]) {
  console.error("[WEBHOOK ERROR]", ...args);
}

/**
 * GET → diagnostic / replay manuel (admin seulement)
 * Usage: /api/webhook/stripe?action=replay-last
 */
export async function GET(request: NextRequest) {
  // Vérifier l'authentification admin
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const action = request.nextUrl.searchParams.get("action");

  if (action === "replay-last") {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    try {
      const events = await stripe.events.list({
        type: "checkout.session.completed",
        limit: 1,
      });

      if (events.data.length === 0) {
        return NextResponse.json({ error: "Aucun événement checkout.session.completed trouvé" });
      }

      const event = events.data[0];
      const session = event.data.object as Stripe.Checkout.Session;

      log("=== REPLAY MANUEL ===");
      log("Event ID:", event.id);
      log("Session ID:", session.id);

      const result = await handleCheckoutCompleted(session);

      return NextResponse.json({
        replayed: true,
        event_id: event.id,
        session_id: session.id,
        created: new Date(event.created * 1000).toISOString(),
        result,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.stack || err.message : String(err);
      logError("Replay failed:", msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest) {
  log("=== WEBHOOK POST REÇU ===");

  if (!hasStripeCredentials() || !stripe) {
    logError("Stripe non configuré");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret) {
    logError("STRIPE_WEBHOOK_SECRET manquant");
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  if (!signature) {
    logError("stripe-signature header manquant");
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const body = await request.text();
  log("Body length:", body.length);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    log("Signature OK ✅ - Event:", event.type, "ID:", event.id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logError("❌ Signature échouée:", msg);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // Nettoyage des pending_customizations de plus de 7 jours
  try {
    const supabaseCleanup = getSupabaseAdminClient();
    if (supabaseCleanup) {
      await supabaseCleanup.from("pending_customizations")
        .delete()
        .lt("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    }
  } catch { /* non bloquant */ }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    log("🛒 checkout.session.completed - Session:", session.id);

    try {
      const result = await handleCheckoutCompleted(session);
      log("✅ Traitement terminé:", JSON.stringify(result));
    } catch (err) {
      const msg = err instanceof Error ? err.stack || err.message : String(err);
      logError("❌ Erreur traitement checkout:", msg);
      return NextResponse.json({ received: true, error: msg });
    }
  } else {
    log("Événement ignoré:", event.type);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = { steps: [] };
  const steps = result.steps as string[];

  if (!stripe) throw new Error("Stripe client non disponible");

  const supabase = getSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase admin client non disponible");
  steps.push("clients_ok");

  const metadata = session.metadata || {};
  log("Metadata:", JSON.stringify(metadata));
  log("Session email:", session.customer_email);
  log("Session customer_details:", JSON.stringify(session.customer_details));
  log("Session amount:", session.amount_total);
  log("Payment intent:", session.payment_intent);
  steps.push("metadata_ok");

  // Récupérer les line items
  let lineItems: Stripe.ApiList<Stripe.LineItem>;
  try {
    lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });
    log("Line items count:", lineItems.data.length);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logError("Erreur listLineItems:", msg);
    throw new Error("listLineItems failed: " + msg);
  }
  steps.push("line_items_ok");

  // Préparer les articles + collecter les personnalisations
  type CustomizationEntry = {
    productName: string;
    productSlug: string;
    faces: Record<string, { type: 'image' | 'text'; imageUrl?: string; fileName?: string; text?: string; font?: string }>;
  };
  const customizations: CustomizationEntry[] = [];

  // Récupérer les données de personnalisation depuis la DB
  const { data: pendingCust } = await supabase
    .from("pending_customizations")
    .select("data")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (pendingCust?.data && Array.isArray(pendingCust.data)) {
    for (const entry of pendingCust.data as any[]) {
      if (entry.slug && entry.faces) {
        customizations.push({
          productName: "",  // sera rempli depuis line items
          productSlug: entry.slug,
          faces: entry.faces,
        });
      }
    }
    log("Customizations récupérées depuis DB:", customizations.length);
    // Nettoyer la table pending
    await supabase.from("pending_customizations").delete().eq("stripe_session_id", session.id);
  }

  const orderItems = lineItems.data.map((item) => {
    const product = item.price?.product as Stripe.Product | string | null;
    const productMeta = product && typeof product !== "string" ? product.metadata : {};
    const slug = productMeta?.slug || "";
    const qty = item.quantity || 1;
    const amountTotal = item.amount_total || 0;

    // Récupérer la customization depuis le tableau collecté
    const matchingCust = customizations.find(c => c.productSlug === slug);
    if (matchingCust) {
      matchingCust.productName = item.description || "Produit";
    }
    const orderItem: Record<string, unknown> = {
      product_name: item.description || "Produit",
      product_slug: slug,
      quantity: qty,
      unit_price: qty ? amountTotal / qty / 100 : amountTotal / 100,
      total_price: amountTotal / 100,
      customization: matchingCust?.faces || undefined,
    };

    return orderItem;
  });
  log("Order items:", JSON.stringify(orderItems));
  steps.push("items_prepared");

  // Vérifier doublon
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existingOrder) {
    log("⚠️ Commande déjà existante:", existingOrder.id);
    result.order_id = existingOrder.id;
    result.already_exists = true;
    return result;
  }
  steps.push("no_duplicate");

  // Créer la commande
  const orderData = {
    user_id: metadata.user_id && metadata.user_id !== "guest" ? metadata.user_id : null,
    stripe_session_id: session.id,
    stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
    status: "pending",
    total_amount: (session.amount_total || 0) / 100,
    currency: session.currency || "eur",
    customer_email: session.customer_email || session.customer_details?.email || null,
    customer_name: metadata.customer_name || session.customer_details?.name || null,
    customer_phone: metadata.customer_phone || session.customer_details?.phone || null,
    shipping_address: metadata.shipping_address || null,
    shipping_address_line2: metadata.shipping_address_line2 || null,
    shipping_postal_code: metadata.shipping_postal_code || null,
    shipping_city: metadata.shipping_city || null,
    shipping_country: metadata.shipping_country || null,
    delivery_message: metadata.delivery_message || null,
    items: orderItems,
  };

  log("Insert order data:", JSON.stringify(orderData));

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    logError("❌ Insert order failed:", JSON.stringify(orderError));
    result.order_error = orderError;
    throw new Error("Insert order: " + orderError.message + " (code: " + orderError.code + ", details: " + orderError.details + ")");
  }

  log("✅ Commande créée:", order.id);
  result.order_id = order.id;
  steps.push("order_created");

  // Envoyer les emails
  const customerEmail = order.customer_email || session.customer_details?.email || "";

  if (customerEmail) {
    // Récupérer les images des line items Stripe
    const stripeImages: Record<string, string> = {};
    for (const li of lineItems.data) {
      const prod = li.price?.product;
      if (prod && typeof prod !== 'string' && !('deleted' in prod && prod.deleted) && (prod as Stripe.Product).images?.[0]) {
        const slug = (prod as Stripe.Product).metadata?.slug;
        if (slug) stripeImages[slug] = (prod as Stripe.Product).images[0];
      }
    }

    const emailData = {
      orderNumber: order.id.slice(0, 8).toUpperCase(),
      customerName: order.customer_name || session.customer_details?.name || "Client",
      customerEmail,
      customerPhone: order.customer_phone || metadata.customer_phone || "",
      totalAmount: order.total_amount,
      items: orderItems.map((item) => ({
        name: item.product_name as string,
        quantity: item.quantity as number,
        price: item.unit_price as number,
        imageUrl: stripeImages[item.product_slug as string] || "",
      })),
      shippingAddress: [
        metadata.shipping_address,
        metadata.shipping_address_line2,
        ((metadata.shipping_postal_code || "") + " " + (metadata.shipping_city || "")).trim(),
        metadata.shipping_country,
      ]
        .filter(Boolean)
        .join(", "),
      orderDate: new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    try {
      log("Envoi email confirmation à:", customerEmail);
      const emailResult = await sendOrderConfirmationEmail(emailData, supabase, order.id, metadata.user_id);
      log("Résultat email client:", JSON.stringify(emailResult));
      result.email_client = emailResult;

      if (emailResult.success) {
        await supabase
          .from("orders")
          .update({ confirmation_email_sent: true })
          .eq("id", order.id);
      }
    } catch (emailErr) {
      const msg = emailErr instanceof Error ? emailErr.message : String(emailErr);
      logError("Erreur email client (non bloquant):", msg);
      result.email_client_error = msg;
    }

    // Générer les PDF de personnalisation à joindre au mail admin
    const pdfAttachments: { filename: string; content: Buffer }[] = [];
    if (customizations.length > 0) {
      try {
        log("Génération PDF personnalisation pour", customizations.length, "produit(s)");
        const orderNumber = order.id.slice(0, 8).toUpperCase();
        const custName = order.customer_name || session.customer_details?.name || "Client";
        const custEmail = order.customer_email || session.customer_details?.email || "";

        // Récupérer les schemaImage depuis la DB
        const custSlugs = customizations.map(c => c.productSlug).filter(Boolean);
        const { data: custProducts } = custSlugs.length > 0
          ? await supabase.from("products").select("slug, customization").in("slug", custSlugs)
          : { data: [] };
        const schemaImages: Record<string, string> = {};
        for (const cp of custProducts || []) {
          if (cp.customization?.schemaImage) {
            schemaImages[cp.slug] = cp.customization.schemaImage;
          }
        }

        for (const cust of customizations) {
          const pdfBuffer = await generateCustomizationPDF({
            orderNumber,
            customerName: custName,
            customerEmail: custEmail,
            productName: cust.productName,
            productSlug: cust.productSlug,
            faces: cust.faces,
            schemaImage: schemaImages[cust.productSlug],
          });
          pdfAttachments.push({
            filename: `personnalisation-${orderNumber}-${cust.productSlug}.pdf`,
            content: pdfBuffer,
          });
          log("✅ PDF récap généré pour:", cust.productSlug);

          // Convertir chaque image client en PDF séparé (pour le fournisseur)
          for (const [faceNum, face] of Object.entries(cust.faces)) {
            if (face.type === 'image' && face.imageUrl) {
              const imagePdf = await convertImageToPDF(face.imageUrl);
              if (imagePdf) {
                pdfAttachments.push({
                  filename: `face-${faceNum}-${orderNumber}.pdf`,
                  content: imagePdf,
                });
                log(`✅ Image face ${faceNum} convertie en PDF`);
              }
            }
          }
        }
        result.customization_pdf_sent = true;
        steps.push("customization_pdf_generated");
      } catch (pdfErr) {
        const msg = pdfErr instanceof Error ? pdfErr.message : String(pdfErr);
        logError("Erreur PDF personnalisation (non bloquant):", msg);
        result.customization_pdf_error = msg;
      }
    }

    try {
      log("Envoi notification admin" + (pdfAttachments.length > 0 ? ` avec ${pdfAttachments.length} PDF` : ""));
      const adminResult = await sendAdminOrderNotification(emailData, supabase, order.id, pdfAttachments.length > 0 ? pdfAttachments : undefined);
      log("Résultat email admin:", JSON.stringify(adminResult));
      result.email_admin = adminResult;
    } catch (adminErr) {
      const msg = adminErr instanceof Error ? adminErr.message : String(adminErr);
      logError("Erreur email admin (non bloquant):", msg);
      result.email_admin_error = msg;
    }

    steps.push("emails_sent");
  } else {
    log("⚠️ Pas d'email client disponible");
    result.email_skipped = true;
  }

  // Vider le panier
  if (metadata.user_id && metadata.user_id !== "guest") {
    try {
      const { data: cart } = await supabase
        .from("cart")
        .select("id")
        .eq("user_id", metadata.user_id)
        .maybeSingle();

      if (cart) {
        await supabase.from("cart_items").delete().eq("cart_id", cart.id);
        log("Panier vidé pour:", metadata.user_id);
        steps.push("cart_cleared");
      }
    } catch (cartErr) {
      logError("Erreur vidage panier (non bloquant):", cartErr);
    }
  }

  result.success = true;
  return result;
}
