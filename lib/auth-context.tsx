'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isAdminEmail, AUTH_ROUTES } from '@/lib/auth';
import { devLog, devError } from '@/lib/supabase/utils';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache global pour persister l'état entre les navigations
let cachedUser: User | null = null;
let cachedIsAdmin: boolean = false;
let isInitialized: boolean = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  // Créer le client une seule fois au montage
  const supabase = useMemo(() => createClient(), []);
  
  // Initialiser avec le cache si disponible
  const [user, setUser] = useState<User | null>(cachedUser);
  const [isLoading, setIsLoading] = useState(!isInitialized);
  const [isAdmin, setIsAdmin] = useState(cachedIsAdmin);
  const initInProgress = useRef(false);

  const checkIsAdmin = useCallback((currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      cachedIsAdmin = false;
      return;
    }

    // Vérifier par email uniquement (config centralisée)
    // Évite les problèmes de RLS recursion sur la table profiles
    if (isAdminEmail(currentUser.email)) {
      setIsAdmin(true);
      cachedIsAdmin = true;
      return;
    }

    // Par défaut, non admin
    setIsAdmin(false);
    cachedIsAdmin = false;
  }, []);

  const updateUser = useCallback((newUser: User | null) => {
    cachedUser = newUser;
    setUser(newUser);
    checkIsAdmin(newUser);
  }, [checkIsAdmin]);

  const refreshUser = useCallback(async () => {
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
    } catch (error) {
      devError('Erreur lors du rafraîchissement utilisateur:', error);
      // Ne pas effacer en cas d'erreur réseau
    }
  }, [supabase, updateUser]);

  const signOut = useCallback(async () => {
    try {
      // Réinitialiser le cache immédiatement
      cachedUser = null;
      cachedIsAdmin = false;
      isInitialized = false;
      
      // Utiliser l'API route pour la déconnexion côté serveur (nettoie les cookies)
      await fetch(AUTH_ROUTES.logout, { method: 'POST' });
      
      // Aussi déconnecter côté client
      await supabase.auth.signOut();
      
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
    if (isInitialized && cachedUser) {
      setIsLoading(false);
      return;
    }
    
    initInProgress.current = true;
    
    // Initialisation - forcer une vérification serveur
    const init = async () => {
      setIsLoading(true);
      try {
        // Utiliser getUser() directement car c'est plus fiable que getSession()
        // getUser() vérifie avec le serveur Supabase
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error) {
          devLog('Init auth - pas de session:', error.message);
          // Ne pas effacer le cache si c'est juste une erreur réseau
          if (!error.message.includes('network') && !error.message.includes('fetch')) {
            updateUser(null);
          }
        } else if (currentUser) {
          devLog('Init auth - utilisateur trouvé:', currentUser.email);
          updateUser(currentUser);
        } else {
          updateUser(null);
        }
        
        isInitialized = true;
      } catch (error) {
        devError('Erreur initialisation auth:', error);
        // Garder le cache en cas d'erreur
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
        
        // Pour SIGNED_OUT, vérifier d'abord avec le serveur avant d'effacer
        if (event === 'SIGNED_OUT') {
          // Double vérification avec getUser() pour éviter les faux positifs
          const { data: { user: serverUser } } = await supabase.auth.getUser();
          if (!serverUser) {
            // Vraiment déconnecté
            updateUser(null);
            isInitialized = false;
          } else {
            // Faux positif - l'utilisateur est toujours connecté côté serveur
            devLog('SIGNED_OUT ignoré - utilisateur toujours valide côté serveur');
            updateUser(serverUser);
          }
          setIsLoading(false);
          return;
        }
        
        // Pour les autres événements
        const currentUser = session?.user ?? null;
        updateUser(currentUser);
        setIsLoading(false);
      }
    );

    // Rafraîchir quand la page devient visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshUser();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Rafraîchir quand la fenêtre reprend le focus
    const handleFocus = () => {
      refreshUser();
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
