import type { Metadata } from "next";

import { CatalogueView } from "@/components/CatalogueView";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { products } from "@/content/products";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Parcourez nos braséros en acier corten et notre fendeur à bûches Made in France.",
};

export default function ProductsPage() {
  return (
    <Section className="pb-24">
      <Container className="space-y-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-slate-400">Catalogue</p>
          <h1 className="font-display text-4xl font-semibold text-clay-900">Nos créations</h1>
          <p className="text-base text-slate-600">
            Diamètres de 55 à 100 cm, aciers corten ou thermolaqués et accessoires prêts à rejoindre
            votre terrasse. Filtres et tri vous permettent de comparer en un coup d&apos;œil.
          </p>
        </div>
        <CatalogueView products={products} />
      </Container>
    </Section>
  );
}
