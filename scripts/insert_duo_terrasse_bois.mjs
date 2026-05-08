/**
 * Insertion des 3 blocs [duo] sur brasero-terrasse-bois-securite.
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

const slug = 'brasero-terrasse-bois-securite';
let content = await getContent(slug);

// #1 — Hero brasero sur terrasse bois (prompt 1)
const oldHero = `\n## Compatible, à condition de... : la réponse honnête`;
const newHero = `\n[duo image="/blog/brasero-terrasse-bois-securite_prompt_1.webp" pos="right" alt="Brasero plancha en acier corten posé sur terrasse en bois exotique foncé avec tapis ignifugé en fibre de verre noir"]
**L'installation type, sereine**

Un brasero corten sur une terrasse en ipé, avec un tapis ignifugé sous le socle : c'est l'image type d'une installation réussie. Aucun risque, aucune contrainte d'usage, et un objet qui s'intègre comme un élément architectural à part entière.
[/duo]\n## Compatible, à condition de... : la réponse honnête`;
content = replaceOnce(content, oldHero, newHero, 'terrasse/hero');

// #2 — Les 4 protections (prompt 2) → section juste avant le tableau
const oldProt = `### Les 4 protections possibles`;
const newProt = `[duo image="/blog/brasero-terrasse-bois-securite_prompt_2.webp" pos="left" alt="Quatre dalles de pierre naturelle foncée alignées en carré sous un brasero corten, intégrées dans une terrasse en bois clair"]
**La protection qui s'intègre**

Quatre dalles de pierre naturelle foncée, alignées en carré sous le brasero, créent un socle paysager qui dépasse la simple fonction de protection. C'est plus durable qu'un tapis, plus élégant qu'une plaque métallique, et ça devient un détail architectural permanent.
[/duo]

### Les 4 protections possibles`;
content = replaceOnce(content, oldProt, newProt, 'terrasse/protections');

// #3 — Balcon copropriété (prompt 3)
const oldBalcon = `Si votre terrasse est une **terrasse-balcon en copropriété** (et non un jardin privatif), trois vérifications supplémentaires s'imposent :`;
const newBalcon = `[duo image="/blog/brasero-terrasse-bois-securite_prompt_3.webp" pos="right" alt="Brasero plancha 50 cm sur balcon-terrasse en bois composite contemporain en hauteur urbaine avec vue sur la ville au coucher du soleil"]
**Le brasero compact en ville**

Un brasero plancha 50 cm sur balcon urbain, avec une plaque de pierre comme protection, c'est l'installation type pour les appartements en hauteur. Format compact, poids maîtrisé, présence visuelle assumée — à condition de respecter les trois règles spécifiques de la copropriété.
[/duo]

Si votre terrasse est une **terrasse-balcon en copropriété** (et non un jardin privatif), trois vérifications supplémentaires s'imposent :`;
content = replaceOnce(content, oldBalcon, newBalcon, 'terrasse/balcon');

await setContent(slug, content);
console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
