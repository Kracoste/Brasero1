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
  const filteredProducts = applyFilters(products, filters);
  const priceValues = products.map((product) => product.price);
  const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 0;
  const dimensions = [60, 75, 90, 105];

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]">
      <div className="lg:sticky lg:top-28">
        <FilterPanel
          minPrice={minPrice}
          maxPrice={maxPrice}
          value={filters}
          onChange={setFilters}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  );
};
