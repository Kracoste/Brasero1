import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminAccess } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { devError } from '@/lib/supabase/utils';

const ALLOWED_RECIPE_FIELDS = [
  'slug', 'title', 'meta_title', 'meta_description',
  'category', 'excerpt', 'description',
  'ingredients', 'instructions', 'tips',
  'prep_time_minutes', 'cook_time_minutes', 'servings', 'difficulty',
  'featured_image', 'related_product_slug',
  'tags', 'keywords', 'author',
  'is_published', 'published_at',
] as const;

const MAX_FIELD_LENGTHS: Record<string, number> = {
  slug: 200,
  title: 300,
  meta_title: 200,
  meta_description: 500,
  category: 50,
  excerpt: 1000,
  description: 20000,
  tips: 10000,
  difficulty: 20,
  author: 200,
  related_product_slug: 200,
};

const VALID_CATEGORIES = ['viandes', 'poissons', 'legumes', 'desserts', 'brunch'];
const VALID_DIFFICULTIES = ['facile', 'moyen', 'expert'];

function sanitizeRecipeData(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const input = data as Record<string, unknown>;
  const sanitized: Record<string, unknown> = {};

  for (const field of ALLOWED_RECIPE_FIELDS) {
    const value = input[field];
    if (value === undefined) continue;

    if (typeof value === 'string') {
      const maxLen = MAX_FIELD_LENGTHS[field] || 500;
      const trimmed = value.trim().slice(0, maxLen);
      if (field === 'category' && !VALID_CATEGORIES.includes(trimmed)) continue;
      if (field === 'difficulty' && !VALID_DIFFICULTIES.includes(trimmed)) continue;
      sanitized[field] = trimmed;
    } else if (field === 'prep_time_minutes' || field === 'cook_time_minutes' || field === 'servings') {
      const num = Number(value);
      if (Number.isFinite(num) && num >= 0 && num <= 600) {
        sanitized[field] = Math.round(num);
      }
    } else if (field === 'is_published') {
      sanitized[field] = Boolean(value);
    } else if ((field === 'tags' || field === 'keywords') && Array.isArray(value)) {
      sanitized[field] = value
        .filter((v): v is string => typeof v === 'string')
        .map((v) => v.trim().slice(0, 100))
        .slice(0, 30);
    } else if ((field === 'ingredients' || field === 'instructions') && Array.isArray(value)) {
      sanitized[field] = value.slice(0, 100).filter((v) => v && typeof v === 'object');
    } else if (field === 'published_at' && typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) sanitized[field] = date.toISOString();
    } else if (field === 'featured_image' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const img = value as Record<string, unknown>;
      if (typeof img.src === 'string' && typeof img.alt === 'string') {
        sanitized[field] = { src: img.src.trim().slice(0, 500), alt: img.alt.trim().slice(0, 300) };
      }
    } else if (value === null) {
      sanitized[field] = null;
    }
  }

  return sanitized;
}

async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const adminClient = getSupabaseAdminClient();
  if (!adminClient) return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  const isAdmin = await verifyAdminAccess(user.id, user.email, adminClient);
  if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  return null;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });

  const { data, error } = await adminClient
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    devError('Erreur liste recettes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON invalide' }, { status: 400 }); }

  const sanitized = sanitizeRecipeData(body);
  if (!sanitized || !sanitized.slug || !sanitized.title || !sanitized.description || !sanitized.category) {
    return NextResponse.json({ error: 'slug, title, description et category sont requis' }, { status: 400 });
  }

  const { data, error } = await adminClient.from('recipes').insert(sanitized).select().single();
  if (error) {
    devError('Erreur création recette:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON invalide' }, { status: 400 }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 });
  }

  const { id, ...rest } = body as Record<string, unknown>;
  if (!id || typeof id !== 'string') return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const sanitized = sanitizeRecipeData(rest);
  if (!sanitized || Object.keys(sanitized).length === 0) {
    return NextResponse.json({ error: 'Aucune mise à jour valide' }, { status: 400 });
  }

  const { data, error } = await adminClient.from('recipes').update(sanitized).eq('id', id).select().single();
  if (error) {
    devError('Erreur mise à jour recette:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON invalide' }, { status: 400 }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 });
  }

  const { id } = body as Record<string, unknown>;
  if (!id || typeof id !== 'string') return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const { error } = await adminClient.from('recipes').delete().eq('id', id);
  if (error) {
    devError('Erreur suppression recette:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
