'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ShoppingBag, Loader2 } from 'lucide-react';

import { useCart } from '@/lib/cart-context';
import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import { Price } from '@/components/Price';
import { createClient } from '@/lib/supabase/client';

type CheckoutForm = {
  alias: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line2: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
};

const emptyCheckoutForm: CheckoutForm = {
  alias: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address_line2: '',
  address: '',
  postal_code: '',
  city: '',
  country: 'France',
};

type CheckoutSection = 'infos' | 'address' | 'delivery' | 'payment';
type DeliveryOption = 'db-schenker';
type PaymentOption = 'paypal' | 'card' | 'bank';

export default function CheckoutPage() {
  const { items, totalPrice, loading } = useCart();
  const [activeSection, setActiveSection] = useState<CheckoutSection>('infos');
  const [completedSections, setCompletedSections] = useState<Record<CheckoutSection, boolean>>({
    infos: false,
    address: false,
    delivery: false,
    payment: false,
  });
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>(emptyCheckoutForm);
  const [profileLoading, setProfileLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('db-schenker');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
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
          .select('alias,first_name,last_name,phone,address,address_line2,postal_code,city,country')
          .eq('id', user.id)
          .single();

        setCheckoutForm((prev) => ({
          ...prev,
          email: user.email ?? prev.email,
          alias: profile?.alias ?? prev.alias,
          first_name: profile?.first_name ?? prev.first_name,
          last_name: profile?.last_name ?? prev.last_name,
          phone: profile?.phone ?? prev.phone,
          address: profile?.address ?? prev.address,
          address_line2: profile?.address_line2 ?? prev.address_line2,
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

  const markSectionCompleted = (section: CheckoutSection, nextSection?: CheckoutSection) => {
    setCompletedSections((prev) => ({ ...prev, [section]: true }));
    if (nextSection) {
      setActiveSection(nextSection);
    }
  };

  const reopenSection = (section: CheckoutSection) => {
    setActiveSection(section);
    if (section === 'payment') {
      setPaymentNotice(null);
      setPaymentMethod(null);
      setPaymentError(null);
    }
    setCompletedSections((prev) => {
      const updated = { ...prev };
      if (section === 'infos') {
        updated.infos = false;
        updated.address = false;
        updated.delivery = false;
        updated.payment = false;
      } else if (section === 'address') {
        updated.address = false;
        updated.delivery = false;
        updated.payment = false;
      } else if (section === 'delivery') {
        updated.delivery = false;
        updated.payment = false;
      } else if (section === 'payment') {
        updated.payment = false;
      }
      return updated;
    });
  };

  const handleDetailsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    markSectionCompleted('infos', 'address');
  };

  const handleAddressContinue = () => {
    markSectionCompleted('address', 'delivery');
  };

  const handleDeliverySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    markSectionCompleted('delivery', 'payment');
  };

  const handlePaymentConfirm = async () => {
    if (!paymentMethod) {
      setPaymentError('Merci de sélectionner un mode de paiement.');
      return;
    }

    setPaymentError(null);

    if (paymentMethod === 'card') {
      // Paiement par carte via Stripe
      setIsProcessingPayment(true);

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              product_slug: item.product_slug,
              product_name: item.product_name,
              product_price: item.product_price,
              product_image: item.product_image,
              quantity: item.quantity,
            })),
            customerInfo: {
              email: checkoutForm.email,
              first_name: checkoutForm.first_name,
              last_name: checkoutForm.last_name,
              phone: checkoutForm.phone,
              address: checkoutForm.address,
              address_line2: checkoutForm.address_line2,
              postal_code: checkoutForm.postal_code,
              city: checkoutForm.city,
              country: checkoutForm.country,
            },
            deliveryMessage,
          }),
        });

        const data = await response.json();

        if (data.error) {
          setPaymentError(data.error);
          setIsProcessingPayment(false);
          return;
        }

        // Rediriger vers Stripe Checkout
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error('Erreur paiement:', error);
        setPaymentError('Une erreur est survenue. Veuillez réessayer.');
        setIsProcessingPayment(false);
      }
    } else if (paymentMethod === 'paypal') {
      setPaymentNotice('PayPal sera bientôt disponible. Veuillez utiliser le paiement par carte.');
    } else {
      setPaymentNotice('Le virement bancaire sera bientôt disponible. Veuillez utiliser le paiement par carte.');
    }
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
          <h1 className="font-display text-3xl font-semibold text-slate-900">Votre panier est vide</h1>
          <p className="mt-4 text-slate-600">Ajoutez d’abord des articles à votre panier pour finaliser votre commande.</p>
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

  const SectionHeader = ({ section, title }: { section: CheckoutSection; title: string }) => {
    const completed = completedSections[section];
    const isActive = activeSection === section;
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
              completed ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-200 text-slate-300'
            }`}
          >
            <Check className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-semibold uppercase text-slate-900">{title}</h2>
        </div>
        {completed && (
          <button
            type="button"
            onClick={() => reopenSection(section)}
            className={`text-sm font-semibold uppercase tracking-wide ${
              isActive ? 'text-red-600' : 'text-slate-400'
            }`}
          >
            Modifier
          </button>
        )}
      </div>
    );
  };

  return (
    <Section className="py-24">
      <Container className="max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Paiement sécurisé</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900">Finalisez votre commande</h1>
          </div>
          <Link href="/panier" className="text-sm font-semibold text-clay-900 hover:text-clay-700">
            ← Modifier mon panier
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
          <div className="space-y-5">
            {/* Informations personnelles */}
            <div className="rounded-none border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader section="infos" title="Informations personnelles" />

              {activeSection === 'infos' ? (
                <form className="mt-6 space-y-4" onSubmit={handleDetailsSubmit}>
                  <label className="text-sm font-semibold text-slate-700">
                    Alias (optionnel)
                    <input
                      type="text"
                      className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                      value={checkoutForm.alias}
                      onChange={handleInputChange('alias')}
                      placeholder="Mon adresse"
                    />
                  </label>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Prénom *
                      <input
                        type="text"
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.first_name}
                        onChange={handleInputChange('first_name')}
                        required
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Nom *
                      <input
                        type="text"
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.last_name}
                        onChange={handleInputChange('last_name')}
                        required
                      />
                    </label>
                  </div>

                  <label className="text-sm font-semibold text-slate-700">
                    Email *
                    <input
                      type="email"
                      className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                      value={checkoutForm.email}
                      onChange={handleInputChange('email')}
                      required
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Téléphone
                    <input
                      type="tel"
                      className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                      value={checkoutForm.phone}
                      onChange={handleInputChange('phone')}
                    />
                  </label>

                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Adresse *
                      <input
                        type="text"
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.address}
                        onChange={handleInputChange('address')}
                        required
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Code postal *
                      <input
                        type="text"
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.postal_code}
                        onChange={handleInputChange('postal_code')}
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Ville *
                      <input
                        type="text"
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.city}
                        onChange={handleInputChange('city')}
                        required
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Pays
                      <select
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.country}
                        onChange={(event) =>
                          setCheckoutForm((prev) => ({ ...prev, country: event.target.value }))
                        }
                      >
                        <option value="France">France</option>
                        <option value="Allemagne">Allemagne</option>
                        <option value="Belgique">Belgique</option>
                      </select>
                    </label>
                  </div>

                  {profileLoading && (
                    <p className="text-xs text-slate-500">Pré-remplissage de vos informations...</p>
                  )}
                  {formError && <p className="text-sm text-red-600">{formError}</p>}

                  <button
                    type="submit"
                    className="w-full rounded-none bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                  >
                    Valider ces informations
                  </button>
                </form>
              ) : (
                completedSections.infos && (
                  <div className="mt-6 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">
                      {checkoutForm.first_name} {checkoutForm.last_name}
                    </p>
                    <p>{checkoutForm.email}</p>
                    {checkoutForm.phone && <p>{checkoutForm.phone}</p>}
                  </div>
                )
              )}
            </div>

            {/* Adresse */}
            <div className="rounded-none border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader section="address" title="Adresses" />
              {activeSection === 'address' && (
                <form className="mt-6 space-y-4" onSubmit={handleAddressContinue}>
                  <label className="text-sm font-semibold text-slate-700">
                    Alias (optionnel)
                    <input
                      type="text"
                      className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                      value={checkoutForm.alias}
                      onChange={handleInputChange('alias')}
                    />
                  </label>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Prénom *
                      <input
                        type="text"
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.first_name}
                        onChange={handleInputChange('first_name')}
                        required
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Nom *
                      <input
                        type="text"
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.last_name}
                        onChange={handleInputChange('last_name')}
                        required
                      />
                    </label>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Adresse *
                      <input
                        type="text"
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.address}
                        onChange={handleInputChange('address')}
                        required
                      />
                    </label>
                  </div>
                  <label className="text-sm font-semibold text-slate-700">
                    Complément d'adresse (optionnel)
                    <input
                      type="text"
                      className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                      value={checkoutForm.address_line2}
                      onChange={handleInputChange('address_line2')}
                      placeholder="Bâtiment, étage..."
                    />
                  </label>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Code postal *
                      <input
                        type="text"
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.postal_code}
                        onChange={handleInputChange('postal_code')}
                        required
                      />
                    </label>
                  </div>
                  <label className="text-sm font-semibold text-slate-700">
                    Téléphone
                    <input
                      type="tel"
                      className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                      value={checkoutForm.phone}
                      onChange={handleInputChange('phone')}
                    />
                  </label>
                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Ville *
                      <input
                        type="text"
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.city}
                        onChange={handleInputChange('city')}
                        required
                      />
                    </label>
                    <label className="text-sm font-semibold text-slate-700">
                      Pays
                      <select
                        className="mt-1 w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                        value={checkoutForm.country}
                        onChange={(event) =>
                          setCheckoutForm((prev) => ({ ...prev, country: event.target.value }))
                        }
                      >
                        <option value="France">France</option>
                        <option value="Allemagne">Allemagne</option>
                        <option value="Belgique">Belgique</option>
                      </select>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-none bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                  >
                    Valider l’adresse
                  </button>
                </form>
              )}
            </div>

            {/* Livraison */}
            <div className="rounded-none border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader section="delivery" title="Mode de livraison" />
              {activeSection === 'delivery' ? (
                <form className="mt-6 space-y-4" onSubmit={handleDeliverySubmit}>
                  <label
                    className={`flex flex-col gap-4 rounded-none border p-4 transition ${
                      selectedDelivery === 'db-schenker' ? 'border-clay-700 bg-clay-50' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="delivery"
                        value="db-schenker"
                        checked
                        onChange={() => setSelectedDelivery('db-schenker')}
                        className="h-4 w-4"
                      />
                      <Image src="/logos/db-schenker.svg" alt="DB Schenker" width={90} height={32} className="h-8 w-auto" />
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-semibold text-slate-900">
                          Transport Schenker, messagerie standard
                        </span>
                        <span className="text-sm text-slate-600">Livraison standard • 5 à 7 jours ouvrés</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">Incluse</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Livraison à domicile avec prise de rendez-vous par SMS. Dépôt au pied du domicile.
                    </p>
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Votre message (optionnel)
                    <textarea
                      className="mt-1 min-h-[100px] w-full rounded-none border border-slate-300 px-3 py-2 text-sm"
                      placeholder="Ajoutez une précision pour le transporteur..."
                      value={deliveryMessage}
                      onChange={(event) => setDeliveryMessage(event.target.value)}
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-none bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                  >
                    Valider ce mode de livraison
                  </button>
                </form>
              ) : (
                completedSections.delivery && (
                  <div className="mt-6 space-y-3 rounded-none border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="flex items-center gap-3">
                      <Image src="/logos/db-schenker.svg" alt="DB Schenker" width={80} height={30} />
                      <div>
                        <p className="font-semibold text-slate-900">Transport Schenker, messagerie standard</p>
                        <p>Livraison standard • Incluse</p>
                      </div>
                    </div>
                    {deliveryMessage && (
                      <p>
                        Message pour le transporteur :{' '}
                        <span className="font-medium text-slate-900">{deliveryMessage}</span>
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Paiement */}
            <div className="rounded-none border border-slate-200 bg-white p-6 shadow-sm">
              <SectionHeader section="payment" title="Paiement" />
              {activeSection !== 'payment' ? (
                <p className="mt-6 rounded-none border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                  Finalisez d’abord les étapes précédentes pour débloquer le paiement.
                </p>
              ) : (
                <>
                  <div className="mt-6 space-y-3">
                    {[
                      {
                        id: 'paypal',
                        label: 'PayPal',
                        description: 'Redirection sécurisée vers votre compte PayPal.',
                      },
                      {
                        id: 'card',
                        label: 'Carte de crédit',
                        description: 'Visa, Mastercard et Amex. Paiement sécurisé par Stripe.',
                      },
                      {
                        id: 'bank',
                        label: 'Virement bancaire',
                        description: 'Recevez immédiatement l’IBAN et la référence de votre commande.',
                      },
                    ].map((option) => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-none border px-4 py-3 ${
                          paymentMethod === option.id ? 'border-clay-700 bg-clay-50' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          className="mt-1 h-4 w-4"
                          checked={paymentMethod === option.id}
                          onChange={() => {
                            setPaymentMethod(option.id as PaymentOption);
                            setPaymentNotice(null);
                          }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                          <p className="text-sm text-slate-600">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentError && <p className="mt-2 text-sm text-red-600">{paymentError}</p>}
                  {paymentNotice && (
                    <p className="mt-2 rounded-none bg-slate-100 px-4 py-2 text-sm text-slate-700">{paymentNotice}</p>
                  )}

                  <button
                    type="button"
                    onClick={handlePaymentConfirm}
                    disabled={isProcessingPayment}
                    className="mt-4 w-full rounded-none bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Redirection vers le paiement...
                      </>
                    ) : (
                      'Valider mon paiement'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Résumé */}
          <div className="space-y-5 rounded-none border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Résumé de la commande</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-slate-700">
                  <p className="w-2/3 font-semibold text-slate-900">{item.product_name}</p>
                  <p className="w-1/3 text-right">
                    {item.quantity} × <Price amount={item.product_price} />
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total</span>
                <Price amount={totalPrice} />
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Livraison</span>
                <span>Incluse</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-slate-900">
              <span>Total</span>
              <Price amount={totalPrice} />
            </div>
            <p className="text-xs text-slate-500">Tous les paiements sont sécurisés et chiffrés.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
