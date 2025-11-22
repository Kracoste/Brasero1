import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
};

export default function CGVPage() {
  return (
    <Section className="pb-24">
      <Container className="space-y-6">
        <h1 className="font-display text-4xl font-semibold text-clay-900">
          Conditions Générales de Vente
        </h1>
        <p className="text-sm text-slate-400">
          Remplacez ce contenu par vos CGV définitives (paiement, livraison, garantie, droit de
          rétractation, etc.).
        </p>
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-black/80 p-6 text-sm text-slate-400">
          <p>
            Exemple : Les braséros sont fabriqués à la commande. Le délai maximum de livraison est de
            4 semaines après validation. Un acompte de 30% peut être demandé.
          </p>
          <p>
            Exemple : Garantie structure 5 ans sur les modèles corten, 2 ans sur la peinture. Les
            consommables (grilles, planchas) ne sont pas couverts.
          </p>
          <p>
            Exemple : Le client dispose de 14 jours pour exercer son droit de rétractation (hors
            fabrication personnalisée).
          </p>
        </div>
      </Container>
    </Section>
  );
}
