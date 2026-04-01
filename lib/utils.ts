import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Product, ProductConfiguration } from "@/lib/schema";
import { generateProductImageAlt } from "@/lib/seo/schemas";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Formate les dimensions d'un produit au format "L x l x h cm"
 * L = Largeur (majuscule), l = Longueur (minuscule), h = Hauteur (minuscule)
 */
export const formatDimensions = (product: { 
  width?: number; 
  length?: number; 
  height?: number; 
  diameter?: number;
  specs?: { dimensions?: string };
}) => {
  // Si des dimensions custom existent dans specs, les utiliser
  if (product.specs?.dimensions) {
    return product.specs.dimensions;
  }
  
  const { width, length, height, diameter } = product;
  
  // Si on a largeur, longueur et hauteur
  if (width && length && height) {
    return `L${width} x l${length} x h${height} cm`;
  }
  
  // Si on a largeur et longueur
  if (width && length) {
    return `L${width} x l${length} cm`;
  }
  
  // Si on a seulement le diamètre (produits ronds)
  if (diameter) {
    if (height) {
      return `Ø${diameter} x h${height} cm`;
    }
    return `Ø${diameter} cm`;
  }
  
  // Si on a seulement hauteur
  if (height) {
    return `h${height} cm`;
  }
  
  return "-";
};

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

