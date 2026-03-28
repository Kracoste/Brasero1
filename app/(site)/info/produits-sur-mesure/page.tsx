import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Ruler, 
  ArrowRight,
  CheckCircle2,
  Paintbrush,
  Flame,
  Sparkles,
  PenTool,
  Layers,
  Settings,
  Clock,
  Mail,
  Phone,
  MapPin,
  FileText,
  MessageSquare,
  Hammer,
  Eye,
  Heart,
  Award,
  Zap
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Brasero sur mesure particulier | Création unique | ${settings.storeName}`,
    description: `Créez votre brasero sur mesure pour votre jardin : dimensions personnalisées, gravures laser, motifs découpés. Fabrication artisanale pour particuliers à ${settings.atelier.city}.`,
    keywords: [
      "brasero sur mesure particulier",
      "brasero personnalisé jardin",
      "brasero gravé prénom",
      "brasero dimensions jardin",
      "brasero découpe personnalisée",
      "brasero unique particulier",
      "création brasero maison",
      "brasero cadeau personnalisé",
      "brasero gravure laser",
      settings.storeName,
    ],
    openGraph: {
      title: `Brasero sur mesure | ${settings.storeName}`,
      description: `Créez le brasero de vos rêves. Dimensions, gravures, motifs : tout est personnalisable. Fabrication artisanale en France.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/Produits/og-brasero.webp" }],
    },
    alternates: {
      canonical: "/info/produits-sur-mesure",
    },
  };
}

// Schéma JSON-LD pour le SEO
function generateStructuredData(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Brasero sur mesure",
    "provider": {
      "@type": "LocalBusiness",
      "name": settings.storeName,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": settings.atelier.city,
        "addressRegion": settings.atelier.department,
        "addressCountry": "FR"
      }
    },
    "description": "Service de création de braseros sur mesure : dimensions personnalisées, gravures, découpes laser, finitions uniques. Fabrication artisanale en France.",
    "areaServed": ["France", "Belgium", "Luxembourg", "Switzerland", "Germany"],
    "serviceType": "Fabrication de braseros personnalisés sur mesure"
  };
}

