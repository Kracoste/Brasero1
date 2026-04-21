/**
 * Publie le guide ultime du brasero plancha dans la table blog_posts.
 * Usage : node scripts/publish_blog.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].replace(/^["']|["']$/g, '');
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing env'); process.exit(1); }

const supabase = createClient(url, key, { auth: { persistSession: false } });

const raw = readFileSync(resolve(process.cwd(), 'docs/GUIDE_BRASERO_PLANCHA.md'), 'utf-8');
const lines = raw.split('\n');

// Trouver la fin du bloc blockquote initial (après "---")
let start = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('>')) {
    let j = i;
    while (j < lines.length && (lines[j].startsWith('>') || lines[j].trim() === '')) j++;
    if (lines[j]?.trim() === '---') { start = j + 1; break; }
  }
}
let content = lines.slice(start).join('\n').trim();
// Enlever le H1 (le titre est stocké séparément)
content = content.replace(/^#\s+.+\n+/, '');

const post = {
  slug: 'guide-ultime-brasero-plancha',
  title: 'Guide ultime du brasero plancha 2026 : choisir, utiliser, entretenir (par un artisan français)',
  meta_title: "Guide ultime du brasero plancha 2026 : le tout en un d'un artisan",
  meta_description: "Choisir, utiliser et entretenir son brasero plancha : le guide complet rédigé par un artisan fabricant français. Matériaux, tailles, cuissons, prix, entretien.",
  category: 'guide',
  content,
  excerpt: "Le guide le plus complet du web francophone sur le brasero plancha, rédigé par un artisan fabricant français. Matériaux, épaisseurs, tailles, cuissons, entretien, prix sur 20 ans.",
  author: 'Hugo Allou — Atelier LBF',
  published_at: new Date().toISOString(),
  is_published: true,
  read_time: 18,
  tags: ['brasero', 'plancha', 'guide', 'artisan', 'made in france'],
  related_products: [],
  related_articles: [],
  cta_product_slug: 'brasero-obelix-50',
  cta_text: 'Découvrir nos braseros artisanaux',
};

const { data, error } = await supabase
  .from('blog_posts')
  .upsert(post, { onConflict: 'slug' })
  .select();

if (error) { console.error('Error:', error); process.exit(1); }
console.log('✓ Publié:', data[0].slug);
console.log('URL: https://www.atelier-lbf.fr/blog/' + data[0].slug);
