'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { Heart, Menu, ShoppingBag, User, X, LogOut } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

import { cn } from '@/lib/utils';
import { navLinks } from '@/components/navigation';
import { useCart } from '@/lib/cart-context';
import { useFavorites } from "@/lib/favorites-context";
import { createClient } from '@/lib/supabase/client';

export const Header = () => {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { favoriteCount } = useFavorites();
  const [open, setOpen] = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const accessoriesTimer = useRef<NodeJS.Timeout | null>(null);
  const accountTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchRole = async (userId: string, userEmail: string | undefined) => {
      // Liste des emails admin (même logique que dans le layout admin)
      const adminEmails = ['allouhugo@gmail.com'];
      const isAdminByEmail = adminEmails.includes(userEmail?.toLowerCase() || '');

      if (isAdminByEmail) {
        setIsAdmin(true);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Erreur récupération profil:', error);
          setIsAdmin(false);
          return;
        }

        const isAdminUser = profile?.role === 'admin';
        setIsAdmin(isAdminUser);
      } catch (err) {
        console.error('Exception fetchRole:', err);
        setIsAdmin(false);
      }
    };

    const syncUser = async (nextUser: SupabaseUser | null) => {
      setUser(nextUser);
      if (nextUser) {
        await fetchRole(nextUser.id, nextUser.email);
      } else {
        setIsAdmin(false);
      }
    };

    const init = async () => {
      // Utiliser getUser() qui vérifie avec le serveur - plus fiable que getSession()
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Header init getUser error:', error.message);
      }
      
      await syncUser(user ?? null);
    };
    void init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Synchroniser l'utilisateur sur tous les événements d'auth
      await syncUser(session?.user ?? null);
    });

    // Également écouter les changements de visibilité de la page
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const { data: { user } } = await supabase.auth.getUser();
        await syncUser(user);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Et le focus de la fenêtre
    const handleFocus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      await syncUser(user);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loggingOut) return;
    setLoggingOut(true);
    setAccountMenuOpen(false);

    try {
      // Appel explicite à l'API REST de Supabase pour supprimer le cookie httpOnly côté serveur
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        },
        credentials: 'include',
      });

      // Nettoyer manuellement le localStorage (où Supabase stocke la session)
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Mettre à jour l'état
      setUser(null);
      setIsAdmin(false);

    } catch (error) {
      console.error('Exception déconnexion:', error);
    }

    // Toujours rediriger à la fin
    window.location.href = '/';
  };

  const toggle = () => setOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="w-full px-3 sm:px-5 lg:px-6">
        <div className="flex items-center py-0 gap-4">
          {/* Logo à gauche */}
          <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo/Logo1.png"
            alt="Atelier LBF Logo"
            width={1400}
            height={500}
            className="w-auto max-h-20 sm:max-h-24"
            style={{ objectFit: "contain" }}
            priority
          />
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
                      className="relative mx-6 flex items-center"
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
                          "nav-link-hover text-[0.85rem] font-semibold uppercase tracking-[0.25em] transition relative pb-1 inline-flex items-center",
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
          <div className="flex items-center gap-6 mr-24">
            {/* Favoris */}
            <Link href="/favoris" className="hidden md:flex flex-col items-center text-slate-700 hover:text-slate-900 transition">
              <span className="relative">
                <Heart size={22} />
                {favoriteCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#ff5751] px-1.5 text-[10px] font-semibold text-white">
                    {favoriteCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] uppercase tracking-wide mt-1">Mes Favoris</span>
            </Link>

            {/* Mon Compte */}
            <div 
              className="hidden md:flex flex-col items-center text-slate-700 hover:text-slate-900 transition relative cursor-pointer"
              onMouseEnter={() => {
                if (accountTimer.current) clearTimeout(accountTimer.current);
                setAccountMenuOpen(true);
              }}
              onMouseLeave={() => {
                if (accountTimer.current) clearTimeout(accountTimer.current);
                accountTimer.current = setTimeout(() => setAccountMenuOpen(false), 250);
              }}
            >
              <User size={22} />
              <span className="text-[10px] uppercase tracking-wide mt-1">Mon Compte</span>
              
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
                    <button
                      onMouseDown={handleLogout}
                      disabled={loggingOut}
                      className="px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 w-full text-left disabled:opacity-50 cursor-pointer"
                    >
                      <LogOut size={16} />
                      {loggingOut ? 'Déconnexion...' : 'Déconnexion'}
                    </button>
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
            <Link href="/panier" className="hidden md:flex flex-col items-center text-slate-700 hover:text-slate-900 transition">
              <span className="relative">
                <ShoppingBag size={22} />
                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#ff5751] px-1.5 text-[10px] font-semibold text-white">
                    {itemCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] uppercase tracking-wide mt-1">Panier</span>
            </Link>

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
            {user && isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm font-semibold text-amber-700"
              >
                Dashboard Admin
              </Link>
            )}
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
