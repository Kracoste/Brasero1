'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProductConfigurator } from '@/components/ProductConfigurator';
import type { Product } from '@/lib/schema';
import { generateVariantSlug } from '@/lib/variant-slugs';
import type { ProductSelections } from '@/components/ProductPurchaseSection';

type VariantConfiguratorWrapperProps = {
  product: Product;
  reference: string;
  compatibleAccessorySlugs: string[];
  preloadedAccessories?: any[];
  initialSelections: {
    diameter: number;
    finish: string;
    plancha: string;
  };
};

export function VariantConfiguratorWrapper({
  product,
  reference,
  compatibleAccessorySlugs,
  preloadedAccessories,
  initialSelections,
}: VariantConfiguratorWrapperProps) {
  const router = useRouter();

  const handleVariantNavigate = useCallback(
    (selections: ProductSelections) => {
      if (!selections.diameter || !selections.finish || !selections.plancha) return;

      // Ne naviguer que si la sélection a changé par rapport à l'initial
      if (
        selections.diameter === initialSelections.diameter &&
        selections.finish === initialSelections.finish &&
        selections.plancha === initialSelections.plancha
      ) return;

      // Vérifier que la combinaison existe dans les configurations du produit
      const configKey = `${selections.finish}-${selections.plancha}`;
      const config = product.configurations?.[configKey];
      if (!config?.diameters?.[String(selections.diameter)]) return;

      const nameForSlug = product.specs?.shortName || product.name;
      const newSlug = generateVariantSlug(
        nameForSlug,
        selections.finish,
        selections.diameter,
        selections.plancha,
      );

      router.push(`/brasero-plancha/${newSlug}`);
    },
    [router, product.name, product.specs?.shortName, product.configurations, initialSelections],
  );

  return (
    <ProductConfigurator
      product={product}
      reference={reference}
      compatibleAccessorySlugs={compatibleAccessorySlugs}
      preloadedAccessories={preloadedAccessories}
      initialSelections={initialSelections}
      onVariantNavigate={handleVariantNavigate}
    />
  );
}
