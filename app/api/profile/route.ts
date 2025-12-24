import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

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
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erreur chargement profil:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: profile || null });
  } catch (error) {
    console.error('Erreur API profile:', error);
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

    const updates = await request.json();

    // Utiliser le client admin pour bypasser RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });
    }

    const { data, error } = await adminClient
      .from('profiles')
      .upsert({ id: user.id, ...updates })
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour profil:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('Erreur API update profile:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
