import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace Brasero Atelier pour suivre vos commandes.",
};

export default function ConnexionPage() {
  return (
    <Section className="pb-24">
      <Container className="max-w-xl space-y-6 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-lg">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">Espace client</p>
          <h1 className="font-display text-3xl font-semibold text-clay-900">Connexion</h1>
          <p className="mt-2 text-sm text-slate-600">
            Interface à connecter à votre future base de données. Intégrez ici les formulaires ou
            providers d&apos;authentification.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-500">
          Placeholder connexion. Ajoutez vos champs (email, mot de passe, OTP...) et la logique vers
          la base dès qu&apos;elle sera disponible.
        </div>
      </Container>
    </Section>
  );
}
