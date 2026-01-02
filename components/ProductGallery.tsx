"use client";

import Image from "next/image";
import { useState } from "react";

import type { Product } from "@/lib/schema";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  product: Product;
};

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = product.images[activeIndex];
  const isAccessory = product.category === 'accessoire';

  return (
    <div className="flex flex-col items-center lg:items-end">
      {/* Image principale avec espacement en bas */}
      <div className="relative w-full aspect-square sm:aspect-[4/5] lg:aspect-[4/5] mb-4 sm:mb-6">
          <Image
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 45vw"
            placeholder={activeImage.blurDataURL ? "blur" : "empty"}
            blurDataURL={activeImage.blurDataURL}
            className={cn(
              "object-contain origin-center transition-transform duration-300 p-2 sm:p-4",
              isAccessory ? "scale-90" : "scale-100"
            )}
            priority
          />
        <div className="absolute inset-x-0 bottom-2 sm:bottom-4 flex justify-center gap-1.5 sm:gap-2">
          {product.images.map((_, index) => (
            <span
              key={`dot-${product.slug}-${index}`}
              className={cn(
                "h-1 sm:h-1.5 w-6 sm:w-10 rounded-full bg-black/40 transition",
                activeIndex === index && "bg-black",
              )}
            />
          ))}
        </div>
      </div>
      {/* Miniatures plus grandes et mieux visibles */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 w-full justify-center">
        {product.images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            className={cn(
              "relative flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl border-2 bg-white",
              activeIndex === index
                ? "border-slate-900"
                : "border-slate-200 opacity-70 hover:opacity-100",
            )}
          >
            <span className="sr-only">Voir l&apos;image {index + 1}</span>
            <Image
              src={image.src}
              alt={image.alt}
              width={200}
              height={150}
              className="h-20 w-24 sm:h-24 sm:w-28 object-contain p-1 sm:p-2"
              placeholder={image.blurDataURL ? "blur" : "empty"}
              blurDataURL={image.blurDataURL}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
