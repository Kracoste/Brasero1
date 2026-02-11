import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, hasStripeCredentials } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from "@/lib/email";

export const runtime = "nodejs";

function log(...args: unknown[]) {
  console.log("[WEBHOOK]", ...args);
}
function logError(...args: unknown[]) {
  console.error("[WEBHOOK ERROR]", ...args);
}

/**
 * GET → diagnostic / replay manuel
 * Usage: /api/webhook/stripe?action=replay-last
 */
export async function GET(request: NextRequest) {
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

  // Préparer les articles
  const orderItems = lineItems.data.map((item) => {
    const product = item.price?.product as Stripe.Product | string | null;
    const slug =
      product && typeof product !== "string"
        ? product.metadata?.slug || ""
        : "";
    const qty = item.quantity || 1;
    const amountTotal = item.amount_total || 0;

    return {
      product_name: item.description || "Produit",
      product_slug: slug,
      quantity: qty,
      unit_price: qty ? amountTotal / qty / 100 : amountTotal / 100,
      total_price: amountTotal / 100,
    };
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
    const emailData = {
      orderNumber: order.id.slice(0, 8).toUpperCase(),
      customerName: order.customer_name || session.customer_details?.name || "Client",
      customerEmail,
      totalAmount: order.total_amount,
      items: orderItems.map((item) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price,
      })),
      shippingAddress: [
        metadata.shipping_address,
        metadata.shipping_address_line2,
        ((metadata.shipping_postal_code || "") + " " + (metadata.shipping_city || "")).trim(),
        metadata.shipping_country,
      ]
        .filter(Boolean)
        .join(", "),
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

    try {
      log("Envoi notification admin");
      const adminResult = await sendAdminOrderNotification(emailData, supabase, order.id);
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
