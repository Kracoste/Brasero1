import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo/schemas";
import { createClient } from "@/lib/supabase/server";
import {
  Award,
  Factory,
  MapPin,
  Users,
  Heart,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  Sparkles,
  TreePine,
  Flag,
  ShieldCheck,
  Ruler,
  Recycle,
  Wrench,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: `Brasero Made in France | Fabrication artisanale Deux-Sèvres | ${settings.storeName}`,
    description: `Braseros 100% manufacturés en France à Moncoutant (79). Acier 3 mm, soudure artisanale, garantie 2 ans. Pourquoi la manufacture française change tout.`,
    keywords: [
      "brasero made in France",
      "brasero manufacturé en France",
      "brasero artisan français",
      "brasero production française",
      "brasero artisanal Deux-Sèvres",
      "fabricant brasero France",
      "brasero qualité française",
      settings.storeName,
    ],
    openGraph: {
      title: `Brasero Made in France — Fabrication artisanale | ${settings.storeName}`,
      description: `Chaque brasero est fabriqué à la main dans notre atelier des Deux-Sèvres. Acier 3 mm, soudure artisanale, garanti 2 ans.`,
      type: "website",
      locale: "fr_FR",
      images: [{
        url: "https://www.atelier-lbf.fr/Produits/Brasero-Hexa.webp",
        width: 1200,
        height: 630,
        alt: "Atelier LBF — Braseros artisanaux Made in France",
      }],
    },
    alternates: {
      canonical: "/made-in-france",
    },
  };
}

