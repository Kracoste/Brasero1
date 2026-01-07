import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Lightbulb, 
  ArrowRight,
  Flame,
  Shield,
  Wrench,
  TreePine,
  Thermometer,
  Wind,
  Droplets,
  Clock,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Guide entretien brasero | Tutoriels et astuces | ${settings.storeName}`,
    description: `Guide complet d'utilisation : comment allumer, entretenir et nettoyer votre brasero. Choix du bois, règles de sécurité et astuces d'expert.`,
    keywords: [
      "guide entretien brasero",
      "tutoriel brasero",
      "comment allumer brasero",
      "quel bois pour brasero",
      "nettoyer brasero acier corten",
      "entretien brasero hiver",
      "sécurité utilisation brasero",
      "protéger brasero pluie",
      settings.storeName,
    ],
    openGraph: {
      title: `Astuces et conseils brasero | ${settings.storeName}`,
      description: `Guide complet pour l'utilisation et l'entretien de votre brasero artisanal.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/info/astuces-conseils",
    },
  };
}

// Schéma JSON-LD HowTo pour le SEO
function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Comment utiliser et entretenir son brasero",
    "description": "Guide complet pour allumer, utiliser et entretenir votre brasero artisanal en toute sécurité.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Choisir l'emplacement",
        "text": "Placez votre brasero sur une surface stable et non inflammable, à au moins 2 mètres des murs et végétation."
      },
      {
        "@type": "HowToStep",
        "name": "Préparer le feu",
        "text": "Utilisez du petit bois sec et des allume-feux naturels. Évitez les accélérants comme l'essence."
      },
      {
        "@type": "HowToStep",
        "name": "Allumer progressivement",
        "text": "Allumez le petit bois puis ajoutez progressivement des bûches plus grosses."
      },
      {
        "@type": "HowToStep",
        "name": "Entretenir le feu",
        "text": "Ajoutez du bois régulièrement pour maintenir une belle flamme. Ne surchargez pas le foyer."
      },
      {
        "@type": "HowToStep",
        "name": "Nettoyer après utilisation",
        "text": "Laissez refroidir complètement puis videz les cendres. Stockez le brasero à l'abri si nécessaire."
      }
    ]
  };
}

