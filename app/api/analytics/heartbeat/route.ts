import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getSupabaseAdminClient, hasSupabaseAdminCredentials } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIP, RATE_LIMIT_PRESETS } from "@/lib/rate-limit";
import { isValidUUID, isAllowedOrigin } from "@/lib/validation";

// POST - Mettre à jour la durée de session (heartbeat)
export async function POST(request: Request) {
  const adminClient = getSupabaseAdminClient();
  if (!hasSupabaseAdminCredentials() || !adminClient) {
    return NextResponse.json({ success: true, skipped: true }, { status: 200 });
  }

  try {
    const headersList = await headers();
    
    // Vérification de l'origine
    const origin = headersList.get('origin');
    if (process.env.NODE_ENV === 'production' && origin && !isAllowedOrigin(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Rate limiting (plus permissif car envoyé fréquemment)
    const clientIP = getClientIP(headersList);
    // 200 requêtes par minute (1 heartbeat toutes les 30s = 2/min par session)
    if (!checkRateLimit(`heartbeat-${clientIP}`, 200, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    
    // Parser le body (peut être JSON ou FormData via sendBeacon)
    let sessionId: string | undefined;
    let isLeaving = false;
    
    const contentType = headersList.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      sessionId = body.sessionId;
      isLeaving = body.isLeaving === true;
    } else if (contentType.includes('text/plain')) {
      // sendBeacon envoie en text/plain par défaut
      const text = await request.text();
      try {
        const parsed = JSON.parse(text);
        sessionId = parsed.sessionId;
        isLeaving = parsed.isLeaving === true;
      } catch {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }
    
    // Valider le sessionId
    if (!sessionId || !isValidUUID(sessionId)) {
      return NextResponse.json({ error: 'Invalid sessionId' }, { status: 400 });
    }

    // Récupérer la session actuelle
    const { data: session, error: fetchError } = await adminClient
      .from('visitor_sessions')
      .select('started_at, last_activity_at, duration_seconds')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Calculer la nouvelle durée
    const now = new Date();
    const startedAt = new Date(session.started_at);
    const newDuration = Math.round((now.getTime() - startedAt.getTime()) / 1000);

    // Mettre à jour la session
    const { error: updateError } = await adminClient
      .from('visitor_sessions')
      .update({
        last_activity_at: now.toISOString(),
        duration_seconds: newDuration,
        // Si l'utilisateur quitte, on peut marquer la session comme terminée
        ...(isLeaving ? { ended_at: now.toISOString() } : {}),
      })
      .eq('id', sessionId);

    if (updateError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Heartbeat update failed:', updateError);
      }
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, duration: newDuration }, { status: 200 });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Heartbeat error:', error);
    }
    return NextResponse.json({ error: 'Heartbeat failed' }, { status: 500 });
  }
}
