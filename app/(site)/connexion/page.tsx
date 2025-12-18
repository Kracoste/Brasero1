'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ConnexionPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const adminEmails = ['allouhugo@gmail.com'];

  const getRedirectTarget = (userEmail: string | undefined) => {
    const emailLower = userEmail?.toLowerCase() || '';
    const isAdmin = adminEmails.includes(emailLower);
    const redirectFromQuery = searchParams?.get('redirectTo');
    return redirectFromQuery || (isAdmin ? '/admin' : '/');
  };

  // Écouter les changements d'authentification et rediriger si connecté
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      if (event === 'SIGNED_IN' && session?.user && !isRedirecting) {
        setIsRedirecting(true);
        const target = getRedirectTarget(session.user.email);
        console.log('Redirection vers:', target);
        // Attendre que la session soit bien persistée avant de rediriger
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = target;
      }
    });

    return () => subscription.unsubscribe();
  }, [isRedirecting]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      // La redirection sera gérée par onAuthStateChange
    } catch (error: any) {
      setError(error?.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
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
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ConnexionPageContent />
    </Suspense>
  );
}
