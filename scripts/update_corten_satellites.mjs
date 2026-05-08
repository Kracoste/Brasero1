/**
 * Verrouille le maillage du cluster corten :
 * les 2 satellites pointent vers le pivot (et entre eux).
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

// #10 — taches terrasse : pointer vers pivot + bord de mer
const { error: e10 } = await supabase
  .from('blog_posts')
  .update({
    related_articles: [
      'brasero-corten-avantages-inconvenients',
      'brasero-corten-bord-mer-air-salin',
      'preparer-brasero-hiver-hivernage',
    ],
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'brasero-corten-taches-terrasse-solutions');
if (e10) { console.error(e10); process.exit(1); }
console.log('✓ #10 taches terrasse : maillage corten verrouillé');

// #11 — bord de mer : pointer vers pivot (déjà OK) + taches
const { error: e11 } = await supabase
  .from('blog_posts')
  .update({
    related_articles: [
      'brasero-corten-avantages-inconvenients',
      'brasero-corten-taches-terrasse-solutions',
      'pourquoi-brasero-artisanal-francais',
    ],
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'brasero-corten-bord-mer-air-salin');
if (e11) { console.error(e11); process.exit(1); }
console.log('✓ #11 bord de mer : maillage corten verrouillé');

console.log('\n✅ Cluster corten maillé : pivot ↔ taches ↔ bord de mer');
