/**
 * Lit un article blog par slug.
 * Usage : node scripts/read_blog_post.mjs <slug>
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].replace(/^["']|["']$/g, '');
}

const slug = process.argv[2];
if (!slug) { console.error('Usage: node scripts/read_blog_post.mjs <slug>'); process.exit(1); }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data, error } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('slug', slug)
  .single();

if (error) { console.error(error); process.exit(1); }

console.log(`\n=== ${data.slug} ===`);
console.log(`TITLE: ${data.title}`);
console.log(`META_TITLE: ${data.meta_title}`);
console.log(`META_DESC: ${data.meta_description}`);
console.log(`EXCERPT: ${data.excerpt}`);
console.log(`\n--- CONTENT ---\n`);
console.log(data.content);
