import { createClient } from '@/lib/supabase/server';

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  category: string;
  content: string;
  excerpt: string | null;
  author: string;
  published_at: string | null;
  is_published: boolean;
  featured_image: { src: string; alt: string } | null;
  read_time: number;
  tags: string[];
  related_products: string[];
  related_articles: string[];
  cta_product_slug: string | null;
  cta_text: string | null;
  created_at: string;
  updated_at: string;
};

const BLOG_COLUMNS = 'id, slug, title, meta_title, meta_description, category, content, excerpt, author, published_at, is_published, featured_image, read_time, tags, related_products, related_articles, cta_product_slug, cta_text, created_at, updated_at';

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  return data as BlogPost | null;
}

export async function getAllBlogPosts(category?: string): Promise<BlogPost[]> {
  const supabase = await createClient();
  let query = supabase
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (category && category !== 'tous') {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return (data as BlogPost[]) || [];
}

export async function getRelatedBlogPosts(currentSlug: string, category: string, limit: number = 3): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .eq('is_published', true)
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit);

  return (data as BlogPost[]) || [];
}

export async function getBlogPostsBySlug(slugs: string[]): Promise<BlogPost[]> {
  if (!slugs.length) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .in('slug', slugs)
    .eq('is_published', true);

  return (data as BlogPost[]) || [];
}

// Admin functions (no is_published filter)
export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .order('created_at', { ascending: false });

  return (data as BlogPost[]) || [];
}

export async function getBlogPostAdmin(id: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .eq('id', id)
    .single();

  return data as BlogPost | null;
}
