import Image from "next/image";
import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { LeafletMap } from "@/components/LeafletMap";
import { Section } from "@/components/Section";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Atelier & savoir-faire",
  description: "Plongez dans les coulisses de notre atelier de Moncoutant et de nos procédés artisanaux.",
};

const atelierImages = [
  {
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    alt: "Découpe laser d'une vasque",
  },
  {
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    alt: "Soudure d'un braséro",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    alt: "Contrôle qualité avant expédition",
  },
];

export default async function AtelierPage() {
  const siteSettings = await getSiteSettings();

  return (
    <div className="pb-24">
      <Section className="pt-10">
        <Container className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-wide text-slate-500">Savoir-faire</p>
            <h1 className="font-display text-4xl font-semibold text-slate-900">
              Une flamme née aux Deux-Sèvres
            </h1>
            <p className="text-base text-slate-600">
              Depuis Moncoutant, nous découpons, roulons et soudons des braséros conçus pour durer.
              Notre équipe maîtrise la transformation de l&apos;acier corten et assure un suivi
              complet de chaque pièce.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {atelierImages.map((image) => (
              <div key={image.alt} className="overflow-hidden rounded-3xl">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={800}
                  className="h-72 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              Fabrication 100% intégrée
            </h2>
            <ul className="space-y-4 text-sm text-slate-600">
              <li>
                <strong className="font-semibold text-slate-900">Découpe laser.</strong> Chaque
                vasque est découpée sur nos tables Bystronic pour garantir des arrêtes parfaites.
              </li>
              <li>
                <strong className="font-semibold text-slate-900">Formage & roulage.</strong> Les
                pièces sont roulées sur cintreuse 3 rouleaux avant d&apos;être soudées en continu.
              </li>
              <li>
                <strong className="font-semibold text-slate-900">Soudure TIG contrôlée.</strong> Nos
                chaudronniers réalisent les soudures visibles puis les poncent pour un rendu premium.
              </li>
              <li>
                <strong className="font-semibold text-slate-900">Finition & patine.</strong> Passage
                en cabine, polissage manuel et pré-patine stabilisée pour un vieillissement homogène.
              </li>
            </ul>
          </div>
          <LeafletMap
            lat={siteSettings.atelier.lat}
            lng={siteSettings.atelier.lng}
            zoom={14}
            markerLabel="Visitez l'atelier Brasero"
            className="h-[420px]"
          />
        </Container>
      </Section>

      <Section>
        <Container className="space-y-4 rounded-3xl border border-clay-100 bg-gradient-to-r from-clay-50 to-white p-8">
          <h3 className="font-display text-2xl font-semibold text-clay-900">
            Venir à Moncoutant
          </h3>
          <p className="text-sm text-slate-600">
            {siteSettings.storeAddress} — Prise de rendez-vous au {siteSettings.storePhone}. Accès par la N149,
            parking visiteur sur place.
          </p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${siteSettings.atelier.lat},${siteSettings.atelier.lng}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center rounded-full bg-clay-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Itinéraire
          </a>
        </Container>
      </Section>
    </div>
  );
}
