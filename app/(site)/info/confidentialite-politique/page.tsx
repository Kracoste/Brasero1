import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { 
  Shield, 
  Lock, 
  Eye, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  Clock,
  MapPin,
  Database,
  UserCheck,
  Cookie
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Politique de confidentialité | Protection des données | ${settings.storeName}`,
    description: `Politique de confidentialité et protection de vos données personnelles chez ${settings.storeName}. RGPD, cookies, droits d'accès. Transparence totale sur l'utilisation de vos informations.`,
    keywords: [
      "politique confidentialité brasero",
      "protection données personnelles",
      "RGPD brasero",
      "cookies brasero",
      "vie privée",
      "données personnelles",
      settings.storeName,
    ],
    openGraph: {
      title: `Politique de confidentialité | ${settings.storeName}`,
      description: `Protection de vos données personnelles. Politique RGPD, gestion des cookies et vos droits.`,
      type: "website",
      locale: "fr_FR",
      images: [{ url: "https://www.atelier-lbf.fr/Produits/og-brasero.webp" }],
    },
    alternates: {
      canonical: "/info/confidentialite-politique",
    },
  };
}

export default async function ConfidentialitePage() {
  const settings = await getSiteSettings();

  const dataTypes = [
    {
      icon: UserCheck,
      title: "Données d'identification",
      description: "Nom, prénom, adresse email, numéro de téléphone, adresse postale.",
      purpose: "Gestion de votre compte client et traitement de vos commandes de braseros."
    },
    {
      icon: Database,
      title: "Données de commande",
      description: "Historique d'achats, produits commandés, montants, adresses de livraison.",
      purpose: "Suivi de vos commandes, service après-vente et amélioration de nos services."
    },
    {
      icon: Eye,
      title: "Données de navigation",
      description: "Pages visitées, durée de visite, appareil utilisé.",
      purpose: "Amélioration de l'expérience utilisateur et analyse statistique anonyme."
    },
    {
      icon: Cookie,
      title: "Cookies",
      description: "Cookies techniques, analytiques et de préférences.",
      purpose: "Fonctionnement du site, mémorisation de vos préférences et analyse d'audience."
    }
  ];

  const rights = [
    {
      title: "Droit d'accès",
      description: "Vous pouvez demander à consulter toutes les données personnelles que nous détenons sur vous."
    },
    {
      title: "Droit de rectification",
      description: "Vous pouvez demander la correction de vos données si elles sont inexactes ou incomplètes."
    },
    {
      title: "Droit à l'effacement",
      description: "Vous pouvez demander la suppression de vos données personnelles (droit à l'oubli)."
    },
    {
      title: "Droit d'opposition",
      description: "Vous pouvez vous opposer au traitement de vos données à des fins de marketing."
    },
    {
      title: "Droit à la portabilité",
      description: "Vous pouvez récupérer vos données dans un format structuré et lisible."
    },
    {
      title: "Droit de limitation",
      description: "Vous pouvez demander la limitation du traitement de vos données dans certains cas."
    }
  ];

  return (
    <>
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#f6f1e9] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#8B4513]" />
                </div>
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Confidentialité & Protection
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                Politique de <span className="text-slate-900">confidentialité</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                Chez {settings.storeName}, la protection de vos données personnelles est une priorité. 
                Cette page vous explique comment nous collectons, utilisons et protégeons vos informations 
                conformément au Règlement Général sur la Protection des Données (RGPD).
              </p>
              <p className="mt-4 text-sm text-slate-500">
                Dernière mise à jour : Janvier 2026
              </p>
            </div>
          </div>
        </section>

        {/* Responsable du traitement */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-6">
                Responsable du traitement des données
              </h2>
              <div className="bg-white p-6 sm:p-8 border border-slate-200">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Le responsable du traitement de vos données personnelles est :
                </p>
                <div className="space-y-2 text-slate-700">
                  <p><strong>{settings.storeName}</strong></p>
                  <p>{settings.atelier.city}, {settings.atelier.department}</p>
                  <p>Email : {settings.storeEmail}</p>
                  <p>Téléphone : {settings.storePhone}</p>
                </div>
                <p className="mt-6 text-slate-600 text-sm">
                  Pour toute question relative à la protection de vos données, vous pouvez nous contacter 
                  à l'adresse email ci-dessus.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Données collectées */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Quelles données collectons-nous ?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Transparence sur les informations que nous recueillons
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {dataTypes.map((data) => (
                <div 
                  key={data.title}
                  className="bg-[#f6f1e9] p-6 border border-slate-200"
                >
                  <data.icon className="w-10 h-10 text-[#8B4513] mb-4" />
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{data.title}</h3>
                  <p className="text-slate-700 text-sm mb-3">{data.description}</p>
                  <p className="text-slate-500 text-sm">
                    <strong>Finalité :</strong> {data.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Base légale */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-8 text-center">
              Base légale du traitement
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                  Exécution du contrat
                </h3>
                <p className="text-slate-600">
                  Le traitement de vos données est nécessaire pour l'exécution de votre commande de brasero : 
                  livraison, facturation, service après-vente.
                </p>
              </div>

              <div className="bg-white p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                  Consentement
                </h3>
                <p className="text-slate-600">
                  Pour l'envoi de newsletters et communications marketing, nous recueillons votre consentement 
                  explicite. Vous pouvez le retirer à tout moment.
                </p>
              </div>

              <div className="bg-white p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                  Intérêt légitime
                </h3>
                <p className="text-slate-600">
                  L'analyse statistique de la fréquentation du site et l'amélioration de nos services 
                  reposent sur notre intérêt légitime, dans le respect de vos droits.
                </p>
              </div>

              <div className="bg-white p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513]" />
                  Obligation légale
                </h3>
                <p className="text-slate-600">
                  Certaines données sont conservées pour répondre à nos obligations légales 
                  (comptabilité, fiscalité, lutte contre la fraude).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Durée de conservation */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-8 text-center">
              Durée de conservation des données
            </h2>
            
            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-700">Données de compte client</span>
                  <span className="font-semibold text-slate-900">3 ans après dernière activité</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-700">Données de commande</span>
                  <span className="font-semibold text-slate-900">10 ans (obligation légale)</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-700">Cookies analytiques</span>
                  <span className="font-semibold text-slate-900">13 mois maximum</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-700">Données de prospection</span>
                  <span className="font-semibold text-slate-900">3 ans après dernier contact</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vos droits */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900">
                Vos droits sur vos données
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Conformément au RGPD, vous disposez des droits suivants
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rights.map((right) => (
                <div 
                  key={right.title}
                  className="bg-white p-6 border border-slate-200"
                >
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">{right.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {right.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-600 mb-4">
                Pour exercer vos droits, contactez-nous par email à <strong>{settings.storeEmail}</strong>
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-3 transition-all"
              >
                <Mail size={18} />
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-8 text-center">
              Politique des cookies
            </h2>

            <div className="space-y-6">
              <div className="bg-[#f6f1e9] p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-3">
                  <Cookie className="w-5 h-5 text-[#8B4513]" />
                  Cookies strictement nécessaires
                </h3>
                <p className="text-slate-600 mb-2">
                  Ces cookies sont indispensables au fonctionnement du site (panier, session, sécurité). 
                  Ils ne peuvent pas être désactivés.
                </p>
                <p className="text-sm text-slate-500">Durée : Session</p>
              </div>

              <div className="bg-[#f6f1e9] p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-3">
                  <Eye className="w-5 h-5 text-[#8B4513]" />
                  Cookies analytiques
                </h3>
                <p className="text-slate-600 mb-2">
                  Nous utilisons Google Analytics pour comprendre comment les visiteurs utilisent notre site. 
                  Ces données sont anonymisées.
                </p>
                <p className="text-sm text-slate-500">Durée : 13 mois maximum</p>
              </div>

              <div className="bg-[#f6f1e9] p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-[#8B4513]" />
                  Cookies de préférences
                </h3>
                <p className="text-slate-600 mb-2">
                  Ces cookies mémorisent vos préférences (langue, région, choix d'affichage) pour 
                  personnaliser votre expérience.
                </p>
                <p className="text-sm text-slate-500">Durée : 12 mois</p>
              </div>
            </div>

            <p className="mt-8 text-center text-slate-600">
              Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur.
            </p>
          </div>
        </section>

        {/* Sécurité */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 text-[#8B4513] mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                Sécurité de vos données
              </h2>
            </div>

            <div className="bg-white p-6 sm:p-8 border border-slate-200">
              <p className="text-slate-600 leading-relaxed mb-6">
                Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger 
                vos données personnelles contre tout accès non autorisé, perte ou altération :
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Chiffrement SSL/TLS pour toutes les transmissions de données</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Hébergement sécurisé sur des serveurs européens</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Accès aux données limité aux personnes autorisées</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Paiements sécurisés via Stripe (certifié PCI-DSS)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">Mots de passe hashés et jamais stockés en clair</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Transferts de données */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-8 text-center">
              Partage et transfert de données
            </h2>

            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <p className="text-slate-600 leading-relaxed mb-6">
                Vos données personnelles peuvent être partagées avec :
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Transporteurs</strong>
                    <p className="text-slate-600 text-sm">Pour la livraison de votre brasero</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Prestataire de paiement (Stripe)</strong>
                    <p className="text-slate-600 text-sm">Pour le traitement sécurisé de vos paiements</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8B4513] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-slate-900">Hébergeur (Vercel/Supabase)</strong>
                    <p className="text-slate-600 text-sm">Pour l'hébergement sécurisé du site et des données</p>
                  </div>
                </li>
              </ul>
              <p className="mt-6 text-slate-600 text-sm">
                Nous ne vendons jamais vos données personnelles à des tiers. Les transferts hors UE 
                sont encadrés par des clauses contractuelles types approuvées par la Commission européenne.
              </p>
            </div>
          </div>
        </section>

        {/* Réclamation */}
        <section className="py-16 sm:py-24 bg-[#f6f1e9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-4">
              Réclamation auprès de la CNIL
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Si vous estimez que le traitement de vos données personnelles constitue une violation 
              du RGPD, vous avez le droit d'introduire une réclamation auprès de la CNIL.
            </p>
            <a
              href="https://www.cnil.fr/fr/plaintes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#8B4513] hover:text-[#CD853F] font-medium"
            >
              Accéder au site de la CNIL
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-24 bg-white text-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
              Des questions sur vos données ?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions 
              concernant la protection de vos données personnelles.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-8 py-4 transition-all"
              >
                <Mail size={18} />
                Nous contacter
              </Link>
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
