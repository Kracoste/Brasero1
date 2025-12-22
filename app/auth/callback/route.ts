import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Vérifier que la session est bien créée
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Créer la réponse de redirection
        const redirectUrl = new URL(next, origin)
        const response = NextResponse.redirect(redirectUrl)
        
        // Forcer le navigateur à ne pas mettre en cache cette réponse
        response.headers.set('Cache-Control', 'no-store, max-age=0')
        
        return response
      }
    }
    console.error('Auth callback error:', error)
  }

  // Rediriger vers la page de connexion avec un message d'erreur
  return NextResponse.redirect(`${origin}/connexion?error=auth_callback_failed`)
}
