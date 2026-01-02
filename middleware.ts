import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  // Rediriger non-www vers www pour éviter les problèmes de cookies
  if (hostname === 'atelier-lbf.fr') {
    const newUrl = new URL(request.url);
    newUrl.host = 'www.atelier-lbf.fr';
    return NextResponse.redirect(newUrl, 301);
  }
  
  // Toujours mettre à jour la session pour maintenir l'état de connexion
  const response = await updateSession(request);
  
  // Désactiver le cache CDN pour les pages produits (données dynamiques)
  if (pathname.startsWith('/produits/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('CDN-Cache-Control', 'no-store');
    response.headers.set('Vercel-CDN-Cache-Control', 'no-store');
  }
  
  return response;
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

