import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// GET /api/coupons/active-products — retourne les coupons actifs applicables aux produits
// (exclut les coupons livraison). Public : sert à afficher le prix barré + bulle code.
export async function GET(_request: NextRequest) {
  const adminClient = getSupabaseAdminClient();
  if (!adminClient) return NextResponse.json([]);

  const { data } = await adminClient
    .from('coupons')
    .select('code, discount_type, discount_value, applicable_products, expires_at, max_uses, current_uses')
    .eq('is_active', true)
    .eq('show_on_products', true)
    .in('discount_type', ['percentage', 'fixed', 'free_shipping', 'shipping_discount', 'shipping_percent']);

  if (!data) return NextResponse.json([]);

  const now = new Date();
  const active = data
    .filter((c) => {
      if (c.expires_at && new Date(c.expires_at) < now) return false;
      if (c.max_uses && c.current_uses >= c.max_uses) return false;
      return true;
    })
    .map((c) => ({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: Number(c.discount_value),
      applicable_products: c.applicable_products,
    }));

  const response = NextResponse.json(active);
  response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return response;
}
