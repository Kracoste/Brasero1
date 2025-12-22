'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';

export function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkUser = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Vérifier l'utilisateur au montage
    checkUser();

    // Écouter les changements d'état d'authentification
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('UserNav auth state change:', _event, session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Également vérifier quand la fenêtre reprend le focus (retour sur l'onglet)
    const handleFocus = () => {
      checkUser();
    };
    window.addEventListener('focus', handleFocus);

    // Et vérifier quand on revient sur la page (visibilité)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkUser();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkUser]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-black/20"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 text-white">
        <Link
          href="/mon-compte"
          className="flex items-center gap-2 rounded-full border border-white/30 bg-black/10 px-3 py-1.5 text-sm text-white transition hover:bg-black/20"
        >
          <UserIcon size={16} className="text-white" />
          <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-white/30 bg-black/10 px-3 py-1.5 text-sm text-white transition hover:bg-black/20"
          title="Se déconnecter"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/connexion"
        className="rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-white"
      >
        Connexion
      </Link>
      <Link
        href="/inscription"
        className="rounded-full bg-gradient-to-r from-[#d0ff52] to-[#1f7a1a] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition hover:-translate-y-0.5"
      >
        Inscription
      </Link>
    </div>
  );
}
