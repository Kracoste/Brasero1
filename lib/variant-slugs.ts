import type { Product } from '@/lib/schema';

/**
 * Normalise un nom en slug : supprime accents, caractères spéciaux, etc.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Génère un slug de variante à partir des paramètres produit.
 * Utilise shortName si disponible pour des URLs plus propres.
 * Format: l-obelix-corten-80-inox (au lieu de brasero-acier-100-l-obelix-corten-80-inox)
 */
export function generateVariantSlug(
  productNameOrShortName: string,
  finish: string,
  diameter: number | string,
  plancha: string,
): string {
  const base = slugify(productNameOrShortName);
  return `${base}-${finish}-${diameter}-${plancha}`;
}

/**
 * Parse un slug de variante pour extraire les composants.
 * Parse depuis la fin : plancha (acier/inox), diameter (nombre), finish (corten/peint).
 * Tout le reste est le nom du produit.
 */
export function parseVariantSlug(variantSlug: string): {
  productName: string;
  finish: string;
  diameter: number;
  plancha: string;
} | null {
  const parts = variantSlug.split('-');
  if (parts.length < 4) return null;

  const plancha = parts[parts.length - 1]; // acier | inox
  const diameterStr = parts[parts.length - 2]; // 50 | 80 | 100
  const finish = parts[parts.length - 3]; // corten | peint

  if (!['acier', 'inox'].includes(plancha)) return null;
  if (!['corten', 'peint'].includes(finish)) return null;
  const diameter = parseInt(diameterStr);
  if (isNaN(diameter)) return null;

  const productName = parts.slice(0, parts.length - 3).join('-');
  if (!productName) return null;

  return { productName, finish, diameter, plancha };
}

/**
 * Génère tous les slugs de variantes pour un produit donné.
 */
export function getAllVariantSlugs(product: Product): {
  variantSlug: string;
  configKey: string;
  diameter: string;
  finish: string;
  plancha: string;
}[] {
  if (!product.configurations) return [];

  const results: {
    variantSlug: string;
    configKey: string;
    diameter: string;
    finish: string;
    plancha: string;
  }[] = [];

  for (const [configKey, config] of Object.entries(product.configurations)) {
    const parts = configKey.split('-');
    const finish = parts[0]; // corten | peint
    const plancha = parts[1]; // acier | inox

    if (!finish || !plancha || !config.diameters) continue;

    for (const diameter of Object.keys(config.diameters)) {
      const nameForSlug = product.specs?.shortName || product.name;
      const variantSlug = generateVariantSlug(nameForSlug, finish, diameter, plancha);
      results.push({ variantSlug, configKey, diameter, finish, plancha });
    }
  }

  return results;
}

/**
 * Trouve le produit correspondant à un slug de variante parmi une liste de produits.
 * Compare le shortName (prioritaire) puis le name normalisé avec la partie productName du slug.
 */
export function findProductByVariantSlug(
  products: Product[],
  parsed: { productName: string },
): Product | undefined {
  return products.find((p) => {
    // D'abord comparer avec shortName si disponible
    if (p.specs?.shortName) {
      const normalizedShort = slugify(p.specs.shortName);
      if (normalizedShort === parsed.productName) return true;
    }
    // Fallback sur le nom complet
    const normalizedFull = slugify(p.name);
    return normalizedFull === parsed.productName;
  });
}
