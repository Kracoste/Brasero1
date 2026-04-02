'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, ChevronLeft, Menu, X, FileText, Ticket } from 'lucide-react';

import { AdminSignOutButton } from '@/components/AdminSignOutButton';
import { AuthProvider } from '@/lib/auth-context';

type AdminLayoutClientProps = {
  children: ReactNode;
};

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/produits', icon: Package, label: 'Produits' },
  { href: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
  { href: '/admin/clients', icon: Users, label: 'Clients' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/codes-promo', icon: Ticket, label: 'Codes promo' },
  { href: '/admin/parametres', icon: Settings, label: 'Paramètres' },
];

function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="p-4 sm:p-6 border-b border-white/20">
        <h1 className="text-xl font-bold">Admin LBF</h1>
        <p className="text-sm text-slate-400 mt-1">Panneau d&apos;administration</p>
      </div>
      <nav className="flex-1 p-3 sm:p-4">
        <ul className="space-y-1 sm:space-y-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition"
              >
                <Icon size={20} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 sm:p-4 border-t border-white/20">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-white/70"
        >
          <ChevronLeft size={20} />
          Retour au site
        </Link>
        <AdminSignOutButton className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-red-300 w-full mt-2" />
      </div>
    </>
  );
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="flex h-screen bg-white">
        {/* Mobile header - only visible when sidebar is hidden */}
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 text-white lg:hidden" style={{ background: 'linear-gradient(to right, #8B4513, #5D3A1A)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 rounded-lg hover:bg-white/10 transition"
            aria-label="Ouvrir le menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold">Admin LBF</h1>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed inset-y-0 left-0 w-72 text-white flex flex-col z-50" style={{ background: 'linear-gradient(to bottom, #8B4513, #5D3A1A, #3D2314)' }}>
              <div className="flex items-center justify-end p-3">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 transition"
                  aria-label="Fermer le menu"
                >
                  <X size={24} />
                </button>
              </div>
              <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-64 text-white flex-col flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #8B4513, #5D3A1A, #3D2314)' }}>
          <AdminSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto pt-14 lg:pt-0">{children}</main>
      </div>
    </AuthProvider>
  );
}
