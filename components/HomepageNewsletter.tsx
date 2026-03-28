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
        <p className="text-lg font-semibold text-white">Bienvenue dans la communauté !</p>
        <p className="mt-2 text-sm text-slate-300">
          Votre code <span className="font-bold text-[#CD853F]">BIENVENUE10</span> est actif. Utilisez-le lors de votre commande.
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
        className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-[#CD853F]"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-lg bg-[#8B4513] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CD853F] disabled:opacity-50"
      >
        {status === 'loading' ? 'Inscription...' : 'Recevoir mon code -10%'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-400 sm:col-span-2">Erreur, réessayez.</p>
      )}
    </form>
  );
}
