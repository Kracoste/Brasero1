import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { LeafletMap } from "@/components/LeafletMap";
import { Section } from "@/components/Section";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrivez-nous pour un devis sur mesure ou prenez rendez-vous à l'atelier.",
};

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();

  return (
    <Section className="pb-24">
      <Container className="space-y-10">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-500">Contact</p>
          <h1 className="font-display text-4xl font-semibold text-slate-900">Parlons de votre projet</h1>
          <p className="text-base text-slate-600">
            Besoin d&apos;un diamètre spécifique, d&apos;une finition sur mesure ou d&apos;un délai express ?
            Remplissez le formulaire et nous répondons sous 24h ouvrées.
          </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <ContactForm />
          <div className="space-y-6">
            <div className="border border-slate-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-slate-900">Coordonnées</h2>
              <p className="mt-2 text-sm text-slate-600">{siteSettings.storeAddress}</p>
              <p className="mt-2 text-sm text-slate-600">
                {siteSettings.storePhone}
                <br />
                {siteSettings.storeEmail}
              </p>
              <div className="mt-4">
                <p className="text-xs uppercase text-slate-500">Horaires</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {siteSettings.schedules.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
            <LeafletMap
              lat={siteSettings.atelier.lat}
              lng={siteSettings.atelier.lng}
              zoom={13}
              markerLabel={siteSettings.storeName}
              className="h-[260px]"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
