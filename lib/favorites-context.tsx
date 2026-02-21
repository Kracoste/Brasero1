'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';

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
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [guestFavorites, setGuestFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef(createClient());
  const prevUserIdRef = useRef<string | null>(null);

  // Initialiser les favoris invités au montage
  useEffect(() => {
    const guestFavs = readGuestFavorites();
    setGuestFavorites(guestFavs);
    setLoading(false);
  }, []);

  // Synchroniser avec Supabase quand l'utilisateur change (via useAuth)
  useEffect(() => {
    const currentUserId = user?.id ?? null;
    const prevUserId = prevUserIdRef.current;

    // Même utilisateur, pas besoin de re-sync
    if (currentUserId === prevUserId) return;
    prevUserIdRef.current = currentUserId;

    if (currentUserId) {
      const loadFavorites = async () => {
        try {
          const supabase = supabaseRef.current;
          const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && data) {
            setFavorites(data);
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      };
      loadFavorites();
    } else {
      setFavorites([]);
      setGuestFavorites(readGuestFavorites());
    }
  }, [user]);

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
    const supabase = supabaseRef.current;
    
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
    const supabase = supabaseRef.current;
    
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
    try {
      if (isFavorite(product.slug)) {
        await removeFavorite(product.slug);
      } else {
        await addFavorite(product);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Fallback sur localStorage en cas d'erreur
      const newGuestFavorites = new Set(guestFavorites);
      if (newGuestFavorites.has(product.slug)) {
        newGuestFavorites.delete(product.slug);
      } else {
        newGuestFavorites.add(product.slug);
      }
      setGuestFavorites(newGuestFavorites);
      persistGuestFavorites(newGuestFavorites);
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
