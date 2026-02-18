import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { RelatedProducts } from "@/components/RelatedProducts";
import { createClient } from "@/lib/supabase/server";
import { resolveDiameter } from "@/lib/utils";
import type { Product } from "@/lib/schema";

// Pas de cache ISR - les données sont toujours fraîches
export const revalidate = 0;
export const dynamic = 'force-dynamic';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const normalizeSpecs = (specs: any) => {
  if (!specs) return {};
  if (typeof specs === "string") {
    try {
      return JSON.parse(specs);
    } catch {
      return {};
    }
  }
  return specs;
};

const mapDbProductToProduct = (p: any): Product | null => {
  if (!p) return null;
  const specs = normalizeSpecs(p.specs);
  const diameter =
    resolveDiameter({
      ...p,
      specs,
    }) ?? 0;

  return {
    slug: p.slug ?? "",
    name: p.name ?? "Produit",
    shortDescription: p.shortDescription || p.short_description || "",
    description: p.description || "",
    category: (p.category as Product["category"]) || "accessoire",
    price: Number(p.price ?? 0),
    comparePrice: p.comparePrice || p.compare_price,
    discountPercent: p.discountPercent || p.discount_percent,
    badge: p.badge || "Nouveau",
    images: (p.images || []).map((img: any) => ({
      src: img.src,
      alt: img.alt || p.name || "Image produit",
      width: img.width || 800,
      height: img.height || 600,
      blurDataURL: img.blurDataURL || "",
    })),
    material: p.material || "Acier",
    madeIn: "France",
    diameter,
    length: p.length || 0,
    width: p.width || 0,
    thickness: p.thickness || 0,
    height: p.height || 0,
    weight: p.weight || 0,
    warranty: p.warranty || "Garantie atelier",
    availability: p.availability || "En stock",
    shipping: p.shipping || "",
    popularScore: p.popularScore || p.popular_score || 50,
    onDemand: p.onDemand ?? p.on_demand ?? false,
    specs:
      (specs && Object.keys(specs).length > 0
        ? specs
        : { dimensions: diameter ? `Ø ${diameter} cm` : "-" }) ?? {},
    highlights: p.highlights || [],
    features: p.features || [],
    faq: p.faq || [],
    customSpecs: p.customSpecs || p.custom_specs || [],
    location: p.location || { city: "", dept: "", lat: 0, lng: 0 },
  };
};

// Fonction pour récupérer un produit depuis Supabase uniquement
async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data: p } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  return mapDbProductToProduct(p);
}

// Fonction pour récupérer les produits similaires (même catégorie, excluant le produit actuel)
async function getRelatedProducts(currentSlug: string, category: string, limit: number = 8) {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('slug', currentSlug)
    .limit(limit);

  if (!products) return [];
  return products.map(mapDbProductToProduct).filter(Boolean) as Product[];
}

// Fonction pour récupérer les accessoires compatibles (server-side)
async function getCompatibleAccessories(slugs: string[]) {
  if (!slugs || slugs.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, price, images, category')
    .in('slug', slugs)
    .order('name');

  if (error || !data) return [];
  return data;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images.slice(0, 1).map((image: any) => ({
        url: image.src,
        width: image.width,
        height: image.height,
        alt: image.alt,
      })),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const reference = `REF-${product.slug.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  
  // Récupérer les slugs des accessoires compatibles depuis les specs du produit
  const compatibleAccessorySlugs: string[] = product.specs?.compatibleAccessories || [];

  // Récupérer les accessoires compatibles côté serveur (instantané)
  const compatibleAccessories = await getCompatibleAccessories(compatibleAccessorySlugs);

  // Récupérer les produits similaires (même catégorie)
  const relatedProducts = await getRelatedProducts(slug, product.category, 8);

  return (
    <div className="bg-white pb-16 sm:pb-24">
      <Section className="pt-4 sm:pt-6 lg:pt-10">
        <Container className="max-w-6xl px-3 sm:px-4 lg:px-6">
          <ProductConfigurator
            product={product}
            reference={reference}
            compatibleAccessorySlugs={compatibleAccessorySlugs}
            preloadedAccessories={compatibleAccessories}
          />
        </Container>
      </Section>

      {/* Section produits similaires - pleine largeur */}
      {relatedProducts.length > 0 && (
        <Section className="py-8 sm:py-12 w-full max-w-none">
          <RelatedProducts products={relatedProducts} />
        </Section>
      )}
    </div>
  );
}
