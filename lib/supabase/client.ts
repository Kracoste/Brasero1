import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function createClient() {
  // Éviter de créer le client pendant le pre-rendering côté serveur
  if (typeof window === 'undefined') {
    // Retourner un client factice pour le SSR/build
    return null as unknown as SupabaseClient
  }

  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('Supabase credentials not available')
    return null as unknown as SupabaseClient
  }

  client = createBrowserClient(url, key, {
    cookieOptions: {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  })

  return client
}
