'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isAdminEmail, AUTH_ROUTES } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

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
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const initialized = useRef(false);

  const checkIsAdmin = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }

    // Vérifier par email uniquement (config centralisée)
    // Évite les problèmes de RLS recursion sur la table profiles
    if (isAdminEmail(currentUser.email)) {
      setIsAdmin(true);
      return;
    }

    // Par défaut, non admin
    setIsAdmin(false);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      await checkIsAdmin(currentUser);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement utilisateur:', error);
      setUser(null);
      setIsAdmin(false);
    }
  }, [supabase, checkIsAdmin]);

  const signOut = useCallback(async () => {
    try {
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
      console.error('Erreur lors de la déconnexion:', error);
      // Forcer la redirection même en cas d'erreur
      window.location.href = AUTH_ROUTES.home;
    }
  }, [supabase]);

  useEffect(() => {
    // Éviter la double initialisation en mode strict de React
    if (initialized.current) return;
    initialized.current = true;
    
    // Initialisation - forcer une vérification serveur
    const init = async () => {
      setIsLoading(true);
      try {
        // Utiliser getUser() directement car c'est plus fiable que getSession()
        // getUser() vérifie avec le serveur Supabase
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.log('Init auth - pas de session:', error.message);
          setUser(null);
          setIsAdmin(false);
        } else if (currentUser) {
          console.log('Init auth - utilisateur trouvé:', currentUser.email);
          setUser(currentUser);
          await checkIsAdmin(currentUser);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        await checkIsAdmin(currentUser);
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
