import Link from "next/link";

import { FadeIn } from "@/components/FadeIn";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import { Section } from "@/components/Section";
import { braseros } from "@/content/products";

export default function HomePage() {
  return (
    <>
      <section className="pt-10">
        <div className="mx-auto w-[95%] px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <HeroCarousel />
          </FadeIn>
        </div>
      </section>

      <section className="bg-black pb-24 pt-16">
        <div className="mx-auto w-[95%] space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-white/60">Catalogue</p>
              <h2 className="font-display text-3xl font-semibold text-white">
                Braséros & fendeur à bûches
              </h2>
            </div>
            <Link href="/produits" className="text-sm font-semibold text-white hover:text-amber-200">
              Voir tout →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {braseros.map((product) => (
              <FadeIn key={product.slug}>
                <ProductCard product={product} className="h-full" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
