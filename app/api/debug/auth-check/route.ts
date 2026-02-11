import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // Filtrer les cookies Supabase
  const supabaseCookies = allCookies.filter(c => 
    c.name.includes('supabase') || c.name.includes('sb-')
  );

  let userInfo = null;
  let authError = null;

  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
      userInfo = { id: user.id.slice(0, 8), email: user.email };
    }
    if (error) {
      authError = error.message;
    }
  } catch (e) {
    authError = e instanceof Error ? e.message : 'Unknown';
  }

  return NextResponse.json({
    cookies_count: allCookies.length,
    supabase_cookies: supabaseCookies.map(c => ({
      name: c.name,
      value_length: c.value.length,
      value_preview: c.value.slice(0, 20) + '...',
    })),
    user: userInfo,
    auth_error: authError,
  }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
