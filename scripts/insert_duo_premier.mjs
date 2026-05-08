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

const slug = 'premier-brasero-guide-debutant';
let content = await getContent(slug);

// #1 — Hero "le moment du choix" — avant 1er H2
const oldHero = `\n## Avant tout : à qui s'adresse ce guide`;
const newHero = `\n[duo image="/blog/premier-brasero-guide-debutant_prompt_1.webp" pos="right" alt="Couple en train de regarder ensemble des photos de braseros sur un canapé d'extérieur de jardin de campagne français"]
**Avant l'achat, le bon questionnement**

Choisir son premier brasero, c'est l'une des décisions les plus structurantes pour votre extérieur des dix prochaines années. Vingt minutes de réflexion en amont valent mieux que dix années d'usage déçu. Voici les questions qui comptent vraiment.
[/duo]\n## Avant tout : à qui s'adresse ce guide`;
content = replaceOnce(content, oldHero, newHero, 'premier/hero');

// #2 — Question 2 espace
const oldQ2 = `Le brasero rayonne, il chauffe l'air alentour, il a besoin d'**air autour de lui**. La règle de base : **1,5 mètre de dégagement minimum** de tous les côtés par rapport à un mur, une pergola, une haie, du mobilier ou une plante.`;
const newQ2 = `[duo image="/blog/premier-brasero-guide-debutant_prompt_2.webp" pos="left" alt="Vue plongeante d'un brasero plancha installé au centre d'une terrasse avec mobilier de jardin disposé à distance respectueuse"]
**L'espace dégagé qui change tout**

Un brasero a besoin de respirer. Le périmètre de dégagement n'est pas un confort — c'est une condition de sécurité, et un facteur direct de votre confort de cuisinier. Sans cette zone d'air libre, vous serez à l'étroit à chaque service.
[/duo]

Le brasero rayonne, il chauffe l'air alentour, il a besoin d'**air autour de lui**. La règle de base : **1,5 mètre de dégagement minimum** de tous les côtés par rapport à un mur, une pergola, une haie, du mobilier ou une plante.`;
content = replaceOnce(content, oldQ2, newQ2, 'premier/q2');

// #3 — Recommandation par profil — vraie photo des 3 braseros
const oldReco = `\n## Notre recommandation par profil`;
const newReco = `\n[duo image="/blog/premier-brasero-guide-debutant_prompt_3.webp" pos="right" alt="Trois braseros artisanaux français côte à côte sur une terrasse en pierre : Coffy 50 cm, Le Fermier corten et L'Obélix 80 cm"]
**Trois formats, trois familles d'usage**

Coffy 50, Fermier corten, Obélix 80 : trois braseros qui couvrent l'essentiel des usages domestiques en France. Chacun a son terrain de jeu — le bon choix dépend uniquement de la taille de votre tablée habituelle et de votre rapport à l'entretien.
[/duo]\n## Notre recommandation par profil`;
content = replaceOnce(content, oldReco, newReco, 'premier/reco');

await setContent(slug, content);
console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
