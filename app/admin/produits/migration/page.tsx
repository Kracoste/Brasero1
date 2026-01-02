'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { products } from '@/content/products';
import { ArrowLeft, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

type MigrationStatus = {
  slug: string;
  name: string;
  status: 'pending' | 'success' | 'error' | 'skipped';
  message?: string;
};

export default function MigrateProductsPage() {
  const [migrating, setMigrating] = useState(false);
  const [statuses, setStatuses] = useState<MigrationStatus[]>([]);
  const [completed, setCompleted] = useState(false);
  const supabase = createClient();

  const migrateProducts = async () => {
    setMigrating(true);
    setCompleted(false);
    
    // Initialiser les statuts
    const initialStatuses: MigrationStatus[] = products.map(p => ({
      slug: p.slug,
      name: p.name,
      status: 'pending',
    }));
    setStatuses(initialStatuses);

    // Récupérer les produits existants dans Supabase
    const { data: existingProducts } = await supabase
      .from('products')
      .select('slug');
    
    const existingSlugs = new Set((existingProducts || []).map((p: { slug: string }) => p.slug));

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Vérifier si le produit existe déjà
      if (existingSlugs.has(product.slug)) {
        setStatuses(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'skipped', message: 'Déjà existant' } : s
        ));
        continue;
      }

      try {
        // Préparer les données du produit pour Supabase avec TOUTES les colonnes
        const productData = {
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: product.price,
          comparePrice: product.comparePrice || null,
          discountPercent: product.discountPercent || null,
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          madeIn: product.madeIn || 'France',
          material: product.material || '',
          diameter: product.diameter || null,
          thickness: product.thickness || null,
          height: product.height || null,
          length: null,
          width: null,
          bowlThickness: null,
          baseThickness: null,
          weight: product.weight || null,
          warranty: product.warranty || '',
          availability: product.availability || 'En stock',
          shipping: product.shipping || '',
          popularScore: product.popularScore || 50,
          badge: product.badge || null,
          inStock: product.availability !== 'Rupture de stock',
          specs: product.specs || {},
          highlights: product.highlights || [],
          features: product.features || [],
          images: product.images?.map(img => ({
            src: img.src,
            alt: img.alt,
            width: img.width,
            height: img.height,
          })) || [],
          cardImage: product.images?.[0]?.src || '',
          location: product.location || null,
          faq: product.faq || [],
          customSpecs: product.customSpecs || [],
        };

        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) {
          setStatuses(prev => prev.map((s, idx) => 
            idx === i ? { ...s, status: 'error', message: error.message } : s
          ));
        } else {
          setStatuses(prev => prev.map((s, idx) => 
            idx === i ? { ...s, status: 'success', message: 'Migré avec succès' } : s
          ));
        }
      } catch (error: any) {
        setStatuses(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'error', message: error.message } : s
        ));
      }

      // Petite pause pour ne pas surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setMigrating(false);
    setCompleted(true);
  };

  const successCount = statuses.filter(s => s.status === 'success').length;
  const errorCount = statuses.filter(s => s.status === 'error').length;
  const skippedCount = statuses.filter(s => s.status === 'skipped').length;

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/admin/produits"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft size={20} />
        Retour aux produits
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Migration des produits</h1>
        <p className="text-slate-600 mt-1">
          Importer les {products.length} produits du fichier local vers Supabase
        </p>
      </div>

      {/* Bouton de migration */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Lancer la migration</h2>
            <p className="text-slate-600 text-sm mt-1">
              Cette action va copier tous les produits de <code className="bg-slate-100 px-1 rounded">content/products.ts</code> vers Supabase.
              Les produits existants (même slug) seront ignorés.
            </p>
          </div>
          <button
            onClick={migrateProducts}
            disabled={migrating}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {migrating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Migration en cours...
              </>
            ) : (
              <>
                <Upload size={20} />
                Démarrer la migration
              </>
            )}
          </button>
        </div>
      </div>

      {/* Résumé */}
      {statuses.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{successCount}</p>
            <p className="text-green-700 text-sm">Migrés</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">{skippedCount}</p>
            <p className="text-amber-700 text-sm">Ignorés (existants)</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{errorCount}</p>
            <p className="text-red-700 text-sm">Erreurs</p>
          </div>
        </div>
      )}

      {/* Liste des statuts */}
      {statuses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Produit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {statuses.map((status, index) => (
                  <tr key={status.slug} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 text-sm line-clamp-1">{status.name}</p>
                      <p className="text-xs text-slate-500">{status.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      {status.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                          <Loader2 size={12} className="animate-spin" />
                          En attente
                        </span>
                      )}
                      {status.status === 'success' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          <CheckCircle size={12} />
                          Succès
                        </span>
                      )}
                      {status.status === 'skipped' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                          Ignoré
                        </span>
                      )}
                      {status.status === 'error' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          <XCircle size={12} />
                          Erreur
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {status.message || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {completed && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-800 font-medium">Migration terminée !</p>
          <p className="text-blue-700 text-sm mt-1">
            Vous pouvez maintenant retourner à la liste des produits pour voir et modifier tous les produits depuis Supabase.
          </p>
          <Link
            href="/admin/produits"
            className="inline-flex items-center gap-2 mt-3 text-blue-700 hover:text-blue-900 font-medium"
          >
            Voir les produits →
          </Link>
        </div>
      )}
    </div>
  );
}
