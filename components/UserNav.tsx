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
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200"></div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/mon-compte"
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm transition hover:bg-slate-50"
        >
          <UserIcon size={16} className="text-clay-900" />
          <span className="hidden text-slate-700 sm:inline">
            {user.email?.split('@')[0]}
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
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
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Connexion
      </Link>
      <Link
        href="/inscription"
        className="rounded-full bg-clay-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-clay-900/20 transition hover:-translate-y-0.5 hover:bg-clay-800"
      >
        Inscription
      </Link>
    </div>
  );
}
