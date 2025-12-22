import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { REDIRECT_PARAM, AUTH_ROUTES } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get(REDIRECT_PARAM) ?? AUTH_ROUTES.home

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.session) {
      // La session est bien créée, on redirige
      const redirectUrl = new URL(next, origin)
      const response = NextResponse.redirect(redirectUrl)
      
      // Forcer le navigateur à ne pas mettre en cache cette réponse
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
      response.headers.set('Pragma', 'no-cache')
      
      return response
    }
    console.error('Auth callback error:', error)
  }

  // Rediriger vers la page de connexion avec un message d'erreur
  return NextResponse.redirect(`${origin}${AUTH_ROUTES.login}?error=auth_callback_failed`)
}
