import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/auth'

// Headers de sécurité HTTP
const securityHeaders: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://*.googleapis.com",
    "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.google.com https://*.googleapis.com https://*.gstatic.com https://www.google-analytics.com https://www.googletagmanager.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://www.google-analytics.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.googleapis.com https://*.google.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.google.com https://www.googletagmanager.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://js.stripe.com",
  ].join('; '),
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
    if (!user?.email || !isAdminEmail(user.email)) {
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