export default async function AstucesConseilsPage() {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData();

  const safetyTips = [
    {
      icon: MapPin,
      title: "Emplacement sécurisé",
      description: "Placez votre brasero à au moins 2 mètres des murs, clôtures, végétation et matériaux inflammables. Sur une surface stable et non combustible."
    },
    {
      icon: Wind,
      title: "Attention au vent",
      description: "Évitez d'utiliser le brasero par grand vent. Les étincelles peuvent être projetées et représenter un danger."
    },
    {
      icon: AlertTriangle,
      title: "Jamais d'accélérant",
      description: "N'utilisez jamais d'essence, d'alcool ou tout autre produit inflammable pour allumer ou raviver le feu."
    },
    {
      icon: Shield,
      title: "Surveillance",
      description: "Ne laissez jamais un brasero allumé sans surveillance. Éloignez les enfants et les animaux."
    }
  ];

  const woodTypes = [
    {
      name: "Chêne",
      rating: 5,
      description: "Bois dur par excellence. Brûle longtemps avec une belle flamme et peu de fumée.",
      recommended: true
    },
    {
      name: "Hêtre",
      rating: 5,
      description: "Excellent pouvoir calorifique. Flammes vives et braises durables.",
      recommended: true
    },
    {
      name: "Charme",
      rating: 5,
      description: "Très bon combustible. Brûle lentement avec une chaleur intense.",
      recommended: true
    },
    {
      name: "Frêne",
      rating: 4,
      description: "Bonne combustion même légèrement humide. Flammes agréables.",
      recommended: true
    },
    {
      name: "Bouleau",
      rating: 3,
      description: "Brûle vite avec de belles flammes. Idéal pour l'allumage.",
      recommended: true
    },
    {
      name: "Pin / Sapin",
      rating: 2,
      description: "À éviter : résine qui encrasse, étincelles fréquentes, fumée abondante.",
      recommended: false
    }
  ];

  const maintenanceTips = [
    {
      icon: Droplets,
      title: "Acier corten",
      tips: [
        "Aucun entretien particulier requis",
        "La patine rouille est normale et protectrice",
        "Videz simplement les cendres après utilisation",
        "Peut rester dehors toute l'année"
      ]
    },
    {
      icon: Wrench,
      title: "Acier classique",
      tips: [
        "Appliquez une huile ou peinture haute température",
        "Protégez avec une housse ou stockez à l'abri",
        "Videz les cendres et l'humidité régulièrement",
        "Vérifiez l'apparition de rouille et traitez rapidement"
      ]
    }
  ];

  const lightingSteps = [
    {
      step: 1,
      title: "Préparer le foyer",
      description: "Assurez-vous que le brasero est propre et sec. Placez-le sur une surface stable."
    },
    {
      step: 2,
      title: "Installer le petit bois",
      description: "Disposez du petit bois sec en tipi ou en grille. Laissez de l'espace pour l'air."
    },
    {
      step: 3,
      title: "Ajouter l'allume-feu",
      description: "Placez un allume-feu naturel (laine de bois, cube de cire) au centre."
    },
    {
      step: 4,
      title: "Allumer et patienter",
      description: "Allumez l'allume-feu et laissez le petit bois prendre sans intervenir."
    },
    {
      step: 5,
      title: "Ajouter les bûches",
      description: "Quand le petit bois est bien pris, ajoutez progressivement des bûches plus grosses."
    }
  ];

  const proTips = [
    {
      icon: Thermometer,
      title: "Bois sec = moins de fumée",
      description: "Utilisez du bois avec moins de 20% d'humidité. Le bois humide fume beaucoup et dégage moins de chaleur."
    },
    {
      icon: TreePine,
      title: "Stockez votre bois correctement",
      description: "Gardez votre bois à l'abri de la pluie mais ventilé. Idéalement sous un abri avec les côtés ouverts."
    },
    {
      icon: Flame,
      title: "Ne surchargez pas le foyer",
      description: "Un feu bien oxygéné brûle mieux qu'un foyer surchargé. Ajoutez le bois progressivement."
    },
    {
      icon: Sparkles,
      title: "Laissez un lit de cendres",
      description: "Conservez 2-3 cm de cendres au fond du brasero. Elles isolent et facilitent l'allumage."
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
                  <Lightbulb className="w-6 h-6 text-[#8B4513]" />
                </div>
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Conseils
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Astuces et conseils <span className="text-slate-900">brasero</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Profitez pleinement de votre brasero avec nos conseils d'experts. Allumage, 
                choix du bois, entretien, sécurité : tout ce que vous devez savoir pour des 
                soirées réussies autour du feu.
              </p>
            </div>
          </div>
        </section>

        {/* Sécurité */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Sécurité
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Les règles de sécurité essentielles
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Avant tout, la sécurité. Respectez ces consignes pour profiter sereinement de votre brasero.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {safetyTips.map((tip) => (
                <div 
                  key={tip.title}
                  className="bg-white p-6 border border-slate-200"
                >
                  <tip.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{tip.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comment allumer */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-[#8B4513]" />
                  <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                    Allumage
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Comment allumer son brasero ?
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  Un bon allumage garantit une soirée réussie. Suivez ces étapes simples 
                  pour un feu parfait dès le premier essai.
                </p>
                
                <div className="mt-8 space-y-0">
                  {lightingSteps.map((item, index) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-10 h-10 bg-[#8B4513] text-white flex items-center justify-center font-bold">
                          {item.step}
                        </div>
                        {index < lightingSteps.length - 1 && (
                          <div className="w-0.5 flex-1 bg-[#CD853F]" />
                        )}
                      </div>
                      <div className="pt-1 pb-6">
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                        <p className="text-slate-600 text-sm mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-[#f6f1e9] p-8 border border-slate-200">
                <div className="flex items-start gap-4 mb-6">
                  <Info className="w-6 h-6 text-[#8B4513] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Astuce de pro
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Préférez les allume-feux naturels (laine de bois, cubes de cire) 
                      aux journaux qui produisent beaucoup de cendres volantes. 
                      La technique du "tipi" avec le petit bois fonctionne à merveille : 
                      l'air circule et le feu prend rapidement.
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Ce qu'il vous faut :</h4>
                  <ul className="space-y-2">
                    {[
                      "Petit bois sec (brindilles, copeaux)",
                      "Allume-feu naturel",
                      "Bûches de bois dur (chêne, hêtre)",
                      "Briquet ou allumettes longues"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#8B4513] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Choix du bois */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TreePine className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Combustible
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Quel bois utiliser ?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Tous les bois ne se valent pas. Voici notre guide pour choisir le meilleur combustible.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {woodTypes.map((wood) => (
                <div 
                  key={wood.name}
                  className={`bg-white p-6 border ${wood.recommended ? 'border-slate-200' : 'border-red-200'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-slate-900">{wood.name}</h3>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Flame 
                          key={star} 
                          className={`w-4 h-4 ${star <= wood.rating ? 'text-[#CD853F]' : 'text-slate-200'}`}
                          fill={star <= wood.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-3">
                    {wood.description}
                  </p>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 ${
                    wood.recommended 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {wood.recommended ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Recommandé
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        À éviter
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Entretien */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Entretien
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Comment entretenir son brasero ?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                L'entretien dépend du type d'acier de votre brasero
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {maintenanceTips.map((maintenance) => (
                <div 
                  key={maintenance.title}
                  className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <maintenance.icon className="w-8 h-8 text-[#8B4513]" />
                    <h3 className="text-xl font-semibold text-slate-900">{maintenance.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {maintenance.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-3 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-[#8B4513] flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Astuces de pro */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Astuces
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Les astuces de nos artisans
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {proTips.map((tip) => (
                <div 
                  key={tip.title}
                  className="bg-white p-6 border border-slate-200"
                >
                  <tip.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{tip.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-24 bg-white text-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
              Des questions sur votre brasero ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions 
              et vous conseiller.
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
                href="/info/faq"
                className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                Voir la FAQ
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
