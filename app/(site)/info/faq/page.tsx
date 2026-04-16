import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  HelpCircle, 
  ArrowRight,
  Truck,
  CreditCard,
  RotateCcw,
  Flame,
  Wrench,
  Shield,
  Clock,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ShoppingCart,
  Paintbrush
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `FAQ Brasero | Questions avant achat | ${settings.storeName}`,
    description: `Réponses à vos questions avant d'acheter : quel brasero choisir, différences entre modèles, options de personnalisation, modalités de commande. FAQ ${settings.storeName}.`,
    keywords: [
      "FAQ brasero",
      "questions brasero",
      "quel brasero choisir",
      "aide choix brasero",
      "différence brasero",
      "brasero acier corten vs acier",
      "taille brasero",
      "questions avant achat brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Questions fréquentes | ${settings.storeName}`,
      description: `Retrouvez toutes les réponses à vos questions sur nos braseros artisanaux manufacturés en France.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/accesoiresbrasero.webp" }],
    },
    alternates: {
      canonical: "/info/faq",
    },
  };
}

// Schéma JSON-LD FAQPage pour le SEO — inclut TOUTES les questions
function generateStructuredData(categories: Array<{ questions: Array<{ question: string; answer: string }> }>) {
  const allQuestions = categories.flatMap((cat) =>
    cat.questions.map((faq) => ({
      "@type": "Question" as const,
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: faq.answer,
      },
    }))
  );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions,
  };
}

export default async function FAQPage() {
  const settings = await getSiteSettings();

  const faqCategories = [
    {
      id: "commande",
      icon: ShoppingCart,
      title: "Commande & Achat",
      questions: [
        {
          question: "Comment passer commande sur votre site ?",
          answer: "Parcourez notre catalogue, sélectionnez le brasero qui vous plaît, choisissez les options souhaitées et ajoutez-le au panier. Renseignez vos informations de livraison et procédez au paiement sécurisé. Vous recevrez une confirmation par email."
        },
        {
          question: "Puis-je modifier ou annuler ma commande ?",
          answer: "Vous pouvez modifier ou annuler votre commande tant qu'elle n'a pas été expédiée. Contactez-nous rapidement par téléphone ou email avec votre numéro de commande."
        },
        {
          question: "Comment suivre ma commande ?",
          answer: "Dès l'expédition de votre brasero, vous recevez un email avec le numéro de suivi. Vous pouvez suivre votre colis en temps réel sur le site du transporteur."
        },
        {
          question: "Proposez-vous des devis pour les professionnels ?",
          answer: "Oui, nous proposons des devis personnalisés pour les professionnels (restaurants, hôtels, paysagistes, collectivités). Contactez-nous avec vos besoins pour recevoir une offre adaptée."
        }
      ]
    },
    {
      id: "paiement",
      icon: CreditCard,
      title: "Paiement",
      questions: [
        {
          question: "Quels moyens de paiement acceptez-vous ?",
          answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), le paiement en 3x sans frais à partir de 500€, et le virement bancaire pour les professionnels et particuliers."
        },
        {
          question: "Le paiement est-il sécurisé ?",
          answer: "Oui, tous les paiements sont sécurisés via Stripe, leader mondial du paiement en ligne. Vos données bancaires sont cryptées et ne sont jamais stockées sur nos serveurs."
        },
        {
          question: "Comment fonctionne le paiement en 3x sans frais ?",
          answer: "À partir de 500€ d'achat, vous pouvez régler en 3 mensualités égales sans frais. La première échéance est prélevée à la commande, les deux suivantes à 30 et 60 jours."
        },
        {
          question: "Puis-je payer par virement bancaire ?",
          answer: "Oui, le virement bancaire est accepté pour les professionnels et les particuliers. Les coordonnées bancaires vous sont communiquées lors de la commande. L'expédition est effectuée à réception du virement."
        }
      ]
    },
    {
      id: "livraison",
      icon: Truck,
      title: "Livraison & Expédition",
      questions: [
        {
          question: "Quels sont les délais de livraison ?",
          answer: "Les braseros en stock sont expédiés sous 24 à 48h. Comptez 3 à 7 jours ouvrés pour la France métropolitaine, 5 à 10 jours pour la Belgique et le Luxembourg, 7 à 14 jours pour la Suisse et l'Allemagne."
        },
        {
          question: "Dans quels pays livrez-vous ?",
          answer: "Nous livrons en France métropolitaine, Belgique, Luxembourg, Suisse et Allemagne. Pour d'autres destinations, contactez-nous pour étudier les possibilités."
        },
        {
          question: "Quels sont les frais de livraison ?",
          answer: `Les frais de livraison sont calculés en fonction du poids et de la destination lors du paiement de votre commande.`
        },
        {
          question: "Comment sont emballés les braseros ?",
          answer: "Chaque brasero est soigneusement emballé : protection en mousse, carton double cannelure renforcé et cerclage. L'assurance transport est incluse pour une livraison en parfait état."
        },
        {
          question: "Puis-je choisir une date de livraison ?",
          answer: "Oui, nos transporteurs proposent la livraison sur rendez-vous. Vous serez contacté pour convenir d'un créneau qui vous convient."
        }
      ]
    },
    {
      id: "retour",
      icon: RotateCcw,
      title: "Retours & Remboursements",
      questions: [
        {
          question: "Quel est le délai pour retourner un produit ?",
          answer: "Vous disposez de 14 jours après réception pour retourner un produit. Le produit doit être dans son état d'origine, non utilisé et dans son emballage d'origine."
        },
        {
          question: "Comment effectuer un retour ?",
          answer: "Contactez-nous par email ou téléphone pour initier le retour. Nous vous fournirons les instructions et l'étiquette de retour prépayée si le retour est dû à un défaut."
        },
        {
          question: "Dans quel délai suis-je remboursé ?",
          answer: "Le remboursement est effectué sous 14 jours après réception et vérification du produit retourné, sur le même moyen de paiement que la commande initiale."
        },
        {
          question: "Mon brasero est arrivé endommagé, que faire ?",
          answer: "Prenez des photos des dommages et contactez-nous immédiatement. Nous organiserons le remplacement de votre produit dans les plus brefs délais, sans frais supplémentaires."
        }
      ]
    },
    {
      id: "produit",
      icon: Flame,
      title: "Nos braseros",
      questions: [
        {
          question: "En quels matériaux sont fabriqués vos braseros ?",
          answer: "Nos braseros sont fabriqués en acier de haute qualité. Nous proposons de l'acier corten (qui développe une patine rouille protectrice naturelle), de l'acier noir et de l'acier brut selon les modèles."
        },
        {
          question: "Quelle est la différence entre l'acier corten et l'acier classique ?",
          answer: "L'acier corten est un acier auto-patinable qui développe une couche de rouille protectrice. Il ne nécessite aucun entretien et résiste aux intempéries. L'acier classique peut nécessiter un traitement antirouille."
        },
        {
          question: "Quelle taille de brasero choisir ?",
          answer: "Cela dépend de votre espace et de l'usage prévu. Un brasero de 60-80cm convient aux petits jardins et terrasses. Pour les grands espaces, optez pour un modèle de 100cm ou plus."
        },
        {
          question: "Peut-on cuisiner sur vos braseros ?",
          answer: "Oui, la plupart de nos braseros sont compatibles avec nos accessoires de cuisson : grille de barbecue, plancha, support pour cocotte. Consultez les accessoires compatibles sur chaque fiche produit."
        }
      ]
    },
    {
      id: "entretien",
      icon: Wrench,
      title: "Entretien & Utilisation",
      questions: [
        {
          question: "Comment entretenir mon brasero en acier corten ?",
          answer: "L'acier corten ne nécessite aucun entretien particulier ! La patine de rouille protège naturellement le métal. Videz simplement les cendres après chaque utilisation."
        },
        {
          question: "Comment protéger mon brasero en hiver ?",
          answer: "Pour les braseros en acier classique, nous recommandons une housse de protection ou un stockage à l'abri. Les braseros en acier corten peuvent rester dehors toute l'année."
        },
        {
          question: "Quel combustible utiliser ?",
          answer: "Utilisez du bois sec de préférence (chêne, hêtre, charme). Évitez les bois résineux qui encrassent le foyer et produisent des étincelles. Les bûches compressées sont également adaptées."
        },
        {
          question: "Mon brasero fait de la fumée, est-ce normal ?",
          answer: "Un peu de fumée au démarrage est normal. Pour réduire la fumée, utilisez du bois bien sec (moins de 20% d'humidité) et assurez une bonne circulation d'air."
        },
        {
          question: "À quelle distance placer le brasero des murs et végétation ?",
          answer: "Respectez une distance minimum de 2 mètres des murs, clôtures, végétation et matériaux inflammables. Placez le brasero sur une surface stable et non combustible."
        }
      ]
    },
    {
      id: "personnalisation",
      icon: Paintbrush,
      title: "Personnalisation & Sur mesure",
      questions: [
        {
          question: "Proposez-vous des braseros sur mesure ?",
          answer: `Oui, notre atelier à ${settings.atelier.city} réalise des braseros personnalisés et sur mesure. Dimensions, formes, motifs découpés au laser : contactez-nous pour discuter de votre projet.`
        },
        {
          question: "Quelles personnalisations sont possibles ?",
          answer: "Nous proposons des gravures, découpes laser personnalisées, dimensions sur mesure, et finitions spéciales. Logos, prénoms, motifs graphiques : tout est réalisable."
        },
        {
          question: "Quel est le délai pour un brasero personnalisé ?",
          answer: "Le délai de fabrication pour un brasero personnalisé est généralement de 2 à 4 semaines selon la complexité. Le délai précis vous sera communiqué lors du devis."
        },
        {
          question: "Comment obtenir un devis pour un brasero sur mesure ?",
          answer: "Contactez-nous via notre formulaire en précisant vos besoins : dimensions, personnalisations souhaitées, quantité. Nous vous répondons sous 24h avec un devis détaillé."
        }
      ]
    },
    {
      id: "garantie",
      icon: Shield,
      title: "Garantie & SAV",
      questions: [
        {
          question: "Quelle est la garantie sur vos braseros ?",
          answer: "Tous nos braseros bénéficient d'une garantie fabricant de 2 ans couvrant les défauts de fabrication. Cette garantie ne couvre pas l'usure normale ni les dommages liés à une mauvaise utilisation."
        },
        {
          question: "Comment faire jouer la garantie ?",
          answer: "Contactez notre service client avec votre numéro de commande et des photos du problème constaté. Nous évaluerons la situation et vous proposerons une solution (réparation, remplacement ou remboursement)."
        },
        {
          question: "Proposez-vous des pièces détachées ?",
          answer: "Oui, nous proposons des pièces détachées et accessoires pour nos braseros : grilles, bacs à cendres, pieds de remplacement. Contactez-nous avec la référence de votre brasero."
        }
      ]
    }
  ];

  const structuredData = generateStructuredData(faqCategories);

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
                  <HelpCircle className="w-6 h-6 text-[#8B4513]" />
                </div>
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  FAQ
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Questions fréquemment posées
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Retrouvez toutes les réponses à vos questions sur nos braseros artisanaux, 
                la commande, la livraison, l'entretien et la personnalisation. Vous ne trouvez 
                pas votre réponse ? Contactez-nous !
              </p>
            </div>
          </div>
        </section>

        {/* Navigation rapide */}
        <section className="py-8 bg-[#f6f1e9] sticky top-0 z-10 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {faqCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:text-[#8B4513] hover:border-[#8B4513] transition-colors"
                >
                  <category.icon className="w-4 h-4" />
                  {category.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ par catégories */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {faqCategories.map((category) => (
              <div key={category.id} id={category.id} className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-[#8B4513]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <details 
                      key={index}
                      className="bg-[#f6f1e9] border border-slate-200 group"
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
            ))}
          </div>
        </section>

        {/* Besoin d'aide supplémentaire */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Vous n'avez pas trouvé votre réponse ?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Notre équipe est à votre disposition pour répondre à toutes vos questions
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <a
                href={`mailto:${settings.storeEmail}`}
                className="bg-white p-6 border border-slate-200 text-center hover:shadow-md transition-shadow group"
              >
                <Mail className="w-10 h-10 text-[#8B4513] mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#8B4513] transition-colors">
                  Par email
                </h3>
                <p className="text-sm text-slate-600 mb-3">Réponse sous 24h ouvrées</p>
                <span className="text-[#8B4513] text-sm font-medium">{settings.storeEmail}</span>
              </a>

              <a
                href={`tel:${settings.storePhone.replace(/\s/g, '')}`}
                className="bg-white p-6 border border-slate-200 text-center hover:shadow-md transition-shadow group"
              >
                <Phone className="w-10 h-10 text-[#8B4513] mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#8B4513] transition-colors">
                  Par téléphone
                </h3>
                <p className="text-sm text-slate-600 mb-3">Lun-Ven : 9h-18h</p>
                <span className="text-[#8B4513] text-sm font-medium">{settings.storePhone}</span>
              </a>

              <Link
                href="/contact"
                className="bg-white p-6 border border-slate-200 text-center hover:shadow-md transition-shadow group"
              >
                <MessageSquare className="w-10 h-10 text-[#8B4513] mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#8B4513] transition-colors">
                  Formulaire de contact
                </h3>
                <p className="text-sm text-slate-600 mb-3">Pour toute demande spécifique</p>
                <span className="inline-flex items-center gap-1 text-[#8B4513] text-sm font-medium">
                  Nous contacter
                  <ArrowRight size={14} />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-24 bg-white text-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
              Prêt à découvrir nos braseros ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Parcourez notre collection de braseros artisanaux manufacturés en France
              et trouvez le modèle parfait pour votre extérieur.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                Voir nos braseros
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                Demander un devis
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
