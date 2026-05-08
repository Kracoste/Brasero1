/**
 * Liste tous les articles de blog publiés pour audit SEO/cannibalisme.
 * Usage : node scripts/list_blog_audit.mjs
 */
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

const { data, error } = await supabase
  .from('blog_posts')
  .select('slug, title, meta_title, meta_description, category, tags, read_time, is_published, content, excerpt, related_articles, related_products, cta_product_slug, created_at, updated_at')
  .order('created_at', { ascending: true });

if (error) { console.error(error); process.exit(1); }

console.log(`\n=== ${data.length} articles trouvés ===\n`);
for (const p of data) {
  const wordCount = (p.content || '').split(/\s+/).length;
  console.log(`──────────────────────────────────────────────`);
  console.log(`SLUG       : ${p.slug}`);
  console.log(`TITLE      : ${p.title}`);
  console.log(`META TITLE : ${p.meta_title || '(none)'}`);
  console.log(`META DESC  : ${p.meta_description || '(none)'}`);
  console.log(`CATEGORY   : ${p.category}`);
  console.log(`TAGS       : ${(p.tags || []).join(', ')}`);
  console.log(`READ TIME  : ${p.read_time} min`);
  console.log(`WORDS      : ~${wordCount}`);
  console.log(`PUBLISHED  : ${p.is_published}`);
  console.log(`RELATED A. : ${(p.related_articles || []).join(', ')}`);
  console.log(`RELATED P. : ${(p.related_products || []).join(', ')}`);
  console.log(`CTA PROD.  : ${p.cta_product_slug || '(none)'}`);
  console.log(`EXCERPT    : ${(p.excerpt || '').slice(0, 200)}`);
  console.log(`CREATED    : ${p.created_at}`);
}
console.log(`\n=== Fin (${data.length} articles) ===\n`);
