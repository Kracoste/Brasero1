'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { AddToFavoritesButton } from "@/components/AddToFavoritesButton";
import { accessoires } from "@/content/products";

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

  const readSelectedAccessories = () => {
    if (typeof window === "undefined") return new Set<string>();
    try {
      const raw = window.localStorage.getItem("brasero:selected-accessories");
      if (!raw) return new Set<string>();
      const parsed = JSON.parse(raw);
      return new Set(Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : []);
    } catch {
      return new Set<string>();
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const selectedAccessories = readSelectedAccessories();
      const accessoriesToAdd = accessoires.filter(
        (acc) => selectedAccessories.has(acc.slug) && acc.slug !== product.slug
      );

      for (const acc of accessoriesToAdd) {
        await addItem(
          {
            slug: acc.slug,
            name: acc.name,
            price: acc.price,
            image: acc.images[0]?.src,
          },
          1
        );
      }

      await addItem(
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0]?.src,
        },
        quantity
      );
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
        <AddToFavoritesButton product={product} size="compact" className="shrink-0 border-slate-300 bg-white text-slate-700 hover:border-red-500 hover:text-red-500" />
      </div>

      {/* Bouton Ajouter au panier */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={adding || added}
        className={`flex items-center justify-center gap-2 rounded-md px-6 py-3 font-semibold text-white shadow-lg transition ${
          added
            ? "bg-emerald-600 hover:bg-emerald-700"
            : "bg-gradient-to-r from-[#e6f4e6] via-[#6fbf73] to-[#2f6f3a] hover:brightness-110"
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
