/**
 * Utilitaire de Rate Limiting en mémoire partagé
 * À utiliser dans les routes API pour éviter les abus
 */

type RateLimitRecord = { count: number; resetAt: number };

// Map partagée pour le rate limiting
const rateLimitMap = new Map<string, RateLimitRecord>();

// Configuration par défaut
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 60;

/**
 * Vérifie si une requête est autorisée selon le rate limiting
 * @param identifier - Identifiant unique (généralement IP client)
 * @param maxRequests - Nombre max de requêtes par fenêtre (défaut: 60)
 * @param windowMs - Durée de la fenêtre en ms (défaut: 60000)
 * @returns true si autorisé, false si limite atteinte
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
  windowMs: number = DEFAULT_WINDOW_MS
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

/**
 * Nettoie les entrées expirées de la map
 * À appeler périodiquement si nécessaire
 */
export function cleanupRateLimitMap(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Extrait l'IP client depuis les headers
 * Gère les proxies (Vercel, Cloudflare, etc.)
 */
export function getClientIP(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  const realIP = headers.get('x-real-ip');
  const cfConnectingIP = headers.get('cf-connecting-ip');
  
  // Priorité : CF > Real IP > Forwarded For > unknown
  return cfConnectingIP || 
         realIP || 
         forwardedFor?.split(',')[0]?.trim() || 
         'unknown';
}

/**
 * Configuration de rate limit pré-définie pour différents cas d'usage
 */
export const RATE_LIMIT_PRESETS = {
  // Pour les endpoints analytics (plus permissif)
  analytics: { maxRequests: 100, windowMs: 60 * 1000 },
  // Pour les endpoints API standard
  api: { maxRequests: 60, windowMs: 60 * 1000 },
  // Pour les endpoints sensibles (auth, checkout)
  sensitive: { maxRequests: 20, windowMs: 60 * 1000 },
  // Pour les webhooks (doit être plus permissif)
  webhook: { maxRequests: 200, windowMs: 60 * 1000 },
} as const;
