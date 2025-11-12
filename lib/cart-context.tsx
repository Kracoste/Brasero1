'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const supabase = createClient();

  // Calculer le nombre total d'articles
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculer le prix total
  const totalPrice = items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

  // Charger l'utilisateur et le panier
  useEffect(() => {
    const initCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        await loadCart(user.id);
      }
      setLoading(false);
    };

    initCart();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      if (newUser) {
        await loadCart(newUser.id);
      } else {
        setItems([]);
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

      if (!cart) return;

      setCartId(cart.id);

      // Charger les articles du panier
      const { data: cartItems, error: itemsError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', cart.id);

      if (itemsError) throw itemsError;

      setItems(cartItems || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  // Ajouter un article au panier
  const addItem = async (
    product: { slug: string; name: string; price: number; image?: string },
    quantity: number = 1
  ) => {
    if (!user || !cartId) {
      // Rediriger vers la connexion
      window.location.href = '/connexion';
      return;
    }

    try {
      // Vérifier si l'article existe déjà
      const existingItem = items.find(item => item.product_slug === product.slug);

      if (existingItem) {
        // Mettre à jour la quantité
        const newQuantity = existingItem.quantity + quantity;
        await updateQuantity(existingItem.id, newQuantity);
      } else {
        // Ajouter un nouvel article
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cartId,
            product_slug: product.slug,
            product_name: product.name,
            product_price: product.price,
            product_image: product.image || null,
            quantity,
          })
          .select()
          .single();

        if (error) throw error;

        setItems([...items, data]);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  // Mettre à jour la quantité d'un article
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  // Supprimer un article du panier
  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  };

  // Vider le panier
  const clearCart = async () => {
    if (!cartId) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
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
