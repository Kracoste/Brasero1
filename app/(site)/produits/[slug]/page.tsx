import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { VariantConfiguratorWrapper } from "@/components/VariantConfiguratorWrapper";
import { RelatedProducts } from "@/components/RelatedProducts";
import { VariantLinks } from "@/components/VariantLinks";
import { JsonLd } from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { mapSupabaseProduct } from "@/lib/utils";
import type { Product } from "@/lib/schema";
import {
  generateProductSchema,
  generateProductBreadcrumb,
  generateFAQSchema,
} from "@/lib/seo/schemas";
import {
  generateProductSEO,
  generateProductMetaTitle,
  generateProductMetaDescription,
} from "@/lib/seo/product-seo";
import { getReviewStats } from "@/lib/data/reviews";
import { getBlogPostsForProduct, getAllBlogPosts } from "@/lib/data/blog";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";

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
const PRODUCT_COLUMNS = 'slug, name, price, compare_price, discount_percent, short_description, description, category, badge, images, material, diameter, thickness, height, weight, bowl_thickness, base_thickness, warranty, availability, shipping, popularScore, on_demand, specs, highlights, features, faq, customSpecs, location, variants, config_images, configurations, seo_content';

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

  const seo = generateProductSEO(product);
  const title = generateProductMetaTitle(product);
  const description = generateProductMetaDescription(product);

  return {
    title,
    description,
    keywords: seo.keywords,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      url: `https://www.atelier-lbf.fr/produits/${product.slug}`,
      images: product.images.slice(0, 3).map((image) => ({
        url: image.src,
        width: image.width,
        height: image.height,
        alt: image.alt,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: product.images.slice(0, 1).map((img) => img.src),
    },
    alternates: {
      canonical: `/produits/${product.slug}`,
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

  // SEO dynamique — descriptions + FAQ générées par catégorie/variante
  const seo = generateProductSEO(product);

  // Utiliser les FAQ du produit si elles existent, sinon les FAQ SEO générées
  const productFAQs = product.faq && product.faq.length > 0
    ? product.faq
    : seo.faq;

  // Review stats pour AggregateRating (étoiles dans Google)
  const reviewStats = await getReviewStats(product.slug);

  // Articles blog associés (maillage interne produit → blog)
  let blogPosts = await getBlogPostsForProduct(product.slug, 3);
  if (blogPosts.length === 0) {
    const allPosts = await getAllBlogPosts();
    blogPosts = allPosts.slice(0, 3);
  }

  // JSON-LD schemas
  const productSchema = generateProductSchema(product, seo.description, reviewStats);
  const breadcrumbSchema = generateProductBreadcrumb(product);
  const faqSchema = generateFAQSchema(productFAQs);

  return (
    <div className="bg-white pb-16 sm:pb-24">
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <Section className="pt-4 sm:pt-6 lg:pt-10">
        <Container className="max-w-6xl px-3 sm:px-4 lg:px-6">
          <h1 className="sr-only">{product.name}</h1>
          <VariantConfiguratorWrapper
            product={product}
            reference={reference}
            compatibleAccessorySlugs={compatibleAccessorySlugs}
            preloadedAccessories={compatibleAccessories}
            initialSelections={{
              diameter: product.diameter,
              finish: product.material?.toLowerCase().includes('corten') ? 'corten' : 'peint',
              plancha: product.specs?.planchaMaterial ?? 'acier',
            }}
          />
        </Container>
      </Section>

      {/* Liens internes vers toutes les configurations /brasero-plancha/ — maillage SEO */}
      <VariantLinks product={product} />

      {/* Section produits similaires - pleine largeur */}
      {relatedProducts.length > 0 && (
        <Section className="py-8 sm:py-12 w-full max-w-none">
          <RelatedProducts products={relatedProducts} />
        </Section>
      )}

      {/* Articles blog associés — maillage interne SEO */}
      <RelatedBlogPosts posts={blogPosts} />
    </div>
  );
}
