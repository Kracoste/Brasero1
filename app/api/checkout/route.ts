import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe, hasStripeCredentials } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIP, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';
import { isValidEmail } from '@/lib/validation';


type CartItem = {
  product_slug: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  variant_label?: string;
  customization?: Record<number, { type: 'image' | 'text'; imageUrl?: string; fileName?: string; text?: string; font?: string }>;
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
  paymentMethod?: 'card' | 'klarna';
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
    // ============================================
    // SÉCURITÉ : Rate Limiting
    // ============================================
    const headersList = await headers();
    const clientIP = getClientIP(headersList);
    const { maxRequests, windowMs } = RATE_LIMIT_PRESETS.sensitive;
    
    if (!checkRateLimit(`checkout-${clientIP}`, maxRequests, windowMs)) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.' },
        { status: 429 }
      );
    }

    if (!hasStripeCredentials() || !stripe) {
      return NextResponse.json(
        { error: 'Le paiement n\'est pas configuré. Veuillez contacter l\'administrateur.' },
        { status: 503 }
      );
    }

    const body: CheckoutBody = await request.json();
    const { items, customerInfo, deliveryMessage, paymentMethod } = body;

    // ============================================
    // SÉCURITÉ : Validation des entrées
    // ============================================
    if (!customerInfo?.email || !isValidEmail(customerInfo.email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      );
    }

    const normalizedItems = items
      .map((item) => ({
        slug: typeof item.product_slug === 'string' ? item.product_slug.trim() : '',
        clientPrice: typeof item.product_price === 'number' ? item.product_price : 0,
        variantLabel: typeof item.variant_label === 'string' ? item.variant_label.trim() : undefined,
        customization: item.customization || undefined,
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
    const origin = request.headers.get('origin') || 'https://www.atelier-lbf.fr';

    const productSlugs = Array.from(new Set(normalizedItems.map((item) => item.slug)));
    const productClient = getSupabaseAdminClient() ?? supabase;
    const { data: products, error: productsError } = await productClient
      .from('products')
      .select('slug, name, price, images, variants, customization')
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
        { error: 'Un ou plusieurs produits sont introuvables' },
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

      // Résoudre le prix : si variante, chercher dans le tableau variants
      let price = Number(product?.price ?? 0);
      let itemName = product?.name || 'Produit';

      // Déterminer si le produit a une personnalisation
      const hasCustomization = !!item.customization && Object.keys(item.customization).length > 0;
      // Label variant pur (sans "Découpe laser personnalisée")
      const pureVariantLabel = item.variantLabel?.replace(/\s*—?\s*Découpe laser personnalisée/, '').trim() || undefined;

      if (pureVariantLabel && Array.isArray(product?.variants)) {
        const variant = product.variants.find((v: any) => v.label === pureVariantLabel);
        if (variant && typeof variant.price === 'number' && variant.price > 0) {
          price = variant.price;
        }
      }

      // Ajouter le supplément de personnalisation (vérifié côté serveur)
      if (hasCustomization && product?.customization?.enabled && typeof product.customization.priceSupplement === 'number') {
        price += product.customization.priceSupplement;
      }

      if (item.variantLabel) {
        itemName = `${itemName} — ${item.variantLabel}`;
      }

      // Détecter les tentatives de manipulation de prix
      if (item.clientPrice > 0 && Math.abs(price - item.clientPrice) > 1) {
        console.warn(`[CHECKOUT SECURITY] Prix divergent pour ${item.slug}: serveur=${price}, client=${item.clientPrice}`);
      }

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

      const productMetadata: Record<string, string> = { slug: item.slug };
      if (item.variantLabel) {
        productMetadata.variant = item.variantLabel;
      }
      if (hasCustomization && item.customization) {
        // Les metadata Stripe sont limitées à 500 chars par valeur
        // On stocke la customization dans les metadata de la session plutôt que du produit
        const customizationStr = JSON.stringify(item.customization);
        if (customizationStr.length <= 500) {
          productMetadata.customization = customizationStr;
        } else {
          productMetadata.has_customization = 'true';
        }
      }

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: itemName,
            images: getAbsoluteImageUrl(firstImage),
            metadata: productMetadata,
          },
          unit_amount: Math.round(price * 100), // Stripe utilise les centimes
        },
        quantity: item.quantity as number,
      });
    }

    // Créer la session de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethod === 'klarna' ? ['klarna'] : ['card', 'link'],
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
        user_id: user?.id || `guest_${crypto.randomUUID()}`,
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

    // Sauvegarder les customizations en DB (les metadata Stripe sont trop petites)
    const customizationItems = normalizedItems
      .filter(item => item.customization && Object.keys(item.customization).length > 0)
      .map(item => ({ slug: item.slug, faces: item.customization }));

    if (customizationItems.length > 0) {
      const adminClient = getSupabaseAdminClient();
      if (adminClient) {
        await adminClient.from('pending_customizations').insert({
          stripe_session_id: session.id,
          data: customizationItems,
        });
      }
    }

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Erreur checkout Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
