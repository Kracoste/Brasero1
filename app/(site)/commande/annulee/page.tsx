'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

import { Section } from '@/components/Section';
import { Container } from '@/components/Container';

export default function CancelledPage() {
  return (
    <Section className="py-24">
      <Container className="max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="font-display text-3xl font-semibold text-slate-900">
          Paiement annulé
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
          Votre panier a été conservé.
        </p>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-left">
          <h2 className="font-semibold text-amber-800">Besoin d'aide ?</h2>
          <p className="mt-2 text-sm text-amber-700">
            Si vous avez rencontré un problème lors du paiement ou si vous avez des questions,
            n'hésitez pas à nous contacter. Notre équipe est là pour vous aider.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center text-sm font-semibold text-amber-800 hover:text-amber-900"
          >
            Nous contacter →
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/panier"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Retour au panier
          </Link>
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuer mes achats
          </Link>
        </div>
      </Container>
    </Section>
  );
}
