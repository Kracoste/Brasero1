import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbSchema } from "@/lib/seo/schemas";
import {
  Hammer,
  Flame,
  Users,
  Heart,
  MapPin,
  ArrowRight,
  Shield,
  Clock,
  Phone,
  Mail
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Fabrication artisanale de braseros | Atelier français | ${settings.storeName}`,
    description: `Découvrez notre processus de fabrication artisanale de braseros. Chaque pièce est façonnée à la main dans notre atelier de ${settings.atelier.city}. Acier corten, soudure experte, finitions soignées.`,
    keywords: [
      "fabrication brasero artisanal",
      "brasero fait main France",
      "atelier brasero Moncoutant",
      "ferronnerie brasero",
      "brasero acier corten fabrication",
      "artisan brasero français",
      settings.storeName,
    ],
    openGraph: {
      title: `Fabrication artisanale | ${settings.storeName}`,
      description: `Chaque brasero est fabriqué à la main dans notre atelier des Deux-Sèvres.`,
      type: "website",
      locale: "fr_FR",
      images: [{
        url: "https://www.atelier-lbf.fr/Produits/og-brasero.webp",
        width: 1200,
        height: 630,
        alt: "Atelier LBF — Braseros artisanaux Made in France",
      }],
    },
    alternates: {
      canonical: "/fabrication",
    },
  };
}

export default async function FabricationPage() {
  const settings = await getSiteSettings();

  const steps = [
    {
      number: "01",
      title: "Sélection des matériaux",
      description: "Nous choisissons uniquement de l'acier de première qualité : acier corten 3mm pour la patine naturelle ou acier noir 2mm pour les finitions peintes. Chaque plaque est inspectée à réception."
    },
    {
      number: "02",
      title: "Découpe et formage",
      description: "Les pièces sont découpées au laser ou au plasma selon les formes, puis cintrées et formées à la main pour obtenir les courbes caractéristiques de nos braseros."
    },
    {
      number: "03",
      title: "Soudure experte",
      description: "Nos soudeurs qualifiés assemblent chaque pièce avec précision. Les cordons de soudure sont ensuite meulés et polis pour une finition impeccable."
    },
    {
      number: "04",
      title: "Traitement de surface",
      description: "Selon le modèle : pré-patinage pour l'acier corten, peinture haute température pour l'acier noir, ou finition brute pour un aspect industriel."
    },
    {
      number: "05",
      title: "Contrôle final",
      description: "Chaque brasero est inspecté sous tous les angles : solidité des soudures, qualité des finitions, dimensions exactes. Rien ne quitte l'atelier sans validation."
    },
  ];

  const materials = [
    {
      icon: Flame,
      title: "Acier corten 3mm",
      description: "L'acier corten développe naturellement une patine rouille protectrice. Résistant aux intempéries, il ne nécessite aucun entretien et embellit avec le temps."
    },
    {
      icon: Shield,
      title: "Acier noir 2mm",
      description: "Traité avec une peinture haute température (jusqu'à 800°C), l'acier noir offre un look épuré et moderne tout en garantissant une excellente durabilité."
    },
    {
      icon: Heart,
      title: "Finitions artisanales",
      description: "Chaque détail compte : poignées forgées, pieds soudés à la main, bords ébavurés. Nos artisans apportent une attention particulière à chaque finition."
    },
  ];

  const values = [
    {
      icon: Users,
      title: "Savoir-faire local",
      description: "Notre équipe de ferronniers perpétue les techniques traditionnelles du travail du métal, transmises de génération en génération dans les Deux-Sèvres."
    },
    {
      icon: MapPin,
      title: "100% Made in France",
      description: "De la conception à la livraison, tout est réalisé en France. Nos fournisseurs d'acier sont français et européens, garantissant une traçabilité totale."
    },
    {
      icon: Clock,
      title: "Pièces uniques",
      description: "Chaque brasero présente de légères variations qui témoignent de son caractère artisanal. C'est ce qui rend votre brasero véritablement unique."
    },
  ];

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Fabrication", url: "/fabrication" },
  ]);

  return (
    <main className="bg-white">
      <JsonLd data={breadcrumb} />
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": settings.storeName,
            "description": "Atelier de fabrication artisanale de braseros en France",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": settings.atelier.city,
              "addressRegion": settings.atelier.department,
              "addressCountry": "FR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": settings.atelier.lat,
              "longitude": settings.atelier.lng
            },
            "url": "https://www.atelier-lbf.fr",
            "sameAs": "https://www.atelier-lbf.fr/produits"
          })
        }}
      />

      {/* Hero */}
      <section className="bg-[#f6f1e9] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center">
                <Hammer className="w-6 h-6 text-[#CD853F]" />
              </div>
              <span className="text-[#CD853F] font-semibold uppercase tracking-wide text-sm">
                Étape 1/3
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
              Fabrication <span className="text-[#CD853F]">artisanale</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              Chaque brasero qui quitte notre atelier de {settings.atelier.city} est le fruit d&apos;un travail 
              minutieux réalisé entièrement à la main par nos artisans ferronniers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-[#CD853F] hover:bg-[#8B4513] text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Voir nos créations
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/qualite"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-slate-800 text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Étape suivante : Qualité
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation étapes */}
      <section className="bg-[#f6f1e9] py-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-sm">
            <span className="flex items-center gap-2 text-[#8B4513] font-semibold">
              <span className="w-6 h-6 bg-[#8B4513] text-white flex items-center justify-center text-xs">1</span>
              Fabrication
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <Link href="/qualite" className="flex items-center gap-2 text-slate-500 hover:text-[#8B4513] transition-colors">
              <span className="w-6 h-6 bg-slate-300 text-white flex items-center justify-center text-xs">2</span>
              Qualité
            </Link>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <Link href="/livraison" className="flex items-center gap-2 text-slate-500 hover:text-[#8B4513] transition-colors">
              <span className="w-6 h-6 bg-slate-300 text-white flex items-center justify-center text-xs">3</span>
              Livraison
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            Un savoir-faire artisanal français
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Dans notre atelier de {settings.atelier.city}, chaque brasero naît de la passion et de l&apos;expertise 
            de nos artisans. Du premier coup de chalumeau à la dernière inspection, nous mettons tout notre 
            savoir-faire au service de créations uniques, conçues pour durer et embellir votre extérieur.
          </p>
        </div>
      </section>

      {/* Étapes de fabrication */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Les étapes de fabrication
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Du premier coup de crayon à l&apos;emballage final
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`flex flex-col md:flex-row gap-6 items-start p-6 sm:p-8 bg-white border border-slate-200 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <span className="text-5xl sm:text-6xl font-display font-bold text-[#CD853F]/30">
                    {step.number}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matériaux */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Nos matériaux
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Des matières premières sélectionnées avec soin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {materials.map((material) => (
              <div key={material.title} className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4">
                  <material.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{material.title}</h3>
                <p className="text-slate-600 leading-relaxed">{material.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Nos valeurs
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Ce qui nous anime au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            Découvrez l&apos;étape suivante
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Après la fabrication, chaque brasero passe par un contrôle qualité rigoureux.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/qualite"
              className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#CD853F] text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Shield size={18} />
              Contrôle qualité
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              Voir nos braseros
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <a 
              href={`mailto:${settings.storeEmail}`}
              className="flex items-center gap-2 hover:text-[#8B4513] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#8B4513]" />
              <span>{settings.storeEmail}</span>
            </a>
            <a 
              href={`tel:${settings.storePhone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 hover:text-[#8B4513] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#8B4513]" />
              <span>{settings.storePhone}</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8B4513]" />
              <span>{settings.atelier.city}, {settings.atelier.department}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
