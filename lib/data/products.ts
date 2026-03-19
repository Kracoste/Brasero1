import { createClient } from '@/lib/supabase/server';
import { mapSupabaseProduct } from '@/lib/utils';
import type { Product } from '@/lib/schema';

export const PRODUCT_COLUMNS = 'slug, name, price, compare_price, discount_percent, short_description, description, category, badge, images, material, diameter, thickness, height, weight, bowl_thickness, base_thickness, warranty, availability, shipping, popularScore, on_demand, specs, highlights, features, faq, customSpecs, location, variants, config_images, configurations, seo_content, customization';

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data: p } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('slug', slug)
    .single();

  if (!p) return null;
  return mapSupabaseProduct(p);
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS);

  if (!products) return [];
  return products.map(mapSupabaseProduct).filter(Boolean) as Product[];
}

export async function getRelatedProducts(currentSlug: string, category: string, limit: number = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('category', category)
    .neq('slug', currentSlug)
    .limit(limit);

  if (!products) return [];
  return products.map(mapSupabaseProduct).filter(Boolean) as Product[];
}

export async function getCompatibleAccessories(slugs: string[]) {
  if (!slugs || slugs.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, price, images, category')
    .in('slug', slugs)
    .order('name');

  if (error || !data) return [];
  return data;
}
