'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, ChevronLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('Chargement...');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('Admin check - User:', user?.id, user?.email);
      
      if (!user) {
        setDebugInfo('Pas d\'utilisateur connecté - redirection vers connexion');
        console.log('Admin check - No user, redirecting to login');
        router.push('/connexion?redirect=/admin');
        return;
      }

      setDebugInfo(`Utilisateur: ${user.email} - Vérification du rôle...`);

      // Vérifier si l'utilisateur est admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('Admin check - Profile:', profile, 'Error:', error);

      if (error) {
        setDebugInfo(`Erreur: ${error.message}`);
        return;
      }

      if (!profile) {
        setDebugInfo(`Profil non trouvé pour ${user.email}`);
        return;
      }

      if (profile?.role !== 'admin') {
        setDebugInfo(`Rôle: "${profile?.role}" (pas admin) - redirection vers accueil`);
        console.log('Admin check - Not admin, redirecting to home');
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      console.log('Admin check - SUCCESS, user is admin');
      setDebugInfo('Accès admin autorisé !');
      setIsAdmin(true);
      setLoading(false);
    };

    checkAdmin();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Vérification des accès...</p>
          <p className="mt-2 text-sm text-slate-500 bg-white p-3 rounded-lg mt-4 max-w-md">{debugInfo}</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">Admin LBF</h1>
          <p className="text-sm text-slate-400 mt-1">Panneau d'administration</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/produits"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
              >
                <Package size={20} />
                Produits
              </Link>
            </li>
            <li>
              <Link
                href="/admin/commandes"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
              >
                <ShoppingCart size={20} />
                Commandes
              </Link>
            </li>
            <li>
              <Link
                href="/admin/clients"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
              >
                <Users size={20} />
                Clients
              </Link>
            </li>
            <li>
              <Link
                href="/admin/parametres"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition"
              >
                <Settings size={20} />
                Paramètres
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-slate-400"
          >
            <ChevronLeft size={20} />
            Retour au site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-red-400 w-full mt-2"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