export default async function ProduitsSurMesurePage() {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData(settings);

  const customizationOptions = [
    {
      icon: Ruler,
      title: "Dimensions sur mesure",
      description: "Choisissez le diamètre, la hauteur et les proportions exactes pour un brasero parfaitement adapté à votre espace."
    },
    {
      icon: PenTool,
      title: "Gravure personnalisée",
      description: "Ajoutez votre nom, une date, un message ou un motif gravé au laser sur votre brasero."
    },
    {
      icon: Sparkles,
      title: "Découpe laser",
      description: "Des motifs ajourés découpés au laser : étoiles, flammes, formes géométriques ou design sur mesure."
    },
    {
      icon: Layers,
      title: "Finitions spéciales",
      description: "Acier corten, acier noir, acier brut patiné... Choisissez la finition qui correspond à vos goûts."
    },
    {
      icon: Settings,
      title: "Accessoires intégrés",
      description: "Plancha, grille barbecue, couvercle, pieds ajustables : personnalisez les fonctionnalités de votre brasero."
    },
    {
      icon: Heart,
      title: "Design unique",
      description: "Vous avez une idée précise ? Nous la réalisons. Envoyez-nous vos croquis ou inspirations."
    }
  ];

  const creationProcess = [
    {
      step: 1,
      title: "Échange sur votre projet",
      description: "Décrivez-nous votre vision : dimensions, style, personnalisations souhaitées. Nous vous conseillons et affinons ensemble le projet."
    },
    {
      step: 2,
      title: "Proposition & devis",
      description: "Nous vous envoyons un visuel de votre brasero et un devis détaillé. Vous validez ou ajustez selon vos souhaits."
    },
    {
      step: 3,
      title: "Fabrication artisanale",
      description: "Votre brasero est fabriqué à la main dans notre atelier. Chaque étape est réalisée avec soin par nos artisans."
    },
    {
      step: 4,
      title: "Contrôle qualité",
      description: "Avant expédition, nous vérifions chaque détail : soudures, finitions, personnalisations. Rien n'est laissé au hasard."
    },
    {
      step: 5,
      title: "Livraison soignée",
      description: "Votre brasero unique est emballé avec soin et livré chez vous. Un moment d'émotion à la découverte de votre création."
    }
  ];

  const inspirations = [
    {
      title: "Brasero avec prénom",
      description: "Le prénom de vos enfants ou de vos proches gravé ou découpé sur le brasero. Un cadeau unique et émouvant.",
      icon: Heart
    },
    {
      title: "Brasero avec logo",
      description: "Pour les professionnels ou les passionnés : votre logo, blason ou emblème intégré au design du brasero.",
      icon: Award
    },
    {
      title: "Brasero décoratif",
      description: "Des motifs ajourés qui projettent de magnifiques jeux de lumière. Arbres, animaux, motifs géométriques...",
      icon: Sparkles
    },
    {
      title: "Brasero XXL",
      description: "Pour les grands espaces : un brasero aux dimensions exceptionnelles, conçu sur mesure pour impressionner.",
      icon: Zap
    },
    {
      title: "Brasero table",
      description: "Un brasero intégré à une table, avec ou sans plancha. L'élément central de vos soirées conviviales.",
      icon: Flame
    },
    {
      title: "Brasero minimaliste",
      description: "Lignes épurées, formes simples : un brasero au design contemporain et élégant.",
      icon: Eye
    }
  ];

  const guarantees = [
    {
      icon: Hammer,
      title: "Fabrication 100% française",
      description: `Chaque brasero est fabriqué dans notre atelier à ${settings.atelier.city}, dans les ${settings.atelier.department}.`
    },
    {
      icon: Award,
      title: "Savoir-faire artisanal",
      description: "Nos artisans maîtrisent les techniques traditionnelles et les outils modernes pour un résultat parfait."
    },
    {
      icon: CheckCircle2,
      title: "Garantie 2 ans",
      description: "Tous nos braseros sur mesure bénéficient de la même garantie que notre gamme standard."
    },
    {
      icon: Eye,
      title: "Validation visuelle",
      description: "Vous validez un visuel de votre brasero avant fabrication. Pas de mauvaise surprise."
    }
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
                  <Paintbrush className="w-6 h-6 text-[#8B4513]" />
                </div>
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Sur mesure
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Votre brasero <span className="text-slate-900">sur mesure</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Créez le brasero unique qui vous ressemble. Dimensions personnalisées, gravures, 
                motifs découpés au laser, finitions spéciales : notre atelier artisanal à {settings.atelier.city} 
                réalise toutes vos envies.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-3 transition-all"
                >
                  <FileText size={18} />
                  Demander un devis
                </Link>
                <a
                  href={`tel:${settings.storePhone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-6 py-3 transition-all"
                >
                  <Phone size={18} />
                  Discutons de votre projet
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {["Devis gratuit", "Fabrication France", "Pièce unique"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#8B4513] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Options de personnalisation */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Personnalisation
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Tout est personnalisable
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                De la taille aux finitions, en passant par les gravures : créez le brasero parfait
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customizationOptions.map((option) => (
                <div 
                  key={option.title}
                  className="bg-white p-6 border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <option.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{option.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Processus de création */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Comment créer votre brasero sur mesure ?
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  De l'idée à la livraison, nous vous accompagnons à chaque étape. 
                  Votre brasero unique prend vie dans notre atelier artisanal.
                </p>
                
                <div className="mt-8 space-y-0">
                  {creationProcess.map((item, index) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-10 h-10 bg-[#8B4513] text-white flex items-center justify-center font-bold">
                          {item.step}
                        </div>
                        {index < creationProcess.length - 1 && (
                          <div className="w-0.5 flex-1 bg-[#CD853F]" />
                        )}
                      </div>
                      <div className="pt-1 pb-8">
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                        <p className="text-slate-600 text-sm mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#f6f1e9] p-8 sm:p-10 border border-slate-200">
                <div className="text-center">
                  <Paintbrush className="w-16 h-16 text-[#8B4513] mx-auto" />
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">
                    Parlez-nous de votre projet
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Dimensions, gravures, motifs, finitions... Décrivez-nous votre brasero idéal 
                    et recevez un devis personnalisé sous 24 heures.
                  </p>
                  <div className="mt-6 space-y-4">
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-4 transition-all"
                    >
                      <MessageSquare size={18} />
                      Décrire mon projet
                    </Link>
                    <a
                      href={`mailto:${settings.storeEmail}?subject=Projet brasero sur mesure`}
                      className="w-full inline-flex items-center justify-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-6 py-4 transition-all"
                    >
                      <Mail size={18} />
                      Envoyer un email
                    </a>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">
                    N'hésitez pas à joindre des photos, croquis ou inspirations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inspirations */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Inspirations
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Quelques idées pour vous inspirer
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Découvrez les possibilités infinies de personnalisation
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspirations.map((inspiration) => (
                <div 
                  key={inspiration.title}
                  className="bg-white p-6 border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <inspiration.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{inspiration.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {inspiration.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-600 mb-4">
                Vous avez une autre idée ? Nous adorons les défis créatifs !
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#CD853F] font-medium transition-colors"
              >
                Partagez votre projet avec nous
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Garanties */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Nos engagements qualité
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Un brasero sur mesure fabriqué avec le même soin que notre gamme standard
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guarantees.map((guarantee) => (
                <div 
                  key={guarantee.title}
                  className="bg-[#f6f1e9] p-6 border border-slate-200 text-center"
                >
                  <guarantee.icon className="w-10 h-10 text-[#8B4513] mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{guarantee.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {guarantee.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Questions sur le sur mesure
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Quel est le prix d'un brasero sur mesure ?",
                  answer: "Le prix dépend des dimensions, des personnalisations et des finitions choisies. Comptez un supplément de 20 à 50% par rapport à un modèle standard équivalent. Nous vous envoyons un devis détaillé après étude de votre projet."
                },
                {
                  question: "Quel est le délai de fabrication ?",
                  answer: "Le délai varie selon la complexité du projet, généralement de 2 à 4 semaines après validation du devis. Pour les projets très élaborés ou les périodes de forte demande, le délai peut être plus long. Nous vous communiquons le délai précis avec le devis."
                },
                {
                  question: "Puis-je faire graver un logo ou une image ?",
                  answer: "Oui, nous réalisons des gravures et découpes laser à partir de fichiers vectoriels (AI, EPS, SVG). Les photos peuvent aussi être converties en motifs gravables. Envoyez-nous votre visuel pour étude."
                },
                {
                  question: "Y a-t-il des limites de dimensions ?",
                  answer: "Nous pouvons réaliser des braseros de 40cm à plus de 150cm de diamètre. Pour des dimensions exceptionnelles, contactez-nous pour étudier la faisabilité et les contraintes logistiques."
                },
                {
                  question: "Puis-je voir un visuel avant fabrication ?",
                  answer: "Absolument ! Nous vous envoyons un visuel ou un plan de votre brasero avant de lancer la fabrication. Vous pouvez demander des ajustements jusqu'à la validation définitive."
                },
                {
                  question: "La garantie s'applique-t-elle aux braseros sur mesure ?",
                  answer: "Oui, tous nos braseros sur mesure bénéficient de la garantie fabricant de 2 ans, comme notre gamme standard. Notre SAV reste disponible pour tout accompagnement."
                },
              ].map((faq, index) => (
                <details 
                  key={index}
                  className="bg-white border border-slate-100 group"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-900 hover:text-[#8B4513] transition-colors">
                    {faq.question}
                    <span className="text-[#8B4513] group-open:rotate-180 transition-transform flex-shrink-0 ml-4">
                      <ArrowRight className="rotate-90" size={18} />
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-24 bg-white text-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
              Prêt à créer votre brasero unique ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Partagez votre projet avec nous. Dimensions, gravures, idées folles : 
              notre atelier donne vie à toutes vos envies.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                <MessageSquare size={18} />
                Décrire mon projet
              </Link>
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                Voir nos modèles
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
