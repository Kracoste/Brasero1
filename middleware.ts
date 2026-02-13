import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
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
  
  // Toujours mettre à jour la session pour maintenir l'état de connexion
  const response = await updateSession(request);
  
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
  
  // Protection admin côté serveur : bloquer l'accès aux routes /admin si non-admin
  if (pathname.startsWith('/admin')) {
    const adminEmails = (process.env.ADMIN_EMAILS || 'allouhugo@gmail.com')
      .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll() {},
          },
        }
      );
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email || !adminEmails.includes(user.email.toLowerCase())) {
        return NextResponse.redirect(new URL('/connexion', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/connexion', request.url));
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

