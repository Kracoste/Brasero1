'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['allouhugo@gmail.com'];

export function AuthProvider({ children }: { children: ReactNode }) {
  // Créer le client une seule fois au montage
  const supabase = useMemo(() => createClient(), []);
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkIsAdmin = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }

    // Vérifier par email d'abord
    if (ADMIN_EMAILS.includes(currentUser.email?.toLowerCase() || '')) {
      setIsAdmin(true);
      return;
    }

    // Sinon vérifier dans la base de données
    try {
      const supabaseClient = createClient();
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      setIsAdmin(profile?.role === 'admin');
    } catch {
      setIsAdmin(false);
    }
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
      // Utiliser l'API route pour la déconnexion côté serveur
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Aussi déconnecter côté client
      await supabase.auth.signOut();
      
      // Réinitialiser l'état
      setUser(null);
      setIsAdmin(false);
      
      // Rediriger avec un rechargement complet pour nettoyer tout l'état
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Forcer la redirection même en cas d'erreur
      window.location.href = '/';
    }
  }, [supabase]);

  useEffect(() => {
    // Initialisation - forcer une vérification serveur
    const init = async () => {
      setIsLoading(true);
      try {
        // getUser() vérifie avec le serveur Supabase, pas le cache local
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error) {
          // Si erreur (token invalide, expiré, etc.), l'utilisateur n'est pas connecté
          setUser(null);
          setIsAdmin(false);
        } else {
          setUser(currentUser);
          await checkIsAdmin(currentUser);
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
        // Ignorer l'événement INITIAL_SESSION car on gère déjà l'init
        if (event === 'INITIAL_SESSION') return;
        
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
  }, [supabase, checkIsAdmin, refreshUser]);

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
