import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo/schemas";
import { getAllProducts } from "@/lib/data/products";
import {
  Flame,
  ChefHat,
  Users,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Sun,
  Utensils,
  ShieldCheck,
  Ruler,
  Thermometer,
  Wind,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: `Brasero multifonction 3 en 1 | Barbecue & plancha | ${settings.storeName}`,
    description: `Brasero multifonction 3 en 1 : barbecue, plancha et chauffage extérieur. Acier corten ou peint, manufacturé en France. Dès 800€. Garantie 2 ans.`,
    keywords: [
      "brasero multifonction",
      "brasero barbecue plancha",
      "brasero 3 en 1",
      "brasero chauffage extérieur",
      "brasero coin feu jardin",
      "brasero polyvalent",
      "brasero plancha feu de bois",
      "brasero cuisson extérieur",
      settings.storeName,
    ],
    openGraph: {
      title: `Brasero multifonction 3 en 1 | ${settings.storeName}`,
      description: `Barbecue, plancha et chauffage : un seul brasero pour toutes vos envies. Manufacturé en France.`,
      type: "website",
      locale: "fr_FR",
      images: [{
        url: "https://www.atelier-lbf.fr/acceuil/acceuil1.webp",
        width: 1200,
        height: 630,
        alt: "Atelier LBF — Braseros artisanaux Made in France",
      }],
    },
    alternates: {
      canonical: "/brasero-multifonction",
    },
  };
}

