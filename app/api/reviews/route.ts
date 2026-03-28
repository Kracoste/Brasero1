import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET - Récupérer les avis approuvés d'un produit par slug
 */
export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request.headers);
    if (!checkRateLimit(`reviews-get-${clientIP}`, 60, 60000)) {
      return NextResponse.json(
        { error: 'Trop de requêtes' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Le paramètre slug est requis' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('id, product_slug, author_name, rating, comment, created_at')
      .eq('product_slug', slug)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Reviews API GET] Error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des avis' },
        { status: 500 }
      );
    }

    const count = reviews?.length || 0;
    const average =
      count > 0
        ? Math.round(
            (reviews!.reduce((sum, r) => sum + r.rating, 0) / count) * 10
          ) / 10
        : 0;

    return NextResponse.json({
      reviews: reviews || [],
      average,
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
 * POST - Soumettre un nouvel avis (modération requise)
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting : max 3 soumissions par heure par IP
    const clientIP = getClientIP(request.headers);
    if (!checkRateLimit(`review-submit-${clientIP}`, 3, 3600000)) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { product_slug, author_name, rating, comment, email } = body;

    // Validation
    if (!product_slug || typeof product_slug !== 'string') {
      return NextResponse.json(
        { error: 'Le slug du produit est requis' },
        { status: 400 }
      );
    }

    if (!author_name || typeof author_name !== 'string' || author_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Un nom valide est requis (minimum 2 caractères)' },
        { status: 400 }
      );
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La note doit être comprise entre 1 et 5' },
        { status: 400 }
      );
    }

    if (email && (typeof email !== 'string' || !email.includes('@'))) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        product_slug: product_slug.trim(),
        author_name: author_name.trim().slice(0, 100),
        rating: Math.round(rating),
        comment: comment ? String(comment).trim().slice(0, 2000) : null,
        email: email ? email.toLowerCase().trim() : null,
        is_approved: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Reviews API POST] Insert error:', insertError);
      return NextResponse.json(
        { error: 'Erreur lors de la soumission de l\'avis' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Merci ! Votre avis sera publié après validation.',
      review,
    });
  } catch (error) {
    console.error('[Reviews API POST] Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
