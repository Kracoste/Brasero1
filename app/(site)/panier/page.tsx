'use client';

import { useCart } from '@/lib/cart-context';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { Price } from '@/components/Price';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function PanierPage() {
  const { items, itemCount, totalPrice, loading, updateQuantity, removeItem, clearCart } = useCart();

  if (loading) {
    return (
      <Section className="py-24">
        <Container>
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-clay-900 border-t-transparent"></div>
          </div>
        </Container>
      </Section>
    );
  }

  if (items.length === 0) {
    return (
      <Section className="py-24">
        <Container className="max-w-2xl text-center">
          <div className="rounded-3xl border border-slate-700 bg-black p-12">
            <ShoppingBag size={64} className="mx-auto mb-6 text-slate-300" />
            <h1 className="font-display text-3xl font-semibold text-clay-900">
              Votre panier est vide
            </h1>
            <p className="mt-4 text-slate-400">
              Découvrez nos braséros et ajoutez-en à votre panier pour commencer.
            </p>
            <Link
              href="/produits"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-clay-900 px-6 py-3 font-semibold text-white hover:bg-clay-800"
            >
              Découvrir nos produits
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="py-24">
      <Container className="max-w-5xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold text-clay-900">Mon panier</h1>
              <p className="mt-2 text-slate-400">
                {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Vider le panier
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Liste des articles */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-slate-700 bg-black p-4 shadow-sm"
                >
                  {/* Image du produit */}
                  <Link
                    href={`/produits/${item.product_slug}`}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900"
                  >
                    {item.product_image && (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-contain p-2"
                      />
                    )}
                  </Link>

                  {/* Informations du produit */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/produits/${item.product_slug}`}
                        className="font-semibold text-clay-900 hover:text-clay-700"
                      >
                        {item.product_name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-400">
                        <Price amount={item.product_price} /> / unité
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Sélecteur de quantité */}
                      <div className="flex items-center rounded-lg border border-slate-300 bg-black">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 transition hover:bg-slate-900"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={14} className="text-slate-400" />
                        </button>
                        <span className="min-w-[2.5rem] px-3 text-center text-sm font-semibold text-clay-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 transition hover:bg-slate-900"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={14} className="text-slate-400" />
                        </button>
                      </div>

                      {/* Prix total de la ligne */}
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-clay-900">
                          <Price amount={item.product_price * item.quantity} />
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé de la commande */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4 rounded-2xl border border-slate-700 bg-black p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-clay-900">Résumé de la commande</h2>

                <div className="space-y-2 border-t border-slate-700 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Sous-total</span>
                    <Price amount={totalPrice} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Livraison</span>
                    <span className="text-slate-400">Calculée à l'étape suivante</span>
                  </div>
                </div>

                <div className="flex justify-between border-t border-slate-700 pt-4 text-lg font-bold">
                  <span className="text-clay-900">Total</span>
                  <Price amount={totalPrice} className="text-clay-900" />
                </div>

                <button className="w-full rounded-full bg-clay-900 px-6 py-3 font-semibold text-white hover:bg-clay-800">
                  Passer la commande
                </button>

                <Link
                  href="/produits"
                  className="block text-center text-sm font-medium text-slate-400 hover:text-clay-900"
                >
                  ← Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
