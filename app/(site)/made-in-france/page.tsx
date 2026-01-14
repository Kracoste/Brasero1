import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Award,
  Factory,
  MapPin,
  Users,
  Heart,
  Hammer,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  Sparkles,
  TreePine,
  Flag
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Fabrication française de braseros | Made in France artisanal | ${settings.storeName}`,
    description: `Braseros 100% fabriqués en France dans notre atelier des Deux-Sèvres. Savoir-faire artisanal français, traçabilité totale, soutien à l'économie locale. Découvrez notre engagement.`,
    keywords: [
      "brasero made in France",
      "brasero fabriqué en France",
      "brasero artisan français",
      "brasero production française",
      "brasero atelier français",
      "brasero local Deux-Sèvres",
      settings.storeName,
    ],
    openGraph: {
      title: `Fabrication française artisanale | ${settings.storeName}`,
      description: `Chaque brasero est fabriqué à la main dans notre atelier des Deux-Sèvres.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/made-in-france",
    },
  };
}

export default async function MadeInFrancePage() {
  const settings = await getSiteSettings();

  const commitments = [
    {
      icon: Factory,
      title: "100% production française",
      description: "De la conception à la livraison, tout est réalisé en France. Notre atelier est situé à Moncoutant dans les Deux-Sèvres."
    },
    {
      icon: Users,
      title: "Artisans qualifiés",
      description: "Notre équipe de ferronniers maîtrise les techniques traditionnelles du travail du métal, transmises de génération en génération."
    },
    {
      icon: TreePine,
      title: "Matières premières locales",
      description: "Nous privilégions les fournisseurs français et européens pour l'acier et tous nos composants. Circuits courts garantis."
    },
  ];

  const advantages = [
    {
      icon: Heart,
      title: "Soutien à l'économie locale",
      description: "En choisissant nos braseros, vous soutenez l'emploi français et le savoir-faire artisanal de nos régions."
    },
    {
      icon: Sparkles,
      title: "Qualité supérieure",
      description: "La fabrication française est synonyme d'exigence. Chaque pièce est contrôlée et validée avant expédition."
    },
    {
      icon: MapPin,
      title: "Traçabilité totale",
      description: "Nous connaissons l'origine de chaque matériau et chaque étape de fabrication. Transparence garantie."
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
            "@type": "Organization",
            "name": settings.storeName,
            "description": "Fabricant français de braseros artisanaux",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": settings.atelier.city,
              "addressRegion": settings.atelier.department,
              "addressCountry": "FR"
            },
            "areaServed": "FR",
            "knowsAbout": "Fabrication artisanale française de braseros"
          })
        }}
      />

      {/* Hero */}
      <section className="bg-[#f6f1e9] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center">
                <Flag className="w-6 h-6 text-[#CD853F]" />
              </div>
              <span className="text-[#CD853F] font-semibold uppercase tracking-wide text-sm">
                Made in France
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
              Fabrication <span className="text-[#CD853F]">française</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              Chaque brasero est fabriqué à la main dans notre atelier de {settings.atelier.city}. 
              Un savoir-faire artisanal 100% français au service de la qualité et de la durabilité.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/fabrication"
                className="inline-flex items-center gap-2 bg-[#CD853F] hover:bg-[#8B4513] text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Notre processus
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/info/a-propos-de-nous"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-slate-800 text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Notre histoire
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Notre engagement français
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Fabriqué en France n&apos;est pas qu&apos;un label, c&apos;est notre fierté
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {commitments.map((commitment) => (
              <div key={commitment.title} className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4">
                  <commitment.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{commitment.title}</h3>
                <p className="text-slate-600 leading-relaxed">{commitment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre atelier */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#CD853F]" />
                <span className="text-sm font-semibold uppercase tracking-wide text-[#CD853F]">
                  {settings.atelier.city}, {settings.atelier.department}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-6">
                Notre atelier dans les Deux-Sèvres
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Implanté à {settings.atelier.city} depuis plusieurs années, notre atelier perpétue les traditions 
                de la ferronnerie d&apos;art tout en intégrant des techniques modernes. C&apos;est ici que naissent 
                tous nos braseros, façonnés avec passion par nos artisans.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Nous travaillons exclusivement avec de l&apos;acier français et européen, garantissant une traçabilité 
                complète de nos produits. Chaque brasero porte en lui une part de notre région et de notre savoir-faire.
              </p>
              <Link
                href="/atelier"
                className="inline-flex items-center gap-2 text-[#8B4513] font-semibold hover:gap-3 transition-all"
              >
                Visiter notre atelier
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="bg-white p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">En chiffres</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-[#CD853F]">100%</div>
                  <div className="text-slate-600">Fabrication française</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#CD853F]">15+</div>
                  <div className="text-slate-600">Années d&apos;expertise</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#CD853F]">5</div>
                  <div className="text-slate-600">Artisans ferronniers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#CD853F]">500+</div>
                  <div className="text-slate-600">Braseros livrés par an</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Les avantages du Made in France
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Pourquoi choisir un brasero fabriqué en France
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((advantage) => (
              <div key={advantage.title} className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4">
                  <advantage.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{advantage.title}</h3>
                <p className="text-slate-600 leading-relaxed">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ce qui nous différencie */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Notre différence
            </h2>
          </div>

          <div className="bg-white p-8 border border-slate-200">
            <ul className="space-y-4">
              {[
                "Ateliers visibles : venez voir comment sont fabriqués vos braseros",
                "Personnalisation possible : adaptez dimensions et finitions à vos envies",
                "Réactivité : un problème ? Nous intervenons rapidement",
                "Conseil d'expert : nos artisans vous guident dans votre choix",
                "Pièces détachées disponibles : prolongez la durée de vie de votre brasero",
                "Fierté du travail bien fait : chaque brasero porte notre signature",
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
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            Soutenez le savoir-faire français
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Choisissez un brasero 100% fabriqué en France et participez au maintien de l&apos;artisanat local.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/produits?category=brasero"
              className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#CD853F] text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Award size={18} />
              Nos braseros français
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              Nous contacter
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
