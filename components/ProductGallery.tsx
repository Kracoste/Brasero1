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

  return (
    <div className="flex flex-col items-center lg:items-end">
      <div className="relative w-full aspect-[5/6] lg:aspect-[3/4]">
          <Image
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            placeholder="blur"
            blurDataURL={activeImage.blurDataURL}
            className="object-contain scale-125 origin-center"
            priority
          />
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {product.images.map((_, index) => (
            <span
              key={`dot-${product.slug}-${index}`}
              className={cn(
                "h-1.5 w-10 rounded-full bg-black/40 transition",
                activeIndex === index && "bg-black",
              )}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto">
        {product.images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            className={cn(
              "relative flex-shrink-0 overflow-hidden rounded-2xl border-2",
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
              className="h-24 w-32 object-cover"
              placeholder="blur"
              blurDataURL={image.blurDataURL}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
