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
  showCategoryFilters?: boolean;
  variant?: "default" | "fendeur";
  showPromoFilters?: boolean;
  diameters?: number[];
}

export const FilterPanel = ({
  minPrice,
  maxPrice,
  value,
  onChange,
  inline = true,
  onToggle,
  showCategoryFilters = true,
  variant = "default",
  showPromoFilters = false,
  diameters,
}: FilterPanelProps) => {
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
    variant === "fendeur" ? (
      <FendeurTypeSection
        value={value.fendeurType}
        onChange={(fendeurType) => onChange({ ...value, fendeurType })}
      />
    ) : (
      <FiltersContent
        showFullLayout={inline}
        priceMin={priceMin}
        priceMax={priceMax}
        minPrice={minPrice}
        maxPrice={maxPrice}
        rangeMinPercent={rangeMinPercent}
        rangeMaxPercent={rangeMaxPercent}
        showCategories={showCategoryFilters}
        diameter={value.diameter}
        onDiameterChange={(diameter) => onChange({ ...value, diameter })}
        showPromo={showPromoFilters}
        promoValue={value.promo ?? false}
        onPromoChange={(promo) => onChange({ ...value, promo })}
        diameters={diameters}
        onMinChange={(next) => {
          setPriceMin(next);
          commitPrice(next, priceMax);
        }}
        onMaxChange={(next) => {
          setPriceMax(next);
          commitPrice(priceMin, next);
        }}
      />
    )
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
  showCategories: boolean;
  diameter?: string;
  onDiameterChange: (val?: string) => void;
  showPromo?: boolean;
  promoValue?: boolean;
  onPromoChange?: (val: boolean) => void;
  diameters?: number[];
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
  showCategories,
  diameter,
  onDiameterChange,
  showPromo,
  promoValue,
  onPromoChange,
  diameters,
  onMinChange,
  onMaxChange,
}: FiltersContentProps) => (
  <div className="space-y-6">
    {showCategories && <CategorySection />}
    <FormatSection />
    <DimensionSection diameter={diameter} onChange={onDiameterChange} diameters={diameters} />
    {showPromo && (
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Promotions</h3>
        <label className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900">
          <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
            <input
              type="checkbox"
              checked={promoValue}
              onChange={(e) => onPromoChange?.(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-2.5 h-2.5 bg-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
          </div>
          <span>Afficher uniquement les promotions</span>
        </label>
      </div>
    )}
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

const FendeurTypeSection = ({
  value,
  onChange,
}: {
  value?: "manuel" | "electrique";
  onChange: (val?: "manuel" | "electrique") => void;
}) => (
  <div>
    <h3 className="text-base font-bold text-slate-900 mb-4">Fendeurs à bûches</h3>
    <div className="space-y-3">
      {[
        { label: "Fendeur à bûches manuelle", value: "manuel" as const },
        { label: "Fendeur à bûches électriques", value: "electrique" as const },
      ].map((item) => (
        <label
          key={item.value}
          className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900"
        >
          <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
            <input
              type="checkbox"
              checked={value === item.value}
              onChange={(e) => onChange(e.target.checked ? item.value : undefined)}
              className="peer sr-only"
            />
            <div className="w-2.5 h-2.5 bg-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
          </div>
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const FormatSection = () => (
  <div className="border-t border-slate-200 pt-6">
    <h3 className="text-base font-bold text-slate-900 mb-4">Format Du Braséro</h3>
    <div className="space-y-3">
      {['Hexagonal', 'Rond', 'Carré'].map((label) => (
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

const DimensionSection = ({
  diameter,
  onChange,
  diameters,
}: {
  diameter?: string;
  onChange: (val?: string) => void;
  diameters?: number[];
}) => (
  <div className="border-t border-slate-200 pt-6">
    <h3 className="text-base font-bold text-slate-900 mb-4">Dimensions Braséro</h3>
    <div className="space-y-3">
      <label className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900">
        <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
          <input
            type="radio"
            name="diameter-filter"
            checked={!diameter}
            onChange={(e) => e.target.checked && onChange(undefined)}
            className="peer sr-only"
          />
          <div className="w-2.5 h-2.5 bg-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
        </div>
          <span>Tous les diamètres</span>
        </label>

      {(diameters && diameters.length ? diameters : [45, 50, 55, 60, 65, 70, 75, 80, 90, 100])
        .sort((a, b) => a - b)
        .map((size) => (
          <label
            key={size}
            className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900"
          >
            <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
              <input
                type="radio"
                name="diameter-filter"
                checked={diameter === String(size)}
                onChange={() =>
                  onChange(diameter === String(size) ? undefined : String(size))
                }
                className="peer sr-only"
              />
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
  const thumbSize = 18;
  const thumbBorder = 3;
  const thumbInnerInset = thumbSize / 2 - thumbBorder;
  // Strictement le rayon du thumb (sans border)
  // Décalage pour éviter tout débordement visuel de la barre
  const thumbVisualInsetLeft = thumbSize / 2;
  const thumbVisualInsetRight = thumbSize / 2 + 5;
  const trackWidth = `calc(100% - ${thumbVisualInsetLeft + thumbVisualInsetRight}px)`;

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

        <div className="relative mt-4" style={{ height: `${thumbSize + 2 * thumbBorder}px` }}>
          {/* Barre de fond beige */}
          <div
            className="absolute left-0 right-0 rounded-full pointer-events-none"
            style={{
              top: '50%',
              height: '4px',
              background: '#f5e9d7',
              left: `${thumbVisualInsetLeft + thumbInnerInset}px`,
              right: `${thumbVisualInsetRight + thumbInnerInset}px`,
              zIndex: 0,
              transform: 'translateY(-50%)',
            }}
          />
          {/* Barre active dégradée */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: '50%',
              height: '4px',
              left: `calc(${thumbVisualInsetLeft + thumbInnerInset}px + (100% - ${thumbVisualInsetLeft + thumbVisualInsetRight}px) * ${rangeMinPercent / 100})`,
              right: `calc(${thumbVisualInsetRight + thumbInnerInset}px + (100% - ${thumbVisualInsetLeft + thumbVisualInsetRight}px) * ${(100 - rangeMaxPercent) / 100})`,
              background: 'linear-gradient(90deg, #d8b88a 0%, #b57945 50%, #5a3416 100%)',
              zIndex: 1,
              transform: 'translateY(-50%)',
            }}
          />
          {/* Les deux inputs range */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={step}
            value={priceMin}
            onChange={(event) => onMinChange(Math.min(Number(event.target.value), priceMax - 1))}
            className="dual-range-input"
            style={{
              position: 'absolute',
              top: '50%',
              left: `${thumbVisualInsetLeft}px`,
              width: `calc(100% - ${thumbVisualInsetLeft + thumbVisualInsetRight}px)`,
              transform: 'translateY(-50%)',
              zIndex: 2,
            }}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={step}
            value={priceMax}
            onChange={(event) => onMaxChange(Math.max(Number(event.target.value), priceMin + 1))}
            className="dual-range-input"
            style={{
              position: 'absolute',
              top: '50%',
              left: `${thumbVisualInsetLeft}px`,
              width: `calc(100% - ${thumbVisualInsetLeft + thumbVisualInsetRight}px)`,
              transform: 'translateY(-50%)',
              zIndex: 3,
            }}
          />
        </div>
      </div>
    </div>
  );
};
