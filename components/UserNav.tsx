'use client';

import Link from 'next/link';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function UserNav() {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
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
          onClick={signOut}
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
