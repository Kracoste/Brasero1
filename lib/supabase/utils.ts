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
 * Mapping camelCase vers snake_case pour les colonnes de la table products
 */
const CAMEL_TO_SNAKE_MAP: Record<string, string> = {
  shortDescription: 'short_description',
  comparePrice: 'compare_price',
  discountPercent: 'discount_percent',
  cardImage: 'card_image',
  bowlThickness: 'bowl_thickness',
  baseThickness: 'base_thickness',
  inStock: 'in_stock',
  onDemand: 'on_demand',
  isFeatured: 'is_featured',
  featuredOrder: 'featured_order',
};

/**
 * Valide les champs autorisés pour un produit (en snake_case - format PostgreSQL)
 */
export const ALLOWED_PRODUCT_FIELDS = [
  'name',
  'slug',
  'description',
  'short_description',
  'price',
  'compare_price',
  'discount_percent',
  'category',
  'badge',
  'images',
  'card_image',
  'specs',
  'diameter',
  'height',
  'length',
  'width',
  'weight',
  'material',
  'bowl_thickness',
  'base_thickness',
  'in_stock',
  'on_demand',
  'is_featured',
  'featured_order',
  'format'
] as const;

/**
 * Filtre et normalise les données produit pour Supabase
 * - Convertit les noms camelCase en snake_case
 * - N'autorise que les champs valides
 */
export function sanitizeProductData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Convertir camelCase en snake_case si nécessaire
    const normalizedKey = CAMEL_TO_SNAKE_MAP[key] || key;
    
    // N'autoriser que les champs valides
    if (ALLOWED_PRODUCT_FIELDS.includes(normalizedKey as any)) {
      sanitized[normalizedKey] = value;
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
