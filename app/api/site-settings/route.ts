import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/auth';
import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings';

const requireAdmin = async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !isAdminEmail(user.email)) {
    return null;
  }

  return user;
};

export async function GET() {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }

  const payload = await request.json();
  await saveSiteSettings(payload);
  return NextResponse.json({ ok: true });
}
