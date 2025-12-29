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
      <div className="relative w-full aspect-square sm:aspect-[5/6] lg:aspect-[3/4]">
          <Image
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 45vw"
            placeholder={activeImage.blurDataURL ? "blur" : "empty"}
            blurDataURL={activeImage.blurDataURL}
            className={cn(
              "object-contain origin-center transition-transform duration-300",
              isAccessory ? "scale-90 p-4 sm:p-6" : "scale-110 sm:scale-125"
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
      <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3 overflow-x-auto pb-2 w-full">
        {product.images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            className={cn(
              "relative flex-shrink-0 overflow-hidden rounded-lg sm:rounded-2xl border-2",
              activeIndex === index
                ? "border-clay-900"
                : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <span className="sr-only">Voir l&apos;image {index + 1}</span>
            <Image
              src={image.src}
              alt={image.alt}
              width={160}
              height={120}
              className={cn(
                "h-16 w-20 sm:h-24 sm:w-32",
                isAccessory ? "object-contain p-1" : "object-cover"
              )}
              placeholder={image.blurDataURL ? "blur" : "empty"}
              blurDataURL={image.blurDataURL}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
