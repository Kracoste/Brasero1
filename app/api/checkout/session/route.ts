import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID manquant' },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      email: session.customer_email || session.customer_details?.email,
      amount: session.amount_total,
      status: session.payment_status,
    });
  } catch (error) {
    console.error('Erreur récupération session:', error);
    return NextResponse.json(
      { error: 'Session introuvable' },
      { status: 404 }
    );
  }
}
