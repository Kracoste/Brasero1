import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()

    // Supprimer manuellement les cookies Supabase
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    // Obtenir l'origine pour la redirection
    const url = new URL(request.url)
    const redirectUrl = `${url.origin}/`
    
    const response = NextResponse.redirect(redirectUrl)
    
    // Supprimer tous les cookies qui commencent par sb-
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith('sb-')) {
        response.cookies.set(cookie.name, '', {
          expires: new Date(0),
          path: '/',
        })
      }
    })

    // Désactiver le cache pour cette réponse
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')

    return response
  } catch (error: any) {
    // En cas d'erreur, rediriger quand même vers l'accueil
    const url = new URL(request.url)
    return NextResponse.redirect(`${url.origin}/`)
  }
}
