/**
 * Insère les blocs [duo image=...] dans les 4 articles déjà réécrits
 * en s'appuyant sur les images dispo dans /public/blog/.
 *
 * Pour chaque article, on lit le contenu actuel, on remplace 1-2
 * paragraphes-clés par leur version [duo image="..."], et on push.
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

// ─── Helpers ────────────────────────────────────────────────────
async function getContent(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('content')
    .eq('slug', slug)
    .single();
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

/** Remplace une chaîne dans le contenu, lève si non trouvé. */
function replaceOnce(content, search, replace, label) {
  const idx = content.indexOf(search);
  if (idx === -1) {
    throw new Error(`Marqueur introuvable [${label}] : ${search.slice(0, 60)}...`);
  }
  return content.slice(0, idx) + replace + content.slice(idx + search.length);
}

// ─── 1. pourquoi-brasero-artisanal-francais ─────────────────────
// Images dispo : prompt 2 (soudeur) + prompt 3 (brasero corten conception)
{
  const slug = 'pourquoi-brasero-artisanal-francais';
  let content = await getContent(slug);

  // Insertion #1 : remplace section "La soudure : invisible mais décisive" par version [duo] avec photo soudeur
  // On garde le H2 + le paragraphe d'intro, et on transforme le paragraphe TIG/MIG en [duo]
  const oldSouduretext = `Sur un brasero industriel, les soudures sont faites par un robot ou un poste semi-automatique calibré pour aller vite. Sur un brasero artisanal, chaque cordon est tracé à la main par un soudeur qualifié — généralement en **TIG (gaz inerte tungstène)** pour les jonctions visibles et critiques, qui demande de la précision mais offre une **pénétration totale** et zéro porosité. Les zones non visibles peuvent être faites en MIG/MAG, plus rapide, mais avec le même standard de qualité.`;
  const newSouduretext = `[duo image="/blog/pourquoi-brasero-artisanal-francais_prompt_2 (1).webp" pos="right" alt="Soudeur français au TIG soudant un brasero artisanal en acier corten"]
**Du robot à la main d'œuvre humaine**

Sur un brasero industriel, les soudures sont faites par un robot ou un poste semi-automatique calibré pour aller vite. Sur un brasero artisanal, chaque cordon est tracé à la main par un soudeur qualifié — généralement en **TIG (gaz inerte tungstène)** pour les jonctions visibles et critiques, qui demande de la précision mais offre une **pénétration totale** et zéro porosité. Les zones non visibles peuvent être faites en MIG/MAG, plus rapide, mais avec le même standard de qualité.
[/duo]`;
  content = replaceOnce(content, oldSouduretext, newSouduretext, 'pourquoi/soudure');

  // Insertion #2 : section "Une conception pensée par ceux qui l'utilisent" — image conception ergonomique
  const oldConcept = `Un brasero artisanal n'est pas dessiné par un bureau de style qui doit remplir un catalogue. Il est conçu par des gens qui s'en servent eux-mêmes, qui cuisinent dessus, qui reçoivent autour, qui réparent quand quelque chose dysfonctionne. Cela change tout dans la conception :`;
  const newConcept = `[duo image="/blog/pourquoi-brasero-artisanal-francais_prompt_3.webp" pos="left" alt="Brasero artisanal en acier corten avec range-bûches intégré sur terrasse en pierre"]
**Conçu par ceux qui l'utilisent**

Un brasero artisanal n'est pas dessiné par un bureau de style qui doit remplir un catalogue. Il est conçu par des gens qui s'en servent eux-mêmes, qui cuisinent dessus, qui reçoivent autour, qui réparent quand quelque chose dysfonctionne.
[/duo]

Cela change tout dans la conception. Voici les détails concrets qui en découlent :`;
  content = replaceOnce(content, oldConcept, newConcept, 'pourquoi/conception');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 2 blocs [duo] insérés`);
}

// ─── 2. quel-brasero-choisir-nombre-convives ────────────────────
// Images dispo : prompt1 (hero grande tablée) + prompt 2 (50cm balcon) + prompt 3 (80cm terrasse)
{
  const slug = 'quel-brasero-choisir-nombre-convives';
  let content = await getContent(slug);

  // Insertion #1 : section 50 cm — image balcon parisien
  const old50 = `Le brasero plancha de 50 cm est fait pour les **repas intimes**. Deux entrecôtes avec leurs légumes en accompagnement, quatre portions de poisson, un apéritif plancha varié pour quatre convives : c'est le bon ratio entre place de cuisson et concentration thermique.`;
  const new50 = `[duo image="/blog/quel-brasero-choisir-nombre-convives_prompt_2.webp" pos="right" alt="Brasero plancha 50 cm sur balcon parisien avec côte de bœuf en cuisson"]
**Le format duo : 2 à 4 convives**

Le brasero plancha de 50 cm est fait pour les **repas intimes**. Deux entrecôtes avec leurs légumes en accompagnement, quatre portions de poisson, un apéritif plancha varié pour quatre convives : c'est le bon ratio entre place de cuisson et concentration thermique.
[/duo]`;
  content = replaceOnce(content, old50, new50, 'convives/50cm');

  // Insertion #2 : section 80 cm — image terrasse jardin
  const old80 = `Le 80 cm est le **format polyvalent par excellence**, et de loin le plus vendu de la gamme. C'est le choix le plus fréquent pour les familles avec enfants, les couples qui reçoivent régulièrement, et les amateurs de repas entre amis.`;
  const new80 = `[duo image="/blog/quel-brasero-choisir-nombre-convives _prompt_3.webp" pos="left" alt="Brasero plancha 80 cm en acier corten sur terrasse familiale avec viandes et légumes en cuisson"]
**Le format convivial : 6 à 8 convives**

Le 80 cm est le **format polyvalent par excellence**, et de loin le plus vendu de la gamme. C'est le choix le plus fréquent pour les familles avec enfants, les couples qui reçoivent régulièrement, et les amateurs de repas entre amis.
[/duo]`;
  content = replaceOnce(content, old80, new80, 'convives/80cm');

  // Insertion #3 hero (sans suffixe = prompt 1)
  // On l'insère juste avant le H2 "Le diamètre, c'est tout"
  const oldHero = `\n## Le diamètre, c'est tout`;
  const newHero = `\n[duo image="/blog/quel-brasero-choisir-nombre-convives.webp" pos="right" alt="Grande tablée extérieure autour d'un brasero plancha 100 cm en cuisson"]
**Combien serez-vous, vraiment ?**

Pas le grand repas annuel exceptionnel. Pas le tête-à-tête atypique. Le repas habituel, celui qui revient toutes les semaines en saison. C'est ce chiffre-là qui doit guider votre choix de diamètre.
[/duo]\n## Le diamètre, c'est tout`;
  content = replaceOnce(content, oldHero, newHero, 'convives/hero');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
}

