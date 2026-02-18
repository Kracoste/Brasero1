import Link from "next/link";
import { Metadata } from "next";
import { HeroMenu } from "@/components/HeroMenu";
import { ProductCarousel } from "@/components/ProductCarousel";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/site-settings";
import { mapSupabaseProduct } from "@/lib/utils";
import type { Product } from "@/lib/schema";
import { Flame, Truck, Shield, Award } from "lucide-react";

// Force dynamic rendering — données toujours fraîches depuis Supabase
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  
  return {
    title: `Brasero artisanal | Espace barbecue & Ameublement jardin | ${settings.storeName}`,
    description: `Boutique en ligne de braseros artisanaux fabriqués en France. Espace barbecue, plancha, fendeur à bûches et accessoires pour aménager votre jardin. Livraison partout en France.`,
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
      description: `Braseros artisanaux, planchas et accessoires pour votre jardin. Fabriqués en France, livrés chez vous.`,
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
    .select('*')
    .eq('category', 'brasero')
    .eq('is_featured', true)
    .order('featured_order', { ascending: true })
    .limit(4);

  // Si moins de 4 produits vedettes, compléter avec les plus populaires
  let allProducts = braseroProduits || [];
  if (allProducts.length < 4) {
    const { data: moreProducts } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'brasero')
      .eq('is_featured', false)
      .order('popularScore', { ascending: false })
      .limit(4 - allProducts.length);
    
    allProducts = [...allProducts, ...(moreProducts || [])];
  }

  const braseros = allProducts
    .map((p: Record<string, unknown>) => mapSupabaseProduct(p))
    .filter(Boolean) as Product[];

  const settings = await getSiteSettings();

  return (
    <>
      {/* Schema.org pour la page d'accueil */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            "name": settings.storeName,
            "description": "Boutique en ligne de braseros artisanaux fabriqués en France",
            "url": "https://www.atelier-lbf.fr",
            "image": "https://www.atelier-lbf.fr/Braserobanner.jpg",
            "telephone": settings.storePhone,
            "email": settings.storeEmail,
            "address": {
              "@type": "PostalAddress",
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
            "priceRange": "€€",
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "09:00",
              "closes": "18:00"
            }
          })
        }}
      />

      {/* Hero avec H1 SEO */}
      <section className="bg-[#f6f1e9] py-8 sm:py-10 lg:py-12">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-[#CD853F]">
              Atelier LBF
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 leading-tight">
            Votre espace barbecue <span className="text-[#CD853F]">artisanal</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Braseros, planchas et accessoires fabriqués à la main en France. 
            Transformez votre jardin en véritable espace de convivialité.
          </p>
        </div>
      </section>

      <section className="py-4 sm:py-6 lg:py-10 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16">
          {/* Layout simple et fiable */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
            {/* Colonne gauche */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3 sm:gap-4">
              {/* Braséros */}
              <CategoryTile
                title="Nos braséros"
                cta="Découvrir nos braséro"
                image="/acceuil/acceuil1.jpg"
                href="/produits?category=brasero"
              />
              {/* Fendeur et Accessoires côte à côte */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <CategoryTile
                  title="Fendeur A Bûches"
                  cta="Voir tous"
                  image="/acceuil/Fendeur-Buches.png"
                  href="/produits?category=fendeur"
                  compact
                />
                <CategoryTile
                  title="Accessoires"
                  cta="Voir tous"
                  image="/accesoiresbrasero.jpg"
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
          <ProductCarousel products={braseros} />
          <div className="flex justify-center">
            <Link
              href="/produits"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Voir notre catalogue
            </Link>
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
                <Flame className="w-6 h-6 text-[#CD853F]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#CD853F] transition-colors">Espace barbecue unique</h3>
              <p className="text-sm text-slate-600">Créez un coin chaleureux dans votre jardin avec nos braseros multifonctions</p>
            </Link>
            <Link href="/made-in-france" className="bg-white p-6 text-center border border-slate-200 hover:shadow-lg hover:border-[#CD853F] transition-all group">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#CD853F]/30 transition-colors">
                <Award className="w-6 h-6 text-[#CD853F]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#CD853F] transition-colors">Fabrication française</h3>
              <p className="text-sm text-slate-600">Chaque pièce est fabriquée à la main dans notre atelier des Deux-Sèvres</p>
            </Link>
            <Link href="/garantie" className="bg-white p-6 text-center border border-slate-200 hover:shadow-lg hover:border-[#CD853F] transition-all group">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#CD853F]/30 transition-colors">
                <Shield className="w-6 h-6 text-[#CD853F]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#CD853F] transition-colors">Garantie 2 ans</h3>
              <p className="text-sm text-slate-600">Qualité garantie sur tous nos produits avec un SAV réactif</p>
            </Link>
            <Link href="/livraison-france" className="bg-white p-6 text-center border border-slate-200 hover:shadow-lg hover:border-[#CD853F] transition-all group">
              <div className="w-12 h-12 bg-[#CD853F]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#CD853F]/30 transition-colors">
                <Truck className="w-6 h-6 text-[#CD853F]" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-[#CD853F] transition-colors">Livraison soignée</h3>
              <p className="text-sm text-slate-600">Emballage renforcé et livraison partout en France sous 5-10 jours</p>
            </Link>
          </div>
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
  cta: string;
  image: string;
  href: string;
  compact?: boolean;
};

const CategoryTile = ({ title, cta, image, href, compact = false }: CategoryTileProps) => (
  <Link
    href={href}
    className={`relative block overflow-hidden rounded-xl sm:rounded-2xl shadow-md transition hover:-translate-y-1 hover:shadow-xl ${
      compact ? 'h-[120px] sm:h-[140px] lg:h-[160px]' : 'h-[180px] sm:h-[200px] lg:h-[240px]'
    }`}
  >
    <div className="absolute inset-0">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-2 sm:px-3 lg:px-4">
      <h3 className={`font-semibold drop-shadow leading-tight ${compact ? 'text-xs sm:text-sm lg:text-base' : 'text-sm sm:text-base lg:text-lg'}`}>{title}</h3>
      <span className={`mt-1.5 sm:mt-2 lg:mt-3 rounded-full bg-white/90 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 font-semibold text-slate-900 shadow ${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>
        {cta}
      </span>
    </div>
  </Link>
);

const PromoTile = () => (
  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-black text-white shadow-lg h-[320px] sm:h-[360px] lg:h-full lg:min-h-[420px]">
    <img
      src="/Braserobanner.jpg"
      alt="Promotion brasero"
      className="absolute inset-0 h-full w-full object-cover brightness-125"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
    <div className="relative flex h-full flex-col items-start justify-center gap-2 sm:gap-3 lg:gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-12">
      <p className="text-sm sm:text-base lg:text-lg font-semibold text-[#D2691E]">Nos promotions</p>
      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight">
        PROMOTIONS <br /> JUSQU&apos;À 40%
      </h3>
      <p className="text-xs sm:text-sm lg:text-base text-[#CD853F] max-w-md">
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
