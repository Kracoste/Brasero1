'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { AddToFavoritesButton } from "@/components/AddToFavoritesButton";
import { createClient } from '@/lib/supabase/client';

const SELECTED_ACCESSORIES_KEY = "brasero:selected-accessories";

const readSelectedAccessories = (): Set<string> => {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.localStorage.getItem(SELECTED_ACCESSORIES_KEY);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : []);
  } catch {
    return new Set<string>();
  }
};

const clearSelectedAccessories = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SELECTED_ACCESSORIES_KEY);
};

type AddToCartButtonProps = {
  product: {
    slug: string;
    name: string;
    price: number;
    images: { src: string }[];
  };
  className?: string;
};

export function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [accessoriesData, setAccessoriesData] = useState<Map<string, { name: string; price: number; image: string }>>(new Map());

  // Charger les données des accessoires depuis Supabase
  useEffect(() => {
    const loadAccessories = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('slug, name, price, images')
        .eq('category', 'accessoire');
      
      if (data) {
        const map = new Map<string, { name: string; price: number; image: string }>();
        data.forEach((p: any) => {
          map.set(p.slug, {
            name: p.name,
            price: p.price,
            image: p.images?.[0]?.src || '',
          });
        });
        setAccessoriesData(map);
      }
    };
    loadAccessories();
  }, []);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      // Ajouter le produit principal
      await addItem(
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0]?.src,
        },
        quantity
      );

      // Récupérer et ajouter les accessoires sélectionnés
      const selectedAccessories = readSelectedAccessories();
      for (const slug of selectedAccessories) {
        const accessory = accessoriesData.get(slug);
        if (accessory) {
          await addItem(
            {
              slug,
              name: accessory.name,
              price: accessory.price,
              image: accessory.image,
            },
            1
          );
        }
      }

      // Effacer les accessoires sélectionnés après ajout
      clearSelectedAccessories();

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Sélecteur de quantité + Favoris */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">Quantité :</span>
          <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 transition hover:bg-slate-100"
              aria-label="Diminuer la quantité"
            >
              <Minus size={16} className="text-slate-500" />
            </button>
            <span className="min-w-[3rem] px-4 text-center font-semibold text-clay-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 transition hover:bg-slate-100"
              aria-label="Augmenter la quantité"
            >
              <Plus size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
        <AddToFavoritesButton product={product} size="compact" />
      </div>

      {/* Bouton Ajouter au panier */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={adding || added}
        className={`flex items-center justify-center gap-2 rounded-md px-6 py-3 font-semibold shadow-lg transition ${
          added
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {added ? (
          <>
            <Check size={20} />
            <span>Ajouté au panier !</span>
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            <span>{adding ? 'Ajout...' : 'Ajouter au panier'}</span>
          </>
        )}
      </button>
    </div>
  );
}
