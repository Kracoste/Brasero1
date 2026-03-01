import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

// Force dynamic pour éviter le cache en production
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// Cache simple en mémoire (best-effort : réinitialisé à chaque cold start en serverless).
// Pour une mise en cache fiable, migrer vers Redis/Upstash.
let analyticsCache: { data: Record<string, unknown>; timestamp: number } | null = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function GET(request: NextRequest) {
  try {
    // Rate limiting admin (20 requêtes/min pour analytics - plus restrictif car coûteux)
    const clientIP = getClientIP(request.headers);
    if (!checkRateLimit(`admin-analytics-${clientIP}`, 20, 60000)) {
      return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
    }

    // Vérifier que l'utilisateur est admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Retourner le cache s'il est encore valide
    if (analyticsCache && Date.now() - analyticsCache.timestamp < CACHE_TTL) {
      return NextResponse.json(analyticsCache.data);
    }

    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfWeekDate = new Date(now);
    const day = startOfWeekDate.getDay() || 7;
    startOfWeekDate.setHours(0, 0, 0, 0);
    startOfWeekDate.setDate(startOfWeekDate.getDate() - (day - 1));
    const startOfWeek = startOfWeekDate.toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // OPTIMISATION: Utiliser les filtres Supabase côté serveur (gte/lte) pour limiter
    // les données transférées. Les counts par période utilisent head:true + count:'exact'
    // quand possible pour éviter de charger toutes les lignes.
    const [
      // Counts de sessions par période (légers, head-only)
      sessionsTodayCount,
      sessionsWeekCount,
      sessionsMonthCount,
      sessionsYearCount,
      sessionsTotalCount,
      // Sessions du mois (avec métriques de qualité : bounce, durée, pages)
      sessionsMonthData,
      // Sessions de l'année (champs minimaux pour le graphique journalier)
      sessionsYearDaily,
      // Unique visitors par période (nécessite visitor_id)
      uniqueVisitorsToday,
      uniqueVisitorsWeek,
      uniqueVisitorsMonth,
      uniqueVisitorsYear,
      uniqueVisitorsTotal,
      // Événements de conversion ce mois
      conversionEvents,
      // Commandes filtrées par période (counts)
      ordersTodayData,
      ordersWeekData,
      ordersMonthData,
      ordersYearData,
      ordersTotalData,
      // Commandes récentes (5)
      recentOrders,
      // Commandes de l'année (pour le graphique journalier)
      ordersYearDaily,
      // Page views de l'année (pour le graphique journalier)
      pageViewsYear,
      // Counts
      productsCount,
      customersCount,
    ] = await Promise.all([
      // Session counts par période
      adminClient.from('visitor_sessions').select('id', { count: 'exact', head: true })
        .eq('is_admin', false).gte('started_at', startOfDay),
      adminClient.from('visitor_sessions').select('id', { count: 'exact', head: true })
        .eq('is_admin', false).gte('started_at', startOfWeek),
      adminClient.from('visitor_sessions').select('id', { count: 'exact', head: true })
        .eq('is_admin', false).gte('started_at', startOfMonth),
      adminClient.from('visitor_sessions').select('id', { count: 'exact', head: true })
        .eq('is_admin', false).gte('started_at', startOfYear),
      adminClient.from('visitor_sessions').select('id', { count: 'exact', head: true })
        .eq('is_admin', false).gte('started_at', oneYearAgo.toISOString()),
      // Sessions du mois avec métriques de qualité
      adminClient.from('visitor_sessions')
        .select('page_count, duration_seconds, is_bounce')
        .eq('is_admin', false)
        .gte('started_at', startOfMonth),
      // Sessions de l'année (minimal : date + visitor_id pour daily chart)
      adminClient.from('visitor_sessions')
        .select('started_at, visitor_id')
        .eq('is_admin', false)
        .gte('started_at', oneYearAgo.toISOString()),
      // Unique visitors par période (only visitor_id)
      adminClient.from('visitor_sessions').select('visitor_id')
        .eq('is_admin', false).gte('started_at', startOfDay),
      adminClient.from('visitor_sessions').select('visitor_id')
        .eq('is_admin', false).gte('started_at', startOfWeek),
      adminClient.from('visitor_sessions').select('visitor_id')
        .eq('is_admin', false).gte('started_at', startOfMonth),
      adminClient.from('visitor_sessions').select('visitor_id')
        .eq('is_admin', false).gte('started_at', startOfYear),
      adminClient.from('visitor_sessions').select('visitor_id')
        .eq('is_admin', false).gte('started_at', oneYearAgo.toISOString()),
      // Conversion events (mois courant)
      adminClient.from('conversion_events')
        .select('event_type, session_id, product_slug, product_name, quantity')
        .gte('created_at', startOfMonth),
      // Orders par période
      adminClient.from('orders')
        .select('total_amount').gte('created_at', startOfDay),
      adminClient.from('orders')
        .select('total_amount').gte('created_at', startOfWeek),
      adminClient.from('orders')
        .select('total_amount').gte('created_at', startOfMonth),
      adminClient.from('orders')
        .select('total_amount').gte('created_at', startOfYear),
      adminClient.from('orders')
        .select('total_amount').gte('created_at', oneYearAgo.toISOString()),
      // Commandes récentes
      adminClient.from('orders')
        .select('id, customer_name, total_amount, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5),
      // Commandes de l'année (champs minimaux pour daily chart)
      adminClient.from('orders')
        .select('total_amount, created_at')
        .gte('created_at', oneYearAgo.toISOString()),
      // Page views de l'année
      adminClient.from('page_views')
        .select('viewed_at')
        .gte('viewed_at', oneYearAgo.toISOString()),
      // Counts
      adminClient.from('products').select('id', { count: 'exact', head: true }),
      adminClient.from('profiles').select('id', { count: 'exact', head: true }),
    ]);

    // Métriques moyennes (ce mois)
    const monthMetrics = sessionsMonthData.data || [];
    const totalSessionsMonth = monthMetrics.length;
    const avgPagesPerSession = totalSessionsMonth > 0 
      ? monthMetrics.reduce((sum, m) => sum + (m.page_count || 0), 0) / totalSessionsMonth 
      : 0;
    const sessionsWithDuration = monthMetrics.filter(m => m.duration_seconds > 0);
    const avgSessionDuration = sessionsWithDuration.length > 0
      ? sessionsWithDuration.reduce((sum, m) => sum + m.duration_seconds, 0) / sessionsWithDuration.length
      : 0;
    const bounceCount = monthMetrics.filter(m => m.is_bounce).length;
    const bounceRate = totalSessionsMonth > 0 ? (bounceCount / totalSessionsMonth) * 100 : 0;

    // Visiteurs uniques par période
    const countUnique = (data: { visitor_id: string }[] | null) => new Set((data || []).map(v => v.visitor_id)).size;

    // Entonnoir de conversion
    const events = conversionEvents.data || [];
    const sessionEvents = new Map<string, Set<string>>();
    events.forEach(e => {
      if (!sessionEvents.has(e.session_id)) {
        sessionEvents.set(e.session_id, new Set());
      }
      sessionEvents.get(e.session_id)!.add(e.event_type);
    });

    const sessionsWithProductView = Array.from(sessionEvents.values()).filter(s => s.has('product_view')).length;
    const sessionsWithAddToCart = Array.from(sessionEvents.values()).filter(s => s.has('add_to_cart')).length;
    const sessionsWithCheckout = Array.from(sessionEvents.values()).filter(s => s.has('checkout_start')).length;
    const sessionsWithPurchase = Array.from(sessionEvents.values()).filter(s => s.has('purchase')).length;

    const monthSessionCount = totalSessionsMonth || 1;
    const conversionFunnel: ConversionFunnel = {
      totalSessions: monthSessionCount,
      productViews: sessionsWithProductView,
      addToCart: sessionsWithAddToCart,
      checkoutStart: sessionsWithCheckout,
      purchases: sessionsWithPurchase,
      viewRate: Math.round((sessionsWithProductView / monthSessionCount) * 100 * 10) / 10,
      cartRate: Math.round((sessionsWithAddToCart / monthSessionCount) * 100 * 10) / 10,
      checkoutRate: Math.round((sessionsWithCheckout / monthSessionCount) * 100 * 10) / 10,
      purchaseRate: Math.round((sessionsWithPurchase / monthSessionCount) * 100 * 10) / 10,
    };

    // Top produits vus
    const productViewEvents = events.filter(e => e.event_type === 'product_view' && e.product_slug);
    const productViewCounts = new Map<string, { slug: string; name: string; count: number }>();
    productViewEvents.forEach((p: { product_slug: string; product_name?: string }) => {
      const key = p.product_slug;
      if (!productViewCounts.has(key)) {
        productViewCounts.set(key, { slug: key, name: p.product_name || key, count: 0 });
      }
      productViewCounts.get(key)!.count++;
    });
    const topViewed = Array.from(productViewCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top produits ajoutés au panier
    const cartEvents = events.filter(e => e.event_type === 'add_to_cart' && e.product_slug);
    const productCartCounts = new Map<string, { slug: string; name: string; count: number; quantity: number }>();
    cartEvents.forEach((p: { product_slug: string; product_name?: string; quantity?: number }) => {
      const key = p.product_slug;
      if (!productCartCounts.has(key)) {
        productCartCounts.set(key, { slug: key, name: p.product_name || key, count: 0, quantity: 0 });
      }
      productCartCounts.get(key)!.count++;
      productCartCounts.get(key)!.quantity += p.quantity || 1;
    });
    const topCarted = Array.from(productCartCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Revenue helper
    const calcRevenue = (data: { total_amount?: number }[] | null) => (data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0);

    // Données journalières (sessions)
    const dailyMap = new Map<string, DailyData>();
    const yearSessions = sessionsYearDaily.data || [];
    yearSessions.forEach((s) => {
      const date = s.started_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, sessions: 0, uniqueVisitors: 0, pageViews: 0, revenue: 0, sales: 0 });
      }
      dailyMap.get(date)!.sessions++;
    });

    // Visiteurs uniques par jour
    const visitorsByDay = new Map<string, Set<string>>();
    yearSessions.forEach((s) => {
      const date = s.started_at.split('T')[0];
      if (!visitorsByDay.has(date)) visitorsByDay.set(date, new Set());
      visitorsByDay.get(date)!.add(s.visitor_id);
    });
    visitorsByDay.forEach((visitors, date) => {
      if (dailyMap.has(date)) {
        dailyMap.get(date)!.uniqueVisitors = visitors.size;
      }
    });

    // Orders journaliers
    const yearOrders = ordersYearDaily.data || [];
    yearOrders.forEach((o) => {
      const date = o.created_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, sessions: 0, uniqueVisitors: 0, pageViews: 0, revenue: 0, sales: 0 });
      }
      dailyMap.get(date)!.sales++;
      dailyMap.get(date)!.revenue += o.total_amount || 0;
    });

    // Page views par jour
    const pageViews = pageViewsYear.data || [];
    pageViews.forEach((p) => {
      const date = p.viewed_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, sessions: 0, uniqueVisitors: 0, pageViews: 0, revenue: 0, sales: 0 });
      }
      dailyMap.get(date)!.pageViews++;
    });

    const dailyData = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Commandes récentes formatées
    const formattedRecentOrders = (recentOrders.data || []).map((order: { id: string; customer_name?: string; total_amount?: number; created_at: string; status?: string }) => ({
      id: order.id,
      customer: order.customer_name || 'Client',
      amount: order.total_amount || 0,
      date: new Date(order.created_at).toLocaleDateString('fr-FR'),
      status: order.status || 'pending',
    }));

    const responseData = {
      // Sessions
      totalSessions: sessionsTotalCount.count || 0,
      sessionsToday: sessionsTodayCount.count || 0,
      sessionsThisWeek: sessionsWeekCount.count || 0,
      sessionsThisMonth: sessionsMonthCount.count || 0,
      sessionsThisYear: sessionsYearCount.count || 0,
      
      // Alias pour rétrocompatibilité avec /api/admin/stats
      totalVisits: sessionsTotalCount.count || 0,
      visitsToday: sessionsTodayCount.count || 0,
      visitsThisWeek: sessionsWeekCount.count || 0,
      visitsThisMonth: sessionsMonthCount.count || 0,
      visitsThisYear: sessionsYearCount.count || 0,
      
      // Visiteurs uniques
      uniqueVisitors: countUnique(uniqueVisitorsTotal.data),
      uniqueVisitorsToday: countUnique(uniqueVisitorsToday.data),
      uniqueVisitorsThisWeek: countUnique(uniqueVisitorsWeek.data),
      uniqueVisitorsThisMonth: countUnique(uniqueVisitorsMonth.data),
      uniqueVisitorsThisYear: countUnique(uniqueVisitorsYear.data),
      
      // Métriques de qualité
      avgPagesPerSession: Math.round(avgPagesPerSession * 10) / 10,
      avgSessionDuration: Math.round(avgSessionDuration),
      bounceRate: Math.round(bounceRate * 10) / 10,
      
      // Entonnoir de conversion
      conversionFunnel,
      
      // Top produits
      topProductsViewed: topViewed,
      topProductsCarted: topCarted,
      
      // Ventes
      totalSales: (ordersTotalData.data || []).length,
      salesToday: (ordersTodayData.data || []).length,
      salesThisWeek: (ordersWeekData.data || []).length,
      salesThisMonth: (ordersMonthData.data || []).length,
      salesThisYear: (ordersYearData.data || []).length,
      
      // Revenue
      totalRevenue: calcRevenue(ordersTotalData.data),
      revenueToday: calcRevenue(ordersTodayData.data),
      revenueThisWeek: calcRevenue(ordersWeekData.data),
      revenueThisMonth: calcRevenue(ordersMonthData.data),
      revenueThisYear: calcRevenue(ordersYearData.data),
      
      // Autres
      totalProducts: productsCount.count || 0,
      totalCustomers: customersCount.count || 0,
      recentOrders: formattedRecentOrders,
      
      // Données journalières
      dailyData,
    };

    // Mettre en cache
    analyticsCache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json(responseData);

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur récupération analytics:', error);
    }
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
