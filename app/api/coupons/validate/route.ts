import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * POST - Valider un code promo
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request.headers);
    if (!checkRateLimit(`coupon-validate-${clientIP}`, 3, 60000)) {
      return NextResponse.json(
        { error: 'Trop de tentatives' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { code, cartTotal } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code requis' },
        { status: 400 }
      );
    }

    // Validation du cartTotal
    const total = Number(cartTotal);
    if (!Number.isFinite(total) || total < 0 || total > 1000000) {
      return NextResponse.json(
        { error: 'Montant du panier invalide' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Récupérer le coupon
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('id, code, discount_type, discount_value, min_purchase_amount, max_uses, current_uses, expires_at, is_active')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json(
        { valid: false, error: 'Code invalide' },
        { status: 200 }
      );
    }

    // Vérifier l'expiration
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Code expiré' },
        { status: 200 }
      );
    }

    // Vérifier les utilisations
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      return NextResponse.json(
        { valid: false, error: 'Code épuisé' },
        { status: 200 }
      );
    }

    // Vérifier le montant minimum
    if (coupon.min_purchase_amount && total < coupon.min_purchase_amount) {
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum d'achat: ${coupon.min_purchase_amount} €`,
        },
        { status: 200 }
      );
    }

    // Calculer la réduction
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (total * coupon.discount_value) / 100;
    } else {
      discount = coupon.discount_value;
    }

    // Ne pas dépasser le total
    discount = Math.min(discount, total);

    return NextResponse.json({
      valid: true,
      discount,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      newTotal: total - discount,
    });
  } catch (error) {
    console.error('[Coupon API] Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
