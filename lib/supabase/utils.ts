// Fonctions utilitaires partagées pour Supabase

/**
 * Extrait le domaine racine pour les cookies
 * Partagé entre middleware et server
 */
export function getCookieDomain(hostname: string): string | undefined {
  // En développement local, ne pas spécifier de domaine
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return undefined;
  }
  // Pour atelier-lbf.fr, utiliser le domaine racine pour partager les cookies
  if (hostname.includes('atelier-lbf.fr')) {
    return '.atelier-lbf.fr';
  }
  // Pour brasero-atelier.fr
  if (hostname.includes('brasero-atelier.fr')) {
    return '.brasero-atelier.fr';
  }
  return undefined;
}

// Statuts de commande valides
export const VALID_ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
] as const;

export type OrderStatus = typeof VALID_ORDER_STATUSES[number];

// Rôles utilisateur valides
export const VALID_USER_ROLES = ['user', 'admin'] as const;
export type UserRole = typeof VALID_USER_ROLES[number];

// Buckets de stockage autorisés
export const ALLOWED_STORAGE_BUCKETS = ['products', 'accessories', 'avatars'] as const;
export type StorageBucket = typeof ALLOWED_STORAGE_BUCKETS[number];

/**
 * Valide et nettoie un nom de fichier pour éviter les path traversal
 */
export function sanitizeFileName(fileName: string): string {
  // Extraire uniquement le nom du fichier (supprimer tout path)
  const baseName = fileName.split('/').pop()?.split('\\').pop() || fileName;
  
  return baseName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/\.\./g, '') // Supprimer les tentatives de path traversal
    .replace(/[^a-zA-Z0-9._-]/g, '_'); // Remplacer les caractères spéciaux par _
}

/**
 * Valide les champs autorisés pour un produit
 */
export const ALLOWED_PRODUCT_FIELDS = [
  'name',
  'slug',
  'description',
  'short_description',
  'shortDescription',
  'price',
  'compare_price',
  'comparePrice',
  'discount_percent',
  'discountPercent',
  'category',
  'badge',
  'images',
  'card_image',
  'cardImage',
  'specs',
  'diameter',
  'height',
  'length',
  'width',
  'weight',
  'material',
  'bowl_thickness',
  'bowlThickness',
  'base_thickness',
  'baseThickness',
  'in_stock',
  'inStock',
  'on_demand',
  'onDemand',
  'is_featured',
  'isFeatured',
  'featured_order',
  'featuredOrder',
  'format'
] as const;

/**
 * Filtre les données produit pour n'autoriser que les champs valides
 */
export function sanitizeProductData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (ALLOWED_PRODUCT_FIELDS.includes(key as any)) {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Logger conditionnel - n'affiche les logs qu'en développement
 */
export function devLog(...args: unknown[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}

export function devError(...args: unknown[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
}
