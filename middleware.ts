import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/auth'

// En dev, Next.js utilise eval() pour le HMR/Fast Refresh : on autorise
// 'unsafe-eval' uniquement dans ce contexte. En prod la CSP reste stricte.
const devScriptSrc = process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : '';

// Headers de sécurité HTTP
const securityHeaders: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Content-Security-Policy': [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${devScriptSrc} https://js.stripe.com https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.googletagmanager.com https://www.googletagmanager.com https://*.google-analytics.com https://www.google-analytics.com https://analytics.google.com https://va.vercel-scripts.com`,
    "style-src 'self' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com",
    "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://*.google.com https://*.googleapis.com https://*.gstatic.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com https://analytics.google.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://region1.google-analytics.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.googleapis.com https://*.google.com https://*.googletagmanager.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.google.com https://www.googletagmanager.com https://*.googletagmanager.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://js.stripe.com",
  ].join('; '),
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

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
    const emailOk = user?.email ? isAdminEmail(user.email) : false;
    if (!user?.email || !emailOk) {
      if (process.env.NODE_ENV !== 'production') {
        const maskedEmail = user?.email
          ? user.email.replace(/(.{2}).*(@.*)/, '$1***$2')
          : 'no user';
        console.log('[middleware] Admin access denied:', {
          email: maskedEmail,
          emailOk,
          adminEmailsConfigured: (process.env.ADMIN_EMAILS || '').length > 0
        });
      }
      // Copier les cookies de la response updateSession vers la redirect
      // pour ne pas perdre les tokens rafraîchis
      const redirectResponse = NextResponse.redirect(new URL('/connexion', request.url));
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      // Appliquer les security headers sur la redirection aussi
      Object.entries(securityHeaders).forEach(([key, value]) => {
        redirectResponse.headers.set(key, value);
      });
      if (process.env.NODE_ENV === 'production') {
        redirectResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      }
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

