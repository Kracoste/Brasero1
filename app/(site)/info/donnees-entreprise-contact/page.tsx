import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { LeafletMap } from "@/components/LeafletMap";
import { 
  Building2, 
  ArrowRight,
  MapPin,
  Clock,
  Mail,
  Phone,
  FileText,
  Globe,
  CreditCard,
  Scale,
  Users,
  Briefcase,
  ExternalLink
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Mentions légales et informations société | ${settings.storeName}`,
    description: `Mentions légales et données d'entreprise de l'Atelier LBF. SIRET, numéro TVA, siège social, RCS. Fabricant artisanal de braseros à ${settings.atelier.city}, France.`,
    keywords: [
      "mentions légales brasero",
      "informations légales brasero",
      "SIRET atelier LBF",
      "RCS brasero artisanal",
      "données entreprise brasero",
      settings.atelier.city,
      settings.atelier.department,
      settings.storeName,
    ],
    openGraph: {
      title: `Données entreprise et contact | ${settings.storeName}`,
      description: `Toutes les informations pour nous contacter et nos données légales d'entreprise.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/Braserobanner.webp" }],
    },
    alternates: {
      canonical: "/info/donnees-entreprise-contact",
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
    "priceRange": "€€"
  };
}

export default async function DonneesEntreprisePage() {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData(settings);

  const companyInfo = [
    {
      label: "Raison sociale",
      value: settings.storeName
    },
    {
      label: "Forme juridique",
      value: "Entreprise individuelle"
    },
    {
      label: "Capital social",
      value: "10 000 €"
    },
    {
      label: "SIRET",
      value: "948 471 578 00013"
    },
    {
      label: "Numéro TVA",
      value: "FR62948471578"
    },
    {
      label: "RCS",
      value: "Niort"
    },
    {
      label: "Code APE/NAF",
      value: "2562B"
    }
  ];

  const directors = [
    {
      name: "Directeur de publication",
      value: "Gérant de la société"
    },
    {
      name: "Responsable traitement données",
      value: settings.storeEmail
    }
  ];

  const hosting = {
    name: "Vercel Inc.",
    address: "340 S Lemon Ave #4133, Walnut, CA 91789, USA",
    website: "https://vercel.com"
  };

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
                  <Building2 className="w-6 h-6 text-[#8B4513]" />
                </div>
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Informations légales
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Données sur l'entreprise <span className="text-slate-900">et contact</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Retrouvez toutes les informations légales de notre entreprise ainsi que 
                nos coordonnées complètes pour nous contacter.
              </p>
            </div>
          </div>
        </section>

        {/* Coordonnées */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Informations de contact */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Phone className="w-5 h-5 text-[#8B4513]" />
                  <h2 className="text-2xl font-display font-bold text-slate-900">
                    Nous contacter
                  </h2>
                </div>
                
                <div className="bg-white p-6 sm:p-8 border border-slate-200 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Adresse</h3>
                      <p className="text-slate-600">{settings.storeAddress}</p>
                      <p className="text-slate-500 text-sm mt-1">
                        {settings.atelier.city}, {settings.atelier.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Téléphone</h3>
                      <a 
                        href={`tel:${settings.storePhone.replace(/\s/g, '')}`}
                        className="text-[#8B4513] hover:text-[#CD853F] transition-colors"
                      >
                        {settings.storePhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                      <a 
                        href={`mailto:${settings.storeEmail}`}
                        className="text-[#8B4513] hover:text-[#CD853F] transition-colors"
                      >
                        {settings.storeEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Site web</h3>
                      <a 
                        href="https://www.atelier-lbf.fr"
                        className="text-[#8B4513] hover:text-[#CD853F] transition-colors"
                      >
                        www.atelier-lbf.fr
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[#8B4513]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Horaires</h3>
                      <ul className="space-y-1 text-slate-600">
                        {settings.schedules.map((schedule) => (
                          <li key={schedule} className="text-sm">{schedule}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-3 transition-all"
                  >
                    <Mail size={18} />
                    Formulaire de contact
                  </Link>
                </div>
              </div>

              {/* Carte */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-[#8B4513]" />
                  <h2 className="text-2xl font-display font-bold text-slate-900">
                    Notre localisation
                  </h2>
                </div>
                
                <div className="border border-slate-200 overflow-hidden h-[400px]">
                  <LeafletMap
                    lat={settings.atelier.lat}
                    lng={settings.atelier.lng}
                    zoom={13}
                    markerLabel={settings.storeName}
                    className="h-full"
                  />
                </div>
                
                <p className="mt-4 text-sm text-slate-500">
                  Notre atelier est situé à {settings.atelier.city}, dans les {settings.atelier.department}. 
                  Visite sur rendez-vous uniquement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Informations légales */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Informations légales
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Données de l'entreprise
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Informations société */}
              <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-[#8B4513]" />
                  <h3 className="text-xl font-semibold text-slate-900">
                    Identification de la société
                  </h3>
                </div>
                <dl className="space-y-4">
                  {companyInfo.map((info) => (
                    <div key={info.label} className="flex flex-col sm:flex-row sm:justify-between gap-1 pb-3 border-b border-slate-200 last:border-0">
                      <dt className="text-slate-500 text-sm">{info.label}</dt>
                      <dd className="text-slate-900 font-medium">{info.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Responsables */}
              <div className="space-y-8">
                <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-6 h-6 text-[#8B4513]" />
                    <h3 className="text-xl font-semibold text-slate-900">
                      Responsables
                    </h3>
                  </div>
                  <dl className="space-y-4">
                    {directors.map((director) => (
                      <div key={director.name} className="flex flex-col gap-1 pb-3 border-b border-slate-200 last:border-0">
                        <dt className="text-slate-500 text-sm">{director.name}</dt>
                        <dd className="text-slate-900 font-medium">{director.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="w-6 h-6 text-[#8B4513]" />
                    <h3 className="text-xl font-semibold text-slate-900">
                      Hébergement du site
                    </h3>
                  </div>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-slate-500 text-sm">Hébergeur</dt>
                      <dd className="text-slate-900 font-medium">{hosting.name}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 text-sm">Adresse</dt>
                      <dd className="text-slate-700 text-sm">{hosting.address}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 text-sm">Site</dt>
                      <dd>
                        <a 
                          href={hosting.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#8B4513] hover:text-[#CD853F] text-sm"
                        >
                          {hosting.website}
                          <ExternalLink size={14} />
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liens utiles */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Documents légaux
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Consultez nos conditions générales et politiques
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Scale,
                  title: "CGV",
                  description: "Conditions Générales de Vente",
                  href: "/cgv"
                },
                {
                  icon: FileText,
                  title: "Mentions légales",
                  description: "Informations réglementaires",
                  href: "/mentions-legales"
                },
                {
                  icon: CreditCard,
                  title: "Paiement",
                  description: "Moyens de paiement acceptés",
                  href: "/info/paiement"
                },
                {
                  icon: Users,
                  title: "Confidentialité",
                  description: "Politique de protection des données",
                  href: "/info/confidentialite-politique"
                }
              ].map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="bg-white p-6 border border-slate-200 hover:shadow-md transition-shadow group"
                >
                  <link.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-1 text-slate-900 group-hover:text-[#8B4513] transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{link.description}</p>
                  <span className="inline-flex items-center gap-1 text-[#8B4513] text-sm mt-3 font-medium">
                    Consulter
                    <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-24 bg-white text-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
              Une question ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions.
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
