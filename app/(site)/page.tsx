import { HeroMenu } from "@/components/HeroMenu";
import { ProductCard } from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/schema";

// Désactiver le cache pour toujours afficher les dernières données
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Récupérer les braséros depuis Supabase
  const supabase = await createClient();
  const { data: braseroProduits } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'brasero')
    .order('popularScore', { ascending: false })
    .limit(4);

  const braseros = (braseroProduits || []).map((p: any) => ({
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
      <section className="bg-[#f6f1e9] py-10">
        <div className="mx-auto grid max-w-[1600px] gap-6 px-4 sm:px-8 lg:px-16 lg:grid-cols-3">
          <div className="grid gap-4 lg:col-span-1">
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
          <PromoTile />
        </div>
      </section>

      <section className="pb-12 pt-8 bg-white">
        <div className="w-full space-y-6 px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="font-display text-3xl font-semibold text-[#2d2d2d]">
              Nos produits les plus vendus
            </h2>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
            {braseros.map((product, index) => {
              return (
                <ProductCard
                  key={product.slug}
                  product={product}
                  className="home-highlight-card"
                />
              );
            })}
          </div>
          <div className="flex justify-center">
            <a
              href="/produits"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
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
    className="relative block overflow-hidden rounded-2xl shadow-md transition hover:-translate-y-1 hover:shadow-xl"
    style={{ aspectRatio: compact ? "1 / 0.85" : "4 / 3" }}
  >
    <div className="absolute inset-0">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
      <h3 className="text-lg font-semibold drop-shadow">{title}</h3>
      <span className="mt-3 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow">
        {cta}
      </span>
    </div>
  </a>
);

const PromoTile = () => (
  <div className="relative overflow-hidden rounded-2xl bg-black text-white shadow-lg lg:col-span-2">
    <img
      src="/braserobanner.jpg"
      alt="Promotion brasero"
      className="absolute inset-0 h-full w-full object-cover brightness-125"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
    <div className="relative flex h-full flex-col items-start justify-center gap-4 px-8 py-12 sm:px-12">
      <p className="text-lg font-semibold text-[#D2691E]">Nos promotions</p>
      <h3 className="text-4xl font-black leading-tight sm:text-5xl">
        PROMOTIONS <br /> JUSQU&apos;À 40%
      </h3>
      <p className="text-lg text-[#CD853F]">
        Promotions pouvant aller jusqu&apos;à 40% sur nos braséros et accessoires.
      </p>
      <a
        href="/produits?category=promotions"
        className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow transition hover:scale-[1.02]"
      >
        J&apos;en profite
      </a>
    </div>
  </div>
);
