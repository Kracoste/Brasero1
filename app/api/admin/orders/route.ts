import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';
import { VALID_ORDER_STATUSES, devError } from '@/lib/supabase/utils';
import { isValidUUID } from '@/lib/validation';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { sendOrderShippedEmail, sendOrderProcessingEmail, sendOrderDeliveredEmail, type OrderEmailData } from '@/lib/email';

// Helper: vérifier que l'utilisateur est admin
async function verifyAdmin(request: NextRequest) {
  const clientIP = getClientIP(request.headers);
  if (!checkRateLimit(`admin-orders-${clientIP}`, 30, 60000)) {
    return { error: 'Trop de requêtes', status: 429 };
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user || !isAdminEmail(user.email)) {
    return { error: 'Non autorisé', status: 401 };
  }

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return { error: 'Configuration serveur manquante', status: 500 };
  }

  return { adminClient, user };
}

// GET: Récupérer les commandes
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { adminClient } = auth;

    const { data: orders, error } = await adminClient
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      devError('Erreur liste commandes:', error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    devError('Erreur GET orders:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT: Mettre à jour une commande (statut, tracking, transporteur, etc.)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId || !isValidUUID(orderId)) {
      return NextResponse.json({ error: 'ID commande invalide' }, { status: 400 });
    }

    const auth = await verifyAdmin(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { adminClient } = auth;
    const body = await request.json();
    const { status, tracking_number, carrier, send_email } = body;

    // Récupérer la commande actuelle
    const { data: currentOrder, error: fetchError } = await adminClient
      .from('orders')
      .select('id, status, customer_name, customer_email, total_amount, items, shipping_address, shipping_postal_code, shipping_city, tracking_number, carrier, user_id')
      .eq('id', orderId)
      .single();

    if (fetchError || !currentOrder) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    // Construire l'objet de mise à jour
    const updateData: Record<string, unknown> = {};

    if (status && (VALID_ORDER_STATUSES as readonly string[]).includes(status)) {
      updateData.status = status;
    }

    if (tracking_number !== undefined) {
      updateData.tracking_number = tracking_number || null;
    }

    if (carrier !== undefined) {
      updateData.carrier = carrier || null;
    }

    // Ajouter les timestamps automatiques selon le statut
    if (status === 'shipped') {
      updateData.shipped_at = new Date().toISOString();
    }
    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 });
    }

    // Mettre à jour la commande
    const { data: updatedOrder, error: updateError } = await adminClient
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      devError('Erreur mise à jour commande:', JSON.stringify(updateError));
      devError('updateData était:', JSON.stringify(updateData));
      return NextResponse.json({
        error: 'Erreur lors de la mise à jour de la commande',
      }, { status: 500 });
    }

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Commande non trouvée après mise à jour' }, { status: 404 });
    }

    // Envoyer un email au client si demandé et si le statut a changé
    let emailResult = null;
    const isStatusChanged = status && status !== currentOrder.status;
    if (send_email && isStatusChanged && currentOrder.customer_email) {
      const emailData: OrderEmailData = {
        orderNumber: orderId.slice(0, 8).toUpperCase(),
        customerName: currentOrder.customer_name || 'Client',
        customerEmail: currentOrder.customer_email,
        totalAmount: currentOrder.total_amount || 0,
        items: (currentOrder.items || []).map((item: any) => ({
          name: item.product_name || 'Produit',
          quantity: item.quantity || 1,
          price: item.unit_price || 0,
        })),
        shippingAddress: [
          currentOrder.shipping_address,
          currentOrder.shipping_postal_code,
          currentOrder.shipping_city,
        ].filter(Boolean).join(', '),
        trackingNumber: tracking_number || currentOrder.tracking_number || undefined,
        carrier: carrier || currentOrder.carrier || undefined,
      };

      try {
        if (status === 'processing') {
          emailResult = await sendOrderProcessingEmail(emailData, adminClient, orderId, currentOrder.user_id);
        } else if (status === 'shipped') {
          emailResult = await sendOrderShippedEmail(emailData, adminClient, orderId, currentOrder.user_id);
        } else if (status === 'delivered') {
          emailResult = await sendOrderDeliveredEmail(emailData, adminClient, orderId, currentOrder.user_id);
        }
      } catch (err) {
        devError('Erreur envoi email statut:', err);
        emailResult = { success: false, error: err instanceof Error ? err.message : 'Erreur inconnue' };
      }
    }

    return NextResponse.json({
      order: updatedOrder,
      email_sent: emailResult,
    });
  } catch (error) {
    devError('Erreur PUT order:', error);
    return NextResponse.json({
      error: 'Erreur serveur',
    }, { status: 500 });
  }
}
