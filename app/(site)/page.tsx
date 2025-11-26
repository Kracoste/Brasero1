import { HeroMenu } from "@/components/HeroMenu";
import { ProductCard } from "@/components/ProductCard";
import { braseros } from "@/content/products";

export default function HomePage() {
  return (
    <>
      <section>
        <HeroMenu />
      </section>

      <section className="pb-12 pt-8" style={{ backgroundColor: '#C4A57B' }}>
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
                name: `Braséro Atelier LBF en Acier Ø${dimensions[index]}`
              };
              return (
                <ProductCard key={product.slug} product={productWithDimension} className="home-highlight-card" />
              );
            })}
            {braseros.slice(4, 8).map((product, index) => {
              const dimensions = [60, 75, 90, 105];
              const productWithDimension = {
                ...product,
                name: `Braséro Atelier LBF en Acier Corten Ø${dimensions[index]}`
              };
              return (
                <ProductCard key={product.slug} product={productWithDimension} className="home-highlight-card" />
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
    </>
  );
}
