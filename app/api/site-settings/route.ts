import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/auth';
import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

const requireAdmin = async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !isAdminEmail(user.email)) {
    return null;
  }

  return user;
};

export async function GET(request: NextRequest) {
  // Rate limiting admin (30 requêtes/min)
  const clientIP = getClientIP(request.headers);
  if (!checkRateLimit(`admin-settings-${clientIP}`, 30, 60000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  // Rate limiting admin (20 requêtes/min pour les écritures)
  const clientIP = getClientIP(request.headers);
  if (!checkRateLimit(`admin-settings-write-${clientIP}`, 20, 60000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }

  const payload = await request.json();
  await saveSiteSettings(payload);
  return NextResponse.json({ ok: true });
}
