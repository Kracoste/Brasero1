import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const missingCredentials = !supabaseUrl || !serviceRoleKey;

export const supabaseAdminClient: SupabaseClient | null = !missingCredentials
  ? createClient(supabaseUrl!, serviceRoleKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: (url, options) => {
          return fetch(url, {
            ...options,
            cache: 'no-store',
          })
        },
      },
    })
  : null;

export const hasSupabaseAdminCredentials = () => !missingCredentials;

export const getSupabaseAdminClient = () => supabaseAdminClient;
