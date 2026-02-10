import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Shield,
  CheckCircle2,
  Wrench,
  Phone,
  ArrowRight,
  MapPin,
  Mail,
  Clock,
  FileCheck,
  Headphones,
  Package
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Garantie brasero 2 ans | SAV réactif et fiable | ${settings.storeName}`,
    description: `Tous nos braseros sont garantis 2 ans minimum. SAV réactif, pièces détachées disponibles, assistance téléphonique. Achetez en toute confiance chez ${settings.storeName}.`,
    keywords: [
      "garantie brasero 2 ans",
      "SAV brasero",
      "service après-vente brasero",
      "pièces détachées brasero",
      "assistance brasero",
      "réparation brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Garantie 2 ans | SAV réactif | ${settings.storeName}`,
      description: `Achetez en toute confiance avec notre garantie fabricant de 2 ans minimum.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/garantie",
    },
  };
}

export default async function GarantiePage() {
  const settings = await getSiteSettings();

  const coverages = [
    {
      icon: Shield,
      title: "Garantie fabricant 2 ans minimum",
      description: "Tous nos braseros sont couverts par une garantie fabricant de 2 ans à partir de la date d'achat. Certains modèles premium bénéficient même de 5 ans de garantie."
    },
    {
      icon: Wrench,
      title: "Défauts de fabrication",
      description: "La garantie couvre tous les défauts de matériaux et de fabrication : soudures défaillantes, déformation anormale, fissures du métal."
    },
    {
      icon: Package,
      title: "Remplacement ou réparation",
      description: "Selon le problème, nous procédons au remplacement de la pièce défectueuse ou du brasero complet. Les frais de retour sont à notre charge."
    },
  ];

  const services = [
    {
      icon: Headphones,
      title: "Assistance téléphonique",
      description: "Notre équipe est joignable du lundi au vendredi de 9h à 18h pour répondre à toutes vos questions."
    },
    {
      icon: FileCheck,
      title: "Pièces détachées",
      description: "Grilles de cuisson, planchas, pare-étincelles : toutes nos pièces détachées sont disponibles même hors garantie."
    },
    {
      icon: Clock,
      title: "Réactivité garantie",
      description: "Nous nous engageons à traiter votre demande SAV sous 48h ouvrées et à vous apporter une solution rapide."
    },
  ];

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Garantie et SAV braseros",
            "provider": {
              "@type": "Organization",
              "name": settings.storeName
            },
            "areaServed": "FR",
            "warranty": "2 ans minimum"
          })
        }}
      />

      {/* Hero */}
      <section className="bg-[#f6f1e9] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#CD853F]" />
              </div>
              <span className="text-[#CD853F] font-semibold uppercase tracking-wide text-sm">
                Qualité garantie
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
              Garantie <span className="text-[#CD853F]">2 ans minimum</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              Achetez en toute confiance. Tous nos braseros sont garantis 2 ans minimum avec un service 
              après-vente réactif et des pièces détachées disponibles.
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
                Contacter le SAV
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Couverture garantie */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Ce que couvre notre garantie
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Une protection complète sur tous nos produits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {coverages.map((coverage) => (
              <div key={coverage.title} className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4">
                  <coverage.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{coverage.title}</h3>
                <p className="text-slate-600 leading-relaxed">{coverage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Durée garantie par modèle */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Durée de garantie selon les modèles
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Tous nos braseros bénéficient d&apos;au moins 2 ans de garantie
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B4513]">Type de brasero</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#8B4513]">Garantie</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="px-6 py-4 text-slate-900">Braseros acier corten</td>
                    <td className="px-6 py-4 text-center text-[#CD853F] font-semibold">5 ans</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-6 py-4 text-slate-900">Braseros acier noir peint</td>
                    <td className="px-6 py-4 text-center text-[#CD853F] font-semibold">3 ans</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="px-6 py-4 text-slate-900">Planchas et grilles</td>
                    <td className="px-6 py-4 text-center text-[#CD853F] font-semibold">2 ans</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-900">Accessoires</td>
                    <td className="px-6 py-4 text-center text-[#CD853F] font-semibold">2 ans</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-slate-500 text-center">
              La garantie débute à la date de livraison mentionnée sur votre facture.
            </p>
          </div>
        </div>
      </section>

      {/* Services SAV */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Notre service après-vente
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Un accompagnement sur le long terme
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.title} className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions garantie */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Conditions de garantie
            </h2>
          </div>

          <div className="bg-white p-8 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">La garantie couvre :</h3>
            <ul className="space-y-3 mb-6">
              {[
                "Les défauts de matériaux et de fabrication",
                "Les soudures défectueuses",
                "Les déformations anormales du métal",
                "Les problèmes de peinture (écaillage prématuré)",
                "Les défauts de traitement de surface",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-slate-900 mb-4 mt-8">La garantie ne couvre pas :</h3>
            <ul className="space-y-3">
              {[
                "L'usure normale liée à l'utilisation",
                "Les dommages causés par un usage inapproprié",
                "Les modifications apportées par le client",
                "Les dommages dus à un manque d'entretien",
                "Les rayures ou chocs lors du transport après livraison",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-red-500 font-bold flex-shrink-0">✕</span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Procédure SAV */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Comment faire jouer la garantie ?
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { step: "1", title: "Contactez-nous", desc: "Par email ou téléphone avec votre numéro de commande" },
              { step: "2", title: "Diagnostic", desc: "Nous analysons le problème (photos souvent suffisantes)" },
              { step: "3", title: "Solution", desc: "Nous vous proposons une solution : pièce de rechange ou remplacement" },
              { step: "4", title: "Expédition", desc: "Nous envoyons la pièce ou organisons le retour du brasero" },
            ].map((item) => (
              <div key={item.step} className="bg-[#f6f1e9] p-6 border border-slate-200 flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#CD853F] text-white flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            Un problème avec votre brasero ?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Notre équipe SAV est là pour vous aider rapidement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#CD853F] text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Phone size={18} />
              Contacter le SAV
            </Link>
            <Link
              href="/info/faq"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              Voir la FAQ
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
