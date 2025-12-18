"use client";

import { useMemo, useState } from "react";

import { FadeIn } from "@/components/FadeIn";
import { FilterPanel } from "@/components/FilterPanel";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/schema";
import { applyFilters, resolveDiameter, type FilterState } from "@/lib/utils";

type CatalogueViewProps = {
  products: Product[];
  showCategoryFilters?: boolean;
  category?: string;
};

export const CatalogueView = ({ products, showCategoryFilters = true, category }: CatalogueViewProps) => {
  const [filters, setFilters] = useState<FilterState>({ sort: "popular" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filteredProducts = useMemo(() => applyFilters(products, filters), [products, filters]);

  const priceValues = useMemo(() => products.map((product) => product.price), [products]);
  const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 0;

  // On force les diamètres disponibles à 50, 80, 100
  const availableDiameters = [50, 80, 100];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-8">
        {/* Panneau des filtres */}
        <div className="flex-shrink-0">
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
            showFormatAndDimensions={category !== "accessoire"}
            showAccessoryFilters={category === "accessoire"}
          />
        </div>

        {/* Grille des produits */}
        <div className="flex-1 transition-all duration-300">
          <p className="text-sm text-slate-500 mb-6">
            {filteredProducts.length} articles
          </p>
          <div className={`grid gap-6 transition-all duration-300 ${
            filtersOpen 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          }`} style={{ maxWidth: filtersOpen ? 'none' : '100%' }}>
          {filteredProducts.map((product) => (
            <div key={product.slug} className="h-full">
              <ProductCard product={product} className="catalog-card h-full" />
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};
