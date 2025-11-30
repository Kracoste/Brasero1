'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { navLinks } from '@/components/navigation';
import { UserNav } from '@/components/UserNav';
import { useCart } from '@/lib/cart-context';
import { useFavorites } from "@/lib/favorites-context";

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
  const { favoriteCount } = useFavorites();
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);
  const accessoriesTimer = useRef<NodeJS.Timeout | null>(null);

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
                if (link.label === "Accessoires") {
                  const isActive =
                    pathname === link.href ||
                    pathname.includes("category=accessoire") ||
                    pathname.includes("category=fendeur");
                  return (
                    <div
                      key={link.href}
                      className="relative mx-6"
                      onMouseEnter={() => {
                        if (accessoriesTimer.current) clearTimeout(accessoriesTimer.current);
                        setAccessoriesOpen(true);
                      }}
                      onMouseLeave={() => {
                        if (accessoriesTimer.current) clearTimeout(accessoriesTimer.current);
                        accessoriesTimer.current = setTimeout(() => setAccessoriesOpen(false), 250);
                      }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "nav-link-hover text-[0.85rem] font-semibold uppercase tracking-[0.25em] transition relative pb-1",
                          isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-900",
                        )}
                      >
                        {link.label}
                      </Link>
                      <div
                        className={cn(
                          "absolute left-0 top-full z-20 mt-2 w-56 flex-col rounded-xl bg-white shadow-lg ring-1 ring-slate-200 transition-opacity",
                          accessoriesOpen ? "flex opacity-100" : "hidden opacity-0",
                        )}
                      >
                        <Link
                          href="/produits?category=accessoire&section=range-buches"
                          className="px-4 pt-4 text-[0.9rem] font-semibold text-[#8b2d2d] hover:bg-slate-50"
                        >
                          Range-bûches
                        </Link>
                        <Link
                          href="/produits?category=fendeur"
                          className="px-4 py-3 text-[0.9rem] font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Fendeur à bûches
                        </Link>
                        <Link
                          href="/produits?category=accessoire"
                          className="px-4 pb-4 text-[0.9rem] font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Tous nos accessoires
                        </Link>
                      </div>
                    </div>
                  );
                }

                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "nav-link-hover text-[0.85rem] font-semibold uppercase tracking-[0.25em] transition relative pb-1 mx-6",
                      isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-900",
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
              <span className="relative">
                <Heart size={18} />
                {favoriteCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#ff5751] px-1 text-[10px] font-semibold text-white">
                    {favoriteCount}
                  </span>
                )}
              </span>
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
