import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()

    // Supprimer manuellement les cookies Supabase
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    const response = NextResponse.json({ success: true })
    
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}
