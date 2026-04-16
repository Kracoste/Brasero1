'use client';

import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const DISMISSED_KEY = 'brasero:exit-popup-dismissed';
const SUBSCRIBED_KEY = 'brasero:newsletter-subscribed';
const DEFAULT_COUPON_CODE = 'BIENVENUE10';

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [couponCode, setCouponCode] = useState(DEFAULT_COUPON_CODE);

  useEffect(() => {
    fetch('/api/coupons/banner')
      .then(res => res.json())
      .then(data => { if (data?.code) setCouponCode(data.code); })
      .catch(() => {});
  }, []);

  const dismiss = useCallback(() => {
    setShow(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1');
    } catch {}
  }, []);

  useEffect(() => {
    // Don't show if already dismissed this session or already subscribed
    try {
      if (sessionStorage.getItem(DISMISSED_KEY)) return;
      if (localStorage.getItem(SUBSCRIBED_KEY)) return;
    } catch {}

    let triggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered) return;
      // Only trigger when mouse leaves from the top of the page
      if (e.clientY <= 0) {
        triggered = true;
        setShow(true);
      }
    };

    // Activer l'exit-intent après 45 sec de navigation
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 45000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

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
        try {
          localStorage.setItem(SUBSCRIBED_KEY, '1');
        } catch {}
        setTimeout(dismiss, 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={dismiss}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label="Fermer la fenêtre"
          autoFocus
        >
          <X className="h-5 w-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Bienvenue !</h3>
            <p className="mt-2 text-sm text-gray-600">
              Votre code <span className="font-semibold text-[#8B4513]">{couponCode}</span> est actif.
              Utilisez-le lors de votre commande.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f6f1e9]">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 id="exit-popup-title" className="text-xl font-bold text-gray-900">
                Attendez ! 10% de réduction vous attendent
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Inscrivez-vous à notre newsletter et recevez votre code promo immédiatement.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#8B4513] focus:ring-2 focus:ring-[#8B4513]/20"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-lg bg-[#8B4513] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6B3410] disabled:opacity-50"
              >
                {status === 'loading' ? 'Inscription...' : 'Recevoir mon code -10%'}
              </button>
              {status === 'error' && (
                <p className="text-center text-xs text-red-500">Une erreur est survenue. Réessayez.</p>
              )}
            </form>

            <button
              onClick={dismiss}
              className="mt-4 w-full text-center text-xs text-gray-400 transition hover:text-gray-600"
            >
              Non merci, je préfère payer plein tarif
            </button>
          </>
        )}
      </div>
    </div>
  );
}
