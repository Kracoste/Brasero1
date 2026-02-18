import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Users, 
  ArrowRight,
  CheckCircle2,
  Flame,
  Heart,
  MapPin,
  Clock,
  Mail,
  Phone,
  Hammer,
  Leaf,
  Target,
  History,
  Star,
  Shield
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Notre histoire | L'Atelier LBF, fabricant français | ${settings.storeName}`,
    description: `Découvrez l'histoire de l'Atelier LBF : notre passion du métal, notre savoir-faire artisanal et nos valeurs. Fabrication française de braseros d'exception à ${settings.atelier.city}.`,
    keywords: [
      "histoire atelier LBF",
      "fabricant brasero français",
      "atelier brasero ${settings.atelier.city}",
      "brasero made in France",
      "savoir-faire artisanal brasero",
      "valeurs atelier brasero",
      "équipe atelier LBF",
      settings.atelier.department,
      settings.storeName,
    ],
    openGraph: {
      title: `À propos de nous | ${settings.storeName}`,
      description: `Atelier artisanal de fabrication de braseros en France. Découvrez notre histoire et notre passion pour le travail du métal.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/info/a-propos-de-nous",
    },
  };
}

// Schéma JSON-LD pour le SEO
function generateStructuredData(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.storeName,
    "url": "https://www.atelier-lbf.fr",
    "logo": "https://www.atelier-lbf.fr/logo/logo.png",
    "description": "Atelier artisanal de fabrication de braseros en France. Création sur mesure, braseros personnalisés et accessoires de qualité.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": settings.atelier.city,
      "addressRegion": settings.atelier.department,
      "addressCountry": "FR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings.storePhone,
      "email": settings.storeEmail,
      "contactType": "customer service"
    },
    "foundingDate": "2020",
    "founders": [
      {
        "@type": "Person",
        "name": "L'équipe LBF"
      }
    ]
  };
}

export default async function AProposPage() {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData(settings);

  const values = [
    {
      icon: Hammer,
      title: "Savoir-faire artisanal",
      description: "Chaque brasero est fabriqué à la main par des artisans passionnés. Nous perpétuons les techniques traditionnelles tout en intégrant les outils modernes."
    },
    {
      icon: Leaf,
      title: "Production locale",
      description: `Notre atelier est situé à ${settings.atelier.city}, dans les ${settings.atelier.department}. Nous privilégions les fournisseurs locaux et les circuits courts.`
    },
    {
      icon: Heart,
      title: "Passion du feu",
      description: "Le feu rassemble, réchauffe et fascine. Nous créons des braseros qui deviennent le cœur de vos moments de partage en extérieur."
    },
    {
      icon: Shield,
      title: "Qualité durable",
      description: "Nous sélectionnons des matériaux de première qualité pour des braseros qui traversent les années. Garantie 2 ans sur toutes nos créations."
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Naissance de l'atelier",
      description: "L'aventure commence avec une passion pour le travail du métal et le désir de créer des braseros uniques."
    },
    {
      year: "2021",
      title: "Premiers clients",
      description: "Bouche à oreille et marchés locaux : nos premiers braseros trouvent leur place dans les jardins de la région."
    },
    {
      year: "2022",
      title: "Développement",
      description: "L'équipe s'agrandit, l'atelier s'équipe de nouvelles machines. La gamme s'enrichit avec les accessoires."
    },
    {
      year: "2023",
      title: "Lancement en ligne",
      description: "Notre boutique en ligne ouvre ses portes. Nous livrons désormais dans toute la France et en Europe."
    },
    {
      year: "2024",
      title: "Sur mesure",
      description: "Le service de création sur mesure se développe. Restaurants, hôtels et particuliers nous font confiance."
    },
    {
      year: "2025",
      title: "Aujourd'hui",
      description: "Des centaines de braseros livrés, une équipe passionnée et toujours la même exigence de qualité."
    }
  ];

  const teamValues = [
    "Écoute et conseil personnalisé",
    "Transparence sur nos méthodes",
    "Respect des délais annoncés",
    "Service après-vente réactif",
    "Amélioration continue"
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#8B4513]" />
                </div>
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  À propos
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                L'histoire de notre <span className="text-slate-900">atelier</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Bienvenue chez {settings.storeName}. Nous sommes une équipe d'artisans passionnés, 
                installés à {settings.atelier.city} dans les {settings.atelier.department}. 
                Notre mission : créer des braseros d'exception qui illuminent vos moments de partage.
              </p>
            </div>
          </div>
        </section>

        {/* Notre histoire */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-[#8B4513]" />
                  <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                    Notre histoire
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                  De la passion à l'atelier
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  Tout a commencé par une passion pour le travail du métal et l'amour des soirées 
                  autour du feu. Frustrés de ne pas trouver de braseros qui alliaient qualité, 
                  esthétique et fabrication française, nous avons décidé de les créer nous-mêmes.
                </p>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  Aujourd'hui, notre atelier artisanal perpétue ce même esprit : chaque brasero 
                  est pensé, dessiné et fabriqué avec soin, pour devenir le cœur de vos moments 
                  de convivialité.
                </p>
                <div className="mt-8">
                  <Link
                    href="/atelier"
                    className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#CD853F] font-medium transition-colors"
                  >
                    Visiter notre atelier
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              
              <div className="bg-white p-8 border border-slate-200">
                <Flame className="w-16 h-16 text-[#8B4513] mx-auto mb-6" />
                <blockquote className="text-center">
                  <p className="text-xl text-slate-700 italic leading-relaxed">
                    "Nous croyons que le feu a le pouvoir de rassembler. Chaque brasero 
                    que nous créons est une invitation au partage."
                  </p>
                  <footer className="mt-4 text-slate-500">
                    — L'équipe {settings.storeName}
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Target className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Nos valeurs
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Ce qui nous anime
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Des valeurs fortes qui guident chacune de nos créations
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div 
                  key={value.title}
                  className="bg-[#f6f1e9] p-6 border border-slate-200"
                >
                  <value.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{value.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Notre parcours
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Les étapes clés de notre aventure
              </p>
            </div>

            <div className="space-y-0">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-16 h-10 bg-[#8B4513] text-white flex items-center justify-center font-bold text-sm">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 flex-1 bg-[#CD853F]" />
                    )}
                  </div>
                  <div className="pt-1 pb-8">
                    <h3 className="font-semibold text-slate-900">{milestone.title}</h3>
                    <p className="text-slate-600 text-sm mt-1">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* L'équipe */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#8B4513]" />
                  <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                    Notre équipe
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Des artisans passionnés
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  Notre équipe réunit des savoir-faire complémentaires : design, métallurgie, 
                  soudure, finition. Chacun apporte son expertise pour créer des braseros 
                  qui allient esthétique et qualité de fabrication.
                </p>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  Nous travaillons en circuit court, avec des fournisseurs locaux que nous 
                  connaissons personnellement. Cette proximité nous permet de garantir la 
                  traçabilité et la qualité de nos matériaux.
                </p>
                
                <ul className="mt-6 space-y-3">
                  {teamValues.map((value) => (
                    <li key={value} className="flex items-center gap-3 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-[#8B4513] flex-shrink-0" />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-[#f6f1e9] p-8 border border-slate-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 text-center">
                    <p className="text-4xl font-bold text-[#8B4513]">500+</p>
                    <p className="text-sm text-slate-600 mt-1">Braseros livrés</p>
                  </div>
                  <div className="bg-white p-6 text-center">
                    <p className="text-4xl font-bold text-[#8B4513]">5</p>
                    <p className="text-sm text-slate-600 mt-1">Artisans</p>
                  </div>
                  <div className="bg-white p-6 text-center">
                    <p className="text-4xl font-bold text-[#8B4513]">100%</p>
                    <p className="text-sm text-slate-600 mt-1">Made in France</p>
                  </div>
                  <div className="bg-white p-6 text-center">
                    <p className="text-4xl font-bold text-[#8B4513]">2 ans</p>
                    <p className="text-sm text-slate-600 mt-1">Garantie</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Ce que disent nos clients
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Un travail d'une qualité exceptionnelle. Le brasero est devenu la pièce maîtresse de notre jardin.",
                  author: "Marie-Claire P.",
                  location: "Nantes"
                },
                {
                  quote: "L'équipe est à l'écoute et de bon conseil. Notre brasero personnalisé est exactement ce qu'on imaginait.",
                  author: "Jean-Michel R.",
                  location: "Bordeaux"
                },
                {
                  quote: "Livraison soignée, produit magnifique. On sent la passion et le savoir-faire derrière chaque détail.",
                  author: "Sophie L.",
                  location: "Lyon"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 border border-slate-200"
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-[#CD853F] fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t border-slate-200 pt-4">
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-500">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-24 bg-white text-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
              Envie de nous rencontrer ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Visitez notre atelier à {settings.atelier.city} ou contactez-nous pour 
              discuter de votre projet. Nous serons ravis de vous accueillir.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                <Mail size={18} />
                Nous contacter
              </Link>
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                Découvrir nos braseros
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact rapide */}
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
                <Clock className="w-4 h-4 text-[#8B4513]" />
                <span>Lun-Ven : 9h-18h</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8B4513]" />
                <span>{settings.atelier.city}, {settings.atelier.department}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
