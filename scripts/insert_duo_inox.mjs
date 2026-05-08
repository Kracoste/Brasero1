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

const slug = 'entretien-plancha-inox-brasero';
let content = await getContent(slug);

// #1 — Hero (prompt 1) — avant 1er H2
const oldHero = `\n## Pourquoi l'inox est plus simple à vivre que l'acier carbone`;
const newHero = `\n[duo image="/blog/entretien-plancha-inox-brasero_prompt_1.webp" pos="right" alt="Plancha de brasero en acier inoxydable parfaitement nettoyée avec gouttes d'eau perlées sous lumière de matin"]
**L'inox bien soigné**

Une plancha inox correctement entretenue garde son aspect et ses performances pendant vingt ans. Pas de magie, pas de produit miracle — juste trois minutes de gestes après chaque cuisson, et quelques règles à ne jamais transgresser.
[/duo]\n## Pourquoi l'inox est plus simple à vivre que l'acier carbone`;
content = replaceOnce(content, oldHero, newHero, 'inox/hero');

// #2 — Rituel 3 min (prompt 2)
const oldRituel = `### Étape 1 — Racler à chaud (1 minute)`;
const newRituel = `[duo image="/blog/entretien-plancha-inox-brasero_prompt_2.webp" pos="left" alt="Mains qui passent une raclette en inox sur une plancha tiède pour décoller les résidus de cuisson"]
**Trois étapes, trois minutes**

La méthode tient en trois gestes simples qu'on enchaîne dans l'ordre, sur plancha encore tiède. Aucun détergent, aucun produit spécifique — juste la raclette, l'eau chaude et le chiffon. C'est tout ce qu'il faut pour neuf services sur dix.
[/duo]

### Étape 1 — Racler à chaud (1 minute)`;
content = replaceOnce(content, oldRituel, newRituel, 'inox/rituel');

// #3 — Entretien profond (prompt 3)
const oldProf = `### Méthode en 4 étapes`;
const newProf = `[duo image="/blog/entretien-plancha-inox-brasero_prompt_3.webp" pos="right" alt="Application de pâte à l'inox au chiffon doux dans le sens du grain pour redonner sa brillance à une plancha"]
**Une fois par an, vingt minutes**

L'entretien profond annuel demande une vingtaine de minutes en fin de saison, et il remet la plancha dans l'état exact où elle était à la livraison. C'est aussi le moment de préparer la plancha à passer l'hiver dans les meilleures conditions.
[/duo]

### Méthode en 4 étapes`;
content = replaceOnce(content, oldProf, newProf, 'inox/profond');

await setContent(slug, content);
console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
