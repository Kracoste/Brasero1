import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/auth';
import {
  generateOrderConfirmationHTML,
  generateOrderShippedHTML,
  generateOrderProcessingHTML,
  generateOrderDeliveredHTML,
  type OrderEmailData,
} from '@/lib/email';

/**
 * Prévisualisation des templates email — admin seulement.
 * Utilise directement les fonctions de génération de lib/email.ts (source unique de vérité).
 */
export async function GET(request: NextRequest) {
  // Protection : admin seulement
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.email || !isAdminEmail(user.email)) {
    return new NextResponse('Non autorisé — connectez-vous en tant qu\'admin', { status: 401 });
  }

  const template = request.nextUrl.searchParams.get('template') || 'confirmation';

  // Données de test
  const mockOrder: OrderEmailData = {
    orderNumber: '3A5B6C7D',
    customerName: 'Jean Dupont',
    customerEmail: 'jean.dupont@email.com',
    customerPhone: '06.85.64.33.40',
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

  // Générer le HTML directement via les fonctions de lib/email.ts
  let html = '';

  switch (template) {
    case 'confirmation':
      html = generateOrderConfirmationHTML(mockOrder);
      break;
    case 'fabrication':
      html = generateOrderProcessingHTML(mockOrder);
      break;
    case 'expedition':
      html = generateOrderShippedHTML(mockOrder);
      break;
    case 'livre':
      html = generateOrderDeliveredHTML(mockOrder);
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