import type { Metadata } from "next";

import { CatalogueView } from "@/components/CatalogueView";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { mapSupabaseProduct } from "@/lib/utils";
import { PRODUCT_COLUMNS } from "@/lib/data/products";
import { getReviewStatsBatch } from "@/lib/data/reviews-batch";
import { generateBreadcrumbSchema } from "@/lib/seo/schemas";

const CATEGORY_META: Record<string, { title: string; description: string; keywords: string[] }> = {
  brasero: {
    title: "Braseros artisanaux acier corten | Made in France | Atelier LBF",
    description: "Collection de braseros artisanaux fabriqués en France. Acier corten ou noir, diamètres 55 à 100 cm. Livraison soignée, garantie 2 ans.",
    keywords: ["brasero artisanal", "brasero corten", "brasero acier", "brasero français", "brasero jardin", "brasero terrasse"],
  },
  fendeur: {
    title: "Fendeur à bûches professionnel | Fabriqué en France | Atelier LBF",
    description: "Fendeur à bûches robuste et sécurisé, fabriqué artisanalement en France. Préparez votre bois de chauffage facilement. Garantie 2 ans.",
    keywords: ["fendeur à bûches", "fendeur bois", "fendeur manuel", "fendeur français", "couper bûches"],
  },
  accessoire: {
    title: "Accessoires pour brasero : plancha, grille, couvercle | Atelier LBF",
    description: "Complétez votre brasero avec nos accessoires artisanaux : planchas amovibles, grilles de cuisson, couvercles, pare-étincelles. Fabriqués en France.",
    keywords: ["accessoire brasero", "plancha brasero", "grille brasero", "couvercle brasero", "pare-étincelles"],
  },
  "range-buches": {
    title: "Range-bûches design et pratique | Made in France | Atelier LBF",
    description: "Range-bûches artisanaux en acier pour organiser et stocker votre bois de chauffage avec style. Fabriqués en France.",
    keywords: ["range-bûches", "rangement bois", "range-bûches design", "range-bûches acier"],
  },
  promotions: {
    title: "Promotions braseros : jusqu'à -40% | Atelier LBF",
    description: "Profitez de nos promotions exceptionnelles sur les braseros artisanaux et accessoires. Jusqu'à -40% sur une sélection de produits Made in France.",
    keywords: ["promotion brasero", "brasero pas cher", "soldes brasero", "réduction brasero", "brasero promo"],
  },
};

const DEFAULT_META = {
  title: "Catalogue braseros, fendeurs et accessoires | Atelier LBF",
  description: "Braseros artisanaux, fendeurs à bûches et accessoires fabriqués en France. Acier corten, diamètres 55 à 100 cm. Filtres et tri disponibles.",
  keywords: ["catalogue brasero", "brasero artisanal", "fendeur à bûches", "accessoire brasero", "made in France"],
};

type SearchParams = {
  category?: string;
  section?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category;
  const meta = (category && CATEGORY_META[category]) || DEFAULT_META;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: category ? `/produits?category=${category}` : "/produits",
    },
  };
}

// ISR : revalidation toutes les 60s (bon compromis fraîcheur/performance)
export const revalidate = 60;

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  const section = params.section;
  
  // Récupérer les produits depuis Supabase uniquement
  const supabase = await createClient();
  const { data: supabaseProducts } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
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

  const reviewStatsMap = await getReviewStatsBatch(filteredProducts.map((p) => p.slug));

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

  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Nos produits", url: "/produits" },
    ...(category && title !== "Nos créations"
      ? [{ name: title, url: `/produits?category=${category}` }]
      : []),
  ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description,
    url: category
      ? `https://www.atelier-lbf.fr/produits?category=${category}`
      : "https://www.atelier-lbf.fr/produits",
    numberOfItems: filteredProducts.length,
    provider: {
      "@type": "Organization",
      name: "Atelier LBF",
      url: "https://www.atelier-lbf.fr",
    },
  };

  return (
    <Section className="pb-24 bg-[var(--background)]">
      <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
      <JsonLd data={collectionSchema} />
      <Container className={containerClass}>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2d2d2d] mb-4 sm:mb-8">{title.toUpperCase()}</h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl mb-8">
          {description}
        </p>
        <div>
          <CatalogueView
            products={filteredProducts}
            showCategoryFilters={category !== "accessoire" && category !== "promotions"}
            category={category}
            initialSection={section}
            reviewStatsMap={reviewStatsMap}
          />
        </div>
      </Container>
    </Section>
  );
}
