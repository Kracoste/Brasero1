/**
 * Lot 2 : insertion des nouveaux blocs [duo] avec les photos ajoutées.
 * - 2 blocs sur le pivot corten (prompt 2 + prompt 3)
 * - 1 remplacement de hero sur meilleur-bois (prompt 1 v2 de meilleure qualité)
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

async function getContent(slug) {
  const { data, error } = await supabase
    .from('blog_posts').select('content').eq('slug', slug).single();
  if (error) throw error;
  return data.content;
}
async function setContent(slug, content) {
  const { error } = await supabase
    .from('blog_posts')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('slug', slug);
  if (error) throw error;
}
function replaceOnce(content, search, replace, label) {
  const idx = content.indexOf(search);
  if (idx === -1) throw new Error(`Marqueur introuvable [${label}]`);
  return content.slice(0, idx) + replace + content.slice(idx + search.length);
}

// ─── 1. brasero-corten-avantages-inconvenients (pivot) ────────────
{
  const slug = 'brasero-corten-avantages-inconvenients';
  let content = await getContent(slug);

  // Insertion #1 : section "Une esthétique vivante" — image jardin paysager
  const oldEsth = `### Une esthétique vivante qui mûrit avec le temps

La patine corten **évolue**. Et c'est probablement ce qui plaît le plus aux propriétaires. Les premières semaines, les tons sont orangés vifs, parfois irréguliers — le brasero "respire". Progressivement, la couleur s'assombrit vers un **brun chaud profond**, plus mat, plus homogène. Après six à douze mois, votre brasero a sa teinte définitive — un brun terre qui s'accorde naturellement au bois, à la pierre, au béton brut, à la végétation.`;

  const newEsth = `[duo image="/blog/brasero-corten-avantages-inconvenients_prompt_2.webp" pos="right" alt="Brasero corten patiné dans un jardin paysager contemporain à la golden hour"]
**Une esthétique qui mûrit**

La patine corten **évolue**. Les premières semaines, les tons sont orangés vifs, parfois irréguliers — le brasero "respire". Progressivement, la couleur s'assombrit vers un **brun chaud profond**, plus mat, plus homogène. Après six à douze mois, votre brasero a sa teinte définitive — un brun terre qui s'accorde naturellement au bois, à la pierre, au béton brut, à la végétation.
[/duo]`;

  content = replaceOnce(content, oldEsth, newEsth, 'corten/esthetique');

  // Insertion #2 : section "bord de mer" — image Bretagne
  const oldMer = `L'air salin accélère la formation de la patine et modifie légèrement son comportement. Le corten **tient** très bien en bord de mer — c'est même un de ses terrains de prédilection — mais il y a des précautions à connaître selon que vous êtes en Bretagne, en Vendée, sur la Côte d'Azur ou en Corse.`;

  const newMer = `[duo image="/blog/brasero-corten-avantages-inconvenients_prompt_3.webp" pos="left" alt="Brasero corten sur terrasse face à la mer en Bretagne, embruns et lumière argentée"]
**Le corten en bord de mer**

L'air salin accélère la formation de la patine et modifie légèrement son comportement. Le corten **tient** très bien en bord de mer — c'est même un de ses terrains de prédilection — mais il y a des précautions à connaître selon que vous êtes en Bretagne, en Vendée, sur la Côte d'Azur ou en Corse.
[/duo]`;

  content = replaceOnce(content, oldMer, newMer, 'corten/mer');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 2 blocs [duo] insérés (esthétique + bord de mer)`);
}

// ─── 2. meilleur-bois-brasero-comparatif : remplacer le hero par la v2 ────
{
  const slug = 'meilleur-bois-brasero-comparatif';
  let content = await getContent(slug);

  const oldHero = `image="/blog/meilleur-bois-brasero-comparatif_prompt1 (1).webp"`;
  const newHero = `image="/blog/meilleur-bois-brasero-comparatif_prompt1 (2).webp"`;

  content = replaceOnce(content, oldHero, newHero, 'bois/hero-replace');

  await setContent(slug, content);
  console.log(`✓ ${slug} : hero remplacé par la version 2 (meilleure qualité)`);
}

console.log('\n✅ Lot 2 terminé.');
