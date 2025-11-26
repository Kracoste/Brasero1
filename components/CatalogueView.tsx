"use client";

import { useState } from "react";

import { FadeIn } from "@/components/FadeIn";
import { FilterPanel } from "@/components/FilterPanel";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/schema";
import { applyFilters, type FilterState } from "@/lib/utils";

type CatalogueViewProps = {
  products: Product[];
};

export const CatalogueView = ({ products }: CatalogueViewProps) => {
  const [filters, setFilters] = useState<FilterState>({ sort: "popular" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filteredProducts = applyFilters(products, filters);
  const priceValues = products.map((product) => product.price);
  const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 0;
  const dimensions = [60, 75, 90, 105];

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
          {filteredProducts.map((product, index) => {
            let productWithDimension = product;
            
            if (index < 4) {
              productWithDimension = {
                ...product,
                name: `Braséro Atelier LBF en Acier Ø${dimensions[index]}`
              };
            } else if (index >= 4 && index < 8) {
              productWithDimension = {
                ...product,
                name: `Braséro Atelier LBF en Acier Corten Ø${dimensions[index - 4]}`
              };
            }
            
            return (
              <FadeIn key={product.slug}>
                <ProductCard product={productWithDimension} className="catalog-card" />
              </FadeIn>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
};
