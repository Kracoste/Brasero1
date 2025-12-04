import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/Badge";
import { AccessoryGrid } from "@/components/AccessoryGrid";
import { Container } from "@/components/Container";
import { FAQ } from "@/components/FAQ";
import { LeafletMap } from "@/components/LeafletMap";
import { Price } from "@/components/Price";
import { ProductGallery } from "@/components/ProductGallery";
import { Section } from "@/components/Section";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductTabs } from "@/components/ProductTabs";
import { createClient } from "@/lib/supabase/server";
import { resolveDiameter } from "@/lib/utils";
import { Users, Flame, Box, Ruler, Weight } from "lucide-react";

// Désactiver le cache pour toujours afficher les dernières données
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

// Fonction pour récupérer un produit depuis Supabase uniquement
async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data: p } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!p) return null;

  const specs = normalizeSpecs(p.specs);
  const diameter =
    resolveDiameter({
      ...p,
      specs,
    }) ?? 0;

  // Transformer le produit Supabase au format attendu (supporte camelCase et snake_case)
  return {
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription || p.short_description || '',
    description: p.description || '',
    category: p.category,
    price: p.price,
    comparePrice: p.comparePrice || p.compare_price,
    discountPercent: p.discountPercent || p.discount_percent,
    badge: p.badge || 'Nouveau',
    images: (p.images || []).map((img: any) => ({
      src: img.src,
      alt: img.alt || p.name,
      width: img.width || 800,
      height: img.height || 600,
    })),
    material: p.material || 'Acier',
    madeIn: p.madeIn || p.made_in || 'France',
    diameter,
    thickness: p.thickness || 0,
    height: p.height || 0,
    weight: p.weight || 0,
    warranty: p.warranty || '',
    availability: p.availability || 'En stock',
    shipping: p.shipping || '',
    popularScore: p.popularScore || p.popular_score || 50,
    inStock: p.inStock ?? p.in_stock ?? true,
    specs:
      (specs && Object.keys(specs).length > 0
        ? specs
        : { dimensions: diameter ? `Ø ${diameter} cm` : '-' }) ?? {},
    highlights: p.highlights || [],
    features: p.features || [],
    faq: p.faq || [],
    customSpecs: p.customSpecs || p.custom_specs || [],
    location: p.location,
  };
}

// Récupérer tous les accessoires depuis Supabase
async function getAccessories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'accessoire')
    .order('popularScore', { ascending: false });

  return (data || []).map((p: any) => ({
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription || p.short_description || '',
    category: p.category,
    price: p.price,
    comparePrice: p.comparePrice || p.compare_price,
    discountPercent: p.discountPercent || p.discount_percent,
    images: p.images || [],
    popularScore: p.popularScore || p.popular_score || 50,
  }));
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
  
  // Récupérer les accessoires depuis Supabase
  const allAccessories = await getAccessories();
  const compatibleAccessories = allAccessories
    .filter((item) => item.slug !== product.slug)
    .slice(0, 20);

  return (
    <div className="bg-[#f9f6f1] pb-24">
      <Section className="pt-10">
        <Container className="max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(320px,1fr)_minmax(420px,1fr)] items-start">
            <div className="space-y-16">
              <ProductGallery key={product.slug} product={product} />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  <span>France Braseros</span>
                  <Badge>{product.badge}</Badge>
                </div>
                <h1 className="font-display text-4xl font-semibold text-slate-900">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="font-semibold">
                    Référence&nbsp;: <span className="font-mono text-slate-900">{reference}</span>
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    En stock
                  </span>
                </div>
                <p className="text-base leading-relaxed text-slate-600">{product.description}</p>
              </div>

              {product.category !== "accessoire" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <Users className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Nombre de convives : </span>
                      <span className="text-sm text-slate-600">{product.diameter <= 50 ? "4 à 6" : product.diameter <= 70 ? "6 à 8" : product.diameter <= 90 ? "10 à 12" : "12 à 16"} personnes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <Flame className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Type de combustible : </span>
                      <span className="text-sm text-slate-600">Bois</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <Box className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Matière : </span>
                      <span className="text-sm text-slate-600">{product.material}</span>
                    </div>
                  </div>
                  {product.specs?.dimensions && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                        <Ruler className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-800">Dimensions : </span>
                        <span className="text-sm text-slate-600">{product.specs.dimensions}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                      <Weight className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Poids : </span>
                      <span className="text-sm text-slate-600">{product.weight} kg</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Price amount={product.price} className="text-4xl font-bold" />
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="py-0 sm:py-4">
        <Container className="space-y-2">
          <ProductTabs product={product} accessories={compatibleAccessories} />
        </Container>
      </Section>
    </div>
  );
}
