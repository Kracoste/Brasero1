'use client';

import { useState } from 'react';

export function HomepageNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus('success');
        try { localStorage.setItem('brasero:newsletter-subscribed', '1'); } catch {}
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center">
        <p className="font-display text-xl font-light text-slate-900">Bienvenue dans l&apos;aventure.</p>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
          Vous recevrez prochainement nos prochaines créations et actualités directement dans votre boîte mail.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        autoComplete="email"
        className="flex-1 border-0 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-slate-900"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-slate-900 px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-slate-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Inscription...' : 'Rejoindre l’aventure'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-600 sm:col-span-2">Erreur, réessayez.</p>
      )}
    </form>
  );
}
