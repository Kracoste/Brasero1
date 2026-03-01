'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';

const isDev = process.env.NODE_ENV === 'development';
function devWarn(msg: string, ...args: unknown[]) { if (isDev) console.warn(msg, ...args); }

export type CartItem = {
  id: string;
  product_slug: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  variant_label?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  loading: boolean;
  addItem: (product: {
    slug: string;
    name: string;
    price: number;
    image?: string;
    variantLabel?: string;
  }, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const LOCAL_CART_KEY = 'brasero:guest-cart';

const readGuestCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === 'object' && item !== null) as CartItem[];
    }
    return [];
  } catch {
    return [];
  }
};

const persistGuestCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
};

const generateGuestId = (slug: string) =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `guest-${slug}-${Date.now()}`;

const isGuestItem = (item: CartItem) => item.id.startsWith('guest-');

// Limite de sécurité pour éviter les abus
const MAX_CART_ITEMS = 50;
const MAX_QUANTITY_PER_ITEM = 99;

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const prevUserIdRef = useRef<string | null>(null);
  const syncGuestCart = (updater: (items: CartItem[]) => CartItem[]) => {
    setItems(prev => {
      const next = updater(prev);
      // Limiter le nombre d'items dans le panier
      const limitedNext = next.slice(0, MAX_CART_ITEMS).map(item => ({
        ...item,
        quantity: Math.min(item.quantity, MAX_QUANTITY_PER_ITEM)
      }));
      persistGuestCart(limitedNext);
      return limitedNext;
    });
  };

  const addGuestItem = (
    product: { slug: string; name: string; price: number; image?: string; variantLabel?: string },
    quantity: number,
  ) => {
    syncGuestCart(prev => {
      // Vérifier si on a atteint la limite
      if (prev.length >= MAX_CART_ITEMS) {
        devWarn('Limite du panier atteinte');
        return prev;
      }

      // Identifier par slug + variante (deux tailles différentes = deux lignes)
      const itemKey = product.variantLabel 
        ? `${product.slug}::${product.variantLabel}` 
        : product.slug;
      const existing = prev.find(
        (item) => isGuestItem(item) && `${item.product_slug}${item.variant_label ? `::${item.variant_label}` : ''}` === itemKey,
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id 
            ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QUANTITY_PER_ITEM) } 
            : item,
        );
      }
      const newItem: CartItem = {
        id: generateGuestId(product.slug),
        product_slug: product.slug,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image || null,
        variant_label: product.variantLabel || undefined,
        quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM),
      };
      return [...prev, newItem];
    });
  };

  const updateGuestItem = (itemId: string, quantity: number) => {
    syncGuestCart(prev =>
      prev
        .map((item) => (item.id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeGuestItem = (itemId: string) => {
    syncGuestCart(prev => prev.filter((item) => item.id !== itemId));
  };

  // Calculer le nombre total d'articles
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculer le prix total
  const totalPrice = items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

  // Charger immédiatement le panier local au montage
  useEffect(() => {
    const guestItems = readGuestCart();
    setItems(guestItems);
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
      // Utilisateur connecté - charger son panier depuis la DB
      const guestItems = readGuestCart();
      const syncCart = async () => {
        try {
          const cartFromDb = await loadCart(currentUserId);
          // Si l'utilisateur a des items guest, les migrer vers la DB en batch
          if (guestItems.length > 0 && cartFromDb) {
            try {
              await supabase.from('cart_items').insert(
                guestItems.map(item => ({
                  cart_id: cartFromDb,
                  product_slug: item.product_slug,
                  product_name: item.product_name,
                  product_price: item.product_price,
                  product_image: item.product_image,
                  quantity: item.quantity,
                }))
              );
            } catch {
              // Ignorer les erreurs de migration
            }
            persistGuestCart([]);
            await loadCart(currentUserId);
          }
        } catch (error) {
          devWarn('Error syncing cart:', error);
        }
      };
      syncCart();
    } else {
      // Déconnecté - revenir au panier local
      setItems(readGuestCart());
      setCartId(null);
    }
  }, [user]);

  // Charger le panier depuis la base de données
  const loadCart = async (userId: string) => {
    try {
      // Récupérer ou créer le panier
      const { data: existingCart, error: cartError } = await supabase
        .from('cart')
        .select('id')
        .eq('user_id', userId)
        .single();

      let cart = existingCart;

      if (cartError) {
        if (cartError.code === 'PGRST116') {
          // Le panier n'existe pas, le créer
          const { data: newCart, error: createError } = await supabase
            .from('cart')
            .insert({ user_id: userId })
            .select('id')
            .single();

          if (createError) throw createError;
          cart = newCart;
        } else {
          // Autre erreur (RLS, réseau, etc.) — on ne crash pas
          throw cartError;
        }
      }

      if (!cart) return null;

      setCartId(cart.id);

      // Charger les articles du panier
      const { data: cartItems, error: itemsError } = await supabase
        .from('cart_items')
        .select('id, product_slug, product_name, product_price, product_image, variant_label, quantity')
        .eq('cart_id', cart.id);

      if (itemsError) throw itemsError;

      setItems(cartItems || []);
      return cart.id as string;
    } catch (error) {
      devWarn('Error loading cart:', error);
      return null;
    }
  };

  // Ajouter un article au panier
  const addItem = async (
    product: { slug: string; name: string; price: number; image?: string; variantLabel?: string },
    quantity: number = 1,
  ) => {
    // Toujours ajouter d'abord localement pour une réponse instantanée
    addGuestItem(product, quantity);
    
    // Si l'utilisateur est connecté, synchroniser avec la DB en arrière-plan
    if (user) {
      const ensuredCartId = cartId ?? (await loadCart(user.id));
      if (ensuredCartId) {
        try {
          // Identifier par slug + variante
          const itemKey = product.variantLabel 
            ? `${product.slug}::${product.variantLabel}` 
            : product.slug;
          const existingItem = items.find(
            item => !isGuestItem(item) && 
              `${item.product_slug}${item.variant_label ? `::${item.variant_label}` : ''}` === itemKey
          );

          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            await supabase
              .from('cart_items')
              .update({ quantity: newQuantity })
              .eq('id', existingItem.id);
          } else {
            await supabase
              .from('cart_items')
              .insert({
                cart_id: ensuredCartId,
                product_slug: product.slug,
                product_name: product.name,
                product_price: product.price,
                product_image: product.image || null,
                quantity,
              });
          }
          // Recharger le panier depuis la DB pour synchroniser
          await loadCart(user.id);
        } catch (error) {
          devWarn('Error syncing item to DB:', error);
          // L'item est déjà dans le panier local, donc pas de problème
        }
      }
    }
  };

  // Mettre à jour la quantité d'un article
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    if (!user) {
      updateGuestItem(itemId, quantity);
      return;
    }

    const ensuredCartId = cartId ?? (await loadCart(user.id));
    if (!ensuredCartId) {
      updateGuestItem(itemId, quantity);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev =>
        prev.map(item => (item.id === itemId ? { ...item, quantity } : item))
      );
    } catch (error) {
      devWarn('Error updating quantity:', error);
      updateGuestItem(itemId, quantity);
      throw error;
    }
  };

  // Supprimer un article du panier
  const removeItem = async (itemId: string) => {
    if (!user) {
      removeGuestItem(itemId);
      return;
    }

    const ensuredCartId = cartId ?? (await loadCart(user.id));
    if (!ensuredCartId) {
      removeGuestItem(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      devWarn('Error removing item:', error);
      removeGuestItem(itemId);
      throw error;
    }
  };

  // Vider le panier
  const clearCart = async () => {
    // Toujours vider localement d'abord pour une réponse instantanée
    setItems([]);
    persistGuestCart([]);
    
    if (!user) {
      return;
    }

    const ensuredCartId = cartId ?? (await loadCart(user.id));
    if (!ensuredCartId) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', ensuredCartId);

      if (error) {
        devWarn('Error clearing cart in DB:', error);
        // Pas de throw, on a déjà vidé localement
      }
    } catch (error) {
      devWarn('Error clearing cart:', error);
      // Pas de throw, on a déjà vidé localement
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
