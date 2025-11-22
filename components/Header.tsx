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
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const toggle = () => setOpen((prev) => !prev);
  const toggleCategories = () => setCategoriesOpen((prev) => !prev);
  
  const openCategories = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setCategoriesOpen(true);
  };
  
  const closeCategories = () => {
    const timeout = setTimeout(() => {
      setCategoriesOpen(false);
    }, 300);
    setCloseTimeout(timeout);
  };

  return (
    <header className="header-texture sticky top-0 z-40 w-full border-b border-slate-700 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-[1.4rem] font-semibold uppercase tracking-[0.35em] text-[#ff6d5a]">
              BRASERO
              <span className="text-white/90">.FR</span>
            </Link>
            
            <div
              className="relative hidden md:block"
              onMouseEnter={openCategories}
              onMouseLeave={closeCategories}
            >
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-black/20"
                aria-haspopup="menu"
                aria-expanded={categoriesOpen}
                onClick={toggleCategories}
              >
                <Menu size={16} />
                Toutes les catégories
              </button>
              <div
                className={cn(
                  'absolute left-0 top-full mt-3 min-w-[260px] overflow-hidden rounded-2xl border border-white/10 bg-black text-left text-white shadow-2xl transition',
                  categoriesOpen
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none -translate-y-2 opacity-0',
                )}
                onMouseEnter={openCategories}
                onMouseLeave={closeCategories}
              >
                {categoryMenu.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="block border-b border-slate-800 px-4 py-3 transition hover:bg-slate-900 last:border-0"
                    onClick={closeCategories}
                  >
                    <p className="text-sm font-semibold text-white">{category.label}</p>
                    <p className="text-xs text-slate-500">{category.description}</p>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-[0.75rem] font-semibold uppercase tracking-[0.35em] transition',
                      isActive ? 'text-white' : 'text-white/70 hover:text-white',
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/favoris" className="hidden md:flex items-center gap-1 text-xs text-white/80 hover:text-white transition">
              <Heart size={18} />
              <span className="hidden lg:inline">Favoris</span>
            </Link>
            <Link href="/panier" className="hidden md:flex items-center gap-1 text-xs text-white/80 hover:text-white transition">
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
            <div className="hidden md:flex items-center gap-1 text-xs text-white/80 hover:text-white transition">
              <User size={18} />
              <UserNav />
            </div>
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-white/20 p-2 text-white md:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="header-texture-panel border-t border-white/20 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/connexion"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/20 bg-black/10 px-3 py-2 text-center text-sm font-semibold text-white"
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
