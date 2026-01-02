import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';

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

export async function GET() {
  try {
    // Vérifier que l'utilisateur est admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
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

    // Requêtes parallèles pour les nouvelles tables analytics
    const [
      // Sessions (exclut les admins)
      sessionsTotal,
      sessionsToday,
      sessionsWeek,
      sessionsMonth,
      sessionsYear,
      // Visiteurs uniques
      uniqueVisitorsTotal,
      uniqueVisitorsToday,
      uniqueVisitorsWeek,
      uniqueVisitorsMonth,
      uniqueVisitorsYear,
      // Métriques moyennes
      avgMetrics,
      // Événements de conversion ce mois
      conversionEvents,
      // Données journalières pour les graphiques
      sessionsDaily,
      ordersDaily,
      pageViewsDaily,
      // Top produits vus
      topProductsViewed,
      // Top produits ajoutés au panier
      topProductsCarted,
      // Ordres pour le revenue
      ordersTotal,
      ordersToday,
      ordersWeek,
      ordersMonth,
      ordersYear,
      // Commandes récentes
      recentOrders,
      // Totaux
      productsCount,
      customersCount,
    ] = await Promise.all([
      // Sessions
      adminClient.from('visitor_sessions').select('*', { count: 'exact', head: true }).eq('is_admin', false),
      adminClient.from('visitor_sessions').select('*', { count: 'exact', head: true }).eq('is_admin', false).gte('started_at', startOfDay),
      adminClient.from('visitor_sessions').select('*', { count: 'exact', head: true }).eq('is_admin', false).gte('started_at', startOfWeek),
      adminClient.from('visitor_sessions').select('*', { count: 'exact', head: true }).eq('is_admin', false).gte('started_at', startOfMonth),
      adminClient.from('visitor_sessions').select('*', { count: 'exact', head: true }).eq('is_admin', false).gte('started_at', startOfYear),
      // Visiteurs uniques
      adminClient.from('visitor_sessions').select('visitor_id').eq('is_admin', false),
      adminClient.from('visitor_sessions').select('visitor_id').eq('is_admin', false).gte('started_at', startOfDay),
      adminClient.from('visitor_sessions').select('visitor_id').eq('is_admin', false).gte('started_at', startOfWeek),
      adminClient.from('visitor_sessions').select('visitor_id').eq('is_admin', false).gte('started_at', startOfMonth),
      adminClient.from('visitor_sessions').select('visitor_id').eq('is_admin', false).gte('started_at', startOfYear),
      // Métriques moyennes (ce mois)
      adminClient.from('visitor_sessions').select('page_count, duration_seconds, is_bounce').eq('is_admin', false).gte('started_at', startOfMonth),
      // Événements de conversion ce mois
      adminClient.from('conversion_events').select('event_type, session_id').gte('created_at', startOfMonth),
      // Données journalières
      adminClient.from('visitor_sessions').select('started_at, visitor_id').eq('is_admin', false).gte('started_at', oneYearAgo.toISOString()),
      adminClient.from('orders').select('created_at, total').gte('created_at', oneYearAgo.toISOString()),
      adminClient.from('page_views').select('viewed_at').gte('viewed_at', oneYearAgo.toISOString()),
      // Top produits
      adminClient.from('conversion_events').select('product_slug, product_name').eq('event_type', 'product_view').not('product_slug', 'is', null).gte('created_at', startOfMonth),
      adminClient.from('conversion_events').select('product_slug, product_name, quantity').eq('event_type', 'add_to_cart').not('product_slug', 'is', null).gte('created_at', startOfMonth),
      // Commandes
      adminClient.from('orders').select('id, total_amount', { count: 'exact' }),
      adminClient.from('orders').select('id, total_amount').gte('created_at', startOfDay),
      adminClient.from('orders').select('id, total_amount').gte('created_at', startOfWeek),
      adminClient.from('orders').select('id, total_amount').gte('created_at', startOfMonth),
      adminClient.from('orders').select('id, total_amount').gte('created_at', startOfYear),
      // Commandes récentes
      adminClient.from('orders').select('id, customer_name, total_amount, created_at, status').order('created_at', { ascending: false }).limit(5),
      // Totaux
      adminClient.from('products').select('*', { count: 'exact', head: true }),
      adminClient.from('profiles').select('*', { count: 'exact', head: true }),
    ]);

    // Calculer les visiteurs uniques
    const countUnique = (data: { visitor_id: string }[] | null) => {
      if (!data) return 0;
      return new Set(data.map(v => v.visitor_id)).size;
    };

    // Calculer les métriques moyennes
    const metrics = avgMetrics.data || [];
    const totalSessions = metrics.length;
    const avgPagesPerSession = totalSessions > 0 
      ? metrics.reduce((sum, m) => sum + (m.page_count || 0), 0) / totalSessions 
      : 0;
    const sessionsWithDuration = metrics.filter(m => m.duration_seconds > 0);
    const avgSessionDuration = sessionsWithDuration.length > 0
      ? sessionsWithDuration.reduce((sum, m) => sum + m.duration_seconds, 0) / sessionsWithDuration.length
      : 0;
    const bounceCount = metrics.filter(m => m.is_bounce).length;
    const bounceRate = totalSessions > 0 ? (bounceCount / totalSessions) * 100 : 0;

    // Calculer l'entonnoir de conversion
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

    const monthSessions = sessionsMonth.count || 1;
    const conversionFunnel: ConversionFunnel = {
      totalSessions: monthSessions,
      productViews: sessionsWithProductView,
      addToCart: sessionsWithAddToCart,
      checkoutStart: sessionsWithCheckout,
      purchases: sessionsWithPurchase,
      viewRate: Math.round((sessionsWithProductView / monthSessions) * 100 * 10) / 10,
      cartRate: Math.round((sessionsWithAddToCart / monthSessions) * 100 * 10) / 10,
      checkoutRate: Math.round((sessionsWithCheckout / monthSessions) * 100 * 10) / 10,
      purchaseRate: Math.round((sessionsWithPurchase / monthSessions) * 100 * 10) / 10,
    };

    // Top produits vus
    const productViewCounts = new Map<string, { slug: string; name: string; count: number }>();
    (topProductsViewed.data || []).forEach((p: any) => {
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
    const productCartCounts = new Map<string, { slug: string; name: string; count: number; quantity: number }>();
    (topProductsCarted.data || []).forEach((p: any) => {
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

    // Revenue
    const calcRevenue = (data: any[] | null) => (data || []).reduce((sum, o) => sum + (o.total_amount || o.total || 0), 0);

    // Données journalières
    const dailyMap = new Map<string, DailyData>();
    (sessionsDaily.data || []).forEach((s: any) => {
      const date = s.started_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, sessions: 0, uniqueVisitors: 0, pageViews: 0, revenue: 0, sales: 0 });
      }
      dailyMap.get(date)!.sessions++;
    });

    // Visiteurs uniques par jour
    const visitorsByDay = new Map<string, Set<string>>();
    (sessionsDaily.data || []).forEach((s: any) => {
      const date = s.started_at.split('T')[0];
      if (!visitorsByDay.has(date)) visitorsByDay.set(date, new Set());
      visitorsByDay.get(date)!.add(s.visitor_id);
    });
    visitorsByDay.forEach((visitors, date) => {
      if (dailyMap.has(date)) {
        dailyMap.get(date)!.uniqueVisitors = visitors.size;
      }
    });

    (ordersDaily.data || []).forEach((o: any) => {
      const date = o.created_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, sessions: 0, uniqueVisitors: 0, pageViews: 0, revenue: 0, sales: 0 });
      }
      dailyMap.get(date)!.sales++;
      dailyMap.get(date)!.revenue += o.total || 0;
    });

    // Page views par jour
    const pageViewsByDay = new Map<string, number>();
    (pageViewsDaily.data || []).forEach((p: any) => {
      const date = p.viewed_at.split('T')[0];
      pageViewsByDay.set(date, (pageViewsByDay.get(date) || 0) + 1);
    });
    pageViewsByDay.forEach((count, date) => {
      if (dailyMap.has(date)) {
        dailyMap.get(date)!.pageViews = count;
      }
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

    return NextResponse.json({
      // Sessions (remplace les "visites")
      totalSessions: sessionsTotal.count || 0,
      sessionsToday: sessionsToday.count || 0,
      sessionsThisWeek: sessionsWeek.count || 0,
      sessionsThisMonth: sessionsMonth.count || 0,
      sessionsThisYear: sessionsYear.count || 0,
      
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
      totalSales: ordersTotal.count || 0,
      salesToday: ordersToday.data?.length || 0,
      salesThisWeek: ordersWeek.data?.length || 0,
      salesThisMonth: ordersMonth.data?.length || 0,
      salesThisYear: ordersYear.data?.length || 0,
      
      // Revenue
      totalRevenue: calcRevenue(ordersTotal.data),
      revenueToday: calcRevenue(ordersToday.data),
      revenueThisWeek: calcRevenue(ordersWeek.data),
      revenueThisMonth: calcRevenue(ordersMonth.data),
      revenueThisYear: calcRevenue(ordersYear.data),
      
      // Autres
      totalProducts: productsCount.count || 0,
      totalCustomers: customersCount.count || 0,
      recentOrders: formattedRecentOrders,
      
      // Données journalières pour les graphiques
      dailyData,
    });

  } catch (error) {
    console.error('Erreur récupération analytics:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
