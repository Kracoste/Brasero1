import { NextResponse } from 'next/server';
import { hasStripeCredentials } from '@/lib/stripe';
import { hasResendCredentials, FROM_EMAIL, ADMIN_EMAIL, resend } from '@/lib/email';
import { getSupabaseAdminClient, hasSupabaseAdminCredentials } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = getSupabaseAdminClient();

  // Vérifier les variables d'environnement
  const checks: Record<string, unknown> = {
    stripe_configured: hasStripeCredentials(),
    stripe_webhook_secret_set: !!process.env.STRIPE_WEBHOOK_SECRET,
    stripe_webhook_secret_prefix: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10) + '...',
    stripe_key_type: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'LIVE' : process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'TEST' : 'UNKNOWN',
    resend_configured: hasResendCredentials(),
    resend_from: FROM_EMAIL,
    admin_email: ADMIN_EMAIL,
    supabase_admin_configured: hasSupabaseAdminCredentials(),
  };

  // Vérifier si la table orders existe et compter les commandes
  if (supabase) {
    try {
      const { data: orders, error: ordersErr } = await supabase
        .from('orders')
        .select('id, created_at, status, customer_email, user_id, total_amount, confirmation_email_sent')
        .order('created_at', { ascending: false })
        .limit(5);

      checks.orders_table_accessible = !ordersErr;
      checks.orders_error = ordersErr?.message || null;
      checks.recent_orders = orders?.map(o => ({
        id: o.id?.slice(0, 8),
        created_at: o.created_at,
        status: o.status,
        email: o.customer_email,
        user_id: o.user_id ? o.user_id.slice(0, 8) + '...' : null,
        total: o.total_amount,
        email_sent: o.confirmation_email_sent,
      })) || [];
    } catch (e) {
      checks.orders_error = e instanceof Error ? e.message : 'Unknown error';
    }

    // Vérifier la table email_logs
    try {
      const { data: emailLogs, error: emailErr } = await supabase
        .from('email_logs')
        .select('id, email_type, recipient_email, status, error_message, sent_at')
        .order('sent_at', { ascending: false })
        .limit(5);

      checks.email_logs_table_accessible = !emailErr;
      checks.email_logs_error = emailErr?.message || null;
      checks.recent_email_logs = emailLogs || [];
    } catch (e) {
      checks.email_logs_error = e instanceof Error ? e.message : 'Unknown error';
    }
  }

  // Tester Resend (sans envoyer d'email)
  if (resend) {
    try {
      // Juste vérifier que le client est initialisé
      checks.resend_client_initialized = true;
    } catch {
      checks.resend_client_initialized = false;
    }
  }

  return NextResponse.json(checks, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
