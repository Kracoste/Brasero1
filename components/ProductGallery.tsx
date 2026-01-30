"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import type { Product } from "@/lib/schema";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  product: Product;
};

export const ProductGallery = ({ product }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const activeImage = product.images[activeIndex];
  const isAccessory = product.category === 'accessoire';

  const goToPrevious = () => {
    const newIndex = activeIndex === 0 ? product.images.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    scrollToThumbnail(newIndex);
  };

  const goToNext = () => {
    const newIndex = activeIndex === product.images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    scrollToThumbnail(newIndex);
  };

  const scrollToThumbnail = (index: number) => {
    if (thumbnailsRef.current) {
      const thumbnails = thumbnailsRef.current.children;
      if (thumbnails[index]) {
        (thumbnails[index] as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex flex-col">
      {/* Image principale */}
      <div 
        className="relative w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] overflow-hidden flex items-center justify-center"
      >
          <Image
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
            placeholder={activeImage.blurDataURL ? "blur" : "empty"}
            blurDataURL={activeImage.blurDataURL}
            className="object-contain transition-transform duration-300"
            style={{
              padding: isAccessory ? '16px' : '8px',
            }}
            priority
          />
      </div>
      
      {/* Miniatures et flèches de navigation - centrées sous l'image */}
      <div 
        className="flex items-center justify-between mt-4 lg:mt-4"
        style={{ 
          // Sur mobile, pas de marges négatives pour garder centré
          // Sur desktop (lg), appliquer les marges pour aligner avec l'image zoomée
        }}
      >
        {/* Flèche gauche */}
        {product.images.length > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goToPrevious();
            }}
            className="flex-shrink-0 p-1 transition-all hover:scale-110 cursor-pointer z-10"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-8 h-8 text-slate-400 hover:text-slate-600" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        
        {/* Miniatures - centrées */}
        <div 
          ref={thumbnailsRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide justify-center flex-1 mx-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {product.images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative flex-shrink-0 overflow-hidden rounded-lg bg-transparent transition-all",
                activeIndex === index
                  ? "opacity-100"
                  : "opacity-50 hover:opacity-80",
              )}
            >
              <span className="sr-only">Voir l&apos;image {index + 1}</span>
              <Image
                src={image.src}
                alt={image.alt}
                width={200}
                height={150}
                className="h-20 w-24 sm:h-24 sm:w-28 object-contain p-2"
                placeholder={image.blurDataURL ? "blur" : "empty"}
                blurDataURL={image.blurDataURL}
              />
            </button>
          ))}
        </div>
        
        {/* Flèche droite - alignée au bord droit */}
        {product.images.length > 1 ? (
          <button
            type="button"
            onClick={goToNext}
            className="flex-shrink-0 p-1 transition-all hover:scale-110"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-8 h-8 text-slate-400 hover:text-slate-600" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </div>
  );
};
