import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/Badge";
import { Container } from "@/components/Container";
import { ProductGallery } from "@/components/ProductGallery";
import { Section } from "@/components/Section";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductPurchaseSection } from "@/components/ProductPurchaseSection";
import { createClient } from "@/lib/supabase/server";
import { resolveDiameter } from "@/lib/utils";
import type { Product } from "@/lib/schema";

// Cache ISR de 60 secondes - les modifications admin invalident le cache via revalidatePath
export const revalidate = 60;

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

  return (
    <div className="bg-[#f9f6f1] pb-24">
      <Section className="pt-6 sm:pt-10">
        <Container className="max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:gap-10 lg:grid-cols-2 items-start">
            <div className="space-y-8 sm:space-y-16">
              <ProductGallery key={product.slug} product={product} />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  <span>Atelier LBF</span>
                  <Badge>{product.badge}</Badge>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="font-semibold">
                    Référence&nbsp;: <span className="font-mono text-slate-900">{reference}</span>
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    En stock
                  </span>
                </div>
              </div>

              <ProductPurchaseSection 
                product={product} 
                compatibleAccessorySlugs={compatibleAccessorySlugs}
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-0 sm:py-4">
        <Container className="space-y-2 px-4 sm:px-6">
          <ProductTabs product={product} accessories={[]} />
        </Container>
      </Section>
    </div>
  );
}
