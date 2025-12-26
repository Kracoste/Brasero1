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
});

export const productSchema = z.object({
  slug: z.string(),
  name: z.string(),
  category: z.enum(["brasero", "fendeur", "accessoire"]),
  price: z.number(),
  comparePrice: z.number().optional(),
  discountPercent: z.number().optional(),
  shortDescription: z.string(),
  description: z.string(),
  madeIn: z.literal("France"),
  material: z.string(),
  diameter: z.number(),
  thickness: z.number(),
  height: z.number(),
  weight: z.number(),
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
  customSpecs: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
});

export type Product = z.infer<typeof productSchema>;
