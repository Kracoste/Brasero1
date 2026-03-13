import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { VariantConfiguratorWrapper } from "@/components/VariantConfiguratorWrapper";
import { RelatedProducts } from "@/components/RelatedProducts";
import { JsonLd } from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { mapSupabaseProduct } from "@/lib/utils";
import type { Product } from "@/lib/schema";
import {
  generateProductSchema,
  generateProductBreadcrumb,
  generateFAQSchema,
} from "@/lib/seo/schemas";
import { getBlogPostsForProduct } from "@/lib/data/blog";
import {
  generateProductSEO,
  generateProductMetaTitle,
  generateProductMetaDescription,
} from "@/lib/seo/product-seo";

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
      images: product.images.slice(0, 3).map((image: any) => ({
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
      images: product.images.slice(0, 1).map((img: any) => img.src),
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

  // Récupérer les articles de blog liés à ce produit (maillage interne SEO)
  const relatedBlogPosts = await getBlogPostsForProduct(slug, 3);

  // SEO dynamique — descriptions + FAQ générées par catégorie/variante
  const seo = generateProductSEO(product);

  // Utiliser les FAQ du produit si elles existent, sinon les FAQ SEO générées
  const productFAQs = product.faq && product.faq.length > 0
    ? product.faq
    : seo.faq;

  // JSON-LD schemas
  const productSchema = generateProductSchema(product, seo.description);
  const breadcrumbSchema = generateProductBreadcrumb(product);
  const faqSchema = generateFAQSchema(productFAQs);

  return (
    <div className="bg-white pb-16 sm:pb-24">
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <Section className="pt-4 sm:pt-6 lg:pt-10">
        <Container className="max-w-6xl px-3 sm:px-4 lg:px-6">
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

      {/* Articles de blog liés (maillage interne SEO) */}
      {relatedBlogPosts.length > 0 && (
        <Section className="py-8 sm:py-12">
          <Container className="max-w-6xl px-3 sm:px-4 lg:px-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-slate-900 mb-6">
              Guides et conseils pour votre brasero
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedBlogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block p-5 border border-slate-200 hover:shadow-md hover:border-[#CD853F] transition-all group"
                >
                  <span className="text-xs text-[#8B4513] font-medium uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="font-semibold text-slate-900 mt-1 mb-2 group-hover:text-[#8B4513] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.read_time} min</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[#8B4513] font-medium group-hover:gap-2 transition-all">
                      Lire <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Section produits similaires - pleine largeur */}
      {relatedProducts.length > 0 && (
        <Section className="py-8 sm:py-12 w-full max-w-none">
          <RelatedProducts products={relatedProducts} />
        </Section>
      )}
    </div>
  );
}
