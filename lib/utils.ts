import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Product } from "@/lib/schema";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(value);

export type FilterState = {
  diameter?: string;
  material?: string;
  price?: string;
  sort?: "price-asc" | "price-desc" | "popular";
  priceMin?: number;
  priceMax?: number;
};

type Predicate = (product: Product) => boolean;

const pricePredicates: Record<string, Predicate> = {
  lt500: (product) => product.price < 500,
  lt800: (product) => product.price < 800,
  gte800: (product) => product.price >= 800,
};

export const productFilterOptions = {
  diameter: [
    { label: "Tous les diamètres", value: "all" },
    { label: "Ø 60 cm", value: "60" },
    { label: "Ø 80 cm", value: "80" },
    { label: "Ø 100 cm", value: "100" },
  ],
  material: [
    { label: "Tous les aciers", value: "all" },
    { label: "Acier corten", value: "corten" },
    { label: "Acier brut", value: "brut" },
  ],
  price: [
    { label: "Tous les prix", value: "all" },
    { label: "Moins de 500 €", value: "lt500" },
    { label: "Moins de 800 €", value: "lt800" },
    { label: "800 € et plus", value: "gte800" },
  ],
  sort: [
    { label: "Popularité", value: "popular" },
    { label: "Prix croissant", value: "price-asc" },
    { label: "Prix décroissant", value: "price-desc" },
  ],
};

export const applyFilters = (products: Product[], filters: FilterState) => {
  const filtered = products.filter((product) => {
    if (filters.diameter && filters.diameter !== "all") {
      if (String(product.diameter) !== filters.diameter) return false;
    }

    if (filters.material && filters.material !== "all") {
      if (!product.material.toLowerCase().includes(filters.material)) {
        return false;
      }
    }

    if (filters.price && filters.price !== "all") {
      const predicate = pricePredicates[filters.price];
      if (predicate && !predicate(product)) return false;
    }
    if (typeof filters.priceMin === "number" && product.price < filters.priceMin) {
      return false;
    }
    if (typeof filters.priceMax === "number" && product.price > filters.priceMax) {
      return false;
    }

    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => a.price - b.price);
    case "price-desc":
      return [...filtered].sort((a, b) => b.price - a.price);
    default:
      return [...filtered].sort((a, b) => b.popularScore - a.popularScore);
  }
};

export const getProductBySlug = (products: Product[], slug: string) =>
  products.find((product) => product.slug === slug);
