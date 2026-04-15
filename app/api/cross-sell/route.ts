import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slugs: string[] = Array.isArray(body?.slugs) ? body.slugs.slice(0, 20) : [];
  if (slugs.length === 0) return NextResponse.json({ products: [] });

  const supabase = await createClient();

  const { data: cartProducts } = await supabase
    .from('products')
    .select('slug, category, specs')
    .in('slug', slugs);

  if (!cartProducts || cartProducts.length === 0) {
    return NextResponse.json({ products: [] });
  }

  const hasAccessory = cartProducts.some((p) => p.category === 'accessoire' || p.category === 'fendeur');
  const compatibleSlugs = new Set<string>();

  for (const p of cartProducts) {
    const accs = (p.specs as { compatibleAccessories?: string[] } | null)?.compatibleAccessories;
    if (Array.isArray(accs)) accs.forEach((s) => compatibleSlugs.add(s));
  }

  slugs.forEach((s) => compatibleSlugs.delete(s));

  let query = supabase
    .from('products')
    .select('slug, name, price, images, category')
    .neq('on_demand', true)
    .limit(8);

  if (compatibleSlugs.size > 0) {
    query = query.in('slug', Array.from(compatibleSlugs));
  } else if (!hasAccessory) {
    query = query.in('category', ['accessoire', 'fendeur']);
  } else {
    return NextResponse.json({ products: [] });
  }

  const { data } = await query;

  const products = (data || []).map((p) => {
    const images = Array.isArray(p.images) ? p.images : [];
    return {
      slug: p.slug,
      name: p.name,
      price: Number(p.price),
      image: images[0]?.src || images[0]?.url || null,
    };
  });

  return NextResponse.json({ products });
}
