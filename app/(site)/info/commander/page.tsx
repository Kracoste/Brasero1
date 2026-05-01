import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  Clock,
  MapPin,
  PackageCheck,
  HeartHandshake
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Comment commander un brasero | Guide étape par étape | ${settings.storeName}`,
    description: `Guide complet pour commander votre brasero : créer un compte, ajouter au panier, valider la commande. Processus simple et rapide chez ${settings.storeName}.`,
    keywords: [
      "commander brasero en ligne",
      "comment acheter brasero",
      "guide achat brasero",
      "panier brasero",
      "processus commande brasero",
      "créer compte brasero",
      "valider commande brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Comment commander | ${settings.storeName}`,
      description: `Commandez votre brasero artisanal en toute simplicité. Fabrication française, paiement sécurisé, livraison soignée.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/accesoiresbrasero.webp" }],
    },
    alternates: {
      canonical: "/info/commander",
    },
  };
}

// Schéma JSON-LD pour le SEO
function generateStructuredData(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `Comment commander un brasero chez ${settings.storeName}`,
    "description": `Guide étape par étape pour commander votre brasero artisanal manufacturé en France`,
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Choisir votre brasero",
        "text": "Parcourez notre catalogue et sélectionnez le brasero qui correspond à vos besoins"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Ajouter au panier",
        "text": "Cliquez sur 'Ajouter au panier' et choisissez les accessoires complémentaires"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Finaliser la commande",
        "text": "Renseignez vos informations de livraison et procédez au paiement sécurisé"
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Réception",
        "text": "Recevez votre brasero livré avec soin à votre domicile"
      }
    ],
    "totalTime": "PT10M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": "À partir de 299€"
    }
  };
}

export default async function CommanderPage() {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData(settings);

  const steps = [
    {
      number: "1",
      title: "Choisissez votre brasero",
      description: "Parcourez notre collection de braseros artisanaux manufacturés en France. Chaque modèle est conçu dans notre atelier à Moncoutant avec des matériaux de qualité.",
      icon: ShoppingCart,
      cta: { text: "Voir nos braseros", href: "/produits" }
    },
    {
      number: "2",
      title: "Ajoutez au panier",
      description: "Sélectionnez la taille et les options qui vous conviennent. N'hésitez pas à ajouter des accessoires pour compléter votre expérience brasero.",
      icon: PackageCheck,
      cta: { text: "Découvrir les accessoires", href: "/accessoires" }
    },
    {
      number: "3",
      title: "Finalisez votre commande",
      description: "Renseignez votre adresse de livraison et choisissez votre mode de paiement. Toutes les transactions sont sécurisées par cryptage SSL.",
      icon: CreditCard,
      cta: null
    },
    {
      number: "4",
      title: "Recevez votre brasero",
      description: "Votre commande est préparée avec soin et expédiée. Suivez votre livraison en temps réel grâce au numéro de suivi envoyé par email.",
      icon: Truck,
      cta: null
    }
  ];

  const guarantees = [
    {
      icon: Shield,
      title: "Paiement 100% sécurisé",
      description: "Vos données bancaires sont protégées par le protocole SSL. Nous acceptons CB, Visa et Mastercard.",
      href: "/info/paiement"
    },
    {
      icon: Truck,
      title: "Livraison soignée",
      description: `Frais de livraison calculés selon le poids lors du paiement. Vos produits sont emballés avec soin.`,
      href: "/livraison"
    },
    {
      icon: HeartHandshake,
      title: "Fabrication artisanale",
      description: `Chaque brasero est fabriqué à la main dans notre atelier de ${settings.atelier.city} (${settings.atelier.department}).`,
      href: "/fabrication"
    },
    {
      icon: CheckCircle2,
      title: "Satisfait ou remboursé",
      description: "14 jours pour changer d'avis. Retour simplifié et remboursement rapide.",
      href: "/retours"
    }
  ];

  const paymentMethods = [
    { name: "Carte bancaire", description: "CB, Visa, Mastercard" },
    { name: "Virement bancaire", description: "Pour les grosses commandes" },
    { name: "Paiement en 3x", description: "Sans frais dès 500€" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/acceuil/acceuil1.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight">
                Commander votre brasero artisanal
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed">
                Découvrez comment passer commande simplement et en toute sécurité. 
                De la sélection à la livraison, nous vous accompagnons à chaque étape.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/produits"
                  className="inline-flex items-center gap-2 bg-gradient-to-br from-[#0f172a] to-[#475569] hover:brightness-110 text-white font-semibold px-6 py-3 rounded-md shadow-lg transition-all"
                >
                  Voir nos braseros
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full transition-all border border-white/20"
                >
                  <Phone size={18} />
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Étapes de commande */}
        <section className="py-16 sm:py-24 bg-[#f1f5f9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Comment commander en 4 étapes
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Un processus simple et rapide pour recevoir votre brasero chez vous
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className="relative bg-white p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Numéro */}
                  <div className="absolute -top-4 left-6 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  
                  {/* Icône */}
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mt-2">
                    <step.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">
                    {step.description}
                  </p>
                  
                  {step.cta && (
                    <Link
                      href={step.cta.href}
                      className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm"
                    >
                      {step.cta.text}
                      <ArrowRight size={14} />
                    </Link>
                  )}
                  
                  {/* Ligne de connexion vers la carte suivante */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-8 h-0.5 bg-orange-300 -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Moyens de paiement */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Paiement sécurisé et flexible
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  Nous proposons plusieurs moyens de paiement pour vous faciliter la vie. 
                  Toutes les transactions sont sécurisées et vos données sont protégées.
                </p>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.name}
                      className="bg-slate-50 p-4 border border-slate-100"
                    >
                      <p className="font-semibold text-slate-900">{method.name}</p>
                      <p className="text-sm text-slate-500">{method.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>Transactions cryptées SSL 256 bits</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 sm:p-12">
                  <div className="text-center">
                    <CreditCard className="w-16 h-16 text-orange-500 mx-auto" />
                    <h3 className="mt-6 text-xl font-semibold text-slate-900">
                      Paiement sécurisé
                    </h3>
                    <p className="mt-2 text-slate-600">
                      Réglez votre commande en toute sécurité par carte bancaire ou virement.
                    </p>
                    <Link
                      href="/info/paiement"
                      className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mt-4"
                    >
                      En savoir plus
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Garanties */}
        <section className="py-16 sm:py-24 bg-[#f1f5f9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Nos engagements
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Achetez en toute confiance avec {settings.storeName}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {guarantees.map((guarantee) => (
                <Link
                  key={guarantee.title}
                  href={guarantee.href}
                  className="bg-slate-50 p-6 border border-slate-200 hover:shadow-md hover:border-[#475569]/40 transition-all group"
                >
                  <guarantee.icon className="w-10 h-10 text-[#0f172a] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900 group-hover:text-[#0f172a] transition-colors">{guarantee.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {guarantee.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[#0f172a] text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                    En savoir plus <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Livraison */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-slate-50 p-8 sm:p-10">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                    <Truck className="w-6 h-6 text-orange-500" />
                    Informations de livraison
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-200">
                      <span className="text-slate-600">France métropolitaine</span>
                      <span className="font-semibold text-slate-900">2 à 4 semaines</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-200">
                      <span className="text-slate-600">Belgique, Luxembourg</span>
                      <span className="font-semibold text-slate-900">3 à 5 semaines</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-200">
                      <span className="text-slate-600">Allemagne</span>
                      <span className="font-semibold text-slate-900">3 à 5 semaines</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-slate-600">Suisse</span>
                      <span className="font-semibold text-slate-900">3 à 5 semaines</span>
                    </div>
                  </div>
                  
                  <Link
                    href="/info/expedition"
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mt-6"
                  >
                    Voir les détails d'expédition
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Livraison rapide et soignée
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  Nos braseros sont des produits artisanaux qui méritent une attention particulière. 
                  C'est pourquoi nous les emballons avec soin et travaillons avec des transporteurs 
                  spécialisés pour garantir une livraison en parfait état.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Emballage renforcé et protection optimale</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Numéro de suivi envoyé par email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Livraison sur rendez-vous disponible</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Assurance transport incluse</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Rapide */}
        <section className="py-16 sm:py-24 bg-orange-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Questions fréquentes sur la commande
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Puis-je modifier ma commande après validation ?",
                  answer: "Oui, vous pouvez modifier ou annuler votre commande tant qu'elle n'a pas été expédiée. Contactez-nous rapidement par email ou téléphone."
                },
                {
                  question: "Quand serai-je débité ?",
                  answer: "Votre carte est débitée immédiatement lors de la validation de la commande. Pour les virements bancaires, la commande est traitée à réception du paiement."
                },
                {
                  question: "Comment suivre ma commande ?",
                  answer: "Dès l'expédition, vous recevez un email avec le numéro de suivi. Vous pouvez également suivre votre commande depuis votre espace client."
                },
                {
                  question: "Livrez-vous en Belgique et en Suisse ?",
                  answer: "Oui ! Nous livrons en France métropolitaine, en Belgique, au Luxembourg, en Suisse et en Allemagne. Les délais varient selon la destination."
                },
              ].map((faq, index) => (
                <details 
                  key={index}
                  className="bg-white rounded-xl border border-orange-100 group"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-900 hover:text-orange-600 transition-colors">
                    {faq.question}
                    <span className="text-orange-500 group-open:rotate-180 transition-transform">
                      <ArrowRight className="rotate-90" size={18} />
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/info/faq"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                Voir toutes les FAQ
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-24 bg-white text-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
              Prêt à commander votre brasero ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez notre collection de braseros artisanaux, fabriqués avec passion 
              dans notre atelier de {settings.atelier.city}.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#0f172a] to-[#475569] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                Découvrir nos braseros
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#0f172a] to-[#475569] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                <Phone size={18} />
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

        {/* Contact rapide */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>{settings.storeEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>{settings.storePhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Lun-Ven : 9h-18h</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{settings.atelier.city}, {settings.atelier.department}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
