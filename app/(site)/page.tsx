import { HeroMenu } from "@/components/HeroMenu";
import { ProductCard } from "@/components/ProductCard";
import { braseros } from "@/content/products";

export default function HomePage() {
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
                image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
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
            {braseros.slice(0, 4).map((product, index) => {
              const dimensions = [60, 75, 90, 105];
              const productWithDimension = {
                ...product,
                name: `Braséro Atelier LBF en Acier Ø${dimensions[index]}`,
              };
              return (
                <ProductCard
                  key={product.slug}
                  product={productWithDimension}
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
      src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80"
      alt="Promotion brasero"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
    <div className="relative flex h-full flex-col items-start justify-center gap-4 px-8 py-12 sm:px-12">
      <p className="text-lg font-semibold text-amber-200">Nos promotions</p>
      <h3 className="text-4xl font-black leading-tight sm:text-5xl">
        PROMOTIONS <br /> JUSQU&apos;À 40%
      </h3>
      <p className="text-lg text-amber-100">
        Promotions pouvant aller jusqu&apos;à 40% sur nos braséros et accessoires.
      </p>
      <a
        href="/produits"
        className="mt-2 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow transition hover:scale-[1.02]"
      >
        J&apos;en profite
      </a>
    </div>
  </div>
);
