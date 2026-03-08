import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbSchema } from "@/lib/seo/schemas";
import {
  Flame,
  ChefHat,
  Users,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Sun,
  Utensils
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Brasero multifonction | Barbecue, plancha et chauffage | ${settings.storeName}`,
    description: `Découvrez nos braseros multifonctions 3 en 1 : barbecue, plancha et chauffage d'extérieur. Transformez votre jardin en espace convivial toute l'année. Fabriqués en France.`,
    keywords: [
      "brasero multifonction",
      "brasero barbecue plancha",
      "brasero 3 en 1",
      "brasero chauffage extérieur",
      "brasero coin feu jardin",
      "brasero polyvalent",
      settings.storeName,
    ],
    openGraph: {
      title: `Brasero multifonction 3 en 1 | ${settings.storeName}`,
      description: `Barbecue, plancha et chauffage : un seul brasero pour toutes vos envies.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/brasero-multifonction",
    },
  };
}

export default async function BraseroMultifonctionPage() {
  const settings = await getSiteSettings();

  const functions = [
    {
      icon: Flame,
      title: "Chauffage d'ambiance",
      description: "Profitez de la chaleur du feu de bois pour prolonger vos soirées d'été et réchauffer votre terrasse en automne et hiver."
    },
    {
      icon: ChefHat,
      title: "Barbecue traditionnel",
      description: "Grillez viandes, poissons et légumes avec la grille de cuisson. La chaleur du feu de bois apporte une saveur incomparable."
    },
    {
      icon: Utensils,
      title: "Plancha gourmande",
      description: "Ajoutez une plancha amovible pour saisir vos aliments à haute température. Idéal pour les cuissons rapides et saines."
    },
  ];

  const usages = [
    {
      icon: Users,
      title: "Soirées conviviales",
      description: "Le brasero devient le point central de vos réunions entre amis et famille. Cuisinez, réchauffez-vous et admirez les flammes."
    },
    {
      icon: Sun,
      title: "Toutes saisons",
      description: "Utilisez votre brasero toute l'année : barbecue l'été, chauffage d'appoint l'hiver, ambiance chaleureuse au printemps et automne."
    },
    {
      icon: Sparkles,
      title: "Décoration jardin",
      description: "Au-delà de son aspect fonctionnel, le brasero est un élément décoratif qui sublime votre espace extérieur."
    },
  ];

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Brasero multifonction", url: "/brasero-multifonction" },
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
            "@type": "Product",
            "name": "Brasero multifonction 3 en 1",
            "description": "Brasero artisanal multifonction : barbecue, plancha et chauffage d'extérieur",
            "brand": {
              "@type": "Brand",
              "name": settings.storeName
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock"
            }
          })
        }}
      />

      {/* Hero */}
      <section className="bg-[#f6f1e9] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#CD853F]" />
              </div>
              <span className="text-[#CD853F] font-semibold uppercase tracking-wide text-sm">
                Espace barbecue unique
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
              Brasero <span className="text-[#CD853F]">multifonction</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              Un seul équipement pour trois usages : barbecue, plancha et chauffage d&apos;extérieur. 
              Créez un coin chaleureux dans votre jardin et profitez-en toute l&apos;année.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/produits?category=brasero"
                className="inline-flex items-center gap-2 bg-[#CD853F] hover:bg-[#8B4513] text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Voir nos braseros
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-slate-800 text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Demander un devis
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 fonctions */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              3 usages en 1 seul brasero
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Polyvalence et performance pour votre extérieur
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {functions.map((func, index) => (
              <div key={func.title} className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4">
                  <func.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <div className="text-2xl font-bold text-[#CD853F] mb-2">{index + 1}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{func.title}</h3>
                <p className="text-slate-600 leading-relaxed">{func.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Usages */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Pour toutes vos occasions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Un brasero qui s&apos;adapte à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {usages.map((usage) => (
              <div key={usage.title} className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4">
                  <usage.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{usage.title}</h3>
                <p className="text-slate-600 leading-relaxed">{usage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Pourquoi choisir un brasero multifonction ?
            </h2>
          </div>

          <div className="bg-[#f6f1e9] p-8 border border-slate-200">
            <ul className="space-y-4">
              {[
                "Un seul achat pour trois équipements : économique et pratique",
                "Gain de place sur votre terrasse ou dans votre jardin",
                "Utilisable toute l'année selon vos envies",
                "Grille et plancha incluses ou en option selon les modèles",
                "Acier corten ou acier peint haute température",
                "Fabrication artisanale française à Moncoutant",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            Prêt à créer votre espace barbecue ?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Découvrez nos modèles de braseros multifonctions et trouvez celui qui correspond à vos besoins.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/produits?category=brasero"
              className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#CD853F] text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Flame size={18} />
              Voir les braseros
            </Link>
            <Link
              href="/accessoires"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              Accessoires compatibles
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