export const normalizeSpecs = (specs: unknown): Record<string, unknown> => {
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

export type PlanchaFilterOption = "acier" | "inox";

export type FilterState = {
  diameter?: MaybeArray<string>;
  material?: MaybeArray<"corten" | "acier" | "inox" | "brut" | "fendeur" | "accessoire" | "gant" | "grille" | "housse">;
  format?: MaybeArray<FormatOption>;
  accessoryType?: MaybeArray<AccessoryType>;
  planchaMaterial?: MaybeArray<PlanchaFilterOption>;
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
  const planchaSelections = ensureArray(filters.planchaMaterial);

  const filtered = products.filter((product) => {
    const productDiameter = resolveDiameter(product as Record<string, unknown>);

    if (filters.promo) {
      return typeof product.discountPercent === "number" && product.discountPercent > 0;
    }

    // Collecter tous les diamètres disponibles (base + variantes + configurations)
    const allDiameters = new Set<number>();
    if (productDiameter) allDiameters.add(Math.round(productDiameter));
    if (product.variants) {
      for (const v of product.variants) {
        if (v.diameter) allDiameters.add(Math.round(v.diameter));
      }
    }
    if (product.configurations) {
      for (const config of Object.values(product.configurations)) {
        if (config.diameters) {
          for (const d of Object.keys(config.diameters)) {
            const n = Number(d);
            if (Number.isFinite(n)) allDiameters.add(Math.round(n));
          }
        }
      }
    }

    if (hasDiameterFilter) {
      const matchesDiameter = diameterSelections.some((sel) => allDiameters.has(Math.round(sel)));
      if (!matchesDiameter) {
        return false;
      }
    }

    // Collecter tous les matériaux disponibles (base + variantes)
    if (materialSelections.length) {
      const baseMaterial = inferMaterial(product);
      const allMaterials = new Set<string>();
      if (baseMaterial) allMaterials.add(baseMaterial);
      if (product.variants) {
        for (const v of product.variants) {
          if (v.finish === 'corten') allMaterials.add('corten');
          if (v.finish === 'peint' && baseMaterial !== 'inox') allMaterials.add('acier');
          if (v.planchaMaterial === 'inox') allMaterials.add('inox');
        }
      }
      if (product.configurations) {
        for (const key of Object.keys(product.configurations)) {
          if (key.includes('corten')) allMaterials.add('corten');
          if (key.includes('peint') && baseMaterial !== 'inox') allMaterials.add('acier');
        }
      }
      const matchesMaterial = materialSelections.some((m) => allMaterials.has(m));
      if (!matchesMaterial) {
        return false;
      }
    }

    // Filtre matière plancha (acier / inox)
    if (planchaSelections.length) {
      const allPlanchas = new Set<string>();
      if (product.specs?.planchaMaterial) allPlanchas.add(product.specs.planchaMaterial);
      if (product.variants) {
        for (const v of product.variants) {
          if (v.planchaMaterial) allPlanchas.add(v.planchaMaterial);
        }
      }
      if (product.configurations) {
        for (const key of Object.keys(product.configurations)) {
          const plancha = key.split('-')[1];
          if (plancha) allPlanchas.add(plancha);
        }
      }
      const matchesPlancha = planchaSelections.some((p) => allPlanchas.has(p));
      if (!matchesPlancha) {
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
    // Prix : vérifier le prix de base ET les prix des variantes
    if (typeof filters.priceMin === "number" || typeof filters.priceMax === "number") {
      const allPrices = [product.price];
      if (product.variants) {
        for (const v of product.variants) {
          if (v.price) allPrices.push(v.price);
        }
      }
      const minProductPrice = Math.min(...allPrices);
      const maxProductPrice = Math.max(...allPrices);
      if (typeof filters.priceMin === "number" && maxProductPrice < filters.priceMin) {
        return false;
      }
      if (typeof filters.priceMax === "number" && minProductPrice > filters.priceMax) {
        return false;
      }
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

/**
 * Overrides visuels calculés pour l'affichage catalogue quand des filtres sont actifs.
 * Permet d'afficher l'image/prix/description de la sous-fiche correspondante.
 */
export type CardOverrides = {
  image?: { src: string; alt: string; blurDataURL?: string };
  price?: number;
  name?: string;
  shortDescription?: string;
  configKey?: string;
  diameter?: number;
};

/**
 * Pour chaque produit filtré, résout la meilleure sous-fiche correspondant aux filtres actifs
 * et retourne les overrides visuels (image, prix, description) pour la carte produit.
 */
export const resolveCardOverrides = (product: Product, filters: FilterState): CardOverrides | undefined => {
  if (!product.configurations && !product.variants) return undefined;

  const diameterSelections = ensureArray(filters.diameter)
    .map((v) => Number.parseFloat(v))
    .filter((v) => Number.isFinite(v));
  const materialSelections = ensureArray(filters.material);
  const planchaSelections = ensureArray(filters.planchaMaterial);

  // Déduire la finition demandée par les filtres matériau
  let filterFinish: string | undefined;
  if (materialSelections.includes('corten')) filterFinish = 'corten';
  else if (materialSelections.includes('acier')) filterFinish = 'peint';

  // Déduire la plancha demandée par les filtres
  const filterPlancha: string | undefined = planchaSelections[0];

  // Chercher la meilleure sous-fiche (configuration) correspondant aux filtres
  if (product.configurations) {
    let bestKey: string | undefined;
    let bestConfig: ProductConfiguration | undefined;

    // Quand le filtre matériau est "acier" (finish=peint), préférer la plancha "acier"
    // pour éviter d'afficher la sous-fiche inox sur un brasero filtré en acier.
    const preferredPlancha = (!filterPlancha && filterFinish === 'peint') ? 'acier' : undefined;

    // Premier passage : chercher une correspondance exacte (avec plancha préférée)
    for (const [key, config] of Object.entries(product.configurations)) {
      const [keyFinish, keyPlancha] = key.split('-');
      if (filterFinish && keyFinish !== filterFinish) continue;
      if (filterPlancha && keyPlancha !== filterPlancha) continue;
      if (preferredPlancha && keyPlancha !== preferredPlancha) continue;
      if (diameterSelections.length && config.diameters) {
        const hasMatchingDiameter = diameterSelections.some(d => config.diameters?.[String(Math.round(d))]);
        if (!hasMatchingDiameter) continue;
      }
      bestKey = key;
      bestConfig = config;
      break;
    }

    // Deuxième passage (fallback) : si pas de correspondance exacte avec plancha préférée,
    // accepter n'importe quelle plancha
    if (!bestConfig && preferredPlancha) {
      for (const [key, config] of Object.entries(product.configurations)) {
        const [keyFinish, keyPlancha] = key.split('-');
        if (filterFinish && keyFinish !== filterFinish) continue;
        if (filterPlancha && keyPlancha !== filterPlancha) continue;
        if (diameterSelections.length && config.diameters) {
          const hasMatchingDiameter = diameterSelections.some(d => config.diameters?.[String(Math.round(d))]);
          if (!hasMatchingDiameter) continue;
        }
        bestKey = key;
        bestConfig = config;
        break;
      }
    }

    if (bestConfig && bestKey) {
      const overrides: CardOverrides = { configKey: bestKey };

      // Image de la sous-fiche
      if (bestConfig.images && bestConfig.images.length > 0) {
        overrides.image = bestConfig.images[0];
      } else if (product.configImages?.[bestKey]?.length) {
        overrides.image = product.configImages[bestKey][0];
      }

      // Diamètre et prix : prendre le premier diamètre qui matche les filtres
      if (bestConfig.diameters) {
        const matchedDiam = diameterSelections.length
          ? diameterSelections.find(d => bestConfig!.diameters?.[String(Math.round(d))])
          : undefined;
        const diamKey = matchedDiam ? String(Math.round(matchedDiam)) : Object.keys(bestConfig.diameters)[0];
        const diamData = bestConfig.diameters[diamKey];
        if (diamData) {
          overrides.diameter = Number(diamKey);
          overrides.name = diamData.name || `${product.name} Ø ${diamKey} cm`;
          if (diamData.price) overrides.price = diamData.price;
          if (diamData.description) overrides.shortDescription = diamData.description;
        }
      }

      // Description de la sous-fiche
      if (!overrides.shortDescription && bestConfig.description) {
        overrides.shortDescription = bestConfig.description;
      }

      return overrides;
    }
  }

  // Fallback : si pas de configurations mais des variantes avec configImages
  if (product.configImages && (filterFinish || filterPlancha)) {
    for (const [key, imgs] of Object.entries(product.configImages)) {
      if (imgs.length === 0) continue;
      const [kFinish, kPlancha] = key.split('-');
      if (filterFinish && kFinish !== filterFinish) continue;
      if (filterPlancha && kPlancha !== filterPlancha) continue;
      return { image: imgs[0], configKey: key };
    }
  }

  return undefined;
};

export const getProductBySlug = (products: Product[], slug: string) =>
  products.find((product) => product.slug === slug);

/**
 * Mappe un produit issu de Supabase (snake_case ou camelCase) vers le type Product.
 * Centralise la logique de normalisation pour éviter la duplication.
 */
export const mapSupabaseProduct = (p: Record<string, unknown>): Product | null => {
  if (!p) return null;
  const specs = normalizeSpecs(p.specs);
  const diameter =
    resolveDiameter({ ...p, specs }) ?? 0;

  return {
    slug: (p.slug as string) ?? "",
    name: (p.name as string) ?? "Produit",
    shortDescription: (p.shortDescription || p.short_description || "") as string,
    description: (p.description || "") as string,
    category: ((p.category as string) || "accessoire") as Product["category"],
    price: Number(p.price ?? 0),
    comparePrice: (p.comparePrice || p.compare_price) as number | undefined,
    discountPercent: (p.discountPercent || p.discount_percent) as number | undefined,
    badge: (p.badge || "") as string,
    images: (Array.isArray(p.images) ? p.images : []).map((img: Record<string, unknown>, index: number) => {
      const originalAlt = (img.alt as string) || (p.name as string) || "Image produit";
      const productContext = {
        name: (p.name as string) || "Produit",
        material: (p.material as string) || "Acier",
        diameter,
        category: (p.category as string) || "accessoire",
      };
      return {
        src: (img.src as string) || "",
        alt: generateProductImageAlt(productContext, index, originalAlt),
        width: (img.width as number) || 800,
        height: (img.height as number) || 600,
        blurDataURL: (img.blurDataURL as string) || "",
      };
    }),
    material: (p.material || "Acier") as string,
    madeIn: "France" as const,
    diameter,
    length: (p.length as number) || 0,
    width: (p.width as number) || 0,
    thickness: (p.thickness as number) || 0,
    height: (p.height as number) || 0,
    weight: (p.weight as number) || 0,
    bowlThickness: (p.bowl_thickness ?? p.bowlThickness ?? undefined) as number | undefined,
    baseThickness: (p.base_thickness ?? p.baseThickness ?? undefined) as number | undefined,
    warranty: (p.warranty || "Garantie atelier") as string,
    availability: (p.availability || "En stock") as string,
    shipping: (p.shipping || "") as string,
    popularScore: ((p.popularScore || p.popular_score || 50) as number),
    onDemand: (p.onDemand ?? p.on_demand ?? false) as boolean,
    variants: (Array.isArray(p.variants) && p.variants.length > 0 ? p.variants : undefined) as Product["variants"],
    configImages: (p.configImages || p.config_images || undefined) as Product["configImages"],
    configurations: (p.configurations || undefined) as Product["configurations"],
    specs:
      (specs && Object.keys(specs).length > 0
        ? specs
        : { dimensions: diameter ? `Ø ${diameter} cm` : "-" }) as Product["specs"],
    highlights: (p.highlights || []) as string[],
    features: (p.features || []) as Product["features"],
    faq: (p.faq || []) as Product["faq"],
    customSpecs: (p.customSpecs || p.custom_specs || []) as Product["customSpecs"],
    location: (p.location || { city: "", dept: "", lat: 0, lng: 0 }) as Product["location"],
    seoContent: (p.seoContent || p.seo_content || undefined) as Product["seoContent"],
    customization: (p.customization || undefined) as Product["customization"],
  };
};
