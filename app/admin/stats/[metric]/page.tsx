'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date();
      const startOfWeekDate = new Date(now);
      const day = startOfWeekDate.getDay() || 7;
      startOfWeekDate.setHours(0, 0, 0, 0);
      startOfWeekDate.setDate(startOfWeekDate.getDate() - (day - 1));

      try {
        const response = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des stats');
        }
        const data = await response.json();

        const dateKey = (value: Date) => value.toISOString().split('T')[0];
        const startOfDayKey = dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
        const startOfWeekKey = dateKey(startOfWeekDate);
        const startOfMonthKey = dateKey(new Date(now.getFullYear(), now.getMonth(), 1));
        const startOfYearKey = dateKey(new Date(now.getFullYear(), 0, 1));

        const dailyData = Array.isArray(data.dailyData) ? data.dailyData : [];
        const sumFrom = (startKey: string) => {
          return dailyData.reduce(
            (acc: { sales: number; revenue: number }, entry: any) => {
              if (!entry?.date || entry.date < startKey) return acc;
              acc.sales += Number(entry.sales || 0);
              acc.revenue += Number(entry.revenue || 0);
              return acc;
            },
            { sales: 0, revenue: 0 }
          );
        };

        const salesTodayData = sumFrom(startOfDayKey);
        const salesWeekData = sumFrom(startOfWeekKey);
        const salesMonthData = sumFrom(startOfMonthKey);
        const salesYearData = sumFrom(startOfYearKey);

        setStats({
          totalVisits: Number(data.totalVisits || 0),
          uniqueVisitors: Number(data.uniqueVisitors || 0),
          visitsToday: Number(data.visitsToday || 0),
          visitsThisWeek: Number(data.visitsThisWeek || 0),
          visitsThisMonth: Number(data.visitsThisMonth || 0),
          visitsThisYear: Number(data.visitsThisYear || 0),
          totalSales: Number(data.totalSales || 0),
          salesToday: salesTodayData.sales,
          salesThisWeek: salesWeekData.sales,
          salesThisMonth: salesMonthData.sales,
          salesThisYear: salesYearData.sales,
          totalRevenue: Number(data.totalRevenue || 0),
          revenueToday: salesTodayData.revenue,
          revenueThisWeek: salesWeekData.revenue,
          revenueThisMonth: salesMonthData.revenue,
          revenueThisYear: salesYearData.revenue,
          totalProducts: Number(data.totalProducts || 0),
          totalCustomers: Number(data.totalCustomers || 0),
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
