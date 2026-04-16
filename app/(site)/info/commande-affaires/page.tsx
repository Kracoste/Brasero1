import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Briefcase, 
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Utensils,
  TreePine,
  Hotel,
  Store,
  Gift,
  Percent,
  FileText,
  Clock,
  Mail,
  Phone,
  MapPin,
  Truck,
  Paintbrush,
  Shield,
  CreditCard,
  MessageSquare
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Brasero professionnel B2B | Grossiste et entreprises | ${settings.storeName}`,
    description: `Fournisseur braseros pour professionnels : restaurants, hôtels, paysagistes, revendeurs. Tarifs grossiste, volume et personnalisation entreprise. Livraison Europe.`,
    keywords: [
      "brasero grossiste",
      "fournisseur brasero professionnel",
      "brasero restaurant terrasse",
      "brasero hotel extérieur",
      "brasero revendeur",
      "tarif B2B brasero",
      "brasero volume entreprise",
      "brasero paysagiste architecte",
      "brasero collectivité mairie",
      "partenariat brasero professionnel",
      settings.storeName,
    ],
    openGraph: {
      title: `Commande professionnelle | ${settings.storeName}`,
      description: `Solutions brasero pour professionnels. Tarifs B2B, personnalisation et livraison Europe.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/Produits/Brasero-Hexa.webp" }],
    },
    alternates: {
      canonical: "/info/commande-affaires",
    },
  };
}

// Schéma JSON-LD pour le SEO
function generateStructuredData(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Commande professionnelle de braseros",
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
    "description": "Service de commande de braseros pour professionnels : restaurants, hôtels, paysagistes, collectivités. Tarifs B2B, personnalisation et livraison Europe.",
    "areaServed": ["France", "Belgium", "Luxembourg", "Switzerland", "Germany"],
    "serviceType": "Vente B2B de braseros artisanaux"
  };
}

