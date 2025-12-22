import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton pour le client browser - assure qu'une seule instance est utilisée
let browserClient: SupabaseClient | null = null

export function createClient() {
  if (typeof window === 'undefined') {
    // Côté serveur, créer une nouvelle instance à chaque fois
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  if (browserClient) {
    return browserClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  browserClient = createBrowserClient(url, key, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey: 'sb-auth-token',
      storage: {
        getItem: (key) => {
          if (typeof window === 'undefined') return null
          return window.localStorage.getItem(key)
        },
        setItem: (key, value) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value)
          }
        },
        removeItem: (key) => {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key)
          }
        },
      },
    },
  })

  return browserClient
}

// Fonction pour réinitialiser le client (après déconnexion)
export function resetClient() {
  browserClient = null
}
