'use client';

import { LogOut } from 'lucide-react';

import { useAuth } from '@/lib/auth-context';

type AdminSignOutButtonProps = {
  className?: string;
};

export function AdminSignOutButton({ className }: AdminSignOutButtonProps) {
  const { signOut } = useAuth();

  return (
    <button
      type="button"
      onClick={signOut}
      className={className}
    >
      <LogOut size={20} />
      Déconnexion
    </button>
  );
}
