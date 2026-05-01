import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { ContactForm } from "@/components/ContactForm";
import { LeafletMap } from "@/components/LeafletMap";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Users,
  Wrench,
  FileText,
  Truck,
  HelpCircle,
  Calendar
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Contact et devis brasero | Demande personnalisée | ${settings.storeName}`,
    description: `Demandez un devis gratuit pour votre brasero. Contactez l'Atelier LBF par téléphone, email ou formulaire. Fabrication artisanale à ${settings.atelier.city}. Réponse sous 24h.`,
    keywords: [
      "contact atelier brasero",
      "devis brasero gratuit",
      "demande devis brasero",
      "téléphone atelier brasero",
      "email fabricant brasero",
      "formulaire contact brasero",
      settings.atelier.city,
      settings.atelier.department,
      settings.storeName,
    ],
    openGraph: {
      title: `Contactez-nous | ${settings.storeName}`,
      description: `Demandez votre devis brasero sur mesure. Atelier artisanal à ${settings.atelier.city}. Réponse garantie sous 24h ouvrées.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/Braserobanner.webp" }],
    },
    alternates: {
      canonical: "/contact",
    },
  };
}

// Schéma JSON-LD pour le SEO Local
function generateStructuredData(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": settings.storeName,
    "image": "https://www.atelier-lbf.fr/logo/logo.png",
    "@id": "https://www.atelier-lbf.fr",
    "url": "https://www.atelier-lbf.fr",
    "telephone": settings.storePhone,
    "email": settings.storeEmail,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.storeAddress,
      "addressLocality": settings.atelier.city,
      "addressRegion": settings.atelier.department,
      "postalCode": "79320",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": settings.atelier.lat,
      "longitude": settings.atelier.lng
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "€€",
    "description": "Atelier de fabrication artisanale de braseros en France. Création sur mesure, braseros personnalisés et accessoires de qualité.",
    "areaServed": ["France", "Belgium", "Luxembourg", "Switzerland", "Germany"]
  };
}

export default async function ContactInfoPage() {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData(settings);

  const contactReasons = [
    {
      icon: FileText,
      title: "Demande de devis",
      description: "Obtenez un devis personnalisé pour un brasero sur mesure adapté à vos besoins."
    },
    {
      icon: Wrench,
      title: "Projet personnalisé",
      description: "Discutons de votre projet : dimensions, finitions, gravures ou design unique."
    },
    {
      icon: Truck,
      title: "Questions livraison",
      description: "Renseignez-vous sur les délais, zones de livraison et options d'expédition."
    },
    {
      icon: HelpCircle,
      title: "Support après-vente",
      description: "Besoin d'aide avec votre commande ? Notre équipe est là pour vous accompagner."
    }
  ];

  const advantages = [
    "Réponse garantie sous 24h ouvrées",
    "Devis détaillé et sans engagement",
    "Conseils personnalisés par des artisans",
    "Accompagnement sur mesure pour chaque projet"
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
                <div className="w-12 h-12 bg-[#f1f5f9] flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-[#0f172a]" />
                </div>
                <span className="text-[#0f172a] font-medium uppercase tracking-wide text-sm">
                  Contact
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Parlons de votre <span className="text-slate-900">projet brasero</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Besoin d'un brasero sur mesure, d'un devis personnalisé ou d'informations sur nos 
                créations artisanales ? Notre équipe à {settings.atelier.city} est à votre écoute 
                pour réaliser le brasero de vos rêves.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={`tel:${settings.storePhone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-br from-[#0f172a] to-[#475569] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-3 transition-all"
                >
                  <Phone size={18} />
                  Appeler maintenant
                </a>
                <a
                  href={`mailto:${settings.storeEmail}`}
                  className="inline-flex items-center gap-2 border-2 border-[#0f172a] text-[#0f172a] hover:bg-[#0f172a] hover:text-white font-medium tracking-wide uppercase px-6 py-3 transition-all"
                >
                  <Mail size={18} />
                  Envoyer un email
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Raisons de nous contacter */}
        <section className="py-16 sm:py-24 bg-[#f1f5f9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#0f172a]" />
                <span className="text-[#0f172a] font-medium uppercase tracking-wide text-sm">
                  À votre service
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Comment pouvons-nous vous aider ?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Quelle que soit votre demande, nous sommes là pour vous accompagner
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactReasons.map((reason) => (
                <div 
                  key={reason.title}
                  className="bg-white p-6 border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <reason.icon className="w-10 h-10 text-[#0f172a] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{reason.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulaire et coordonnées */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Formulaire */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-6">
                  Envoyez-nous un message
                </h2>
                <p className="text-slate-600 mb-8">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24 heures 
                  ouvrées. Pour une demande de devis, précisez le type de brasero souhaité, 
                  les dimensions et toute personnalisation éventuelle.
                </p>
                
                <div className="bg-[#f1f5f9] p-6 sm:p-8 border border-slate-200">
                  <ContactForm />
                </div>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {advantages.map((advantage) => (
                    <div key={advantage} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#0f172a] flex-shrink-0" />
                      <span>{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coordonnées */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Nos coordonnées
                </h2>
                
                <div className="bg-[#f1f5f9] p-6 sm:p-8 border border-slate-200 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#0f172a]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Adresse de l'atelier</h3>
                      <p className="text-slate-600">{settings.storeAddress}</p>
                      <p className="text-slate-500 text-sm mt-1">
                        {settings.atelier.city}, {settings.atelier.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#0f172a]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Téléphone</h3>
                      <a 
                        href={`tel:${settings.storePhone.replace(/\s/g, '')}`}
                        className="text-[#0f172a] hover:text-[#475569] transition-colors"
                      >
                        {settings.storePhone}
                      </a>
                      <p className="text-slate-500 text-sm mt-1">
                        Du lundi au vendredi, 9h-18h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#0f172a]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                      <a 
                        href={`mailto:${settings.storeEmail}`}
                        className="text-[#0f172a] hover:text-[#475569] transition-colors"
                      >
                        {settings.storeEmail}
                      </a>
                      <p className="text-slate-500 text-sm mt-1">
                        Réponse sous 24h ouvrées
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[#0f172a]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Horaires d'ouverture</h3>
                      <ul className="space-y-1 text-slate-600">
                        {settings.schedules.map((schedule) => (
                          <li key={schedule} className="text-sm">{schedule}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Carte */}
                <div className="border border-slate-200 overflow-hidden">
                  <LeafletMap
                    lat={settings.atelier.lat}
                    lng={settings.atelier.lng}
                    zoom={13}
                    markerLabel={settings.storeName}
                    className="h-[300px]"
                  />
                </div>

                <div className="bg-white p-6 border border-slate-200">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-[#0f172a] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Visite de l'atelier</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Vous souhaitez visiter notre atelier de fabrication à {settings.atelier.city} ? 
                        Prenez rendez-vous pour découvrir notre savoir-faire artisanal et voir nos 
                        braseros en cours de fabrication.
                      </p>
                      <a
                        href={`mailto:${settings.storeEmail}?subject=Demande de visite de l'atelier`}
                        className="inline-flex items-center gap-2 text-[#0f172a] hover:text-[#475569] font-medium mt-3 transition-colors"
                      >
                        Demander une visite
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Contact */}
        <section className="py-16 sm:py-24 bg-[#f1f5f9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Questions fréquentes
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Quel est le délai de réponse à une demande de devis ?",
                  answer: "Nous nous engageons à répondre à toutes les demandes de devis sous 24 heures ouvrées. Pour les projets complexes ou sur mesure, nous pouvons vous recontacter par téléphone pour affiner votre demande."
                },
                {
                  question: "Puis-je visiter l'atelier avant de commander ?",
                  answer: `Oui, nous accueillons les visiteurs sur rendez-vous à notre atelier de ${settings.atelier.city}. Vous pourrez voir nos braseros, découvrir notre processus de fabrication et échanger directement avec nos artisans.`
                },
                {
                  question: "Comment obtenir un devis pour un brasero sur mesure ?",
                  answer: "Utilisez notre formulaire de contact en précisant vos besoins : dimensions souhaitées, type de brasero, personnalisations (gravures, finitions spéciales). Nous vous recontacterons avec un devis détaillé et personnalisé."
                },
                {
                  question: "Proposez-vous des conseils pour choisir mon brasero ?",
                  answer: "Absolument ! Nos artisans sont à votre disposition pour vous conseiller sur le choix du brasero adapté à votre espace, votre utilisation et vos goûts. N'hésitez pas à nous appeler ou nous écrire."
                },
                {
                  question: "Comment suivre l'avancement de ma commande ?",
                  answer: "Après votre commande, vous recevez des emails à chaque étape clé : confirmation, expédition avec numéro de suivi. Vous pouvez également nous contacter par téléphone ou email pour toute question sur votre commande."
                },
              ].map((faq, index) => (
                <details 
                  key={index}
                  className="bg-white border border-slate-100 group"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-900 hover:text-[#0f172a] transition-colors">
                    {faq.question}
                    <span className="text-[#0f172a] group-open:rotate-180 transition-transform">
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
              Prêt à créer votre brasero sur mesure ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              De la simple question au projet personnalisé le plus ambitieux, notre équipe 
              d'artisans est à votre écoute pour donner vie à vos idées.
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
                href="/atelier"
                className="inline-flex items-center gap-2 border-2 border-[#0f172a] text-[#0f172a] hover:bg-[#0f172a] hover:text-white font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                Visiter l'atelier
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
                className="flex items-center gap-2 hover:text-[#0f172a] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#0f172a]" />
                <span>{settings.storeEmail}</span>
              </a>
              <a 
                href={`tel:${settings.storePhone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-[#0f172a] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#0f172a]" />
                <span>{settings.storePhone}</span>
              </a>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0f172a]" />
                <span>Lun-Ven : 9h-18h</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0f172a]" />
                <span>{settings.atelier.city}, {settings.atelier.department}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
