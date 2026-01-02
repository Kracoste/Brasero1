'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

type Metric = 'visites' | 'ca' | 'ventes' | 'clients' | 'conversion';
type Period = 'week' | 'month' | 'year';

type ChartSeries = {
  label: string;
  color: string;
  values: number[];
};

type DailyData = {
  date: string;
  sessions: number;
  uniqueVisitors: number;
  pageViews: number;
  revenue: number;
  sales: number;
};

type ConversionFunnel = {
  totalSessions: number;
  productViews: number;
  addToCart: number;
  checkoutStart: number;
  purchases: number;
  viewRate: number;
  cartRate: number;
  checkoutRate: number;
  purchaseRate: number;
};

type TopProduct = {
  slug: string;
  name: string;
  count: number;
  quantity?: number;
};

type Stats = {
  // Sessions (remplace les visites)
  totalSessions: number;
  sessionsToday: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  sessionsThisYear: number;
  // Visiteurs uniques
  uniqueVisitors: number;
  uniqueVisitorsToday: number;
  uniqueVisitorsThisWeek: number;
  uniqueVisitorsThisMonth: number;
  uniqueVisitorsThisYear: number;
  // Métriques de qualité
  avgPagesPerSession: number;
  avgSessionDuration: number;
  bounceRate: number;
  // Entonnoir de conversion
  conversionFunnel: ConversionFunnel;
  // Top produits
  topProductsViewed: TopProduct[];
  topProductsCarted: TopProduct[];
  // Ventes
  totalSales: number;
  salesToday: number;
  salesThisWeek: number;
  salesThisMonth: number;
  salesThisYear: number;
  // CA
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueThisYear: number;
  // Autres
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    date: string;
    status: string;
  }>;
  // Données journalières pour les graphiques
  dailyData: DailyData[];
};

