/**
 * Reproduit la logique du parser pour vérifier sur le contenu réel en DB.
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

const { data } = await supabase
  .from('blog_posts')
  .select('content')
  .eq('slug', 'pourquoi-brasero-artisanal-francais')
  .single();

const lines = data.content.split('\n');
console.log(`Lignes: ${lines.length}`);

// Vérifier la présence des balises spéciales
const checks = [
  { tag: '[compare]', found: 0 },
  { tag: '[/compare]', found: 0 },
  { tag: '[col]', found: 0 },
  { tag: '[/col]', found: 0 },
  { tag: '[atelier]', found: 0 },
  { tag: '[/atelier]', found: 0 },
  { tag: '[chiffre]', found: 0 },
  { tag: '[/chiffre]', found: 0 },
];

lines.forEach((line, i) => {
  for (const c of checks) {
    if (line.trim() === c.tag) { c.found++; }
    if (c.tag === '[chiffre]' && line.includes('[chiffre]') && line.includes('[/chiffre]')) {
      // skip — chiffre is inline so the trim test won't match
    }
  }
});

// Test inline chiffre
const inlineChiffre = lines.filter(l => /\[chiffre\].+\|.+\[\/chiffre\]/.test(l)).length;

console.log('\nBalises trouvées (lignes isolées) :');
for (const c of checks) {
  console.log(`  ${c.tag.padEnd(15)} : ${c.found}`);
}
console.log(`  [chiffre]inline : ${inlineChiffre}`);

// Montrer le contexte autour des [compare]
console.log('\n--- Contexte autour de [compare] ---');
lines.forEach((l, i) => {
  if (l.trim() === '[compare]') {
    console.log(`Ligne ${i}: "${lines[i - 1]}"`);
    console.log(`Ligne ${i}: "${l}"  ← [compare]`);
    for (let j = 1; j <= 12 && i + j < lines.length; j++) {
      console.log(`Ligne ${i + j}: "${lines[i + j]}"`);
    }
  }
});
