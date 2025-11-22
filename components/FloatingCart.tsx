'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Price } from './Price';

export function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, itemCount, totalPrice, removeItem } = useCart();

  if (itemCount === 0) {
    return null; // Ne rien afficher si le panier est vide
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-clay-900 text-white shadow-2xl transition hover:scale-110 hover:bg-clay-800"
        aria-label="Ouvrir le panier"
      >
        <ShoppingCart size={24} />
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
          {itemCount}
        </span>
      </button>

      {/* Panneau du panier */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panneau coulissant */}
          <div className="fixed bottom-0 right-0 z-50 flex h-[80vh] w-full flex-col bg-black shadow-2xl sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700 p-4">
              <div>
                <h3 className="font-semibold text-clay-900">Mon panier</h3>
                <p className="text-sm text-slate-400">
                  {itemCount} article{itemCount > 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 transition hover:bg-slate-800"
                aria-label="Fermer"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Liste des articles */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-lg border border-slate-700 bg-slate-900 p-3"
                  >
                    {/* Image */}
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-black">
                      {item.product_image && (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-contain p-1"
                        />
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/produits/${item.product_slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-semibold text-clay-900 hover:text-clay-700"
                        >
                          {item.product_name}
                        </Link>
                        <p className="text-xs text-slate-400">
                          Quantité: {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Price
                          amount={item.product_price * item.quantity}
                          className="text-sm font-bold text-clay-900"
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer avec total et bouton */}
            <div className="border-t border-slate-700 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold text-clay-900">Total</span>
                <Price amount={totalPrice} className="text-xl font-bold text-clay-900" />
              </div>
              <Link
                href="/panier"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-full bg-clay-900 py-3 text-center font-semibold text-white transition hover:bg-clay-800"
              >
                Voir le panier complet
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
