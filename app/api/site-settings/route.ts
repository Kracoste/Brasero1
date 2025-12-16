import { NextResponse } from 'next/server';

import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const payload = await request.json();
  await saveSiteSettings(payload);
  return NextResponse.json({ ok: true });
}
