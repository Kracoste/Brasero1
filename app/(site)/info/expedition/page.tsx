import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  AlertCircle,
  Globe,
  Box,
  CalendarCheck
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Livraison brasero | Délais, zones et frais de port | ${settings.storeName}`,
    description: `Tout sur la livraison de votre brasero : délais d'expédition, zones desservies (France, Belgique, Suisse), transporteurs et frais de port. Suivi colis inclus.`,
    keywords: [
      "livraison brasero France",
      "délai expédition brasero",
      "frais de port brasero",
      "transporteur brasero",
      "livraison brasero Belgique",
      "livraison brasero Suisse",
      "zones livraison brasero",
      "suivi colis brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Livraison et expédition | ${settings.storeName}`,
      description: `Livraison soignée de votre brasero artisanal. France, Belgique, Luxembourg, Suisse et Allemagne. Emballage renforcé et suivi en temps réel.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/Produits/og-brasero.webp" }],
    },
    alternates: {
      canonical: "/info/expedition",
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
        "name": "Quels sont les délais de livraison pour un brasero ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "En France métropolitaine, comptez 3 à 7 jours ouvrés. Pour la Belgique et le Luxembourg, 5 à 10 jours. Pour la Suisse et l'Allemagne, 7 à 14 jours."
        }
      },
      {
        "@type": "Question",
        "name": "Dans quels pays livrez-vous les braseros ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nous livrons en France métropolitaine, Belgique, Luxembourg, Suisse et Allemagne."
        }
      },
      {
        "@type": "Question",
        "name": "Comment sont emballés les braseros pour la livraison ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Chaque brasero est emballé avec soin : protection en mousse, carton renforcé double cannelure et cerclage. L'assurance transport est incluse."
        }
      }
    ]
  };
}

export default async function ExpeditionPage() {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData();

  const deliveryZones = [
    {
      zone: "France métropolitaine",
      delay: "3 à 7 jours ouvrés",
      icon: "🇫🇷",
      description: "Livraison sur toute la France continentale"
    },
    {
      zone: "Belgique",
      delay: "5 à 10 jours ouvrés",
      icon: "🇧🇪",
      description: "Livraison dans tout le royaume"
    },
    {
      zone: "Luxembourg",
      delay: "5 à 10 jours ouvrés",
      icon: "🇱🇺",
      description: "Livraison dans tout le pays"
    },
    {
      zone: "Suisse",
      delay: "7 à 14 jours ouvrés",
      icon: "🇨🇭",
      description: "Livraison dans tous les cantons"
    },
    {
      zone: "Allemagne",
      delay: "7 à 14 jours ouvrés",
      icon: "🇩🇪",
      description: "Livraison dans tous les Länder"
    }
  ];

  const shippingFeatures = [
    {
      icon: Package,
      title: "Emballage renforcé",
      description: "Protection en mousse, carton double cannelure et cerclage pour une protection optimale de votre brasero."
    },
    {
      icon: Shield,
      title: "Assurance transport",
      description: "Tous nos envois sont assurés. En cas de dommage pendant le transport, nous remplaçons votre produit."
    },
    {
      icon: Truck,
      title: "Transporteurs spécialisés",
      description: "Nous travaillons avec des transporteurs habitués aux produits volumineux et fragiles."
    },
    {
      icon: CalendarCheck,
      title: "Livraison sur rendez-vous",
      description: "Choisissez le créneau qui vous convient pour recevoir votre brasero en toute tranquillité."
    }
  ];

  const trackingSteps = [
    {
      step: 1,
      title: "Confirmation de commande",
      description: "Vous recevez un email de confirmation avec le récapitulatif de votre commande."
    },
    {
      step: 2,
      title: "Préparation",
      description: "Votre brasero est préparé et emballé avec soin dans notre atelier."
    },
    {
      step: 3,
      title: "Expédition",
      description: "Un email avec le numéro de suivi vous est envoyé dès l'expédition."
    },
    {
      step: 4,
      title: "Livraison",
      description: "Le transporteur vous contacte pour convenir d'un créneau de livraison."
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
                  <Truck className="w-6 h-6 text-[#8B4513]" />
                </div>
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Livraison & Expédition
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Livraison soignée de votre <span className="text-slate-900">brasero</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Nous apportons le plus grand soin à l'expédition de votre brasero artisanal. 
                Emballage renforcé, transporteurs spécialisés et suivi en temps réel pour 
                une livraison en parfait état.
              </p>
            </div>
          </div>
        </section>

        {/* Zones de livraison */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Zones de livraison
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Où livrons-nous ?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Nous expédions vos braseros dans 5 pays européens
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {deliveryZones.map((zone) => (
                <div 
                  key={zone.zone}
                  className="bg-white p-6 border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-4">{zone.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {zone.zone}
                  </h3>
                  <div className="flex items-center gap-2 text-[#8B4513] font-medium mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{zone.delay}</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {zone.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white p-6 border border-slate-200 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-[#8B4513] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Autres destinations</p>
                <p className="text-slate-600 mt-1">
                  Vous souhaitez être livré dans un autre pays ? Contactez-nous pour étudier 
                  les possibilités d'expédition et obtenir un devis personnalisé.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#CD853F] font-medium mt-3"
                >
                  Nous contacter
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Caractéristiques de l'expédition */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Un emballage soigné pour vos braseros
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Chaque brasero est un produit artisanal qui mérite une protection optimale
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shippingFeatures.map((feature) => (
                <div 
                  key={feature.title}
                  className="bg-[#f6f1e9] p-6 border border-slate-200"
                >
                  <feature.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Suivi de commande */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Suivez votre commande en temps réel
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  De la validation de votre commande à la livraison, vous êtes informé 
                  à chaque étape. Nous vous tenons au courant par email de l'avancement 
                  de votre brasero.
                </p>
                
                <div className="mt-8 space-y-0">
                  {trackingSteps.map((item, index) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-10 h-10 bg-[#8B4513] text-white flex items-center justify-center font-bold">
                          {item.step}
                        </div>
                        {index < trackingSteps.length - 1 && (
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
              
              <div className="bg-white p-8 sm:p-10 border border-slate-200">
                <div className="text-center">
                  <Box className="w-16 h-16 text-[#8B4513] mx-auto" />
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">
                    Numéro de suivi
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Dès l'expédition de votre brasero, vous recevez par email votre 
                    numéro de suivi. Vous pouvez ainsi suivre votre colis en temps 
                    réel sur le site du transporteur.
                  </p>
                  <div className="mt-6 p-4 bg-[#f6f1e9]">
                    <p className="text-sm text-slate-500">Exemple de numéro de suivi</p>
                    <p className="font-mono text-lg text-slate-900 mt-1">FR123456789XY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Informations importantes */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Informations importantes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#f6f1e9] p-8 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#8B4513]" />
                  À la réception
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Vérifiez l'état du colis avant de signer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">En cas de dommage visible, émettez des réserves écrites</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Prenez des photos si nécessaire</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Contactez-nous sous 48h en cas de problème</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#f6f1e9] p-8 border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-[#8B4513]" />
                  Braseros personnalisés et sur mesure
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Vous souhaitez un brasero personnalisé ou un brasero sur mesure ? 
                  Notre atelier de fabrication artisanale à {settings.atelier.city} réalise 
                  vos projets uniques. Pour ces créations sur mesure, un délai de fabrication 
                  supplémentaire sera communiqué lors de votre demande de devis.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Nos braseros en stock sont expédiés sous 24 à 48h. Chaque brasero artisanal 
                  fabriqué en France bénéficie du savoir-faire de notre atelier.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Questions fréquentes sur la livraison
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Quels sont les frais de livraison ?",
                  answer: "Les frais de livraison sont calculés en fonction du poids et de la destination. Ils sont affichés clairement lors du passage de commande avant le paiement."
                },
                {
                  question: "Puis-je choisir une date de livraison ?",
                  answer: "Oui, nos transporteurs proposent la livraison sur rendez-vous. Vous serez contacté pour convenir d'un créneau qui vous convient."
                },
                {
                  question: "Que faire si je suis absent lors de la livraison ?",
                  answer: "Le transporteur vous laissera un avis de passage et vous recontactera pour reprogrammer la livraison. Vous pouvez également suivre votre colis et modifier le lieu ou la date de livraison."
                },
                {
                  question: "Mon brasero est arrivé endommagé, que faire ?",
                  answer: "Si vous constatez des dommages, prenez des photos et contactez-nous immédiatement. Nous organiserons le remplacement de votre produit dans les plus brefs délais."
                },
                {
                  question: "Livrez-vous en Corse ou dans les DOM-TOM ?",
                  answer: "La livraison en Corse est possible avec un délai supplémentaire. Pour les DOM-TOM, contactez-nous pour étudier les possibilités et obtenir un devis."
                },
              ].map((faq, index) => (
                <details 
                  key={index}
                  className="bg-white border border-slate-100 group"
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
        <section className="py-16 sm:py-24 bg-white text-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
              Des questions sur la livraison ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions 
              concernant l'expédition de votre brasero.
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
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                Voir nos braseros
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact rapide */}
        <section className="py-12 bg-slate-100">
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
