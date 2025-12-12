import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, ChevronLeft } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';
import { AdminSignOutButton } from '@/components/AdminSignOutButton';

// Vérification serveur pour éviter le loader bloquant côté client
export const dynamic = 'force-dynamic';

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/connexion?redirect=/admin');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 text-white flex flex-col" style={{ background: 'linear-gradient(to bottom, #8B4513, #5D3A1A, #3D2314)' }}>
        <div className="p-6 border-b border-white/20">
          <h1 className="text-xl font-bold">Admin LBF</h1>
          <p className="text-sm text-slate-400 mt-1">Panneau d'administration</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/produits"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
              >
                <Package size={20} />
                Produits
              </Link>
            </li>
            <li>
              <Link
                href="/admin/commandes"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
              >
                <ShoppingCart size={20} />
                Commandes
              </Link>
            </li>
            <li>
              <Link
                href="/admin/clients"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
              >
                <Users size={20} />
                Clients
              </Link>
            </li>
            <li>
              <Link
                href="/admin/parametres"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
              >
                <Settings size={20} />
                Paramètres
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-white/20">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-white/70"
          >
            <ChevronLeft size={20} />
            Retour au site
          </Link>
          <AdminSignOutButton className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-red-300 w-full mt-2" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
