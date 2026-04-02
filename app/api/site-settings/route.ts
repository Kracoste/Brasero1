import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { verifyAdminAccess } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

const requireAdmin = async (): Promise<NextResponse | null> => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }
  const isAdmin = await verifyAdminAccess(user.id, user.email, adminClient);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  return null;
};

export async function GET(request: NextRequest) {
  // Rate limiting admin (30 requêtes/min)
  const clientIP = getClientIP(request.headers);
  if (!checkRateLimit(`admin-settings-${clientIP}`, 30, 60000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  const denied = await requireAdmin();
  if (denied) return denied;

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  // Rate limiting admin (20 requêtes/min pour les écritures)
  const clientIP = getClientIP(request.headers);
  if (!checkRateLimit(`admin-settings-write-${clientIP}`, 20, 60000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  const denied = await requireAdmin();
  if (denied) return denied;

  const payload = await request.json();
  await saveSiteSettings(payload);
  return NextResponse.json({ ok: true });
}
