import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(url, key, {
    cookies: {
      // Configuration explicite pour la production
    },
    cookieOptions: {
      // Assurer que les cookies fonctionnent sur le domaine de production
      domain: typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
        ? window.location.hostname 
        : undefined,
      path: '/',
      sameSite: 'lax',
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    },
  })
}
