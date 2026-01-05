'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/schema';

type RelatedProductsProps = {
  products: Product[];
  title?: string;
  className?: string;
};

export function RelatedProducts({ products, title = "Ils vous plairont aussi...", className = '' }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate current page based on scroll position
      const cardWidth = 280;
      const visibleCards = Math.floor(clientWidth / cardWidth);
      const totalPages = Math.ceil(products.length / Math.max(visibleCards, 1));
      const newPage = Math.min(
        Math.floor(scrollLeft / (cardWidth * Math.max(visibleCards, 1))),
        totalPages - 1
      );
      setCurrentPage(Math.max(0, newPage));
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const scrollToPage = (page: number) => {
    if (scrollRef.current) {
      const cardWidth = 280;
      const visibleCards = Math.floor(scrollRef.current.clientWidth / cardWidth);
      scrollRef.current.scrollTo({ 
        left: page * cardWidth * Math.max(visibleCards, 1), 
        behavior: 'smooth' 
      });
    }
  };

  // Calculate total pages for dots
  const calculateTotalPages = () => {
    const cardWidth = 280;
    const containerWidth = scrollRef.current?.clientWidth || 1200;
    const visibleCards = Math.floor(containerWidth / cardWidth);
    return Math.ceil(products.length / Math.max(visibleCards, 1));
  };

  if (products.length === 0) return null;

  return (
    <div className={`py-12 ${className}`}>
      {/* Titre */}
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-10 uppercase tracking-wide italic">
        {title}
      </h2>

      {/* Carousel - avec flèches à l'extérieur */}
      <div className="relative max-w-[1500px] mx-auto flex items-center">
        {/* Flèche gauche - à l'extérieur */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`flex-shrink-0 p-3 rounded-full transition border border-slate-200 mx-2 ${
            canScrollLeft 
              ? 'bg-white shadow-lg hover:bg-slate-50 cursor-pointer' 
              : 'bg-slate-100 opacity-50 cursor-not-allowed'
          }`}
          aria-label="Produits précédents"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>

        {/* Container scrollable */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-5 flex-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.slug}
              className="flex-shrink-0 w-[calc(25%-15px)] min-w-[280px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Flèche droite - à l'extérieur */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`flex-shrink-0 p-3 rounded-full transition border border-slate-200 mx-2 ${
            canScrollRight 
              ? 'bg-white shadow-lg hover:bg-slate-50 cursor-pointer' 
              : 'bg-slate-100 opacity-50 cursor-not-allowed'
          }`}
          aria-label="Produits suivants"
        >
          <ChevronRight className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Indicateurs de page (dots) */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: Math.max(1, calculateTotalPages()) }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToPage(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentPage === index
                ? 'bg-slate-800'
                : 'bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Aller à la page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
