import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { devError } from '@/lib/supabase/utils';

const MAX = 200;

type AddressInput = {
  label?: string | null;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  address?: string;
  address_line2?: string | null;
  postal_code?: string;
  city?: string;
  country?: string;
  is_default?: boolean;
};

const sanitize = (input: unknown): AddressInput => {
  if (!input || typeof input !== 'object') return {};
  const i = input as Record<string, unknown>;
  const str = (v: unknown) => typeof v === 'string' ? v.trim().slice(0, MAX) : undefined;
  return {
    label: str(i.label) ?? null,
    first_name: str(i.first_name),
    last_name: str(i.last_name),
    phone: str(i.phone) ?? null,
    address: str(i.address),
    address_line2: str(i.address_line2) ?? null,
    postal_code: str(i.postal_code),
    city: str(i.city),
    country: str(i.country) || 'France',
    is_default: i.is_default === true,
  };
};

const requireFields = (a: AddressInput) => {
  return !!(a.first_name && a.last_name && a.address && a.postal_code && a.city && a.country);
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });

  const { data, error } = await admin
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    devError('addresses GET:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json({ addresses: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  const body = sanitize(await request.json());
  if (!requireFields(body)) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });

  // Si c'est la première adresse, forcer is_default
  const { count } = await admin
    .from('user_addresses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);
  const makeDefault = body.is_default || count === 0;

  if (makeDefault) {
    await admin.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
  }

  const { data, error } = await admin
    .from('user_addresses')
    .insert({ ...body, user_id: user.id, is_default: makeDefault })
    .select()
    .single();

  if (error) {
    devError('addresses POST:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json({ address: data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  const payload = await request.json();
  const id = typeof payload?.id === 'string' ? payload.id : null;
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const body = sanitize(payload);

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });

  if (body.is_default) {
    await admin.from('user_addresses').update({ is_default: false }).eq('user_id', user.id);
  }

  const { data, error } = await admin
    .from('user_addresses')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    devError('addresses PATCH:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json({ address: data });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });

  const { data: deleted } = await admin
    .from('user_addresses')
    .select('is_default')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  const { error } = await admin
    .from('user_addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    devError('addresses DELETE:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }

  // Si on a supprimé la défaut, en promouvoir une autre
  if (deleted?.is_default) {
    const { data: next } = await admin
      .from('user_addresses')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (next?.id) {
      await admin.from('user_addresses').update({ is_default: true }).eq('id', next.id);
    }
  }

  return NextResponse.json({ ok: true });
}
