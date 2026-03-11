import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { VariantConfiguratorWrapper } from "@/components/VariantConfiguratorWrapper";
import { RelatedProducts } from "@/components/RelatedProducts";
import { JsonLd } from "@/components/JsonLd";
import {
  getAllProducts,
  getRelatedProducts,
  getCompatibleAccessories,
} from "@/lib/data/products";
import {
  parseVariantSlug,
  findProductByVariantSlug,
} from "@/lib/variant-slugs";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo/schemas";

export const revalidate = 60;
export const dynamicParams = true;

type VariantPageProps = {
  params: Promise<{ variantSlug: string }>;
};

/**
 * Résout les données de la variante à partir du slug.
 */
async function resolveVariant(variantSlug: string) {
  const parsed = parseVariantSlug(variantSlug);
  if (!parsed) return null;

  const products = await getAllProducts();
  const product = findProductByVariantSlug(products, parsed);
  if (!product) return null;

  const configKey = `${parsed.finish}-${parsed.plancha}`;
  const config = product.configurations?.[configKey];
  if (!config) return null;

  const diameterData = config.diameters?.[String(parsed.diameter)];
  if (!diameterData) return null;

  return { product, parsed, configKey, config, diameterData };
}

export async function generateMetadata({ params }: VariantPageProps): Promise<Metadata> {
  const { variantSlug } = await params;
  const resolved = await resolveVariant(variantSlug);
  if (!resolved) return {};

  const { product, parsed, diameterData, config } = resolved;

  // Titre et description depuis le SEO content de la sous-fiche
  const seoContent = diameterData.seoContent || config.seoContent;
  const finishLabel = parsed.finish === 'corten' ? 'Acier Corten' : 'Acier Peint';
  const planchaLabel = parsed.plancha === 'inox' ? 'Plancha Inox' : 'Plancha Acier';

  // Extraire un titre depuis le premier titre de section SEO si disponible
  const seoTitle = seoContent?.sections?.[0]?.title;
  const title = seoTitle
    ? `${seoTitle} | Atelier LBF`
    : `${product.name} ${finishLabel} ${parsed.diameter}cm ${planchaLabel} | Atelier LBF`;
  const description = diameterData.description
    || `${product.name} en ${finishLabel.toLowerCase()} diamètre ${parsed.diameter}cm avec ${planchaLabel.toLowerCase()}. Brasero artisanal fabriqué en France par l'Atelier LBF.`;

  const images = config.images?.length
    ? config.images
    : product.images;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      url: `https://www.atelier-lbf.fr/brasero-plancha/${variantSlug}`,
      images: images.slice(0, 3).map((img: any) => ({
        url: img.src || img.url,
        alt: img.alt || product.name,
      })),
    },
    alternates: {
      canonical: `/brasero-plancha/${variantSlug}`,
    },
  };
}

export default async function VariantPage({ params }: VariantPageProps) {
  const { variantSlug } = await params;
  const resolved = await resolveVariant(variantSlug);
  if (!resolved) notFound();

  const { product, parsed, diameterData, config } = resolved;

  const reference = `REF-${product.slug.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const compatibleAccessorySlugs: string[] = product.specs?.compatibleAccessories || [];
  const compatibleAccessories = await getCompatibleAccessories(compatibleAccessorySlugs);
  const relatedProducts = await getRelatedProducts(product.slug, product.category, 8);

  // FAQ : diamètre > config > produit
  const faqs = config.faq || product.faq || [];

  // JSON-LD
  const finishLabel = parsed.finish === 'corten' ? 'Acier Corten' : 'Acier Peint';
  const planchaLabel = parsed.plancha === 'inox' ? 'Plancha Inox' : 'Plancha Acier';
  const variantName = `${product.name} ${finishLabel} ${parsed.diameter}cm ${planchaLabel}`;

  const productSchema = generateProductSchema(product, `${variantName} - Brasero artisanal fabriqué en France par l'Atelier LBF.`);
  // Override URL and name for this variant
  productSchema.url = `https://www.atelier-lbf.fr/brasero-plancha/${variantSlug}`;
  productSchema.name = variantName;
  if (diameterData.price) {
    productSchema.offers = {
      "@type": "Offer",
      price: diameterData.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Atelier LBF", url: "https://www.atelier-lbf.fr" },
    };
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Nos produits", url: "/produits" },
    { name: product.name, url: `/produits/${product.slug}` },
    { name: variantName, url: `/brasero-plancha/${variantSlug}` },
  ]);

  const faqSchema = generateFAQSchema(faqs);

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
              diameter: parsed.diameter,
              finish: parsed.finish,
              plancha: parsed.plancha,
            }}
          />
        </Container>
      </Section>

      {relatedProducts.length > 0 && (
        <Section className="py-8 sm:py-12 w-full max-w-none">
          <RelatedProducts products={relatedProducts} />
        </Section>
      )}
    </div>
  );
}
