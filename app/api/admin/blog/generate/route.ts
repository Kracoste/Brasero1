import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdminAccess } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { getAllProducts } from '@/lib/data/products';
import { generateArticle } from '@/lib/ai/content-agent';
import { devError } from '@/lib/supabase/utils';

export const maxDuration = 120;

async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }
  const isAdmin = await verifyAdminAccess(user.id, user.email, adminClient);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  return null;
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  const { keyword, angle } = body as { keyword?: unknown; angle?: unknown };
  if (typeof keyword !== 'string' || !keyword.trim() || keyword.length > 200) {
    return NextResponse.json({ error: 'Mot-clé requis (1-200 caractères)' }, { status: 400 });
  }
  const angleStr = typeof angle === 'string' && angle.trim() ? angle.trim().slice(0, 500) : undefined;

  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
  }

  try {
    const [products, existingResp] = await Promise.all([
      getAllProducts(),
      adminClient.from('blog_posts').select('slug, title').limit(100),
    ]);

    const productContext = products.slice(0, 20).map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      shortDescription: p.specs?.shortName || undefined,
    }));

    const existingPosts = (existingResp.data || []).map((p) => ({
      slug: p.slug as string,
      title: p.title as string,
    }));

    const article = await generateArticle({
      keyword: keyword.trim(),
      angle: angleStr,
      products: productContext,
      existingPosts,
    });

    return NextResponse.json(article);
  } catch (err) {
    devError('Erreur génération article:', err);
    const message = err instanceof Error ? err.message : 'Erreur génération';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
