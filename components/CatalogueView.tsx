"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";

import { FilterPanel } from "@/components/FilterPanel";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/schema";
import { applyFilters, resolveCardOverrides, type FilterState, type CardOverrides } from "@/lib/utils";

type CatalogueViewProps = {
  products: Product[];
  showCategoryFilters?: boolean;
  category?: string;
  initialSection?: string;
  reviewStatsMap?: Record<string, { average: number; count: number }>;
};

export const CatalogueView = ({ products, showCategoryFilters = true, category, initialSection, reviewStatsMap }: CatalogueViewProps) => {
  // Initialiser le filtre avec la section si fournie (ex: range-buches)
  const initialFilters: FilterState = { sort: "popular" };
  if (initialSection) {
    initialFilters.accessoryType = [initialSection as "spatule" | "couvercle" | "grille" | "allume-feu" | "housse" | "fendeur" | "range-buches"];
  }
  
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const filteredProducts = useMemo(() => applyFilters(products, filters), [products, filters]);

  // Calculer les overrides visuels (image/prix de sous-fiche) pour chaque produit filtré
  const overridesMap = useMemo(() => {
    const map = new Map<string, CardOverrides>();
    // Seulement si des filtres matière, plancha ou diamètre sont actifs
    const hasMaterialOrDiameterFilter = filters.material?.length || filters.diameter?.length || filters.planchaMaterial?.length;
    if (!hasMaterialOrDiameterFilter) return map;
    for (const product of filteredProducts) {
      const ov = resolveCardOverrides(product, filters);
      if (ov) map.set(product.slug, ov);
    }
    return map;
  }, [filteredProducts, filters]);

  const priceValues = useMemo(() => {
    const prices: number[] = [];
    for (const product of products) {
      prices.push(product.price);
      if (product.variants) {
        for (const v of product.variants) {
          if (v.price) prices.push(v.price);
        }
      }
    }
    return prices;
  }, [products]);
  const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 0;

  // On force les diamètres disponibles à 50, 80, 100
  const availableDiameters = [50, 80, 100];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8">
        {/* Panneau des filtres - se replie quand fermé */}
        <div className={`transition-all duration-300 ${
          filtersOpen 
            ? 'w-full lg:w-64 lg:flex-shrink-0' 
            : 'w-full lg:w-auto'
        }`}>
          <FilterPanel
            minPrice={minPrice}
            maxPrice={maxPrice}
            value={filters}
            onChange={setFilters}
            inline={false}
            onToggle={setFiltersOpen}
            showCategoryFilters={showCategoryFilters}
            variant={category === "fendeur" ? "fendeur" : "default"}
            diameters={availableDiameters}
            showFormatAndDimensions={category !== "accessoire" && category !== "promotions"}
            showAccessoryFilters={category === "accessoire"}
            currentCategory={category}
          />
        </div>

        {/* Grille des produits */}
        <div className="flex-1 w-full transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              {filteredProducts.length} articles
            </p>
            {(category === "brasero" || !category) && (
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
                title={sortOrder === "asc" ? "Trier par prix décroissant" : "Trier par prix croissant"}
              >
                <ArrowUpDown size={16} />
                {sortOrder === "asc" ? "Prix ↑" : "Prix ↓"}
              </button>
            )}
          </div>
          <div className={`grid gap-3 sm:gap-4 lg:gap-5 transition-all duration-300 ${
            filtersOpen 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }`}>
          {((category === "brasero" || !category)
            ? sortOrder === "asc"
              ? [...filteredProducts].sort((a, b) => (overridesMap.get(a.slug)?.price ?? a.price) - (overridesMap.get(b.slug)?.price ?? b.price))
              : [...filteredProducts].sort((a, b) => (overridesMap.get(b.slug)?.price ?? b.price) - (overridesMap.get(a.slug)?.price ?? a.price))
            : filteredProducts
          ).map((product) => (
            <div key={product.slug} className="h-full">
              <ProductCard product={product} className="catalog-card h-full" cardOverrides={overridesMap.get(product.slug)} reviewStats={reviewStatsMap?.[product.slug] ?? null} />
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};
