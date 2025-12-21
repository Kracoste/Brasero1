'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import { useCart } from '@/lib/cart-context';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<{
    email: string;
    amount: number;
  } | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    // Vider le panier local après un paiement réussi
    clearCart();

    // Optionnel: récupérer les détails de la session
    if (sessionId) {
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email && data.amount) {
            setOrderDetails(data);
          }
        })
        .catch(console.error);
    }
  }, [sessionId, clearCart]);

  return (
    <Section className="py-24">
      <Container className="max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>

        <h1 className="font-display text-3xl font-semibold text-slate-900">
          Merci pour votre commande !
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Votre paiement a été effectué avec succès. Vous recevrez un email de confirmation
          {orderDetails?.email && (
            <> à <span className="font-semibold">{orderDetails.email}</span></>
          )}
          .
        </p>

        {orderDetails?.amount && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            <Package className="h-4 w-4" />
            Montant payé : {(orderDetails.amount / 100).toFixed(2)} €
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-left">
            <h2 className="font-semibold text-slate-900">Prochaines étapes</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  1
                </span>
                <span>
                  Vous recevrez un email de confirmation avec le récapitulatif de votre commande.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  2
                </span>
                <span>
                  Votre commande sera préparée et expédiée sous 3 à 5 jours ouvrés.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  3
                </span>
                <span>
                  Le transporteur DB Schenker vous contactera par SMS pour convenir d'un rendez-vous de livraison.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/mon-compte/commandes"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
          >
            Voir mes commandes
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Continuer mes achats
          </Link>
        </div>
      </Container>
    </Section>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SuccessPageContent />
    </Suspense>
  );
}
