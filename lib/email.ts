import { Resend } from 'resend';

// Client Resend - sera null si API key non configurée
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const hasResendCredentials = () => !!process.env.RESEND_API_KEY;

// Email par défaut pour l'envoi
const fromAddress = process.env.RESEND_FROM_EMAIL || 'noreply@atelier-lbf.fr';
export const FROM_EMAIL = `Atelier LBF <${fromAddress}>`;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'atelier-lbf@outlook.fr';

// Types d'emails
export type EmailType =
  | 'order_confirmation'
  | 'order_processing'
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
  customerPhone?: string;
  totalAmount: number;
  items: Array<{
    name: string;
    description?: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
  shippingAddress?: string;
  shippingCost?: number;
  discount?: number;
  orderDate?: string;
  trackingNumber?: string;
  carrier?: string;
}

// Type minimal pour le client Supabase (admin ou server)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClientLike = {
  from: (table: string) => { insert: (data: Record<string, unknown>) => unknown };
};

// Fonction helper pour logger les emails envoyés
export async function logEmail(
  supabase: SupabaseClientLike,
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
  supabase: SupabaseClientLike,
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
  supabase: SupabaseClientLike,
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
 * Envoyer un email de mise en fabrication
 */
export async function sendOrderProcessingEmail(
  orderData: OrderEmailData,
  supabase: SupabaseClientLike,
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
      subject: `Votre commande #${orderData.orderNumber} est en cours de fabrication 🔨`,
      html: generateOrderProcessingHTML(orderData),
    });

    if (error) {
      await logEmail(supabase, 'order_processing', orderData.customerEmail, orderId, userId, 'failed', undefined, error.message);
      return { success: false, error: error.message };
    }

    await logEmail(supabase, 'order_processing', orderData.customerEmail, orderId, userId, 'sent', data?.id);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logEmail(supabase, 'order_processing', orderData.customerEmail, orderId, userId, 'failed', undefined, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Envoyer un email de livraison
 */
export async function sendOrderDeliveredEmail(
  orderData: OrderEmailData,
  supabase: SupabaseClientLike,
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
      subject: `Votre commande #${orderData.orderNumber} a été livrée ✅`,
      html: generateOrderDeliveredHTML(orderData),
    });

    if (error) {
      await logEmail(supabase, 'order_delivered', orderData.customerEmail, orderId, userId, 'failed', undefined, error.message);
      return { success: false, error: error.message };
    }

    await logEmail(supabase, 'order_delivered', orderData.customerEmail, orderId, userId, 'sent', data?.id);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logEmail(supabase, 'order_delivered', orderData.customerEmail, orderId, userId, 'failed', undefined, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Envoyer une notification admin de nouvelle commande
 */
export async function sendAdminOrderNotification(
  orderData: OrderEmailData,
  supabase: SupabaseClientLike,
  orderId?: string,
  attachments?: { filename: string; content: Buffer }[]
): Promise<{ success: boolean; error?: string }> {
  if (!hasResendCredentials() || !resend) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const emailPayload: any = {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🛒 Nouvelle commande #${orderData.orderNumber}`,
      html: generateAdminOrderNotificationHTML(orderData),
    };

    if (attachments && attachments.length > 0) {
      emailPayload.attachments = attachments.map(a => ({
        filename: a.filename,
        content: a.content.toString('base64'),
        type: 'application/pdf',
      }));
    }

    const { data, error } = await resend.emails.send(emailPayload);

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

/**
 * Échappe les caractères HTML dangereux pour prévenir les injections XSS dans les emails
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateOrderConfirmationHTML(order: OrderEmailData): string {
  const safeName = escapeHtml(order.customerName);
  const safeOrderNumber = escapeHtml(order.orderNumber);
  const safeEmail = escapeHtml(order.customerEmail);
  const safePhone = order.customerPhone ? escapeHtml(order.customerPhone) : '';
  const safeAddress = order.shippingAddress ? escapeHtml(order.shippingAddress) : '';
  const orderDate = order.orderDate || new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  // Sous-total articles (sans livraison ni remise)
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = order.shippingCost ?? 0;
  const discount = order.discount ?? 0;
  const tvaRate = 0.20;
  const tvaAmount = order.totalAmount - (order.totalAmount / (1 + tvaRate));

  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; width: 80px;">
        ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;" />` : ''}
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
        <strong style="font-size: 15px; color: #1f2937;">${escapeHtml(item.name)}</strong>
        ${item.description ? `<br><span style="font-size: 13px; color: #6b7280;">${escapeHtml(item.description)}</span>` : ''}
        <br><span style="font-size: 13px; color: #6b7280;">Quantité : ${item.quantity}</span>
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; text-align: right; white-space: nowrap;">
        <strong style="font-size: 15px; color: #1f2937;">${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong>
      </td>
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
<body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #374151; background-color: #f5f0eb; margin: 0; padding: 20px;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    
    <!-- Logo Header -->
    <div style="padding: 30px 20px 10px; text-align: center;">
      <img src="https://www.atelier-lbf.fr/logo/Logo1.png" alt="Atelier LBF" style="height: 80px; width: auto;" />
    </div>

    <!-- Titre -->
    <div style="text-align: center; padding: 10px 20px 20px;">
      <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #1f2937; margin: 0 0 8px 0; border-bottom: 2px solid #1f2937; display: inline-block; padding-bottom: 4px;">Confirmation de commande</h1>
      <p style="font-size: 15px; color: #6b7280; margin: 12px 0 0 0;">Merci ${safeName} &mdash; on a bien reçu votre commande.</p>
    </div>

    <!-- Infos commande -->
    <div style="margin: 0 24px; padding: 18px 20px; background-color: #faf8f5; border-radius: 6px; border: 1px solid #e8e2da;">
      <table style="width: 100%; font-size: 14px; color: #374151;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding: 3px 0;"><strong>N° de commande :</strong> ${safeOrderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;"><strong>Date :</strong> ${escapeHtml(orderDate)}</td>
        </tr>
        <tr>
          <td style="padding: 3px 0;"><strong>Email client :</strong> ${safeEmail}</td>
        </tr>
        ${safePhone ? `<tr><td style="padding: 3px 0;"><strong>Téléphone :</strong> ${safePhone}</td></tr>` : ''}
      </table>
    </div>

    <!-- Articles -->
    <div style="padding: 24px;">
      <h2 style="font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1f2937; margin: 0 0 16px 0; font-style: italic;">Article(s)</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
    </div>

    <!-- Récapitulatif prix en 2 colonnes -->
    <div style="padding: 0 24px 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: top; width: 50%; padding-right: 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-size: 14px; color: #374151;"><strong>Sous-total</strong></td>
                <td style="padding: 6px 0; font-size: 14px; color: #374151; text-align: right;">${subtotal.toFixed(2).replace('.', ',')} €</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 14px; color: #374151;"><strong>Livraison</strong></td>
                <td style="padding: 6px 0; font-size: 14px; color: #374151; text-align: right;">${shippingCost > 0 ? shippingCost.toFixed(2).replace('.', ',') + ' €' : 'Offerte'}</td>
              </tr>
            </table>
            ${safeAddress ? `
            <div style="margin-top: 12px;">
              <p style="font-size: 14px; color: #374151; margin: 0;"><strong>Livraison à domicile</strong></p>
              <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0 0;">${safeAddress.replace(/,/g, '<br>')}</p>
              <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0 0;">Référence : ${safeOrderNumber}</p>
            </div>
            ` : ''}
          </td>
          <td style="vertical-align: top; width: 50%; padding-left: 12px; border-left: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-size: 14px; color: #374151;">Livraison</td>
                <td style="padding: 6px 0; font-size: 14px; color: #374151; text-align: right;">${shippingCost > 0 ? shippingCost.toFixed(2).replace('.', ',') + ' €' : 'Offerte'}</td>
              </tr>
              ${discount > 0 ? `
              <tr>
                <td style="padding: 6px 0; font-size: 14px; color: #374151;">Remise</td>
                <td style="padding: 6px 0; font-size: 14px; color: #059669; text-align: right;">-${discount.toFixed(2).replace('.', ',')} €</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0 6px; font-size: 20px; font-weight: 700; color: #1f2937; border-top: 2px solid #1f2937;"><strong>Total</strong></td>
                <td style="padding: 12px 0 6px; font-size: 20px; font-weight: 700; color: #1f2937; text-align: right; border-top: 2px solid #1f2937;">${order.totalAmount.toFixed(2).replace('.', ',')} €</td>
              </tr>
              <tr>
                <td colspan="2" style="font-size: 13px; color: #6b7280; padding-top: 2px;">TVA : 20 % incluse (${tvaAmount.toFixed(2).replace('.', ',')} €)</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="background-color: #1f2937; padding: 24px 20px; text-align: center; border-radius: 0 0 4px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #d1d5db;">
        Besoin d'aide ? Répondez à ce mail ou contactez nous : <a href="mailto:atelier-lbf@outlook.fr" style="color: #f5deb3; text-decoration: none;">atelier-lbf@outlook.fr</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} ATELIER LBF &ndash; Moncoutant-sur-Sèvre, France
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateOrderShippedHTML(order: OrderEmailData): string {
  const safeName = escapeHtml(order.customerName);
  const safeOrderNumber = escapeHtml(order.orderNumber);
  const safeEmail = escapeHtml(order.customerEmail);
  const safePhone = order.customerPhone ? escapeHtml(order.customerPhone) : '';
  const safeAddress = order.shippingAddress ? escapeHtml(order.shippingAddress) : '';

  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; width: 80px;">
        ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;" />` : ''}
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
        <strong style="font-size: 15px; color: #1f2937;">${escapeHtml(item.name)}</strong>
        <br><span style="font-size: 13px; color: #6b7280;">Quantité : ${item.quantity}</span>
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; text-align: right; white-space: nowrap;">
        <strong style="font-size: 15px; color: #1f2937;">${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong>
      </td>
    </tr>
  `
    )
    .join('');

  const trackingHTML = order.trackingNumber
    ? `
    <div style="margin: 20px 24px; padding: 18px 20px; background-color: #f0f9ff; border-radius: 6px; border: 1px solid #bae6fd; text-align: center;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #0369a1; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Numéro de suivi</p>
      <p style="margin: 0; font-size: 22px; font-weight: 700; color: #0c4a6e; font-family: monospace;">${escapeHtml(order.trackingNumber)}</p>
      ${order.carrier ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #0369a1;">Transporteur : ${escapeHtml(order.carrier)}</p>` : ''}
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
<body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #374151; background-color: #f5f0eb; margin: 0; padding: 20px;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

    <!-- Logo -->
    <div style="padding: 30px 20px 10px; text-align: center;">
      <img src="https://www.atelier-lbf.fr/logo/Logo1.png" alt="Atelier LBF" style="height: 80px; width: auto;" />
    </div>

    <!-- Titre -->
    <div style="text-align: center; padding: 10px 20px 20px;">
      <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #1f2937; margin: 0 0 8px 0; border-bottom: 2px solid #1f2937; display: inline-block; padding-bottom: 4px;">📦 Commande expédiée</h1>
      <p style="font-size: 15px; color: #6b7280; margin: 12px 0 0 0;">Votre commande est en route, ${safeName} !</p>
    </div>

    <!-- Infos commande -->
    <div style="margin: 0 24px; padding: 18px 20px; background-color: #faf8f5; border-radius: 6px; border: 1px solid #e8e2da;">
      <table style="width: 100%; font-size: 14px; color: #374151;" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 3px 0;"><strong>N° de commande :</strong> ${safeOrderNumber}</td></tr>
        <tr><td style="padding: 3px 0;"><strong>Email :</strong> ${safeEmail}</td></tr>
        ${safePhone ? `<tr><td style="padding: 3px 0;"><strong>Téléphone :</strong> ${safePhone}</td></tr>` : ''}
      </table>
    </div>

    ${trackingHTML}

    <!-- Message -->
    <div style="padding: 20px 24px;">
      <p style="font-size: 15px; color: #374151; margin: 0 0 16px 0;">
        Votre commande <strong>#${safeOrderNumber}</strong> a été expédiée et devrait arriver dans les prochains jours.
        ${order.trackingNumber ? 'Vous pouvez suivre votre colis en temps réel avec le numéro de suivi ci-dessus.' : ''}
      </p>
    </div>

    <!-- Articles -->
    <div style="padding: 0 24px 16px;">
      <h2 style="font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1f2937; margin: 0 0 16px 0; font-style: italic;">Rappel de votre commande</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>${itemsHTML}</tbody>
      </table>
    </div>

    <!-- Adresse -->
    ${safeAddress ? `
    <div style="padding: 0 24px 16px;">
      <p style="font-size: 14px; color: #374151; margin: 0;"><strong>Livraison à domicile</strong></p>
      <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0 0;">${safeAddress.replace(/,/g, '<br>')}</p>
    </div>
    ` : ''}

    <!-- Total -->
    <div style="padding: 0 24px 24px;">
      <div style="padding-top: 16px; border-top: 2px solid #1f2937;">
        <table style="width: 100%;">
          <tr>
            <td style="font-size: 20px; font-weight: 700; color: #1f2937;">Total</td>
            <td style="font-size: 20px; font-weight: 700; color: #1f2937; text-align: right;">${order.totalAmount.toFixed(2).replace('.', ',')} €</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #1f2937; padding: 24px 20px; text-align: center; border-radius: 0 0 4px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #d1d5db;">
        Besoin d'aide ? Répondez à ce mail ou contactez nous : <a href="mailto:atelier-lbf@outlook.fr" style="color: #f5deb3; text-decoration: none;">atelier-lbf@outlook.fr</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} ATELIER LBF &ndash; Moncoutant-sur-Sèvre, France
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateOrderProcessingHTML(order: OrderEmailData): string {
  const safeName = escapeHtml(order.customerName);
  const safeOrderNumber = escapeHtml(order.orderNumber);
  const safeEmail = escapeHtml(order.customerEmail);
  const safePhone = order.customerPhone ? escapeHtml(order.customerPhone) : '';

  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; width: 80px;">
        ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;" />` : ''}
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
        <strong style="font-size: 15px; color: #1f2937;">${escapeHtml(item.name)}</strong>
        <br><span style="font-size: 13px; color: #6b7280;">Quantité : ${item.quantity}</span>
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; text-align: right; white-space: nowrap;">
        <strong style="font-size: 15px; color: #1f2937;">${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong>
      </td>
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
  <title>Commande en fabrication</title>
</head>
<body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #374151; background-color: #f5f0eb; margin: 0; padding: 20px;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

    <!-- Logo -->
    <div style="padding: 30px 20px 10px; text-align: center;">
      <img src="https://www.atelier-lbf.fr/logo/Logo1.png" alt="Atelier LBF" style="height: 80px; width: auto;" />
    </div>

    <!-- Titre -->
    <div style="text-align: center; padding: 10px 20px 20px;">
      <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #1f2937; margin: 0 0 8px 0; border-bottom: 2px solid #1f2937; display: inline-block; padding-bottom: 4px;">🔨 En cours de fabrication</h1>
      <p style="font-size: 15px; color: #6b7280; margin: 12px 0 0 0;">Votre brasero est entre de bonnes mains, ${safeName} !</p>
    </div>

    <!-- Infos commande -->
    <div style="margin: 0 24px; padding: 18px 20px; background-color: #faf8f5; border-radius: 6px; border: 1px solid #e8e2da;">
      <table style="width: 100%; font-size: 14px; color: #374151;" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 3px 0;"><strong>N° de commande :</strong> ${safeOrderNumber}</td></tr>
        <tr><td style="padding: 3px 0;"><strong>Email :</strong> ${safeEmail}</td></tr>
        ${safePhone ? `<tr><td style="padding: 3px 0;"><strong>Téléphone :</strong> ${safePhone}</td></tr>` : ''}
      </table>
    </div>

    <!-- Message -->
    <div style="padding: 20px 24px;">
      <p style="font-size: 15px; color: #374151; margin: 0 0 16px 0;">
        Bonne nouvelle ! Votre commande <strong>#${safeOrderNumber}</strong> est maintenant en cours de fabrication dans notre atelier.
      </p>
      <p style="font-size: 15px; color: #374151; margin: 0 0 16px 0;">
        Nos artisans travaillent avec soin pour vous livrer un brasero de qualité. Vous recevrez un email dès que votre commande sera expédiée.
      </p>

      <!-- Info délai -->
      <div style="background-color: #faf8f5; border-left: 4px solid #b45309; padding: 14px 16px; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-size: 14px; color: #78350f;">⏳ Délai estimé : nos braseros artisanaux sont fabriqués sur commande. Comptez quelques jours de fabrication.</p>
      </div>
    </div>

    <!-- Articles -->
    <div style="padding: 0 24px 16px;">
      <h2 style="font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1f2937; margin: 0 0 16px 0; font-style: italic;">Rappel de votre commande</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>${itemsHTML}</tbody>
      </table>
    </div>

    <!-- Total -->
    <div style="padding: 0 24px 24px;">
      <div style="padding-top: 16px; border-top: 2px solid #1f2937;">
        <table style="width: 100%;">
          <tr>
            <td style="font-size: 20px; font-weight: 700; color: #1f2937;">Total</td>
            <td style="font-size: 20px; font-weight: 700; color: #1f2937; text-align: right;">${order.totalAmount.toFixed(2).replace('.', ',')} €</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #1f2937; padding: 24px 20px; text-align: center; border-radius: 0 0 4px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #d1d5db;">
        Besoin d'aide ? Répondez à ce mail ou contactez nous : <a href="mailto:atelier-lbf@outlook.fr" style="color: #f5deb3; text-decoration: none;">atelier-lbf@outlook.fr</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} ATELIER LBF &ndash; Moncoutant-sur-Sèvre, France
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateOrderDeliveredHTML(order: OrderEmailData): string {
  const safeName = escapeHtml(order.customerName);
  const safeOrderNumber = escapeHtml(order.orderNumber);
  const safeEmail = escapeHtml(order.customerEmail);
  const safePhone = order.customerPhone ? escapeHtml(order.customerPhone) : '';
  const safeAddress = order.shippingAddress ? escapeHtml(order.shippingAddress) : '';

  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; width: 80px;">
        ${item.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;" />` : ''}
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
        <strong style="font-size: 15px; color: #1f2937;">${escapeHtml(item.name)}</strong>
        <br><span style="font-size: 13px; color: #6b7280;">Quantité : ${item.quantity}</span>
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; text-align: right; white-space: nowrap;">
        <strong style="font-size: 15px; color: #1f2937;">${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong>
      </td>
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
  <title>Commande livrée</title>
</head>
<body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #374151; background-color: #f5f0eb; margin: 0; padding: 20px;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

    <!-- Logo -->
    <div style="padding: 30px 20px 10px; text-align: center;">
      <img src="https://www.atelier-lbf.fr/logo/Logo1.png" alt="Atelier LBF" style="height: 80px; width: auto;" />
    </div>

    <!-- Titre -->
    <div style="text-align: center; padding: 10px 20px 20px;">
      <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #1f2937; margin: 0 0 8px 0; border-bottom: 2px solid #1f2937; display: inline-block; padding-bottom: 4px;">✅ Commande livrée</h1>
      <p style="font-size: 15px; color: #6b7280; margin: 12px 0 0 0;">Votre commande a bien été livrée, ${safeName} !</p>
    </div>

    <!-- Infos commande -->
    <div style="margin: 0 24px; padding: 18px 20px; background-color: #faf8f5; border-radius: 6px; border: 1px solid #e8e2da;">
      <table style="width: 100%; font-size: 14px; color: #374151;" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 3px 0;"><strong>N° de commande :</strong> ${safeOrderNumber}</td></tr>
        <tr><td style="padding: 3px 0;"><strong>Email :</strong> ${safeEmail}</td></tr>
        ${safePhone ? `<tr><td style="padding: 3px 0;"><strong>Téléphone :</strong> ${safePhone}</td></tr>` : ''}
      </table>
    </div>

    <!-- Message -->
    <div style="padding: 20px 24px;">
      <p style="font-size: 15px; color: #374151; margin: 0 0 16px 0;">
        Votre commande <strong>#${safeOrderNumber}</strong> a bien été livrée. Nous espérons que vous apprécierez votre brasero artisanal !
      </p>
      <p style="font-size: 15px; color: #374151; margin: 0 0 16px 0;">
        N'hésitez pas à nous contacter si vous avez la moindre question sur l'utilisation ou l'entretien de votre brasero.
      </p>

      <!-- Astuce recettes -->
      <div style="background-color: #faf8f5; border-left: 4px solid #059669; padding: 14px 16px; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-size: 14px; color: #065f46;">💡 Consultez nos <a href="https://www.atelier-lbf.fr/recettes" style="color: #059669; font-weight: 600; text-decoration: none;">recettes</a> pour profiter pleinement de votre brasero !</p>
      </div>
    </div>

    <!-- Articles -->
    <div style="padding: 0 24px 16px;">
      <h2 style="font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1f2937; margin: 0 0 16px 0; font-style: italic;">Rappel de votre commande</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tbody>${itemsHTML}</tbody>
      </table>
    </div>

    <!-- Adresse -->
    ${safeAddress ? `
    <div style="padding: 0 24px 16px;">
      <p style="font-size: 14px; color: #374151; margin: 0;"><strong>Livrée à</strong></p>
      <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0 0;">${safeAddress.replace(/,/g, '<br>')}</p>
    </div>
    ` : ''}

    <!-- Total -->
    <div style="padding: 0 24px 24px;">
      <div style="padding-top: 16px; border-top: 2px solid #1f2937;">
        <table style="width: 100%;">
          <tr>
            <td style="font-size: 20px; font-weight: 700; color: #1f2937;">Total</td>
            <td style="font-size: 20px; font-weight: 700; color: #1f2937; text-align: right;">${order.totalAmount.toFixed(2).replace('.', ',')} €</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #1f2937; padding: 24px 20px; text-align: center; border-radius: 0 0 4px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #d1d5db;">
        Merci pour votre confiance ! <a href="mailto:atelier-lbf@outlook.fr" style="color: #f5deb3; text-decoration: none;">atelier-lbf@outlook.fr</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} ATELIER LBF &ndash; Moncoutant-sur-Sèvre, France
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateAdminOrderNotificationHTML(order: OrderEmailData): string {
  const safeName = escapeHtml(order.customerName);
  const safeEmail = escapeHtml(order.customerEmail);
  const safeOrderNumber = escapeHtml(order.orderNumber);
  const safeAddress = order.shippingAddress ? escapeHtml(order.shippingAddress) : '';
  const itemsHTML = order.items
    .map((item) => `<li>${item.quantity}x ${escapeHtml(item.name)} - ${item.price.toFixed(2)} €</li>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; padding: 20px;">
  <h2 style="color: #8B4513;">🛒 Nouvelle commande reçue</h2>
  <p><strong>Commande:</strong> #${safeOrderNumber}</p>
  <p><strong>Client:</strong> ${safeName} (${safeEmail})</p>
  <p><strong>Montant:</strong> ${order.totalAmount.toFixed(2)} €</p>
  
  <h3>Articles:</h3>
  <ul>${itemsHTML}</ul>
  
  ${safeAddress ? `<p><strong>Adresse:</strong><br>${safeAddress}</p>` : ''}
  
  <p style="margin-top: 30px;">
    <a href="https://www.atelier-lbf.fr/admin/commandes" 
       style="display: inline-block; padding: 12px 24px; background-color: #8B4513; color: white; text-decoration: none; border-radius: 4px;">
      Voir dans l'admin
    </a>
  </p>
</body>
</html>
  `;
}
