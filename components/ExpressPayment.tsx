'use client';

import { useEffect, useState } from 'react';
import { loadStripe, type Stripe as StripeJs } from '@stripe/stripe-js';
import {
  Elements,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { Product } from '@/lib/schema';

type ExpressPaymentProps = {
  product: Product;
  variantLabel?: string;
  quantity?: number;
  disabled?: boolean;
};

const stripePromise: Promise<StripeJs | null> | null = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

/**
 * Détecte si l'appareil est un téléphone (iOS ou Android).
 * On veut afficher les boutons natifs Apple Pay / Google Pay uniquement sur mobile.
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    const mobile = /iPhone|iPad|iPod|Android/i.test(ua);
    setIsMobile(mobile);
  }, []);
  return isMobile;
}

export function ExpressPayment({ product, variantLabel, quantity = 1, disabled = false }: ExpressPaymentProps) {
  const isMobile = useIsMobile();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [klarnaLoading, setKlarnaLoading] = useState(false);

  // Wallets natifs (Apple Pay / Google Pay) : seulement sur mobile
  const showWallets = isMobile && !product.onDemand && !!stripePromise;
  // Klarna : visible partout (mobile + desktop) sauf produit sur demande
  const showKlarna = !product.onDemand;

  useEffect(() => {
    if (!showWallets) return;
    let cancelled = false;

    fetch('/api/checkout/express', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productSlug: product.slug,
        variantLabel,
        quantity,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || 'Erreur');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setClientSecret(data.clientSecret);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [showWallets, product.slug, variantLabel, quantity]);

  const handleKlarnaCheckout = async () => {
    if (disabled || klarnaLoading) return;
    setKlarnaLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout/express/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: product.slug,
          variantLabel,
          quantity,
          paymentMethod: 'klarna',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors du paiement');
      }
      const { url } = await res.json();
      if (!url) throw new Error('Lien de paiement indisponible');
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors du paiement');
      setKlarnaLoading(false);
    }
  };

  // Si rien à afficher (desktop sans Klarna), on ne rend rien
  if (!showWallets && !showKlarna) {
    return null;
  }

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        <span>ou</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Wallets natifs (Apple Pay / Google Pay) — mobile uniquement */}
      {showWallets && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: 'stripe' },
            locale: 'fr',
          }}
        >
          <ExpressCheckoutInner
            product={product}
            variantLabel={variantLabel}
            quantity={quantity}
            disabled={disabled}
          />
        </Elements>
      )}

      {/* Bouton Klarna — toujours visible (mobile + desktop) */}
      {showKlarna && (
        <button
          type="button"
          onClick={handleKlarnaCheckout}
          disabled={disabled || klarnaLoading}
          className="w-full flex items-center justify-center gap-2 px-8 py-3 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase transition border border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: '48px' }}
        >
          {klarnaLoading ? (
            'Redirection…'
          ) : (
            <>
              Payer en plusieurs fois
              <span className="text-[10px] tracking-normal text-slate-500 normal-case ml-1">avec Klarna</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}

/**
 * Inner component : confirme le PaymentIntent quand l'utilisateur clique
 * sur le bouton Apple Pay / Google Pay natif.
 */
function ExpressCheckoutInner({
  disabled,
}: {
  product: Product;
  variantLabel?: string;
  quantity: number;
  disabled?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'Erreur de validation');
      return;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${origin}/commande/succes`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Erreur lors du paiement');
    }
  };

  return (
    <>
      <ExpressCheckoutElement
        onConfirm={handleConfirm}
        options={{
          // Limiter aux wallets natifs (Apple Pay / Google Pay / Link)
          // PayPal/Amazon Pay ne s'affichent que s'ils sont activés dans le dashboard
          buttonType: {
            applePay: 'buy',
            googlePay: 'buy',
          },
          buttonHeight: 48,
          paymentMethods: {
            applePay: 'always',
            googlePay: 'always',
            link: 'auto',
            paypal: 'never',
            amazonPay: 'never',
          },
        }}
      />
      {disabled && (
        <p className="text-xs text-slate-500 text-center">Sélection incomplète</p>
      )}
      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
    </>
  );
}
