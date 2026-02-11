import { NextRequest, NextResponse } from 'next/server';
import { hasStripeCredentials, stripe } from '@/lib/stripe';
import { hasResendCredentials, FROM_EMAIL, ADMIN_EMAIL, resend } from '@/lib/email';
import { getSupabaseAdminClient, hasSupabaseAdminCredentials } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdminClient();
  const action = request.nextUrl.searchParams.get('action');

  // Action: test-email → envoyer un email test
  if (action === 'test-email') {
    if (!resend) {
      return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });
    }
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: '✅ Test email Atelier LBF - ' + new Date().toLocaleString('fr-FR'),
        html: '<h1>Test réussi !</h1><p>Si vous lisez ceci, les emails fonctionnent.</p>',
      });
      return NextResponse.json({ success: !error, data, error: error?.message || null });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
  }

  // Action: check-stripe-webhooks → vérifier les événements récents
  if (action === 'check-stripe' && stripe) {
    try {
      const events = await stripe.events.list({ limit: 5 });
      return NextResponse.json({
        recent_events: events.data.map(e => ({
          id: e.id,
          type: e.type,
          created: new Date(e.created * 1000).toISOString(),
          livemode: e.livemode,
        })),
      });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
    }
  }

  // Default: diagnostic complet
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

  // Vérifier TOUTES les colonnes que le webhook essaie d'insérer
  if (supabase) {
    const columnsToCheck = [
      'user_id', 'stripe_session_id', 'stripe_payment_intent', 'status',
      'total_amount', 'currency', 'customer_email', 'customer_name', 'customer_phone',
      'shipping_address', 'shipping_address_line2', 'shipping_postal_code',
      'shipping_city', 'shipping_country', 'delivery_message',
      'items', 'confirmation_email_sent', 'tracking_number', 'carrier',
      'shipped_at', 'delivered_at', 'internal_notes', 'shipping_email_sent'
    ];

    const missingColumns: string[] = [];
    const existingColumns: string[] = [];

    for (const col of columnsToCheck) {
      try {
        const { error } = await supabase
          .from('orders')
          .select(col)
          .limit(1);
        if (error) {
          missingColumns.push(col);
        } else {
          existingColumns.push(col);
        }
      } catch {
        missingColumns.push(col);
      }
    }

    checks.orders_existing_columns = existingColumns;
    checks.orders_missing_columns = missingColumns;
  }

  return NextResponse.json(checks, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
