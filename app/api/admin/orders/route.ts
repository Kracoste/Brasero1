import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';
import { VALID_ORDER_STATUSES, devError } from '@/lib/supabase/utils';

// GET: Récupérer les commandes
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Utiliser le client admin pour bypass RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }

    const { data: orders, error } = await adminClient
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    devError('Erreur GET orders:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT: Mettre à jour le statut d'une commande
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ error: 'ID commande requis' }, { status: 400 });
    }

    // Vérifier l'authentification admin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { status } = await request.json();

    // Valider le statut
    if (!status || !VALID_ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    // Utiliser le client admin pour bypass RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }

    const { data: order, error } = await adminClient
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(order);
  } catch (error) {
    devError('Erreur PUT order:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
