import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/email";
import { checkRateLimit, getClientIP, RATE_LIMIT_PRESETS } from "@/lib/rate-limit";
import { isValidEmail } from "@/lib/validation";

/**
 * Échappe les caractères HTML dangereux pour prévenir les injections XSS
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting — protection anti-spam
    const clientIP = getClientIP(request.headers);
    const { maxRequests, windowMs } = RATE_LIMIT_PRESETS.sensitive;
    if (!checkRateLimit(`contact-${clientIP}`, maxRequests, windowMs)) {
      return NextResponse.json(
        { error: "Trop de messages envoyés. Veuillez réessayer dans quelques minutes." },
        { status: 429 }
      );
    }

    // Check if Resend is configured
    if (!resend) {
      return NextResponse.json(
        { error: "Service d'email non configuré" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { name, email, message, subject } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont requis" },
        { status: 400 }
      );
    }

    // Validation types et longueurs
    if (typeof name !== 'string' || name.length > 200) {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }
    if (typeof message !== 'string' || message.length > 5000) {
      return NextResponse.json({ error: "Message trop long (max 5000 caractères)" }, { status: 400 });
    }
    if (subject && (typeof subject !== 'string' || subject.length > 300)) {
      return NextResponse.json({ error: "Sujet invalide" }, { status: 400 });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      );
    }

    // Sanitizer toutes les entrées pour le HTML
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeMessage = escapeHtml(message.trim());
    const safeSubject = subject ? escapeHtml(subject.trim()) : '';

    // Send email to the store
    const { data: _data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: email.trim(),
      subject: safeSubject || `Nouveau message de ${safeName} via le site`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f6f1e9; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #8B4513; }
            .message { background: white; padding: 15px; border-left: 4px solid #8B4513; margin-top: 10px; }
            .footer { padding: 15px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nouveau message - Atelier LBF</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Nom :</span> ${safeName}
              </div>
              <div class="field">
                <span class="label">Email :</span> <a href="mailto:${safeEmail}">${safeEmail}</a>
              </div>
              <div class="field">
                <span class="label">Message :</span>
                <div class="message">${safeMessage.replace(/\n/g, "<br>")}</div>
              </div>
            </div>
            <div class="footer">
              <p>Message envoyé depuis le formulaire de contact du site www.atelier-lbf.fr</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Nouveau message de ${safeName}

Nom: ${safeName}
Email: ${safeEmail}

Message:
${safeMessage}

---
Envoyé depuis le formulaire de contact - www.atelier-lbf.fr
      `,
    });

    if (error) {
      console.error("Erreur Resend:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