export default async function MadeInFrancePage() {
  const supabase = await createClient();
  const settings = await getSiteSettings();

  // SEO-23 : Récupération dynamique des derniers articles de blog
  const { data: latestBlogPosts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, featured_image')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  const faqItems = [
    {
      question: "Où sont fabriqués les braseros Atelier LBF ?",
      answer: "Tous nos braseros sont fabriqués à Moncoutant, dans les Deux-Sèvres (79), en Nouvelle-Aquitaine. L'intégralité du processus — découpe laser, formage, soudure, finition — est réalisée dans notre atelier par nos artisans ferronniers."
    },
    {
      question: "Quelle est l'origine de l'acier utilisé ?",
      answer: "Nous utilisons exclusivement de l'acier européen (France, Allemagne, Belgique). L'acier corten est un alliage spécifique contenant cuivre, chrome et nickel, sélectionné pour sa résistance aux intempéries. L'épaisseur de nos socles est de 3 mm, et nos planchas de 8 à 10 mm."
    },
    {
      question: "Pourquoi un brasero artisanal coûte-t-il plus cher qu'un brasero importé ?",
      answer: "Un brasero importé utilise de l'acier de 1 à 1,5 mm qui se déforme après quelques chauffes. Nos braseros utilisent de l'acier de 3 mm (socle) et 8-10 mm (plancha), avec des soudures manuelles à pénétration complète. Le résultat dure 20+ ans au lieu de 2-3 saisons. Sur la durée, le coût annuel est inférieur."
    },
    {
      question: "Peut-on visiter l'atelier ?",
      answer: "Oui, nous accueillons les visiteurs sur rendez-vous. Contactez-nous par téléphone ou email pour organiser une visite de l'atelier à Moncoutant. Vous pourrez voir le processus de fabrication de A à Z."
    },
    {
      question: "Quelle est la garantie sur un brasero Made in France ?",
      answer: "Tous nos braseros sont garantis 2 ans sur les défauts de fabrication. Au-delà de la garantie, nous assurons un SAV réactif et la disponibilité de pièces détachées (plancha, grille, bol) pour prolonger la durée de vie de votre brasero."
    },
    {
      question: "Livrez-vous partout en France ?",
      answer: "Oui, nous livrons partout en France métropolitaine. Chaque brasero étant fabriqué artisanalement à la commande, comptez 2 à 4 semaines (fabrication et livraison incluses). Chaque pièce est emballée avec un carton double cannelure et une mousse haute densité pour garantir une livraison en parfait état."
    },
  ];

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Made in France", url: "/made-in-france" },
  ]);

  const faqSchema = generateFAQSchema(faqItems);

  return (
    <div className="bg-white">
      <JsonLd data={breadcrumb} />
      {faqSchema && <JsonLd data={faqSchema} />}
      {/* SEO-19 : Schema Organization supprimé (doublon avec layout.tsx) */}

      {/* Hero */}
      <section className="bg-[#f6f1e9] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center">
                <Flag className="w-6 h-6 text-[#CD853F]" />
              </div>
              <span className="text-[#CD853F] font-semibold uppercase tracking-wide text-sm">
                Made in France
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
              Fabrication <span className="text-[#CD853F]">française</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              Chaque brasero est fabriqué à la main dans notre atelier de {settings.atelier.city}.
              Un savoir-faire artisanal 100% français, de la découpe laser à la livraison chez vous.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/fabrication"
                className="inline-flex items-center gap-2 bg-[#CD853F] hover:bg-[#8B4513] text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Notre processus
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/info/a-propos-de-nous"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] hover:bg-slate-800 text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
              >
                Notre histoire
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Notre engagement français
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Manufacturé en France n&apos;est pas qu&apos;un label, c&apos;est notre fierté
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4">
                <Factory className="w-7 h-7 text-[#CD853F]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">100% production française</h3>
              <p className="text-slate-600 leading-relaxed">De la conception à la livraison, tout est réalisé en France. Notre atelier est situé à Moncoutant dans les Deux-Sèvres.</p>
            </div>
            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-[#CD853F]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Artisans qualifiés</h3>
              <p className="text-slate-600 leading-relaxed">Notre équipe de ferronniers maîtrise les techniques traditionnelles du travail du métal, transmises de génération en génération.</p>
            </div>
            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <div className="w-14 h-14 bg-[#CD853F]/20 flex items-center justify-center mb-4">
                <TreePine className="w-7 h-7 text-[#CD853F]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Matières premières locales</h3>
              <p className="text-slate-600 leading-relaxed">Nous privilégions les fournisseurs français et européens pour l&apos;acier et tous nos composants. Circuits courts garantis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Processus détaillé */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4 text-center">
            De la plaque d&apos;acier à votre brasero
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Chaque brasero passe par 5 étapes de fabrication, entièrement réalisées à la main dans notre atelier.
          </p>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Sélection de l'acier",
                description: "Nous sélectionnons des tôles d'acier de 3 mm d'épaisseur pour les socles et de 8 à 10 mm pour les planchas. Acier corten (autopatinable, résistant aux intempéries) ou acier standard pour la finition peinte. Origine européenne exclusivement."
              },
              {
                step: "2",
                title: "Découpe laser de précision",
                description: "Les pièces sont découpées au laser dans notre atelier avec une précision au dixième de millimètre. La découpe laser garantit des bords nets et des assemblages parfaits, impossibles à obtenir avec une découpe manuelle."
              },
              {
                step: "3",
                title: "Formage et pliage",
                description: "Les socles sont pliés et formés sur nos machines de pliage industrielles. Les bols sont emboutis en forme de coupelle. Chaque pièce prend forme progressivement, avec des contrôles dimensionnels à chaque étape."
              },
              {
                step: "4",
                title: "Soudure artisanale",
                description: "C'est l'étape critique — et celle qui différencie un brasero artisanal d'un brasero industriel. Chaque soudure est réalisée à la main par un soudeur qualifié, avec pénétration complète du métal. Pas de soudure superficielle qui craque après quelques cycles de chauffe."
              },
              {
                step: "5",
                title: "Finition et contrôle qualité",
                description: "Les braseros corten partent en patinage naturel. Les braseros peints passent au sablage puis à la thermolaquage haute température. Chaque brasero est contrôlé : dimensions, soudures, planéité de la plancha, stabilité. Seuls les produits conformes sont expédiés."
              },
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 sm:p-8 border border-slate-200 flex gap-6">
                <div className="text-3xl font-bold text-[#CD853F] flex-shrink-0 w-10">{item.step}</div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/fabrication"
              className="inline-flex items-center gap-2 text-[#8B4513] font-semibold hover:gap-3 transition-all"
            >
              Voir le processus en détail
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Artisanal vs importé */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4 text-center">
            Brasero artisanal français vs brasero importé
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Le prix ne raconte pas toute l&apos;histoire. <Link href="/blog/pourquoi-brasero-artisanal-francais" className="text-[#8B4513] hover:underline font-medium">Lire le comparatif complet</Link>.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border border-slate-200">
              <thead>
                <tr className="bg-[#f6f1e9]">
                  <th className="p-4 font-semibold text-slate-900 border-b border-slate-200">Critère</th>
                  <th className="p-4 font-semibold text-[#8B4513] border-b border-slate-200">Atelier LBF</th>
                  <th className="p-4 font-semibold text-slate-500 border-b border-slate-200">Brasero importé</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-600">
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-medium text-slate-900">Épaisseur socle</td>
                  <td className="p-4 font-medium text-[#8B4513]">3 mm</td>
                  <td className="p-4">1 — 1,5 mm</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">Épaisseur plancha</td>
                  <td className="p-4 font-medium text-[#8B4513]">8 — 10 mm</td>
                  <td className="p-4">2 — 3 mm</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-medium text-slate-900">Soudures</td>
                  <td className="p-4">Manuelles, pénétration complète</td>
                  <td className="p-4">Robotisées, superficielles</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">Durée de vie</td>
                  <td className="p-4 font-medium text-[#8B4513]">20+ ans</td>
                  <td className="p-4">1 — 3 saisons</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-medium text-slate-900">Déformation</td>
                  <td className="p-4">Aucune (acier 3 mm)</td>
                  <td className="p-4">Se voile après quelques chauffes</td>
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">SAV</td>
                  <td className="p-4">Direct atelier + pièces détachées</td>
                  <td className="p-4">Inexistant</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-medium text-slate-900">Garantie</td>
                  <td className="p-4 font-medium text-[#8B4513]">2 ans</td>
                  <td className="p-4">6 mois ou aucune</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Coût sur 20 ans</td>
                  <td className="p-4 font-medium text-[#8B4513]">~60 €/an</td>
                  <td className="p-4">~75 €/an (remplacement tous les 2-3 ans)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Notre atelier */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#CD853F]" />
                <span className="text-sm font-semibold uppercase tracking-wide text-[#CD853F]">
                  {settings.atelier.city}, {settings.atelier.department}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-6">
                Notre atelier dans les Deux-Sèvres
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Implanté à {settings.atelier.city} depuis plusieurs années, notre atelier perpétue les traditions
                de la ferronnerie d&apos;art tout en intégrant des techniques modernes comme la découpe laser.
                C&apos;est ici que naissent tous nos braseros, façonnés avec passion par nos artisans.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Nous travaillons exclusivement avec de l&apos;acier français et européen, garantissant une traçabilité
                complète de nos produits. Chaque brasero porte en lui une part de notre région et de notre savoir-faire.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Moncoutant est au cœur de la Nouvelle-Aquitaine, une région riche en tradition artisanale.
                En choisissant un brasero Atelier LBF, vous soutenez l&apos;emploi local et le maintien de savoir-faire
                qui risqueraient de disparaître face à l&apos;importation massive de produits standardisés.
              </p>
              <Link
                href="/atelier"
                className="inline-flex items-center gap-2 text-[#8B4513] font-semibold hover:gap-3 transition-all"
              >
                Visiter notre atelier
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="bg-white p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">En chiffres</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-[#CD853F]">100%</div>
                  <div className="text-slate-600">Fabrication française</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#CD853F]">3 mm</div>
                  <div className="text-slate-600">Épaisseur d&apos;acier minimum</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#CD853F]">2 ans</div>
                  <div className="text-slate-600">Garantie sur tous les produits</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#CD853F]">20+</div>
                  <div className="text-slate-600">Années de durée de vie</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact écologique */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-4 text-center">
            L&apos;impact écologique du Made in France
          </h2>
          <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
            Acheter français, c&apos;est aussi un choix environnemental.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <Recycle className="w-8 h-8 text-[#CD853F] mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Pas de transport intercontinental</h3>
              <p className="text-slate-600 leading-relaxed">
                Un brasero importé de Chine parcourt 20 000 km en container. Le nôtre parcourt quelques centaines de kilomètres entre l&apos;aciérie européenne, notre atelier et votre domicile. L&apos;empreinte carbone est incomparable.
              </p>
            </div>
            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-[#CD853F] mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Un brasero qui dure 20 ans</h3>
              <p className="text-slate-600 leading-relaxed">
                Un brasero artisanal de 3 mm d&apos;acier remplace 5 à 10 braseros jetables sur sa durée de vie. Moins de déchets, moins de production, moins de transport. La durabilité est la meilleure forme d&apos;écologie.
              </p>
            </div>
            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <Wrench className="w-8 h-8 text-[#CD853F] mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Réparable, pas jetable</h3>
              <p className="text-slate-600 leading-relaxed">
                Plancha usée après 15 ans ? On vous en fournit une neuve. Grille endommagée ? Pièce détachée disponible. Un brasero Atelier LBF se répare, il ne se jette pas en déchetterie.
              </p>
            </div>
            <div className="bg-[#f6f1e9] p-6 sm:p-8 border border-slate-200">
              <Heart className="w-8 h-8 text-[#CD853F] mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Emploi local</h3>
              <p className="text-slate-600 leading-relaxed">
                Chaque brasero vendu finance un emploi d&apos;artisan ferronnier en Nouvelle-Aquitaine. Les compétences restent sur le territoire, les bénéfices aussi. C&apos;est un cercle vertueux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles liés */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-8 text-center">
            Articles sur la fabrication et la qualité
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {(latestBlogPosts || []).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-white p-5 border border-slate-200 hover:shadow-md hover:border-[#CD853F] transition-all group">
                <span className="text-xs text-[#8B4513] font-medium">Guide</span>
                <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-[#8B4513] transition-colors text-sm">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ce qui nous différencie */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
              Ce qui nous différencie
            </h2>
          </div>

          <div className="bg-[#f6f1e9] p-8 border border-slate-200">
            <ul className="space-y-4">
              {[
                "Atelier ouvert aux visiteurs : venez voir comment sont fabriqués vos braseros",
                "Personnalisation possible : adaptez dimensions et finitions à vos envies",
                "Réactivité : un problème ? Notre SAV intervient sous 48h",
                "Conseil d'expert : nos artisans vous guident dans votre choix par téléphone",
                "Pièces détachées disponibles : prolongez la durée de vie de votre brasero indéfiniment",
                "Chaque brasero porte notre signature — fierté du travail bien fait",
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

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-10 text-center">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <details key={index} className="bg-white border border-slate-200 group">
                <summary className="p-5 sm:p-6 cursor-pointer font-semibold text-slate-900 hover:text-[#8B4513] transition-colors list-none flex items-center justify-between">
                  {faq.question}
                  <span className="text-[#CD853F] text-xl ml-4 group-open:rotate-45 transition-transform">+</span>
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
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
            Soutenez le savoir-faire français
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Choisissez un brasero 100% manufacturé en France et participez au maintien de l&apos;artisanat local.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/produits?category=brasero"
              className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#CD853F] text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              <Award size={18} />
              Nos braseros français
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-8 py-4 transition-all"
            >
              Nous contacter
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
    </div>
  );
}
