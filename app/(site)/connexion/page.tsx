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
  const { user, isAdmin, isLoading: authLoading, refreshUser } = useAuth();
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

  // Effectuer la redirection de manière impérative
  const performRedirect = useCallback((target: string) => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    setIsRedirecting(true);
    
    // Force redirect direct
    const finalTarget = getRedirectTarget(target);
    console.log('Redirection vers:', finalTarget);
    
    // En production, forcer www pour la cohérence des cookies
    let redirectUrl = finalTarget;
    if (typeof window !== 'undefined') {
      const currentHost = window.location.host;
      if (currentHost === 'atelier-lbf.fr') {
        redirectUrl = `https://www.atelier-lbf.fr${finalTarget}`;
      }
    }
    
    window.location.href = redirectUrl;
  }, [getRedirectTarget]);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (hasRedirected.current) return;
    
    const isAdminUser = isAdmin || isAdminEmail(user.email);
    const target = isAdminUser ? AUTH_ROUTES.admin : AUTH_ROUTES.home;
    performRedirect(target);
  }, [authLoading, user, isAdmin, performRedirect]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.session) {
        throw new Error('Connexion échouée - pas de session');
      }

      // Rafraîchir l'auth context pour mettre à jour le cache
      await refreshUser();

      // Marquer la redirection immédiatement
      setIsRedirecting(true);
      hasRedirected.current = true;

      // Déterminer la cible de redirection
      const isAdminUser = isAdminEmail(email.trim());
      const target = isAdminUser ? AUTH_ROUTES.admin : AUTH_ROUTES.home;
      const finalTarget = getRedirectTarget(target);
      
      console.log('Connexion réussie, redirection vers:', finalTarget);

      // Attendre que la session soit synchronisée côté serveur
      // Cela force le middleware à reconnaître la session
      let retries = 0;
      const maxRetries = 5;
      while (retries < maxRetries) {
        try {
          const syncResponse = await fetch('/api/auth/sync-session', { 
            method: 'POST',
            credentials: 'include'
          });
          if (syncResponse.ok) {
            console.log('Session synchronisée côté serveur');
            break;
          }
        } catch (e) {
          console.log('Sync attempt', retries + 1);
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Construire l'URL de redirection complète
      // En production, forcer www pour la cohérence des cookies
      let redirectUrl = finalTarget;
      if (typeof window !== 'undefined') {
        const currentHost = window.location.host;
        if (currentHost === 'atelier-lbf.fr') {
          redirectUrl = `https://www.atelier-lbf.fr${finalTarget}`;
        }
      }

      // Redirection directe
      window.location.href = redirectUrl;
      
    } catch (error: any) {
      console.error('Erreur connexion:', error);
      setError(error?.message || 'Une erreur est survenue');
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
