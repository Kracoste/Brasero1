import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL, hasResendCredentials } from '@/lib/email';

interface CartItem {
  name: string;
  price: number;
  slug: string;
  imageUrl?: string;
}

interface AbandonedCart {
  id: string;
  email: string;
  items: CartItem[];
  created_at: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

function buildEmailHtml(items: CartItem[]): string {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              ${
                item.imageUrl
                  ? `<td width="80" style="padding-right: 16px; vertical-align: top;">
                      <img src="${item.imageUrl}" alt="${item.name}" width="80" height="80" style="border-radius: 8px; object-fit: cover; display: block;" />
                    </td>`
                  : ''
              }
              <td style="vertical-align: middle;">
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${item.name}</p>
                <p style="margin: 4px 0 0; font-size: 15px; color: #92400e; font-weight: 600;">${formatPrice(item.price)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Votre panier vous attend</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #78350f 0%, #92400e 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: 1px;">ATELIER LBF</h1>
              <p style="margin: 8px 0 0; font-size: 13px; color: #fbbf24; letter-spacing: 2px; text-transform: uppercase;">L'art du brasero</p>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #1f2937;">Vous avez oubli&eacute; quelque chose...</h2>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Nous avons remarqu&eacute; que vous avez laiss&eacute; des articles dans votre panier. Ils sont toujours disponibles et n'attendent que vous !
              </p>

              <!-- Items -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fefce8; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                ${itemRows}
                <tr>
                  <td style="padding: 16px; text-align: right;">
                    <p style="margin: 0; font-size: 18px; font-weight: 700; color: #78350f;">Total : ${formatPrice(total)}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <a href="https://www.atelier-lbf.fr/panier" target="_blank" style="display: inline-block; background-color: #92400e; color: #ffffff; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 40px; border-radius: 8px; letter-spacing: 0.5px;">
                      Finaliser ma commande
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Trust badges -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                <tr>
                  <td width="33%" style="padding: 16px 8px; text-align: center; vertical-align: top;">
                    <p style="margin: 0; font-size: 20px;">&#128737;</p>
                    <p style="margin: 4px 0 0; font-size: 13px; font-weight: 600; color: #1f2937;">Garantie 2 ans</p>
                  </td>
                  <td width="33%" style="padding: 16px 8px; text-align: center; vertical-align: top;">
                    <p style="margin: 0; font-size: 20px;">&#128230;</p>
                    <p style="margin: 4px 0 0; font-size: 13px; font-weight: 600; color: #1f2937;">Retour 14 jours</p>
                  </td>
                  <td width="33%" style="padding: 16px 8px; text-align: center; vertical-align: top;">
                    <p style="margin: 0; font-size: 20px;">&#128274;</p>
                    <p style="margin: 4px 0 0; font-size: 13px; font-weight: 600; color: #1f2937;">Paiement s&eacute;curis&eacute;</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">
                Cet email a &eacute;t&eacute; envoy&eacute; car vous avez ajout&eacute; des articles &agrave; votre panier sur
                <a href="https://www.atelier-lbf.fr" style="color: #92400e; text-decoration: underline;">atelier-lbf.fr</a>.
              </p>
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">
                Si vous ne souhaitez plus recevoir ce type d'email, vous pouvez ignorer ce message. Nous ne vous enverrons qu'un seul rappel.
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Atelier LBF &mdash; Tous droits r&eacute;serv&eacute;s
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    if (!hasResendCredentials() || !resend) {
      return NextResponse.json(
        { error: 'Resend non configuré' },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // Query abandoned carts: not yet emailed, older than 30 min, newer than 24h
    const { data: carts, error: fetchError } = await supabase
      .from('abandoned_carts')
      .select('id, email, items, created_at')
      .eq('email_sent', false)
      .lt('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (fetchError) {
      console.error('Erreur récupération paniers abandonnés:', fetchError);
      return NextResponse.json(
        { error: 'Erreur base de données' },
        { status: 500 }
      );
    }

    if (!carts || carts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun panier abandonné à traiter',
        processed: 0,
      });
    }

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const cart of carts as AbandonedCart[]) {
      try {
        const items: CartItem[] = Array.isArray(cart.items) ? cart.items : [];

        if (items.length === 0) {
          continue;
        }

        const html = buildEmailHtml(items);

        const { error: sendError } = await resend.emails.send({
          from: FROM_EMAIL,
          to: cart.email,
          subject: 'Votre panier vous attend chez Atelier LBF',
          html,
        });

        if (sendError) {
          console.error(`Erreur envoi email à ${cart.email}:`, sendError);
          errors.push(`${cart.email}: ${sendError.message}`);
          failed++;
          continue;
        }

        // Mark as sent
        const { error: updateError } = await supabase
          .from('abandoned_carts')
          .update({
            email_sent: true,
            email_sent_at: new Date().toISOString(),
          })
          .eq('id', cart.id);

        if (updateError) {
          console.error(`Erreur mise à jour ${cart.id}:`, updateError);
          errors.push(`${cart.email}: update failed`);
          failed++;
          continue;
        }

        sent++;
      } catch (err) {
        console.error(`Erreur traitement panier ${cart.id}:`, err);
        errors.push(`${cart.email}: ${err instanceof Error ? err.message : 'unknown'}`);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: carts.length,
      sent,
      failed,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    console.error('Erreur CRON paniers abandonnés:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
