import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { devError } from '@/lib/supabase/utils';

// Champs autorisés pour un blog post
const ALLOWED_BLOG_FIELDS = [
  'slug', 'title', 'meta_title', 'meta_description',
  'category', 'excerpt', 'content', 'read_time',
  'tags', 'related_products', 'related_articles',
  'cta_product_slug', 'cta_text',
  'featured_image', 'author',
  'is_published', 'published_at',
] as const;

const MAX_FIELD_LENGTHS: Record<string, number> = {
  slug: 200,
  title: 300,
  meta_title: 200,
  meta_description: 500,
  category: 50,
  excerpt: 1000,
  content: 100000,
  cta_product_slug: 200,
  cta_text: 300,
  featured_image: 500,
  author: 200,
};

function sanitizeBlogData(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

  const input = data as Record<string, unknown>;
  const sanitized: Record<string, unknown> = {};

  for (const field of ALLOWED_BLOG_FIELDS) {
    const value = input[field];
    if (value === undefined) continue;

    // Strings : trim + longueur max
    if (typeof value === 'string') {
      const maxLen = MAX_FIELD_LENGTHS[field] || 500;
      sanitized[field] = value.trim().slice(0, maxLen);
    }
    // Nombres
    else if (field === 'read_time') {
      const num = Number(value);
      if (Number.isFinite(num) && num >= 0 && num <= 120) {
        sanitized[field] = num;
      }
    }
    // Booléens
    else if (field === 'is_published') {
      sanitized[field] = Boolean(value);
    }
    // Tableaux de strings (tags, related_products, related_articles)
    else if (Array.isArray(value) && ['tags', 'related_products', 'related_articles'].includes(field)) {
      sanitized[field] = value
        .filter((v): v is string => typeof v === 'string')
        .map(v => v.trim().slice(0, 200))
        .slice(0, 50);
    }
    // Date ISO
    else if (field === 'published_at' && typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        sanitized[field] = date.toISOString();
      }
    }
    // featured_image : objet { src, alt }
    else if (field === 'featured_image' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const img = value as Record<string, unknown>;
      if (typeof img.src === 'string' && typeof img.alt === 'string') {
        sanitized[field] = { src: img.src.trim().slice(0, 500), alt: img.alt.trim().slice(0, 300) };
      }
    }
    // null explicite
    else if (value === null) {
      sanitized[field] = null;
    }
  }

  return sanitized;
}

async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  return null;
}

// GET /api/admin/blog — list all blog posts (admin)
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }

  const { data, error } = await adminClient
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    devError('Erreur liste blog:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/admin/blog — create a blog post
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 });
  }

  const sanitized = sanitizeBlogData(body);
  if (!sanitized || !sanitized.slug || !sanitized.title || !sanitized.content) {
    return NextResponse.json({ error: 'slug, title et content sont requis' }, { status: 400 });
  }

  const { data, error } = await adminClient
    .from('blog_posts')
    .insert(sanitized)
    .select()
    .single();

  if (error) {
    devError('Erreur création blog:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/admin/blog — update a blog post (requires id in body)
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  const { id, ...rest } = body as Record<string, unknown>;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'id est requis' }, { status: 400 });
  }

  const sanitized = sanitizeBlogData(rest);
  if (!sanitized || Object.keys(sanitized).length === 0) {
    return NextResponse.json({ error: 'Aucune mise à jour valide' }, { status: 400 });
  }

  const { data, error } = await adminClient
    .from('blog_posts')
    .update(sanitized)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    devError('Erreur mise à jour blog:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE /api/admin/blog — delete a blog post (requires id in body)
export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  const { id } = body as Record<string, unknown>;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'id est requis' }, { status: 400 });
  }

  const { error } = await adminClient
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    devError('Erreur suppression blog:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
