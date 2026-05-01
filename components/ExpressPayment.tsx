'use client';

import { useState } from 'react';
import type { Product } from '@/lib/schema';

type ExpressPaymentProps = {
  product: Product;
  variantLabel?: string;
  quantity?: number;
  disabled?: boolean;
};

export function ExpressPayment({ product, variantLabel, quantity = 1, disabled = false }: ExpressPaymentProps) {
  const [loading, setLoading] = useState<'wallet' | 'klarna' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pas d'achat express si produit sur demande ou personnalisation requise
  if (product.onDemand) return null;

  const handleCheckout = async (paymentMethod: 'wallet' | 'klarna') => {
    if (disabled) return;
    setLoading(paymentMethod);
    setError(null);
    try {
      const res = await fetch('/api/checkout/express', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: product.slug,
          variantLabel,
          quantity,
          paymentMethod,
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
      setLoading(null);
    }
  };

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        <span>ou</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Bouton Apple Pay / Google Pay (auto-détection sur la page Stripe) */}
      <button
        type="button"
        onClick={() => handleCheckout('wallet')}
        disabled={disabled || loading !== null}
        className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition border border-slate-900 bg-white text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === 'wallet' ? 'Redirection…' : 'Payer rapidement'}
      </button>

      {/* Bouton Klarna */}
      <button
        type="button"
        onClick={() => handleCheckout('klarna')}
        disabled={disabled || loading !== null}
        className="w-full flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition border border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === 'klarna' ? 'Redirection…' : (
          <>
            Payer en plusieurs fois
            <span className="text-[10px] tracking-normal text-slate-500 normal-case ml-1">avec Klarna</span>
          </>
        )}
      </button>

      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center pt-1">
        Apple Pay · Google Pay · Klarna · Carte
      </p>

      {error && (
        <p className="text-xs text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
