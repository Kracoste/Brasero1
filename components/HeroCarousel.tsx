"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

import { LeafletMap } from "@/components/LeafletMap";
import { Price } from "@/components/Price";
import { braseros } from "@/content/products";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  type: "story" | "product";
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
};

const storySlide: Slide = {
  id: "story",
  type: "story",
  title: "La flamme née à Moncoutant",
  subtitle: "Atelier Brasero",
  description:
    "Depuis notre atelier des Deux-Sèvres, nous roulons et soudons l'acier corten pour créer des braséros capables d'embraser vos soirées d'été comme vos repas d'hiver.",
  backgroundImage:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
};

const productSlides: Slide[] = braseros.map((product) => ({
  id: product.slug,
  type: "product",
  title: product.name,
  subtitle: product.badge,
  description: product.shortDescription,
  backgroundImage: product.images[0].src,
}));

const slides = [storySlide, ...productSlides];

export const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const activeProduct = useMemo(() => {
    const slide = slides[current];
    if (slide.type !== "product") return undefined;
    return braseros.find((product) => product.slug === slide.id);
  }, [current]);

  const goTo = (direction: "prev" | "next") => {
    setCurrent((prev) => {
      if (direction === "prev") {
        return prev === 0 ? slides.length - 1 : prev - 1;
      }
      return prev === slides.length - 1 ? 0 : prev + 1;
    });
  };

  const slide = slides[current];

  return (
    <div className="relative overflow-hidden rounded-4xl bg-black/5 shadow-2xl">
      <div className="relative h-[520px] w-full">
        <Image
          src={slide.backgroundImage}
          alt={slide.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <div className="relative flex h-full flex-col justify-end gap-6 px-6 pb-10 text-white md:px-10">
          <div className="w-full max-w-3xl rounded-3xl bg-black/40 p-6 backdrop-blur md:p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-200">{slide.subtitle}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{slide.title}</h1>
            <p className="mt-3 text-base text-slate-200">{slide.description}</p>

            {slide.type === "story" ? (
              <div className="mt-4 grid gap-4 text-sm text-slate-100 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-2xl border border-white/20 bg-black/10 p-4">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/80">
                    <ShieldCheck size={16} /> Fabriqué en France
                  </p>
                  <p className="mt-2 text-base font-semibold">
                    Moncoutant (Deux-Sèvres) — {siteConfig.address}
                  </p>
                </div>
                <div className="h-40 overflow-hidden rounded-2xl border border-white/20 bg-black/10">
                  <LeafletMap
                    lat={siteConfig.atelier.lat}
                    lng={siteConfig.atelier.lng}
                    zoom={13}
                    markerLabel="Atelier Brasero"
                    className="h-full"
                  />
                </div>
              </div>
            ) : (
              activeProduct && (
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Price amount={activeProduct.price} className="text-2xl font-semibold" />
                  <Link
                    href={`/produits/${activeProduct.slug}`}
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-clay-900 via-clay-700 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                  >
                    Ajouter au panier
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <CarouselControls current={current} total={slides.length} onNavigate={goTo} />
      {activeProduct && slide.type === "product" && <ProductCardOverlay product={activeProduct} />}
    </div>
  );
};

type ControlProps = {
  current: number;
  total: number;
  onNavigate: (direction: "prev" | "next") => void;
};

const CarouselControls = ({ current, total, onNavigate }: ControlProps) => (
  <>
    <button
      type="button"
      onClick={() => onNavigate("prev")}
      className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur"
      aria-label="Slide précédent"
    >
      <ArrowLeft />
    </button>
    <button
      type="button"
      onClick={() => onNavigate("next")}
      className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur"
      aria-label="Slide suivant"
    >
      <ArrowRight />
    </button>
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-1.5 w-10 rounded-full bg-black/40 transition",
            current === index && "bg-black",
          )}
        />
      ))}
    </div>
  </>
);

const ProductCardOverlay = ({ product }: { product: (typeof braseros)[number] }) => {
  const image = product.images[0];

  return (
    <div className="absolute bottom-8 right-24 z-20 w-full max-w-xs rounded-[32px] bg-black/95 p-6 shadow-2xl md:p-7">
      <p className="text-xs uppercase tracking-wide text-slate-400">{product.badge}</p>
      <div className="mt-3 flex flex-col items-center gap-4">
        <div className="w-full overflow-hidden rounded-3xl">
          <Image
            src={image.src}
            alt={image.alt}
            width={320}
            height={240}
            className="h-40 w-full object-cover"
            placeholder="blur"
            blurDataURL={image.blurDataURL}
          />
        </div>
        <div className="w-full text-center">
          <h3 className="text-xl font-semibold text-clay-900">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{product.shortDescription}</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-lg font-semibold text-clay-900">
            <Price amount={product.price} />
            <span className="text-xs font-normal text-slate-500">TTC</span>
          </div>
        </div>
      </div>
      <Link
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-clay-900 via-clay-700 to-amber-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-clay-900/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
        href={`/produits/${product.slug}`}
      >
        Ajouter au panier
      </Link>
    </div>
  );
};
