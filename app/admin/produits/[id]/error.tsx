'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur page admin produit:', error);
  }, [error]);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-800 mb-2">Erreur</h2>
        <p className="text-red-700 mb-4">
          Une erreur est survenue lors du chargement de cette page.
        </p>
        <pre className="bg-red-100 rounded-lg p-4 text-sm text-red-900 overflow-auto mb-4">
          {error.message}
        </pre>
        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Réessayer
          </button>
          <Link
            href="/admin/produits"
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
          >
            Retour aux produits
          </Link>
        </div>
      </div>
    </div>
  );
}
