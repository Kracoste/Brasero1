import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  RotateCcw, 
  Package, 
  Clock, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  FileText,
  Truck,
  CreditCard,
  HelpCircle
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Retours et remboursements brasero | Politique de retour | ${settings.storeName}`,
    description: `Politique de retour simple et transparente pour votre brasero artisanal. 14 jours pour changer d'avis, remboursement rapide, service client réactif. ${settings.storeName}.`,
    keywords: [
      "retour brasero",
      "remboursement brasero",
      "échange brasero",
      "politique retour brasero",
      "satisfait ou remboursé brasero",
      "rétractation brasero",
      "garantie brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Retours et remboursements | ${settings.storeName}`,
      description: `Politique de retour flexible pour votre brasero. 14 jours de rétractation, remboursement sous 14 jours, accompagnement personnalisé.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/Produits/og-brasero.webp" }],
    },
    alternates: {
      canonical: "/info/retours",
    },
  };
}

// Schéma JSON-LD pour le SEO
function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Quel est le délai pour retourner un brasero ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vous disposez de 14 jours à compter de la réception de votre brasero pour exercer votre droit de rétractation, conformément à la législation française."
        }
      },
      {
        "@type": "Question",
        "name": "Comment demander un remboursement pour un brasero ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Contactez notre service client par email ou téléphone pour initier votre demande de retour. Nous vous enverrons les instructions et une étiquette de retour."
        }
      },
      {
        "@type": "Question",
        "name": "Sous quel délai suis-je remboursé ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le remboursement est effectué sous 14 jours maximum après réception et vérification du brasero retourné, sur le même moyen de paiement utilisé lors de l'achat."
        }
      }
    ]
  };
}

export default async function RetoursPage() {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData();

  const returnSteps = [
    {
      step: 1,
      title: "Contactez-nous",
      description: "Envoyez-nous un email ou appelez-nous pour nous informer de votre souhait de retourner votre brasero.",
      icon: Mail
    },
    {
      step: 2,
      title: "Préparez votre colis",
      description: "Emballez soigneusement votre brasero dans son emballage d'origine.",
      icon: Package
    },
    {
      step: 3,
      title: "Expédiez le retour",
      description: "Envoyez votre colis à l'adresse indiquée. Conservez votre preuve d'envoi.",
      icon: Truck
    },
    {
      step: 4,
      title: "Remboursement",
      description: "Dès réception et vérification, nous procédons au remboursement sous 14 jours.",
      icon: CreditCard
    }
  ];

  const returnConditions = [
    {
      icon: Clock,
      title: "14 jours de rétractation",
      description: "Conformément à la loi française, vous disposez de 14 jours après réception pour retourner votre brasero sans justification."
    },
    {
      icon: Package,
      title: "État d'origine",
      description: "Le brasero doit être retourné dans son état d'origine, non utilisé, avec tous ses accessoires et son emballage."
    },
    {
      icon: Shield,
      title: "Remboursement garanti",
      description: "Nous vous remboursons intégralement le prix du brasero sous 14 jours après réception du retour."
    },
    {
      icon: FileText,
      title: "Preuve d'achat",
      description: "Conservez votre facture ou confirmation de commande pour faciliter le traitement de votre retour."
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
                  <RotateCcw className="w-6 h-6 text-[#8B4513]" />
                </div>
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Retours & Remboursements
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Politique de retour <span className="text-slate-900">simple et transparente</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Votre satisfaction est notre priorité. Si votre brasero artisanal ne vous 
                convient pas, nous vous accompagnons dans votre démarche de retour avec 
                un processus simple et un remboursement rapide.
              </p>
            </div>
          </div>
        </section>

        {/* Garantie satisfait ou remboursé */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8B4513] mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Satisfait ou remboursé
              </h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                Nous croyons en la qualité de nos braseros artisanaux fabriqués en France. 
                C'est pourquoi nous vous offrons une garantie satisfait ou remboursé de 
                <strong className="text-slate-900"> 14 jours</strong> après réception de votre commande.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                  <span>14 jours pour changer d'avis</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                  <span>Remboursement intégral</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                  <span>Service client réactif</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Étapes de retour */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Comment retourner votre brasero ?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Un processus simple en 4 étapes pour votre tranquillité
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {returnSteps.map((item, index) => (
                <div 
                  key={item.step}
                  className="relative bg-[#f6f1e9] p-6 border border-slate-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#8B4513] text-white flex items-center justify-center font-bold text-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className="pt-1">
                      <item.icon className="w-6 h-6 text-[#CD853F] mb-2" />
                      <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  {index < returnSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-6 h-0.5 bg-[#CD853F] -translate-y-1/2 z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conditions de retour */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Conditions de retour
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Tout ce que vous devez savoir pour retourner votre brasero
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnConditions.map((condition) => (
                <div 
                  key={condition.title}
                  className="bg-white p-6 border border-slate-200"
                >
                  <condition.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{condition.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {condition.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cas particuliers */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-[#f6f1e9] p-8 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-[#8B4513]" />
                  Brasero endommagé à la réception
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Si votre brasero artisanal arrive endommagé, contactez-nous immédiatement 
                  avec des photos du colis et du produit. Nous organisons le remplacement 
                  ou le remboursement sans frais à votre charge.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Émettez des réserves à la livraison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Prenez des photos des dommages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Contactez-nous sous 48h</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#f6f1e9] p-8 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-[#8B4513]" />
                  Braseros personnalisés et sur mesure
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Les braseros personnalisés ou fabriqués sur mesure selon vos spécifications 
                  ne peuvent pas être retournés, sauf en cas de défaut de fabrication. 
                  Chaque création artisanale est unique et réalisée spécialement pour vous.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  En cas de défaut constaté sur un brasero sur mesure, notre garantie 
                  fabricant s'applique. Contactez notre atelier pour toute réclamation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Frais de retour */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 sm:p-10 border border-slate-200">
              <div className="text-center">
                <Truck className="w-12 h-12 text-[#8B4513] mx-auto mb-4" />
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Frais de retour
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  Les frais de retour sont à la charge du client, sauf en cas de produit 
                  défectueux ou d'erreur de notre part. Pour les braseros volumineux, 
                  nous pouvons vous aider à organiser le transport retour à tarif préférentiel.
                </p>
                <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <div className="bg-[#f6f1e9] p-4">
                    <p className="font-semibold text-slate-900">Retour standard</p>
                    <p className="text-sm text-slate-600 mt-1">Frais à votre charge</p>
                  </div>
                  <div className="bg-[#f6f1e9] p-4">
                    <p className="font-semibold text-slate-900">Produit défectueux</p>
                    <p className="text-sm text-slate-600 mt-1">Retour gratuit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Questions fréquentes sur les retours
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Puis-je retourner un brasero utilisé ?",
                  answer: "Non, le brasero doit être retourné dans son état d'origine, non utilisé et non assemblé si applicable. Un brasero présentant des traces d'utilisation (suie, résidus de combustion) ne pourra pas être accepté en retour."
                },
                {
                  question: "Comment suis-je remboursé ?",
                  answer: "Le remboursement s'effectue sur le même moyen de paiement utilisé lors de l'achat. Pour un paiement par carte bancaire, le remboursement apparaît sous 5 à 10 jours ouvrés sur votre compte selon votre banque."
                },
                {
                  question: "Puis-je échanger mon brasero contre un autre modèle ?",
                  answer: "Oui, nous proposons l'échange contre un autre modèle de brasero. Contactez-nous pour organiser l'échange. La différence de prix sera ajustée en conséquence."
                },
                {
                  question: "Que faire si j'ai perdu l'emballage d'origine ?",
                  answer: "Si vous n'avez plus l'emballage d'origine, utilisez un carton solide avec suffisamment de protection. Nos braseros sont des produits lourds qui nécessitent un emballage adapté pour le transport."
                },
                {
                  question: "Le délai de 14 jours commence-t-il à la commande ou à la réception ?",
                  answer: "Le délai de rétractation de 14 jours commence à la date de réception de votre brasero, conformément à la législation française sur la vente à distance."
                },
              ].map((faq, index) => (
                <details 
                  key={index}
                  className="bg-[#f6f1e9] border border-slate-200 group"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-900 hover:text-[#8B4513] transition-colors">
                    {faq.question}
                    <span className="text-[#8B4513] group-open:rotate-180 transition-transform">
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
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
              Besoin d'aide pour votre retour ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Notre service client est à votre écoute pour vous accompagner dans 
              votre démarche de retour et répondre à toutes vos questions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                <Mail size={18} />
                Nous contacter
              </Link>
              <a
                href={`tel:${settings.storePhone}`}
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                <Phone size={18} />
                Appeler
              </a>
            </div>
          </div>
        </section>

        {/* Contact rapide */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8B4513]" />
                <span>{settings.storeEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8B4513]" />
                <span>{settings.storePhone}</span>
              </div>
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
