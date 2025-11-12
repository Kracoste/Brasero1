"use client";

import { useState } from "react";

import { FadeIn } from "@/components/FadeIn";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import type { Product } from "@/lib/schema";
import { applyFilters, type FilterState } from "@/lib/utils";

type CatalogueViewProps = {
  products: Product[];
};

export const CatalogueView = ({ products }: CatalogueViewProps) => {
  const [filters, setFilters] = useState<FilterState>({ sort: "popular" });
  const filteredProducts = applyFilters(products, filters);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <ProductFilters value={filters} onChange={setFilters} total={filteredProducts.length} />
      <div className="grid gap-6">
        {filteredProducts.map((product) => (
          <FadeIn key={product.slug}>
            <ProductCard product={product} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
};