export default async function CommandeAffairesPage() {
  const settings = await getSiteSettings();
  const structuredData = generateStructuredData(settings);

  const targetClients = [
    {
      icon: Utensils,
      title: "Restaurants & Bars",
      description: "Créez une ambiance chaleureuse sur votre terrasse. Nos braseros attirent les clients et prolongent la saison en extérieur."
    },
    {
      icon: Hotel,
      title: "Hôtels & Resorts",
      description: "Offrez une expérience unique à vos clients avec des braseros élégants pour vos espaces extérieurs et jardins."
    },
    {
      icon: TreePine,
      title: "Paysagistes & Architectes",
      description: "Intégrez nos braseros dans vos projets d'aménagement paysager. Nous vous accompagnons sur les dimensions et finitions."
    },
    {
      icon: Building2,
      title: "Collectivités & Campings",
      description: "Équipez vos espaces publics, campings ou villages vacances avec des braseros robustes et sécurisés."
    },
    {
      icon: Store,
      title: "Commerces & Revendeurs",
      description: "Devenez revendeur de nos braseros artisanaux. Conditions spéciales pour les professionnels de la distribution."
    },
    {
      icon: Gift,
      title: "Cadeaux d'entreprise",
      description: "Offrez un cadeau original à vos clients ou collaborateurs. Personnalisation avec votre logo possible."
    }
  ];

  const advantages = [
    {
      icon: Percent,
      title: "Tarifs B2B dégressifs",
      description: "Bénéficiez de remises attractives dès le premier brasero et de tarifs dégressifs selon les quantités commandées."
    },
    {
      icon: Paintbrush,
      title: "Personnalisation sur mesure",
      description: "Logo, dimensions spéciales, finitions particulières : nous adaptons nos braseros à vos besoins et votre image."
    },
    {
      icon: FileText,
      title: "Devis détaillé sous 24h",
      description: "Recevez un devis complet et personnalisé rapidement. Accompagnement dédié pour chaque projet professionnel."
    },
    {
      icon: Truck,
      title: "Livraison France & Europe",
      description: "Livraison sur toute la France et en Europe. Organisation logistique adaptée aux commandes volumineuses."
    },
    {
      icon: CreditCard,
      title: "Facilités de paiement",
      description: "Virement bancaire, paiement à 30 jours pour les clients référencés. Facturation adaptée aux entreprises."
    },
    {
      icon: Shield,
      title: "Garantie professionnelle",
      description: "Tous nos braseros sont garantis 2 ans. SAV dédié aux professionnels pour un suivi optimal."
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Prise de contact",
      description: "Décrivez votre projet et vos besoins. Nombre de braseros, dimensions, personnalisations souhaitées."
    },
    {
      step: 2,
      title: "Devis personnalisé",
      description: "Nous vous envoyons un devis détaillé sous 24h avec les tarifs B2B adaptés à votre commande."
    },
    {
      step: 3,
      title: "Validation & fabrication",
      description: "Après validation du devis, notre atelier lance la fabrication de vos braseros sur mesure."
    },
    {
      step: 4,
      title: "Livraison & suivi",
      description: "Livraison organisée selon vos contraintes. Un interlocuteur dédié vous accompagne jusqu'à la réception."
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
                  <Briefcase className="w-6 h-6 text-[#8B4513]" />
                </div>
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Professionnels
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Braseros pour <span className="text-slate-900">professionnels</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Restaurants, hôtels, paysagistes, collectivités : équipez vos espaces extérieurs 
                avec nos braseros artisanaux manufacturés en France. Tarifs B2B, personnalisation
                sur mesure et accompagnement dédié.
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
                  Nous appeler
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {["Devis sous 24h", "Tarifs B2B", "Fabrication France"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#8B4513] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Clients cibles */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#8B4513]" />
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Nos clients professionnels
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                À qui s'adressent nos braseros ?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Nous accompagnons tous les professionnels dans leurs projets d'aménagement extérieur
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {targetClients.map((client) => (
                <div 
                  key={client.title}
                  className="bg-white p-6 border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <client.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{client.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {client.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avantages B2B */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Les avantages de travailler avec nous
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Un service dédié aux professionnels pour des projets réussis
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage) => (
                <div 
                  key={advantage.title}
                  className="bg-[#f6f1e9] p-6 border border-slate-200"
                >
                  <advantage.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{advantage.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Processus de commande */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                  Comment passer commande ?
                </h2>
                <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                  Un processus simple et un accompagnement personnalisé pour chaque projet 
                  professionnel. De la demande de devis à la livraison, nous sommes à vos côtés.
                </p>
                
                <div className="mt-8 space-y-0">
                  {processSteps.map((item, index) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-10 h-10 bg-[#8B4513] text-white flex items-center justify-center font-bold">
                          {item.step}
                        </div>
                        {index < processSteps.length - 1 && (
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
                  <Briefcase className="w-16 h-16 text-[#8B4513] mx-auto" />
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">
                    Demandez votre devis
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Décrivez votre projet et recevez un devis personnalisé sous 24 heures. 
                    Tarifs B2B, personnalisation et accompagnement inclus.
                  </p>
                  <div className="mt-6 space-y-4">
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-4 transition-all"
                    >
                      <FileText size={18} />
                      Demander un devis
                    </Link>
                    <a
                      href={`mailto:${settings.storeEmail}?subject=Demande de devis professionnel`}
                      className="w-full inline-flex items-center justify-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-medium tracking-wide uppercase px-6 py-4 transition-all"
                    >
                      <Mail size={18} />
                      {settings.storeEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        {/* FAQ */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Questions fréquentes - Professionnels
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: "Quels sont les tarifs B2B ?",
                  answer: "Nos tarifs B2B sont personnalisés selon les quantités et le type de projet. Contactez-nous avec vos besoins pour recevoir un devis détaillé avec les remises applicables."
                },
                {
                  question: "Quel est le délai de fabrication pour une commande professionnelle ?",
                  answer: "Le délai dépend de la quantité et des personnalisations demandées. Comptez généralement 2 à 4 semaines pour une commande standard, plus pour les projets sur mesure. Le délai précis est indiqué dans le devis."
                },
                {
                  question: "Proposez-vous la personnalisation avec logo ?",
                  answer: "Oui, nous proposons la gravure et la découpe laser de logos sur nos braseros. Envoyez-nous votre logo en format vectoriel et nous vous proposerons un visuel avant fabrication."
                },
                {
                  question: "Quelles sont les conditions de paiement pour les professionnels ?",
                  answer: "Nous proposons le virement bancaire et le paiement à 30 jours fin de mois pour les clients référencés. Un acompte de 50% peut être demandé pour les nouvelles collaborations."
                },
                {
                  question: "Livrez-vous sur chantier ou en point de vente ?",
                  answer: "Oui, nous organisons la livraison selon vos contraintes : sur chantier, en point de vente, ou à l'adresse de votre choix. La logistique est adaptée aux commandes volumineuses."
                },
                {
                  question: "Puis-je voir des braseros avant de commander ?",
                  answer: `Oui, vous êtes les bienvenus dans notre atelier à ${settings.atelier.city} sur rendez-vous. Vous pourrez voir notre gamme, discuter de votre projet et découvrir notre savoir-faire.`
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
              Prêt à équiper votre établissement ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Discutons de votre projet et trouvons ensemble la solution adaptée à vos besoins. 
              Devis personnalisé sous 24 heures.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                <MessageSquare size={18} />
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
