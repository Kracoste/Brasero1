import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Fonction pour extraire le domaine racine pour les cookies
function getCookieDomain(hostname: string): string | undefined {
  // En développement local, ne pas spécifier de domaine
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return undefined;
  }
  // Pour atelier-lbf.fr, utiliser le domaine racine pour partager les cookies
  if (hostname.includes('atelier-lbf.fr')) {
    return '.atelier-lbf.fr';
  }
  // Pour brasero-atelier.fr
  if (hostname.includes('brasero-atelier.fr')) {
    return '.brasero-atelier.fr';
  }
  return undefined;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const hostname = request.headers.get('host') || '';
  const cookieDomain = getCookieDomain(hostname);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              ...(cookieDomain ? { domain: cookieDomain } : {}),
            })
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Refresh session - augmenter le timeout pour laisser le temps à la session de se charger
  try {
    await supabase.auth.getUser();
  } catch {
    // If error, continue without blocking
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
