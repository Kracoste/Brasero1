import type { Metadata } from "next";

import { CatalogueView } from "@/components/CatalogueView";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { createClient } from "@/lib/supabase/server";
import { mapSupabaseProduct } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Parcourez nos braséros en acier corten et notre fendeur à bûches Made in France.",
};

// Force dynamic rendering — données toujours fraîches depuis Supabase
export const dynamic = 'force-dynamic';

type SearchParams = {
  category?: string;
  section?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  const section = params.section;
  
  // Récupérer les produits depuis Supabase uniquement
  const supabase = await createClient();
  const { data: supabaseProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // Transformer les produits Supabase au format attendu
  const allProducts = (supabaseProducts || [])
    .map((p: Record<string, unknown>) => mapSupabaseProduct(p))
    .filter(Boolean) as NonNullable<ReturnType<typeof mapSupabaseProduct>>[];
  
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
    : category === "range-buches"
    ? "Ranges Bûches"
    : category === "accessoire" && section === "range-buches"
    ? "Ranges Bûches"
    : category === "accessoire"
    ? "Nos Accessoires"
    : "Nos créations";

  const description = category === "brasero"
    ? "Diamètres de 55 à 100 cm, aciers corten ou thermolaqués prêts à rejoindre votre terrasse."
    : category === "fendeur"
    ? "Préparez vos bûches en toute sécurité avec notre fendeur manuel fabriqué en France."
    : category === "range-buches"
    ? "Découvrez nos ranges bûches design et pratiques pour organiser votre bois."
    : category === "accessoire" && section === "range-buches"
    ? "Découvrez nos ranges bûches design et pratiques pour organiser votre bois."
    : category === "accessoire"
    ? "Accessoires compatibles et indispensables pour compléter votre braséro."
    : category === "promotions"
    ? "Découvrez nos offres limitées et promotions exceptionnelles jusqu'à 40%."
    : "Diamètres de 55 à 100 cm, aciers corten ou thermolaqués et accessoires prêts à rejoindre votre terrasse. Filtres et tri vous permettent de comparer en un coup d'œil.";

  const containerClass = 'space-y-6 sm:space-y-10 w-full max-w-[1600px] px-3 sm:px-4 lg:px-0';

  return (
    <Section className="pb-24 bg-[var(--background)]">
      <Container className={containerClass}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2d2d2d] mb-4 sm:mb-8">{title.toUpperCase()}</h1>
        <div>
          <CatalogueView
            products={filteredProducts}
            showCategoryFilters={category !== "accessoire" && category !== "promotions"}
            category={category}
            initialSection={section}
          />
        </div>
      </Container>
    </Section>
  );
}
