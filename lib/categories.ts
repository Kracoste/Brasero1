export const BRASERO_GROUP_CATEGORIES = ['brasero', 'plancha', 'grille'] as const;

export type BraseroGroupCategory = (typeof BRASERO_GROUP_CATEGORIES)[number];

export const isBraseroGroupCategory = (category: string | null | undefined): category is BraseroGroupCategory =>
  !!category && (BRASERO_GROUP_CATEGORIES as readonly string[]).includes(category);
