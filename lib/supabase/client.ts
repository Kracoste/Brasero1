import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Utiliser les cookies par défaut du navigateur
      },
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: true,
      },
    }
  )
}
