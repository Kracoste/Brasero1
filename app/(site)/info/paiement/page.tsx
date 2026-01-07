import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  CreditCard, 
  Shield, 
  Lock,
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  Clock,
  MapPin,
  Banknote,
  BadgeCheck,
  FileText,
  HelpCircle
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Moyens de paiement | Paiement sécurisé et 3x sans frais | ${settings.storeName}`,
    description: `Modes de paiement acceptés : carte bancaire Visa/Mastercard, virement SEPA, paiement en 3x sans frais. Transactions sécurisées SSL 256 bits.`,
    keywords: [
      "paiement brasero 3x sans frais",
      "paiement carte bancaire brasero",
      "virement SEPA brasero",
      "paiement sécurisé SSL",
      "facilité paiement brasero",
      "modes paiement brasero",
      "paiement échelonné brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Paiement sécurisé | ${settings.storeName}`,
      description: `Payez en toute sécurité votre brasero artisanal. Carte bancaire, virement, paiement en 3x sans frais.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/info/paiement",
    },
  };
}

// Schéma JSON-LD pour le SEO
function generateStructuredData(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Paiement sécurisé - ${settings.storeName}`,
    "description": `Moyens de paiement acceptés chez ${settings.storeName}`,
    "provider": {
      "@type": "Organization",
      "name": settings.storeName,
      "url": "https://www.atelier-lbf.fr"
    },
    "offers": {
      "@type": "Offer",
      "acceptedPaymentMethod": [
        {
          "@type": "PaymentMethod",
          "name": "Carte bancaire (Visa, Mastercard, CB)"
        },
        {
          "@type": "PaymentMethod",
          "name": "Virement bancaire"
        }
      ]
    }
  };
}

