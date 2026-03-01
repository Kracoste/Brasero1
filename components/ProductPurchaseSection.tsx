'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { CompatibleAccessories } from '@/components/CompatibleAccessories';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Price } from '@/components/Price';
import { useAnalytics } from '@/lib/analytics-context';
import type { Product, ProductVariant, ProductConfiguration, DiameterData } from '@/lib/schema';

type Accessory = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: { url?: string; src?: string; alt?: string }[];
  category?: string;
};

export type ProductSelections = {
  diameter: number | null;
  finish: string | null;
  plancha: string | null;
};

type ProductPurchaseSectionProps = {
  product: Product;
  compatibleAccessorySlugs: string[];
  preloadedAccessories?: Accessory[];
  onVariantChange?: (variant: ProductVariant | null) => void;
  onSelectionChange?: (selections: ProductSelections) => void;
  /** Sous-fiche de configuration active (peut override le prix) */
  activeConfig?: ProductConfiguration;
  /** Données spécifiques au diamètre sélectionné (prix, dimensions) */
  activeDiameterData?: DiameterData;
};

const FINISH_LABELS: Record<string, string> = {
  corten: 'Acier Corten',
  peint: 'Acier Peint',
};

const PLANCHA_LABELS: Record<string, string> = {
  acier: 'Plancha Acier',
  inox: 'Plancha Inox',
};

/** Valeur spéciale = produit de base (pas un variant) */
const BASE_VALUE = '__base__';

/**
 * Construit la liste des options pour un sélecteur en incluant
 * la valeur du produit de base + celles des variants (dédoublonnées).
 */
function buildOptions<T extends string | number>(
  baseValue: T | undefined | null,
  variantValues: (T | undefined)[],
  labels?: Record<string, string>,
): { value: T; label: string }[] {
  const seen = new Set<T>();
  const options: { value: T; label: string }[] = [];

  // Ajouter la valeur de base en premier
  if (baseValue !== undefined && baseValue !== null) {
    seen.add(baseValue);
    const lbl = labels ? (labels[String(baseValue)] || String(baseValue)) : String(baseValue);
    options.push({ value: baseValue, label: lbl });
  }

  // Ajouter les valeurs des variants
  for (const val of variantValues) {
    if (val !== undefined && val !== null && !seen.has(val)) {
      seen.add(val);
      const lbl = labels ? (labels[String(val)] || String(val)) : String(val);
      options.push({ value: val, label: lbl });
    }
  }

  return options;
}

