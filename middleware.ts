import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

// Headers de sécurité HTTP
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;
  
  // Rediriger non-www vers www pour éviter les problèmes de cookies
  if (hostname === 'atelier-lbf.fr') {
    const newUrl = new URL(request.url);
    newUrl.host = 'www.atelier-lbf.fr';
    return NextResponse.redirect(newUrl, 301);
  }
  
  // Mettre à jour la session ET récupérer l'utilisateur en une seule opération
  // C'est critique : on utilise UN SEUL client Supabase qui gère correctement les cookies
  const { response, user } = await updateSession(request);
  
  // Appliquer les headers de sécurité sur toutes les réponses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // HSTS uniquement en production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Protection admin côté serveur : utiliser le user déjà récupéré par updateSession
  // Plus besoin de créer un second client Supabase (c'était la cause du bug de redirection)
  if (pathname.startsWith('/admin')) {
    const adminEmails = (process.env.ADMIN_EMAILS || 'allouhugo@gmail.com')
      .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    
    if (!user?.email || !adminEmails.includes(user.email.toLowerCase())) {
      // Copier les cookies de la response updateSession vers la redirect
      // pour ne pas perdre les tokens rafraîchis
      const redirectResponse = NextResponse.redirect(new URL('/connexion', request.url));
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }
  }

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

