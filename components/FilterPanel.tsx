'use client';

import { useEffect, useMemo, useState } from 'react';

import type { FilterState } from '@/lib/utils';

interface FilterPanelProps {
  minPrice: number;
  maxPrice: number;
  value: FilterState;
  onChange: (filters: FilterState) => void;
  inline?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const FilterPanel = ({ minPrice, maxPrice, value, onChange, inline = true, onToggle }: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };
  const [priceMin, setPriceMin] = useState(value.priceMin ?? minPrice);
  const [priceMax, setPriceMax] = useState(value.priceMax ?? maxPrice);

  useEffect(() => {
    setPriceMin(value.priceMin ?? minPrice);
    setPriceMax(value.priceMax ?? maxPrice);
  }, [minPrice, maxPrice, value.priceMin, value.priceMax]);

  const totalRange = useMemo(() => Math.max(maxPrice - minPrice, 1), [minPrice, maxPrice]);
  const rangeMinPercent = ((priceMin - minPrice) / totalRange) * 100;
  const rangeMaxPercent = ((priceMax - minPrice) / totalRange) * 100;

  const commitPrice = (nextMin: number, nextMax: number) => {
    onChange({ ...value, priceMin: nextMin, priceMax: nextMax });
  };

  const content = (
    <FiltersContent
      showFullLayout={inline}
      priceMin={priceMin}
      priceMax={priceMax}
      minPrice={minPrice}
      maxPrice={maxPrice}
      rangeMinPercent={rangeMinPercent}
      rangeMaxPercent={rangeMaxPercent}
      onMinChange={(next) => {
        setPriceMin(next);
        commitPrice(next, priceMax);
      }}
      onMaxChange={(next) => {
        setPriceMax(next);
        commitPrice(priceMin, next);
      }}
    />
  );

  if (inline) {
    return <div className="space-y-8 pr-4">{content}</div>;
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleToggle}
        className="filter-button text-lg font-semibold text-slate-700 hover:text-slate-900 mb-4 w-fit pb-2"
      >
        Filtres
      </button>
      {isOpen && <div className="w-72 space-y-8 pr-4">{content}</div>}
    </div>
  );
};

interface FiltersContentProps {
  showFullLayout: boolean;
  priceMin: number;
  priceMax: number;
  minPrice: number;
  maxPrice: number;
  rangeMinPercent: number;
  rangeMaxPercent: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

const FiltersContent = ({
  showFullLayout,
  priceMin,
  priceMax,
  minPrice,
  maxPrice,
  rangeMinPercent,
  rangeMaxPercent,
  onMinChange,
  onMaxChange,
}: FiltersContentProps) => (
  <div className="space-y-6">
    <CategorySection />
    <DimensionSection />
    <PriceSection
      priceMin={priceMin}
      priceMax={priceMax}
      minPrice={minPrice}
      maxPrice={maxPrice}
      rangeMinPercent={rangeMinPercent}
      rangeMaxPercent={rangeMaxPercent}
      onMinChange={onMinChange}
      onMaxChange={onMaxChange}
    />
  </div>
);

const CategorySection = () => (
  <div>
    <h3 className="text-base font-bold text-slate-900 mb-4">Catégories</h3>
    <div className="space-y-3">
      {['Braséro Corten', 'Braséro Acier', 'Fendeur à bûches'].map((label) => (
        <label
          key={label}
          className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900"
        >
          <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
            <input type="checkbox" className="peer sr-only" />
            <div className="w-2.5 h-2.5 bg-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
          </div>
          <span>{label}</span>
        </label>
      ))}
    </div>
  </div>
);

const DeliverySection = () => (
  <div className="border-t border-slate-200 pt-6">
    <h3 className="text-sm font-bold text-slate-900 mb-4">Livraison</h3>
    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 hover:text-slate-900">
      <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-200" />
      <span>Chez vous en 24h à 72h</span>
    </label>
  </div>
);

const DimensionSection = () => (
  <div className="border-t border-slate-200 pt-6">
    <h3 className="text-base font-bold text-slate-900 mb-4">Dimensions</h3>
    <div className="space-y-3">
      {[45, 50, 55, 60, 65, 70, 75, 80, 90, 100].map((size) => (
        <label
          key={size}
          className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900"
        >
          <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
            <input type="checkbox" className="peer sr-only" />
            <div className="w-2.5 h-2.5 bg-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
          </div>
          <span>Ø {size}cm</span>
        </label>
      ))}
    </div>
  </div>
);

interface PriceSectionProps {
  priceMin: number;
  priceMax: number;
  minPrice: number;
  maxPrice: number;
  rangeMinPercent: number;
  rangeMaxPercent: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

const PriceSection = ({
  priceMin,
  priceMax,
  minPrice,
  maxPrice,
  rangeMinPercent,
  rangeMaxPercent,
  onMinChange,
  onMaxChange,
}: PriceSectionProps) => {
  const step = Math.max(1, Math.round((maxPrice - minPrice) / 40));

  return (
    <div className="border-t border-slate-200 pt-6">
      <h3 className="text-base font-bold text-slate-900 mb-4">
        Budget ({minPrice.toLocaleString('fr-FR')}€ — {maxPrice.toLocaleString('fr-FR')}€)
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-base text-slate-600">
          <input
            type="number"
            min={minPrice}
            max={priceMax - 1}
            value={priceMin}
            onChange={(event) => onMinChange(Math.min(Number(event.target.value), priceMax - 1))}
            className="w-24 rounded border border-slate-300 px-3 py-2 text-base font-semibold text-slate-800 focus:border-slate-800 focus:outline-none"
          />
          <span className="px-2 text-slate-400">à</span>
          <input
            type="number"
            min={priceMin + 1}
            max={maxPrice}
            value={priceMax}
            onChange={(event) => onMaxChange(Math.max(Number(event.target.value), priceMin + 1))}
            className="w-24 rounded border border-slate-300 px-3 py-2 text-base font-semibold text-right text-slate-800 focus:border-slate-800 focus:outline-none"
          />
        </div>

        <div className="relative mt-4" style={{ height: '20px' }}>
          <div className="absolute top-1/2 left-2 right-2 h-2 -translate-y-1/2 rounded-full bg-white border border-[#d7cbc0]" />
          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#8B4513]"
            style={{
              left: `calc(8px + (100% - 16px) * ${rangeMinPercent / 100})`,
              right: `calc(8px + (100% - 16px) * ${(100 - rangeMaxPercent) / 100})`,
            }}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={step}
            value={priceMin}
            onChange={(event) => onMinChange(Math.min(Number(event.target.value), priceMax - 1))}
            className="dual-range-input"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={step}
            value={priceMax}
            onChange={(event) => onMaxChange(Math.max(Number(event.target.value), priceMin + 1))}
            className="dual-range-input"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>
      </div>
    </div>
  );
};
