'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Une erreur est survenue
        </h2>
        <p className="text-slate-600 max-w-md mx-auto">
          Nous sommes désolés, quelque chose s&apos;est mal passé. Veuillez réessayer.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-[#0f172a] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#723a0f] transition"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
