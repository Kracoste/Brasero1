import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';

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
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
