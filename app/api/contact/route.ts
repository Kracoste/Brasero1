import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont requis" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      );
    }

    // Send email to the store
    const { data, error } = await resend.emails.send({
      from: "Atelier LBF <onboarding@resend.dev>", // Domaine par défaut Resend (gratuit)
      to: ["atelier-lbf@outlook.com"], // Email vérifié sur Resend
      replyTo: email,
      subject: subject || `Nouveau message de ${name} via le site`,
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
                <span class="label">Nom :</span> ${name}
              </div>
              <div class="field">
                <span class="label">Email :</span> <a href="mailto:${email}">${email}</a>
              </div>
              <div class="field">
                <span class="label">Message :</span>
                <div class="message">${message.replace(/\n/g, "<br>")}</div>
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
Nouveau message de ${name}

Nom: ${name}
Email: ${email}

Message:
${message}

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

    // Note: L'email de confirmation au client nécessite un domaine vérifié sur Resend
    // Pour l'activer, ajoutez votre domaine atelier-lbf.fr dans les paramètres Resend

    return NextResponse.json(
      { success: true, message: "Email envoyé avec succès", id: data?.id },
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
