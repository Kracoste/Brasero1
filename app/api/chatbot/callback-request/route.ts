import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL, ADMIN_EMAIL, escapeHtml } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email, phone, context } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // 1. Sauvegarder en base
    const supabase = await createClient();
    const { error } = await supabase
      .from('callback_requests')
      .insert({
        email: cleanEmail,
        phone: cleanPhone,
        context: context || null,
        status: 'pending',
      });

    if (error) {
      console.error('[callback-request] Supabase error:', error);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
    }

    // 2. Envoyer l'email de notification
    if (resend) {
      const safeEmail = escapeHtml(cleanEmail);
      const safePhone = escapeHtml(cleanPhone);
      const now = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      await resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        replyTo: cleanEmail,
        subject: `Demande de rappel — ${cleanPhone}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 500px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #92400e, #b45309); color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; font-size: 20px; }
              .header p { margin: 8px 0 0; font-size: 13px; opacity: 0.85; }
              .content { padding: 24px; background: #fffbeb; border: 1px solid #f59e0b33; border-top: none; }
              .field { background: white; border-radius: 8px; padding: 16px; margin-bottom: 12px; border: 1px solid #e5e7eb; }
              .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #92400e; font-weight: 700; margin-bottom: 4px; }
              .value { font-size: 18px; font-weight: 600; color: #1f2937; }
              .value a { color: #92400e; text-decoration: none; }
              .cta { display: block; background: #92400e; color: white; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin-top: 16px; }
              .footer { padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; background: #f9fafb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Demande de rappel</h1>
                <p>Un client souhaite être recontacté</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Téléphone</div>
                  <div class="value"><a href="tel:${safePhone}">${safePhone}</a></div>
                </div>
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
                </div>
                <a href="tel:${safePhone}" class="cta">Appeler maintenant</a>
              </div>
              <div class="footer">
                Reçu le ${now} via le chatbot — www.atelier-lbf.fr
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Demande de rappel\n\nTéléphone : ${cleanPhone}\nEmail : ${cleanEmail}\n\nReçu le ${now} via le chatbot atelier-lbf.fr`,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
