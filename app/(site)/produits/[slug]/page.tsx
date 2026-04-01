import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { VariantConfiguratorWrapper } from "@/components/VariantConfiguratorWrapper";
import { RelatedProducts } from "@/components/RelatedProducts";
import { VariantLinks } from "@/components/VariantLinks";
import { JsonLd } from "@/components/JsonLd";
import { getProduct, getRelatedProducts, getCompatibleAccessories } from "@/lib/data/products";
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
      locale: "fr_FR",
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.atelier-lbf.fr'}/produits/${product.slug}`,
      images: product.images.slice(0, 3).map((image) => ({
        url: image.src,
        width: image.width,
        height: image.height,
        alt: image.alt,
      })),
    },
    other: {
      'product:price:amount': String(product.price),
      'product:price:currency': 'EUR',
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

  // Lancer toutes les requêtes indépendantes en parallèle
  const [compatibleAccessories, relatedProducts, reviewStats, blogPostsDirect, allPosts] =
    await Promise.all([
      getCompatibleAccessories(compatibleAccessorySlugs),
      getRelatedProducts(slug, product.category, 8),
      getReviewStats(product.slug),
      getBlogPostsForProduct(product.slug, 3),
      getAllBlogPosts(),
    ]);

  const blogPosts = blogPostsDirect.length > 0 ? blogPostsDirect : allPosts.slice(0, 3);

  // SEO dynamique — descriptions + FAQ générées par catégorie/variante
  const seo = generateProductSEO(product);

  // Utiliser les FAQ du produit si elles existent, sinon les FAQ SEO générées
  const productFAQs = product.faq && product.faq.length > 0
    ? product.faq
    : seo.faq;

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
          {/* SEO-09 : H1 sr-only rendu côté serveur (SSR) pour que Google indexe le titre
              même si le H1 visible est dans le Client Component VariantConfiguratorWrapper */}
          <h1 className="sr-only">{product.name}</h1>
          {/* SEO-11 : Breadcrumb HTML visible pour la navigation et le SEO */}
          <nav aria-label="Fil d'Ariane" className="px-4 sm:px-6 lg:px-8 py-2 text-sm text-gray-500">
            <ol className="flex items-center gap-1 flex-wrap">
              <li><a href="/" className="hover:text-gray-700">Accueil</a></li>
              <li aria-hidden="true" className="mx-1">›</li>
              <li><a href="/produits" className="hover:text-gray-700">Produits</a></li>
              <li aria-hidden="true" className="mx-1">›</li>
              <li className="text-gray-900 font-medium" aria-current="page">{product.name}</li>
            </ol>
          </nav>
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
