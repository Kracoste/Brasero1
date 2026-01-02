'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useAnalytics } from '@/lib/analytics-context';
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react';
import { AddToFavoritesButton } from "@/components/AddToFavoritesButton";

type SelectedAccessory = {
  slug: string;
  name: string;
  price: number;
  images?: any[];
};

type AddToCartButtonProps = {
  product: {
    slug: string;
    name: string;
    price: number;
    images: { src: string }[];
    onDemand?: boolean;
  };
  selectedAccessories?: SelectedAccessory[];
  className?: string;
};

export function AddToCartButton({ product, selectedAccessories = [], className = '' }: AddToCartButtonProps) {
  const { addItem, totalPrice: cartTotal, itemCount: cartItemsCount } = useCart();
  const { trackAddToCart } = useAnalytics();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Si le produit est sur demande, afficher uniquement le message
  if (product.onDemand) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="rounded-lg bg-amber-50 border-2 border-amber-300 p-6 text-center">
          <h3 className="text-xl font-bold text-amber-900 mb-3">Produit sur demande</h3>
          <p className="text-amber-800 mb-4">
            Ce produit n'est pas disponible à l'achat en ligne.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-semibold shadow-lg transition bg-gradient-to-br from-[#8B4513] to-[#CD853F] text-white hover:brightness-110"
          >
            Demander un devis
          </a>
        </div>
        <AddToFavoritesButton product={product} size="compact" />
      </div>
    );
  }

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

      // Ajouter les accessoires sélectionnés
      if (selectedAccessories.length > 0) {
        for (const accessory of selectedAccessories) {
          await addItem(
            {
              slug: accessory.slug,
              name: accessory.name,
              price: accessory.price,
              image: accessory.images?.[0]?.src || '',
            },
            1
          );
          // Tracker l'ajout de chaque accessoire
          trackAddToCart(
            { slug: accessory.slug, name: accessory.name, price: accessory.price },
            1
          );
        }
      }

      // Tracker l'ajout au panier du produit principal
      trackAddToCart(
        { slug: product.slug, name: product.name, price: product.price },
        quantity,
        { total: cartTotal + (product.price * quantity), itemsCount: cartItemsCount + quantity }
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
