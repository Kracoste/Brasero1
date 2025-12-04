'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TrendingUp, Users, ShoppingCart, Euro, Eye, Package, Globe, Clock } from 'lucide-react';

type Stats = {
  totalVisits: number;
  todayVisits: number;
  uniqueVisitors: number;
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  topPages: Array<{ page: string; count: number }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    date: string;
    status: string;
  }>;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVisits: 0,
    todayVisits: 0,
    uniqueVisitors: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    topPages: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer les visites
        const { data: visits, count: totalVisitsCount } = await supabase
          .from('visits')
          .select('*', { count: 'exact' });

        // Visites aujourd'hui
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: todayVisitsCount } = await supabase
          .from('visits')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        // Visiteurs uniques
        const uniqueVisitorIds = new Set(visits?.map((v: any) => v.visitor_id) || []);

        // Pages les plus visitées
        const pageCount: Record<string, number> = {};
        visits?.forEach((v: any) => {
          pageCount[v.page] = (pageCount[v.page] || 0) + 1;
        });
        const topPages = Object.entries(pageCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([page, count]) => ({ page, count }));

        // Récupérer les commandes
        const { data: orders } = await supabase
          .from('orders')
          .select('*');

        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        const { count: customersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;

        setStats({
          totalVisits: totalVisitsCount || 0,
          todayVisits: todayVisitsCount || 0,
          uniqueVisitors: uniqueVisitorIds.size,
          totalSales: orders?.length || 0,
          totalRevenue: totalRevenue,
          totalProducts: productsCount || 0,
          totalCustomers: customersCount || 0,
          topPages: topPages,
          recentOrders: orders?.slice(0, 5).map((order: any) => ({
            id: order.id,
            customer: order.customer_name || 'Client',
            amount: order.total || 0,
            date: new Date(order.created_at).toLocaleDateString('fr-FR'),
            status: order.status || 'pending',
          })) || [],
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalVisits: 0,
          todayVisits: 0,
          uniqueVisitors: 0,
          totalSales: 0,
          totalRevenue: 0,
          totalProducts: 0,
          totalCustomers: 0,
          topPages: [],
          recentOrders: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Bienvenue dans votre panneau d'administration</p>
      </div>

      {/* Statistiques de visites */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">📊 Statistiques de visites</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Visites totales</p>
                <p className="text-4xl font-bold mt-1">{stats.totalVisits.toLocaleString()}</p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center">
                <Eye className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Visites aujourd'hui</p>
                <p className="text-4xl font-bold mt-1">{stats.todayVisits.toLocaleString()}</p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Visiteurs uniques</p>
                <p className="text-4xl font-bold mt-1">{stats.uniqueVisitors.toLocaleString()}</p>
              </div>
              <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center">
                <Globe className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pages les plus visitées */}
      {stats.topPages.length > 0 && (
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">🔥 Pages les plus visitées</h3>
          <div className="space-y-3">
            {stats.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-400 w-6">#{index + 1}</span>
                  <span className="text-sm text-slate-700">{page.page === '/' ? 'Accueil' : page.page}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{page.count} visites</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques principales */}
      <h2 className="text-xl font-semibold text-slate-900 mb-4">💼 Statistiques commerciales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Produits</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalProducts}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Ventes totales</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalSales}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Chiffre d'affaires</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Euro className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Clients</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalCustomers}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Dernières commandes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Dernières commandes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.customer}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {order.status === 'completed' ? 'Terminée' : order.status === 'pending' ? 'En attente' : order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Aucune commande pour le moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
