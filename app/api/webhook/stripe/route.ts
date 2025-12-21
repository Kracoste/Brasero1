import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, hasStripeCredentials } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Petit ping pour éviter les 500 quand tu testes dans le navigateur / curl
 */
export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest) {
  if (!hasStripeCredentials() || !stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret) {
    console.error("❌ Missing STRIPE_WEBHOOK_SECRET in env");
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  if (!signature) {
    console.error("❌ Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  // IMPORTANT: raw body
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ Paiement réussi:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("❌ Paiement échoué:", paymentIntent.id);
        break;
      }

      default:
        console.log(`ℹ️ Événement non géré: ${event.type}`);
    }
  } catch (err) {
    console.error("❌ Error handling webhook event:", err);
    // On répond 200 quand même dans certains cas pour éviter retries infinis,
    // mais en dev on peut renvoyer 500 pour voir l’erreur.
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    console.error("❌ Supabase admin client non configuré");
    return;
  }

  const metadata = session.metadata || {};

  try {
    // Récupérer les détails de la session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    // Préparer les articles de la commande
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

    // Créer la commande dans Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: metadata.user_id && metadata.user_id !== "guest" ? metadata.user_id : null,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        status: "confirmed",
        total_amount: (session.amount_total || 0) / 100,
        currency: session.currency || "eur",
        customer_email: session.customer_email || session.customer_details?.email,
        customer_name: metadata.customer_name || session.customer_details?.name,
        customer_phone: metadata.customer_phone || session.customer_details?.phone,

        // ⚠️ Ces champs dépendent de ton schéma Supabase
        shipping_address: metadata.shipping_address,
        shipping_address_line2: metadata.shipping_address_line2,
        shipping_postal_code: metadata.shipping_postal_code,
        shipping_city: metadata.shipping_city,
        shipping_country: metadata.shipping_country,
        delivery_message: metadata.delivery_message,

        items: orderItems,
      })
      .select()
      .single();

    if (orderError) {
      console.error("❌ Erreur création commande:", orderError);
      return;
    }

    console.log("✅ Commande créée:", order.id);

    // Vider le panier de l'utilisateur s'il est connecté
    if (metadata.user_id && metadata.user_id !== "guest") {
      const { data: cart } = await supabase
        .from("cart")
        .select("id")
        .eq("user_id", metadata.user_id)
        .single();

      if (cart) {
        await supabase.from("cart_items").delete().eq("cart_id", cart.id);
        console.log("✅ Panier vidé pour utilisateur:", metadata.user_id);
      }
    }
  } catch (error) {
    console.error("❌ Erreur traitement webhook:", error);
  }
}