'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Truck } from "lucide-react";

import type { Product } from "@/lib/schema";
import { formatCurrency } from "@/lib/utils";

const SELECTED_ACCESSORIES_KEY = "brasero:selected-accessories";

const readSelectedAccessories = () => {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.localStorage.getItem(SELECTED_ACCESSORIES_KEY);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : []);
  } catch {
    return new Set<string>();
  }
};

const persistSelectedAccessories = (slugs: Set<string>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SELECTED_ACCESSORIES_KEY, JSON.stringify(Array.from(slugs)));
};

type AccessoryGridProps = {
  products: Product[];
  title?: string;
  subtitle?: string;
};

export const AccessoryGrid = ({
  products,
  title = "Accessoires pour votre braséro",
  subtitle = "Complétez votre setup avec nos indispensables.",
}: AccessoryGridProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedItems(readSelectedAccessories());
  }, []);

  const toggleSelect = (slug: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      persistSelectedAccessories(next);
      return next;
    });
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const firstCard = container.querySelector("article");
    const cardWidth = firstCard instanceof HTMLElement ? firstCard.offsetWidth + 20 : 300;
    const amount = cardWidth * 2;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const getRating = (slug: string) => {
    const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 3.5 + (hash % 15) / 10;
  };

  if (products.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{title}</p>
          <p className="text-base text-slate-700">{subtitle}</p>
        </div>
        <div className="hidden gap-3 md:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4" ref={scrollRef}>
          {products.map((product) => {
            const isSelected = selectedItems.has(product.slug);
            const rating = getRating(product.slug);
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            const oldPrice = Math.round(product.price * 1.15);
            const image = product.images[0];

            return (
              <article
                key={product.slug}
                className="flex flex-none flex-col rounded-lg border border-gray-200 bg-white shadow-sm"
                style={{ width: "calc((100% - 48px) / 4)", minWidth: 200 }}
              >
                <div className="relative border-b border-gray-100 px-4 py-3 text-center">
                  <span className="text-sm text-gray-600">Commandez aussi</span>
                  <button
                    type="button"
                    onClick={() => toggleSelect(product.slug)}
                    className="absolute right-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center"
                    aria-label="Sélectionner l'accessoire"
                  >
                    <span
                      className={`flex h-full w-full items-center justify-center border transition ${
                        isSelected ? "border-[#0f172a]" : "border-gray-300 hover:border-[#0f172a]"
                      }`}
                    >
                      {isSelected && (
                        <span className="block h-2 w-2 bg-[#0f172a]" />
                      )}
                    </span>
                  </button>
                  <span className="absolute left-1/2 top-12 -translate-x-1/2 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
                    Black Friday
                  </span>
                </div>

                <Link href={`/produits/${product.slug}`} className="block">
                  <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-md bg-white">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="280px"
                        className="object-contain p-6"
                      />
                    ) : (
                      <div className="text-xs text-gray-400">Image indisponible</div>
                    )}
                  </div>
                </Link>

                <div className="space-y-3 px-4 pb-5 pt-3 text-sm text-gray-600">
                  <Link href={`/produits/${product.slug}`}>
                    <h3 className="min-h-[40px] text-base font-semibold text-gray-900 hover:text-[#1f7a1a]">{product.name}</h3>
                  </Link>

                  <div className="flex gap-0.5 text-[#6fbf73]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={`${product.slug}-star-${index}`}
                        className={`h-5 w-5 ${
                          index < fullStars || (index === fullStars && hasHalfStar) ? "text-[#6fbf73]" : "text-gray-200"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p>{product.specs?.dimensions || (product.diameter ? `Ø ${product.diameter} cm` : '')}</p>
                  <p className="line-clamp-1 text-gray-500">{product.shortDescription}</p>

                  <div className="flex items-center gap-2 text-green-600">
                    <Truck className="h-4 w-4" />
                    <span>
                      <span className="font-semibold">EN STOCK</span>, disponible immédiatement
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 text-gray-900">
                    <span className="text-xs text-gray-400 line-through">{formatCurrency(oldPrice)}</span>
                    <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
