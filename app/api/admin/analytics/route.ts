import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';

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

// Cache simple en mémoire pour réduire les requêtes
let analyticsCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes (au lieu de 30 secondes)

export async function GET() {
  try {
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

    // OPTIMISATION: Réduire à 8 requêtes principales au lieu de 27
    const [
      // 1. Toutes les sessions de l'année (on filtre côté JS)
      allSessions,
      // 2. Événements de conversion ce mois
      conversionEvents,
      // 3. Toutes les commandes
      allOrders,
      // 4. Commandes récentes (5)
      recentOrders,
      // 5. Page views de l'année
      pageViewsYear,
      // 6. Count produits
      productsCount,
      // 7. Count clients
      customersCount,
    ] = await Promise.all([
      adminClient.from('visitor_sessions')
        .select('id, visitor_id, started_at, page_count, duration_seconds, is_bounce, is_admin')
        .eq('is_admin', false)
        .gte('started_at', oneYearAgo.toISOString()),
      adminClient.from('conversion_events')
        .select('event_type, session_id, product_slug, product_name, quantity')
        .gte('created_at', startOfMonth),
      adminClient.from('orders')
        .select('id, customer_name, total_amount, created_at, status'),
      adminClient.from('orders')
        .select('id, customer_name, total_amount, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5),
      adminClient.from('page_views')
        .select('viewed_at')
        .gte('viewed_at', oneYearAgo.toISOString()),
      adminClient.from('products').select('*', { count: 'exact', head: true }),
      adminClient.from('profiles').select('*', { count: 'exact', head: true }),
    ]);

    const sessions = allSessions.data || [];
    const orders = allOrders.data || [];

    // Filtrer les sessions par période côté JS
    const sessionsToday = sessions.filter(s => s.started_at >= startOfDay);
    const sessionsWeek = sessions.filter(s => s.started_at >= startOfWeek);
    const sessionsMonth = sessions.filter(s => s.started_at >= startOfMonth);
    const sessionsYear = sessions.filter(s => s.started_at >= startOfYear);

    // Calculer les visiteurs uniques
    const countUnique = (data: { visitor_id: string }[]) => new Set(data.map(v => v.visitor_id)).size;

    // Métriques moyennes (ce mois)
    const monthMetrics = sessionsMonth;
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
    productViewEvents.forEach((p: any) => {
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
    cartEvents.forEach((p: any) => {
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

    // Filtrer les commandes par période
    const ordersToday = orders.filter(o => o.created_at >= startOfDay);
    const ordersWeek = orders.filter(o => o.created_at >= startOfWeek);
    const ordersMonth = orders.filter(o => o.created_at >= startOfMonth);
    const ordersYear = orders.filter(o => o.created_at >= startOfYear);

    const calcRevenue = (data: any[]) => data.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    // Données journalières
    const dailyMap = new Map<string, DailyData>();
    sessions.forEach((s: any) => {
      const date = s.started_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, sessions: 0, uniqueVisitors: 0, pageViews: 0, revenue: 0, sales: 0 });
      }
      dailyMap.get(date)!.sessions++;
    });

    // Visiteurs uniques par jour
    const visitorsByDay = new Map<string, Set<string>>();
    sessions.forEach((s: any) => {
      const date = s.started_at.split('T')[0];
      if (!visitorsByDay.has(date)) visitorsByDay.set(date, new Set());
      visitorsByDay.get(date)!.add(s.visitor_id);
    });
    visitorsByDay.forEach((visitors, date) => {
      if (dailyMap.has(date)) {
        dailyMap.get(date)!.uniqueVisitors = visitors.size;
      }
    });

    orders.forEach((o: any) => {
      const date = o.created_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, sessions: 0, uniqueVisitors: 0, pageViews: 0, revenue: 0, sales: 0 });
      }
      dailyMap.get(date)!.sales++;
      dailyMap.get(date)!.revenue += o.total_amount || 0;
    });

    // Page views par jour
    const pageViews = pageViewsYear.data || [];
    pageViews.forEach((p: any) => {
      const date = p.viewed_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, sessions: 0, uniqueVisitors: 0, pageViews: 0, revenue: 0, sales: 0 });
      }
      dailyMap.get(date)!.pageViews++;
    });

    const dailyData = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Commandes récentes formatées
    const formattedRecentOrders = (recentOrders.data || []).map((order: any) => ({
      id: order.id,
      customer: order.customer_name || 'Client',
      amount: order.total_amount || 0,
      date: new Date(order.created_at).toLocaleDateString('fr-FR'),
      status: order.status || 'pending',
    }));

    const responseData = {
      // Sessions (nouvelles métriques)
      totalSessions: sessions.length,
      sessionsToday: sessionsToday.length,
      sessionsThisWeek: sessionsWeek.length,
      sessionsThisMonth: sessionsMonth.length,
      sessionsThisYear: sessionsYear.length,
      
      // Alias pour rétrocompatibilité avec /api/admin/stats
      totalVisits: sessions.length,
      visitsToday: sessionsToday.length,
      visitsThisWeek: sessionsWeek.length,
      visitsThisMonth: sessionsMonth.length,
      visitsThisYear: sessionsYear.length,
      
      // Visiteurs uniques
      uniqueVisitors: countUnique(sessions),
      uniqueVisitorsToday: countUnique(sessionsToday),
      uniqueVisitorsThisWeek: countUnique(sessionsWeek),
      uniqueVisitorsThisMonth: countUnique(sessionsMonth),
      uniqueVisitorsThisYear: countUnique(sessionsYear),
      
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
      totalSales: orders.length,
      salesToday: ordersToday.length,
      salesThisWeek: ordersWeek.length,
      salesThisMonth: ordersMonth.length,
      salesThisYear: ordersYear.length,
      
      // Revenue
      totalRevenue: calcRevenue(orders),
      revenueToday: calcRevenue(ordersToday),
      revenueThisWeek: calcRevenue(ordersWeek),
      revenueThisMonth: calcRevenue(ordersMonth),
      revenueThisYear: calcRevenue(ordersYear),
      
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
