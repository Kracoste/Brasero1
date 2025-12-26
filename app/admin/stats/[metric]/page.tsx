'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Eye, Euro, ShoppingCart, Users, Package } from 'lucide-react';

type Metric = 'visites' | 'ca' | 'ventes' | 'clients' | 'catalogue';

type ChartSeries = {
  label: string;
  color: string;
  values: number[];
};

type Stats = {
  totalVisits: number;
  uniqueVisitors: number;
  visitsToday: number;
  visitsThisWeek: number;
  visitsThisMonth: number;
  visitsThisYear: number;
  totalSales: number;
  salesToday: number;
  salesThisWeek: number;
  salesThisMonth: number;
  salesThisYear: number;
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueThisYear: number;
  totalProducts: number;
  totalCustomers: number;
};

export default function MetricPage() {
  const { metric } = useParams<{ metric: Metric }>();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
      const startOfWeekDate = new Date(now);
      const day = startOfWeekDate.getDay() || 7;
      startOfWeekDate.setHours(0, 0, 0, 0);
      startOfWeekDate.setDate(startOfWeekDate.getDate() - (day - 1));
      const startOfWeek = startOfWeekDate.toISOString();

      const countOrders = (from?: string) => {
        let query = supabase.from('orders').select('id', { count: 'exact', head: true });
        if (from) query = query.gte('created_at', from);
        return query;
      };

      const sumOrders = (from?: string) => {
        let query = supabase.from('orders').select('total_sum:sum(total)');
        if (from) query = query.gte('created_at', from);
        return query.single();
      };

      const countDistinctVisitors = async () => {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          if (!supabaseUrl || !supabaseAnonKey) return 0;

          const url = new URL(`${supabaseUrl}/rest/v1/visits`);
          url.searchParams.set('select', 'visitor_id');
          url.searchParams.set('distinct', 'visitor_id');

          const response = await fetch(url.toString(), {
            method: 'HEAD',
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
              Prefer: 'count=exact',
            },
          });

          const contentRange = response.headers.get('content-range');
          const total = contentRange?.split('/')?.[1];
          return total ? Number(total) : 0;
        } catch (error) {
          console.error('Error counting unique visitors:', error);
          return 0;
        }
      };

      try {
        const countCustomers = async () => {
        try {
          const response = await fetch('/api/admin/clients');
          const data = await response.json();
          return { count: data.clients?.length || 0 };
        } catch {
          return { count: 0 };
        }
      };

      const [
          visitsResult,
          visitsTodayResult,
          visitsWeekResult,
          visitsMonthResult,
          visitsYearResult,
          uniqueVisitors,
          totalOrdersCount,
          ordersTodayCount,
          ordersWeekCount,
          ordersMonthCount,
          ordersYearCount,
          totalRevenueResult,
          revenueTodayResult,
          revenueWeekResult,
          revenueMonthResult,
          revenueYearResult,
          productsResult,
          customersResult,
        ] = await Promise.all([
          supabase.from('visits').select('*', { count: 'exact', head: true }),
          supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', startOfDay),
          supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', startOfWeek),
          supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
          supabase.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', startOfYear),
          countDistinctVisitors(),
          countOrders(),
          countOrders(startOfDay),
          countOrders(startOfWeek),
          countOrders(startOfMonth),
          countOrders(startOfYear),
          sumOrders(),
          sumOrders(startOfDay),
          sumOrders(startOfWeek),
          sumOrders(startOfMonth),
          sumOrders(startOfYear),
          supabase.from('products').select('*', { count: 'exact', head: true }),
          countCustomers(),
        ]);

        setStats({
          totalVisits: visitsResult.count || 0,
          uniqueVisitors: typeof uniqueVisitors === 'number' ? uniqueVisitors : 0,
          visitsToday: visitsTodayResult.count || 0,
          visitsThisWeek: visitsWeekResult.count || 0,
          visitsThisMonth: visitsMonthResult.count || 0,
          visitsThisYear: visitsYearResult.count || 0,
          totalSales: totalOrdersCount.count || 0,
          salesToday: ordersTodayCount.count || 0,
          salesThisWeek: ordersWeekCount.count || 0,
          salesThisMonth: ordersMonthCount.count || 0,
          salesThisYear: ordersYearCount.count || 0,
          totalRevenue: Number(totalRevenueResult.data?.total_sum) || 0,
          revenueToday: Number(revenueTodayResult.data?.total_sum) || 0,
          revenueThisWeek: Number(revenueWeekResult.data?.total_sum) || 0,
          revenueThisMonth: Number(revenueMonthResult.data?.total_sum) || 0,
          revenueThisYear: Number(revenueYearResult.data?.total_sum) || 0,
          totalProducts: productsResult.count || 0,
          totalCustomers: customersResult.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const { title, icon } = useMemo(() => {
    const map: Record<Metric, { title: string; icon: React.ReactNode }> = {
      visites: { title: 'Visites', icon: <Eye className="h-5 w-5 text-emerald-600" /> },
      ca: { title: "Chiffre d'affaires", icon: <Euro className="h-5 w-5 text-sky-600" /> },
      ventes: { title: 'Ventes', icon: <ShoppingCart className="h-5 w-5 text-amber-600" /> },
      clients: { title: 'Clients', icon: <Users className="h-5 w-5 text-purple-600" /> },
      catalogue: { title: 'Catalogue', icon: <Package className="h-5 w-5 text-blue-600" /> },
    };
    return map[metric] || map.visites;
  }, [metric]);

  const xLabels = useMemo(() => ["Aujourd'hui", 'Cette semaine', 'Ce mois', "Cette année"], []);

  const series = useMemo<ChartSeries[]>(() => {
    if (!stats) return [];
    switch (metric) {
      case 'visites':
        return [
          {
            label: 'Visites',
            color: '#10b981',
            values: [stats.visitsToday, stats.visitsThisWeek, stats.visitsThisMonth, stats.visitsThisYear],
          },
        ];
      case 'ca':
        return [
          {
            label: 'Revenus',
            color: '#0ea5e9',
            values: [stats.revenueToday, stats.revenueThisWeek, stats.revenueThisMonth, stats.revenueThisYear],
          },
        ];
      case 'ventes':
        return [
          {
            label: 'Ventes',
            color: '#f59e0b',
            values: [stats.salesToday, stats.salesThisWeek, stats.salesThisMonth, stats.salesThisYear],
          },
        ];
      case 'clients': {
        const nonInscrits = Math.max(stats.uniqueVisitors - stats.totalCustomers, 0);
        return [
          {
            label: 'Inscrits',
            color: '#8b5cf6',
            values: Array(xLabels.length).fill(stats.totalCustomers),
          },
          {
            label: 'Non inscrits',
            color: '#94a3b8',
            values: Array(xLabels.length).fill(nonInscrits),
          },
        ];
      }
      case 'catalogue':
        return [{ label: 'Produits', color: '#0ea5e9', values: Array(xLabels.length).fill(stats.totalProducts) }];
      default:
        return [];
    }
  }, [metric, stats, xLabels.length]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

  const formatValue = (value: number) =>
    metric === 'ca' ? formatCurrency(value) : value.toLocaleString('fr-FR');

  if (loading || !stats) {
    return (
      <div className="p-8">
        <p className="text-sm text-slate-500">Chargement du graphique…</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
        <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-800">
          / Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">{icon}</div>
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Analyse</p>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          </div>
        </div>

        <LargeSparkline series={series} xLabels={xLabels} formatValue={formatValue} />

        <div className="flex flex-wrap gap-3">
          {series.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700"
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-semibold">{s.label}</span>
              <span className="text-slate-500">{formatValue(s.values[s.values.length - 1] ?? 0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const LargeSparkline = ({
  series,
  xLabels,
  formatValue,
}: {
  series: ChartSeries[];
  xLabels: string[];
  formatValue: (value: number) => string;
}) => {
  const width = 760;
  const height = 280;
  const padding = 40;
  const maxValue = Math.max(1, ...series.flatMap((s) => s.values));

  const xForIndex = (index: number, length: number) => {
    const denom = Math.max(length - 1, 1);
    return padding + (index / denom) * (width - padding * 2);
  };

  const toPoints = (values: number[]) => {
    return values
      .map((value, index) => {
        const x = xForIndex(index, values.length);
        const y = height - padding - (Math.max(0, value) / maxValue) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');
  };

  const gridLinesY = Array.from({ length: 5 }, (_, i) => padding + ((height - padding * 2) / 4) * i);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[360px]">
        <rect x={0} y={0} width={width} height={height} rx={16} fill="#f8fafc" />
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
              <circle cx={x} cy={y} r={4} fill={line.color} />
              <text x={x + 6} y={y - 6} className="text-xs" fill="#334155">
                {formatValue(line.values[line.values.length - 1] ?? 0)}
              </text>
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
            fill="#64748b"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
};
