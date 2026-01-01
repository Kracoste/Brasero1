'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type MenuItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
};

const heroItems: MenuItem[] = [
  {
    id: 'signature',
    label: 'Brasero Signature 80',
    title: 'Braseros sculpturaux',
    description:
      'Nos braseros emblematiques en acier corten pour structurer vos terrasses et accueillir jusqua 12 convives.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'terrasse',
    label: 'Brasero Terrasse 60',
    title: 'Compacts pour balcons',
    description:
      'Une selection de formats legers adaptes aux espaces urbains, livres avec anneau plancha.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'premium',
    label: 'Collection Premium',
    title: 'Edition limitee',
    description:
      'Des pieces uniques fabriquees a la main avec des finitions haut de gamme pour une experience exceptionnelle.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'atelier',
    label: 'Atelier & sur-mesure',
    title: 'Fabrication locale',
    description: 'Visitez latelier, personnalisez vos finitions et suivez lassemblage en direct.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  },
];

export const HeroMenu = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeItem = heroItems[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroItems.length);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Image pleine largeur en arrière-plan */}
      <div className="relative h-[400px] sm:h-[450px] md:h-[500px] w-full lg:h-[650px]">
        <Image
          key={activeItem.id}
          src={activeItem.image}
          alt={activeItem.label}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Overlay gradient pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Contenu superposé sur l'image */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl space-y-4 sm:space-y-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
                Work light, LED, white
              </p>
              
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight lg:text-6xl">
                {activeItem.title}
              </h1>
              
              <p className="text-base sm:text-lg leading-relaxed text-white/90 lg:text-xl">
                {activeItem.description}
              </p>
              
              <Link
                href="/produits"
                className="inline-flex w-fit items-center rounded-full bg-black px-6 sm:px-10 py-3 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-black/95"
              >
                Shop now
              </Link>
              
              <div className="flex gap-2 pt-2">
                {heroItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentIndex ? 'w-8 bg-black' : 'w-3 bg-black/40'
                    }`}
                    aria-label={`Aller a ${item.label}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flèches de navigation */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/90 p-3 shadow-lg backdrop-blur-sm transition hover:scale-110 lg:left-8"
        aria-label="Precedent"
      >
        <ChevronLeft className="h-6 w-6 text-slate-800" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/90 p-3 shadow-lg backdrop-blur-sm transition hover:scale-110 lg:right-8"
        aria-label="Suivant"
      >
        <ChevronRight className="h-6 w-6 text-slate-800" />
      </button>
    </div>
  );
};
