'use client';

import { useState, useMemo, useCallback } from 'react';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductPurchaseSection, type ProductSelections } from '@/components/ProductPurchaseSection';
import { ProductTabs } from '@/components/ProductTabs';
import { Badge } from '@/components/Badge';
import type { Product, ProductVariant } from '@/lib/schema';
import type { FAQOptions, MaterialType, PlanchaType } from '@/lib/product-faq';

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
 * Quand le client choisit une variante, les specs et la FAQ changent dynamiquement.
 */
export function ProductConfigurator({
  product,
  reference,
  compatibleAccessorySlugs,
  preloadedAccessories,
}: ProductConfiguratorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selections, setSelections] = useState<ProductSelections>({ diameter: null, finish: null, plancha: null });

  const handleVariantChange = useCallback((variant: ProductVariant | null) => {
    setSelectedVariant(variant);
  }, []);

  const handleSelectionChange = useCallback((sel: ProductSelections) => {
    setSelections(sel);
  }, []);

  // Calculer les options FAQ dynamiques en fonction des sélections du client
  const faqOptions: FAQOptions = useMemo(() => {
    const opts: FAQOptions = {};

    // Finition → matériau pour la FAQ (utilise les sélections, pas le variant)
    if (selections.finish === 'corten') {
      opts.overrideMaterial = 'corten' as MaterialType;
    } else if (selections.finish === 'peint') {
      opts.overrideMaterial = 'acier-peint' as MaterialType;
    }

    // Plancha (utilise les sélections)
    if (selections.plancha) {
      opts.overridePlanchaType = selections.plancha as PlanchaType;
    }

    // Fallback sur les specs du produit
    if (!opts.overridePlanchaType && product.specs?.planchaMaterial) {
      opts.overridePlanchaType = product.specs.planchaMaterial as PlanchaType;
    }

    return opts;
  }, [selections, product.specs?.planchaMaterial]);

  // Overrides de specs pour ProductTabs en fonction des sélections du client
  const specsOverrides = useMemo(() => {
    // Toujours envoyer les overrides si le client a fait des sélections
    const hasSelections = selections.diameter !== null || selections.finish !== null || selections.plancha !== null;
    if (!hasSelections) return undefined;

    return {
      diameter: selections.diameter ?? undefined,
      height: selectedVariant?.height,
      weight: selectedVariant?.weight,
      finish: (selections.finish as 'corten' | 'peint') ?? undefined,
      paintType: selectedVariant?.paintType,
      planchaMaterial: (selections.plancha as 'acier' | 'inox') ?? undefined,
    };
  }, [selections, selectedVariant]);

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

          {/* Section d'achat avec configurateur */}
          <ProductPurchaseSection
            product={product}
            compatibleAccessorySlugs={compatibleAccessorySlugs}
            preloadedAccessories={preloadedAccessories}
            onVariantChange={handleVariantChange}
            onSelectionChange={handleSelectionChange}
          />
        </div>
      </div>

      {/* ProductTabs avec FAQ et specs dynamiques */}
      <div className="mt-8 sm:mt-12">
        <ProductTabs
          product={product}
          accessories={[]}
          faqOptions={faqOptions}
          specsOverrides={specsOverrides}
        />
      </div>
    </>
  );
}
