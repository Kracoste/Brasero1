import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <Section className="pb-24">
      <Container className="space-y-6">
        <h1 className="font-display text-4xl font-semibold text-clay-900">Mentions légales</h1>
        <p className="text-sm text-slate-400">
          Ces informations sont fournies à titre indicatif. Remplacez-les par vos données officielles.
        </p>
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-black/80 p-6 text-sm text-slate-400">
          <p>
            Éditeur : Brasero Atelier — SAS au capital de 50 000 €, RCS Niort 000 000 000,
            siège social Rue du Moulin, 79320 Moncoutant-sur-Sèvre.
          </p>
          <p>Directeur de la publication : Hugo Allou.</p>
          <p>Hébergement : Vercel Inc, 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
          <p>Crédits photos : Unsplash — mise à jour prochaine avec vos visuels propriétaires.</p>
        </div>
      </Container>
    </Section>
  );
}
