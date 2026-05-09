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

const slug = 'guide-ultime-brasero-plancha';
const { data, error: e1 } = await supabase
  .from('blog_posts').select('content').eq('slug', slug).single();
if (e1) throw e1;
let content = data.content;

function replaceOnce(content, search, replace, label) {
  const idx = content.indexOf(search);
  if (idx === -1) throw new Error(`Marqueur introuvable [${label}]`);
  return content.slice(0, idx) + replace + content.slice(idx + search.length);
}

// #1 Atelier français — section "Pourquoi le brasero plancha cartonne en France"
const oldAtelier = `Cinq raisons cumulatives expliquent l'essor du brasero plancha depuis 2018-2020.`;
const newAtelier = `[duo image="/blog/guide-ultime-brasero-plancha_prompt_1.webp" pos="left" alt="Atelier de ferronnerie français avec brasero corten en cours de finition, soudures TIG visibles, artisan en tablier de cuir au travail"]
**L'artisanat français du brasero**

Derrière chaque brasero artisanal vendu en France, il y a un atelier, des soudeurs qualifiés, des heures de fabrication à la main. Cette filière s'est structurée depuis 2018-2020 en réponse à une demande grandissante pour des objets durables, identifiables et fabriqués localement. Le brasero plancha est devenu l'un de ses produits emblématiques.
[/duo]

Cinq raisons cumulatives expliquent l'essor du brasero plancha depuis 2018-2020.`;
content = replaceOnce(content, oldAtelier, newAtelier, 'pillar/atelier');

// #2 Le bon usage — section "L'usage : allumage, gestion du feu, cuissons"
const oldUsage = `Une fois le brasero choisi, encore faut-il savoir s'en servir. La courbe d'apprentissage est rapide (3-5 sessions pour les bases) mais demande de comprendre quelques principes.`;
const newUsage = `[duo image="/blog/guide-ultime-brasero-plancha_prompt_2.webp" pos="right" alt="Repas familial autour d'un brasero plancha en pleine cuisson avec entrecôtes, légumes et gambas, plusieurs mains qui participent"]
**Cuisiner devient un moment partagé**

La grande différence avec les appareils de cuisine traditionnels : sur un brasero, **plusieurs personnes peuvent participer** à la cuisson. Le cuisinier saisit, un invité s'occupe des légumes, un autre alimente le feu, un troisième prépare le dressage. C'est une cuisine partagée, pas un service à sens unique.
[/duo]

Une fois le brasero choisi, encore faut-il savoir s'en servir. La courbe d'apprentissage est rapide (3-5 sessions pour les bases) mais demande de comprendre quelques principes.`;
content = replaceOnce(content, oldUsage, newUsage, 'pillar/usage');

// #3 Cuisiner au brasero — section "4 grandes familles de cuissons"
const oldCuissons = `Le brasero plancha permet une gamme étonnamment large de cuissons. Voici les quatre grandes familles avec leurs articles dédiés.`;
const newCuissons = `[duo image="/blog/guide-ultime-brasero-plancha_prompt_3.webp" pos="left" alt="Vue plongeante sur une plancha de brasero en activité montrant les 3 zones thermiques avec entrecôte au centre, saint-jacques sur l'anneau et légumes au bord"]
**Une plancha, trois zones, mille possibilités**

Le brasero plancha n'est pas une surface uniforme : c'est une plaque qui offre simultanément trois températures distinctes. Cette particularité géométrique ouvre la voie à des cuissons impossibles ailleurs — saisie au centre, finition à l'anneau, repos au bord. Tout sur la même surface, en même temps.
[/duo]

Le brasero plancha permet une gamme étonnamment large de cuissons. Voici les quatre grandes familles avec leurs articles dédiés.`;
content = replaceOnce(content, oldCuissons, newCuissons, 'pillar/cuissons');

const { error: e2 } = await supabase
  .from('blog_posts')
  .update({ content, updated_at: new Date().toISOString() })
  .eq('slug', slug);
if (e2) throw e2;

console.log(`✓ ${slug} (PILLAR) : 3 blocs [duo] insérés`);
