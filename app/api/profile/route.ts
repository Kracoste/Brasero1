import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { devError } from '@/lib/supabase/utils';
import { checkRateLimit, getClientIP, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

const ALLOWED_PROFILE_FIELDS = [
  'first_name',
  'last_name',
  'phone',
  'address',
  'postal_code',
  'city',
  'country',
] as const;

type ProfileUpdates = Partial<Record<(typeof ALLOWED_PROFILE_FIELDS)[number], string | null>>;

const MAX_PROFILE_FIELD_LENGTH = 256;

const sanitizeProfileUpdates = (input: unknown): ProfileUpdates => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }

  const payload = input as Record<string, unknown>;
  const updates: ProfileUpdates = {};

  for (const field of ALLOWED_PROFILE_FIELDS) {
    const value = payload[field];
    if (value === undefined) {
      continue;
    }
    if (value === null) {
      updates[field] = null;
      continue;
    }
    if (typeof value !== 'string') {
      continue;
    }
    updates[field] = value.trim().slice(0, MAX_PROFILE_FIELD_LENGTH);
  }

  return updates;
};

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    // Utiliser le client admin pour bypasser RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });
    }

    const { data: profile, error } = await adminClient
      .from('profiles')
      .select('id, email, first_name, last_name, phone, address, postal_code, city, country')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      devError('Erreur chargement profil:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json({ profile: profile || null });
  } catch (error) {
    devError('Erreur API profile:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    const updates = sanitizeProfileUpdates(await request.json());
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Aucune mise a jour valide' }, { status: 400 });
    }

    // Utiliser le client admin pour bypasser RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });
    }

    const { data, error } = await adminClient
      .from('profiles')
      .upsert({ 
        id: user.id, 
        email: user.email,
        updated_at: new Date().toISOString(),
        ...updates 
      })
      .select('id, email, first_name, last_name, phone, address, postal_code, city, country')
      .single();

    if (error) {
      devError('Erreur mise à jour profil:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    devError('Erreur API update profile:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