export default async function BraseroMultifonctionPage() {
  const [settings, allProducts] = await Promise.all([
    getSiteSettings(),
    getAllProducts(),
  ]);

  // Calculer les prix dynamiquement depuis les vrais braseros
  const braseros = allProducts.filter((p) => p.category === "brasero");
  const allPrices: number[] = [];
  for (const product of braseros) {
    if (product.price) allPrices.push(product.price);
    if (product.variants) {
      product.variants.forEach((v) => { if (v.price) allPrices.push(v.price); });
    }
    if (product.configurations) {
      Object.values(product.configurations).forEach((config) => {
        if (config.diameters) {
          Object.values(config.diameters).forEach((d) => { if (d.price) allPrices.push(d.price); });
        }
      });
    }
  }
  const lowPrice = allPrices.length > 0 ? Math.min(...allPrices) : 800;
  const highPrice = allPrices.length > 0 ? Math.max(...allPrices) : 3200;
  const offerCount = allPrices.length || 1;

  const functions = [
    {
      icon: Flame,
      title: "Chauffage d'ambiance",
      description: "Profitez de la chaleur du feu de bois pour prolonger vos soirées d'été et réchauffer votre terrasse en automne et hiver."
    },
    {
      icon: ChefHat,
      title: "Barbecue traditionnel",
      description: "Grillez viandes, poissons et légumes avec la grille de cuisson. La chaleur du feu de bois apporte une saveur incomparable."
    },
    {
      icon: Utensils,
      title: "Plancha gourmande",
      description: "Ajoutez une plancha amovible pour saisir vos aliments à haute température. Idéal pour les cuissons rapides et saines."
    },
  ];

  const usages = [
    {
      icon: Users,
      title: "Soirées conviviales",
      description: "Le brasero devient le point central de vos réunions entre amis et famille. Cuisinez, réchauffez-vous et admirez les flammes."
    },
    {
      icon: Sun,
      title: "Toutes saisons",
      description: "Utilisez votre brasero toute l'année : barbecue l'été, chauffage d'appoint l'hiver, ambiance chaleureuse au printemps et automne."
    },
    {
      icon: Sparkles,
      title: "Décoration jardin",
      description: "Au-delà de son aspect fonctionnel, le brasero est un élément décoratif qui sublime votre espace extérieur."
    },
  ];

  const faqItems = [
    {
      question: "Qu'est-ce qu'un brasero multifonction ?",
      answer: "Un brasero multifonction est un appareil d'extérieur qui cumule trois fonctions en un seul objet : le chauffage d'ambiance par le feu de bois, la cuisson sur grille (barbecue) et la cuisson sur plancha. Il remplace à lui seul un barbecue, une plancha à gaz et un chauffage de terrasse."
    },
    {
      question: "Quelle différence entre un brasero multifonction et un barbecue classique ?",
      answer: "Le barbecue ne fait que griller. Le brasero multifonction chauffe votre espace extérieur par rayonnement, cuisine sur plancha (surface lisse, pas de flammes directes) ET grille sur grille comme un barbecue. En plus, il continue à vivre après le repas : on ajoute une bûche et la soirée se prolonge autour du feu."
    },
    {
      question: "Peut-on cuisiner pour combien de personnes sur un brasero multifonction ?",
      answer: "Cela dépend du diamètre : 2-4 personnes sur un 50 cm, 6-8 personnes sur un 80 cm, 10-12 personnes sur un 100 cm. La plancha offre une surface de cuisson continue où rien ne tombe, contrairement à une grille de barbecue."
    },
    {
      question: "Quel bois utiliser dans un brasero multifonction ?",
      answer: "Utilisez du bois de feuillus sec (chêne, hêtre, charme) avec un taux d'humidité inférieur à 20%. Évitez les résineux (pin, sapin) qui projettent des étincelles. Les bûches compressées sont aussi une excellente option, compactes et à haut pouvoir calorifique."
    },
    {
      question: "Un brasero multifonction peut-il rester dehors toute l'année ?",
      answer: "Oui. Nos braseros en acier corten sont conçus pour vivre dehors sans aucun entretien — la patine rouille les protège. Les modèles en acier peint peuvent aussi rester dehors, mais une housse de protection est recommandée pour préserver la finition."
    },
    {
      question: "Combien coûte un brasero multifonction Atelier LBF ?",
      answer: "Nos braseros multifonctions commencent à partir de 800€ HT pour le format 50 cm et vont jusqu'à 3 200€ HT pour les grands formats 100 cm en acier corten. Le prix inclut la grille de cuisson. La plancha est disponible en option ou incluse selon le modèle."
    },
  ];

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Brasero multifonction", url: "/brasero-multifonction" },
  ]);

  const faqSchema = generateFAQSchema(faqItems);

  return (
    <main className="bg-white">
      <JsonLd data={breadcrumb} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Brasero multifonction 3 en 1",
        description: "Brasero artisanal multifonction : barbecue, plancha et chauffage d'extérieur. Manufacturé en France.",
        image: braseros[0]?.images?.[0]?.src || "https://www.atelier-lbf.fr/Braserobanner.jpg",
        brand: { "@type": "Brand", name: settings.storeName },
        offers: {
          "@type": "AggregateOffer",
          lowPrice,
          highPrice,
          priceCurrency: "EUR",
          offerCount,
          availability: "https://schema.org/InStock",
        },
      }} />

      {/* Hero */}
      <section className="bg-[#f1f5f9] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#475569]/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#475569]" />
              </div>
              <span className="text-[#475569] font-semibold uppercase tracking-wide text-sm">
                Espace barbecue unique
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
              Brasero <span className="text-[#475569]">multifonction</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              Un seul équipement pour trois usages : barbecue, plancha et chauffage d&apos;extérieur.
              Créez un coin chaleureux dans votre jardin et profitez-en toute l&apos;année.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/produits?category=brasero"
                className="inline-flex items-center gap-2 bg-[#475569] hover:bg-[#0f172a] text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Voir nos braseros
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-slate-800 text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Demander un devis
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 fonctions */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              3 usages en 1 seul brasero
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Polyvalence et performance pour votre extérieur
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {functions.map((func, index) => (
              <div key={func.title} className="bg-[#f1f5f9] p-6 sm:p-8 border border-slate-200">
                <div className="w-14 h-14 bg-[#475569]/20 flex items-center justify-center mb-4">
                  <func.icon className="w-7 h-7 text-[#475569]" />
                </div>
                <div className="text-2xl font-bold text-[#475569] mb-2">{index + 1}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{func.title}</h3>
                <p className="text-slate-600 leading-relaxed">{func.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contenu SEO détaillé — barbecue */}
      <section className="py-16 sm:py-24 bg-[#f1f5f9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-8 text-center">
            Barbecue, plancha ou chauffage : comment ça marche ?
          </h2>

          <div className="space-y-10">
            {/* Barbecue */}
            <div className="bg-white p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <ChefHat className="w-6 h-6 text-[#475569]" />
                <h3 className="text-2xl font-display font-semibold text-slate-900">Mode barbecue : la grille au feu de bois</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Retirez la plancha et posez la grille de cuisson directement au-dessus du foyer. Les braises de bois dur (chêne, hêtre, charme) produisent une chaleur intense et régulière qui saisit viandes, poissons et légumes avec ce goût fumé unique que seul le feu de bois peut offrir.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Contrairement au charbon de barbecue classique, les braises de feuillus brûlent plus proprement et plus longtemps. La grille est amovible : vous passez du barbecue à la plancha en 10 secondes, sans outil.
              </p>
            </div>

            {/* Plancha */}
            <div className="bg-white p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Utensils className="w-6 h-6 text-[#475569]" />
                <h3 className="text-2xl font-display font-semibold text-slate-900">Mode plancha : la cuisson des chefs</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                La plancha offre une surface de cuisson continue en acier — <Link href="/blog/plancha-inox-ou-acier-carbone" className="text-[#0f172a] hover:underline font-medium">inox (10 mm) ou acier carbone (8 mm)</Link> selon votre préférence. Rien ne tombe, rien ne brûle directement. Les graisses ne tombent pas dans le feu, ce qui rend la cuisson plus saine et sans flammes parasites.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Sur la plancha, vous pouvez cuisiner tout ce qu&apos;un barbecue ne peut pas : crevettes, œufs, légumes émincés, fromage grillé, fruits caramélisés. La réaction de Maillard (cette croûte dorée) se déclenche rapidement grâce à la chaleur intense du feu de bois transmise par l&apos;acier.
              </p>
            </div>

            {/* Chauffage */}
            <div className="bg-white p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Flame className="w-6 h-6 text-[#475569]" />
                <h3 className="text-2xl font-display font-semibold text-slate-900">Mode chauffage : la flamme vivante</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Retirez plancha et grille : votre brasero devient un foyer ouvert. La flamme danse, les braises rougeoient, et la chaleur rayonne dans un rayon de 3 à 5 mètres autour du foyer. Vos invités restent dehors bien après le repas, un verre à la main, face au feu.
              </p>
              <p className="text-slate-600 leading-relaxed">
                En automne et en hiver, le brasero transforme votre terrasse en espace de vie extérieur chauffé. Là où un chauffage de terrasse électrique ou à gaz diffuse une chaleur artificielle, le brasero offre un rayonnement naturel et une ambiance que rien ne peut remplacer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparatif vs appareils séparés */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4 text-center">
            Brasero multifonction vs équipements séparés
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Un brasero plancha remplace trois appareils distincts. Voici le comparatif.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border border-slate-200">
              <thead>
                <tr className="bg-[#f1f5f9]">
                  <th className="p-4 font-semibold text-slate-900 border-b border-slate-200">Critère</th>
                  <th className="p-4 font-semibold text-[#0f172a] border-b border-slate-200">Brasero multifonction</th>
                  <th className="p-4 font-semibold text-slate-500 border-b border-slate-200">BBQ + plancha + parasol chauffant</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-600">
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-medium text-slate-900">Prix total</td>
                  <td className="p-4">800 — 3 200 €</td>
                  <td className="p-4">700 — 1 900 € (3 appareils)</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">Encombrement</td>
                  <td className="p-4">1 appareil, socle 55×55 cm</td>
                  <td className="p-4">3 appareils, 3 emplacements</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-medium text-slate-900">Durée de vie</td>
                  <td className="p-4 font-medium text-[#0f172a]">20+ ans (acier 3 mm)</td>
                  <td className="p-4">2-5 ans par appareil</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">Combustible</td>
                  <td className="p-4">Bois (gratuit ou pas cher)</td>
                  <td className="p-4">Charbon + gaz + électricité</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-medium text-slate-900">Ambiance</td>
                  <td className="p-4 font-medium text-[#0f172a]">Flamme vivante, convivialité</td>
                  <td className="p-4">Aucune ambiance particulière</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">Cuisson</td>
                  <td className="p-4">Grille + plancha au feu de bois</td>
                  <td className="p-4">Grille charbon + plancha gaz</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Entretien</td>
                  <td className="p-4">Spatule + chiffon (2 min)</td>
                  <td className="p-4">3 nettoyages distincts</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-slate-600 text-center text-sm">
            Sur 20 ans, un brasero multifonction à 1 200 € coûte 60 €/an — contre 75 €/an pour des appareils jetables remplacés tous les 3 ans.
          </p>
        </div>
      </section>

      {/* Tailles */}
      <section className="py-16 sm:py-24 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4 text-center">
            Quel diamètre pour votre tablée ?
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Nos braseros multifonctions sont disponibles en 3 diamètres. <Link href="/blog/quel-brasero-choisir-nombre-convives" className="text-[#0f172a] hover:underline font-medium">Voir le guide complet</Link>.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-8 border border-slate-200 text-center">
              <Ruler className="w-8 h-8 text-[#475569] mx-auto mb-3" />
              <div className="text-3xl font-bold text-slate-900 mb-1">50 cm</div>
              <div className="text-[#475569] font-semibold mb-4">2 à 4 convives</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Le format compact. Idéal pour les repas en duo ou les apéritifs plancha à quatre. Montée en température rapide, faible consommation de bois. À partir de 67 kg.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 border-2 border-[#475569] text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#475569] text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">Le plus populaire</div>
              <Ruler className="w-8 h-8 text-[#475569] mx-auto mb-3" />
              <div className="text-3xl font-bold text-slate-900 mb-1">80 cm</div>
              <div className="text-[#475569] font-semibold mb-4">6 à 8 convives</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Le format convivial. Assez grand pour cuisiner viandes et légumes en simultané, sans cuire en plusieurs fois. L&apos;équilibre parfait taille/performance.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 border border-slate-200 text-center">
              <Ruler className="w-8 h-8 text-[#475569] mx-auto mb-3" />
              <div className="text-3xl font-bold text-slate-900 mb-1">100 cm</div>
              <div className="text-[#475569] font-semibold mb-4">10 à 12 convives</div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Le grand format. Surface immense pour les grandes tablées et les événements. Zones de chaleur distinctes pour cuire plusieurs plats en parallèle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Matériaux */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-8 text-center">
            Acier corten ou acier peint ?
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#f1f5f9] p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Wind className="w-5 h-5 text-[#475569]" />
                <h3 className="text-xl font-semibold text-slate-900">Acier corten</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                L&apos;acier corten développe naturellement une patine rouille protectrice. <Link href="/blog/brasero-corten-avantages-inconvenients" className="text-[#0f172a] hover:underline font-medium">Zéro entretien</Link>, résistance totale aux intempéries, esthétique vivante qui évolue avec le temps.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#475569] flex-shrink-0 mt-0.5" /> Aucun entretien nécessaire</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#475569] flex-shrink-0 mt-0.5" /> Patine unique à chaque brasero</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#475569] flex-shrink-0 mt-0.5" /> Durée de vie 50+ ans</li>
              </ul>
            </div>
            <div className="bg-[#f1f5f9] p-6 sm:p-8 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-[#475569]" />
                <h3 className="text-xl font-semibold text-slate-900">Acier peint noir</h3>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Finition thermolaquée haute température. Aspect noir mat élégant et constant, protection durable contre la corrosion. Housse recommandée pour un entretien optimal.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#475569] flex-shrink-0 mt-0.5" /> Aspect noir mat uniforme</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#475569] flex-shrink-0 mt-0.5" /> Pas de coulures de rouille</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#475569] flex-shrink-0 mt-0.5" /> Prix légèrement inférieur</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Usages */}
      <section className="py-16 sm:py-24 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Pour toutes vos occasions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Un brasero qui s&apos;adapte à vos besoins, toute l&apos;année
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {usages.map((usage) => (
              <div key={usage.title} className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
                <div className="w-14 h-14 bg-[#475569]/20 flex items-center justify-center mx-auto mb-4">
                  <usage.icon className="w-7 h-7 text-[#475569]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{usage.title}</h3>
                <p className="text-slate-600 leading-relaxed">{usage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Pourquoi choisir un brasero multifonction ?
            </h2>
          </div>

          <div className="bg-[#f1f5f9] p-8 border border-slate-200">
            <ul className="space-y-4">
              {[
                "Un seul achat pour trois équipements : économique et pratique",
                "Gain de place sur votre terrasse ou dans votre jardin",
                "Utilisable toute l'année selon vos envies",
                "Grille et plancha incluses ou en option selon les modèles",
                "Acier corten ou acier peint haute température",
                "Fabrication artisanale française à Moncoutant",
                "Range-bûches intégré : le bois est toujours à portée de main",
                "Hauteur de travail ergonomique (93 cm) pour cuisiner debout",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#475569] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Articles liés */}
      <section className="py-16 sm:py-24 bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-8 text-center">
            Guides pour bien choisir et utiliser votre brasero
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link href="/blog/brasero-plancha-vs-barbecue" className="block bg-white p-5 border border-slate-200 hover:shadow-md hover:border-[#475569] transition-all group">
              <span className="text-xs text-[#0f172a] font-medium">Guide</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-[#0f172a] transition-colors text-sm">Brasero plancha vs barbecue : le comparatif</h3>
            </Link>
            <Link href="/blog/quel-brasero-choisir-nombre-convives" className="block bg-white p-5 border border-slate-200 hover:shadow-md hover:border-[#475569] transition-all group">
              <span className="text-xs text-[#0f172a] font-medium">Guide</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-[#0f172a] transition-colors text-sm">Quel brasero choisir selon vos convives</h3>
            </Link>
            <Link href="/blog/temperature-cuisson-brasero-plancha" className="block bg-white p-5 border border-slate-200 hover:shadow-md hover:border-[#475569] transition-all group">
              <span className="text-xs text-[#0f172a] font-medium">Cuisson</span>
              <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-[#0f172a] transition-colors text-sm">Maîtriser la température de cuisson</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-10 text-center">
            Questions fréquentes sur le brasero multifonction
          </h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <details key={index} className="bg-[#f1f5f9] border border-slate-200 group">
                <summary className="p-5 sm:p-6 cursor-pointer font-semibold text-slate-900 hover:text-[#0f172a] transition-colors list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-[#475569] text-xl ml-4 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-[#f1f5f9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            Prêt à créer votre espace barbecue ?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Découvrez nos modèles de braseros multifonctions et trouvez celui qui correspond à vos besoins.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/produits?category=brasero"
              className="inline-flex items-center gap-2 bg-[#0f172a] hover:bg-[#475569] text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Flame size={18} />
              Voir les braseros
            </Link>
            <Link
              href="/accessoires"
              className="inline-flex items-center gap-2 border-2 border-[#0f172a] text-[#0f172a] hover:bg-[#0f172a] hover:text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              Accessoires compatibles
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
              <MapPin className="w-4 h-4 text-[#0f172a]" />
              <span>{settings.atelier.city}, {settings.atelier.department}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
