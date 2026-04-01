import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { clearSupabaseCookies } from '@/lib/supabase/clear-cookies'

export async function GET(request: Request) {
  const url = new URL(request.url)
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()

    const cookieStore = await cookies()
    const response = NextResponse.redirect(`${url.origin}/`)
    clearSupabaseCookies(response, cookieStore)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    return response
  } catch {
    return NextResponse.redirect(`${url.origin}/`)
  }
}