export default async function PaiementPage() {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData(settings);

  const paymentMethods = [
    {
      icon: CreditCard,
      title: "Carte bancaire",
      description: "Visa, Mastercard, CB",
      details: "Paiement instantané et sécurisé. Vos données sont protégées par cryptage SSL 256 bits."
    },
    {
      icon: Banknote,
      title: "Virement bancaire",
      description: "Professionnels et particuliers",
      details: "Contactez-nous par email pour recevoir nos coordonnées bancaires. Expédition après réception du virement."
    },
    {
      icon: CreditCard,
      title: "Paiement en 3x sans frais",
      description: "À partir de 500€ d'achat",
      details: "Étalez votre paiement en 3 mensualités sans aucun frais supplémentaire."
    }
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: "Cryptage SSL 256 bits",
      description: "Toutes vos données sont cryptées lors de la transmission"
    },
    {
      icon: Shield,
      title: "Données non stockées",
      description: "Vos informations bancaires ne sont jamais conservées sur nos serveurs"
    },
    {
      icon: BadgeCheck,
      title: "Conformité PCI-DSS",
      description: "Notre prestataire de paiement Stripe respecte les normes bancaires internationales"
    },
    {
      icon: CheckCircle2,
      title: "3D Secure",
      description: "Authentification renforcée pour une sécurité maximale"
    }
  ];

  const faqs = [
    {
      question: "Quand ma carte sera-t-elle débitée ?",
      answer: "Votre carte est débitée immédiatement lors de la validation de votre commande. Vous recevez une confirmation par email."
    },
    {
      question: "Puis-je payer en plusieurs fois ?",
      answer: "Oui !Vous pouvez payer en 3x sans frais. Cette option est proposée lors du paiement."
    },
    {
      question: "Le paiement par virement est-il possible ?",
      answer: "Oui, le virement bancaire est accepté. Après validation de votre commande, vous recevrez nos coordonnées bancaires par email. L'expédition sera effectuée après réception du virement."
    },
    {
      question: "Mes données bancaires sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons Stripe, un leader mondial du paiement en ligne. Vos données sont cryptées en SSL 256 bits et ne transitent jamais par nos serveurs."
    },
    {
      question: "Que faire en cas de problème de paiement ?",
      answer: `Contactez notre service client par email à ${settings.storeEmail} ou par téléphone au ${settings.storePhone}. Nous vous aiderons à résoudre le problème rapidement.`
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-white py-16 sm:py-24 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#8B4513]/10 text-[#8B4513] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Lock size={16} />
                Paiement 100% sécurisé
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Payez en toute sécurité
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Nous proposons plusieurs moyens de paiement sécurisés pour vous faciliter la vie. 
                Toutes vos transactions sont protégées par les dernières technologies de cryptage.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/produits"
                  className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] hover:brightness-110 text-white font-medium tracking-wide uppercase px-6 py-3 transition-all"
                >
                  Voir nos braseros
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 transition-all border border-slate-200"
                >
                  <Phone size={18} />
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Moyens de paiement */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Nos moyens de paiement
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Choisissez le mode de paiement qui vous convient le mieux
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {paymentMethods.map((method) => (
                <div 
                  key={method.title}
                  className="relative bg-white p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-orange-100 flex items-center justify-center mb-4">
                    <method.icon className="w-6 h-6 text-[#8B4513]" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {method.title}
                  </h3>
                  <p className="text-sm text-[#8B4513] font-medium mb-3">
                    {method.description}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {method.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sécurité */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Votre sécurité est notre priorité
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  Nous utilisons les technologies les plus avancées pour protéger vos données 
                  et garantir des transactions 100% sécurisées.
                </p>
                
                <div className="mt-8 space-y-6">
                  {securityFeatures.map((feature) => (
                    <div key={feature.title} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-100 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-[#8B4513]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <Shield className="w-16 h-16 text-[#8B4513] mx-auto" />
                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  Paiement via Stripe
                </h3>
                <p className="mt-2 text-slate-600">
                  Nous utilisons Stripe, le leader mondial du paiement en ligne, 
                  utilisé par des millions d'entreprises dans le monde.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <div className="bg-white px-4 py-2 border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">VISA</span>
                  </div>
                  <div className="bg-white px-4 py-2 border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">Mastercard</span>
                  </div>
                  <div className="bg-white px-4 py-2 border border-slate-200">
                    <span className="text-sm font-semibold text-slate-700">CB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Paiement en 3x */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white p-8 sm:p-10">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-[#8B4513]" />
                    Comment ça marche ?
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#8B4513] text-white flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Choisissez le paiement en 3x</h4>
                        <p className="text-sm text-slate-600">Lors du paiement, sélectionnez l'option "Payer en 3x sans frais"</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#8B4513] text-white flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Première échéance immédiate</h4>
                        <p className="text-sm text-slate-600">1/3 du montant est débité lors de la commande</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#8B4513] text-white flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Échéances automatiques</h4>
                        <p className="text-sm text-slate-600">Les 2 mensualités suivantes sont prélevées à J+30 et J+60</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 bg-orange-50 p-4 border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <strong>Exemple :</strong> Pour un brasero à 600€, vous payez 200€ aujourd'hui, 
                      puis 200€ dans 30 jours, et 200€ dans 60 jours. Aucun frais supplémentaire !
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Paiement en 3x sans frais
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  À partir de 500€ d'achat, étalez votre paiement en 3 mensualités 
                  sans aucun frais supplémentaire. Une solution flexible pour vous faire plaisir 
                  sans impacter votre budget.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                    Aucun frais, aucun intérêt
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                    À partir de 500€ d'achat
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                    Décision instantanée
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                    100% en ligne, sans justificatif
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Facturation */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <FileText className="w-12 h-12 text-[#8B4513] mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Facturation simplifiée
              </h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                Une facture détaillée est automatiquement générée et envoyée par email 
                après validation de votre commande. Vous pouvez également la télécharger 
                à tout moment depuis votre espace client.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="bg-slate-50 px-6 py-4 border border-slate-200">
                  <p className="font-semibold text-slate-900">Facture par email</p>
                  <p className="text-sm text-slate-500">Envoyée automatiquement</p>
                </div>
                <div className="bg-slate-50 px-6 py-4 border border-slate-200">
                  <p className="font-semibold text-slate-900">Format PDF</p>
                  <p className="text-sm text-slate-500">Téléchargeable</p>
                </div>
                <div className="bg-slate-50 px-6 py-4 border border-slate-200">
                  <p className="font-semibold text-slate-900">Espace client</p>
                  <p className="text-sm text-slate-500">Historique complet</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <HelpCircle className="w-12 h-12 text-[#8B4513] mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Questions fréquentes
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Tout ce que vous devez savoir sur le paiement
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 border border-slate-200"
                >
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
              Prêt à commander ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Découvrez notre collection de braseros artisanaux et profitez d'un paiement 
              sécurisé et flexible.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] hover:brightness-110 text-white font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                Découvrir nos braseros
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] hover:brightness-110 text-white font-medium tracking-wide uppercase px-8 py-4 transition-all"
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
                <Mail className="w-4 h-4" />
                <span>{settings.storeEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{settings.storePhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Lun-Ven : 9h-18h</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{settings.atelier.city}, {settings.atelier.department}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
