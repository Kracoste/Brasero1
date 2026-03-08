'use client';

import { useState, useMemo, useCallback } from 'react';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductPurchaseSection, type ProductSelections } from '@/components/ProductPurchaseSection';
import { ProductTabs } from '@/components/ProductTabs';
import { Badge } from '@/components/Badge';
import type { Product, ProductVariant, ProductConfiguration, DiameterData, SeoContent } from '@/lib/schema';
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
 * Quand le client choisit une variante, TOUT change dynamiquement :
 * images, description, prix, FAQ, specs, caractéristiques.
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

  // --- Résoudre la sous-fiche de configuration active ---
  // Clé de recherche : "finish-plancha" (ex: "corten-inox")
  // Les données de diamètre sont dans config.diameters[diameter]
  const activeConfig: ProductConfiguration | undefined = useMemo(() => {
    if (!product.configurations) return undefined;
    const { finish, plancha } = selections;
    if (!finish || !plancha) return undefined;

    const key = `${finish}-${plancha}`;
    return product.configurations[key] ?? undefined;
  }, [product.configurations, selections]);

  // --- Données spécifiques au diamètre sélectionné dans la sous-fiche ---
  const activeDiameterData: DiameterData | undefined = useMemo(() => {
    if (!activeConfig?.diameters || !selections.diameter) return undefined;
    return activeConfig.diameters[String(selections.diameter)] ?? undefined;
  }, [activeConfig, selections.diameter]);

  // --- Images dynamiques (config > configImages > product.images) ---
  const configurationImages = useMemo(() => {
    // Priorité 1 : images de la sous-fiche configurations
    if (activeConfig?.images && activeConfig.images.length > 0) return activeConfig.images;
    // Priorité 2 : ancien système configImages (rétrocompatibilité)
    if (product.configImages) {
      const finish = selections.finish;
      const plancha = selections.plancha;
      if (finish && plancha) {
        const key = `${finish}-${plancha}`;
        if (product.configImages[key]) return product.configImages[key];
      }
    }
    return undefined;
  }, [activeConfig, product.configImages, selections.finish, selections.plancha]);

  // --- Description dynamique (diamètre > sous-fiche > produit) ---
  const activeDescription = activeDiameterData?.description || activeConfig?.description || product.description;

  // --- FAQ dynamique ---
  const activeFAQ = activeConfig?.faq;

  // --- Caractéristiques dynamiques ---
  const activeCharacteristics = activeConfig?.characteristics;

  // --- Contenu SEO dynamique (diamètre > sous-fiche > produit) ---
  const activeSeoContent: SeoContent | undefined = useMemo(() => {
    if (activeDiameterData?.seoContent?.sections?.length) return activeDiameterData.seoContent;
    if (activeConfig?.seoContent?.sections?.length) return activeConfig.seoContent;
    return undefined;
  }, [activeDiameterData, activeConfig]);

  // Calculer les options FAQ dynamiques en fonction des sélections du client
  const faqOptions: FAQOptions = useMemo(() => {
    const opts: FAQOptions = {};
    if (selections.finish === 'corten') {
      opts.overrideMaterial = 'corten' as MaterialType;
    } else if (selections.finish === 'peint') {
      opts.overrideMaterial = 'acier-peint' as MaterialType;
    }
    if (selections.plancha) {
      opts.overridePlanchaType = selections.plancha as PlanchaType;
    }
    if (!opts.overridePlanchaType && product.specs?.planchaMaterial) {
      opts.overridePlanchaType = product.specs.planchaMaterial as PlanchaType;
    }
    return opts;
  }, [selections, product.specs?.planchaMaterial]);

  // Overrides de specs pour ProductTabs en fonction des sélections + sous-fiche
  const specsOverrides = useMemo(() => {
    const hasSelections = selections.diameter !== null || selections.finish !== null || selections.plancha !== null;
    if (!hasSelections) return undefined;

    return {
      diameter: selections.diameter ?? undefined,
      height: activeDiameterData?.height ?? selectedVariant?.height,
      length: activeDiameterData?.length,
      width: activeDiameterData?.width,
      weight: activeDiameterData?.weight ?? selectedVariant?.weight,
      finish: (selections.finish as 'corten' | 'peint') ?? undefined,
      paintType: activeConfig?.painting ?? selectedVariant?.paintType,
      planchaMaterial: (selections.plancha as 'acier' | 'inox') ?? undefined,
      bowlThickness: activeDiameterData?.bowlThickness,
      baseThickness: activeDiameterData?.baseThickness,
    };
  }, [selections, selectedVariant, activeConfig, activeDiameterData]);

  return (
    <>
      {/* Section principale : Galerie + Options d'achat */}
      <div className="grid gap-4 sm:gap-6 lg:gap-10 lg:grid-cols-2 items-start">
        {/* Colonne gauche : Galerie */}
        <div className="space-y-8 sm:space-y-16">
          <ProductGallery key={product.slug} product={product} configurationImages={configurationImages} />
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
            activeConfig={activeConfig}
            activeDiameterData={activeDiameterData}
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
          overrideDescription={activeDescription !== product.description ? activeDescription : undefined}
          overrideFAQ={activeFAQ}
          overrideCharacteristics={activeCharacteristics}
          overrideSeoContent={activeSeoContent}
        />
      </div>
    </>
  );
}
