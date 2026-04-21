import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Headphones,
  ShoppingCart,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  MapPin,
  CheckCircle2,
  Star,
  Users,
  Zap
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Service client et SAV brasero | Aide et support | ${settings.storeName}`,
    description: `Service après-vente ${settings.storeName} : suivi de commande, retours, garantie et assistance technique. Équipe française disponible du lundi au vendredi.`,
    keywords: [
      "SAV brasero",
      "service après-vente brasero",
      "suivi commande brasero",
      "aide retour brasero",
      "support technique brasero",
      "assistance client brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Service Client | ${settings.storeName}`,
      description: `Notre équipe est à votre disposition pour vous accompagner avant, pendant et après votre achat.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/Braserobanner.webp" }],
    },
    alternates: {
      canonical: "/info/service-clientele",
    },
  };
}

export default async function ServiceClientelePage() {
  const settings = await getSiteSettings();

  const services = [
    {
      icon: ShoppingCart,
      title: "Commander",
      description: "Découvrez comment passer commande sur notre site, créer un compte et suivre votre panier.",
      href: "/info/commander",
      color: "bg-blue-50"
    },
    {
      icon: CreditCard,
      title: "Paiement",
      description: "Moyens de paiement acceptés, paiement sécurisé et options de financement disponibles.",
      href: "/info/paiement",
      color: "bg-green-50"
    },
    {
      icon: Truck,
      title: "Expédition & Livraison",
      description: "Délais de livraison, transporteurs, suivi de colis et zones desservies.",
      href: "/info/expedition",
      color: "bg-orange-50"
    },
    {
      icon: RotateCcw,
      title: "Retours & Échanges",
      description: "Politique de retour, procédure d'échange et remboursement sous 14 jours.",
      href: "/info/retourner",
      color: "bg-purple-50"
    },
    {
      icon: Shield,
      title: "Confidentialité",
      description: "Protection de vos données personnelles et politique de confidentialité RGPD.",
      href: "/info/confidentialite-politique",
      color: "bg-red-50"
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Réponses aux questions fréquentes sur nos produits, commandes et services.",
      href: "/info/faq",
      color: "bg-yellow-50"
    }
  ];

  const commitments = [
    {
      icon: Headphones,
      title: "Équipe dédiée",
      description: "Une équipe française à votre écoute pour répondre à toutes vos questions."
    },
    {
      icon: Zap,
      title: "Réponse rapide",
      description: "Nous nous engageons à répondre à vos demandes sous 24h ouvrées."
    },
    {
      icon: Star,
      title: "Satisfaction garantie",
      description: "Votre satisfaction est notre priorité, nous trouvons toujours une solution."
    },
    {
      icon: Users,
      title: "Conseil personnalisé",
      description: "Des conseils adaptés à votre projet et votre espace extérieur."
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Par téléphone",
      value: settings.storePhone,
      href: `tel:${settings.storePhone.replace(/\s/g, '')}`,
      description: "Du lundi au vendredi, 9h-18h"
    },
    {
      icon: Mail,
      title: "Par email",
      value: settings.storeEmail,
      href: `mailto:${settings.storeEmail}`,
      description: "Réponse sous 24h ouvrées"
    },
    {
      icon: MessageCircle,
      title: "Formulaire de contact",
      value: "Écrivez-nous",
      href: "/contact",
      description: "Pour toute demande détaillée"
    }
  ];

  const faqQuick = [
    {
      question: "Comment suivre ma commande ?",
      answer: "Vous recevrez un email avec un lien de suivi dès l'expédition de votre colis. Vous pouvez également suivre votre commande depuis votre espace client."
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais varient de 3 à 7 jours ouvrés selon le produit et votre localisation. Les braseros sur mesure nécessitent un délai de fabrication supplémentaire."
    },
    {
      question: "Puis-je modifier ou annuler ma commande ?",
      answer: "Oui, contactez-nous rapidement. Tant que la commande n'est pas expédiée, nous pouvons la modifier ou l'annuler sans frais."
    },
    {
      question: "Comment retourner un produit ?",
      answer: "Vous disposez de 14 jours pour nous retourner un produit. Contactez notre service client pour obtenir une étiquette de retour prépayée."
    }
  ];

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CustomerService",
            "name": `Service Client ${settings.storeName}`,
            "description": "Service client pour l'achat de braseros artisanaux français",
            "areaServed": "FR",
            "availableLanguage": "French",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": settings.storePhone,
              "email": settings.storeEmail,
              "contactType": "customer service",
              "availableLanguage": "French",
              "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              }
            },
            "provider": {
              "@type": "Organization",
              "name": settings.storeName,
              "url": "https://www.atelier-lbf.fr"
            }
          })
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center">
                <Headphones className="w-6 h-6 text-[#8B4513]" />
              </div>
              <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                Assistance
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
              Service à la clientèle
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              Notre équipe est à votre disposition pour vous accompagner avant, pendant et après 
              votre achat. Trouvez rapidement l'aide dont vous avez besoin ou contactez-nous directement.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-3 transition-all"
              >
                <MessageCircle size={18} />
                Nous contacter
              </Link>
              <Link
                href="/info/faq"
                className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-6 py-3 transition-all"
              >
                <HelpCircle size={18} />
                Consulter la FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
              Comment pouvons-nous vous aider ?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Accédez rapidement aux informations dont vous avez besoin
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group bg-white p-6 border border-slate-200 hover:border-[#8B4513] hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 ${service.color} flex items-center justify-center mb-4`}>
                  <service.icon className="w-7 h-7 text-[#8B4513]" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-slate-900 group-hover:text-[#8B4513] transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-1 text-[#8B4513] font-medium text-sm group-hover:gap-2 transition-all">
                  En savoir plus
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nos engagements */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
              Nos engagements
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Une relation client basée sur la confiance et la qualité
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map((commitment) => (
              <div 
                key={commitment.title}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-[#f6f1e9] flex items-center justify-center mx-auto mb-4">
                  <commitment.icon className="w-8 h-8 text-[#8B4513]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-900">{commitment.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {commitment.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
              Contactez-nous
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Plusieurs moyens pour nous joindre selon vos préférences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method) => (
              <Link
                key={method.title}
                href={method.href}
                className="group bg-white p-8 border border-slate-200 text-center hover:border-[#8B4513] hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-[#f6f1e9] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#8B4513] transition-colors">
                  <method.icon className="w-8 h-8 text-[#8B4513] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-lg mb-1 text-slate-900">{method.title}</h3>
                <p className="text-[#8B4513] font-medium mb-2">{method.value}</p>
                <p className="text-slate-500 text-sm">{method.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 bg-white p-8 border border-slate-200">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-5 h-5 text-[#8B4513]" />
                <span><strong>Horaires :</strong> Lun-Ven 9h-18h</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-5 h-5 text-[#8B4513]" />
                <span><strong>Atelier :</strong> {settings.atelier.city}, {settings.atelier.department}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Zap className="w-5 h-5 text-[#8B4513]" />
                <span><strong>Réponse :</strong> Sous 24h ouvrées</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ rapide */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
              Questions fréquentes
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Réponses rapides aux questions les plus courantes
            </p>
          </div>

          <div className="space-y-4">
            {faqQuick.map((faq, index) => (
              <div 
                key={index}
                className="bg-[#f6f1e9] p-6 border border-slate-200"
              >
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#8B4513] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/info/faq"
              className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#CD853F] font-medium transition-colors"
            >
              Voir toutes les questions fréquentes
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Satisfaction */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-[#CD853F] fill-current" />
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-4">
              98% de clients satisfaits
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Notre priorité est votre satisfaction. Nous mettons tout en œuvre pour vous offrir 
              une expérience d'achat exceptionnelle et un service après-vente irréprochable.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8B4513]">24h</div>
                <div className="text-sm text-slate-600">Délai de réponse</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8B4513]">14 jours</div>
                <div className="text-sm text-slate-600">Pour changer d'avis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8B4513]">2 ans</div>
                <div className="text-sm text-slate-600">Garantie minimum</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
            Besoin d'aide supplémentaire ?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner 
            dans votre projet.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
            >
              <MessageCircle size={18} />
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

      {/* Contact rapide footer */}
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
  );
}
