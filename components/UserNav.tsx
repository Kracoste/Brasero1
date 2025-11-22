'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';

export function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
        className="rounded-full bg-gradient-to-r from-clay-900 via-clay-700 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-clay-900/30 transition hover:-translate-y-0.5"
      >
        Inscription
      </Link>
    </div>
  );
}
