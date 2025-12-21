import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

type CartItem = {
  product_slug: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
};

type CheckoutBody = {
  items: CartItem[];
  customerInfo: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    address: string;
    address_line2?: string;
    postal_code: string;
    city: string;
    country: string;
  };
  deliveryMessage?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json();
    const { items, customerInfo, deliveryMessage } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur connecté (optionnel)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Créer les line items pour Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product_name,
          images: item.product_image ? [item.product_image] : [],
          metadata: {
            slug: item.product_slug,
          },
        },
        unit_amount: Math.round(item.product_price * 100), // Stripe utilise les centimes
      },
      quantity: item.quantity,
    }));

    // Déterminer l'URL de base
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Créer la session de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/commande/annulee`,
      customer_email: customerInfo.email,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'DE', 'LU', 'CH'],
      },
      metadata: {
        user_id: user?.id || 'guest',
        customer_name: `${customerInfo.first_name} ${customerInfo.last_name}`,
        customer_phone: customerInfo.phone || '',
        shipping_address: customerInfo.address,
        shipping_address_line2: customerInfo.address_line2 || '',
        shipping_postal_code: customerInfo.postal_code,
        shipping_city: customerInfo.city,
        shipping_country: customerInfo.country,
        delivery_message: deliveryMessage || '',
      },
      locale: 'fr',
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Erreur checkout Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
