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
  Hammer,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  PackageCheck,
  Bell,
  Home
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Livraison brasero | Emballage et transport soigné | ${settings.storeName}`,
    description: `Livraison soignée de votre brasero artisanal. Emballage renforcé sur-mesure, transporteurs spécialisés, suivi en temps réel. Livraison France et Europe en 5-10 jours.`,
    keywords: [
      "livraison brasero soignée",
      "emballage brasero renforcé",
      "transport brasero France",
      "suivi livraison brasero",
      "brasero livré à domicile",
      "expédition brasero sécurisée",
      settings.storeName,
    ],
    openGraph: {
      title: `Livraison soignée | ${settings.storeName}`,
      description: `Emballage renforcé et livraison soignée de votre brasero artisanal.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/livraison",
    },
  };
}

export default async function LivraisonPage() {
  const settings = await getSiteSettings();

  const steps = [
    {
      icon: Package,
      title: "Emballage sur-mesure",
      description: "Chaque brasero est protégé par un système d'emballage développé spécifiquement pour nos produits : carton double cannelure, mousse de calage haute densité et film protecteur."
    },
    {
      icon: PackageCheck,
      title: "Palettisation sécurisée",
      description: "Pour les modèles volumineux, nous utilisons des palettes sur-mesure avec cerclage et film étirable. Le brasero est immobilisé pour éviter tout mouvement pendant le transport."
    },
    {
      icon: Truck,
      title: "Transport spécialisé",
      description: "Nous travaillons exclusivement avec des transporteurs experts en produits volumineux et fragiles. Ils connaissent nos produits et savent les manipuler avec soin."
    },
    {
      icon: Home,
      title: "Livraison à domicile",
      description: "Votre brasero est livré directement chez vous, en bas de chez vous ou devant votre garage. Pour les modèles lourds, la livraison avec hayon élévateur est incluse."
    },
  ];

  const features = [
    {
      icon: Clock,
      value: "5-10 jours",
      title: "Délai de livraison",
      description: "Comptez 5 à 10 jours ouvrés après expédition pour les livraisons en France métropolitaine. Les braseros sur-mesure nécessitent un délai de fabrication supplémentaire."
    },
    {
      icon: Bell,
      value: "Temps réel",
      title: "Suivi de commande",
      description: "Dès l'expédition, vous recevez un email avec le numéro de suivi. Suivez votre brasero en temps réel et soyez averti le jour de la livraison."
    },
    {
      icon: Shield,
      value: "100%",
      title: "Livraison assurée",
      description: "Chaque expédition est assurée à sa valeur totale. En cas de dommage pendant le transport (très rare), nous vous renvoyons un brasero neuf sans frais."
    },
  ];

  const zones = [
    { country: "France métropolitaine", delay: "5-10 jours", price: "Selon le poids" },
    { country: "Belgique", delay: "7-12 jours", price: "Selon le poids" },
    { country: "Luxembourg", delay: "7-12 jours", price: "Selon le poids" },
    { country: "Suisse", delay: "10-15 jours", price: "Sur devis" },
    { country: "Allemagne", delay: "10-15 jours", price: "Selon le poids" },
  ];

  const tips = [
    "Vérifiez l'état de l'emballage avant de signer le bon de livraison",
    "En cas de dommage visible, refusez le colis ou émettez des réserves écrites",
    "Déballez votre brasero dans les 48h et vérifiez son état",
    "Conservez l'emballage pendant la période de rétractation de 14 jours",
    "Contactez-nous immédiatement en cas de problème : nous trouvons toujours une solution",
  ];

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DeliveryChargeSpecification",
            "appliesToDeliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModeFreight",
            "areaServed": {
              "@type": "Country",
              "name": "France"
            },
            "eligibleTransactionVolume": {
              "@type": "PriceSpecification",
              "priceCurrency": "EUR",
              "price": "500"
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
                Étape 3/3
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
              Livraison <span className="text-[#CD853F]">soignée</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              De notre atelier à votre porte, nous prenons soin de votre brasero. Emballage renforcé, 
              transporteurs spécialisés et suivi en temps réel pour une livraison parfaite.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-[#CD853F] hover:bg-[#8B4513] text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Commander un brasero
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/fabrication"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-slate-800 text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Revoir le processus
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation étapes */}
      <section className="bg-[#f6f1e9] py-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 sm:gap-8 text-sm">
            <Link href="/fabrication" className="flex items-center gap-2 text-slate-500 hover:text-[#8B4513] transition-colors">
              <span className="w-6 h-6 bg-slate-300 text-white flex items-center justify-center text-xs">1</span>
              Fabrication
            </Link>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <Link href="/qualite" className="flex items-center gap-2 text-slate-500 hover:text-[#8B4513] transition-colors">
              <span className="w-6 h-6 bg-slate-300 text-white flex items-center justify-center text-xs">2</span>
              Qualité
            </Link>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="flex items-center gap-2 text-[#8B4513] font-semibold">
              <span className="w-6 h-6 bg-[#8B4513] text-white flex items-center justify-center text-xs">3</span>
              Livraison
            </span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            De notre atelier à votre porte
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            La livraison d&apos;un brasero artisanal nécessite un soin particulier. Nos équipes ont développé 
            un système d&apos;emballage et de transport sur-mesure qui garantit l&apos;arrivée de votre brasero 
            en parfait état, où que vous soyez en France ou en Europe.
          </p>
        </div>
      </section>

      {/* Étapes livraison */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Le parcours de votre brasero
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              De l&apos;atelier à votre domicile
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative bg-white p-6 border border-slate-200">
                <div className="absolute -top-4 left-6 w-8 h-8 bg-[#CD853F] flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4 mt-2">
                  <step.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6 sm:p-8 bg-[#f6f1e9] border border-slate-200">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <div className="text-2xl font-bold text-[#CD853F] mb-2">{feature.value}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones de livraison */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Globe className="w-12 h-12 text-[#CD853F] mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Zones de livraison
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Nous livrons en France et dans toute l&apos;Europe
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full">
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
              Pour les autres destinations européennes, contactez-nous pour un devis personnalisé.
            </p>
          </div>
        </div>
      </section>

      {/* Conseils */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Conseils à la réception
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Pour une réception en toute sérénité
            </p>
          </div>

          <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
            <ul className="space-y-4">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-relaxed">{tip}</span>
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
            Découvrez notre collection et commandez votre brasero artisanal dès aujourd&apos;hui.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#CD853F] text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <CheckCircle2 size={18} />
              Découvrir nos braseros
            </Link>
            <Link
              href="/fabrication"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Hammer size={18} />
              Revoir la fabrication
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
