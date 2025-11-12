import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/Badge";
import { Container } from "@/components/Container";
import { FAQ } from "@/components/FAQ";
import { FeatureList } from "@/components/FeatureList";
import { LeafletMap } from "@/components/LeafletMap";
import { Price } from "@/components/Price";
import { ProductGallery } from "@/components/ProductGallery";
import { Section } from "@/components/Section";
import { AddToCartButton } from "@/components/AddToCartButton";
import { products } from "@/content/products";
import { getProductBySlug } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(products, slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images.slice(0, 1).map((image) => ({
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
  const product = getProductBySlug(products, slug);
  if (!product) notFound();

  return (
    <div className="pb-24">
      <Section className="pt-10">
        <Container className="grid gap-12 lg:grid-cols-2">
          <ProductGallery key={product.slug} product={product} />
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge>{product.badge}</Badge>
              <h1 className="font-display text-4xl font-semibold text-clay-900">{product.name}</h1>
              <p className="text-base text-slate-600">{product.description}</p>
            </div>
            <Price amount={product.price} />
            <div className="space-y-4 rounded-3xl border border-clay-100 bg-white/90 p-6 shadow-inner">
              <AddToCartButton product={product} />
              <p className="text-sm text-slate-500">
                {product.availability} — {product.shipping}
              </p>
            </div>
            <div className="grid gap-4 rounded-3xl border border-slate-100 bg-white/70 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-400">Acier</p>
                <p className="text-sm font-semibold text-clay-900">{product.specs.acier}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Dimensions</p>
                <p className="text-sm font-semibold text-clay-900">{product.specs.dimensions}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Épaisseur</p>
                <p className="text-sm font-semibold text-clay-900">{product.specs.epaisseur}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">Poids</p>
                <p className="text-sm font-semibold text-clay-900">{product.specs.poids}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Points forts</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {product.highlights.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-16">
          <FeatureList product={product} />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-semibold text-clay-900">
                Fabriqué à Moncoutant (79)
              </h2>
              <p className="text-base text-slate-600">
                Chaque {product.category === "brasero" ? "braséro" : "accessoire"} est assemblé,
                contrôlé et conditionné dans notre atelier aux Deux-Sèvres. Les soudures sont
                doublées et le numéro de série est gravé sous le pied.
              </p>
              <p className="text-sm text-slate-500">Retrait sur place possible sur rendez-vous.</p>
            </div>
            <LeafletMap
              lat={siteConfig.atelier.lat}
              lng={siteConfig.atelier.lng}
              zoom={12}
              markerLabel="Brasero Atelier"
            />
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold text-clay-900">FAQ</h3>
            <FAQ items={product.faq} className="mt-6" />
          </div>
        </Container>
      </Section>
    </div>
  );
}
