'use client';

import { useState, useCallback, useEffect } from 'react';
import { CompatibleAccessories } from '@/components/CompatibleAccessories';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Price } from '@/components/Price';
import { useAnalytics } from '@/lib/analytics-context';
import type { Product } from '@/lib/schema';
import { Pencil, Check } from 'lucide-react';

const ENGRAVING_FONTS = [
  { id: 'serif', label: 'Classique', family: 'Georgia, "Times New Roman", serif' },
  { id: 'sans', label: 'Moderne', family: '"Helvetica Neue", Arial, sans-serif' },
  { id: 'script', label: 'Cursive', family: '"Brush Script MT", "Segoe Script", cursive' },
  { id: 'monospace', label: 'Machine', family: '"Courier New", Courier, monospace' },
  { id: 'display', label: 'Élégant', family: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
  { id: 'condensed', label: 'Étroit', family: '"Arial Narrow", "Roboto Condensed", sans-serif' },
  { id: 'rounded', label: 'Arrondi', family: '"Comic Sans MS", "Segoe UI", sans-serif' },
  { id: 'slab', label: 'Gravé', family: 'Rockwell, "Courier New", serif' },
] as const;

type EngravingFontId = typeof ENGRAVING_FONTS[number]['id'];

type Accessory = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: { url?: string; src?: string; alt?: string }[];
  category?: string;
};

type ProductPurchaseSectionProps = {
  product: Product;
  compatibleAccessorySlugs: string[];
  preloadedAccessories?: Accessory[];
};

export function ProductPurchaseSection({ product, compatibleAccessorySlugs, preloadedAccessories }: ProductPurchaseSectionProps) {
  const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>([]);
  const [engravingEnabled, setEngravingEnabled] = useState(false);
  const [engravingText, setEngravingText] = useState('');
  const [engravingFont, setEngravingFont] = useState<EngravingFontId>('serif');
  const { trackProductView } = useAnalytics();

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

  const selectedFontObj = ENGRAVING_FONTS.find(f => f.id === engravingFont) || ENGRAVING_FONTS[0];

  return (
    <div className="space-y-4">
      {compatibleAccessorySlugs.length > 0 && (
        <CompatibleAccessories 
          compatibleSlugs={compatibleAccessorySlugs}
          onSelectionChange={handleSelectionChange}
          productCategory={product.category}
          preloadedProducts={preloadedAccessories}
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
                if (!e.target.checked) {
                  setEngravingText('');
                  setEngravingFont('serif');
                }
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
            <div className="space-y-4 pl-0 sm:pl-8">
              {/* Choix du style d'écriture */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Style d&apos;écriture
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ENGRAVING_FONTS.map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setEngravingFont(font.id)}
                      className={`relative flex flex-col items-center gap-1 rounded-lg border-2 px-3 py-2.5 transition-all text-center ${
                        engravingFont === font.id
                          ? 'border-[#8B4513] bg-amber-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {engravingFont === font.id && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#8B4513] text-white">
                          <Check size={12} />
                        </span>
                      )}
                      <span
                        className="text-lg leading-tight text-slate-800 truncate w-full"
                        style={{ fontFamily: font.family }}
                      >
                        Abc
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                        {font.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Texte de la gravure */}
              <div className="space-y-2">
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

              {/* Aperçu */}
              {engravingText.trim() && (
                <div className="rounded-lg border border-dashed border-[#8B4513]/30 bg-amber-50/50 p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Aperçu de la gravure</p>
                  <p
                    className="text-2xl text-[#8B4513] text-center py-2"
                    style={{ fontFamily: selectedFontObj.family }}
                  >
                    {engravingText}
                  </p>
                  <p className="text-xs text-slate-400 text-center mt-1">
                    Style : {selectedFontObj.label}
                  </p>
                </div>
              )}
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
          engravingFont={engravingEnabled && engravingText.trim() ? engravingFont : undefined}
          engravingPrice={engravingPrice > 0 ? engravingPrice : undefined}
        />
      </div>
    </div>
  );
}
