import { NextRequest, NextResponse } from 'next/server';
import { stripe, hasStripeCredentials } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

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

const parseQuantity = (value: unknown) => {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return null;
  const intValue = Math.floor(numeric);
  if (intValue < 1 || intValue > 99) return null;
  return intValue;
};

export async function POST(request: NextRequest) {
  try {
    if (!hasStripeCredentials() || !stripe) {
      return NextResponse.json(
        { error: 'Le paiement n\'est pas configuré. Veuillez contacter l\'administrateur.' },
        { status: 503 }
      );
    }

    const body: CheckoutBody = await request.json();
    const { items, customerInfo, deliveryMessage } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      );
    }

    const normalizedItems = items
      .map((item) => ({
        slug: typeof item.product_slug === 'string' ? item.product_slug.trim() : '',
        quantity: parseQuantity(item.quantity),
      }))
      .filter((item) => item.slug && item.quantity);

    if (normalizedItems.length !== items.length) {
      return NextResponse.json(
        { error: 'Articles invalides' },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur connecté (optionnel)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Déterminer l'URL de base
    const origin = request.headers.get('origin') || 'https://atelier-lbf.fr';

    const productSlugs = Array.from(new Set(normalizedItems.map((item) => item.slug)));
    const productClient = getSupabaseAdminClient() ?? supabase;
    const { data: products, error: productsError } = await productClient
      .from('products')
      .select('slug, name, price, images')
      .in('slug', productSlugs);

    if (productsError) {
      return NextResponse.json(
        { error: 'Erreur chargement produits' },
        { status: 500 }
      );
    }

    const productsBySlug = new Map(
      (products || []).map((product: any) => [product.slug, product])
    );

    const missingSlugs = productSlugs.filter((slug) => !productsBySlug.has(slug));
    if (missingSlugs.length > 0) {
      return NextResponse.json(
        { error: 'Produit introuvable', details: missingSlugs },
        { status: 400 }
      );
    }

    // Fonction pour convertir les URLs relatives en URLs absolues
    const getAbsoluteImageUrl = (imageUrl: string | null): string[] => {
      if (!imageUrl) return [];
      // Si l'URL est déjà absolue, la retourner telle quelle
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return [imageUrl];
      }
      // Sinon, construire l'URL absolue
      return [`${origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`];
    };

    // Créer les line items pour Stripe avec les prix venant de la base
    const lineItems = [];
    for (const item of normalizedItems) {
      const product = productsBySlug.get(item.slug);
      const price = Number(product?.price ?? 0);

      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          { error: `Prix invalide pour ${item.slug}` },
          { status: 400 }
        );
      }

      const images = Array.isArray(product?.images) ? product.images : [];
      const firstImage =
        typeof images[0] === 'string'
          ? images[0]
          : images[0]?.src ?? null;

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product?.name || 'Produit',
            images: getAbsoluteImageUrl(firstImage),
            metadata: {
              slug: item.slug,
            },
          },
          unit_amount: Math.round(price * 100), // Stripe utilise les centimes
        },
        quantity: item.quantity as number,
      });
    }

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
