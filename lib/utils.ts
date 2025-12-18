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

export const parseNumericValue = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const match = value.replace(",", ".").match(/-?\d+(\.\d+)?/);
    if (match) {
      const parsed = Number.parseFloat(match[0]);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
};

const normalizeSpecs = (specs: unknown): Record<string, unknown> => {
  if (!specs) return {};
  if (typeof specs === "string") {
    try {
      return JSON.parse(specs);
    } catch {
      return {};
    }
  }
  return specs as Record<string, unknown>;
};

const isReasonableDiameter = (value?: number) => typeof value === "number" && value >= 20 && value <= 400;

export const resolveDiameter = (source: Record<string, unknown>) => {
  const specs = normalizeSpecs(source.specs);
  const candidates: unknown[] = [
    source.diameter,
    source.diametre,
    specs["dimensions"],
    specs["diameter"],
    specs["diametre"],
    source.slug,
    source.name,
    source.shortDescription,
    source.description,
  ];

  for (const candidate of candidates) {
    const parsed = parseNumericValue(candidate);
    if (isReasonableDiameter(parsed)) return parsed;
  }

  return undefined;
};

type FormatOption = "hexagonal" | "rond" | "carre";
type AccessoryType =
  | "spatule"
  | "couvercle"
  | "grille"
  | "allume-feu"
  | "housse"
  | "fendeur"
  | "range-buches";
type FendeurType = "manuel" | "electrique";

export type MaybeArray<T> = T | T[];

export const ensureArray = <T>(value?: MaybeArray<T>): T[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
};

export type FilterState = {
  diameter?: MaybeArray<string>;
  material?: MaybeArray<"corten" | "acier" | "inox" | "brut">;
  format?: MaybeArray<FormatOption>;
  accessoryType?: MaybeArray<AccessoryType>;
  price?: string;
  sort?: "price-asc" | "price-desc" | "popular";
  priceMin?: number;
  priceMax?: number;
  fendeurType?: MaybeArray<FendeurType>;
  promo?: boolean;
};

type Predicate = (product: Product) => boolean;

const stripDiacritics = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const normalizeText = (value?: string) =>
  value ? stripDiacritics(value.toLowerCase()) : "";

const gatherProductText = (product: Product) => {
  const specs = product.specs as Record<string, unknown> | undefined;
  return [
    (product as Record<string, unknown>)["format"],
    specs?.["format"],
    specs?.["acier"],
    product.badge,
    product.name,
    product.shortDescription,
    product.description,
    product.material,
  ]
    .filter((entry): entry is string => typeof entry === "string" && entry.length > 0)
    .map((entry) => normalizeText(entry))
    .join(" ");
};

const inferFormat = (product: Product): FormatOption | undefined => {
  const text = gatherProductText(product);
  if (text.includes("hex")) return "hexagonal";
  if (text.includes("carre") || text.includes("square")) return "carre";
  if (text.includes("rond") || text.includes("round") || text.includes("cercle")) return "rond";
  return undefined;
};

const inferMaterial = (product: Product): "corten" | "acier" | "inox" | undefined => {
  const text = gatherProductText(product);
  if (text.includes("inox")) return "inox";
  if (text.includes("corten")) return "corten";
  if (text.includes("acier") || text.includes("steel") || text.includes("thermolaque")) {
    return "acier";
  }
  return undefined;
};

const inferAccessoryType = (product: Product): AccessoryType | undefined => {
  const text = gatherProductText(product);
  if (text.includes("spatule")) return "spatule";
  if (text.includes("couvercle") || text.includes("cloche")) return "couvercle";
  if (text.includes("allume") || text.includes("allumefeu")) return "allume-feu";
  if (text.includes("grille")) return "grille";
  if (text.includes("housse") || text.includes("protection")) return "housse";
  if (text.includes("fendeur") || text.includes("buches")) return "fendeur";
  if ((text.includes("range") && text.includes("buch")) || text.includes("range-buche")) return "range-buches";
  return undefined;
};

const inferFendeurType = (product: Product): FendeurType | undefined => {
  const text = gatherProductText(product);
  if (text.includes("electrique")) return "electrique";
  if (text.includes("manuel")) return "manuel";
  return undefined;
};

const pricePredicates: Record<string, Predicate> = {
  lt500: (product) => product.price < 500,
  lt800: (product) => product.price < 800,
  gte800: (product) => product.price >= 800,
};

export const productFilterOptions = {
  diameter: [
    { label: "Tous les diamètres", value: "all" },
    { label: "Ø 50 cm", value: "50" },
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
  const diameterSelections = ensureArray(filters.diameter)
    .map((value) => Number.parseFloat(value))
    .filter((value) => Number.isFinite(value));
  const hasDiameterFilter = diameterSelections.length > 0;
  const materialSelections = ensureArray(filters.material);
  const formatSelections = ensureArray(filters.format);
  const accessorySelections = ensureArray(filters.accessoryType);
  const fendeurSelections = ensureArray(filters.fendeurType);

  const filtered = products.filter((product) => {
    const productDiameter = resolveDiameter(product as Record<string, unknown>);

    if (filters.promo) {
      return typeof product.discountPercent === "number" && product.discountPercent > 0;
    }

    if (hasDiameterFilter) {
      if (!productDiameter) {
        return false;
      }
      const roundedProductDiameter = Math.round(productDiameter);
      const matchesDiameter = diameterSelections.some(
        (selection) => Math.round(selection) === roundedProductDiameter,
      );
      if (!matchesDiameter) {
        return false;
      }
    }

    if (materialSelections.length) {
      const materialType = inferMaterial(product);
      if (!materialType || !materialSelections.includes(materialType)) {
        return false;
      }
    }

    if (formatSelections.length) {
      const formatType = inferFormat(product);
      if (!formatType || !formatSelections.includes(formatType)) {
        return false;
      }
    }

    if (accessorySelections.length) {
      if (product.category !== "accessoire") {
        return false;
      }
      const accessoryType = inferAccessoryType(product);
      if (!accessoryType || !accessorySelections.includes(accessoryType)) {
        return false;
      }
    }

    if (fendeurSelections.length) {
      if (product.category !== "fendeur") {
        return false;
      }
      const fendeurType = inferFendeurType(product);
      if (!fendeurType || !fendeurSelections.includes(fendeurType)) {
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
    default: {
      if (hasDiameterFilter) {
        return [...filtered].sort(
          (a, b) =>
            (resolveDiameter(a as Record<string, unknown>) ?? 0) -
            (resolveDiameter(b as Record<string, unknown>) ?? 0),
        );
      }
      return [...filtered].sort((a, b) => b.popularScore - a.popularScore);
    }
  }
};

export const getProductBySlug = (products: Product[], slug: string) =>
  products.find((product) => product.slug === slug);
