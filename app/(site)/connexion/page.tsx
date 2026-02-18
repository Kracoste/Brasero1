'use client';

import { Suspense, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isAdminEmail, AUTH_ROUTES, REDIRECT_PARAM } from '@/lib/auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function ConnexionPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const searchParams = useSearchParams();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const hasRedirected = useRef(false);
  const supabase = useMemo(() => createClient(), []);

  // Fonction pour obtenir la cible de redirection
  const getRedirectTarget = useCallback((fallback: string) => {
    const redirectFromQuery = searchParams?.get(REDIRECT_PARAM);
    if (!redirectFromQuery) return fallback;
    if (!redirectFromQuery.startsWith('/')) return fallback;
    if (
      redirectFromQuery.startsWith(AUTH_ROUTES.login) ||
      redirectFromQuery.startsWith(AUTH_ROUTES.register)
    ) {
      return fallback;
    }
    return redirectFromQuery;
  }, [searchParams]);

  // Fonction de redirection centralisée
  const performRedirect = useCallback((userEmail?: string | null) => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    setIsRedirecting(true);

    const emailToCheck = userEmail || email.trim();
    const isAdminUser = isAdmin || isAdminEmail(emailToCheck);
    const target = isAdminUser ? AUTH_ROUTES.admin : AUTH_ROUTES.home;
    const finalTarget = getRedirectTarget(target);

    // Synchroniser la session côté serveur AVANT de naviguer
    // C'est critique : le middleware vérifie la session via les cookies
    // Si on navigue avant que les cookies soient synchronisés, le middleware rejette la requête
    const syncAndRedirect = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        await fetch('/api/auth/sync-session', {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch {
        // Continuer même si sync échoue - les cookies du client devraient suffire
      }
      // Naviguer vers la cible
      window.location.href = finalTarget;
    };

    syncAndRedirect();
  }, [email, isAdmin, getRedirectTarget]);

  // Rediriger si déjà connecté (visite directe sur /connexion)
  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (hasRedirected.current) return;
    if (loading) return; // Ne pas interférer pendant un login en cours
    
    // Si l'utilisateur est déjà connecté et visite /connexion, le rediriger
    performRedirect(user.email);
  }, [authLoading, user, loading, performRedirect]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Appel REST direct à Supabase Auth pour éviter les locks internes
      // du client singleton (signInWithPassword peut bloquer indéfiniment)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `${supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.msg || body.error_description || body.message || 'Erreur de connexion');
      }

      if (!body.access_token || !body.refresh_token) {
        throw new Error('Connexion échouée - pas de token');
      }

      // Injecter la session dans le client Supabase (pour les cookies)
      // On n'attend PAS la résolution complète pour éviter les locks
      supabase.auth.setSession({
        access_token: body.access_token,
        refresh_token: body.refresh_token,
      }).catch(() => {});

      // Petit délai pour laisser les cookies se mettre en place
      await new Promise(resolve => setTimeout(resolve, 300));

      // Connexion réussie → rediriger
      performRedirect(body.user?.email);
      
    } catch (err: any) {
      const message = err?.message || err?.name || 'Une erreur est survenue';
      
      if (err?.name === 'AbortError' || message === 'TIMEOUT') {
        setError('La connexion a pris trop de temps. Veuillez réessayer.');
      } else if (message.includes('Invalid login credentials') || message.includes('invalid_credentials')) {
        setError('Email ou mot de passe incorrect.');
      } else if (message.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter.');
      } else if (message.includes('Too many requests') || message.includes('rate limit') || message.includes('over_request_rate_limit')) {
        setError('Trop de tentatives. Veuillez patienter quelques minutes.');
      } else if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('network')) {
        setError('Erreur réseau. Vérifiez votre connexion internet.');
      } else {
        setError(message);
      }
      
      setLoading(false);
      setIsRedirecting(false);
      hasRedirected.current = false;
    }
  };

  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <p className="mt-4 text-slate-600">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center font-display text-3xl font-semibold text-slate-900">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Ou{' '}
            <Link href="/inscription" className="font-medium text-clay-900 hover:text-clay-800">
              créez un nouveau compte
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-clay-900 focus:outline-none focus:ring-clay-900"
                placeholder="vous@exemple.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-clay-900 focus:outline-none focus:ring-clay-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 mt-4"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <ConnexionPageContent />
    </Suspense>
  );
}
