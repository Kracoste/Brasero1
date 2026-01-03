import { HeroMenu } from "@/components/HeroMenu";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/schema";

// Cache ISR de 60 secondes pour équilibrer performance et fraîcheur des données
export const revalidate = 60;

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

  const braseros = allProducts.map((p: any) => ({
    slug: p.slug,
    name: p.name,
    shortDescription: p.shortDescription || p.short_description || '',
    description: p.description || '',
    category: p.category,
    price: p.price,
    comparePrice: p.comparePrice || p.compare_price,
    discountPercent: p.discountPercent || p.discount_percent,
    badge: p.badge || '',
    images: p.images || [],
    popularScore: p.popularScore || p.popular_score || 50,
    onDemand: p.onDemand ?? p.on_demand ?? false,
    madeIn: 'France' as const,
    material: p.material || '',
    diameter: p.diameter || 0,
    thickness: p.thickness || 0,
    height: p.height || 0,
    weight: p.weight || 0,
    warranty: p.warranty || '',
    availability: p.availability || 'En stock',
    shipping: p.shipping || '',
    specs: p.specs || { acier: '', epaisseur: '', dimensions: '', poids: '' },
    highlights: p.highlights || [],
    features: p.features || [],
    location: p.location || { city: '', dept: '', lat: 0, lng: 0 },
    faq: p.faq || [],
    customSpecs: p.customSpecs || p.custom_specs,
  })) as Product[];

  return (
    <>
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
            <a
              href="/produits"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Voir notre catalogue
            </a>
          </div>
        </div>
      </section>

      <section>
        <HeroMenu />
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
  <a
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
  </a>
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
      <a
        href="/produits?category=promotions"
        className="mt-1 sm:mt-2 inline-flex items-center justify-center rounded-full bg-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-900 shadow transition hover:scale-[1.02]"
      >
        J&apos;en profite
      </a>
    </div>
  </div>
);
