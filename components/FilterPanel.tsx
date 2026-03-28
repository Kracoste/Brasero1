"use client";

import { useEffect, useState } from "react";

import { ensureArray, type FilterState, type PlanchaFilterOption } from "@/lib/utils";
import { CustomDualRange } from "./CustomDualRange";

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
  showFormatAndDimensions?: boolean;
  showAccessoryFilters?: boolean;
  currentCategory?: string;
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
  showFormatAndDimensions = true,
  showAccessoryFilters = false,
  currentCategory,
}: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };
  
  // Initialiser les valeurs de prix directement depuis les props
  const initialPriceMin = value.priceMin ?? minPrice;
  const initialPriceMax = value.priceMax ?? maxPrice;
  const [priceMin, setPriceMin] = useState(initialPriceMin);
  const [priceMax, setPriceMax] = useState(initialPriceMax);

  // Mettre à jour les valeurs de prix quand les props externes changent
  useEffect(() => {
    setPriceMin(value.priceMin ?? minPrice);
    setPriceMax(value.priceMax ?? maxPrice);
  }, [minPrice, maxPrice, value.priceMin, value.priceMax]);

  const commitPrice = (nextMin: number, nextMax: number) => {
    onChange({ ...value, priceMin: nextMin, priceMax: nextMax });
  };

  const content =
    variant === "fendeur" ? (
      <FendeurTypeSection
        values={ensureArray(value.fendeurType)}
        onChange={(fendeurType) => onChange({ ...value, fendeurType })}
      />
    ) : (
      <FiltersContent
        showFullLayout={inline}
        priceMin={priceMin}
        priceMax={priceMax}
        minPrice={minPrice}
        maxPrice={maxPrice}
        showCategories={showCategoryFilters}
        material={value.material}
        onMaterialChange={(material) => onChange({ ...value, material })}
        format={value.format}
        onFormatChange={(format) => onChange({ ...value, format })}
        planchaMaterial={value.planchaMaterial}
        onPlanchaMaterialChange={(planchaMaterial) => onChange({ ...value, planchaMaterial })}
        accessoryType={value.accessoryType}
        onAccessoryTypeChange={(type) => onChange({ ...value, accessoryType: type })}
        diameter={value.diameter}
        onDiameterChange={(diameter) => onChange({ ...value, diameter })}
        showPromo={showPromoFilters}
        promoValue={value.promo ?? false}
        onPromoChange={(promo) => onChange({ ...value, promo })}
        diameters={diameters}
        showFormatAndDimensions={showFormatAndDimensions}
        showAccessoryFilters={showAccessoryFilters}
        currentCategory={currentCategory}
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
      {isOpen && <div className="w-full sm:w-72 space-y-8 pr-4">{content}</div>}
    </div>
  );
};

