import { Resend } from 'resend';

// Client Resend - sera null si API key non configurée
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const hasResendCredentials = () => !!process.env.RESEND_API_KEY;

// Email par défaut pour l'envoi
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@brasero-atelier.fr';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'atelier-lbf@outlook.com';

// Types d'emails
export type EmailType =
  | 'order_confirmation'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'welcome'
  | 'password_reset'
  | 'low_stock_alert';

// Interface pour les données de commande
export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: string;
  trackingNumber?: string;
  carrier?: string;
}

// Fonction helper pour logger les emails envoyés
export async function logEmail(
  supabase: any,
  emailType: EmailType,
  recipientEmail: string,
  orderId?: string,
  userId?: string,
  status: 'sent' | 'failed' = 'sent',
  providerId?: string,
  errorMessage?: string
) {
  try {
    await supabase.from('email_logs').insert({
      email_type: emailType,
      recipient_email: recipientEmail,
      order_id: orderId || null,
      user_id: userId || null,
      status,
      provider_id: providerId || null,
      error_message: errorMessage || null,
    });
  } catch (error) {
    console.error('[Email Log] Failed to log email:', error);
  }
}

/**
 * Envoyer un email de confirmation de commande
 */
export async function sendOrderConfirmationEmail(
  orderData: OrderEmailData,
  supabase: any,
  orderId?: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  if (!hasResendCredentials() || !resend) {
    console.warn('[Email] Resend not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: orderData.customerEmail,
      subject: `Confirmation de commande #${orderData.orderNumber}`,
      html: generateOrderConfirmationHTML(orderData),
    });

    if (error) {
      await logEmail(supabase, 'order_confirmation', orderData.customerEmail, orderId, userId, 'failed', undefined, error.message);
      return { success: false, error: error.message };
    }

    await logEmail(supabase, 'order_confirmation', orderData.customerEmail, orderId, userId, 'sent', data?.id);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logEmail(supabase, 'order_confirmation', orderData.customerEmail, orderId, userId, 'failed', undefined, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Envoyer un email d'expédition
 */
export async function sendOrderShippedEmail(
  orderData: OrderEmailData,
  supabase: any,
  orderId?: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  if (!hasResendCredentials() || !resend) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: orderData.customerEmail,
      subject: `Votre commande #${orderData.orderNumber} a été expédiée`,
      html: generateOrderShippedHTML(orderData),
    });

    if (error) {
      await logEmail(supabase, 'order_shipped', orderData.customerEmail, orderId, userId, 'failed', undefined, error.message);
      return { success: false, error: error.message };
    }

    await logEmail(supabase, 'order_shipped', orderData.customerEmail, orderId, userId, 'sent', data?.id);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logEmail(supabase, 'order_shipped', orderData.customerEmail, orderId, userId, 'failed', undefined, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Envoyer une notification admin de nouvelle commande
 */
export async function sendAdminOrderNotification(
  orderData: OrderEmailData,
  supabase: any,
  orderId?: string
): Promise<{ success: boolean; error?: string }> {
  if (!hasResendCredentials() || !resend) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🛒 Nouvelle commande #${orderData.orderNumber}`,
      html: generateAdminOrderNotificationHTML(orderData),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============================================================================
// TEMPLATES HTML
// ============================================================================

function generateOrderConfirmationHTML(order: OrderEmailData): string {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toFixed(2)} €</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #8B4513 0%, #CD853F 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Merci pour votre commande !</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 20px;">
      <p style="font-size: 16px; margin-bottom: 20px;">
        Bonjour <strong>${order.customerName}</strong>,
      </p>
      
      <p style="font-size: 16px; margin-bottom: 30px;">
        Nous avons bien reçu votre commande <strong>#${order.orderNumber}</strong>. 
        Nous préparons votre brasero artisanal avec soin et vous tiendrons informé de l'expédition.
      </p>
      
      <!-- Order Details -->
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
        <h2 style="font-size: 18px; margin-top: 0; color: #1f2937;">Détails de la commande</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #e5e7eb;">
              <th style="padding: 12px; text-align: left; font-weight: 600;">Produit</th>
              <th style="padding: 12px; text-align: center; font-weight: 600;">Qté</th>
              <th style="padding: 12px; text-align: right; font-weight: 600;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #8B4513;">
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700;">
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)} €</span>
          </div>
        </div>
      </div>
      
      ${
        order.shippingAddress
          ? `
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 16px; margin-bottom: 10px; color: #1f2937;">Adresse de livraison</h3>
        <p style="margin: 0; color: #6b7280;">${order.shippingAddress}</p>
      </div>
      `
          : ''
      }
      
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 30px;">
        Vous recevrez un email dès l'expédition de votre commande avec un numéro de suivi.
      </p>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://brasero-atelier.fr/mon-compte/commandes" 
           style="display: inline-block; padding: 14px 32px; background-color: #8B4513; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
          Suivre ma commande
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
        Une question ? Contactez-nous à <a href="mailto:atelier-lbf@outlook.com" style="color: #8B4513; text-decoration: none;">atelier-lbf@outlook.com</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} Brasero Atelier LBF - Moncoutant, France
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateOrderShippedHTML(order: OrderEmailData): string {
  const trackingHTML = order.trackingNumber
    ? `
    <div style="background-color: #dbeafe; padding: 20px; border-radius: 6px; margin: 30px 0; text-align: center;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #1e40af; font-weight: 600;">
        Numéro de suivi
      </p>
      <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1e3a8a; font-family: monospace;">
        ${order.trackingNumber}
      </p>
      ${
        order.carrier
          ? `<p style="margin: 10px 0 0 0; font-size: 14px; color: #3b82f6;">Transporteur: ${order.carrier}</p>`
          : ''
      }
    </div>
  `
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Commande expédiée</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">📦 Votre commande est en route !</h1>
    </div>
    
    <div style="padding: 40px 20px;">
      <p style="font-size: 16px; margin-bottom: 20px;">
        Bonjour <strong>${order.customerName}</strong>,
      </p>
      
      <p style="font-size: 16px; margin-bottom: 30px;">
        Votre commande <strong>#${order.orderNumber}</strong> a été expédiée et devrait arriver dans les prochains jours.
      </p>
      
      ${trackingHTML}
      
      <p style="font-size: 14px; color: #6b7280; margin: 30px 0;">
        Vous pouvez suivre votre colis en temps réel avec le numéro de suivi ci-dessus.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://brasero-atelier.fr/mon-compte/commandes" 
           style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
          Voir ma commande
        </a>
      </div>
    </div>
    
    <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
        Des questions ? <a href="mailto:atelier-lbf@outlook.com" style="color: #10b981; text-decoration: none;">atelier-lbf@outlook.com</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} Brasero Atelier LBF
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateAdminOrderNotificationHTML(order: OrderEmailData): string {
  const itemsHTML = order.items
    .map((item) => `<li>${item.quantity}x ${item.name} - ${item.price.toFixed(2)} €</li>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; padding: 20px;">
  <h2 style="color: #8B4513;">🛒 Nouvelle commande reçue</h2>
  <p><strong>Commande:</strong> #${order.orderNumber}</p>
  <p><strong>Client:</strong> ${order.customerName} (${order.customerEmail})</p>
  <p><strong>Montant:</strong> ${order.totalAmount.toFixed(2)} €</p>
  
  <h3>Articles:</h3>
  <ul>${itemsHTML}</ul>
  
  ${order.shippingAddress ? `<p><strong>Adresse:</strong><br>${order.shippingAddress}</p>` : ''}
  
  <p style="margin-top: 30px;">
    <a href="https://brasero-atelier.fr/admin/commandes" 
       style="display: inline-block; padding: 12px 24px; background-color: #8B4513; color: white; text-decoration: none; border-radius: 4px;">
      Voir dans l'admin
    </a>
  </p>
</body>
</html>
  `;
}
