'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { navLinks } from '@/components/navigation';
import { UserNav } from '@/components/UserNav';
import { useCart } from '@/lib/cart-context';

export const Header = () => {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-[#ff5751]">
            BRASERO
            <span className="text-[#111827]">.FR</span>
          </Link>

          <div className="hidden flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 md:flex">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un braséro..."
              className="w-full bg-transparent text-sm text-slate-600 outline-none"
            />
            <button className="rounded-full bg-[#111827] px-4 py-2 text-xs font-semibold text-white">
              Rechercher
            </button>
          </div>

          <div className="ml-auto flex items-center gap-4 text-xs text-slate-500">
            <Link href="/favoris" className="flex flex-col items-center gap-1">
              <Heart size={20} />
              Favoris
            </Link>
            <Link href="/panier" className="flex flex-col items-center gap-1">
              <span className="relative">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#ff5751] px-1 text-[10px] font-semibold text-white">
                    {itemCount}
                  </span>
                )}
              </span>
              Panier
            </Link>
            <div className="hidden flex-col items-center gap-1 text-slate-500 md:flex">
              <User size={20} />
              <UserNav />
            </div>
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-slate-200 p-2 text-slate-600 md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#111827] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm sm:px-6 lg:px-8">
          <button className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold">
            <Menu size={16} />
            Toutes les catégories
          </button>
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-medium transition',
                    isActive ? 'text-white' : 'text-white/70 hover:text-white',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <Link href="/connexion" className="text-xs font-semibold text-white/80 underline">
            Login / Register
          </Link>
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
                className="rounded-lg border border-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/connexion"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700"
            >
              Connexion / Inscription
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
