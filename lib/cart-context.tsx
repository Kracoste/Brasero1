'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export type CartItem = {
  id: string;
  product_slug: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const syncGuestCart = (updater: (items: CartItem[]) => CartItem[]) => {
    setItems(prev => {
      const next = updater(prev);
      persistGuestCart(next);
      return next;
    });
  };

  const addGuestItem = (
    product: { slug: string; name: string; price: number; image?: string },
    quantity: number,
  ) => {
    syncGuestCart(prev => {
      const existing = prev.find(
        (item) => isGuestItem(item) && item.product_slug === product.slug,
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      const newItem: CartItem = {
        id: generateGuestId(product.slug),
        product_slug: product.slug,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image || null,
        quantity,
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

  const clearGuestCart = () => {
    syncGuestCart(() => []);
  };

  // Calculer le nombre total d'articles
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculer le prix total
  const totalPrice = items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

  // Charger immédiatement le panier local, puis synchroniser avec Supabase
  useEffect(() => {
    // Charger immédiatement le panier local (ultra rapide)
    const guestItems = readGuestCart();
    setItems(guestItems);
    setLoading(false); // Afficher le panier immédiatement
    
    // Ensuite, synchroniser avec Supabase en arrière-plan
    const syncWithSupabase = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (currentUser) {
          // Utilisateur connecté - charger son panier depuis la DB
          const cartFromDb = await loadCart(currentUser.id);
          // Si l'utilisateur a des items guest, les migrer vers la DB
          if (guestItems.length > 0 && cartFromDb) {
            // Migrer les items guest vers le panier DB
            for (const guestItem of guestItems) {
              try {
                await supabase.from('cart_items').insert({
                  cart_id: cartFromDb,
                  product_slug: guestItem.product_slug,
                  product_name: guestItem.product_name,
                  product_price: guestItem.product_price,
                  product_image: guestItem.product_image,
                  quantity: guestItem.quantity,
                });
              } catch {
                // Ignorer les erreurs de migration
              }
            }
            // Vider le panier local après migration
            persistGuestCart([]);
            // Recharger le panier depuis la DB
            await loadCart(currentUser.id);
          }
        }
      } catch (error) {
        console.error('Error syncing cart:', error);
        // En cas d'erreur, on garde le panier local
      }
    };

    syncWithSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      if (newUser) {
        await loadCart(newUser.id);
      } else {
        setItems(readGuestCart());
        setCartId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Charger le panier depuis la base de données
  const loadCart = async (userId: string) => {
    try {
      // Récupérer ou créer le panier
      let { data: cart, error: cartError } = await supabase
        .from('cart')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (cartError && cartError.code === 'PGRST116') {
        // Le panier n'existe pas, le créer
        const { data: newCart, error: createError } = await supabase
          .from('cart')
          .insert({ user_id: userId })
          .select('id')
          .single();

        if (createError) throw createError;
        cart = newCart;
      }

      if (!cart) return null;

      setCartId(cart.id);

      // Charger les articles du panier
      const { data: cartItems, error: itemsError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id);

      if (itemsError) throw itemsError;

      setItems(cartItems || []);
      return cart.id as string;
    } catch (error) {
      console.error('Error loading cart:', error);
      return null;
    }
  };

  // Ajouter un article au panier
  const addItem = async (
    product: { slug: string; name: string; price: number; image?: string },
    quantity: number = 1
  ) => {
    // Toujours ajouter d'abord localement pour une réponse instantanée
    addGuestItem(product, quantity);
    
    // Si l'utilisateur est connecté, synchroniser avec la DB en arrière-plan
    if (user) {
      const ensuredCartId = cartId ?? (await loadCart(user.id));
      if (ensuredCartId) {
        try {
          const existingItem = items.find(
            item => !isGuestItem(item) && item.product_slug === product.slug
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
          console.error('Error syncing item to DB:', error);
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
      console.error('Error updating quantity:', error);
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
      console.error('Error removing item:', error);
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
        console.error('Error clearing cart in DB:', error);
        // Pas de throw, on a déjà vidé localement
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
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
