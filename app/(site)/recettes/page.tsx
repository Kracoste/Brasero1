import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Recettes au brasero",
  description: "Idees gourmandes, marinades et cuissons parfaites pour votre brasero.",
};

const recipeHighlights = [
  {
    title: "Viandes & grillades",
    description: "Temps de cuisson, saisies express et astuces pour garder le moelleux.",
  },
  {
    title: "Legumes rotis",
    description: "Marinades citronnees, fumet du feu de bois et textures croquantes.",
  },
  {
    title: "Desserts au feu doux",
    description: "Pommes caramelisees, fruits flambes et douceurs de fin de soiree.",
  },
];

export default function RecettesPage() {
  return (
    <Section className="pb-24 pt-10">
      <Container className="space-y-10">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-500">Recettes</p>
          <h1 className="font-display text-4xl font-semibold text-slate-900">
            Cuisinez au brasero comme un chef
          </h1>
          <p className="text-base text-slate-600">
            Nous preparons une selection de recettes pensees pour la cuisson a la plancha et a la
            flamme vive. Revenez bientot pour decouvrir nos inspirations saisonnieres.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {recipeHighlights.map((item) => (
            <div
              key={item.title}
              className="space-y-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
            >
              <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-clay-100 bg-gradient-to-r from-clay-50 to-white p-8">
          <p className="text-sm uppercase tracking-wide text-slate-500">Bientot</p>
          <p className="mt-2 text-base text-slate-700">
            Vous voulez une recette en particulier ? Ecrivez-nous et nous l&apos;ajouterons a la
            prochaine selection.
          </p>
        </div>
      </Container>
    </Section>
  );
}
