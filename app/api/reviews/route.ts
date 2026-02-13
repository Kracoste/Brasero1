import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { isValidUUID, sanitizeString } from '@/lib/validation';

export const dynamic = 'force-dynamic';

/**
 * GET - Récupérer les avis d'un produit
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const slug = searchParams.get('slug');

    if (!productId && !slug) {
      return NextResponse.json(
        { error: 'product_id ou slug requis' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Si slug fourni, récupérer le product_id
    let finalProductId = productId;
    if (slug && !productId) {
      const { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!product) {
        return NextResponse.json({ reviews: [], average: 0, count: 0 });
      }

      finalProductId = product.id;
    }

    if (finalProductId && !isValidUUID(finalProductId)) {
      return NextResponse.json(
        { error: 'ID produit invalide' },
        { status: 400 }
      );
    }

    // Récupérer les avis approuvés
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, rating, title, comment, is_verified_purchase, created_at, user_id')
      .eq('product_id', finalProductId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Erreur récupération avis' },
        { status: 500 }
      );
    }

    // Calculer moyenne et nombre
    const count = reviews?.length || 0;
    const average = count > 0
      ? reviews!.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;

    return NextResponse.json({
      reviews: reviews || [],
      average: Math.round(average * 10) / 10,
      count,
    });
  } catch (error) {
    console.error('[Reviews API GET] Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * POST - Soumettre un avis
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    if (!checkRateLimit(`review-submit-${clientIP}`, 5, 60000)) {
      return NextResponse.json(
        { error: 'Trop de tentatives' },
        { status: 429 }
      );
    }

    const supabase = await createClient();

    // Vérifier authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { product_id, rating, title, comment, order_id } = body;

    // Validation
    if (!product_id || !isValidUUID(product_id)) {
      return NextResponse.json(
        { error: 'ID produit invalide' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Note invalide (1-5)' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur n'a pas déjà laissé un avis
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { error: 'Service non disponible' },
        { status: 500 }
      );
    }

    const { data: existing } = await adminClient
      .from('reviews')
      .select('id')
      .eq('product_id', product_id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Vous avez déjà laissé un avis pour ce produit' },
        { status: 400 }
      );
    }

    // Vérifier si c'est un achat vérifié
    let isVerifiedPurchase = false;
    if (order_id) {
      const { data: order } = await adminClient
        .from('orders')
        .select('id')
        .eq('id', order_id)
        .eq('user_id', user.id)
        .single();

      isVerifiedPurchase = !!order;
    }

    // Sanitizer les entrées texte
    const safeTitle = sanitizeString(title, 200) || null;
    const safeComment = sanitizeString(comment, 2000) || null;

    // Créer l'avis (nécessite approbation admin)
    const { data: review, error: insertError } = await adminClient
      .from('reviews')
      .insert({
        product_id,
        user_id: user.id,
        order_id: order_id || null,
        rating,
        title: safeTitle,
        comment: safeComment,
        is_verified_purchase: isVerifiedPurchase,
        is_approved: false, // Modération requise
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Reviews API POST] Insert error:', insertError);
      return NextResponse.json(
        { error: 'Erreur création avis' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review,
      message: 'Avis soumis avec succès. Il sera publié après modération.',
    });
  } catch (error) {
    console.error('[Reviews API POST] Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