export function ProductPurchaseSection({ product, compatibleAccessorySlugs, preloadedAccessories, onVariantChange, onSelectionChange, activeConfig, activeDiameterData }: ProductPurchaseSectionProps) {
  const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>([]);
  const { trackProductView } = useAnalytics();

  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;
  const hasConfigurations = !!product.configurations && Object.keys(product.configurations).length > 0;
  // Afficher les sélecteurs si on a des variants OU des configurations
  const showSelectors = hasVariants || hasConfigurations;

  // --- Extraire la matière du produit de base ---
  const baseMaterial = product.material?.toLowerCase() ?? '';
  const baseFinish: string | undefined =
    baseMaterial.includes('corten') ? 'corten' :
    baseMaterial.includes('peint') || baseMaterial.includes('acier') ? 'peint' :
    undefined;
  const basePlancha = product.specs?.planchaMaterial ?? undefined;
  const baseDiameter = product.diameter ?? undefined;

  // --- Extraire les options depuis les configurations (sous-fiches) ---
  const configDiameters = useMemo(() => {
    if (!product.configurations) return [] as number[];
    const diams = new Set<number>();
    for (const cfg of Object.values(product.configurations)) {
      if (cfg.diameters) {
        for (const d of Object.keys(cfg.diameters)) {
          diams.add(parseInt(d));
        }
      }
    }
    return Array.from(diams).sort((a, b) => a - b);
  }, [product.configurations]);

  const configFinishes = useMemo(() => {
    if (!product.configurations) return [] as string[];
    const finishes = new Set<string>();
    for (const key of Object.keys(product.configurations)) {
      const parts = key.split('-');
      if (parts[0]) finishes.add(parts[0]);
    }
    return Array.from(finishes);
  }, [product.configurations]);

  const configPlanchas = useMemo(() => {
    if (!product.configurations) return [] as string[];
    const planchas = new Set<string>();
    for (const key of Object.keys(product.configurations)) {
      const parts = key.split('-');
      if (parts[1]) planchas.add(parts[1]);
    }
    return Array.from(planchas);
  }, [product.configurations]);

  // --- Construire les options de chaque sélecteur (base + variants + configurations) ---
  const diameterOptions = useMemo(() => {
    if (!showSelectors) return [];
    return buildOptions(
      baseDiameter,
      [...variants.map(v => v.diameter), ...configDiameters],
    ).sort((a, b) => Number(a.value) - Number(b.value));
  }, [showSelectors, baseDiameter, variants, configDiameters]);

  const finishOptions = useMemo(() => {
    if (!showSelectors) return [];
    return buildOptions(
      baseFinish,
      [...variants.map(v => v.finish), ...configFinishes],
      FINISH_LABELS,
    );
  }, [showSelectors, baseFinish, variants, configFinishes]);

  const planchaOptions = useMemo(() => {
    if (!showSelectors) return [];
    return buildOptions(
      basePlancha,
      [...variants.map(v => v.planchaMaterial), ...configPlanchas],
      PLANCHA_LABELS,
    );
  }, [showSelectors, basePlancha, variants, configPlanchas]);

  // --- État des sélections : initialisé aux valeurs du produit de base ---
  const [selectedDiameter, setSelectedDiameter] = useState<number | null>(
    baseDiameter ?? (diameterOptions.length > 0 ? diameterOptions[0].value as number : null)
  );
  const [selectedFinish, setSelectedFinish] = useState<string | null>(
    baseFinish ?? (finishOptions.length > 0 ? finishOptions[0].value as string : null)
  );
  const [selectedPlancha, setSelectedPlancha] = useState<string | null>(
    basePlancha ?? (planchaOptions.length > 0 ? planchaOptions[0].value as string : null)
  );

  // --- Déterminer si la sélection courante correspond au produit de base ---
  // La finition (corten/peint) ne change pas le prix, donc on ne la vérifie pas ici
  const isBaseProduct = useMemo(() => {
    const diamMatch = baseDiameter !== undefined ? selectedDiameter === baseDiameter : true;
    const planchaMatch = basePlancha !== undefined ? selectedPlancha === basePlancha : true;
    return diamMatch && planchaMatch;
  }, [selectedDiameter, selectedPlancha, baseDiameter, basePlancha]);

  // --- Trouver le variant correspondant (null = produit de base) ---
  // Le prix dépend uniquement de diamètre × plancha (la finition ne change pas le prix)
  const matchedVariant = useMemo(() => {
    if (!hasVariants) return null;
    // Si la sélection correspond au produit de base, pas de variant
    if (isBaseProduct) return null;
    // Chercher un variant qui correspond au diamètre + plancha (ignorer finish pour le prix)
    const match = variants.find(v => {
      if (selectedDiameter !== null && v.diameter !== undefined && v.diameter !== selectedDiameter) return false;
      if (selectedPlancha !== null && v.planchaMaterial !== undefined && v.planchaMaterial !== selectedPlancha) return false;
      return true;
    }) || null;
    // Si on a trouvé un match, on enrichit avec le finish sélectionné pour le label/panier
    if (match && selectedFinish) {
      return { ...match, finish: selectedFinish as 'corten' | 'peint' };
    }
    return match;
  }, [hasVariants, isBaseProduct, variants, selectedDiameter, selectedFinish, selectedPlancha]);

  // La sélection est valide si : configurations existe, OU c'est le produit de base, OU un variant trouvé
  const isSelectionValid = hasConfigurations || isBaseProduct || matchedVariant !== null;
  // Prix : priorité diameterData > variant > produit de base
  const activePrice = activeDiameterData?.price ?? (matchedVariant ? matchedVariant.price : product.price);
  const activePriceBrasero = activeDiameterData?.priceBrasero ?? matchedVariant?.priceBrasero ?? null;
  const activePricePlancha = activeDiameterData?.pricePlancha ?? matchedVariant?.pricePlancha ?? null;
  const showPriceBreakdown = activePriceBrasero !== null && activePricePlancha !== null && activePriceBrasero > 0 && activePricePlancha > 0;

  // Notifier le parent quand la variante change
  useEffect(() => {
    onVariantChange?.(matchedVariant);
  }, [matchedVariant, onVariantChange]);

  // Notifier le parent des sélections courantes (pour FAQ/specs dynamiques)
  useEffect(() => {
    onSelectionChange?.({
      diameter: selectedDiameter,
      finish: selectedFinish,
      plancha: selectedPlancha,
    });
  }, [selectedDiameter, selectedFinish, selectedPlancha, onSelectionChange]);

  useEffect(() => {
    trackProductView({
      slug: product.slug,
      name: product.name,
      price: activePrice,
    });
  }, [product.slug, product.name, activePrice, trackProductView]);

  const handleSelectionChange = useCallback((accessories: Accessory[]) => {
    setSelectedAccessories(accessories);
  }, []);

  const totalAccessoriesPrice = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = activePrice + totalAccessoriesPrice;

  const productWithVariantPrice = useMemo(() => ({
    ...product,
    price: activePrice,
  }), [product, activePrice]);

  // Construire le label de la variante pour le panier
  const variantLabel = useMemo(() => {
    if (!matchedVariant) return undefined;
    return matchedVariant.label;
  }, [matchedVariant]);

  const selectClass =
    'w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-800 shadow-sm transition-all focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none cursor-pointer';

  const chevronIcon = (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Sélecteurs de configuration — menus déroulants alignés */}
      {showSelectors && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Diamètre */}
            {diameterOptions.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Diamètre
                </label>
                <div className="relative">
                  <select
                    value={selectedDiameter ?? ''}
                    onChange={e => setSelectedDiameter(Number(e.target.value))}
                    className={selectClass}
                  >
                    {diameterOptions.map(o => (
                      <option key={o.value} value={o.value}>Ø{o.value} cm</option>
                    ))}
                  </select>
                  {chevronIcon}
                </div>
              </div>
            )}

            {/* Matière / Finition */}
            {finishOptions.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Matière
                </label>
                <div className="relative">
                  <select
                    value={selectedFinish ?? ''}
                    onChange={e => setSelectedFinish(e.target.value)}
                    className={selectClass}
                  >
                    {finishOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {chevronIcon}
                </div>
              </div>
            )}

            {/* Plancha */}
            {planchaOptions.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Plancha
                </label>
                <div className="relative">
                  <select
                    value={selectedPlancha ?? ''}
                    onChange={e => setSelectedPlancha(e.target.value)}
                    className={selectClass}
                  >
                    {planchaOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  {chevronIcon}
                </div>
              </div>
            )}
          </div>

          {/* Avertissement si combinaison non disponible */}
          {!isSelectionValid && (
            <p className="text-sm text-amber-600 font-medium">
              Cette combinaison n&apos;est pas disponible. Veuillez modifier votre sélection.
            </p>
          )}
        </div>
      )}

      {compatibleAccessorySlugs.length > 0 && (
        <CompatibleAccessories 
          compatibleSlugs={compatibleAccessorySlugs}
          onSelectionChange={handleSelectionChange}
          productCategory={product.category}
          preloadedProducts={preloadedAccessories}
        />
      )}

      <div className="space-y-3 sm:space-y-4">
        {!product.onDemand && (
          <div className="space-y-1">
            <Price amount={activePrice} className="text-2xl sm:text-3xl lg:text-4xl font-bold" showHT />
            {showPriceBreakdown && (
              <p className="text-sm text-slate-500">
                Brasero {activePriceBrasero.toFixed(2).replace('.', ',')} € + Plancha {activePricePlancha.toFixed(2).replace('.', ',')} €
              </p>
            )}
            {selectedAccessories.length > 0 && (
              <div className="text-lg text-slate-600">
                <span className="text-green-600 font-semibold">
                  + {totalAccessoriesPrice.toFixed(2).replace('.', ',')} € d&apos;accessoires
                </span>
                <span className="mx-2">=</span>
                <span className="font-bold text-slate-900">
                  {totalPrice.toFixed(2).replace('.', ',')} € total
                </span>
              </div>
            )}
          </div>
        )}
        <AddToCartButton 
          product={productWithVariantPrice} 
          selectedAccessories={selectedAccessories}
          selectedVariantLabel={variantLabel}
          disabled={showSelectors && !isSelectionValid}
        />
      </div>
    </div>
  );
}
