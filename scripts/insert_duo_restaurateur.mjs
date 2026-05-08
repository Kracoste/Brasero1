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

const slug = 'choisir-brasero-restaurateur-professionnel';
const { data, error: e1 } = await supabase
  .from('blog_posts').select('content').eq('slug', slug).single();
if (e1) throw e1;
let content = data.content;

function replaceOnce(content, search, replace, label) {
  const idx = content.indexOf(search);
  if (idx === -1) throw new Error(`Marqueur introuvable [${label}]`);
  return content.slice(0, idx) + replace + content.slice(idx + search.length);
}

// #1 Hero — avant 1er H2
const oldHero = `\n## Pourquoi le brasero entre en restauration en 2026`;
const newHero = `\n[duo image="/blog/choisir-brasero-restaurateur-professionnel_prompt_1.webp" pos="right" alt="Brasero plancha 100 cm en acier corten dans la cuisine ouverte d'un restaurant de bistronomie premium avec chef en service"]
**Le brasero comme poste de production**

En restauration, le brasero n'est plus un objet de spectacle ponctuel : c'est un véritable poste de production qui s'intègre dans la cuisine ouverte de l'établissement. Présence visuelle forte, polyvalence de cuisson, signature mémorisable — le combo qui fait basculer une carte standard en carte signature.
[/duo]\n## Pourquoi le brasero entre en restauration en 2026`;
content = replaceOnce(content, oldHero, newHero, 'resto/hero');

// #2 Ergonomie poste
const oldErg = `Un brasero professionnel ne fonctionne pas tout seul — il s'intègre dans un **poste de cuisine ouverte** qui doit être pensé pour l'équipe.`;
const newErg = `[duo image="/blog/choisir-brasero-restaurateur-professionnel_prompt_2.webp" pos="left" alt="Poste de cuisine professionnel autour d'un brasero plancha avec plan de dressage en bois et range-bûches mural en corten"]
**Un poste pensé pour l'équipe**

Un brasero pro n'est jamais un objet isolé. Il s'intègre dans un poste de cuisine ouverte structuré : plan de dressage adjacent, range-bûches accessible, ustensiles à portée. C'est la différence entre un brasero qui fait gagner du temps et un brasero qui en fait perdre en plein coup de feu.
[/duo]

Un brasero professionnel ne fonctionne pas tout seul — il s'intègre dans un **poste de cuisine ouverte** qui doit être pensé pour l'équipe.`;
content = replaceOnce(content, oldErg, newErg, 'resto/ergonomie');

// #3 Food truck
const oldFt = `### Food truck / cuisine de rue

Brasero 80 cm sur **remorque homologuée** (voir [brasero événementiel — remorque](/blog/brasero-evenement-mariage-reception)). Configuration mobile pour festivals, marchés nocturnes, événements urbains. Carte courte, produits signature autour du feu de bois.`;
const newFt = `[duo image="/blog/choisir-brasero-restaurateur-professionnel_prompt_3.webp" pos="right" alt="Food truck contemporain avec brasero plancha visible à l'arrière en service nocturne sur place urbaine animée"]
**Le food truck brasero**

La street food premium a trouvé son équipement signature : un brasero plancha visible depuis la rue, qui transforme un food truck en attraction visuelle. La cuisson au feu de bois en mobilité, c'est une catégorie qui n'existait pas il y a cinq ans et qui devient un format à part entière.
[/duo]

### Food truck / cuisine de rue

Brasero 80 cm sur **remorque homologuée** (voir [brasero événementiel — remorque](/blog/brasero-evenement-mariage-reception)). Configuration mobile pour festivals, marchés nocturnes, événements urbains. Carte courte, produits signature autour du feu de bois.`;
content = replaceOnce(content, oldFt, newFt, 'resto/foodtruck');

const { error: e2 } = await supabase
  .from('blog_posts')
  .update({ content, updated_at: new Date().toISOString() })
  .eq('slug', slug);
if (e2) throw e2;

console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
