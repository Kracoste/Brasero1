'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { Price } from '@/components/Price';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type CheckoutForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
};

type CheckoutStep = 'review' | 'details' | 'payment';

const emptyCheckoutForm: CheckoutForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  postal_code: '',
  city: '',
  country: 'France',
};

export default function PanierPage() {
  const { items, itemCount, totalPrice, loading, updateQuantity, removeItem, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('review');
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>(emptyCheckoutForm);
  const [profileLoading, setProfileLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const prefillFromProfile = async () => {
      setProfileLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name,last_name,phone,address,postal_code,city,country')
          .eq('id', user.id)
          .single();

        setCheckoutForm((prev) => ({
          ...prev,
          email: user.email ?? prev.email,
          first_name: profile?.first_name ?? prev.first_name,
          last_name: profile?.last_name ?? prev.last_name,
          phone: profile?.phone ?? prev.phone,
          address: profile?.address ?? prev.address,
          postal_code: profile?.postal_code ?? prev.postal_code,
          city: profile?.city ?? prev.city,
          country: profile?.country ?? prev.country,
        }));
      }

      setProfileLoading(false);
    };

    prefillFromProfile();
  }, [supabase]);

  const handleInputChange = (field: keyof CheckoutForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckoutForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const startCheckout = () => {
    setCheckoutStep('details');
  };

  const handleCheckoutSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !checkoutForm.first_name ||
      !checkoutForm.last_name ||
      !checkoutForm.email ||
      !checkoutForm.address ||
      !checkoutForm.postal_code ||
      !checkoutForm.city
    ) {
      setFormError('Merci de renseigner tous les champs obligatoires.');
      return;
    }

    setFormError(null);
    setCheckoutStep('payment');
  };

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
          <ShoppingBag size={64} className="mx-auto mb-6 text-slate-400" />
          <h1 className="font-display text-3xl font-semibold text-slate-900">
            Votre panier est vide
          </h1>
          <p className="mt-4 text-slate-600">
            Découvrez nos braséros et ajoutez-en à votre panier pour commencer.
          </p>
          <Link
            href="/produits"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-clay-900 px-6 py-3 font-semibold text-white hover:bg-clay-800"
          >
            Découvrir nos produits
          </Link>
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
              <h1 className="font-display text-3xl font-semibold text-slate-900">Mon panier</h1>
              <p className="mt-2 text-slate-600">
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
                  className="flex gap-4 rounded-2xl p-4"
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
                      <Link href={`/produits/${item.product_slug}`} className="font-semibold text-clay-900 hover:text-clay-700">
                        {item.product_name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">
                        <Price amount={item.product_price} /> / unité
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Sélecteur de quantité */}
                      <div className="flex items-center rounded-lg border border-slate-300 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 transition hover:bg-slate-100"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={14} className="text-slate-500" />
                        </button>
                        <span className="min-w-[2.5rem] px-3 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 transition hover:bg-slate-100"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={14} className="text-slate-500" />
                        </button>
                      </div>

                      {/* Prix total de la ligne */}
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-slate-900">
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
              <div className="sticky top-24 space-y-4 p-0">
                <h2 className="text-lg font-semibold text-slate-900">Résumé de la commande</h2>

                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Sous-total</span>
                    <Price amount={totalPrice} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Livraison</span>
                    <span className="text-slate-500">Calculée à l'étape suivante</span>
                  </div>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold">
                  <span className="text-slate-900">Total</span>
                  <Price amount={totalPrice} className="text-slate-900" />
                </div>

                {checkoutStep === 'review' && (
                  <button
                    className="w-full rounded-full bg-clay-900 px-6 py-3 font-semibold text-white hover:bg-clay-800"
                    onClick={startCheckout}
                  >
                    Je passe ma commande
                  </button>
                )}

                {checkoutStep === 'details' && (
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="text-base font-semibold text-slate-900">Mes informations</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {profileLoading
                        ? 'Chargement de vos informations...'
                        : "Vérifiez vos coordonnées ou complétez-les pour finaliser votre commande."}
                    </p>

                    <form className="mt-4 space-y-3" onSubmit={handleCheckoutSubmit}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-700">
                          Prénom *
                          <input
                            type="text"
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            value={checkoutForm.first_name}
                            onChange={handleInputChange('first_name')}
                            required
                          />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                          Nom *
                          <input
                            type="text"
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            value={checkoutForm.last_name}
                            onChange={handleInputChange('last_name')}
                            required
                          />
                        </label>
                      </div>

                      <label className="text-sm font-medium text-slate-700">
                        Email *
                        <input
                          type="email"
                          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                          value={checkoutForm.email}
                          onChange={handleInputChange('email')}
                          required
                        />
                      </label>

                      <label className="text-sm font-medium text-slate-700">
                        Téléphone
                        <input
                          type="tel"
                          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                          value={checkoutForm.phone}
                          onChange={handleInputChange('phone')}
                        />
                      </label>

                      <label className="text-sm font-medium text-slate-700">
                        Adresse complète *
                        <input
                          type="text"
                          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                          value={checkoutForm.address}
                          onChange={handleInputChange('address')}
                          required
                        />
                      </label>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-700">
                          Code postal *
                          <input
                            type="text"
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            value={checkoutForm.postal_code}
                            onChange={handleInputChange('postal_code')}
                            required
                          />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                          Ville *
                          <input
                            type="text"
                            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            value={checkoutForm.city}
                            onChange={handleInputChange('city')}
                            required
                          />
                        </label>
                      </div>

                      <label className="text-sm font-medium text-slate-700">
                        Pays
                        <input
                          type="text"
                          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                          value={checkoutForm.country}
                          onChange={handleInputChange('country')}
                        />
                      </label>

                      {formError && <p className="text-sm text-red-600">{formError}</p>}

                      <button
                        type="submit"
                        className="w-full rounded-full bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500"
                      >
                        Continuer vers le paiement
                      </button>
                    </form>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Paiement</p>
                    <p className="mt-1">
                      Merci ! Vos informations sont enregistrées. L’intégration des modes de paiement arrive dans la prochaine étape.
                    </p>
                  </div>
                )}

                <Link
                  href="/produits"
                  className="block text-center text-sm font-medium text-slate-600 hover:text-clay-900"
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
