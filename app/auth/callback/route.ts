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
      // Vérifier que la session est bien établie
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('Auth callback - Session établie pour:', user.email);
        
        // Utiliser www. en production pour la cohérence des cookies
        let redirectOrigin = origin
        if (process.env.NODE_ENV === 'production' && origin.includes('atelier-lbf.fr') && !origin.includes('www.')) {
          redirectOrigin = origin.replace('atelier-lbf.fr', 'www.atelier-lbf.fr')
        }
        
        const redirectUrl = new URL(next, redirectOrigin)
        const response = NextResponse.redirect(redirectUrl)
        
        // Forcer le navigateur à ne pas mettre en cache cette réponse
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
        
        return response
      }
    }
    console.error('Auth callback error:', error)
  }

  // Rediriger vers la page de connexion avec un message d'erreur
  return NextResponse.redirect(`${origin}${AUTH_ROUTES.login}?error=auth_callback_failed`)
}
