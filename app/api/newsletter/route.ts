import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isValidEmail } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request.headers);
    if (!checkRateLimit(`newsletter-${clientIP}`, 3, 60000)) {
      return NextResponse.json(
        { error: 'Trop de tentatives, réessayez plus tard' },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service temporairement indisponible' },
        { status: 503 }
      );
    }

    // Upsert: if email exists, just update subscribed_at
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email: normalizedEmail, subscribed_at: new Date().toISOString(), is_active: true },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('[Newsletter] Error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Newsletter] Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
