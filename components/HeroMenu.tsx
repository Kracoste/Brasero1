'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
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

const services = [
  { title: 'Livraison gratuite', subtitle: 'France metropolitaine' },
  { title: 'Retours faciles', subtitle: '30 jours pour changer davis' },
  { title: 'Support 7/7', subtitle: 'Artisans disponibles' },
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
    <div className="relative w-full space-y-8 px-8 py-12 lg:px-16 lg:py-16">
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white lg:left-8"
        aria-label="Precedent"
      >
        <ChevronLeft className="h-6 w-6 text-slate-800" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white lg:right-8"
        aria-label="Suivant"
      >
        <ChevronRight className="h-6 w-6 text-slate-800" />
      </button>

      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <label className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-400">
            Collections
          </label>
          
          <div className="flex gap-2">
            {heroItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-[#111827]'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Aller a ${item.label}`}
              />
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-base font-semibold text-slate-800">{activeItem.label}</p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Menu deroulant
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight text-[#111827]">
            {activeItem.title}
          </h1>
          <p className="text-lg leading-relaxed text-slate-600">{activeItem.description}</p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/produits"
              className="rounded-full bg-[#111827] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition-all hover:bg-[#000000] hover:shadow-xl"
            >
              Shop now
            </Link>
            <Link
              href="/atelier"
              className="rounded-full border-2 border-slate-300 bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wide text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              Visiter latelier
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 p-1 shadow-2xl">
          <div className="relative h-80 w-full overflow-hidden rounded-3xl lg:h-[450px]">
            <Image
              src={activeItem.image}
              alt={activeItem.label}
              fill
              className="object-cover transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <p className="text-base font-bold text-[#111827]">{service.title}</p>
            <p className="mt-1 text-sm text-slate-500">{service.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
