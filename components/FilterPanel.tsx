'use client';

import { useEffect, useState } from 'react';

import type { FilterState } from '@/lib/utils';

type FilterPanelProps = {
  minPrice: number;
  maxPrice: number;
  value: FilterState;
  onChange: (filters: FilterState) => void;
};

export const FilterPanel = ({ minPrice, maxPrice, value, onChange }: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceMin, setPriceMin] = useState(value.priceMin ?? minPrice);
  const [priceMax, setPriceMax] = useState(value.priceMax ?? maxPrice);

  useEffect(() => {
    setPriceMin(value.priceMin ?? minPrice);
    setPriceMax(value.priceMax ?? maxPrice);
  }, [minPrice, maxPrice, value.priceMin, value.priceMax]);

  const totalRange = Math.max(maxPrice - minPrice, 1);
  const rangeMinPercent = ((priceMin - minPrice) / totalRange) * 100;
  const rangeMaxPercent = ((priceMax - minPrice) / totalRange) * 100;
  const commitPrice = (nextMin: number, nextMax: number) => {
    const nextFilters: FilterState = { ...value, priceMin: nextMin, priceMax: nextMax };
    onChange(nextFilters);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="filter-button text-lg font-semibold text-slate-700 hover:text-slate-900 mb-6 relative w-fit pb-2"
      >
        Filtres
      </button>

      {isOpen && (
        <div className="w-64 space-y-8 pr-8">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Catégories</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
                <span>Braséro Corten</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
                <span>Braséro Acier</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
                <span>Fendeur à bûches</span>
              </label>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Livraison</h3>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
              <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
              <span>Chez vous en 24h à 72h</span>
            </label>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Dimensions Plancha</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
                <span>Ø 34cm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
                <span>Ø 79,5cm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
                <span>Ø 80cm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
                <span>Ø 85cm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
                <span>Ø 100cm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
                <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
                <span>Ø 105cm</span>
              </label>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Budget ({minPrice.toLocaleString("fr-FR")}€ — {maxPrice.toLocaleString("fr-FR")}€)
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="flex flex-col w-full">
                  <label className="text-xs uppercase text-slate-400">Min</label>
                  <input
                    type="number"
                    min={minPrice}
                    max={priceMax - 1}
                    value={priceMin}
                    onChange={(event) => {
                      const nextMin = Math.min(Number(event.target.value), priceMax - 1);
                      setPriceMin(nextMin);
                      commitPrice(nextMin, priceMax);
                    }}
                    className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                  />
                </div>
                <span className="px-2 text-slate-400">à</span>
                <div className="flex flex-col w-full">
                  <label className="text-xs uppercase text-slate-400">Max</label>
                  <input
                    type="number"
                    min={priceMin + 1}
                    max={maxPrice}
                    value={priceMax}
                    onChange={(event) => {
                      const nextMax = Math.max(Number(event.target.value), priceMin + 1);
                      setPriceMax(nextMax);
                      commitPrice(priceMin, nextMax);
                    }}
                    className="rounded border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold text-slate-800">
                  <span>{priceMin.toLocaleString("fr-FR")}€</span>
                  <span>{priceMax.toLocaleString("fr-FR")}€</span>
                </div>
                <div className="relative mt-4" style={{ height: '18px', paddingLeft: '8px', paddingRight: '8px' }}>
                  {/* Barre dégradé marron - centrée verticalement */}
                  <div 
                    className="absolute top-1/2 rounded-full" 
                    style={{ 
                      height: '4px', 
                      transform: 'translateY(-50%)',
                      left: '8px',
                      right: '8px',
                      background: 'linear-gradient(to right, #d4b896, #8B4513)' 
                    }}
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={Math.max(1, Math.round(totalRange / 40))}
                    value={priceMin}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      const nextMin = Math.min(value, priceMax - 1);
                      setPriceMin(nextMin);
                      commitPrice(nextMin, priceMax);
                    }}
                    className="dual-range-input"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={Math.max(1, Math.round(totalRange / 40))}
                    value={priceMax}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      const nextMax = Math.max(value, priceMin + 1);
                      setPriceMax(nextMax);
                      commitPrice(priceMin, nextMax);
                    }}
                    className="dual-range-input"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
