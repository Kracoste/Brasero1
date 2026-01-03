/**
 * Fonctions de validation et sanitization partagées
 * Utilisées par les routes API pour sécuriser les entrées
 */

// ============================================
// Regex de validation
// ============================================

/** Regex pour valider un UUID v4 */
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Regex pour valider un session ID Stripe */
export const STRIPE_SESSION_ID_REGEX = /^cs_(test|live)_[a-zA-Z0-9]+$/;

/** Regex pour valider un email basique */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Regex pour valider un slug (lettres, chiffres, tirets) */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ============================================
// Fonctions de validation
// ============================================

/**
 * Vérifie si une chaîne est un UUID valide
 */
export function isValidUUID(str: string | undefined | null): boolean {
  if (!str) return false;
  return UUID_REGEX.test(str);
}

/**
 * Vérifie si une chaîne est un session ID Stripe valide
 */
export function isValidStripeSessionId(str: string | undefined | null): boolean {
  if (!str) return false;
  return STRIPE_SESSION_ID_REGEX.test(str);
}

/**
 * Vérifie si une valeur est un prix valide
 * @param price - La valeur à vérifier
 * @param maxPrice - Prix maximum autorisé (défaut: 1 000 000)
 */
export function isValidPrice(price: unknown, maxPrice = 1000000): boolean {
  if (price === undefined || price === null) return true;
  const num = Number(price);
  return !isNaN(num) && isFinite(num) && num >= 0 && num <= maxPrice;
}

/**
 * Vérifie si une valeur est une quantité valide
 * @param qty - La valeur à vérifier
 * @param maxQty - Quantité maximum autorisée (défaut: 1000)
 */
export function isValidQuantity(qty: unknown, maxQty = 1000): boolean {
  if (qty === undefined || qty === null) return true;
  const num = Number(qty);
  return Number.isInteger(num) && num >= 1 && num <= maxQty;
}

/**
 * Vérifie si une chaîne est un email valide (validation basique)
 */
export function isValidEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

/**
 * Vérifie si une chaîne est un slug valide
 */
export function isValidSlug(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return SLUG_REGEX.test(slug) && slug.length <= 200;
}

// ============================================
// Fonctions de sanitization
// ============================================

/**
 * Nettoie une chaîne de caractères potentiellement dangereux
 * @param value - La valeur à nettoyer
 * @param maxLength - Longueur maximale (défaut: 512)
 */
export function sanitizeString(
  value: string | undefined | null,
  maxLength = 512
): string | undefined {
  if (!value) return undefined;
  return value
    .replace(/[<>\"'`;\\]/g, '') // Supprimer caractères dangereux
    .replace(/javascript:/gi, '') // Empêcher injection JS
    .replace(/data:/gi, '') // Empêcher injection data URI
    .replace(/on\w+=/gi, '') // Empêcher event handlers
    .slice(0, maxLength)
    .trim();
}

/**
 * Nettoie un chemin de page (path)
 * @param path - Le chemin à nettoyer
 * @param maxLength - Longueur maximale (défaut: 500)
 */
export function sanitizePagePath(
  path: string | undefined | null,
  maxLength = 500
): string {
  if (!path) return '/';
  const cleaned = path
    .replace(/[<>\"'`;\\]/g, '') // Supprimer caractères dangereux
    .replace(/\.{2,}/g, '.') // Empêcher path traversal
    .slice(0, maxLength);
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

/**
 * Nettoie un email
 */
export function sanitizeEmail(email: string | undefined | null): string | undefined {
  if (!email) return undefined;
  const cleaned = email.toLowerCase().trim().slice(0, 254);
  return isValidEmail(cleaned) ? cleaned : undefined;
}

/**
 * Nettoie un numéro de téléphone (garde uniquement chiffres et +)
 */
export function sanitizePhone(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  return phone
    .replace(/[^\d+\s-]/g, '')
    .slice(0, 20)
    .trim();
}

// ============================================
// Types d'événements valides
// ============================================

export const VALID_CONVERSION_EVENT_TYPES = [
  'product_view',
  'add_to_cart',
  'remove_from_cart',
  'checkout_start',
  'purchase',
] as const;

export type ConversionEventType = typeof VALID_CONVERSION_EVENT_TYPES[number];

export function isValidConversionEventType(type: string | undefined): type is ConversionEventType {
  return !!type && VALID_CONVERSION_EVENT_TYPES.includes(type as ConversionEventType);
}