// ─── 3. brasero-plancha-vs-barbecue ─────────────────────────────
// Images dispo : prompt 1 (diptyque) + prompt 2 (saint-jacques sur plancha) + prompt 3 (ambiance soir)
{
  const slug = 'brasero-plancha-vs-barbecue';
  let content = await getContent(slug);

  // Insertion #1 : section "plancha vs grille" — image saint-jacques
  const oldPlancha = `Sur une **plancha de brasero**, la surface est continue. C'est une couronne d'acier épais (8 à 10 mm) qui s'enroule autour du foyer. Rien ne tombe, rien ne brûle directement, et la chaleur transite par contact à travers une masse métallique chauffée. Conséquences :`;
  const newPlancha = `[duo image="/blog/brasero-plancha-vs-barbecue_Prompt_2.webp" pos="right" alt="Saint-jacques caramélisées sur plancha en acier carbone d'un brasero plancha"]
**Une surface continue, sans flamme parasite**

Sur une **plancha de brasero**, la surface est continue. C'est une couronne d'acier épais (8 à 10 mm) qui s'enroule autour du foyer. Rien ne tombe, rien ne brûle directement, et la chaleur transite par contact à travers une masse métallique chauffée.
[/duo]

Conséquences concrètes de cette différence physique :`;
  content = replaceOnce(content, oldPlancha, newPlancha, 'barbecue/plancha');

  // Insertion #2 : section ambiance — image atmosphérique soir
  const oldAmbiance = `Un **brasero plancha** continue à vivre tant qu'on lui donne du bois. La plancha a refroidi mais le foyer continue à crépiter, la lumière des braises éclaire les visages, on rapproche les chaises, quelqu'un sert un dernier verre, la conversation prend une autre couleur. **Le brasero ne s'éteint pas avec le repas, il prolonge la soirée.**`;
  const newAmbiance = `[duo image="/blog/brasero-plancha-vs-barbecue_Prompt_3.webp" pos="left" alt="Brasero plancha la nuit, foyer crépitant, ambiance prolongée après le repas"]
**Le brasero ne s'éteint pas avec le repas**

Un **brasero plancha** continue à vivre tant qu'on lui donne du bois. La plancha a refroidi mais le foyer continue à crépiter, la lumière des braises éclaire les visages, on rapproche les chaises, quelqu'un sert un dernier verre, la conversation prend une autre couleur.
[/duo]`;
  content = replaceOnce(content, oldAmbiance, newAmbiance, 'barbecue/ambiance');

  // Insertion #3 : hero diptyque — juste avant le 1er H2
  const oldHero = `\n## Le malentendu : ce ne sont pas les mêmes objets`;
  const newHero = `\n[duo image="/blog/brasero-plancha-vs-barbecue_prompt1.webp" pos="right" alt="Comparatif visuel d'un barbecue Weber et d'un brasero plancha artisanal en corten"]
**Deux objets, deux usages**

Avant de comparer ligne à ligne, regardons les deux objets côte à côte. Un barbecue Weber kettle d'un côté, un brasero plancha artisanal de l'autre. Même fonction primaire (cuisson au feu), des objets radicalement différents.
[/duo]\n## Le malentendu : ce ne sont pas les mêmes objets`;
  content = replaceOnce(content, oldHero, newHero, 'barbecue/hero');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
}

