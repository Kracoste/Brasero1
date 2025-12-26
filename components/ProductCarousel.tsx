'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/schema';

type ProductCarouselProps = {
  products: Product[];
  className?: string;
};

export function ProductCarousel({ products, className = '' }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate current index based on scroll position
      const cardWidth = clientWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Carousel container - visible only on mobile */}
      <div className="lg:hidden">
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.slug}
              className="flex-shrink-0 w-full snap-center px-2"
            >
              <ProductCard product={product} className="home-highlight-card" />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 hover:bg-white transition"
            aria-label="Produit précédent"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 hover:bg-white transition"
            aria-label="Produit suivant"
          >
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>
        )}

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index
                  ? 'bg-[#8B4513] w-6'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Aller au produit ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Grid layout - visible only on desktop */}
      <div className="hidden lg:grid gap-6 grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            className="home-highlight-card"
          />
        ))}
      </div>
    </div>
  );
}
