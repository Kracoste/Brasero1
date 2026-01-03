'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { AUTH_ROUTES } from '@/lib/auth';

type AdminSignOutButtonProps = {
  className?: string;
};

export function AdminSignOutButton({ className }: AdminSignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      // Appeler l'API serveur pour nettoyer les cookies
      await fetch(AUTH_ROUTES.logout, { method: 'POST' });
      
      // Déconnecter côté client aussi
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // Rediriger vers l'accueil
      window.location.href = AUTH_ROUTES.home;
    } catch {
      // Rediriger même en cas d'erreur
      window.location.href = AUTH_ROUTES.home;
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={`${className ?? ''} ${loading ? 'opacity-70' : ''}`}
    >
      <LogOut size={20} />
      {loading ? 'Déconnexion...' : 'Déconnexion'}
    </button>
  );
}
