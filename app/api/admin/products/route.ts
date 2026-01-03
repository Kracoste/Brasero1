import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';
import { sanitizeProductData, devError } from '@/lib/supabase/utils';
import { isValidUUID } from '@/lib/validation';

// Force dynamic pour éviter le cache en production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Récupérer un produit par ID ou tous les produits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

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

    // Si un ID est fourni, récupérer un seul produit
    if (productId) {
      // Valider que l'ID est un UUID valide
      if (!isValidUUID(productId)) {
        return NextResponse.json({ error: 'ID produit invalide' }, { status: 400 });
      }

      const { data: product, error } = await adminClient
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        devError('Erreur GET produit:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
      }

      // Retourner le produit avec un header no-cache
      return NextResponse.json(product, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
    }

    // Sinon, récupérer tous les produits
    const { data: products, error } = await adminClient
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      devError('Erreur liste produits:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json(products);
  } catch (error) {
    devError('Erreur GET product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT: Mettre à jour un produit
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId || !isValidUUID(productId)) {
      return NextResponse.json({ error: 'ID produit invalide' }, { status: 400 });
    }

    // Vérifier l'authentification admin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const rawData = await request.json();
    
    // Sanitize les données pour n'autoriser que les champs valides
    const productData = sanitizeProductData(rawData);

    // Utiliser le client admin pour bypass RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      devError('Admin client non disponible - SUPABASE_SERVICE_ROLE_KEY manquante?');
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }
    
    const { data: product, error } = await adminClient
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      devError('Erreur UPDATE produit:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    // Invalider le cache de la page produit pour forcer le rechargement des données
    if (product?.slug) {
      revalidatePath(`/produits/${product.slug}`, 'page');
      revalidatePath('/produits', 'page');
      revalidatePath('/', 'layout');
    }
    // Aussi invalider l'admin
    revalidatePath('/admin/produits', 'page');
    revalidatePath(`/admin/produits/${productId}`, 'page');

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    devError('Erreur PUT product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST: Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const rawData = await request.json();
    // Sanitize les données pour n'autoriser que les champs valides
    const productData = sanitizeProductData(rawData);

    // Utiliser le client admin pour bypass RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }
    const { data: product, error } = await adminClient
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(product);
  } catch (error) {
    devError('Erreur POST product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE: Supprimer un produit
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId || !isValidUUID(productId)) {
      return NextResponse.json({ error: 'ID produit invalide' }, { status: 400 });
    }

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
    const { error } = await adminClient
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      devError('Erreur DELETE produit:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    devError('Erreur DELETE product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
