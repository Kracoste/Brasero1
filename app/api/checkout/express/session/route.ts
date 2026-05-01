import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, hasStripeCredentials } from '@/lib/stripe';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

type SessionBody = {
  productSlug: string;
  variantLabel?: string;
  quantity?: number;
  paymentMethod: 'klarna';
};

const SHIPPING_COST_CENTS = 8000;

/**
 * Crée une Session Stripe Checkout pour Klarna (redirection vers la page Klarna).
 */
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const clientIP = getClientIP(headersList);
    const { maxRequests, windowMs } = RATE_LIMIT_PRESETS.sensitive;

    if (!checkRateLimit(`express-session-${clientIP}`, maxRequests, windowMs)) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' },
        { status: 429 }
      );
    }

    if (!hasStripeCredentials() || !stripe) {
      return NextResponse.json({ error: 'Le paiement n\'est pas configuré.' }, { status: 503 });
    }

    const body: SessionBody = await request.json();
    const { productSlug, variantLabel, paymentMethod } = body;
    const quantity = Math.max(1, Math.min(99, Math.floor(body.quantity ?? 1)));

    if (!productSlug || typeof productSlug !== 'string') {
      return NextResponse.json({ error: 'Produit invalide' }, { status: 400 });
    }
    if (paymentMethod !== 'klarna') {
      return NextResponse.json({ error: 'Méthode invalide' }, { status: 400 });
    }

    const supabase = await createClient();
    const productClient = getSupabaseAdminClient() ?? supabase;

    const { data: product, error } = await productClient
      .from('products')
      .select('slug, name, price, images, variants')
      .eq('slug', productSlug)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
    }

    let price = Number(product.price);
    let itemName = product.name as string;

    if (variantLabel && Array.isArray(product.variants)) {
      const variant = (product.variants as Array<{ label: string; price: number }>).find(
        (v) => v.label === variantLabel,
      );
      if (variant && typeof variant.price === 'number' && variant.price > 0) {
        price = variant.price;
        itemName = `${itemName} — ${variantLabel}`;
      }
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: 'Prix invalide' }, { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.atelier-lbf.fr';
    const images = Array.isArray(product.images) ? product.images : [];
    const firstImage =
      typeof images[0] === 'string' ? images[0] : (images[0] as { src?: string })?.src ?? null;
    const absoluteImage = firstImage
      ? firstImage.startsWith('http')
        ? firstImage
        : `${origin}${firstImage.startsWith('/') ? '' : '/'}${firstImage}`
      : null;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['klarna'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: itemName,
              images: absoluteImage ? [absoluteImage] : [],
              metadata: { slug: productSlug, ...(variantLabel ? { variant: variantLabel } : {}) },
            },
            unit_amount: Math.round(price * 100),
          },
          quantity,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Livraison — Transport Schenker', images: [], metadata: {} },
            unit_amount: SHIPPING_COST_CENTS,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/commande/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/produits/${productSlug}`,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'DE', 'LU', 'CH'],
      },
      phone_number_collection: { enabled: true },
      locale: 'fr',
      metadata: {
        express: 'true',
        product_slug: productSlug,
        ...(variantLabel ? { variant: variantLabel } : {}),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Erreur express session:', err);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
