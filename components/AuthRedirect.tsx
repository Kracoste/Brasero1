'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AUTH_ROUTES } from '@/lib/auth';

type AuthRedirectProps = {
  redirectTo?: string;
  requireAdmin?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Composant client pour gérer les redirections d'authentification
 * Utilisé quand le serveur ne reconnaît pas la session mais le client oui
 */
export function AuthRedirect({ 
  redirectTo = AUTH_ROUTES.login, 
  requireAdmin = false,
  children,
  fallback
}: AuthRedirectProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (hasRedirected.current) return;

    // Si pas d'utilisateur, rediriger vers connexion
    if (!user) {
      hasRedirected.current = true;
      const currentPath = window.location.pathname;
      window.location.href = `${redirectTo}?redirectTo=${encodeURIComponent(currentPath)}`;
      return;
    }

    // Si admin requis mais pas admin, rediriger vers accueil
    if (requireAdmin && !isAdmin) {
      hasRedirected.current = true;
      window.location.href = '/';
      return;
    }
  }, [user, isAdmin, isLoading, redirectTo, requireAdmin]);

  // Pendant le chargement ou si redirection en cours
  if (isLoading || (!user && !hasRedirected.current)) {
    return fallback || (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas d'utilisateur et redirection en cours
  if (!user) {
    return fallback || (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <p className="mt-4 text-slate-600">Redirection...</p>
        </div>
      </div>
    );
  }

  // Si admin requis mais pas admin
  if (requireAdmin && !isAdmin) {
    return fallback || (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <p className="mt-4 text-slate-600">Redirection...</p>
        </div>
      </div>
    );
  }

  // Utilisateur authentifié (et admin si requis)
  return <>{children}</>;
}
