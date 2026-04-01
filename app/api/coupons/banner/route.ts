import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

// GET /api/coupons/banner — get the coupon displayed in the banner (public)
export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request.headers);
  if (!checkRateLimit(`banner-${clientIP}`, 20, 60000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json(null);
  }

  const { data, error } = await adminClient
    .from('coupons')
    .select('code, discount_type, discount_value')
    .eq('show_in_banner', true)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(null);
  }

  const label =
    data.discount_type === 'percentage'
      ? `Code ${data.code} : -${data.discount_value}% sur votre 1ère commande`
      : `Code ${data.code} : -${data.discount_value}€ sur votre 1ère commande`;

  const response = NextResponse.json({ code: data.code, label });
  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  return response;
}
