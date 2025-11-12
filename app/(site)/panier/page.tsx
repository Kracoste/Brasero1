import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Panier",
  description: "Récapitulatif des produits en attente avant paiement.",
};

export default function PanierPage() {
  return (
    <Section className="pb-24">
      <Container className="space-y-6 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-lg">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Commande</p>
          <h1 className="font-display text-3xl font-semibold text-clay-900">Votre panier</h1>
          <p className="mt-2 text-sm text-slate-600">
            Cette page accueillera le futur flux panier / checkout (Stripe). Connectez-la à la base
            panier dès qu&apos;elle sera prête.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-500">
          Placeholder panier. Ajoutez ici le listing produits, quantités et totaux.
        </div>
      </Container>
    </Section>
  );
}
