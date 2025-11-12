import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/Badge";
import { FadeIn } from "@/components/FadeIn";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Price } from "@/components/Price";
import { Section } from "@/components/Section";
import { braseros } from "@/content/products";

export default function HomePage() {
  return (
    <>
      <Section className="pt-10">
        <div className="mx-auto w-[95%] px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <HeroCarousel />
          </FadeIn>
        </div>
      </Section>

      <Section className="pb-24">
        <div className="mx-auto w-[95%] space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-400">Catalogue</p>
              <h2 className="font-display text-3xl font-semibold text-clay-900">
                Braséros & fendeur à bûches
              </h2>
            </div>
            <Link href="/produits" className="text-sm font-semibold text-clay-900">
              Voir tout →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {braseros.map((product) => (
              <FadeIn key={product.slug}>
                <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl">
                  {product.badge && (
                    <div className="absolute left-4 top-4 z-10">
                      <Badge className="bg-emerald-700 text-white">{product.badge}</Badge>
                    </div>
                  )}
                  
                  <Link href={`/produits/${product.slug}`} className="relative aspect-square overflow-hidden bg-slate-50">
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt}
                      fill
                      className="object-contain p-6 transition duration-300 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={product.images[0].blurDataURL}
                    />
                  </Link>

                  <div className="flex flex-col gap-3 border-t border-slate-100 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-emerald-700">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-700"></span>
                        <span className="font-medium">En Stock</span>
                      </div>
                    </div>

                    <Link href={`/produits/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-clay-900 transition group-hover:text-clay-700">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-2">
                      <Price amount={product.price} className="text-2xl font-bold text-clay-900" />
                      <span className="text-xs text-slate-500">TTC</span>
                    </div>

                    <Link
                      href={`/produits/${product.slug}`}
                      className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-clay-900 via-clay-700 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-clay-900/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                    >
                      <span aria-hidden className="transition duration-300 group-hover:rotate-12">🔥</span>
                      <span>Voir le produit</span>
                    </Link>

                    <button className="text-xs font-medium text-slate-600 transition hover:text-clay-900">
                      COMPARER
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
