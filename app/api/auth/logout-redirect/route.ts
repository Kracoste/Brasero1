import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()

    // Supprimer manuellement les cookies Supabase
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    // Créer une redirection vers l'accueil
    const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'https://www.atelier-lbf.fr'))
    
    // Supprimer tous les cookies qui commencent par sb-
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith('sb-')) {
        response.cookies.set(cookie.name, '', {
          expires: new Date(0),
          path: '/',
        })
      }
    })

    return response
  } catch (error) {
    // En cas d'erreur, rediriger quand même
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'https://www.atelier-lbf.fr'))
  }
}
