'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AUTH_ROUTES } from '@/lib/auth';
import { devLog, devError } from '@/lib/supabase/utils';
import type { User, AuthChangeEvent, Session, UserResponse } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Créer le client une seule fois au montage
  const supabase = useMemo(() => createClient(), []);

  // Cache par instance (useRef) pour éviter les fuites d'état entre instances SSR/tests
  const cachedUserRef = useRef<User | null>(null);
  const cachedIsAdminRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const initInProgress = useRef(false);

  const checkIsAdmin = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      cachedIsAdminRef.current = false;
      return;
    }

    // Vérifier côté serveur (les emails admin ne sont pas exposés côté client)
    try {
      const res = await fetch('/api/auth/check-admin');
      const data = await res.json();
      setIsAdmin(!!data.isAdmin);
      cachedIsAdminRef.current = !!data.isAdmin;
    } catch {
      setIsAdmin(false);
      cachedIsAdminRef.current = false;
    }
  }, []);

  const updateUser = useCallback((newUser: User | null) => {
    cachedUserRef.current = newUser;
    setUser(newUser);
    checkIsAdmin(newUser);
  }, [checkIsAdmin]);

  const refreshUser = useCallback(async () => {
    // Ne pas faire de requête réseau si aucun utilisateur n'est connecté
    if (!cachedUserRef.current) return;
    
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (!error && currentUser) {
        updateUser(currentUser);
      } else if (error) {
        // Seulement si erreur réelle, pas juste session manquante
        devLog('refreshUser error:', error.message);
        // Ne pas effacer l'utilisateur si on a une erreur réseau
        if (error.message.includes('network') || error.message.includes('fetch')) {
          return; // Garder l'état actuel
        }
        updateUser(null);
      }
    } catch {
      // Ignorer les erreurs réseau silencieusement
    }
  }, [supabase, updateUser]);

  const signOut = useCallback(async () => {
    try {
      // Réinitialiser le cache immédiatement
      cachedUserRef.current = null;
      cachedIsAdminRef.current = false;
      isInitializedRef.current = false;
      
      // Utiliser l'API route pour la déconnexion côté serveur (nettoie les cookies)
      await fetch(AUTH_ROUTES.logout, { method: 'POST' });
      
      // Aussi déconnecter côté client
      await supabase.auth.signOut();

      // Nettoyer le panier local et le code promo avant le reload,
      // pour éviter qu'ils ne ressurgissent au retour en visiteur.
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('brasero:guest-cart');
        window.sessionStorage.removeItem('brasero:applied-coupon');
      }

      // Réinitialiser l'état
      setUser(null);
      setIsAdmin(false);

      // Rediriger avec un rechargement complet pour nettoyer tout l'état
      window.location.href = AUTH_ROUTES.home;
    } catch (error) {
      devError('Erreur lors de la déconnexion:', error);
      // Forcer la redirection même en cas d'erreur
      window.location.href = AUTH_ROUTES.home;
    }
  }, [supabase]);

  useEffect(() => {
    // Éviter les initialisations multiples en parallèle
    if (initInProgress.current) return;

    // Si déjà initialisé et on a un utilisateur en cache, ne pas re-fetcher
    if (isInitializedRef.current && cachedUserRef.current) {
      setIsLoading(false);
      return;
    }

    initInProgress.current = true;

    // Phase 1 : getSession() local = INSTANTANÉ (pas de requête réseau)
    // Phase 2 : getUser() en arrière-plan pour vérifier avec le serveur
    const init = async () => {
      try {
        // Phase 1 : session locale (instantanée, depuis le cookie)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!sessionError && session?.user) {
          devLog('Init auth (fast) - session locale trouvée:', session.user.email);
          updateUser(session.user);
          isInitializedRef.current = true;
          setIsLoading(false);
          initInProgress.current = false;
          
          // Phase 2 : vérifier en arrière-plan avec le serveur (non bloquant)
          supabase.auth.getUser().then((res: UserResponse) => {
            const verifiedUser = res.data?.user ?? null;
            const err = res.error;
            if (err || !verifiedUser) {
              devLog('Background verify - session invalide, déconnexion');
              if (!err?.message?.includes('network') && !err?.message?.includes('fetch')) {
                updateUser(null);
                isInitializedRef.current = false;
              }
            } else {
              updateUser(verifiedUser);
            }
          }).catch(() => {
            // Ignorer les erreurs réseau en background
          });
          return;
        }
        
        // Pas de session locale = visiteur anonyme, pas besoin de vérifier avec le serveur
        devLog('Init auth - pas de session locale, visiteur anonyme');
        updateUser(null);

        isInitializedRef.current = true;
      } catch (error) {
        devError('Erreur initialisation auth:', error);
      } finally {
        setIsLoading(false);
        initInProgress.current = false;
      }
    };

    init();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        devLog('Auth state change:', event, session?.user?.email);
        
        // Ignorer les événements INITIAL_SESSION car on a déjà initialisé
        if (event === 'INITIAL_SESSION') {
          return;
        }
        
        // Pour SIGNED_IN et TOKEN_REFRESHED, mettre à jour l'utilisateur
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const currentUser = session?.user ?? null;
          if (currentUser) {
            updateUser(currentUser);
          }
          setIsLoading(false);
          return;
        }
        
        // Pour SIGNED_OUT, effacer l'utilisateur directement
        // Ne PAS faire de getUser() ici car ça peut bloquer/créer un deadlock
        // lors de la transition SIGNED_OUT -> SIGNED_IN au login
        if (event === 'SIGNED_OUT') {
          updateUser(null);
          isInitializedRef.current = false;
          setIsLoading(false);
          return;
        }
        
        // Pour les autres événements
        const currentUser = session?.user ?? null;
        updateUser(currentUser);
        setIsLoading(false);
      }
    );

    // Rafraîchir quand la page devient visible (seulement si connecté)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && cachedUserRef.current) {
        refreshUser();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Rafraîchir quand la fenêtre reprend le focus (seulement si connecté)
    const handleFocus = () => {
      if (cachedUserRef.current) {
        refreshUser();
      }
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Volontairement vide - on ne veut exécuter qu'une seule fois au montage

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
