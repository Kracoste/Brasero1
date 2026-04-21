import { createClient as createSupabaseJsClient, type SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { mapSupabaseProduct } from '@/lib/utils';
import type { Product } from '@/lib/schema';

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

export const PRODUCT_COLUMNS = 'slug, name, price, compare_price, discount_percent, promo_code, short_description, description, category, badge, images, material, diameter, thickness, height, weight, bowl_thickness, base_thickness, warranty, availability, shipping, popularScore, on_demand, specs, highlights, features, faq, customSpecs, location, variants, config_images, configurations, seo_content, customization';

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await getReadClient();
  const { data: p } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('slug', slug)
    .single();

  if (!p) return null;
  return mapSupabaseProduct(p);
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await getReadClient();
  const { data: products } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS);

  if (!products) return [];
  return products.map(mapSupabaseProduct).filter(Boolean) as Product[];
}

export async function getRelatedProducts(currentSlug: string, category: string, limit: number = 8): Promise<Product[]> {
  const supabase = await getReadClient();
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
  const supabase = await getReadClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, price, images, category')
    .in('slug', slugs)
    .order('name');

  if (error || !data) return [];
  return data;
}
