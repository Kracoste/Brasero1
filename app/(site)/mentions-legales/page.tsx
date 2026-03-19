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
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
          <p>
            Éditeur : Atelier LBF — SARL au capital de 10 000 €, RCS Niort 948 471 578,
            SIRET 948 471 578 00013, TVA intracommunautaire FR62948471578,
            siège social 10 Route du Deffend, 79350 Chiché.
          </p>
          <p>Directeur de la publication : Hugo Allou.</p>
          <p>Hébergement : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.</p>
        </div>
      </Container>
    </Section>
  );
}
