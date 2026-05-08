/**
 * Lot 4 — Insertion des photos restantes :
 * - temperature-cuisson-brasero-plancha : 3 blocs (foyer top-down, test eau, déplacement)
 * - brasero-corten-taches-terrasse-solutions : 1 bloc (géotextile préventif)
 * - preparer-brasero-hiver-hivernage : 1 bloc (brasero bâché hiver)
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

// ─── 1. temperature-cuisson-brasero-plancha (3 blocs) ──────────────
{
  const slug = 'temperature-cuisson-brasero-plancha';
  let content = await getContent(slug);

  // Insertion #1 : prompt 1 (foyer en pleine action) — avant 1er H2
  const oldHero = `\n## La chaleur au feu de bois : un autre rapport au temps`;
  const newHero = `\n[duo image="/blog/temperature-cuisson-brasero-plancha_prompt_1.webp" pos="right" alt="Vue plongeante d'un brasero plancha en pleine cuisson : trois zones thermiques distinctes avec viandes saisies, gambas et légumes"]
**Trois zones, un seul foyer**

Sur un brasero plancha, la chaleur ne se règle pas — elle se distribue. Le centre saisit, la zone intermédiaire cuit, le bord garde au chaud. Toute la maîtrise tient à savoir où poser, quand déplacer, et combien de bois engager.
[/duo]\n## La chaleur au feu de bois : un autre rapport au temps`;
  content = replaceOnce(content, oldHero, newHero, 'temperature/hero');

  // Insertion #2 : prompt 2 (test de l'eau) — section test Leidenfrost
  const oldTest = `C'est le test **objectif** qui valide qu'une plancha est à bonne température pour cuisiner. Quelques gouttes d'eau froide jetées sur la plancha doivent **danser et glisser** sans s'évaporer, formant des perles sphériques qui rebondissent et se déplacent.`;
  const newTest = `[duo image="/blog/temperature-cuisson-brasero-plancha_prompt_2.webp" pos="left" alt="Trois gouttes d'eau qui dansent par effet Leidenfrost sur une plancha de brasero culottée à bonne température"]
**Le test qui ne ment pas**

Une goutte d'eau jetée sur une plancha à bonne température ne s'évapore pas — elle flotte et danse. Cet effet physique, observable à l'œil nu, est le test le plus fiable pour valider que vous pouvez commencer à cuisiner.
[/duo]

C'est le test **objectif** qui valide qu'une plancha est à bonne température pour cuisiner. Quelques gouttes d'eau froide jetées sur la plancha doivent **danser et glisser** sans s'évaporer, formant des perles sphériques qui rebondissent et se déplacent.`;
  content = replaceOnce(content, oldTest, newTest, 'temperature/test');

  // Insertion #3 : prompt 3 (technique déplacement) — section déplacement
  const oldDepl = `C'est probablement la technique la plus importante à acquérir, et celle qui distingue le cuisinier débutant du cuisinier averti.`;
  const newDepl = `[duo image="/blog/temperature-cuisson-brasero-plancha_prompt_3.webp" pos="right" alt="Mains qui déplacent une entrecôte saisie de la zone chaude vers la zone intermédiaire d'une plancha de brasero"]
**L'art du déplacement**

Saisir au centre, finir en zone intermédiaire, reposer sur le bord. Cette chorégraphie de la pince à barbecue, c'est ce qui distingue un repas correct d'un repas réussi — et c'est ce qu'aucune plancha à température fixe ne peut imiter.
[/duo]

C'est probablement la technique la plus importante à acquérir, et celle qui distingue le cuisinier débutant du cuisinier averti.`;
  content = replaceOnce(content, oldDepl, newDepl, 'temperature/deplacement');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
}

// ─── 2. brasero-corten-taches-terrasse-solutions (prompt 2) ─────────
{
  const slug = 'brasero-corten-taches-terrasse-solutions';
  let content = await getContent(slug);

  // Insertion : prompt 2 (géotextile préventif) — section "Comment protéger AVANT"
  const oldProtect = `C'est de loin la stratégie la plus efficace : **prévenir au lieu de nettoyer**. Voici les solutions concrètes par type de surface.`;
  const newProtect = `[duo image="/blog/brasero-corten-taches-terrasse-solutions_prompt_2.webp" pos="right" alt="Brasero corten neuf installé sur terrasse en bois clair avec un géotextile noir posé sous le brasero pour protection préventive"]
**Prévenir plutôt que nettoyer**

Un carré de géotextile noir, posé sous le brasero pendant les 6 à 8 premières semaines, suffit à éviter 100 % des taches sur une terrasse claire. C'est la solution la plus simple, la moins chère, et celle qu'on recommande à tous les nouveaux propriétaires.
[/duo]

C'est de loin la stratégie la plus efficace : **prévenir au lieu de nettoyer**. Voici les solutions concrètes par type de surface.`;
  content = replaceOnce(content, oldProtect, newProtect, 'tachescorten/protect');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 1 bloc [duo] (prompt 2) inséré`);
}

// ─── 3. preparer-brasero-hiver-hivernage (prompt 3) ────────────────
{
  const slug = 'preparer-brasero-hiver-hivernage';
  let content = await getContent(slug);

  // Insertion : prompt 3 (brasero bâché hiver) — section "Étape 4 — Choisir et poser la housse"
  const oldHousse = `Toutes les housses ne se valent pas. Une mauvaise housse fait **plus de dégâts** qu'une absence de housse — elle crée un microclimat humide stagnant qui accélère la corrosion. Quatre critères absolus :`;
  const newHousse = `[duo image="/blog/preparer-brasero-hiver-hivernage_prompt_3.webp" pos="left" alt="Brasero corten correctement bâché pour l'hiver avec une housse de protection ajustée et des sangles, sous un ciel d'hiver"]
**La bonne housse, bien posée**

Une housse de brasero, ce n'est pas une bâche jetée dessus. C'est un vêtement technique qui doit respirer, résister aux UV, tenir au vent, et bloquer la pluie sans piéger l'humidité. Quatre critères distinguent une bonne housse d'une bâche dangereuse.
[/duo]

Toutes les housses ne se valent pas. Une mauvaise housse fait **plus de dégâts** qu'une absence de housse — elle crée un microclimat humide stagnant qui accélère la corrosion. Quatre critères absolus :`;
  content = replaceOnce(content, oldHousse, newHousse, 'hivernage/housse');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 1 bloc [duo] (prompt 3) inséré`);
}

console.log('\n✅ Lot 4 terminé : 5 blocs [duo] insérés.');
