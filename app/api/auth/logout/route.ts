import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { clearSupabaseCookies } from '@/lib/supabase/clear-cookies'

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()

    const cookieStore = await cookies()
    const response = NextResponse.json({ success: true })
    clearSupabaseCookies(response, cookieStore)
    return response
  } catch (error) {
    console.error('[Logout] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