// ─── 4. meilleur-bois-brasero-comparatif ────────────────────────
// Images dispo : prompts 1, 2, 3, 4 — TOUS
{
  const slug = 'meilleur-bois-brasero-comparatif';
  let content = await getContent(slug);

  // Insertion #1 : hero 5 essences — juste avant 1er H2
  const oldHero = `\n## Pourquoi le choix du bois change tout`;
  const newHero = `\n[duo image="/blog/meilleur-bois-brasero-comparatif_prompt1 (1).webp" pos="right" alt="Cinq essences de bois pour brasero alignées : chêne, hêtre, charme, frêne, bûche densifiée"]
**Cinq essences, cinq comportements**

Chêne, hêtre, charme, frêne, bûche densifiée : les cinq combustibles qu'on recommande pour un brasero plancha. Chacun a sa signature thermique, sa durée de braise, son prix. Les départager se joue sur quatre critères techniques.
[/duo]\n## Pourquoi le choix du bois change tout`;
  content = replaceOnce(content, oldHero, newHero, 'bois/hero');

  // Insertion #2 : section chêne — image tas de bûches contre mur
  const oldChene = `Le chêne est le bois de référence pour le brasero plancha en France. C'est la valeur sûre, celle qu'on recommande sans hésiter à un client qui démarre. Son **pouvoir calorifique avoisine 2 000 kWh/stère**, sa combustion est lente et régulière, et ses braises sont denses, durables, avec un rayonnement infrarouge puissant qui chauffe la plancha de manière homogène.`;
  const newChene = `[duo image="/blog/meilleur-bois-brasero-comparatif_prompt2.webp" pos="left" alt="Tas de bûches de chêne fendues empilées contre un mur de pierre"]
**Le chêne, valeur de référence**

Le chêne est le bois de référence pour le brasero plancha en France. C'est la valeur sûre, celle qu'on recommande sans hésiter à un client qui démarre. Son **pouvoir calorifique avoisine 2 000 kWh/stère**, sa combustion est lente et régulière, et ses braises sont denses, durables, avec un rayonnement infrarouge puissant.
[/duo]`;
  content = replaceOnce(content, oldChene, newChene, 'bois/chene');

  // Insertion #3 : section "vérifier le séchage" — image mains qui frappent les bûches
  const oldSec = `Le taux d'humidité est probablement le critère **le plus important** de tous, et le plus souvent négligé. Quatre indices visuels suffisent à juger un tas de bois :`;
  const newSec = `[duo image="/blog/meilleur-bois-brasero-comparatif_prompt3.webp" pos="right" alt="Mains expérimentées frappant deux bûches l'une contre l'autre pour tester le son du bois sec"]
**Le taux d'humidité, critère oublié**

Le taux d'humidité est probablement le critère **le plus important** de tous, et le plus souvent négligé par les acheteurs. Quatre indices visuels permettent de juger un tas de bois sans testeur électronique.
[/duo]

Voici comment lire un tas de bois en quatre tests :`;
  content = replaceOnce(content, oldSec, newSec, 'bois/sechage');

  // Insertion #4 : section stockage — image abri à bois
  const oldStock = `**Comment stocker** :\n- **Sous abri ventilé**, jamais en bâche fermée (la condensation re-mouille le bois)`;
  const newStock = `[duo image="/blog/meilleur-bois-brasero-comparatif_prompt_4.webp" pos="left" alt="Abri à bois traditionnel français avec bûches de chêne empilées en croisé"]
**Le bon stockage prolonge le séchage**

Un bois fendu et stocké dans les règles continue à sécher jusqu'à atteindre l'humidité ambiante. Mal stocké, il peut au contraire se re-mouiller et devenir inutilisable. Cinq règles simples suffisent pour un stockage qui marche.
[/duo]

**Comment stocker** :
- **Sous abri ventilé**, jamais en bâche fermée (la condensation re-mouille le bois)`;
  content = replaceOnce(content, oldStock, newStock, 'bois/stockage');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 4 blocs [duo] insérés`);
}

console.log('\n✅ Insertion des blocs [duo] terminée.');
