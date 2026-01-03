import { NextRequest, NextResponse } from 'next/server';
import { stripe, hasStripeCredentials } from '@/lib/stripe';
import { checkRateLimit, getClientIP, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

// Validation du format session ID Stripe (cs_test_... ou cs_live_...)
const STRIPE_SESSION_ID_REGEX = /^cs_(test|live)_[a-zA-Z0-9]+$/;

export async function GET(request: NextRequest) {
  if (!hasStripeCredentials() || !stripe) {
    return NextResponse.json(
      { error: 'Stripe non configuré' },
      { status: 503 }
    );
  }

  // Rate limiting pour éviter les abus
  const clientIP = getClientIP(request.headers);
  const { maxRequests, windowMs } = RATE_LIMIT_PRESETS.sensitive;
  
  if (!checkRateLimit(`checkout-session-${clientIP}`, maxRequests, windowMs)) {
    return NextResponse.json(
      { error: 'Trop de requêtes' },
      { status: 429 }
    );
  }

  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID manquant' },
      { status: 400 }
    );
  }

  // Valider le format du session ID
  if (!STRIPE_SESSION_ID_REGEX.test(sessionId)) {
    return NextResponse.json(
      { error: 'Format de session invalide' },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Ne retourner que les informations non sensibles
    return NextResponse.json({
      email: session.customer_email || session.customer_details?.email,
      amount: session.amount_total,
      status: session.payment_status,
    });
  } catch (error) {
    // Log seulement en dev
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur récupération session:', error);
    }
    return NextResponse.json(
      { error: 'Session introuvable' },
      { status: 404 }
    );
  }
}
