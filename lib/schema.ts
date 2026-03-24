import { z } from "zod";

const productImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  blurDataURL: z.string(),
});

const locationSchema = z.object({
  city: z.string(),
  dept: z.string(),
  lat: z.number(),
  lng: z.number(),
});

const specSchema = z.object({
  acier: z.string(),
  epaisseur: z.string(),
  dimensions: z.string(),
  poids: z.string(),
  compatibilite: z.string().optional(),
  numberOfGuests: z.string().optional(),
  fuel: z.string().optional(),
  fuelType: z.array(z.string()).optional(),
  painting: z.string().optional(),
  planchaMaterial: z.enum(["acier", "inox"]).optional(),
  format: z.string().optional(),
  compatibleAccessories: z.array(z.string()).optional(),
  shortName: z.string().optional(),
  imageScale: z.number().optional(),
  detailImageScale: z.number().optional(),
  detailImageOffsetX: z.number().optional(),
  characteristics: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
});

export const productVariantSchema = z.object({
  label: z.string(),
  diameter: z.number().optional(),
  finish: z.enum(["corten", "peint"]).optional(),
  paintType: z.string().optional(),
  planchaMaterial: z.enum(["acier", "inox"]).optional(),
  height: z.number().optional(),
  weight: z.union([z.string(), z.number()]).optional(),
  priceBrasero: z.number().optional(),
  pricePlancha: z.number().optional(),
  price: z.number(),
});

export type ProductVariant = z.infer<typeof productVariantSchema>;

/**
 * Sous-fiche de configuration : contient toutes les données spécifiques
 * à une combinaison (finition × plancha × diamètre).
 * Stocké dans le champ `configurations` du produit (JSONB en base).
 */
/** Schema réutilisable pour le contenu SEO riche */
const seoContentSchema = z.object({
  sections: z.array(z.object({
    title: z.string(),
    content: z.string().optional(),
    blocks: z.array(z.object({
      subtitle: z.string().optional(),
      text: z.string().optional(),
    })).optional(),
    bullets: z.array(z.string()).optional(),
  })),
});

export type SeoContent = z.infer<typeof seoContentSchema>;

/**
 * Données spécifiques à un diamètre dans une sous-fiche.
 * Chaque diamètre coché a son propre prix et ses dimensions.
 */
const diameterDataSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  priceBrasero: z.number().optional(),
  pricePlancha: z.number().optional(),
  weight: z.union([z.string(), z.number()]).optional(),
  height: z.number().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  bowlThickness: z.number().optional(),
  baseThickness: z.number().optional(),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  characteristics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  seoContent: seoContentSchema.optional(),
});

export type DiameterData = z.infer<typeof diameterDataSchema>;

const productConfigurationSchema = z.object({
  images: z.array(productImageSchema).optional(),
  description: z.string().optional(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  characteristics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  painting: z.string().optional(),
  seoContent: seoContentSchema.optional(),
  /** Données par diamètre : clé = "50" | "80" | "100" */
  diameters: z.record(z.string(), diameterDataSchema).optional(),
});

export type ProductConfiguration = z.infer<typeof productConfigurationSchema>;

const faceCustomizationSchema = z.object({
  type: z.enum(['image', 'text']),
  imageUrl: z.string().optional(),
  fileName: z.string().optional(),
  text: z.string().optional(),
  font: z.enum(['serif', 'sans', 'script', 'mono', 'display']).optional(),
});

export type FaceCustomization = z.infer<typeof faceCustomizationSchema>;

const customizationSchema = z.object({
  enabled: z.boolean(),
  schemaImage: z.string().optional(),
  numberOfFaces: z.number().optional(),
  priceSupplement: z.number().optional(),
});

export const productSchema = z.object({
  slug: z.string(),
  name: z.string(),
  category: z.enum(["brasero", "fendeur", "accessoire", "range-buches"]),
  price: z.number(),
  comparePrice: z.number().optional(),
  discountPercent: z.number().optional(),
  shortDescription: z.string(),
  description: z.string(),
  madeIn: z.literal("France"),
  material: z.string(),
  diameter: z.number(),
  length: z.number().optional(),
  width: z.number().optional(),
  thickness: z.number(),
  height: z.number(),
  weight: z.number(),
  bowlThickness: z.number().optional(),
  baseThickness: z.number().optional(),
  warranty: z.string(),
  availability: z.string(),
  shipping: z.string(),
  popularScore: z.number(),
  badge: z.string(),
  onDemand: z.boolean().optional(),
  specs: specSchema,
  highlights: z.array(z.string()),
  features: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  ),
  images: z.array(productImageSchema),
  location: locationSchema,
  faq: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
  variants: z.array(productVariantSchema).optional(),
  configImages: z.record(z.string(), z.array(productImageSchema)).optional(),
  /** Sous-fiches complètes par combinaison (clé: "finish-plancha", ex: "corten-inox") */
  configurations: z.record(z.string(), productConfigurationSchema).optional(),
  customSpecs: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  seoContent: seoContentSchema.optional(),
  customization: customizationSchema.optional(),
});

export type Product = z.infer<typeof productSchema>;
