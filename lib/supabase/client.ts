import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Singleton pattern pour éviter de créer plusieurs clients
  if (client) return client;
  
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Assurer la persistance de la session
        persistSession: true,
        autoRefreshToken: true,
        // Désactiver detectSessionInUrl car on gère ça via le callback
        detectSessionInUrl: false,
        flowType: 'pkce',
        // Stocker dans localStorage pour une meilleure persistance
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'sb-auth-token',
      },
    }
  );
  
  return client;
}
