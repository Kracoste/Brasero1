'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site';
import { navLinks } from '@/components/navigation';
import { UserNav } from '@/components/UserNav';
import { useCart } from '@/lib/cart-context';

export const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  const toggle = () => setOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-ecru-50/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[95%] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-clay-900">
          Brasero Atelier
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive ? 'text-clay-900' : 'text-slate-500 hover:text-clay-800',
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-2">
            <UserNav />
            <Link
              href="/panier"
              className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-clay-900 transition hover:-translate-y-0.5 hover:border-clay-400"
            >
              <ShoppingBag size={16} />
              Panier
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-clay-900 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
          <Link
            href="/contact"
            className="rounded-full bg-clay-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-clay-900/20 transition hover:-translate-y-0.5 hover:bg-clay-800"
          >
            Contacter l&apos;atelier
          </Link>
        </div>

        <button
          type="button"
          onClick={toggle}
          className="rounded-full border border-slate-300 p-2 text-slate-700 md:hidden"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        className={cn(
          'md:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="mx-auto w-[95%] space-y-4 border-t border-slate-100 bg-white px-6 py-6 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-base font-semibold text-clay-900"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/connexion"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-clay-900"
            >
              Connexion
            </Link>
            <Link
              href="/panier"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-clay-900"
            >
              Panier
            </Link>
          </div>
          <div className="border-t border-slate-100 pt-4 text-sm text-slate-500">
            {siteConfig.address}
            <br />
            {siteConfig.phone}
          </div>
        </div>
      </div>
    </header>
  );
};
