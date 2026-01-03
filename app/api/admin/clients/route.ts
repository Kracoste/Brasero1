import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';
import { VALID_USER_ROLES, devError } from '@/lib/supabase/utils';
import { isValidUUID } from '@/lib/validation';

export async function GET() {
  try {
    // Vérifier que l'utilisateur est admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Utiliser le client admin pour bypasser RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });
    }

    const { data, error } = await adminClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      devError('Erreur chargement clients:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json({ clients: data || [] });
  } catch (error) {
    devError('Erreur API clients:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Vérifier que l'utilisateur est admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { clientId, role } = await request.json();

    // Valider le rôle
    if (!role || !VALID_USER_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
    }

    if (!clientId || !isValidUUID(clientId)) {
      return NextResponse.json({ error: 'ID client invalide' }, { status: 400 });
    }

    // Utiliser le client admin pour bypasser RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });
    }

    const { error } = await adminClient
      .from('profiles')
      .update({ role })
      .eq('id', clientId);

    if (error) {
      devError('Erreur mise à jour rôle:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    devError('Erreur API update role:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Vérifier que l'utilisateur est admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId || !isValidUUID(clientId)) {
      return NextResponse.json({ error: 'ID client invalide' }, { status: 400 });
    }

    // Utiliser le client admin pour bypasser RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });
    }

    // Supprimer les favoris d'abord
    await adminClient.from('favorites').delete().eq('user_id', clientId);

    // Supprimer le profil
    const { error } = await adminClient
      .from('profiles')
      .delete()
      .eq('id', clientId);

    if (error) {
      devError('Erreur suppression client:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    devError('Erreur API delete client:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
