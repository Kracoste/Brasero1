import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { resend, FROM_EMAIL, hasResendCredentials, escapeHtml } from '@/lib/email';

// Email types and their delay in days after order completion
const EMAIL_SEQUENCE = [
  { type: 'tips_entretien', delayDays: 3 },
  { type: 'demande_avis', delayDays: 14 },
] as const;

type EmailSequenceType = (typeof EMAIL_SEQUENCE)[number]['type'];

export async function GET(request: NextRequest) {
  // Vérifier l'autorisation
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 });
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!hasResendCredentials() || !resend) {
    return NextResponse.json(
      { error: 'Resend non configuré' },
      { status: 503 }
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase non configuré' },
      { status: 503 }
    );
  }

  const results: Array<{
    order_id: string;
    email_type: string;
    success: boolean;
    error?: string;
  }> = [];

  try {
    // Récupérer les commandes complétées (status = pending, completed, delivered, shipped)
    // qui ont été créées dans les 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, customer_email, customer_name, created_at, status, items')
      .in('status', ['pending', 'completed', 'delivered', 'shipped'])
      .gte('created_at', thirtyDaysAgo.toISOString())
      .not('customer_email', 'is', null);

    if (ordersError) {
      console.error('Erreur récupération commandes:', ordersError);
      return NextResponse.json(
        { error: 'Erreur base de données', details: ordersError.message },
        { status: 500 }
      );
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        message: 'Aucune commande à traiter',
        sent: 0,
      });
    }

    // Récupérer les emails déjà envoyés
    const orderIds = orders.map((o) => o.id);
    const { data: sentEmails, error: sentError } = await supabase
      .from('post_purchase_emails')
      .select('order_id, email_type')
      .in('order_id', orderIds);

    if (sentError) {
      console.error('Erreur récupération emails envoyés:', sentError);
      return NextResponse.json(
        { error: 'Erreur base de données', details: sentError.message },
        { status: 500 }
      );
    }

    // Créer un set pour vérification rapide
    const sentSet = new Set(
      (sentEmails || []).map((e) => `${e.order_id}:${e.email_type}`)
    );

    const now = new Date();

    for (const order of orders) {
      const orderDate = new Date(order.created_at);

      for (const step of EMAIL_SEQUENCE) {
        const key = `${order.id}:${step.type}`;

        // Déjà envoyé
        if (sentSet.has(key)) continue;

        // Vérifier si le délai est atteint
        const sendAfter = new Date(orderDate);
        sendAfter.setDate(sendAfter.getDate() + step.delayDays);

        if (now < sendAfter) continue;

        // Envoyer l'email
        try {
          const html = getEmailHtml(step.type, order.customer_name, order.items);
          const subject = getEmailSubject(step.type);

          await resend.emails.send({
            from: FROM_EMAIL,
            to: order.customer_email,
            subject,
            html,
          });

          // Enregistrer l'envoi
          await supabase
            .from('post_purchase_emails')
            .insert({
              order_id: order.id,
              email_type: step.type,
              recipient_email: order.customer_email,
            });

          results.push({
            order_id: order.id,
            email_type: step.type,
            success: true,
          });
        } catch (emailError) {
          const errorMsg =
            emailError instanceof Error
              ? emailError.message
              : String(emailError);
          console.error(
            `Erreur envoi email ${step.type} pour commande ${order.id}:`,
            errorMsg
          );
          results.push({
            order_id: order.id,
            email_type: step.type,
            success: false,
            error: errorMsg,
          });
        }
      }
    }

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `Traitement terminé: ${sent} envoyé(s), ${failed} erreur(s)`,
      sent,
      failed,
      details: results,
    });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : String(error);
    console.error('Erreur cron post-purchase-emails:', errorMsg);
    return NextResponse.json(
      { error: 'Erreur interne', details: errorMsg },
      { status: 500 }
    );
  }
}

function getEmailSubject(type: EmailSequenceType): string {
  switch (type) {
    case 'tips_entretien':
      return 'Bien entretenir votre brasero — nos conseils';
    case 'demande_avis':
      return 'Comment trouvez-vous votre brasero ?';
  }
}

function getEmailHtml(
  type: EmailSequenceType,
  customerName: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[]
): string {
  const name = customerName || 'cher client';
  switch (type) {
    case 'tips_entretien':
      return getTipsEntretienHtml(name);
    case 'demande_avis':
      return getDemandeAvisHtml(name, items);
  }
}

