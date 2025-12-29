'use client';

import { useState, useCallback } from 'react';
import { CompatibleAccessories } from '@/components/CompatibleAccessories';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Price } from '@/components/Price';
import type { Product } from '@/lib/schema';

type Accessory = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: any[];
};

type ProductPurchaseSectionProps = {
  product: Product;
  compatibleAccessorySlugs: string[];
};

export function ProductPurchaseSection({ product, compatibleAccessorySlugs }: ProductPurchaseSectionProps) {
  const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>([]);

  const handleSelectionChange = useCallback((accessories: Accessory[]) => {
    setSelectedAccessories(accessories);
  }, []);

  const totalAccessoriesPrice = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = product.price + totalAccessoriesPrice;

  return (
    <div className="space-y-4">
      {compatibleAccessorySlugs.length > 0 && (
        <CompatibleAccessories 
          productSlug={product.slug}
          compatibleSlugs={compatibleAccessorySlugs}
          onSelectionChange={handleSelectionChange}
          productCategory={product.category}
        />
      )}

      <div className="space-y-3 sm:space-y-4">
        {!product.onDemand && (
          <div className="space-y-1">
            <Price amount={product.price} className="text-2xl sm:text-3xl lg:text-4xl font-bold" />
            {selectedAccessories.length > 0 && (
              <div className="text-lg text-slate-600">
                <span className="text-green-600 font-semibold">
                  + {totalAccessoriesPrice.toFixed(2).replace('.', ',')} € d'accessoires
                </span>
                <span className="mx-2">=</span>
                <span className="font-bold text-slate-900">
                  {totalPrice.toFixed(2).replace('.', ',')} € total
                </span>
              </div>
            )}
          </div>
        )}
        <AddToCartButton product={product} selectedAccessories={selectedAccessories} />
      </div>
    </div>
  );
}
