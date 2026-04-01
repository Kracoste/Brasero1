import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy init : le client est créé à la première demande, pas au démarrage du module.
// Cela permet de gérer la rotation de clé sans redéploiement et évite les erreurs
// au démarrage si les variables d'environnement ne sont pas encore disponibles.
let adminClientInstance: SupabaseClient | null | undefined = undefined;

export const getSupabaseAdminClient = (): SupabaseClient | null => {
  if (adminClientInstance !== undefined) return adminClientInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    adminClientInstance = null;
    return null;
  }

  adminClientInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          cache: 'no-store',
        });
      },
    },
  });

  return adminClientInstance;
};

export const hasSupabaseAdminCredentials = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

