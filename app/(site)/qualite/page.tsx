import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Shield,
  CheckCircle2,
  Award,
  Eye,
  Hammer,
  Truck,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  Microscope,
  ThumbsUp
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Contrôle qualité brasero | Garantie et certification | ${settings.storeName}`,
    description: `Notre processus de contrôle qualité garantit des braseros irréprochables. Triple inspection, garantie 2 ans, certification CE. Exigence et excellence à chaque étape.`,
    keywords: [
      "contrôle qualité brasero",
      "garantie brasero 2 ans",
      "certification CE brasero",
      "inspection brasero",
      "qualité brasero artisanal",
      "brasero garanti France",
      settings.storeName,
    ],
    openGraph: {
      title: `Contrôle qualité | ${settings.storeName}`,
      description: `Triple inspection et garantie 2 ans sur tous nos braseros artisanaux.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/qualite",
    },
  };
}

export default async function QualitePage() {
  const settings = await getSiteSettings();

  const controls = [
    {
      icon: Hammer,
      title: "Contrôle post-fabrication",
      description: "Dès la sortie de l'atelier, chaque brasero est inspecté : solidité des soudures, absence de défauts, conformité aux dimensions. Les pièces non conformes sont refaites."
    },
    {
      icon: Eye,
      title: "Contrôle après traitement",
      description: "Une fois le traitement de surface effectué (patine ou peinture), nous vérifions l'uniformité de la finition, l'absence de coulures et la qualité de l'aspect final."
    },
    {
      icon: FileCheck,
      title: "Contrôle avant expédition",
      description: "Dernier contrôle avant emballage : vérification complète, nettoyage, ajout des accessoires et documentation. Chaque brasero part avec sa fiche de contrôle."
    },
  ];

  const guarantees = [
    {
      icon: Award,
      value: "2 ans",
      title: "Garantie fabricant",
      description: "Tous nos braseros sont garantis 2 ans minimum contre tout défaut de fabrication. Certains modèles bénéficient d'une garantie étendue jusqu'à 5 ans."
    },
    {
      icon: Shield,
      value: "CE",
      title: "Certification européenne",
      description: "Nos produits respectent les normes européennes de sécurité. Chaque modèle a été testé et certifié conforme aux réglementations en vigueur."
    },
    {
      icon: ThumbsUp,
      value: "98%",
      title: "Satisfaction client",
      description: "98% de nos clients se déclarent satisfaits de leur achat. Notre engagement qualité se reflète dans les avis et témoignages de notre communauté."
    },
  ];

  const criteria = [
    "Solidité et régularité des soudures",
    "Absence de déformations ou voilage",
    "Qualité et uniformité des finitions",
    "Conformité aux dimensions annoncées",
    "Stabilité et équilibre du brasero",
    "Fonctionnement des accessoires",
    "Qualité des poignées et pieds",
    "Absence de bavures ou arêtes vives",
  ];

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "QualityControl",
            "name": `Contrôle qualité ${settings.storeName}`,
            "description": "Processus de contrôle qualité pour braseros artisanaux",
            "provider": {
              "@type": "Organization",
              "name": settings.storeName
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
                <Shield className="w-6 h-6 text-[#CD853F]" />
              </div>
              <span className="text-[#CD853F] font-semibold uppercase tracking-wide text-sm">
                Étape 2/3
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
              Contrôle <span className="text-[#CD853F]">qualité</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              Avant de rejoindre votre jardin, chaque brasero passe par un processus de contrôle 
              rigoureux. Notre exigence garantit des produits irréprochables.
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
                href="/livraison"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-slate-800 text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Étape suivante : Livraison
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
            <Link href="/fabrication" className="flex items-center gap-2 text-slate-500 hover:text-[#8B4513] transition-colors">
              <span className="w-6 h-6 bg-slate-300 text-white flex items-center justify-center text-xs">1</span>
              Fabrication
            </Link>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="flex items-center gap-2 text-[#8B4513] font-semibold">
              <span className="w-6 h-6 bg-[#8B4513] text-white flex items-center justify-center text-xs">2</span>
              Qualité
            </span>
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
            L&apos;excellence à chaque étape
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Notre réputation repose sur la qualité irréprochable de nos braseros. C&apos;est pourquoi nous avons 
            mis en place un processus de contrôle qualité en trois étapes, garantissant que chaque pièce 
            qui quitte notre atelier répond à nos standards d&apos;excellence les plus stricts.
          </p>
        </div>
      </section>

      {/* Triple contrôle */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Triple contrôle qualité
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Trois inspections successives pour zéro défaut
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {controls.map((control, index) => (
              <div key={control.title} className="relative bg-white p-6 sm:p-8 border border-slate-200">
                <div className="absolute -top-4 left-6 w-8 h-8 bg-[#CD853F] flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4 mt-2">
                  <control.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{control.title}</h3>
                <p className="text-slate-600 leading-relaxed">{control.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Critères */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-6">
                Nos critères d&apos;inspection
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Chaque brasero est évalué selon une liste de critères précis. Un seul défaut 
                et la pièce est renvoyée en atelier pour correction ou refabrication.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {criteria.map((criterion) => (
                  <li key={criterion} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#CD853F] flex-shrink-0" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#f6f1e9] p-8 border border-slate-200">
              <Microscope className="w-16 h-16 text-[#CD853F] mb-6" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Taux de rejet : 3%
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Notre exigence se traduit par un taux de rejet de 3% en production. Ces pièces 
                sont systématiquement corrigées ou refaites, jamais expédiées avec un défaut.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Nos garanties
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              La preuve de notre engagement qualité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {guarantees.map((guarantee) => (
              <div key={guarantee.title} className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4">
                  <guarantee.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <div className="text-3xl font-bold text-[#CD853F] mb-2">{guarantee.value}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{guarantee.title}</h3>
                <p className="text-slate-600 leading-relaxed">{guarantee.description}</p>
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
            Une fois le contrôle qualité validé, votre brasero est soigneusement emballé pour la livraison.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/livraison"
              className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#CD853F] text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Truck size={18} />
              Livraison soignée
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/fabrication"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Hammer size={18} />
              Retour fabrication
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
