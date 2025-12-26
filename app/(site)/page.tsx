import { HeroMenu } from "@/components/HeroMenu";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/schema";

// Désactiver le cache pour toujours afficher les dernières données
export const revalidate = 0;
export const dynamic = 'force-dynamic';

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
      <section className="bg-[#f6f1e9] py-6 sm:py-10">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Colonne gauche - Catégories */}
            <div className="grid gap-4 grid-cols-1">
              <CategoryTile
                title="Nos braséros"
                cta="Découvrir nos braséro"
                image="/acceuil/acceuil1.jpg"
                href="/produits?category=brasero"
              />
              <div className="grid grid-cols-2 gap-4">
                <CategoryTile
                  title="Nos Fendeur A Buches"
                  cta="Voir tous"
                  image="/acceuil/Fendeur-Buches.png"
                  href="/produits?category=fendeur"
                  compact
                />
                <CategoryTile
                  title="Nos Accessoires"
                  cta="Voir tous"
                  image="/accesoiresbrasero.jpg"
                  href="/produits?category=accessoire"
                  compact
                />
              </div>
            </div>
            {/* Colonne droite - Promo (prend 2 colonnes sur lg) */}
            <div className="lg:col-span-2">
              <PromoTile />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8 sm:pb-12 pt-6 sm:pt-8 bg-white">
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
    className={`relative block overflow-hidden rounded-2xl shadow-md transition hover:-translate-y-1 hover:shadow-xl ${
      compact ? 'min-h-[140px] sm:min-h-[160px]' : 'min-h-[180px] sm:min-h-[220px] lg:min-h-[240px]'
    }`}
    style={{ aspectRatio: compact ? "1 / 0.9" : "4 / 3" }}
  >
    <div className="absolute inset-0">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-3 sm:px-4">
      <h3 className={`font-semibold drop-shadow ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>{title}</h3>
      <span className={`mt-2 sm:mt-3 rounded-full bg-white/90 px-3 sm:px-4 py-1.5 sm:py-2 font-semibold text-slate-900 shadow ${compact ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm'}`}>
        {cta}
      </span>
    </div>
  </a>
);

const PromoTile = () => (
  <div className="relative overflow-hidden rounded-2xl bg-black text-white shadow-lg h-full min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
    <img
      src="/Braserobanner.jpg"
      alt="Promotion brasero"
      className="absolute inset-0 h-full w-full object-cover brightness-125"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
    <div className="relative flex h-full flex-col items-start justify-center gap-3 sm:gap-4 px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      <p className="text-base sm:text-lg font-semibold text-[#D2691E]">Nos promotions</p>
      <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight">
        PROMOTIONS <br /> JUSQU&apos;À 40%
      </h3>
      <p className="text-sm sm:text-base lg:text-lg text-[#CD853F] max-w-md">
        Promotions pouvant aller jusqu&apos;à 40% sur nos braséros et accessoires.
      </p>
      <a
        href="/produits?category=promotions"
        className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 shadow transition hover:scale-[1.02]"
      >
        J&apos;en profite
      </a>
    </div>
  </div>
);
