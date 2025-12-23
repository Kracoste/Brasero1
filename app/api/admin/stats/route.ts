import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';

type DailyData = {
  date: string;
  visits: number;
  revenue: number;
  sales: number;
};

export async function GET() {
  try {
    // Vérifier que l'utilisateur est admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Utiliser le client admin pour bypasser RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Service non disponible' }, { status: 500 });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
    const startOfWeekDate = new Date(now);
    const day = startOfWeekDate.getDay() || 7;
    startOfWeekDate.setHours(0, 0, 0, 0);
    startOfWeekDate.setDate(startOfWeekDate.getDate() - (day - 1));
    const startOfWeek = startOfWeekDate.toISOString();
    
    // Date pour les données journalières (1 an)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Récupérer toutes les stats en parallèle avec le client admin
    const [
      visitsResult,
      visitsTodayResult,
      visitsWeekResult,
      visitsMonthResult,
      visitsYearResult,
      ordersResult,
      recentOrdersResult,
      productsResult,
      customersResult,
      visitsDaily,
      ordersDaily,
    ] = await Promise.all([
      adminClient.from('visits').select('*', { count: 'exact', head: true }),
      adminClient.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', startOfDay),
      adminClient.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', startOfWeek),
      adminClient.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
      adminClient.from('visits').select('*', { count: 'exact', head: true }).gte('created_at', startOfYear),
      adminClient.from('orders').select('id, total', { count: 'exact' }),
      adminClient.from('orders').select('id, customer_name, total, created_at, status').order('created_at', { ascending: false }).limit(5),
      adminClient.from('products').select('*', { count: 'exact', head: true }),
      adminClient.from('profiles').select('*', { count: 'exact', head: true }),
      // Données journalières pour les graphiques
      adminClient.from('visits').select('created_at').gte('created_at', oneYearAgo.toISOString()),
      adminClient.from('orders').select('created_at, total').gte('created_at', oneYearAgo.toISOString()),
    ]);

    const orders = ordersResult.data || [];
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const recentOrders = (recentOrdersResult.data || []).map((order) => ({
      id: order.id,
      customer: order.customer_name || 'Client',
      amount: order.total || 0,
      date: new Date(order.created_at).toLocaleDateString('fr-FR'),
      status: order.status || 'pending',
    }));

    // Agréger les données journalières
    const dailyMap = new Map<string, DailyData>();
    
    (visitsDaily.data || []).forEach((v: { created_at: string }) => {
      const date = v.created_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, visits: 0, revenue: 0, sales: 0 });
      }
      dailyMap.get(date)!.visits++;
    });
    
    (ordersDaily.data || []).forEach((o: { created_at: string; total?: number }) => {
      const date = o.created_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { date, visits: 0, revenue: 0, sales: 0 });
      }
      const dayData = dailyMap.get(date)!;
      dayData.sales++;
      dayData.revenue += o.total || 0;
    });
    
    const dailyData = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      totalVisits: visitsResult.count || 0,
      visitsToday: visitsTodayResult.count || 0,
      visitsThisWeek: visitsWeekResult.count || 0,
      visitsThisMonth: visitsMonthResult.count || 0,
      visitsThisYear: visitsYearResult.count || 0,
      totalSales: ordersResult.count || 0,
      totalRevenue,
      totalProducts: productsResult.count || 0,
      totalCustomers: customersResult.count || 0,
      recentOrders,
      dailyData,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
