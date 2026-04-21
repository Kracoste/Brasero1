import { createClient as createSupabaseJsClient, type SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// Client sans cookies pour les lectures publiques appelées depuis
// generateStaticParams / generateMetadata (pas de request scope à la build).
let publicReadClient: SupabaseClient | null = null;
function getPublicReadClient(): SupabaseClient {
  if (publicReadClient) return publicReadClient;
  publicReadClient = createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) },
    },
  );
  return publicReadClient;
}

async function getReadClient() {
  try {
    return await createClient();
  } catch {
    return getPublicReadClient();
  }
}

export type Ingredient = {
  quantity: string;
  unit: string;
  name: string;
};

export type Instruction = {
  step: number;
  text: string;
};

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  category: string;
  excerpt: string | null;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tips: string | null;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  difficulty: string;
  featured_image: { src: string; alt: string } | null;
  related_product_slug: string | null;
  tags: string[];
  keywords: string[];
  is_published: boolean;
  published_at: string | null;
  author: string;
  created_at: string;
  updated_at: string;
};

export const RECIPE_CATEGORIES = [
  { slug: 'viandes', label: 'Viandes & grillades' },
  { slug: 'poissons', label: 'Poissons & fruits de mer' },
  { slug: 'legumes', label: 'Légumes' },
  { slug: 'desserts', label: 'Desserts' },
  { slug: 'brunch', label: 'Brunch & apéro' },
] as const;

const RECIPE_COLUMNS =
  'id, slug, title, meta_title, meta_description, category, excerpt, description, ingredients, instructions, tips, prep_time_minutes, cook_time_minutes, servings, difficulty, featured_image, related_product_slug, tags, keywords, is_published, published_at, author, created_at, updated_at';

export async function getAllPublishedRecipes(): Promise<Recipe[]> {
  const supabase = await getReadClient();
  const { data } = await supabase
    .from('recipes')
    .select(RECIPE_COLUMNS)
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  return (data || []) as Recipe[];
}

export async function getRecipe(slug: string): Promise<Recipe | null> {
  const supabase = await getReadClient();
  const { data } = await supabase
    .from('recipes')
    .select(RECIPE_COLUMNS)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  return (data as Recipe) || null;
}

export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  const supabase = await getReadClient();
  const { data } = await supabase
    .from('recipes')
    .select(RECIPE_COLUMNS)
    .eq('is_published', true)
    .eq('category', category)
    .order('published_at', { ascending: false });
  return (data || []) as Recipe[];
}