interface FiltersContentProps {
  showFullLayout: boolean;
  priceMin: number;
  priceMax: number;
  minPrice: number;
  maxPrice: number;
  showCategories: boolean;
  showFormatAndDimensions: boolean;
  showAccessoryFilters: boolean;
  material?: FilterState["material"];
  onMaterialChange: (value?: FilterState["material"]) => void;
  format?: FilterState["format"];
  onFormatChange: (value?: FilterState["format"]) => void;
  planchaMaterial?: FilterState["planchaMaterial"];
  onPlanchaMaterialChange: (value?: FilterState["planchaMaterial"]) => void;
  accessoryType?: FilterState["accessoryType"];
  onAccessoryTypeChange: (value?: FilterState["accessoryType"]) => void;
  diameter?: FilterState["diameter"];
  onDiameterChange: (val?: FilterState["diameter"]) => void;
  showPromo?: boolean;
  promoValue?: boolean;
  onPromoChange?: (val: boolean) => void;
  diameters?: number[];
  currentCategory?: string;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

const FiltersContent = ({
  showFullLayout: _showFullLayout,
  priceMin,
  priceMax,
  minPrice,
  maxPrice,
  showCategories,
  showFormatAndDimensions,
  showAccessoryFilters,
  material,
  onMaterialChange,
  format,
  onFormatChange,
  planchaMaterial,
  onPlanchaMaterialChange,
  accessoryType,
  onAccessoryTypeChange,
  diameter,
  onDiameterChange,
  showPromo,
  promoValue,
  onPromoChange,
  diameters,
  currentCategory,
  onMinChange,
  onMaxChange,
}: FiltersContentProps) => {
  const materialValues = ensureArray(material);
  const formatValues = ensureArray(format);
  const planchaValues = ensureArray(planchaMaterial);
  const accessoryValues = ensureArray(accessoryType);
  const diameterValues = ensureArray(diameter);

  return (
    <div className="space-y-6">
      {showCategories && (
        <CategorySection
          values={materialValues}
          onChange={(next) => onMaterialChange(next && next.length ? next : undefined)}
          currentCategory={currentCategory}
        />
      )}
      {showAccessoryFilters && (
        <AccessorySection
          values={accessoryValues}
          onChange={(next) => onAccessoryTypeChange(next && next.length ? next : undefined)}
        />
      )}
      {showFormatAndDimensions && (
        <>
          <FormatSection
            values={formatValues}
            onChange={(next) => onFormatChange(next && next.length ? next : undefined)}
          />
          <PlanchaMaterialSection
            values={planchaValues}
            onChange={(next) => onPlanchaMaterialChange(next && next.length ? next : undefined)}
          />
          <DimensionSection
            values={diameterValues}
            onChange={(next) => onDiameterChange(next && next.length ? next : undefined)}
            diameters={diameters}
          />
        </>
      )}
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
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
      />
    </div>
  );
};

type MaterialOption = "corten" | "acier" | "inox" | "brut" | "fendeur" | "accessoire" | "gant" | "grille" | "housse";

const CategorySection = ({
  values,
  onChange,
  currentCategory,
}: {
  values: MaterialOption[];
  onChange: (val?: MaterialOption[]) => void;
  currentCategory?: string;
}) => {
  const allCategories: { label: string; value: MaterialOption }[] = [
    { label: "Braséro Corten", value: "corten" },
    { label: "Braséro Acier", value: "acier" },
    { label: "Fendeur à Bûches", value: "fendeur" },
    { label: "Accessoires", value: "accessoire" },
    { label: "Gants", value: "gant" },
    { label: "Grilles", value: "grille" },
    { label: "Housses", value: "housse" },
  ];
  
  // Si on est dans l'onglet braséro, filtrer les catégories non-braséro
  const categories = currentCategory === "brasero"
    ? allCategories.filter(cat => ["corten", "acier"].includes(cat.value))
    : allCategories;
  const handleToggle = (nextValue: MaterialOption) => {
    const next = values.includes(nextValue)
      ? values.filter((entry) => entry !== nextValue)
      : [...values, nextValue];
    onChange(next.length ? next : undefined);
  };

  return (
    <div>
      <h3 className="text-base font-bold text-slate-900 mb-4">Catégories</h3>
      <div className="space-y-3">
        {categories.map((category) => (
          <label
            key={category.value}
            className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900"
          >
            <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
              <input
                type="checkbox"
                checked={values.includes(category.value)}
                onChange={() => handleToggle(category.value)}
                className="peer sr-only"
              />
              <div className="w-2.5 h-2.5 bg-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span>{category.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const AccessorySection = ({
  values,
  onChange,
}: {
  values: (
    | "spatule"
    | "couvercle"
    | "grille"
    | "allume-feu"
    | "housse"
    | "fendeur"
    | "range-buches"
  )[];
  onChange: (val?: ("spatule" | "couvercle" | "grille" | "allume-feu" | "housse" | "fendeur" | "range-buches")[]) => void;
}) => {
  const options = [
    { label: "Spatule", value: "spatule" as const },
    { label: "Couvercle", value: "couvercle" as const },
    { label: "Grille", value: "grille" as const },
    { label: "Allume Feu", value: "allume-feu" as const },
    { label: "Housse de Protection", value: "housse" as const },
    { label: "Fendeur à Bûches", value: "fendeur" as const },
    { label: "Ranges-Bûches", value: "range-buches" as const },
  ];
  const handleToggle = (
    option: "spatule" | "couvercle" | "grille" | "allume-feu" | "housse" | "fendeur" | "range-buches",
  ) => {
    const next = values.includes(option)
      ? values.filter((entry) => entry !== option)
      : [...values, option];
    onChange(next.length ? next : undefined);
  };

  return (
    <div className="border-t border-slate-200 pt-6">
      <h3 className="text-base font-bold text-slate-900 mb-4">Catégorie Accessoire</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900"
          >
            <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
              <input
                type="checkbox"
                checked={values.includes(option.value)}
                onChange={() => handleToggle(option.value)}
                className="peer sr-only"
              />
              <div className="w-2.5 h-2.5 bg-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const FendeurTypeSection = ({
  values,
  onChange,
}: {
  values: ("manuel" | "electrique")[];
  onChange: (val?: ("manuel" | "electrique")[]) => void;
}) => {
  const toggleValue = (target: "manuel" | "electrique") => {
    const next = values.includes(target)
      ? values.filter((entry) => entry !== target)
      : [...values, target];
    onChange(next.length ? next : undefined);
  };

  return (
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
                checked={values.includes(item.value)}
                onChange={() => toggleValue(item.value)}
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
};

const FormatSection = ({
  values,
  onChange,
}: {
  values: ("hexagonal" | "rond" | "carre")[];
  onChange: (val?: ("hexagonal" | "rond" | "carre")[]) => void;
}) => {
  const formats: { label: string; value: "hexagonal" | "rond" | "carre" }[] = [
    { label: "Hexagonal", value: "hexagonal" },
    { label: "Rond", value: "rond" },
    { label: "Carré", value: "carre" },
  ];
  const toggleValue = (target: "hexagonal" | "rond" | "carre") => {
    const next = values.includes(target)
      ? values.filter((entry) => entry !== target)
      : [...values, target];
    onChange(next.length ? next : undefined);
  };

  return (
    <div className="border-t border-slate-200 pt-6">
      <h3 className="text-base font-bold text-slate-900 mb-4">Format Du Braséro</h3>
      <div className="space-y-3">
        {formats.map((formatOption) => (
          <label
            key={formatOption.value}
            className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900"
          >
            <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
              <input
                type="checkbox"
                checked={values.includes(formatOption.value)}
                onChange={() => toggleValue(formatOption.value)}
                className="peer sr-only"
              />
              <div className="w-2.5 h-2.5 bg-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span>{formatOption.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const PlanchaMaterialSection = ({
  values,
  onChange,
}: {
  values: PlanchaFilterOption[];
  onChange: (val?: PlanchaFilterOption[]) => void;
}) => {
  const options: { label: string; value: PlanchaFilterOption }[] = [
    { label: "Plancha Acier", value: "acier" },
    { label: "Plancha Inox", value: "inox" },
  ];
  const toggleValue = (target: PlanchaFilterOption) => {
    const next = values.includes(target)
      ? values.filter((entry) => entry !== target)
      : [...values, target];
    onChange(next.length ? next : undefined);
  };

  return (
    <div className="border-t border-slate-200 pt-6">
      <h3 className="text-base font-bold text-slate-900 mb-4">Matière Plancha</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900"
          >
            <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
              <input
                type="checkbox"
                checked={values.includes(option.value)}
                onChange={() => toggleValue(option.value)}
                className="peer sr-only"
              />
              <div className="w-2.5 h-2.5 bg-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const DimensionSection = ({
  values,
  onChange,
  diameters,
}: {
  values: string[];
  onChange: (val?: string[]) => void;
  diameters?: number[];
}) => {
  const toggleValue = (target: string) => {
    const next = values.includes(target)
      ? values.filter((entry) => entry !== target)
      : [...values, target];
    onChange(next.length ? next : undefined);
  };

  return (
    <div className="border-t border-slate-200 pt-6">
      <h3 className="text-base font-bold text-slate-900 mb-4">Dimensions Braséro</h3>
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer text-base text-slate-700 hover:text-slate-900">
          <div className="relative w-5 h-5 border-2 border-slate-900 flex items-center justify-center transition-all hover:border-black">
            <input
              type="checkbox"
              checked={values.length === 0}
              onChange={() => onChange(undefined)}
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
                  type="checkbox"
                  checked={values.includes(String(size))}
                  onChange={() => toggleValue(String(size))}
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
};

interface PriceSectionProps {
  priceMin: number;
  priceMax: number;
  minPrice: number;
  maxPrice: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

const PriceSection = ({
  priceMin,
  priceMax,
  minPrice,
  maxPrice,
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
        <div className="flex items-center justify-between text-base text-slate-600">
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

        <CustomDualRange
          min={minPrice}
          max={maxPrice}
          step={step}
          value={[priceMin, priceMax]}
          onChange={([nextMin, nextMax]) => {
            onMinChange(nextMin);
            onMaxChange(nextMax);
          }}
        />
      </div>
    </div>
  );
};
