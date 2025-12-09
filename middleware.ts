import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Ignorer le middleware pour les routes publiques qui n'ont pas besoin d'auth
  const publicPaths = ['/', '/produits', '/accessoires', '/contact', '/atelier', '/info', '/cgv', '/mentions-legales']
  const pathname = request.nextUrl.pathname
  
  // Si c'est une route publique, passer sans vérifier la session
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

