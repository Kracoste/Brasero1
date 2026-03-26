import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  return null;
}

// GET /api/admin/coupons — list all coupons
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }

  const { data, error } = await adminClient
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur liste coupons:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/admin/coupons — create a coupon
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }

  const body = await request.json();

  const payload = sanitizeCouponData(body);
  if (!payload) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
  }

  const { data, error } = await adminClient
    .from('coupons')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('Erreur création coupon:', error);
    if (error.message?.includes('unique') || error.code === '23505') {
      return NextResponse.json({ error: 'Ce code promo existe déjà' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/admin/coupons — update a coupon
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }

  const body = await request.json();
  const { id, ...rest } = body;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const payload = sanitizeCouponData(rest);
  if (!payload) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
  }

  const { data, error } = await adminClient
    .from('coupons')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur mise à jour coupon:', error);
    if (error.message?.includes('unique') || error.code === '23505') {
      return NextResponse.json({ error: 'Ce code promo existe déjà' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE /api/admin/coupons — delete a coupon
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const { error } = await adminClient
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur suppression coupon:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

function sanitizeCouponData(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

  const input = data as Record<string, unknown>;
  const sanitized: Record<string, unknown> = {};

  // code
  if (typeof input.code === 'string' && input.code.trim()) {
    sanitized.code = input.code.toUpperCase().trim().slice(0, 50);
  }

  // discount_type
  if (input.discount_type === 'percentage' || input.discount_type === 'fixed') {
    sanitized.discount_type = input.discount_type;
  }

  // discount_value
  if (typeof input.discount_value === 'number' && input.discount_value > 0 && input.discount_value <= 100000) {
    sanitized.discount_value = input.discount_value;
  }

  // min_purchase_amount
  if (input.min_purchase_amount === null || input.min_purchase_amount === undefined) {
    sanitized.min_purchase_amount = null;
  } else if (typeof input.min_purchase_amount === 'number' && input.min_purchase_amount >= 0) {
    sanitized.min_purchase_amount = input.min_purchase_amount;
  }

  // max_uses (global)
  if (input.max_uses === null || input.max_uses === undefined) {
    sanitized.max_uses = null;
  } else if (typeof input.max_uses === 'number' && Number.isInteger(input.max_uses) && input.max_uses >= 0) {
    sanitized.max_uses = input.max_uses;
  }

  // max_uses_per_user
  if (input.max_uses_per_user === null || input.max_uses_per_user === undefined) {
    sanitized.max_uses_per_user = null;
  } else if (typeof input.max_uses_per_user === 'number' && Number.isInteger(input.max_uses_per_user) && input.max_uses_per_user >= 1) {
    sanitized.max_uses_per_user = input.max_uses_per_user;
  }

  // expires_at
  if (input.expires_at === null || input.expires_at === undefined) {
    sanitized.expires_at = null;
  } else if (typeof input.expires_at === 'string') {
    const date = new Date(input.expires_at);
    if (!isNaN(date.getTime())) {
      sanitized.expires_at = date.toISOString();
    }
  }

  // is_active
  if (typeof input.is_active === 'boolean') {
    sanitized.is_active = input.is_active;
  }

  // applicable_products
  if (input.applicable_products === null || input.applicable_products === undefined) {
    sanitized.applicable_products = null;
  } else if (Array.isArray(input.applicable_products)) {
    const slugs = input.applicable_products
      .filter((v): v is string => typeof v === 'string')
      .map(v => v.trim().slice(0, 200))
      .slice(0, 50);
    sanitized.applicable_products = slugs.length > 0 ? slugs : null;
  }

  return sanitized;
}
