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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {braseros.map((product) => (
              <FadeIn key={product.slug}>
                <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_rgba(5,5,5,0.85))] text-white shadow-xl shadow-black/40 transition hover:-translate-y-1 hover:border-amber-300/50">
                  {product.badge && (
                    <div className="absolute left-4 top-4 z-10">
                      <Badge className="bg-white/10 px-4 py-1 text-[11px] text-white">
                        {product.badge}
                      </Badge>
                    </div>
                  )}

                  <Link
                    href={`/produits/${product.slug}`}
                    className="relative aspect-square overflow-hidden bg-black/20"
                  >
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt}
                      fill
                      className="object-contain p-6 transition duration-300 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={product.images[0].blurDataURL}
                    />
                  </Link>

                  <div className="flex flex-col gap-3 border-t border-white/5 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-emerald-300">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-300"></span>
                        <span className="font-medium">En Stock</span>
                      </div>
                    </div>

                    <Link href={`/produits/${product.slug}`}>
                      <h3 className="text-sm font-semibold text-white transition group-hover:text-amber-200">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-2">
                      <Price amount={product.price} className="text-2xl font-bold text-white" />
                      <span className="text-xs text-white/60">TTC</span>
                    </div>

                    <Link
                      href={`/produits/${product.slug}`}
                      className="flex items-center justify-center rounded-full bg-gradient-to-r from-clay-900 via-clay-700 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-clay-900/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                    >
                      Ajouter au panier
                    </Link>

                    <button className="text-xs font-medium text-white/60 transition hover:text-white">
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
