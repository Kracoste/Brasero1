'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export type FavoriteItem = {
  id: string;
  user_id: string;
  product_slug: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  created_at: string;
};

type FavoritesContextType = {
  favorites: FavoriteItem[];
  loading: boolean;
  favoriteCount: number;
  isFavorite: (productSlug: string) => boolean;
  addFavorite: (product: {
    slug: string;
    name: string;
    price: number;
    image?: string;
  }) => Promise<void>;
  removeFavorite: (productSlug: string) => Promise<void>;
  toggleFavorite: (product: {
    slug: string;
    name: string;
    price: number;
    image?: string;
  }) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const LOCAL_FAVORITES_KEY = 'brasero:favorites';

const readGuestFavorites = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(LOCAL_FAVORITES_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

const persistGuestFavorites = (slugs: Set<string>) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(Array.from(slugs)));
};

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [guestFavorites, setGuestFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  useEffect(() => {
    // Ne pas exécuter si supabase n'est pas disponible (SSR/build)
    if (!supabase) {
      setLoading(false);
      return;
    }

    const initFavorites = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          await loadFavorites();
        } else {
          const guestFavs = readGuestFavorites();
          setGuestFavorites(guestFavs);
        }
      } catch (error) {
        console.error('Error initializing favorites:', error);
        setGuestFavorites(readGuestFavorites());
      } finally {
        setLoading(false);
      }
    };

    initFavorites();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      if (newUser) {
        await loadFavorites();
      } else {
        setFavorites([]);
        setGuestFavorites(readGuestFavorites());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const isFavorite = (productSlug: string): boolean => {
    if (user) {
      return favorites.some(fav => fav.product_slug === productSlug);
    }
    return guestFavorites.has(productSlug);
  };

  const addFavorite = async (product: {
    slug: string;
    name: string;
    price: number;
    image?: string;
  }) => {
    if (!user) {
      // Mode invité - localStorage
      const newGuestFavorites = new Set(guestFavorites);
      newGuestFavorites.add(product.slug);
      setGuestFavorites(newGuestFavorites);
      persistGuestFavorites(newGuestFavorites);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_slug: product.slug,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image || null,
        })
        .select()
        .single();

      if (error) throw error;

      setFavorites(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding favorite:', error);
      // Fallback sur localStorage
      const newGuestFavorites = new Set(guestFavorites);
      newGuestFavorites.add(product.slug);
      setGuestFavorites(newGuestFavorites);
      persistGuestFavorites(newGuestFavorites);
    }
  };

  const removeFavorite = async (productSlug: string) => {
    if (!user) {
      // Mode invité - localStorage
      const newGuestFavorites = new Set(guestFavorites);
      newGuestFavorites.delete(productSlug);
      setGuestFavorites(newGuestFavorites);
      persistGuestFavorites(newGuestFavorites);
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_slug', productSlug);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.product_slug !== productSlug));
    } catch (error) {
      console.error('Error removing favorite:', error);
      // Fallback sur localStorage
      const newGuestFavorites = new Set(guestFavorites);
      newGuestFavorites.delete(productSlug);
      setGuestFavorites(newGuestFavorites);
      persistGuestFavorites(newGuestFavorites);
    }
  };

  const toggleFavorite = async (product: {
    slug: string;
    name: string;
    price: number;
    image?: string;
  }) => {
    if (isFavorite(product.slug)) {
      await removeFavorite(product.slug);
    } else {
      await addFavorite(product);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        favoriteCount: user ? favorites.length : guestFavorites.size,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