function getTipsEntretienHtml(name: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f7f5f2;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" style="background-color:#f7f5f2;padding:40px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;">
            <h1 style="color:#e8dfd5;font-size:22px;margin:0;font-weight:400;letter-spacing:1px;">Atelier LBF</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 20px 0;font-weight:600;">Bien entretenir votre brasero</h2>
            <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 16px 0;">Bonjour ${escapeHtml(name)},</p>
            <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 24px 0;">Votre brasero est désormais chez vous ! Pour qu'il vous accompagne pendant de nombreuses années, voici quelques conseils d'entretien essentiels.</p>

            <!-- Acier Corten -->
            <table role="presentation" width="100%" style="background-color:#faf8f5;border-radius:6px;margin:0 0 16px 0;">
              <tr><td style="padding:20px 24px;">
                <h3 style="color:#8b6914;font-size:16px;margin:0 0 10px 0;">🔶 Acier Corten</h3>
                <ul style="color:#555;font-size:14px;line-height:1.8;margin:0;padding-left:18px;">
                  <li>Laissez la patine se former naturellement — c'est elle qui protège le métal</li>
                  <li>Évitez les produits chimiques ou abrasifs</li>
                  <li>Les premières pluies accélèrent la formation de la patine, c'est normal</li>
                </ul>
              </td></tr>
            </table>

            <!-- Acier Peint -->
            <table role="presentation" width="100%" style="background-color:#f5f7fa;border-radius:6px;margin:0 0 16px 0;">
              <tr><td style="padding:20px 24px;">
                <h3 style="color:#2c5282;font-size:16px;margin:0 0 10px 0;">🎨 Acier Peint</h3>
                <ul style="color:#555;font-size:14px;line-height:1.8;margin:0;padding-left:18px;">
                  <li>Nettoyez avec un chiffon doux après chaque utilisation</li>
                  <li>Protégez votre brasero en hiver avec une housse adaptée</li>
                  <li>Retouchez les éventuelles éraflures avec une peinture haute température</li>
                </ul>
              </td></tr>
            </table>

            <!-- Conseils généraux -->
            <table role="presentation" width="100%" style="background-color:#f5faf5;border-radius:6px;margin:0 0 28px 0;">
              <tr><td style="padding:20px 24px;">
                <h3 style="color:#2d6a4f;font-size:16px;margin:0 0 10px 0;">✅ Conseils généraux</h3>
                <ul style="color:#555;font-size:14px;line-height:1.8;margin:0;padding-left:18px;">
                  <li>Videz les cendres une fois refroidies après chaque utilisation</li>
                  <li>Stockez votre brasero à l'abri ou utilisez une housse de protection</li>
                  <li>Utilisez du bois sec pour une meilleure combustion et moins de résidus</li>
                </ul>
              </td></tr>
            </table>

            <!-- CTA -->
            <table role="presentation" width="100%">
              <tr><td align="center">
                <a href="https://www.atelier-lbf.fr/info/astuces-conseils" style="display:inline-block;background-color:#1a1a1a;color:#e8dfd5;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:15px;font-weight:500;letter-spacing:0.5px;">Voir tous nos conseils</a>
              </td></tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background-color:#faf8f5;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="color:#999;font-size:12px;line-height:1.6;margin:0;">Atelier LBF — Braseros artisanaux français</p>
            <p style="color:#bbb;font-size:11px;margin:8px 0 0 0;">
              <a href="https://www.atelier-lbf.fr" style="color:#999;text-decoration:underline;">www.atelier-lbf.fr</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function getDemandeAvisHtml(
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[]
): string {
  // Try to build a product-specific link
  let ctaUrl = 'https://www.atelier-lbf.fr/produits';
  let productMention = 'votre brasero';

  if (items && items.length > 0 && items[0].name) {
    productMention = items[0].name;
    if (items[0].slug) {
      ctaUrl = `https://www.atelier-lbf.fr/produits/${items[0].slug}`;
    }
  }

  const safeProductMention = escapeHtml(productMention);
  const safeName = escapeHtml(name);
  const safeCtaUrl = escapeHtml(ctaUrl);

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f7f5f2;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" style="background-color:#f7f5f2;padding:40px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" style="max-width:600px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;">
            <h1 style="color:#e8dfd5;font-size:22px;margin:0;font-weight:400;letter-spacing:1px;">Atelier LBF</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 20px 0;font-weight:600;">Comment trouvez-vous ${safeProductMention} ?</h2>
            <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 16px 0;">Bonjour ${safeName},</p>
            <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 16px 0;">Cela fait maintenant quelques jours que vous profitez de ${safeProductMention}. Nous espérons qu'il vous apporte entière satisfaction !</p>
            <p style="color:#444;font-size:15px;line-height:1.7;margin:0 0 24px 0;">Votre avis compte et aide d'autres passionnés à faire leur choix. Pourriez-vous prendre un instant pour partager votre expérience ?</p>

            <!-- Stars visual -->
            <table role="presentation" width="100%" style="margin:0 0 28px 0;">
              <tr><td align="center">
                <p style="font-size:32px;margin:0;letter-spacing:4px;">⭐⭐⭐⭐⭐</p>
              </td></tr>
            </table>

            <!-- CTA -->
            <table role="presentation" width="100%">
              <tr><td align="center">
                <a href="${safeCtaUrl}" style="display:inline-block;background-color:#8b6914;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:15px;font-weight:500;letter-spacing:0.5px;">Donner mon avis</a>
              </td></tr>
            </table>

            <p style="color:#888;font-size:13px;line-height:1.6;margin:24px 0 0 0;text-align:center;">Cela ne prend qu'une minute et nous aide énormément. Merci !</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background-color:#faf8f5;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="color:#999;font-size:12px;line-height:1.6;margin:0;">Atelier LBF — Braseros artisanaux français</p>
            <p style="color:#bbb;font-size:11px;margin:8px 0 0 0;">
              <a href="https://www.atelier-lbf.fr" style="color:#999;text-decoration:underline;">www.atelier-lbf.fr</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
