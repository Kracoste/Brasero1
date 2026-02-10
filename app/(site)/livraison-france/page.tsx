import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Truck,
  Package,
  Shield,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Euro,
  Map,
  PackageCheck
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Livraison brasero France | Transport soigné 5-10 jours | ${settings.storeName}`,
    description: `Livraison soignée de braseros partout en France et en Europe. Emballage renforcé, transporteurs spécialisés, suivi en temps réel. Délai 5-10 jours.`,
    keywords: [
      "livraison brasero France",
      "transport brasero",
      "frais port brasero",
      "délai livraison brasero",
      "livraison gratuite brasero",
      "livraison rapide brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Livraison France et Europe | ${settings.storeName}`,
      description: `Livraison soignée en 5-10 jours. Frais calculés selon le poids.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/livraison-france",
    },
  };
}

export default async function LivraisonFrancePage() {
  const settings = await getSiteSettings();

  const advantages = [
    {
      icon: Package,
      title: "Emballage renforcé sur-mesure",
      description: "Chaque brasero est protégé par un emballage développé spécifiquement : carton double cannelure, mousse haute densité et film protecteur."
    },
    {
      icon: Truck,
      title: "Transporteurs spécialisés",
      description: "Nous travaillons avec des professionnels habitués aux produits volumineux et fragiles. Livraison avec hayon si besoin."
    },
    {
      icon: Clock,
      title: "Délai 5-10 jours",
      description: "Livraison en France métropolitaine sous 5 à 10 jours ouvrés après expédition. Suivi en temps réel de votre colis."
    },
  ];

  const zones = [
    { country: "France métropolitaine", delay: "5-10 jours", price: "Selon le poids" },
    { country: "Belgique & Luxembourg", delay: "7-12 jours", price: "Selon le poids" },
    { country: "Allemagne", delay: "10-15 jours", price: "Selon le poids" },
    { country: "Suisse", delay: "10-15 jours", price: "Sur devis" },
    { country: "Autres pays UE", delay: "10-20 jours", price: "Sur devis" },
  ];

  const guarantees = [
    {
      icon: Shield,
      title: "100% assurée",
      description: "Chaque livraison est assurée à sa valeur totale. En cas de dommage, remplacement gratuit."
    },
    {
      icon: PackageCheck,
      title: "Qualité contrôlée",
      description: "Inspection finale avant emballage. Nous ne livrons que des produits parfaits."
    },
    {
      icon: Map,
      title: "Suivi en temps réel",
      description: "Recevez le lien de suivi dès l'expédition et suivez votre brasero jusqu'à chez vous."
    },
  ];

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DeliveryService",
            "name": `Livraison braseros ${settings.storeName}`,
            "provider": {
              "@type": "Organization",
              "name": settings.storeName
            },
            "areaServed": {
              "@type": "Country",
              "name": "France"
            },
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceUrl": "https://www.atelier-lbf.fr"
            }
          })
        }}
      />

      {/* Hero */}
      <section className="bg-[#f6f1e9] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#CD853F]" />
              </div>
              <span className="text-[#CD853F] font-semibold uppercase tracking-wide text-sm">
                Livraison soignée
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
              Livraison <span className="text-[#CD853F]">partout en France</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              Votre brasero livré en 5-10 jours avec un emballage renforcé et des transporteurs spécialisés. 
              Frais de port calculés selon le poids et la destination.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/produits?category=brasero"
                className="inline-flex items-center gap-2 bg-[#CD853F] hover:bg-[#8B4513] text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Commander
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/info/expedition"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-slate-800 text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Infos détaillées
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Une livraison professionnelle
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Nous prenons soin de votre brasero de A à Z
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((advantage) => (
              <div key={advantage.title} className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4">
                  <advantage.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{advantage.title}</h3>
                <p className="text-slate-600 leading-relaxed">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frais de port */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Euro className="w-12 h-12 text-[#CD853F] mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Frais de livraison
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Tarifs transparents selon votre localisation. Frais réglés lors du paiement de la commande.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-slate-200 shadow-sm overflow-x-auto">
              <table className="w-full min-w-[400px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#8B4513]">Destination</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#8B4513]">Délai</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#8B4513]">Frais de port</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone, index) => (
                    <tr key={zone.country} className={index < zones.length - 1 ? "border-b border-slate-200" : ""}>
                      <td className="px-6 py-4 text-slate-900">{zone.country}</td>
                      <td className="px-6 py-4 text-center text-slate-600">{zone.delay}</td>
                      <td className="px-6 py-4 text-right text-slate-600">{zone.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-slate-500 text-center">
              Les frais de port sont calculés automatiquement et réglés lors du paiement de votre commande.
            </p>
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Nos garanties livraison
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Pour une réception en toute sérénité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {guarantees.map((guarantee) => (
              <div key={guarantee.title} className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4">
                  <guarantee.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{guarantee.title}</h3>
                <p className="text-slate-600 leading-relaxed">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus livraison */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Comment se passe la livraison ?
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { step: "1", title: "Préparation", desc: "Votre commande est préparée et emballée avec soin dans notre atelier" },
              { step: "2", title: "Expédition", desc: "Vous recevez un email avec le numéro de suivi du transporteur" },
              { step: "3", title: "Suivi", desc: "Suivez votre brasero en temps réel jusqu'à la livraison" },
              { step: "4", title: "Livraison", desc: "Le transporteur vous livre à l'adresse indiquée (RDV téléphonique)" },
              { step: "5", title: "Réception", desc: "Vérifiez l'état du colis avant de signer le bon de livraison" },
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 border border-slate-200 flex gap-4 items-start">
                <div className="w-10 h-10 bg-[#CD853F] text-white flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conseils */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Conseils à la réception
            </h2>
          </div>

          <div className="bg-[#f6f1e9] p-8 border border-slate-200">
            <ul className="space-y-4">
              {[
                "Vérifiez l'état de l'emballage avant de signer",
                "En cas de dommage visible, émettez des réserves écrites sur le bon",
                "Déballez et inspectez votre brasero dans les 48h",
                "Conservez l'emballage pendant la période de rétractation (14 jours)",
                "Contactez-nous immédiatement en cas de problème",
                "Prenez des photos en cas de dommage pour accélérer le traitement",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            Prêt à recevoir votre brasero ?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Commandez dès maintenant et recevez votre brasero sous 5-10 jours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/produits?category=brasero"
              className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#CD853F] text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Truck size={18} />
              Commander maintenant
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              Questions ? Contactez-nous
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
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
              <MapPin className="w-4 h-4 text-[#8B4513]" />
              <span>{settings.atelier.city}, {settings.atelier.department}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
