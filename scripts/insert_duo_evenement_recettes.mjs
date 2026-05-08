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

// ─── 1. brasero-evenement-mariage-reception ───────────────────────
{
  const slug = 'brasero-evenement-mariage-reception';
  let content = await getContent(slug);

  // Hero — avant 1er H2
  const oldHero = `\n## Pourquoi le brasero transforme un événement`;
  const newHero = `\n[duo image="/blog/brasero-evenement-mariage-reception_prompt_1.webp" pos="right" alt="Brasero plancha en acier corten au cœur d'un mariage haut de gamme français à la golden hour avec invités et tables dressées"]
**Le brasero comme cœur d'un événement**

Au cœur d'une réception, le brasero ne sert pas qu'à cuisiner — il devient le **point d'ancrage visuel** de l'événement, ce qui sera photographié, filmé, partagé. Sa présence transforme l'expérience invité dès l'instant où il est allumé.
[/duo]\n## Pourquoi le brasero transforme un événement`;
  content = replaceOnce(content, oldHero, newHero, 'event/hero');

  // Cuisine face public
  const oldCuisine = `Un brasero événementiel bien mis en scène, c'est l'**équivalent occidental d'un comptoir teppanyaki japonais** : une cuisine ouverte, à l'air libre, où le chef opère **face aux convives** plutôt que caché en cuisine.`;
  const newCuisine = `[duo image="/blog/brasero-evenement-mariage-reception_prompt_2.webp" pos="left" alt="Chef en blouse blanche saisissant une côte de bœuf face au public sur un brasero plancha en pleine cuisson"]
**Le chef devient le narrateur**

Quand le brasero est central et le chef visible, la cuisine devient une narration. Les invités ne reçoivent plus un plat — ils assistent à sa création, posent des questions, repartent avec une histoire qu'ils raconteront à leur tour.
[/duo]

Un brasero événementiel bien mis en scène, c'est l'**équivalent occidental d'un comptoir teppanyaki japonais** : une cuisine ouverte, à l'air libre, où le chef opère **face aux convives** plutôt que caché en cuisine.`;
  content = replaceOnce(content, oldCuisine, newCuisine, 'event/cuisine');

  // Remorque nomade
  const oldRemorque = `Pour les **traiteurs et chefs à domicile** qui interviennent sur plusieurs sites différents (mariages itinérants, festivals, salons, prestations clientèle), la solution clé est la **remorque brasero** — un brasero installé sur un châssis homologué pour la route, transportable derrière n'importe quel véhicule équipé d'un attelage.`;
  const newRemorque = `[duo image="/blog/brasero-evenement-mariage-reception_prompt_3.webp" pos="right" alt="Remorque événementielle homologuée tractée par un véhicule, équipée d'un brasero plancha 100 cm en acier corten arrimé"]
**Le brasero qui voyage**

Pour les traiteurs et chefs à domicile, la mobilité change tout : pouvoir intervenir aujourd'hui dans un domaine viticole, demain dans un château, après-demain en bord de mer. La remorque brasero rend cette flexibilité possible, sans compromis sur la qualité du matériel.
[/duo]

Pour les **traiteurs et chefs à domicile** qui interviennent sur plusieurs sites différents (mariages itinérants, festivals, salons, prestations clientèle), la solution clé est la **remorque brasero** — un brasero installé sur un châssis homologué pour la route, transportable derrière n'importe quel véhicule équipé d'un attelage.`;
  content = replaceOnce(content, oldRemorque, newRemorque, 'event/remorque');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
}

// ─── 2. recettes-viandes-rouges-brasero-plancha ────────────────────
{
  const slug = 'recettes-viandes-rouges-brasero-plancha';
  let content = await getContent(slug);

  // Hero recette 1 (côte de bœuf)
  const oldCote = `\n## Recette 1 — La côte de bœuf (2 à 3 personnes)`;
  const newCote = `\n[duo image="/blog/recettes-viandes-rouges-brasero-plancha_prompt_1.webp" pos="right" alt="Côte de bœuf maturée 30 jours en pleine saisie sur une plancha de brasero en acier carbone culottée"]
**La côte de bœuf, recette de référence**

Une côte de bœuf parfaitement saisie sur plancha brasero, c'est la recette qui résume toute la philosophie de cette cuisine : une grande pièce, une grande chaleur, un grand respect du repos. C'est aussi la première recette à maîtriser quand on découvre le brasero.
[/duo]\n## Recette 1 — La côte de bœuf (2 à 3 personnes)`;
  content = replaceOnce(content, oldCote, newCote, 'recettes/cote');

  // Brochettes agneau (recette 4)
  const oldAgneau = `**Pièce idéale** : 800 g de **gigot d'agneau désossé** ou de selle d'agneau, coupée en cubes de 3 cm. Demandez à votre boucher de désosser à la coupe.`;
  const newAgneau = `[duo image="/blog/recettes-viandes-rouges-brasero-plancha_prompt_2.webp" pos="left" alt="Quatre brochettes d'agneau marinées en cuisson sur la grille centrale d'un brasero plancha avec oignons rouges et poivrons"]
**Brochettes : la recette qui plaît à tout le monde**

Les brochettes d'agneau marinées sont la recette qui fait l'unanimité — enfants, ados, parents, grands-parents. Elles cuisent vite, se servent immédiatement, et la marinade aux herbes provençales fonctionne à coup sûr. C'est aussi la recette idéale pour un repas conséquent sans complexité de timing.
[/duo]

**Pièce idéale** : 800 g de **gigot d'agneau désossé** ou de selle d'agneau, coupée en cubes de 3 cm. Demandez à votre boucher de désosser à la coupe.`;
  content = replaceOnce(content, oldAgneau, newAgneau, 'recettes/agneau');

  // Tomahawk (recette 6)
  const oldTomahawk = `\n## Recette 6 — Le tomahawk en cuisson alternée (4 à 6 personnes)`;
  const newTomahawk = `\n[duo image="/blog/recettes-viandes-rouges-brasero-plancha_prompt_3.webp" pos="right" alt="Tomahawk de 1,8 kg en cuisson alternée sur plancha de brasero, croûte parfaite et thermomètre à sonde"]
**Le tomahawk, pièce de démonstration**

Une pièce qui ne laisse personne indifférent. Sa taille, son manche d'os spectaculaire, sa découpe à table en font la recette la plus impressionnante du répertoire brasero. Mais elle demande une technique précise — la saisie pure ne suffit pas, il faut alterner avec la cuisson douce.
[/duo]\n## Recette 6 — Le tomahawk en cuisson alternée (4 à 6 personnes)`;
  content = replaceOnce(content, oldTomahawk, newTomahawk, 'recettes/tomahawk');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
}

console.log('\n✅ 6 blocs [duo] insérés au total.');
