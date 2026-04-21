/**
 * Inspecte les recettes : related_product_slug + liens plancha dans champs texte.
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

const { data: recipes, error } = await supabase
  .from('recipes')
  .select('id, slug, title, servings, related_product_slug, description, instructions, tips, excerpt')
  .order('title');

if (error) { console.error(error); process.exit(1); }

console.log(`\n=== ${recipes.length} RECETTES ===`);
for (const r of recipes) {
  console.log(`\n• ${r.title}`);
  console.log(`  slug: ${r.slug}  |  ${r.servings} pers.`);
  console.log(`  related_product_slug: ${r.related_product_slug || '—'}`);

  // Concatène tous les champs texte et cherche "plancha"
  const textFields = {
    description: r.description,
    excerpt: r.excerpt,
    tips: Array.isArray(r.tips) ? r.tips.join('\n') : r.tips,
    instructions: Array.isArray(r.instructions) ? r.instructions.map(i => typeof i === 'string' ? i : JSON.stringify(i)).join('\n') : r.instructions,
  };
  for (const [field, text] of Object.entries(textFields)) {
    if (typeof text !== 'string') continue;
    // Liens markdown avec "plancha" dans URL
    const links = text.match(/\[[^\]]+\]\([^)]*plancha[^)]*\)/gi);
    if (links) {
      console.log(`  [${field}] liens plancha :`);
      for (const l of links) console.log(`    ${l}`);
    }
    // Mentions "plancha" hors liens (juste pour info, extraits)
    const count = (text.match(/plancha/gi) || []).length;
    if (count > 0 && !links) {
      console.log(`  [${field}] ${count}x mention 'plancha' (pas de lien)`);
    }
  }
}
