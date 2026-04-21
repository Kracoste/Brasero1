import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].replace(/^["']|["']$/g, '');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data: posts, error } = await supabase
  .from('blog_posts')
  .select('id, slug, title, cta_product_slug, related_products, content, excerpt')
  .order('title');

if (error) { console.error(error); process.exit(1); }

console.log(`\n=== ${posts.length} ARTICLES ===`);
for (const p of posts) {
  console.log(`\n• ${p.title}`);
  console.log(`  slug: ${p.slug}`);
  console.log(`  cta_product_slug: ${p.cta_product_slug || '—'}`);
  console.log(`  related_products: ${JSON.stringify(p.related_products)}`);

  const content = p.content || '';
  const links = content.match(/\[[^\]]+\]\([^)]*plancha[^)]*\)/gi);
  if (links) {
    console.log(`  Liens 'plancha' dans contenu :`);
    for (const l of links) console.log(`    ${l}`);
  }
  // produits plancha dans related_products
  const planchaRel = (p.related_products || []).filter(s => typeof s === 'string' && s.includes('plancha'));
  if (planchaRel.length) console.log(`  related_products plancha : ${planchaRel.join(', ')}`);
  if (p.cta_product_slug && p.cta_product_slug.includes('plancha')) {
    console.log(`  CTA pointe vers plancha !`);
  }
}
