import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/auth';

// Ce fichier est temporaire — pour prévisualiser les templates email
// Supprimez-le avant la mise en production si vous ne voulez pas le garder

// On importe directement les fonctions de génération HTML
// Comme elles sont privées dans email.ts, on les recrée ici en important les données

export async function GET(request: NextRequest) {
  // Protection : admin seulement
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.email || !isAdminEmail(user.email)) {
    return new NextResponse('Non autorisé — connectez-vous en tant qu\'admin', { status: 401 });
  }

  const template = request.nextUrl.searchParams.get('template') || 'confirmation';

  // Données de test
  const mockOrder = {
    orderNumber: '3A5B6C7D',
    customerName: 'Jean Dupont',
    customerEmail: 'jean.dupont@email.com',
    customerPhone: '06.78.12.34.56',
    totalAmount: 729.00,
    shippingCost: 200.00,
    discount: 40.00,
    orderDate: 'Mardi 23 avril 2024 à 10h30',
    trackingNumber: '6T123456789FR',
    carrier: 'DB Schenker',
    shippingAddress: '80 Rue de la Fontaine, 34000 Montpellier, France',
    items: [
      {
        name: 'Braséro rustique en acier Corten',
        description: 'Braséro sur mesure en acier Corten',
        quantity: 1,
        price: 749.00,
        imageUrl: 'https://kxztmjqxsskvbqcohtgj.supabase.co/storage/v1/object/public/products/brasero-rustique-en-acier-corten-1767612493001-Brasero3.png',
      },
    ],
  };

  // Générer le HTML selon le template demandé
  let html = '';
  let title = '';

  switch (template) {
    case 'confirmation':
      title = 'Confirmation de commande';
      html = generateConfirmationPreview(mockOrder);
      break;
    case 'fabrication':
      title = 'En fabrication';
      html = generateProcessingPreview(mockOrder);
      break;
    case 'expedition':
      title = 'Expédition';
      html = generateShippedPreview(mockOrder);
      break;
    case 'livre':
      title = 'Livré';
      html = generateDeliveredPreview(mockOrder);
      break;
    default:
      // Page d'index avec liens vers les 4 templates
      html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Prévisualisation emails</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 20px;">
  <h1>📧 Prévisualisation des templates email</h1>
  <p>Cliquez sur un template pour le prévisualiser :</p>
  <ul style="list-style: none; padding: 0;">
    <li style="margin: 12px 0;"><a href="?template=confirmation" style="display: block; padding: 16px 20px; background: #faf8f5; border: 1px solid #e8e2da; border-radius: 8px; text-decoration: none; color: #1f2937; font-size: 16px;">📋 Confirmation de commande</a></li>
    <li style="margin: 12px 0;"><a href="?template=fabrication" style="display: block; padding: 16px 20px; background: #faf8f5; border: 1px solid #e8e2da; border-radius: 8px; text-decoration: none; color: #1f2937; font-size: 16px;">🔨 En cours de fabrication</a></li>
    <li style="margin: 12px 0;"><a href="?template=expedition" style="display: block; padding: 16px 20px; background: #faf8f5; border: 1px solid #e8e2da; border-radius: 8px; text-decoration: none; color: #1f2937; font-size: 16px;">📦 Commande expédiée</a></li>
    <li style="margin: 12px 0;"><a href="?template=livre" style="display: block; padding: 16px 20px; background: #faf8f5; border: 1px solid #e8e2da; border-radius: 8px; text-decoration: none; color: #1f2937; font-size: 16px;">✅ Commande livrée</a></li>
  </ul>
  <p style="color: #6b7280; font-size: 13px; margin-top: 30px;">⚠️ Cette page est réservée aux admins et utilise des données fictives.</p>
</body></html>`;
      return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// ============================================================================
// COPIES des templates (identiques à lib/email.ts) pour la prévisualisation
// ============================================================================

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

type MockOrder = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  shippingCost?: number;
  discount?: number;
  orderDate?: string;
  trackingNumber?: string;
  carrier?: string;
  shippingAddress?: string;
  items: Array<{ name: string; description?: string; quantity: number; price: number; imageUrl?: string; }>;
};

function itemsTable(items: MockOrder['items']): string {
  return items.map(item => `
    <tr>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; width: 80px;">
        ${item.imageUrl ? `<img src="${esc(item.imageUrl)}" alt="${esc(item.name)}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb;" />` : ''}
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">
        <strong style="font-size: 15px; color: #1f2937;">${esc(item.name)}</strong>
        ${item.description ? `<br><span style="font-size: 13px; color: #6b7280;">${esc(item.description)}</span>` : ''}
        <br><span style="font-size: 13px; color: #6b7280;">Quantité : ${item.quantity}</span>
      </td>
      <td style="padding: 16px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; text-align: right; white-space: nowrap;">
        <strong style="font-size: 15px; color: #1f2937;">${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong>
      </td>
    </tr>`).join('');
}

function emailHeader(): string {
  return `
    <div style="padding: 30px 20px 10px; text-align: center;">
      <img src="https://www.atelier-lbf.fr/logo/Logo1.png" alt="Atelier LBF" style="height: 80px; width: auto;" />
    </div>`;
}

function emailFooter(): string {
  return `
    <div style="background-color: #1f2937; padding: 24px 20px; text-align: center; border-radius: 0 0 4px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #d1d5db;">
        Besoin d'aide ? Répondez à ce mail ou contactez nous : <a href="mailto:atelier-lbf@outlook.com" style="color: #f5deb3; text-decoration: none;">atelier-lbf@outlook.com</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} ATELIER LBF &ndash; Moncoutant-sur-Sèvre, France
      </p>
    </div>`;
}

function infoBox(o: MockOrder): string {
  return `
    <div style="margin: 0 24px; padding: 18px 20px; background-color: #faf8f5; border-radius: 6px; border: 1px solid #e8e2da;">
      <table style="width: 100%; font-size: 14px; color: #374151;" cellpadding="0" cellspacing="0">
        <tr><td style="padding: 3px 0;"><strong>N° de commande :</strong> ${esc(o.orderNumber)}</td></tr>
        ${o.orderDate ? `<tr><td style="padding: 3px 0;"><strong>Date :</strong> ${esc(o.orderDate)}</td></tr>` : ''}
        <tr><td style="padding: 3px 0;"><strong>Email client :</strong> ${esc(o.customerEmail)}</td></tr>
        ${o.customerPhone ? `<tr><td style="padding: 3px 0;"><strong>Téléphone :</strong> ${esc(o.customerPhone)}</td></tr>` : ''}
      </table>
    </div>`;
}

function shell(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title></head>
<body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #374151; background-color: #f5f0eb; margin: 0; padding: 20px;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    ${body}
  </div>
</body></html>`;
}

function generateConfirmationPreview(o: MockOrder): string {
  const subtotal = o.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const ship = o.shippingCost ?? 0;
  const disc = o.discount ?? 0;
  const tva = o.totalAmount - (o.totalAmount / 1.2);
  const addr = o.shippingAddress ? esc(o.shippingAddress) : '';

  return shell('Confirmation de commande', `
    ${emailHeader()}
    <div style="text-align: center; padding: 10px 20px 20px;">
      <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #1f2937; margin: 0 0 8px 0; border-bottom: 2px solid #1f2937; display: inline-block; padding-bottom: 4px;">Confirmation de commande</h1>
      <p style="font-size: 15px; color: #6b7280; margin: 12px 0 0 0;">Merci ${esc(o.customerName)} &mdash; on a bien reçu votre commande.</p>
    </div>
    ${infoBox(o)}
    <div style="padding: 24px;">
      <h2 style="font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1f2937; margin: 0 0 16px 0; font-style: italic;">Article(s)</h2>
      <table style="width: 100%; border-collapse: collapse;"><tbody>${itemsTable(o.items)}</tbody></table>
    </div>
    <div style="padding: 0 24px 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="vertical-align: top; width: 50%; padding-right: 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; font-size: 14px;"><strong>Sous-total</strong></td><td style="padding: 6px 0; font-size: 14px; text-align: right;">${subtotal.toFixed(2).replace('.', ',')} €</td></tr>
              <tr><td style="padding: 6px 0; font-size: 14px;"><strong>Livraison</strong></td><td style="padding: 6px 0; font-size: 14px; text-align: right;">${subtotal.toFixed(2).replace('.', ',')} €</td></tr>
            </table>
            ${addr ? `<div style="margin-top: 12px;"><p style="font-size: 14px; margin: 0;"><strong>Livraison à domicile</strong></p><p style="font-size: 13px; color: #6b7280; margin: 4px 0 0 0;">${addr.replace(/,/g, '<br>')}</p><p style="font-size: 13px; color: #6b7280; margin: 4px 0 0 0;">Référence : ${esc(o.orderNumber)}</p></div>` : ''}
          </td>
          <td style="vertical-align: top; width: 50%; padding-left: 12px; border-left: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; font-size: 14px;">Livraison</td><td style="padding: 6px 0; font-size: 14px; text-align: right;">${ship > 0 ? ship.toFixed(2).replace('.', ',') + ' €' : 'Offerte'}</td></tr>
              ${disc > 0 ? `<tr><td style="padding: 6px 0; font-size: 14px;">Remise</td><td style="padding: 6px 0; font-size: 14px; color: #059669; text-align: right;">-${disc.toFixed(2).replace('.', ',')} €</td></tr>` : ''}
              <tr><td style="padding: 12px 0 6px; font-size: 20px; font-weight: 700; border-top: 2px solid #1f2937;"><strong>Total</strong></td><td style="padding: 12px 0 6px; font-size: 20px; font-weight: 700; text-align: right; border-top: 2px solid #1f2937;">${o.totalAmount.toFixed(2).replace('.', ',')} €</td></tr>
              <tr><td colspan="2" style="font-size: 13px; color: #6b7280; padding-top: 2px;">TVA : 20 % incluse (${tva.toFixed(2).replace('.', ',')} €)</td></tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
    ${emailFooter()}
  `);
}

function generateProcessingPreview(o: MockOrder): string {
  return shell('En fabrication', `
    ${emailHeader()}
    <div style="text-align: center; padding: 10px 20px 20px;">
      <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #1f2937; margin: 0 0 8px 0; border-bottom: 2px solid #1f2937; display: inline-block; padding-bottom: 4px;">🔨 En cours de fabrication</h1>
      <p style="font-size: 15px; color: #6b7280; margin: 12px 0 0 0;">Votre brasero est entre de bonnes mains, ${esc(o.customerName)} !</p>
    </div>
    ${infoBox(o)}
    <div style="padding: 20px 24px;">
      <p style="font-size: 15px; margin: 0 0 16px 0;">Bonne nouvelle ! Votre commande <strong>#${esc(o.orderNumber)}</strong> est maintenant en cours de fabrication dans notre atelier.</p>
      <p style="font-size: 15px; margin: 0 0 16px 0;">Nos artisans travaillent avec soin pour vous livrer un brasero de qualité. Vous recevrez un email dès que votre commande sera expédiée.</p>
      <div style="background-color: #faf8f5; border-left: 4px solid #b45309; padding: 14px 16px; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-size: 14px; color: #78350f;">⏳ Délai estimé : nos braseros artisanaux sont fabriqués sur commande. Comptez quelques jours de fabrication.</p>
      </div>
    </div>
    <div style="padding: 0 24px 16px;">
      <h2 style="font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1f2937; margin: 0 0 16px 0; font-style: italic;">Rappel de votre commande</h2>
      <table style="width: 100%; border-collapse: collapse;"><tbody>${itemsTable(o.items)}</tbody></table>
    </div>
    <div style="padding: 0 24px 24px;">
      <div style="padding-top: 16px; border-top: 2px solid #1f2937;">
        <table style="width: 100%;"><tr><td style="font-size: 20px; font-weight: 700;">Total</td><td style="font-size: 20px; font-weight: 700; text-align: right;">${o.totalAmount.toFixed(2).replace('.', ',')} €</td></tr></table>
      </div>
    </div>
    ${emailFooter()}
  `);
}

function generateShippedPreview(o: MockOrder): string {
  const addr = o.shippingAddress ? esc(o.shippingAddress) : '';
  const tracking = o.trackingNumber ? `
    <div style="margin: 20px 24px; padding: 18px 20px; background-color: #f0f9ff; border-radius: 6px; border: 1px solid #bae6fd; text-align: center;">
      <p style="margin: 0 0 6px 0; font-size: 13px; color: #0369a1; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Numéro de suivi</p>
      <p style="margin: 0; font-size: 22px; font-weight: 700; color: #0c4a6e; font-family: monospace;">${esc(o.trackingNumber)}</p>
      ${o.carrier ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #0369a1;">Transporteur : ${esc(o.carrier)}</p>` : ''}
    </div>` : '';

  return shell('Commande expédiée', `
    ${emailHeader()}
    <div style="text-align: center; padding: 10px 20px 20px;">
      <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #1f2937; margin: 0 0 8px 0; border-bottom: 2px solid #1f2937; display: inline-block; padding-bottom: 4px;">📦 Commande expédiée</h1>
      <p style="font-size: 15px; color: #6b7280; margin: 12px 0 0 0;">Votre commande est en route, ${esc(o.customerName)} !</p>
    </div>
    ${infoBox(o)}
    ${tracking}
    <div style="padding: 20px 24px;">
      <p style="font-size: 15px; margin: 0 0 16px 0;">Votre commande <strong>#${esc(o.orderNumber)}</strong> a été expédiée et devrait arriver dans les prochains jours.${o.trackingNumber ? ' Vous pouvez suivre votre colis en temps réel avec le numéro de suivi ci-dessus.' : ''}</p>
    </div>
    <div style="padding: 0 24px 16px;">
      <h2 style="font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1f2937; margin: 0 0 16px 0; font-style: italic;">Rappel de votre commande</h2>
      <table style="width: 100%; border-collapse: collapse;"><tbody>${itemsTable(o.items)}</tbody></table>
    </div>
    ${addr ? `<div style="padding: 0 24px 16px;"><p style="font-size: 14px; margin: 0;"><strong>Livraison à domicile</strong></p><p style="font-size: 13px; color: #6b7280; margin: 4px 0 0 0;">${addr.replace(/,/g, '<br>')}</p></div>` : ''}
    <div style="padding: 0 24px 24px;">
      <div style="padding-top: 16px; border-top: 2px solid #1f2937;">
        <table style="width: 100%;"><tr><td style="font-size: 20px; font-weight: 700;">Total</td><td style="font-size: 20px; font-weight: 700; text-align: right;">${o.totalAmount.toFixed(2).replace('.', ',')} €</td></tr></table>
      </div>
    </div>
    ${emailFooter()}
  `);
}

function generateDeliveredPreview(o: MockOrder): string {
  const addr = o.shippingAddress ? esc(o.shippingAddress) : '';

  return shell('Commande livrée', `
    ${emailHeader()}
    <div style="text-align: center; padding: 10px 20px 20px;">
      <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #1f2937; margin: 0 0 8px 0; border-bottom: 2px solid #1f2937; display: inline-block; padding-bottom: 4px;">✅ Commande livrée</h1>
      <p style="font-size: 15px; color: #6b7280; margin: 12px 0 0 0;">Votre commande a bien été livrée, ${esc(o.customerName)} !</p>
    </div>
    ${infoBox(o)}
    <div style="padding: 20px 24px;">
      <p style="font-size: 15px; margin: 0 0 16px 0;">Votre commande <strong>#${esc(o.orderNumber)}</strong> a bien été livrée. Nous espérons que vous apprécierez votre brasero artisanal !</p>
      <p style="font-size: 15px; margin: 0 0 16px 0;">N'hésitez pas à nous contacter si vous avez la moindre question sur l'utilisation ou l'entretien de votre brasero.</p>
      <div style="background-color: #faf8f5; border-left: 4px solid #059669; padding: 14px 16px; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-size: 14px; color: #065f46;">💡 Consultez nos <a href="https://www.atelier-lbf.fr/recettes" style="color: #059669; font-weight: 600; text-decoration: none;">recettes</a> pour profiter pleinement de votre brasero !</p>
      </div>
    </div>
    <div style="padding: 0 24px 16px;">
      <h2 style="font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1f2937; margin: 0 0 16px 0; font-style: italic;">Rappel de votre commande</h2>
      <table style="width: 100%; border-collapse: collapse;"><tbody>${itemsTable(o.items)}</tbody></table>
    </div>
    ${addr ? `<div style="padding: 0 24px 16px;"><p style="font-size: 14px; margin: 0;"><strong>Livrée à</strong></p><p style="font-size: 13px; color: #6b7280; margin: 4px 0 0 0;">${addr.replace(/,/g, '<br>')}</p></div>` : ''}
    <div style="padding: 0 24px 24px;">
      <div style="padding-top: 16px; border-top: 2px solid #1f2937;">
        <table style="width: 100%;"><tr><td style="font-size: 20px; font-weight: 700;">Total</td><td style="font-size: 20px; font-weight: 700; text-align: right;">${o.totalAmount.toFixed(2).replace('.', ',')} €</td></tr></table>
      </div>
    </div>
    ${emailFooter()}
  `);
}