export default function AdminDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<Metric>('visites');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    sessionsToday: 0,
    sessionsThisWeek: 0,
    sessionsThisMonth: 0,
    sessionsThisYear: 0,
    uniqueVisitors: 0,
    uniqueVisitorsToday: 0,
    uniqueVisitorsThisWeek: 0,
    uniqueVisitorsThisMonth: 0,
    uniqueVisitorsThisYear: 0,
    avgPagesPerSession: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    conversionFunnel: {
      totalSessions: 0,
      productViews: 0,
      addToCart: 0,
      checkoutStart: 0,
      purchases: 0,
      viewRate: 0,
      cartRate: 0,
      checkoutRate: 0,
      purchaseRate: 0,
    },
    topProductsViewed: [],
    topProductsCarted: [],
    totalSales: 0,
    salesToday: 0,
    salesThisWeek: 0,
    salesThisMonth: 0,
    salesThisYear: 0,
    totalRevenue: 0,
    revenueToday: 0,
    revenueThisWeek: 0,
    revenueThisMonth: 0,
    revenueThisYear: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    dailyData: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const supabase = useMemo(() => createClient(), []);

  // Fonction pour forcer le rafraîchissement
  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Charger les stats via la nouvelle API analytics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des analytics');
        }
        const data = await response.json();
        
        setStats({
          totalSessions: data.totalSessions || 0,
          sessionsToday: data.sessionsToday || 0,
          sessionsThisWeek: data.sessionsThisWeek || 0,
          sessionsThisMonth: data.sessionsThisMonth || 0,
          sessionsThisYear: data.sessionsThisYear || 0,
          uniqueVisitors: data.uniqueVisitors || 0,
          uniqueVisitorsToday: data.uniqueVisitorsToday || 0,
          uniqueVisitorsThisWeek: data.uniqueVisitorsThisWeek || 0,
          uniqueVisitorsThisMonth: data.uniqueVisitorsThisMonth || 0,
          uniqueVisitorsThisYear: data.uniqueVisitorsThisYear || 0,
          avgPagesPerSession: data.avgPagesPerSession || 0,
          avgSessionDuration: data.avgSessionDuration || 0,
          bounceRate: data.bounceRate || 0,
          conversionFunnel: data.conversionFunnel || {
            totalSessions: 0, productViews: 0, addToCart: 0, checkoutStart: 0, purchases: 0,
            viewRate: 0, cartRate: 0, checkoutRate: 0, purchaseRate: 0,
          },
          topProductsViewed: data.topProductsViewed || [],
          topProductsCarted: data.topProductsCarted || [],
          totalSales: data.totalSales || 0,
          salesToday: data.salesToday || 0,
          salesThisWeek: data.salesThisWeek || 0,
          salesThisMonth: data.salesThisMonth || 0,
          salesThisYear: data.salesThisYear || 0,
          totalRevenue: data.totalRevenue || 0,
          revenueToday: data.revenueToday || 0,
          revenueThisWeek: data.revenueThisWeek || 0,
          revenueThisMonth: data.revenueThisMonth || 0,
          revenueThisYear: data.revenueThisYear || 0,
          totalProducts: data.totalProducts || 0,
          totalCustomers: data.totalCustomers || 0,
          recentOrders: data.recentOrders || [],
          dailyData: data.dailyData || [],
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshKey]);

  // Rafraîchissement automatique et abonnements Realtime
  useEffect(() => {
    // Rafraîchissement automatique toutes les 30 secondes
    const intervalId = setInterval(() => {
      triggerRefresh();
    }, 30000);

    // Abonnement temps réel aux nouvelles sessions
    const sessionsChannel = supabase
      .channel('admin-sessions-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'visitor_sessions' },
        (payload: { new: Record<string, unknown> }) => {
          console.log('Nouvelle session détectée:', payload);
          triggerRefresh();
        }
      )
      .subscribe((status: string) => {
        console.log('Sessions channel status:', status);
      });

    // Abonnement temps réel aux nouvelles commandes
    const ordersChannel = supabase
      .channel('admin-orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload: { new: Record<string, unknown> }) => {
          console.log('Changement commande détecté:', payload);
          triggerRefresh();
        }
      )
      .subscribe((status: string) => {
        console.log('Orders channel status:', status);
      });

    // Cleanup
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [triggerRefresh, supabase]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const chartTitle = useMemo(
    () =>
      ({
        visites: 'Sessions',
        ca: "Chiffre d'affaires",
        ventes: 'Ventes',
        clients: 'Clients',
        conversion: 'Conversion',
      }[selectedMetric]),
    [selectedMetric]
  );

  const periodLabel = useMemo(
    () =>
      ({
        week: 'Cette semaine',
        month: 'Ce mois',
        year: 'Cette année',
      }[selectedPeriod]),
    [selectedPeriod]
  );

  // Générer les labels et données selon la période
  const { chartLabels, chartValues, chartDates } = useMemo(() => {
    const now = new Date();
    const dailyData = stats.dailyData;
    
    if (selectedPeriod === 'week') {
      // 7 derniers jours
      const labels: string[] = [];
      const dates: string[] = [];
      const values: { sessions: number; uniqueVisitors: number; pageViews: number; revenue: number; sales: number }[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        const fullDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        labels.push(dayName);
        dates.push(fullDate);
        
        const dayData = dailyData.find(d => d.date === dateStr);
        values.push({
          sessions: dayData?.sessions || 0,
          uniqueVisitors: dayData?.uniqueVisitors || 0,
          pageViews: dayData?.pageViews || 0,
          revenue: dayData?.revenue || 0,
          sales: dayData?.sales || 0,
        });
      }
      return { chartLabels: labels, chartValues: values, chartDates: dates };
    }
    
    if (selectedPeriod === 'month') {
      // 4 dernières semaines
      const labels: string[] = [];
      const dates: string[] = [];
      const values: { sessions: number; uniqueVisitors: number; pageViews: number; revenue: number; sales: number }[] = [];
      
      for (let w = 3; w >= 0; w--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (w * 7 + 6));
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - w * 7);
        
        const startStr = weekStart.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        const endStr = weekEnd.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        
        labels.push(`Sem. ${4 - w}`);
        dates.push(`${startStr} - ${endStr}`);
        
        let sessions = 0, uniqueVisitors = 0, pageViews = 0, revenue = 0, sales = 0;
        dailyData.forEach(d => {
          const date = new Date(d.date);
          if (date >= weekStart && date <= weekEnd) {
            sessions += d.sessions;
            uniqueVisitors += d.uniqueVisitors || 0;
            pageViews += d.pageViews || 0;
            revenue += d.revenue;
            sales += d.sales;
          }
        });
        values.push({ sessions, uniqueVisitors, pageViews, revenue, sales });
      }
      return { chartLabels: labels, chartValues: values, chartDates: dates };
    }
    
    // Cette année - 12 derniers mois
    const labels: string[] = [];
    const dates: string[] = [];
    const values: { sessions: number; uniqueVisitors: number; pageViews: number; revenue: number; sales: number }[] = [];
    
    for (let m = 11; m >= 0; m--) {
      const date = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      const fullMonth = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      labels.push(monthName);
      dates.push(fullMonth);
      
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      let sessions = 0, uniqueVisitors = 0, pageViews = 0, revenue = 0, sales = 0;
      dailyData.forEach(d => {
        if (d.date.startsWith(monthStr)) {
          sessions += d.sessions;
          uniqueVisitors += d.uniqueVisitors || 0;
          pageViews += d.pageViews || 0;
          revenue += d.revenue;
          sales += d.sales;
        }
      });
      values.push({ sessions, uniqueVisitors, pageViews, revenue, sales });
    }
    return { chartLabels: labels, chartValues: values, chartDates: dates };
  }, [selectedPeriod, stats.dailyData]);

  const totalForMetric = useMemo(() => {
    switch (selectedMetric) {
      case 'ca':
        return selectedPeriod === 'week' ? stats.revenueThisWeek :
               selectedPeriod === 'month' ? stats.revenueThisMonth : stats.revenueThisYear;
      case 'ventes':
        return selectedPeriod === 'week' ? stats.salesThisWeek :
               selectedPeriod === 'month' ? stats.salesThisMonth : stats.salesThisYear;
      case 'clients':
        return stats.totalCustomers;
      case 'conversion':
        return stats.conversionFunnel.purchaseRate;
      default:
        return selectedPeriod === 'week' ? stats.sessionsThisWeek :
               selectedPeriod === 'month' ? stats.sessionsThisMonth : stats.sessionsThisYear;
    }
  }, [selectedMetric, selectedPeriod, stats]);

  const uniqueVisitorsForPeriod = useMemo(() => {
    switch (selectedPeriod) {
      case 'week':
        return stats.uniqueVisitorsThisWeek;
      case 'month':
        return stats.uniqueVisitorsThisMonth;
      case 'year':
        return stats.uniqueVisitorsThisYear;
      default:
        return stats.uniqueVisitors;
    }
  }, [selectedPeriod, stats]);

  const chartSeries = useMemo<ChartSeries[]>(() => {
    if (!stats || chartValues.length === 0) return [];

    switch (selectedMetric) {
      case 'visites':
        return [
          {
            label: 'Sessions',
            color: '#10b981',
            values: chartValues.map(v => v.sessions),
          },
          {
            label: 'Visiteurs uniques',
            color: '#0ea5e9',
            values: chartValues.map(v => v.uniqueVisitors),
          },
          {
            label: 'Pages vues',
            color: '#8b5cf6',
            values: chartValues.map(v => v.pageViews),
          },
        ];
      case 'ca':
        return [
          {
            label: 'Chiffre d\'affaires',
            color: '#0ea5e9',
            values: chartValues.map(v => v.revenue),
          },
        ];
      case 'ventes':
        return [
          {
            label: 'Ventes',
            color: '#f59e0b',
            values: chartValues.map(v => v.sales),
          },
        ];
      case 'clients': {
        return [
          {
            label: 'Inscrits',
            color: '#8b5cf6',
            values: chartValues.map(() => stats.totalCustomers),
          },
          {
            label: 'Visiteurs uniques',
            color: '#94a3b8',
            values: chartValues.map(() => stats.uniqueVisitors),
          },
        ];
      }
      case 'conversion': {
        const funnel = stats.conversionFunnel;
        return [
          {
            label: 'Vues produit',
            color: '#10b981',
            values: chartValues.map(() => funnel.viewRate),
          },
          {
            label: 'Ajouts panier',
            color: '#f59e0b',
            values: chartValues.map(() => funnel.cartRate),
          },
          {
            label: 'Checkout',
            color: '#0ea5e9',
            values: chartValues.map(() => funnel.checkoutRate),
          },
          {
            label: 'Achats',
            color: '#ef4444',
            values: chartValues.map(() => funnel.purchaseRate),
          },
        ];
      }
      default:
        return [];
    }
  }, [selectedMetric, chartValues, stats]);

  const formatValue = (value: number) =>
    selectedMetric === 'ca'
      ? formatCurrency(value)
      : value.toLocaleString('fr-FR');

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
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.08em]">Tableau de bord</p>
        <div className="flex flex-wrap gap-3 items-baseline">
          <h1 className="text-3xl font-bold text-slate-900">Bienvenue, admin</h1>
          <span className="inline-flex items-center rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
            Vue d'ensemble en temps réel
          </span>
        </div>
        <p className="text-slate-600">Un aperçu clair des visites, ventes et commandes récentes.</p>
      </header>

      {/* Navigation haute vers les vues détaillées */}
      <nav className="flex w-full gap-3 border-b border-slate-200 pb-3">
        {[
          { label: 'Sessions', metric: 'visites' as Metric },
          { label: "Chiffre d'affaires", metric: 'ca' as Metric },
          { label: 'Ventes', metric: 'ventes' as Metric },
          { label: 'Clients', metric: 'clients' as Metric },
          { label: 'Conversion', metric: 'conversion' as Metric },
        ].map((item) => (
          <button
            key={item.metric}
            type="button"
            onClick={() => setSelectedMetric(item.metric)}
            className={`group relative flex-1 flex items-center justify-center text-sm font-semibold uppercase tracking-[0.18em] py-3 rounded-lg transition-colors ${
              selectedMetric === item.metric
                ? 'text-slate-900 bg-slate-100 shadow-inner'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {item.label}
            <span
              className={`absolute left-3 right-3 -bottom-[5px] h-[2px] bg-amber-600 transition-opacity ${
                selectedMetric === item.metric ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            ></span>
          </button>
        ))}
      </nav>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Graphique</p>
            <h2 className="text-2xl font-bold text-slate-900">{chartTitle}</h2>
            <p className="text-sm text-slate-500">{periodLabel}</p>
          </div>
          
          {/* Sélecteur de période */}
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            {[
              { label: 'Semaine', value: 'week' as Period },
              { label: 'Mois', value: 'month' as Period },
              { label: 'Année', value: 'year' as Period },
            ].map((period) => (
              <button
                key={period.value}
                type="button"
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedPeriod === period.value
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Valeur totale */}
        <div className="flex flex-wrap items-baseline gap-4">
          {selectedMetric === 'visites' ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#10b981]">
                  {totalForMetric.toLocaleString('fr-FR')}
                </span>
                <span className="text-slate-500">sessions</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#0ea5e9]">
                  {uniqueVisitorsForPeriod.toLocaleString('fr-FR')}
                </span>
                <span className="text-slate-500">visiteurs uniques</span>
              </div>
              <div className="flex items-center gap-4 ml-4 text-sm text-slate-600">
                <span>📄 {stats.avgPagesPerSession} pages/session</span>
                <span>⏱ {Math.floor(stats.avgSessionDuration / 60)}m {stats.avgSessionDuration % 60}s moy.</span>
                <span>📊 {stats.bounceRate}% rebond</span>
              </div>
            </>
          ) : selectedMetric === 'conversion' ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#ef4444]">
                  {stats.conversionFunnel.purchaseRate}%
                </span>
                <span className="text-slate-500">taux de conversion</span>
              </div>
              <div className="flex items-center gap-4 ml-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
                  {stats.conversionFunnel.viewRate}% vues produit
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span>
                  {stats.conversionFunnel.cartRate}% paniers
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#0ea5e9]"></span>
                  {stats.conversionFunnel.checkoutRate}% checkout
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-slate-900">
                {selectedMetric === 'ca' ? formatCurrency(totalForMetric) : totalForMetric.toLocaleString('fr-FR')}
              </span>
              <span className="text-slate-500">{periodLabel.toLowerCase()}</span>
            </div>
          )}
        </div>

        <LargeSparkline series={chartSeries} xLabels={chartLabels} xDates={chartDates} formatValue={formatValue} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {chartSeries.map((serie) => (
            <div
              key={serie.label}
              className="flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700"
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: serie.color }} />
              <span className="font-semibold">{serie.label}</span>
              <span className="text-slate-500">{formatValue(serie.values[serie.values.length - 1] ?? 0)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section Entonnoir de Conversion & Top Produits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entonnoir de conversion */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Entonnoir de conversion (ce mois)</h3>
          <div className="space-y-3">
            {[
              { label: 'Sessions totales', value: stats.conversionFunnel.totalSessions, color: '#94a3b8', rate: 100 },
              { label: 'Vues produit', value: stats.conversionFunnel.productViews, color: '#10b981', rate: stats.conversionFunnel.viewRate },
              { label: 'Ajouts panier', value: stats.conversionFunnel.addToCart, color: '#f59e0b', rate: stats.conversionFunnel.cartRate },
              { label: 'Checkout', value: stats.conversionFunnel.checkoutStart, color: '#0ea5e9', rate: stats.conversionFunnel.checkoutRate },
              { label: 'Achats', value: stats.conversionFunnel.purchases, color: '#ef4444', rate: stats.conversionFunnel.purchaseRate },
            ].map((step, idx) => (
              <div key={step.label} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{step.label}</span>
                  <span className="text-sm text-slate-500">{step.value} ({step.rate}%)</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${step.rate}%`, 
                      backgroundColor: step.color,
                    }}
                  />
                </div>
                {idx > 0 && (
                  <div className="absolute -top-1 right-0 text-xs text-slate-400">
                    ↓ {step.rate > 0 ? Math.round((step.value / (stats.conversionFunnel.totalSessions || 1)) * 100) : 0}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Top Produits */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top Produits (ce mois)</h3>
          
          <div className="space-y-4">
            {/* Top vus */}
            <div>
              <h4 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#10b981]"></span>
                Les plus vus
              </h4>
              {stats.topProductsViewed.length > 0 ? (
                <div className="space-y-2">
                  {stats.topProductsViewed.map((product, idx) => (
                    <div key={product.slug} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 truncate flex-1">
                        <span className="text-slate-400 mr-2">{idx + 1}.</span>
                        {product.name}
                      </span>
                      <span className="text-slate-500 ml-2">{product.count} vues</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Aucune donnée</p>
              )}
            </div>

            {/* Top ajoutés au panier */}
            <div>
              <h4 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span>
                Les plus ajoutés au panier
              </h4>
              {stats.topProductsCarted.length > 0 ? (
                <div className="space-y-2">
                  {stats.topProductsCarted.map((product, idx) => (
                    <div key={product.slug} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 truncate flex-1">
                        <span className="text-slate-400 mr-2">{idx + 1}.</span>
                        {product.name}
                      </span>
                      <span className="text-slate-500 ml-2">{product.quantity || product.count} unités</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Aucune donnée</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const LargeSparkline = ({
  series,
  xLabels,
  xDates,
  formatValue,
}: {
  series: ChartSeries[];
  xLabels: string[];
  xDates: string[];
  formatValue: (value: number) => string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const width = 760;
  const height = 280;
  const padding = 40;
  const maxValue = Math.max(1, ...series.flatMap((s) => s.values));

  const xForIndex = (index: number, length: number) => {
    const denom = Math.max(length - 1, 1);
    return padding + (index / denom) * (width - padding * 2);
  };
  
  const yForValue = (value: number) => {
    return height - padding - (Math.max(0, value) / maxValue) * (height - padding * 2);
  };

  const toPoints = (values: number[]) => {
    return values
      .map((value, index) => {
        const x = xForIndex(index, values.length);
        const y = yForValue(value);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const gridLinesY = Array.from({ length: 5 }, (_, i) => padding + ((height - padding * 2) / 4) * i);
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    
    // Trouver l'index le plus proche
    let closestIndex = 0;
    let closestDist = Infinity;
    
    for (let i = 0; i < xLabels.length; i++) {
      const x = xForIndex(i, xLabels.length);
      const dist = Math.abs(mouseX - x);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    }
    
    if (closestDist < 50) {
      setHoveredIndex(closestIndex);
      setMousePos({ x: xForIndex(closestIndex, xLabels.length), y: 0 });
    } else {
      setHoveredIndex(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto relative">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full min-w-[360px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <rect x={0} y={0} width={width} height={height} rx={16} fill="#f8fafc" />
        {/* Grille */}
        {gridLinesY.map((y, idx) => (
          <line
            key={`gy-${idx}`}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            stroke="#e2e8f0"
            strokeDasharray={idx === gridLinesY.length - 1 ? '0' : '4 4'}
            strokeWidth={1}
          />
        ))}
        {xLabels.map((_, idx) => (
          <line
            key={`gx-${idx}`}
            x1={xForIndex(idx, xLabels.length)}
            x2={xForIndex(idx, xLabels.length)}
            y1={padding}
            y2={height - padding}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
        ))}
        
        {/* Ligne verticale de hover */}
        {hoveredIndex !== null && (
          <line
            x1={mousePos.x}
            x2={mousePos.x}
            y1={padding}
            y2={height - padding}
            stroke="#94a3b8"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        )}

        {series.map((line) => {
          const points = toPoints(line.values);
          const coords = points.split(' ');
          const last = coords[coords.length - 1];
          const [x, y] = last.split(',').map(Number);

          return (
            <g key={line.label}>
              <polyline
                fill="none"
                stroke={line.color}
                strokeWidth={3}
                points={points}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Point final */}
              <circle cx={x} cy={y} r={4} fill={line.color} />
              
              {/* Points de hover */}
              {hoveredIndex !== null && (
                <circle 
                  cx={xForIndex(hoveredIndex, line.values.length)} 
                  cy={yForValue(line.values[hoveredIndex] ?? 0)} 
                  r={6} 
                  fill={line.color}
                  stroke="white"
                  strokeWidth={2}
                />
              )}
            </g>
          );
        })}

        {xLabels.map((label, idx) => (
          <text
            key={`lbl-${label}`}
            x={xForIndex(idx, xLabels.length)}
            y={height - padding + 18}
            textAnchor="middle"
            className="text-xs"
            fill={hoveredIndex === idx ? '#1e293b' : '#64748b'}
            fontWeight={hoveredIndex === idx ? 600 : 400}
          >
            {label}
          </text>
        ))}
        
        {/* Tooltip */}
        {hoveredIndex !== null && (() => {
          const tooltipWidth = 220;
          const tooltipHeight = 50 + series.length * 28;
          const tooltipX = Math.min(Math.max(mousePos.x - tooltipWidth / 2, 10), width - tooltipWidth - 10);
          const tooltipY = 15;
          
          return (
            <g>
              <rect
                x={tooltipX}
                y={tooltipY}
                width={tooltipWidth}
                height={tooltipHeight}
                rx={10}
                fill="white"
                stroke="#e2e8f0"
                strokeWidth={1}
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
              />
              <text
                x={tooltipX + tooltipWidth / 2}
                y={tooltipY + 25}
                textAnchor="middle"
                className="text-sm"
                fill="#1e293b"
                fontWeight={600}
              >
                {xDates[hoveredIndex]}
              </text>
              {series.map((line, sIdx) => (
                <g key={`tooltip-${line.label}`}>
                  <circle
                    cx={tooltipX + 15}
                    cy={tooltipY + 48 + sIdx * 28}
                    r={5}
                    fill={line.color}
                  />
                  <text
                    x={tooltipX + 28}
                    y={tooltipY + 52 + sIdx * 28}
                    className="text-xs"
                    fill="#64748b"
                  >
                    {line.label}
                  </text>
                  <text
                    x={tooltipX + tooltipWidth - 15}
                    y={tooltipY + 52 + sIdx * 28}
                    textAnchor="end"
                    className="text-xs"
                    fill="#1e293b"
                    fontWeight={600}
                  >
                    {formatValue(line.values[hoveredIndex] ?? 0)}
                  </text>
                </g>
              ))}
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
