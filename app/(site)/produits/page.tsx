import type { Metadata } from "next";

import { CatalogueView } from "@/components/CatalogueView";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { products } from "@/content/products";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Parcourez nos braséros en acier corten et notre fendeur à bûches Made in France.",
};

type SearchParams = {
  category?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  
  const filteredProducts = category 
    ? products.filter(p => p.category === category)
    : products;

  const title = category === 'brasero' 
    ? 'Nos Braséros'
    : category === 'fendeur'
    ? 'Fendeur à bûches'
    : 'Nos créations';
    
  const description = category === 'brasero'
    ? 'Diamètres de 55 à 100 cm, aciers corten ou thermolaqués prêts à rejoindre votre terrasse.'
    : category === 'fendeur'
    ? 'Préparez vos bûches en toute sécurité avec notre fendeur manuel fabriqué en France.'
    : 'Diamètres de 55 à 100 cm, aciers corten ou thermolaqués et accessoires prêts à rejoindre votre terrasse. Filtres et tri vous permettent de comparer en un coup d\'œil.';

  const containerClass = 'space-y-10 w-full max-w-[1600px] px-0 sm:px-4 lg:px-0';

  return (
    <Section className="pb-24 bg-white">
      <Container className={containerClass}>
        <h1 className="text-4xl font-bold text-[#2d2d2d] mb-8 px-4 sm:px-0">NOS BRASÉROS</h1>
        <div className="px-4 sm:px-0">
          <CatalogueView products={filteredProducts} />
        </div>
      </Container>
    </Section>
  );
}
