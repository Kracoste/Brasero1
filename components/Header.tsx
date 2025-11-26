'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { navLinks } from '@/components/navigation';
import { UserNav } from '@/components/UserNav';
import { useCart } from '@/lib/cart-context';

const categoryMenu = [
  {
    label: 'Braséros',
    href: '/produits?category=brasero',
    description: 'Vasques corten de 60 à 100 cm fabriquées à Moncoutant.',
  },
  {
    label: 'Fendeur à bûches',
    href: '/produits?category=fendeur',
    description: 'Accessoire manuel premium pour recharger vos feux.',
  },
] as const;

export const Header = () => {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const toggleCategories = () => setCategoriesOpen((prev) => !prev);

  const openCategories = () => {
    setCategoriesOpen(true);
  };
  
  const closeCategories = () => {
    setCategoriesOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-5">
          {/* Nom du site à gauche */}
          <Link
            href="/"
            className="font-display text-[1.2rem] font-semibold uppercase tracking-[0.3em] text-[#2d2d2d] sm:text-[1.6rem] sm:tracking-[0.4em] whitespace-nowrap ml-32"
          >
            ATELIER LBF
          </Link>
          
          {/* Navigation centrée */}
          <div className="flex-1 flex justify-center">
            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'nav-link-hover text-[0.85rem] font-semibold uppercase tracking-[0.25em] transition relative pb-1 mx-6',
                      isActive ? 'text-slate-900' : 'text-slate-700 hover:text-slate-900',
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/recettes"
                className="rounded-md bg-[#d97744] px-4 py-2 text-[0.85rem] font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#c96a3a] mx-6"
              >
                Recettes
              </Link>
            </div>
          </div>
          
          {/* Icônes à droite */}
          <div className="flex items-center gap-2">
            <Link href="/favoris" className="hidden md:flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition">
              <Heart size={18} />
              <span className="hidden lg:inline">Favoris</span>
            </Link>
            <Link href="/panier" className="hidden md:flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition">
              <span className="relative">
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#ff5751] px-1 text-[10px] font-semibold text-white">
                    {itemCount}
                  </span>
                )}
              </span>
              <span className="hidden lg:inline">Panier</span>
            </Link>
            <div className="hidden md:flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition">
              <User size={18} />
              <UserNav />
            </div>
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-slate-300 p-2 text-slate-900 md:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/connexion"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-900"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-[#ff5751] px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Inscription
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
