'use client';

import { useState, useCallback, useEffect } from 'react';
import { CompatibleAccessories } from '@/components/CompatibleAccessories';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Price } from '@/components/Price';
import { useAnalytics } from '@/lib/analytics-context';
import type { Product } from '@/lib/schema';
import { Pencil } from 'lucide-react';

type Accessory = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: { url?: string; src?: string; alt?: string }[];
};

type ProductPurchaseSectionProps = {
  product: Product;
  compatibleAccessorySlugs: string[];
};

export function ProductPurchaseSection({ product, compatibleAccessorySlugs }: ProductPurchaseSectionProps) {
  const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>([]);
  const [engravingEnabled, setEngravingEnabled] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const { trackProductView } = useAnalytics();

  // Tracker la vue du produit au montage
  useEffect(() => {
    trackProductView({
      slug: product.slug,
      name: product.name,
      price: product.price,
    });
  }, [product.slug, product.name, product.price, trackProductView]);

  const handleSelectionChange = useCallback((accessories: Accessory[]) => {
    setSelectedAccessories(accessories);
  }, []);

  const totalAccessoriesPrice = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
  const engravingPrice = engravingEnabled && engravingText.trim() ? (product.engravingPrice || 0) : 0;
  const totalPrice = product.price + totalAccessoriesPrice + engravingPrice;

  return (
    <div className="space-y-4">
      {compatibleAccessorySlugs.length > 0 && (
        <CompatibleAccessories 
          compatibleSlugs={compatibleAccessorySlugs}
          onSelectionChange={handleSelectionChange}
          productCategory={product.category}
        />
      )}

      {/* Option Gravure */}
      {product.engravingAvailable && (product.engravingPrice ?? 0) > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={engravingEnabled}
              onChange={(e) => {
                setEngravingEnabled(e.target.checked);
                if (!e.target.checked) setEngravingText('');
              }}
              className="w-5 h-5 rounded border-slate-300 text-[#8B4513] focus:ring-[#8B4513]"
            />
            <div className="flex items-center gap-2">
              <Pencil size={16} className="text-[#8B4513]" />
              <span className="text-sm font-semibold text-slate-900">
                Ajouter une gravure personnalisée
              </span>
              <span className="text-sm font-semibold text-[#8B4513]">
                +{(product.engravingPrice ?? 0).toFixed(2).replace('.', ',')} €
              </span>
            </div>
          </label>

          {engravingEnabled && (
            <div className="space-y-2 pl-8">
              <label className="block text-sm font-medium text-slate-700">
                Texte de la gravure
              </label>
              <input
                type="text"
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                maxLength={50}
                placeholder="Ex: Famille Dupont, Joyeux anniversaire..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm"
              />
              <p className="text-xs text-slate-500">
                {engravingText.length}/50 caractères maximum
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {!product.onDemand && (
          <div className="space-y-1">
            <Price amount={product.price} className="text-2xl sm:text-3xl lg:text-4xl font-bold" />
            {(selectedAccessories.length > 0 || engravingPrice > 0) && (
              <div className="text-lg text-slate-600">
                {selectedAccessories.length > 0 && (
                  <span className="text-green-600 font-semibold">
                    + {totalAccessoriesPrice.toFixed(2).replace('.', ',')} € d&apos;accessoires
                  </span>
                )}
                {engravingPrice > 0 && (
                  <>
                    {selectedAccessories.length > 0 && <span className="mx-1">|</span>}
                    <span className="text-[#8B4513] font-semibold">
                      + {engravingPrice.toFixed(2).replace('.', ',')} € gravure
                    </span>
                  </>
                )}
                <span className="mx-2">=</span>
                <span className="font-bold text-slate-900">
                  {totalPrice.toFixed(2).replace('.', ',')} € total
                </span>
              </div>
            )}
          </div>
        )}
        <AddToCartButton 
          product={product} 
          selectedAccessories={selectedAccessories}
          engravingText={engravingEnabled && engravingText.trim() ? engravingText.trim() : undefined}
          engravingPrice={engravingPrice > 0 ? engravingPrice : undefined}
        />
      </div>
    </div>
  );
}
