import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { REDIRECT_PARAM, AUTH_ROUTES } from '@/lib/auth'
import { devLog, devError } from '@/lib/supabase/utils'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get(REDIRECT_PARAM) ?? AUTH_ROUTES.home

  // Sécurité : valider la redirection via URL parsing pour détecter les redirections externes
  let next = AUTH_ROUTES.home;
  if (rawNext && typeof rawNext === 'string') {
    try {
      // Résoudre contre l'origin pour détecter les redirections externes
      const resolved = new URL(rawNext, request.nextUrl.origin);
      if (resolved.origin === request.nextUrl.origin) {
        next = resolved.pathname + resolved.search + resolved.hash;
      }
    } catch {
      // URL invalide → redirection par défaut
    }
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        devLog('Auth callback - Session établie pour:', user.email);
        
        const redirectUrl = new URL(next, origin)
        const response = NextResponse.redirect(redirectUrl)
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        
        return response
      }
    }
    devError('Auth callback error:', error)
  }

  return NextResponse.redirect(`${origin}${AUTH_ROUTES.login}?error=auth_callback_failed`)
}
