/**
 * Configuration centralisée de l'authentification
 * Toutes les constantes et fonctions utilitaires d'auth sont ici
 */

// Liste des emails administrateurs (serveur uniquement)
const rawEmails = process.env.ADMIN_EMAILS || '';
const envAdminEmails = rawEmails
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export const ADMIN_EMAILS: string[] = envAdminEmails;

/**
 * Vérifie si un email est celui d'un administrateur
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  if (ADMIN_EMAILS.length === 0) {
    // Ne pas logger côté client (variable serveur uniquement)
    if (typeof window === 'undefined') {
      console.warn('[AUTH] ADMIN_EMAILS not set — no admin access allowed.');
    }
    return false;
  }
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Vérifie si un utilisateur est admin : email autorisé ET rôle 'admin' en base.
 * Double vérification pour éviter qu'un compte avec le bon email mais sans rôle obtienne l'accès.
 * À utiliser côté serveur uniquement (nécessite le client admin Supabase).
 */
export async function verifyAdminAccess(
  userId: string,
  email: string | null | undefined,
  adminClient: import('@supabase/supabase-js').SupabaseClient
): Promise<boolean> {
  if (!isAdminEmail(email)) return false;

  try {
    const { data } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    return data?.role === 'admin';
  } catch {
    // En cas d'erreur DB (ex: colonne role inexistante), fallback sur email uniquement
    return isAdminEmail(email);
  }
}

/**
 * Nom du paramètre de redirection standardisé
 */
export const REDIRECT_PARAM = 'redirectTo';

/**
 * Routes d'authentification
 */
export const AUTH_ROUTES = {
  login: '/connexion',
  register: '/inscription',
  callback: '/auth/callback',
  logout: '/api/auth/logout',
  admin: '/admin',
  home: '/',
} as const;
