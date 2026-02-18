'use client';

import { useMemo } from 'react';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductPurchaseSection } from '@/components/ProductPurchaseSection';
import { ProductTabs } from '@/components/ProductTabs';
import { Badge } from '@/components/Badge';
import type { Product } from '@/lib/schema';
import type { FAQOptions } from '@/lib/product-faq';

type ProductConfiguratorProps = {
  product: Product;
  reference: string;
  compatibleAccessorySlugs: string[];
  preloadedAccessories?: any[];
};

/**
 * Composant orchestrateur : coordonne la galerie,
 * les options d'achat, et les ProductTabs (dont la FAQ dynamique).
 * 
 * La matière de plancha est définie par l'admin uniquement et affichée dans les specs.
 */
export function ProductConfigurator({
  product,
  reference,
  compatibleAccessorySlugs,
  preloadedAccessories,
}: ProductConfiguratorProps) {
  // Options FAQ dynamiques basées sur la matière plancha définie par l'admin
  const faqOptions: FAQOptions = useMemo(() => ({
    overridePlanchaType: product.specs?.planchaMaterial || 'aucune',
  }), [product.specs?.planchaMaterial]);

  return (
    <>
      {/* Section principale : Galerie + Options d'achat */}
      <div className="grid gap-4 sm:gap-6 lg:gap-10 lg:grid-cols-2 items-start">
        {/* Colonne gauche : Galerie */}
        <div className="space-y-8 sm:space-y-16">
          <ProductGallery key={product.slug} product={product} />
        </div>

        {/* Colonne droite : Infos produit + Options d'achat */}
        <div className="space-y-4 sm:space-y-6">
          {/* En-tête produit */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <span>Atelier LBF</span>
              <Badge>{product.badge}</Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className="font-semibold">
                Référence&nbsp;: <span className="font-mono text-slate-900">{reference}</span>
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                En stock
              </span>
            </div>
          </div>

          {/* Section d'achat */}
          <ProductPurchaseSection
            product={product}
            compatibleAccessorySlugs={compatibleAccessorySlugs}
            preloadedAccessories={preloadedAccessories}
          />
        </div>
      </div>

      {/* ProductTabs avec FAQ dynamique */}
      <div className="mt-8 sm:mt-12">
        <ProductTabs product={product} accessories={[]} faqOptions={faqOptions} />
      </div>
    </>
  );
}
