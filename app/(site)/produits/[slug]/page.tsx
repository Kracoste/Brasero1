import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { RelatedProducts } from "@/components/RelatedProducts";
import { createClient } from "@/lib/supabase/server";
import { mapSupabaseProduct } from "@/lib/utils";
import type { Product } from "@/lib/schema";

// ISR : revalidation toutes les 60s (bon compromis fraîcheur/performance)
export const revalidate = 60;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

// Fonction pour récupérer un produit depuis Supabase uniquement
async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data: p } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('slug', slug)
    .single();

  if (!p) return null;
  return mapSupabaseProduct(p);
}

// Fonction pour récupérer les produits similaires (même catégorie, excluant le produit actuel)
const PRODUCT_COLUMNS = 'slug, name, price, compare_price, discount_percent, short_description, description, category, badge, images, material, diameter, thickness, height, weight, bowl_thickness, base_thickness, warranty, availability, shipping, popularScore, on_demand, specs, highlights, features, faq, customSpecs, location, variants, config_images, configurations';

async function getRelatedProducts(currentSlug: string, category: string, limit: number = 8) {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('category', category)
    .neq('slug', currentSlug)
    .limit(limit);

  if (!products) return [];
  return products.map(mapSupabaseProduct).filter(Boolean) as Product[];
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
