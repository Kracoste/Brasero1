import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

// GET /api/coupons/banner — get the coupon displayed in the banner (public)
export async function GET() {
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

  return NextResponse.json({ code: data.code, label });
}
