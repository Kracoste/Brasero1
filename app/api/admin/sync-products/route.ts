import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';
import { products as contentProducts } from '@/content/products';

export const dynamic = 'force-dynamic';

/**
 * API Route pour synchroniser les produits de content/products.ts vers Supabase
 * Usage: POST /api/admin/sync-products
 * Nécessite authentification admin
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }

    const results = {
      updated: 0,
      inserted: 0,
      errors: [] as string[],
      skipped: 0,
    };

    // Pré-charger tous les produits existants en une seule requête (éviter N+1)
    const { data: existingProducts } = await adminClient
      .from('products')
      .select('id, slug, specs');

    const existingBySlug = new Map(
      (existingProducts || []).map((p: { id: string; slug: string; specs: unknown }) => [p.slug, p])
    );

    // Synchroniser chaque produit
    for (const product of contentProducts) {
      try {
        // Vérifier si le produit existe déjà
        const existing = existingBySlug.get(product.slug) || null;

        // Préparer les specs avec compatibleAccessories
        const specs = {
          ...(product.specs || {}),
        };

        // Si le produit n'a pas de compatibleAccessories dans content/products.ts, skip
        const hasCompatibleAccessories = 
          product.specs && 
          'compatibleAccessories' in product.specs && 
          Array.isArray((product.specs as any).compatibleAccessories) &&
          (product.specs as any).compatibleAccessories.length > 0;

        if (!hasCompatibleAccessories) {
          results.skipped++;
          continue;
        }

        if (existing) {
          // Mettre à jour le produit existant avec les nouvelles specs
          const { error: updateError } = await adminClient
            .from('products')
            .update({
              specs,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (updateError) {
            results.errors.push(`Erreur update ${product.slug}: ${updateError.message}`);
          } else {
            results.updated++;
          }
        } else {
          // Insérer un nouveau produit
          const { error: insertError } = await adminClient
            .from('products')
            .insert({
              slug: product.slug,
              name: product.name,
              category: product.category,
              price: product.price,
              short_description: product.shortDescription,
              description: product.description,
              badge: product.badge,
              images: product.images,
              material: product.material,
              diameter: product.diameter,
              length: product.length,
              width: product.width,
              thickness: product.thickness,
              height: product.height,
              weight: product.weight,
              warranty: product.warranty,
              availability: product.availability,
              shipping: product.shipping,
              popular_score: product.popularScore,
              specs,
              highlights: product.highlights,
              features: product.features,
              faq: product.faq,
              custom_specs: product.customSpecs,
              location: product.location,
            });

          if (insertError) {
            results.errors.push(`Erreur insert ${product.slug}: ${insertError.message}`);
          } else {
            results.inserted++;
          }
        }
      } catch (err) {
        results.errors.push(`Exception ${product.slug}: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Synchronisation terminée',
      results,
    });

  } catch (error) {
    console.error('Erreur sync-products:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
