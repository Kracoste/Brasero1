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

  return (
    <Section className="pb-24">
      <Container className="space-y-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-slate-400">Catalogue</p>
          <h1 className="font-display text-4xl font-semibold text-clay-900">{title}</h1>
          <p className="text-base text-slate-400">
            {description}
          </p>
        </div>
        <CatalogueView products={filteredProducts} />
      </Container>
    </Section>
  );
}
