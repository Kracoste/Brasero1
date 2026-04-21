/**
 * Remplace les liens/slugs "plancha" par des produits brasero correspondants
 * dans recipes + blog_posts.
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

// === MAPPING RECETTES (related_product_slug) ===
const RECIPE_MAP = {
  'ananas-flambe-rhum-plancha': 'brasero-coffy-50',
  'aubergines-grillees-parmigiana-plancha': 'brasero-coffy-50',
  'bar-entier-grille-sel-brasero': 'brasero-obelix-80',
  'cote-de-boeuf-plancha-brasero': 'brasero-en-acier-80-lemorris',
  'gambas-ail-piment-espelette-plancha': 'brasero-coffy-50',
  'saint-jacques-plancha-beurre-herbes': 'brasero-obelix-50',
  'peches-roties-miel-thym-plancha': 'brasero-coffy-50',
  'pommes-terre-rattes-gros-sel-romarin': 'le-fermier',
  'poulet-crapaudine-feu-bois-brasero': 'le-fermier',
  // magret/maïs/brochettes/aubergines ont déjà des slugs brasero valides → on laisse
};

// === MAPPING PRODUITS (plancha/inexistants → brasero) ===
const PRODUCT_MAP = {
  'plancha-inox-10mm': 'brasero-coffy-80',
  'plancha-acier-inoxydable-100': 'brasero-acier-100-l-obelix',
  'plancha-acier-inoxydable-80': 'brasero-coffy-80',
  'plancha-acier-inoxydable-60': 'brasero-coffy-50',
  'brasero-LeMorris-80': 'brasero-en-acier-80-lemorris',
  'brasero-en-acier-corten-80-lefermier': 'le-fermier',
  'brasero-fermier-80': 'le-fermier',
  'brasero-lemoris-80': 'brasero-en-acier-80-lemorris',
};

// === 1. Fix recettes : related_product_slug ===
console.log('\n=== RECETTES ===');
const { data: recipes } = await supabase.from('recipes').select('id, slug, title, related_product_slug');
for (const r of recipes) {
  const manual = RECIPE_MAP[r.slug];
  const mapped = PRODUCT_MAP[r.related_product_slug];
  const next = manual || mapped;
  if (next && next !== r.related_product_slug) {
    const { error } = await supabase.from('recipes').update({ related_product_slug: next }).eq('id', r.id);
    console.log(`  ${error ? '✗' : '✓'} ${r.title}: ${r.related_product_slug} → ${next}`);
    if (error) console.log('    ', error.message);
  }
}

// === 2. Fix blog_posts : cta_product_slug + related_products + content ===
console.log('\n=== BLOG ===');
const { data: posts } = await supabase.from('blog_posts').select('id, slug, title, cta_product_slug, related_products, content');
for (const p of posts) {
  const updates = {};

  // cta_product_slug
  if (p.cta_product_slug && PRODUCT_MAP[p.cta_product_slug]) {
    updates.cta_product_slug = PRODUCT_MAP[p.cta_product_slug];
  }

  // related_products : remplace et dédoublonne
  if (Array.isArray(p.related_products) && p.related_products.length) {
    const newRel = [...new Set(p.related_products.map(s => PRODUCT_MAP[s] || s))];
    if (JSON.stringify(newRel) !== JSON.stringify(p.related_products)) {
      updates.related_products = newRel;
    }
  }

  // content : remplace les liens markdown /produits/plancha-* → brasero correspondant
  if (p.content) {
    let newContent = p.content;
    for (const [from, to] of Object.entries(PRODUCT_MAP)) {
      const regex = new RegExp(`/produits/${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[)"'\\s])`, 'g');
      newContent = newContent.replace(regex, `/produits/${to}`);
    }
    if (newContent !== p.content) updates.content = newContent;
  }

  if (Object.keys(updates).length) {
    const { error } = await supabase.from('blog_posts').update(updates).eq('id', p.id);
    console.log(`  ${error ? '✗' : '✓'} ${p.title}: ${Object.keys(updates).join(', ')}`);
    if (error) console.log('    ', error.message);
  }
}

console.log('\n✓ Terminé');
