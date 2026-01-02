'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { Heart, Menu, ShoppingBag, User, X, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { navLinks } from '@/components/navigation';
import { useCart } from '@/lib/cart-context';
import { useFavorites } from "@/lib/favorites-context";
import { useAuth } from '@/lib/auth-context';

export const Header = () => {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { favoriteCount } = useFavorites();
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accessoriesTimer = useRef<NodeJS.Timeout | null>(null);
  const accountTimer = useRef<NodeJS.Timeout | null>(null);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-[#f6f1e9] shadow-sm overflow-visible">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between py-1 gap-2">
          {/* Logo à gauche */}
          <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo/Logo1.png"
            alt="Atelier LBF Logo"
            width={1400}
            height={500}
            className="w-auto h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20"
            style={{ objectFit: "contain" }}
            priority
          />
          </Link>
          
          {/* Navigation centrée - cachée sur mobile/tablette */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-2 lg:gap-3 xl:gap-6">
              {navLinks.map((link) => {
                if (link.label === "Accessoires") {
                  const isActive =
                    pathname === link.href ||
                    pathname.includes("category=accessoire") ||
                    pathname.includes("category=fendeur");
                  return (
                    <div
                      key={link.href}
                      className="relative mx-1 md:mx-2 lg:mx-4 flex items-center"
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
                          "nav-link-hover text-[0.65rem] md:text-[0.7rem] xl:text-[0.85rem] font-semibold uppercase tracking-[0.1em] md:tracking-[0.15em] xl:tracking-[0.25em] transition relative pb-1 inline-flex items-center",
                          isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-900",
                        )}
                      >
                        {link.label}
                      </Link>
                      <div
                        className={cn(
                          "absolute left-0 top-full z-20 mt-2 w-56 flex-col rounded-xl bg-white shadow-lg ring-1 ring-slate-200 transition-opacity overflow-hidden",
                          accessoriesOpen ? "flex opacity-100" : "hidden opacity-0",
                        )}
                      >
                        <Link
                          href="/produits?category=range-buches"
                          className="px-4 py-3 text-[0.9rem] font-semibold text-[#8b2d2d] hover:bg-slate-50 rounded-t-xl"
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
                          className="px-4 py-3 text-[0.9rem] font-medium text-slate-700 hover:bg-slate-50 rounded-b-xl"
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
                      "nav-link-hover text-[0.65rem] md:text-[0.7rem] xl:text-[0.85rem] font-semibold uppercase tracking-[0.1em] md:tracking-[0.15em] xl:tracking-[0.25em] transition relative pb-1 mx-1 md:mx-2 lg:mx-3 xl:mx-6",
                      isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-900",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/recettes"
                className="rounded-md bg-gradient-to-br from-[#8B4513] to-[#CD853F] px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 text-[0.65rem] md:text-[0.7rem] xl:text-[0.85rem] font-semibold uppercase tracking-[0.1em] md:tracking-[0.15em] xl:tracking-[0.25em] text-white transition hover:brightness-110 mx-1 md:mx-2 lg:mx-3 xl:mx-6"
              >
                Recettes
              </Link>
            </div>
          </div>
          
          {/* Icônes à droite - toujours visibles */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 flex-shrink-0">
            {/* Favoris */}
            <Link href="/favoris" className="flex flex-col items-center text-slate-700 hover:text-slate-900 transition min-w-[40px]">
              <span className="relative">
                <Heart className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                {favoriteCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#ff5751] px-1 sm:px-1.5 text-[9px] sm:text-[10px] font-semibold text-white">
                    {favoriteCount}
                  </span>
                )}
              </span>
              <span className="hidden md:block text-[8px] sm:text-[9px] uppercase tracking-wide mt-0.5">Favoris</span>
            </Link>

            {/* Mon Compte */}
            <div 
              className="flex flex-col items-center text-slate-700 hover:text-slate-900 transition relative cursor-pointer min-w-[40px]"
              onMouseEnter={() => {
                if (accountTimer.current) clearTimeout(accountTimer.current);
                setAccountMenuOpen(true);
              }}
              onMouseLeave={() => {
                if (accountTimer.current) clearTimeout(accountTimer.current);
                accountTimer.current = setTimeout(() => setAccountMenuOpen(false), 250);
              }}
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            >
              <User className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              <span className="hidden md:block text-[8px] sm:text-[9px] uppercase tracking-wide mt-0.5">Compte</span>
              
              {/* Menu déroulant */}
              <div
                className={cn(
                  "absolute top-full mt-2 w-48 flex-col rounded-xl bg-white shadow-lg ring-1 ring-slate-200 transition-opacity z-50 overflow-hidden",
                  accountMenuOpen ? "flex opacity-100" : "hidden opacity-0"
                )}
              >
                {user ? (
                  <>
                    <div className="px-4 pt-3 pb-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Connecté en tant que</p>
                      <p className="text-sm font-medium text-slate-900 truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 flex items-center gap-2 border-b border-slate-100"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M14 9h2"/><path d="M14 14h4"/></svg>
                        Dashboard Admin
                      </Link>
                    )}
                    <Link
                      href="/mon-compte"
                      className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <User size={16} />
                      Mon profil
                    </Link>
                    <a
                      href="/api/auth/logout-redirect"
                      onClick={() => setAccountMenuOpen(false)}
                      className="px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 w-full text-left cursor-pointer"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </a>
                  </>
                ) : (
                  <>
                    <Link
                      href="/connexion"
                      className="px-4 pt-4 pb-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/inscription"
                      className="px-4 pt-2 pb-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Panier */}
            <Link href="/panier" className="flex flex-col items-center text-slate-700 hover:text-slate-900 transition min-w-[40px]">
              <span className="relative">
                <ShoppingBag className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#ff5751] px-1 sm:px-1.5 text-[9px] sm:text-[10px] font-semibold text-white">
                    {itemCount}
                  </span>
                )}
              </span>
              <span className="hidden md:block text-[8px] sm:text-[9px] uppercase tracking-wide mt-0.5">Panier</span>
            </Link>

            {/* Menu hamburger - visible sur mobile et tablette */}
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-slate-300 p-1.5 sm:p-2 text-slate-900 lg:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={open}
            >
              {open ? <X className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> : <Menu className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
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
              href="/recettes"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-gradient-to-br from-[#8B4513] to-[#CD853F] px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Recettes
            </Link>
            {user && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm font-semibold text-amber-700"
              >
                Dashboard Admin
              </Link>
            )}
            {user ? (
              <>
                <Link
                  href="/mon-compte"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-900"
                >
                  Mon profil
                </Link>
                <a
                  href="/api/auth/logout-redirect"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-600"
                >
                  Déconnexion
                </a>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
