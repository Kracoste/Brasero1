import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbSchema } from "@/lib/seo/schemas";
import {
  RotateCcw,
  Clock,
  Package,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Shield,
  AlertTriangle,
  FileText,
  HelpCircle,
  Truck
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: `Politique de retour et remboursement | 14 jours satisfait ou remboursé | ${settings.storeName}`,
    description: `Retournez votre brasero sous 14 jours si vous changez d'avis. Remboursement intégral garanti. Procédure de retour simple et rapide chez ${settings.storeName}.`,
    keywords: [
      "retour brasero",
      "remboursement brasero",
      "satisfait ou remboursé brasero",
      "politique retour brasero",
      "droit de rétractation brasero",
      "échange brasero",
      "retourner brasero",
      "garantie satisfaction brasero",
      settings.storeName,
    ],
    openGraph: {
      title: `Satisfait ou remboursé | ${settings.storeName}`,
      description: `14 jours pour changer d'avis. Retour simplifié et remboursement intégral garanti sur tous nos braseros artisanaux.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/retours",
    },
  };
}

function generateStructuredData(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "MerchantReturnPolicy",
      "name": `Politique de retour - ${settings.storeName}`,
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 14,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/ReturnFeesCustomerResponsibility",
      "applicableCountry": "FR",
      "returnPolicyCountry": "FR"
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Quel est le délai de retour pour un brasero ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Vous disposez de 14 jours calendaires à compter de la réception de votre brasero pour exercer votre droit de rétractation. Ce délai est conforme à la législation française sur la vente à distance."
          }
        },
        {
          "@type": "Question",
          "name": "Comment retourner un brasero ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Contactez notre service client par email ou téléphone pour initier votre retour. Nous vous fournirons les instructions d'emballage et l'adresse de retour. Le brasero doit être retourné dans son emballage d'origine."
          }
        },
        {
          "@type": "Question",
          "name": "Qui paie les frais de retour d'un brasero ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Les frais de retour sont à la charge du client. Nous recommandons d'utiliser un transporteur adapté aux colis volumineux (DHL, DB Schenker) pour garantir un retour en toute sécurité."
          }
        },
        {
          "@type": "Question",
          "name": "Sous quel délai suis-je remboursé ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le remboursement est effectué sous 14 jours maximum après réception et vérification du produit retourné. Le remboursement est intégral (prix du produit + frais de livraison initiaux)."
          }
        },
        {
          "@type": "Question",
          "name": "Dans quel état doit être le brasero pour être retourné ?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le brasero doit être retourné dans son état d'origine, non utilisé, dans son emballage d'origine. Un brasero ayant été allumé ou présentant des traces d'utilisation ne pourra pas être remboursé."
          }
        }
      ]
    }
  ];
}

export default async function RetoursPage() {
  const settings = await getSiteSettings();
  const schemas = generateStructuredData(settings);

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Retours & remboursement", url: "/retours" },
  ]);

  const steps = [
    {
      number: "1",
      icon: Mail,
      title: "Contactez-nous",
      description: "Envoyez-nous un email ou appelez-nous pour signaler votre souhait de retour. Indiquez votre numéro de commande et le motif du retour."
    },
    {
      number: "2",
      icon: Package,
      title: "Emballez le produit",
      description: "Replacez le brasero dans son emballage d'origine. Assurez-vous qu'il est correctement protégé pour le transport. Le produit doit être en état neuf, non utilisé."
    },
    {
      number: "3",
      icon: Truck,
      title: "Expédiez votre retour",
      description: "Envoyez le colis à l'adresse que nous vous communiquerons. Les frais de retour sont à votre charge. Nous recommandons un transporteur adapté aux colis volumineux."
    },
    {
      number: "4",
      icon: CheckCircle2,
      title: "Remboursement",
      description: "Dès réception et vérification de votre retour, nous procédons au remboursement intégral sous 14 jours maximum sur votre moyen de paiement d'origine."
    }
  ];

  const conditions = [
    {
      icon: Clock,
      title: "Délai de 14 jours",
      description: "À compter de la date de réception de votre commande pour exercer votre droit de rétractation."
    },
    {
      icon: Package,
      title: "État d'origine",
      description: "Le produit doit être retourné dans son emballage d'origine, en parfait état, non utilisé et non allumé."
    },
    {
      icon: FileText,
      title: "Notification obligatoire",
      description: "Vous devez nous informer de votre décision de retour avant l'expédition du colis, par email ou téléphone."
    },
    {
      icon: AlertTriangle,
      title: "Frais de retour",
      description: "Les frais de retour sont à la charge du client. Nous recommandons un transporteur adapté aux produits volumineux."
    }
  ];

  const faqs = [
    {
      question: "Quel est le délai de retour pour un brasero ?",
      answer: "Vous disposez de 14 jours calendaires à compter de la réception de votre brasero pour exercer votre droit de rétractation. Ce délai est conforme à la législation française sur la vente à distance."
    },
    {
      question: "Comment retourner un brasero ?",
      answer: `Contactez notre service client par email à ${settings.storeEmail} ou par téléphone au ${settings.storePhone} pour initier votre retour. Nous vous fournirons les instructions d'emballage et l'adresse de retour. Le brasero doit être retourné dans son emballage d'origine.`
    },
    {
      question: "Qui paie les frais de retour ?",
      answer: "Les frais de retour sont à la charge du client. Étant donné le poids et le volume des braseros, nous recommandons d'utiliser un transporteur spécialisé (DHL, DB Schenker) pour garantir un retour en toute sécurité."
    },
    {
      question: "Sous quel délai suis-je remboursé ?",
      answer: "Le remboursement est effectué sous 14 jours maximum après réception et vérification du produit retourné. Le remboursement est intégral : prix du produit et frais de livraison initiaux. Il est effectué sur votre moyen de paiement d'origine (carte bancaire ou virement)."
    },
    {
      question: "Puis-je retourner un brasero déjà utilisé ?",
      answer: "Non, un brasero ayant été allumé ou présentant des traces d'utilisation ne peut pas faire l'objet d'un retour. Le produit doit être en état neuf, dans son emballage d'origine."
    },
    {
      question: "Mon brasero est arrivé endommagé, que faire ?",
      answer: `Si votre brasero est arrivé endommagé, contactez-nous immédiatement à ${settings.storeEmail}. Dans ce cas, les frais de retour sont à notre charge et nous vous envoyons un brasero neuf en remplacement ou procédons au remboursement intégral.`
    },
    {
      question: "Puis-je échanger mon brasero contre un autre modèle ?",
      answer: "Oui, vous pouvez échanger votre brasero contre un autre modèle dans le délai de 14 jours. Contactez-nous pour organiser l'échange. Si le nouveau modèle est plus cher, vous paierez la différence. S'il est moins cher, nous vous remboursons la différence."
    }
  ];

  return (
    <main className="bg-white">
      <JsonLd data={breadcrumb} />
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero */}
      <section className="bg-[#f6f1e9] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-[#CD853F]" />
              </div>
              <span className="text-[#CD853F] font-semibold uppercase tracking-wide text-sm">
                Garantie satisfaction
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
              Satisfait ou <span className="text-[#CD853F]">remboursé</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              14 jours pour changer d&apos;avis. Si votre brasero ne vous convient pas,
              nous vous remboursons intégralement. Simple, rapide et transparent.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-[#CD853F] hover:bg-[#8B4513] text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Voir nos braseros
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/info/faq"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-slate-800 text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Toutes les FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Résumé en chiffres */}
      <section className="py-12 sm:py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-[#CD853F]">14</div>
              <p className="text-slate-600 mt-1">jours pour retourner</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-[#CD853F]">100%</div>
              <p className="text-slate-600 mt-1">remboursement intégral</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-[#CD853F]">14j</div>
              <p className="text-slate-600 mt-1">délai de remboursement</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-[#CD853F]">0€</div>
              <p className="text-slate-600 mt-1">frais cachés</p>
            </div>
          </div>
        </div>
      </section>

      {/* Étapes de retour */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Comment retourner votre brasero ?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Une procédure simple en 4 étapes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative bg-[#f6f1e9] p-6 border border-slate-200">
                <div className="absolute -top-4 left-6 w-8 h-8 bg-[#CD853F] flex items-center justify-center text-white font-bold text-sm">
                  {step.number}
                </div>
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4 mt-2">
                  <step.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-6 h-0.5 bg-[#CD853F]/40 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Conditions de retour
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Pour que votre retour soit accepté
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {conditions.map((condition) => (
              <div key={condition.title} className="bg-white p-6 border border-slate-200">
                <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4">
                  <condition.icon className="w-7 h-7 text-[#CD853F]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{condition.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{condition.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garantie produit vs Retour */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Retour vs Garantie
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Deux protections différentes pour votre tranquillité
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <RotateCcw className="w-8 h-8 text-[#CD853F]" />
                <h3 className="text-xl font-semibold text-slate-900">Droit de retour (14 jours)</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Changement d&apos;avis, sans justification</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Produit en état neuf, non utilisé</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Frais de retour à la charge du client</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Remboursement intégral sous 14 jours</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-[#CD853F]" />
                <h3 className="text-xl font-semibold text-slate-900">Garantie produit (2 ans)</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Défaut de fabrication ou vice caché</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Réparation ou remplacement gratuit</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Frais de retour pris en charge</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#CD853F] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Valable 2 ans après l&apos;achat</span>
                </li>
              </ul>
              <Link
                href="/garantie"
                className="inline-flex items-center gap-2 text-[#8B4513] font-medium mt-4 hover:gap-3 transition-all"
              >
                En savoir plus sur la garantie <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <HelpCircle className="w-12 h-12 text-[#CD853F] mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Questions fréquentes sur les retours
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white border border-slate-200 group"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-slate-900 hover:text-[#8B4513] transition-colors">
                  {faq.question}
                  <span className="text-[#CD853F] group-open:rotate-180 transition-transform">
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

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            Commandez en toute confiance
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            14 jours pour changer d&apos;avis, garantie 2 ans, paiement sécurisé et livraison soignée.
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
              href="/garantie"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Shield size={18} />
              Notre garantie 2 ans
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
