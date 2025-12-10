'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

type AdminSignOutButtonProps = {
  className?: string;
};

export function AdminSignOutButton({ className }: AdminSignOutButtonProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    } finally {
      window.location.href = '/';
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`${className ?? ''} ${loading ? 'opacity-70' : ''}`}
    >
      <LogOut size={20} />
      {loading ? 'Déconnexion...' : 'Déconnexion'}
    </button>
  );
}
