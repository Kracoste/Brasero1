/**
 * Configuration centralisée de l'authentification
 * Toutes les constantes et fonctions utilitaires d'auth sont ici
 */

// Liste des emails administrateurs - À modifier ici uniquement
export const ADMIN_EMAILS: string[] = [
  'allouhugo@gmail.com',
];

/**
 * Vérifie si un email est celui d'un administrateur
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
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
