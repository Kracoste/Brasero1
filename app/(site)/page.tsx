import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { HeroMenu } from "@/components/HeroMenu";
import { ProductCarousel } from "@/components/ProductCarousel";
import { JsonLd } from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { mapSupabaseProduct } from "@/lib/utils";
import { PRODUCT_COLUMNS } from "@/lib/data/products";
import { BRASERO_GROUP_CATEGORIES } from "@/lib/categories";
import { getReviewStatsBatch } from "@/lib/data/reviews-batch";
import type { Product } from "@/lib/schema";
import { generateStoreSchema } from "@/lib/seo/schemas";
import { Flame, Truck, Shield, Award, Scissors, Send, CheckCircle, Sparkles } from "lucide-react";
import { LazyVideo } from "@/components/LazyVideo";
import { HeroVideo } from "@/components/HeroVideo";
import { HomepageNewsletter } from "@/components/HomepageNewsletter";

// ISR : revalidation toutes les 2 min (produits vedettes changent rarement)
export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Brasero artisanal | Espace barbecue & Ameublement jardin | ${settings.storeName}`,
    description: `4 modèles de braseros plancha (L'Obélix, Le Coffy, Le Morris, Le Fermier) en 50, 80 et 100 cm. Acier corten ou peint, plancha 8 à 10 mm, livré monté. Garantie 2 ans.`,
    keywords: [
      "boutique brasero",
      "acheter brasero",
      "vente brasero artisanal",
      "ameublement extérieur",
      "brasero jardin",
      "magasin brasero en ligne",
      "brasero made in France",
      "brasero acier corten",
      settings.storeName,
    ],
    openGraph: {
      title: `${settings.storeName} | Espace barbecue & Jardin`,
      description: `Braseros plancha L'Obélix, Le Coffy, Le Morris et Le Fermier. Fabrication artisanale à Moncoutant (79), livraison France incluse.`,
      type: "website",
      locale: "fr_FR",
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default async function HomePage() {
  // Récupérer les produits vedettes depuis Supabase (priorité aux produits marqués is_featured)
  const supabase = await createClient();
  const { data: braseroProduits } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .in('category', BRASERO_GROUP_CATEGORIES as unknown as string[])
    .eq('is_featured', true)
    .order('featured_order', { ascending: true })
    .limit(4);

  // Si moins de 4 produits vedettes, compléter avec les plus populaires
  let allProducts = braseroProduits || [];
  if (allProducts.length < 4) {
    const { data: moreProducts } = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .in('category', BRASERO_GROUP_CATEGORIES as unknown as string[])
      .eq('is_featured', false)
      .order('popularScore', { ascending: false })
      .limit(4 - allProducts.length);
    
    allProducts = [...allProducts, ...(moreProducts || [])];
  }

  const braseros = allProducts
    .map((p: Record<string, unknown>) => mapSupabaseProduct(p))
    .filter(Boolean) as Product[];

  const reviewStatsMap = await getReviewStatsBatch(braseros.map((p) => p.slug));

  // SEO-23 : Récupération dynamique des derniers articles de blog
  const { data: latestBlogPosts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, featured_image')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  const settings = await getSiteSettings();

  return (
    <>
      {/* Schema.org Store enrichi pour la page d'accueil */}
      <JsonLd data={generateStoreSchema(settings)} />

      {/* Hero avec H1 SEO */}
      <section className="bg-[#f6f1e9] py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-[#8B5A2B]">
              Atelier LBF
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 leading-tight">
            Votre espace barbecue <span className="text-[#8B5A2B]">artisanal</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Braseros, planchas et accessoires fabriqués à la main en France. 
            Transformez votre jardin en véritable espace de convivialité.
          </p>
        </div>
      </section>

      {/* VideoObject pour la vidéo hero : améliore le référencement dans l'onglet Vidéos Google */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Braseros artisanaux Atelier LBF — fabrication française",
        "description": "Découvrez les braseros-planchas Atelier LBF : fabrication artisanale en France, acier corten et acier peint, cuisson au feu de bois. Modèles L'Obélix, Le Coffy, Le Morris, Le Fermier.",
        "contentUrl": "https://www.atelier-lbf.fr/acceuil/video_brasero_hero.mp4",
        "thumbnailUrl": "https://www.atelier-lbf.fr/acceuil/video_brasero_poster.webp",
        "uploadDate": "2025-06-01",
        "duration": "PT0M20S",
      }} />

      <section className="py-4 sm:py-6 lg:py-10 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16">
          {/* Layout simple et fiable */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
            {/* Colonne gauche */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3 sm:gap-4">
              {/* Braséros — vidéo */}
              <Link
                href="/produits?category=brasero"
                className="relative block overflow-hidden rounded-xl sm:rounded-2xl shadow-md transition hover:-translate-y-1 hover:shadow-xl h-[180px] sm:h-[200px] lg:h-[240px]"
              >
                <Image
                  src="/acceuil/video_brasero_poster.webp"
                  alt="Braseros artisanaux en acier corten et acier peint — collection Atelier LBF"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                  priority
                />
                <HeroVideo />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-2 sm:px-3 lg:px-4">
                  <span className="text-sm sm:text-base lg:text-lg font-semibold drop-shadow leading-tight block">Nos braséros</span>
                  <span className="mt-1.5 sm:mt-2 lg:mt-3 rounded-full bg-white/90 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 font-semibold text-slate-900 shadow text-xs sm:text-sm">
                    Découvrir nos braséros
                  </span>
                </div>
              </Link>
              {/* Fendeur et Accessoires côte à côte */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <CategoryTile
                  title="Fendeur A Bûches"
                  alt="Fendeur à bûches artisanal en acier pour couper le bois de chauffage brasero"
                  cta="Nos fendeurs"
                  image="/acceuil/Fendeur-Buches.webp"
                  href="/produits?category=fendeur"
                  compact
                />
                <CategoryTile
                  title="Accessoires"
                  alt="Accessoires brasero : plancha acier carbone, grille, spatule, pique — Atelier LBF"
                  cta="Nos accessoires"
                  image="/accesoiresbrasero.webp"
                  href="/produits?category=accessoire"
                  compact
                />
              </div>
            </div>
            {/* Colonne droite - Promo */}
            <div className="w-full lg:w-2/3">
              <PromoTile />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8 sm:pb-12 pt-6 sm:pt-8">
        <div className="w-full space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 xl:px-16 max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-[#2d2d2d]">
              Nos produits les plus vendus
            </h2>
          </div>
          <ProductCarousel products={braseros} reviewStatsMap={reviewStatsMap} />
          <div className="flex justify-center">
            <Link
              href="/produits?category=brasero"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Voir tous nos braseros
            </Link>
          </div>
        </div>
      </section>

      {/* Section Découpe Laser Personnalisée */}
      {/* SEO-18 : Mettre à jour VIDEO_UPLOAD_DATE si la vidéo de découpe laser change */}
      {(() => {
        const VIDEO_UPLOAD_DATE = "2025-03-01"; // À mettre à jour si la vidéo change
        return (
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "Découpe laser sur brasero — Atelier LBF",
            "description": "Démonstration de la découpe laser pour personnalisation de brasero artisanal. Motifs découpés dans l'acier avec précision millimétrique.",
            "contentUrl": "https://www.atelier-lbf.fr/acceuil/VideoDecoupeLaser.mp4",
            "thumbnailUrl": "https://www.atelier-lbf.fr/Produits/og-brasero.webp",
            "uploadDate": VIDEO_UPLOAD_DATE,
            "duration": "PT0M30S",
          }} />
        );
      })()}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Vidéo */}
            <div className="relative overflow-hidden rounded-lg shadow-xl aspect-video">
              <LazyVideo
                src="/acceuil/VideoDecoupeLaser.mp4"
                className="absolute inset-0 w-full h-full"
                aria-label="Démonstration de découpe laser sur brasero artisanal"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                Découpe laser en action
              </div>
            </div>

            {/* Contenu SEO */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-[#8B4513] font-medium uppercase tracking-wide text-sm">
                  Personnalisation sur mesure
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                Découpe laser sur brasero : rendez votre brasero unique
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Grâce à notre service de <strong>découpe laser sur brasero</strong>, personnalisez chaque face de votre brasero avec le motif de votre choix. Logo, prénom, dessin, blason — chaque création est taillée dans l&apos;acier avec une précision millimétrique.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Nos braseros personnalisés sont disponibles en <strong>acier corten</strong>, <strong>acier brut</strong> et <strong>inox</strong>. La découpe laser permet de réaliser des motifs d&apos;une finesse exceptionnelle, directement dans la structure du socle, pour un rendu visuel saisissant de jour comme de nuit lorsque les flammes illuminent votre création.
              </p>

              {/* Étapes du procédé */}
              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-slate-900 text-lg">Comment ça marche ?</h3>
                <div className="grid gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#f6f1e9] flex items-center justify-center flex-shrink-0 rounded-full">
                      <Sparkles className="w-5 h-5 text-[#8B4513]" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">1. Choisissez vos motifs</p>
                      <p className="text-sm text-slate-600">Sélectionnez l&apos;option personnalisation sur la fiche produit et envoyez vos images ou textes pour chaque face.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#f6f1e9] flex items-center justify-center flex-shrink-0 rounded-full">
                      <Send className="w-5 h-5 text-[#8B4513]" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">2. Validation du plan</p>
                      <p className="text-sm text-slate-600">Notre équipe réalise le plan de votre brasero et vous l&apos;envoie pour confirmation avant le lancement de la production.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#f6f1e9] flex items-center justify-center flex-shrink-0 rounded-full">
                      <Scissors className="w-5 h-5 text-[#8B4513]" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">3. Fabrication et découpe</p>
                      <p className="text-sm text-slate-600">Votre brasero est fabriqué sur mesure avec la découpe laser de vos motifs. Comptez environ 1 semaine supplémentaire.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#f6f1e9] flex items-center justify-center flex-shrink-0 rounded-full">
                      <CheckCircle className="w-5 h-5 text-[#8B4513]" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">4. Livraison chez vous</p>
                      <p className="text-sm text-slate-600">Votre brasero personnalisé est livré directement à votre domicile, prêt à être installé.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/produits?category=brasero"
                  className="inline-flex items-center gap-2 bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110 font-medium tracking-wide uppercase px-6 py-3 transition-all"
                >
                  Personnaliser mon brasero
                </Link>
                <span className="text-sm text-slate-500">
                  À partir de 300 € HT le forfait personnalisation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <HeroMenu />
      </section>

      {/* Section SEO - Avantages */}
      <section className="py-12 sm:py-16 bg-[#f6f1e9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Pourquoi choisir nos braseros ?
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Un espace barbecue d&apos;exception pour votre jardin
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/brasero-multifonction" className="bg-white p-6 text-center border border-slate-200 hover:shadow-lg hover:border-[#CD853F] transition-all group">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#CD853F]/30 transition-colors">
                <Flame className="w-6 h-6 text-[#8B5A2B]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#8B5A2B] transition-colors">Espace barbecue unique</h3>
              <p className="text-sm text-slate-600">Créez un coin chaleureux dans votre jardin avec nos braseros multifonctions</p>
            </Link>
            <Link href="/made-in-france" className="bg-white p-6 text-center border border-slate-200 hover:shadow-lg hover:border-[#CD853F] transition-all group">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#CD853F]/30 transition-colors">
                <Award className="w-6 h-6 text-[#8B5A2B]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#8B5A2B] transition-colors">Fabrication française</h3>
              <p className="text-sm text-slate-600">Chaque pièce est fabriquée à la main dans notre atelier des Deux-Sèvres</p>
            </Link>
            <Link href="/garantie" className="bg-white p-6 text-center border border-slate-200 hover:shadow-lg hover:border-[#CD853F] transition-all group">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#CD853F]/30 transition-colors">
                <Shield className="w-6 h-6 text-[#8B5A2B]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#8B5A2B] transition-colors">Garantie 2 ans</h3>
              <p className="text-sm text-slate-600">Qualité garantie sur tous nos produits avec un SAV réactif</p>
            </Link>
            <Link href="/livraison" className="bg-white p-6 text-center border border-slate-200 hover:shadow-lg hover:border-[#CD853F] transition-all group">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#CD853F]/30 transition-colors">
                <Truck className="w-6 h-6 text-[#8B5A2B]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#8B5A2B] transition-colors">Livraison soignée</h3>
              <p className="text-sm text-slate-600">Emballage renforcé et livraison partout en France sous 5-10 jours</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Blog — maillage interne SEO */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Guides et conseils brasero
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Comparatifs, techniques de cuisson, entretien : tout savoir pour profiter de votre brasero plancha.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {(latestBlogPosts || []).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-5 border border-slate-200 hover:shadow-md hover:border-[#CD853F] transition-all text-left group">
                <span className="text-xs text-[#8B4513] font-medium">Guide</span>
                <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-[#8B4513] transition-colors text-sm">{post.title}</h3>
                {post.excerpt && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all text-sm"
          >
            Tous nos guides brasero et plancha
          </Link>
        </div>
      </section>


      {/* Section Newsletter avec incentive */}
      <section className="py-12 sm:py-16 bg-[#f6f1e9]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Recevez 10% sur votre première commande
          </h2>
          <p className="mt-3 text-slate-600">
            Inscrivez-vous à notre newsletter et recevez votre code promo exclusif, ainsi que nos conseils brasero et nos offres en avant-première.
          </p>
          <HomepageNewsletter />
          <p className="mt-3 text-xs text-slate-500">
            Rejoignez + de 500 passionnés. Désabonnement en un clic.
          </p>
        </div>
      </section>

      {/* Section SEO - Texte descriptif */}
      <section className="py-12 sm:py-16 bg-[#f6f1e9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
              Aménagez votre extérieur avec style
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Bienvenue chez <strong>{settings.storeName}</strong>, votre spécialiste de l&apos;ameublement d&apos;extérieur 
              pour jardin et terrasse. Depuis notre atelier de {settings.atelier.city}, nous créons des braseros 
              artisanaux qui transforment votre jardin en véritable lieu de vie et de convivialité.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Nos braseros en acier corten et acier noir sont conçus pour durer des années. Que vous cherchiez un 
              brasero multifonction pour cuisiner et vous réchauffer, un modèle design pour sublimer votre terrasse, 
              ou un brasero traditionnel pour vos soirées entre amis, vous trouverez chez nous le produit idéal.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Complétez votre ameublement d&apos;extérieur avec nos accessoires : planchas amovibles, grilles de cuisson, 
              pare-étincelles et fendeurs à bûches. Tout ce qu&apos;il faut pour profiter pleinement de votre jardin, 
              été comme hiver.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Chaque brasero est fabriqué à la main dans notre atelier français. Nous sélectionnons des matériaux de 
              première qualité et appliquons un contrôle qualité rigoureux pour vous garantir un produit qui durera 
              des décennies. Livraison soignée partout en France.
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#CD853F] text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
            >
              Découvrir notre collection
            </Link>
            <Link
              href="/made-in-france"
              className="inline-flex items-center gap-2 border-2 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-semibold uppercase tracking-wide px-6 py-3 transition-all"
            >
              Notre atelier
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

type CategoryTileProps = {
  title: string;
  alt?: string;
  cta: string;
  image: string;
  href: string;
  compact?: boolean;
  contain?: boolean;
};

const CategoryTile = ({ title, alt, cta, image, href, compact = false, contain = false }: CategoryTileProps) => (
  <Link
    href={href}
    className={`relative block overflow-hidden rounded-xl sm:rounded-2xl shadow-md transition hover:-translate-y-1 hover:shadow-xl ${
      compact ? 'h-[120px] sm:h-[140px] lg:h-[160px]' : 'h-[180px] sm:h-[200px] lg:h-[240px]'
    }`}
  >
    <div className={`absolute inset-0 ${contain ? 'bg-[#2a2018]' : ''}`}>
      <Image
        src={image}
        alt={alt || title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`${contain ? 'object-contain' : 'object-cover'}`}
        loading="lazy"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-2 sm:px-3 lg:px-4">
      <span className={`font-semibold drop-shadow leading-tight block ${compact ? 'text-xs sm:text-sm lg:text-base' : 'text-sm sm:text-base lg:text-lg'}`}>{title}</span>
      <span className={`mt-1.5 sm:mt-2 lg:mt-3 rounded-full bg-white/90 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 font-semibold text-slate-900 shadow ${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>
        {cta}
      </span>
    </div>
  </Link>
);

const PromoTile = () => (
  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-black text-white shadow-lg h-[320px] sm:h-[360px] lg:h-full lg:min-h-[420px]">
    <Image
      src="/Braserobanner.webp"
      alt="Promotion braseros artisanaux Atelier LBF — jusqu'à 40% de réduction sur braseros et accessoires"
      fill
      priority
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-cover brightness-125"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
    <div className="relative flex h-full flex-col items-start justify-center gap-2 sm:gap-3 lg:gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-12">
      <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#D2691E]">Nos promotions</p>
      <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight">
        PROMOTIONS <br /> JUSQU&apos;À 40%
      </span>
      <p className="text-xs sm:text-sm lg:text-base text-[#8B5A2B] max-w-md">
        Promotions pouvant aller jusqu&apos;à 40% sur nos braséros et accessoires.
      </p>
      <Link
        href="/produits?category=promotions"
        className="mt-1 sm:mt-2 inline-flex items-center justify-center rounded-full bg-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-900 shadow transition hover:scale-[1.02]"
      >
        J&apos;en profite
      </Link>
    </div>
  </div>
);
