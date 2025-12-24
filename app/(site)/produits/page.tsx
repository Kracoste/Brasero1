import type { Metadata } from "next";

import { CatalogueView } from "@/components/CatalogueView";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { createClient } from "@/lib/supabase/server";
import { resolveDiameter } from "@/lib/utils";

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

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Parcourez nos braséros en acier corten et notre fendeur à bûches Made in France.",
};

// Désactiver le cache pour toujours afficher les dernières données
export const revalidate = 0;
export const dynamic = 'force-dynamic';

type SearchParams = {
  category?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  
  // Récupérer les produits depuis Supabase uniquement
  const supabase = await createClient();
  const { data: supabaseProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // Transformer les produits Supabase au format attendu (supporte camelCase et snake_case)
  const allProducts = (supabaseProducts || []).map((p: any) => {
    const specs = normalizeSpecs(p.specs);
    const diameter =
      resolveDiameter({
        ...p,
        specs,
      }) ?? 0;

    return {
      diameter,
      slug: p.slug,
      name: p.name,
      shortDescription: p.shortDescription || p.short_description || '',
      description: p.description || '',
      category: p.category,
      price: p.price,
      comparePrice: p.comparePrice || p.compare_price,
      discountPercent: p.discountPercent || p.discount_percent,
      badge: p.badge,
      images: p.images || [],
      material: p.material,
      format: (specs?.format as string | undefined) || p.format,
      madeIn: p.madeIn || p.made_in || 'France',
      thickness: p.thickness,
      height: p.height,
      weight: p.weight,
      warranty: p.warranty,
      availability: p.availability || 'En stock',
      shipping: p.shipping,
      popularScore: p.popularScore || p.popular_score || 50,
      inStock: p.inStock ?? p.in_stock ?? true,
      specs: specs || {},
      highlights: p.highlights || [],
      features: p.features || [],
      faq: p.faq || [],
      customSpecs: p.customSpecs || p.custom_specs || [],
      location: p.location,
    };
  });
  
  const filteredProducts =
    category === "promotions"
      ? allProducts
          .filter((product) => typeof product.discountPercent === "number" && product.discountPercent > 0)
          .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))
      : category === "accessoire"
      ? allProducts.filter((product) => product.category === category && (!product.discountPercent || product.discountPercent === 0))
      : category
      ? allProducts.filter((product) => product.category === category)
      : allProducts.filter((product) => !product.discountPercent || product.discountPercent === 0);

  const title = category === "brasero"
    ? "Nos Braséros"
    : category === "fendeur"
    ? "Fendeur à bûches"
    : category === "promotions"
    ? "Nos Promotions"
    : category === "accessoire"
    ? "Nos Accessoires"
    : "Nos créations";

  const description = category === "brasero"
    ? "Diamètres de 55 à 100 cm, aciers corten ou thermolaqués prêts à rejoindre votre terrasse."
    : category === "fendeur"
    ? "Préparez vos bûches en toute sécurité avec notre fendeur manuel fabriqué en France."
    : category === "accessoire"
    ? "Accessoires compatibles et indispensables pour compléter votre braséro."
    : category === "promotions"
    ? "Découvrez nos offres limitées et promotions exceptionnelles jusqu'à 40%."
    : "Diamètres de 55 à 100 cm, aciers corten ou thermolaqués et accessoires prêts à rejoindre votre terrasse. Filtres et tri vous permettent de comparer en un coup d'œil.";

  const containerClass = 'space-y-6 sm:space-y-10 w-full max-w-[1600px] px-3 sm:px-4 lg:px-0';

  return (
    <Section className="pb-24 bg-white">
      <Container className={containerClass}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2d2d2d] mb-4 sm:mb-8">{title.toUpperCase()}</h1>
        <div>
          <CatalogueView
            products={filteredProducts}
            showCategoryFilters={category !== "accessoire" && category !== "promotions"}
            category={category}
          />
        </div>
      </Container>
    </Section>
  );
}
