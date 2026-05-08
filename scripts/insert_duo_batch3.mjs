/**
 * Lot 3 — Insertion massive de tous les blocs [duo] restants pour les articles
 * réécrits qui en attendaient.
 *
 * - comment-culotter-plancha-acier-carbone : 3 blocs (matière, rituel, œuf)
 * - plancha-inox-ou-acier-carbone : 3 blocs (diptyque, saisie carbone, nettoyage inox)
 * - brasero-corten-taches-terrasse-solutions : 2 blocs (coulures hero, nettoyage)
 * - preparer-brasero-hiver-hivernage : 1 bloc (hero givre)
 * - pourquoi-brasero-artisanal-francais : 1 bloc (prompt 1 - acier 3 mm)
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

// ─── 1. comment-culotter-plancha-acier-carbone ───────────────────
{
  const slug = 'comment-culotter-plancha-acier-carbone';
  let content = await getContent(slug);

  // Insertion #1 : prompt 1 (diptyque matière brute/culottée) — avant le 1er H2
  const oldHero = `\n## Qu'est-ce que le culottage, vraiment ?`;
  const newHero = `\n[duo image="/blog/comment-culotter-plancha-acier-carbone_prompt_1.webp" pos="right" alt="Diptyque visuel : plancha de brasero en acier carbone neuf à gauche, plancha culottée mature noire à droite"]
**De la matière brute à l'outil de chef**

Une plancha en acier carbone neuve a la couleur grise du métal brut. La même plancha, après quelques mois d'usage régulier, est noire profonde, lisse, satinée. C'est la même pièce d'acier — c'est le culottage qui a fait toute la différence.
[/duo]\n## Qu'est-ce que le culottage, vraiment ?`;
  content = replaceOnce(content, oldHero, newHero, 'culottage/hero');

  // Insertion #2 : prompt 2 (rituel des 2 minutes) — section entretien quotidien
  const oldRituel = `**Le rituel des 2 minutes (à la fin de chaque cuisson) :**

- **Pendant que la plancha est encore tiède** (50-80 °C, donc 10-15 minutes après l'extinction du foyer), **raclez à la spatule métallique** pour décoller les résidus de cuisson. Ils partent facilement à cette température.`;
  const newRituel = `[duo image="/blog/comment-culotter-plancha-acier-carbone_prompt_2.webp" pos="left" alt="Geste d'entretien d'une plancha culottée avec un chiffon en papier huilé tenu à la pince longue"]
**Deux minutes, trois gestes, vingt ans de service**

Le rituel d'entretien d'une plancha culottée se résume à trois gestes après chaque cuisson, faits pendant que la plancha est encore tiède. Ce sont ces deux minutes répétées service après service qui construisent et préservent la couche antiadhérente naturelle.
[/duo]

**Le rituel des 2 minutes (à la fin de chaque cuisson) :**

- **Pendant que la plancha est encore tiède** (50-80 °C, donc 10-15 minutes après l'extinction du foyer), **raclez à la spatule métallique** pour décoller les résidus de cuisson. Ils partent facilement à cette température.`;
  content = replaceOnce(content, oldRituel, newRituel, 'culottage/rituel');

  // Insertion #3 : prompt 3 (œuf au plat) — section "savoir si culottage mature"
  const oldMature = `Quatre signes vous indiquent que votre culottage a atteint son régime de croisière :`;
  const newMature = `[duo image="/blog/comment-culotter-plancha-acier-carbone_prompt_3.webp" pos="right" alt="Œuf au plat et tranches de pancetta cuisant sur une plancha de brasero parfaitement culottée"]
**Le test ultime : l'œuf au plat**

Un œuf au plat qui glisse sans accrocher, c'est la signature d'un culottage mature. Quand votre plancha en arrive là, vous savez que les semaines de patience ont payé — la couche antiadhérente naturelle est en place pour les vingt prochaines années.
[/duo]

Quatre signes vous indiquent que votre culottage a atteint son régime de croisière :`;
  content = replaceOnce(content, oldMature, newMature, 'culottage/mature');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
}

// ─── 2. plancha-inox-ou-acier-carbone ─────────────────────────────
{
  const slug = 'plancha-inox-ou-acier-carbone';
  let content = await getContent(slug);

  // Insertion #1 : prompt 1 (diptyque inox/carbone) — hero avant 1er H2
  const oldHero = `\n## Deux matériaux, deux philosophies de cuisson`;
  const newHero = `\n[duo image="/blog/plancha-inox-ou-acier-carbone_prompt_1.webp" pos="right" alt="Diptyque visuel : plancha en inox argenté à gauche, plancha en acier carbone culottée noire à droite"]
**Deux matières, deux familles d'outils**

L'inox brille, l'acier carbone se patine. L'inox pardonne, l'acier carbone se mérite. Avant de choisir lequel équipera votre brasero, regardons les deux côte à côte — chacun a ses qualités fortes, et il n'y a pas de hiérarchie absolue entre les deux.
[/duo]\n## Deux matériaux, deux philosophies de cuisson`;
  content = replaceOnce(content, oldHero, newHero, 'inox/hero');

  // Insertion #2 : prompt 2 (saisie acier carbone) — section "saisie avant tout"
  const oldSaisie = `L'acier carbone est probablement le matériau **le plus utilisé en cuisine professionnelle** dans le monde — woks chinois, poêles De Buyer, planchas de restaurant haut de gamme, plaques teppanyaki japonaises. Il y a une raison à cette domination : sa **conductivité thermique** est nettement supérieure à celle de l'inox, et la chaleur transite du foyer à l'aliment plus vite, plus uniformément, plus puissamment.`;
  const newSaisie = `[duo image="/blog/plancha-inox-ou-acier-carbone_prompt_2.webp" pos="left" alt="Trois entrecôtes saisies sur une plancha de brasero en acier carbone, croûte caramélisée brun-doré"]
**La saisie qui caramélise net**

L'acier carbone est le matériau choisi par les chefs du monde entier pour une raison simple : il transmet la chaleur plus vite, plus directement, plus puissamment que n'importe quel autre métal couramment utilisé en cuisine.
[/duo]

L'acier carbone est probablement le matériau **le plus utilisé en cuisine professionnelle** dans le monde — woks chinois, poêles De Buyer, planchas de restaurant haut de gamme, plaques teppanyaki japonaises. Il y a une raison à cette domination : sa **conductivité thermique** est nettement supérieure à celle de l'inox, et la chaleur transite du foyer à l'aliment plus vite, plus uniformément, plus puissamment.`;
  content = replaceOnce(content, oldSaisie, newSaisie, 'inox/saisie');

  // Insertion #3 : prompt 3 (nettoyage inox) — section "tranquillité absolue"
  const oldTranq = `L'inox de 10 mm est l'autre option, et elle a ses propres qualités fortes — différentes mais réelles. La principale tient en une phrase : **l'inox ne rouille pas**.`;
  const newTranq = `[duo image="/blog/plancha-inox-ou-acier-carbone_prompt_3.webp" pos="right" alt="Nettoyage simple d'une plancha en inox d'un coup de spatule, surface argentée impeccable"]
**Un coup de spatule, et c'est fini**

L'inox demande exactement le contraire de la rigueur du culottage : aucun rituel, aucun produit spécifique, aucun risque de rouille. Un coup de spatule sur la surface tiède, un chiffon, et la plancha est prête pour la prochaine cuisson — peu importe quand elle viendra.
[/duo]

L'inox de 10 mm est l'autre option, et elle a ses propres qualités fortes — différentes mais réelles. La principale tient en une phrase : **l'inox ne rouille pas**.`;
  content = replaceOnce(content, oldTranq, newTranq, 'inox/tranquillite');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 3 blocs [duo] insérés`);
}

// ─── 3. brasero-corten-taches-terrasse-solutions ──────────────────
{
  const slug = 'brasero-corten-taches-terrasse-solutions';
  let content = await getContent(slug);

  // Insertion #1 : prompt 1 (coulures sur dalle) — avant 1er H2
  const oldHero = `\n## Pourquoi le corten coule au début (et pourquoi ça s'arrête)`;
  const newHero = `\n[duo image="/blog/brasero-corten-taches-terrasse-solutions_prompt_1.webp" pos="right" alt="Coulures de rouille fraîche d'un brasero corten en phase de patinage sur une dalle de pierre claire"]
**Quand le corten "coule"**

Pendant les premières semaines de vie d'un brasero corten, des coulures orangées peuvent apparaître au sol après chaque pluie. C'est normal, c'est temporaire, et c'est gérable — à condition de comprendre ce qui se passe vraiment.
[/duo]\n## Pourquoi le corten coule au début (et pourquoi ça s'arrête)`;
  content = replaceOnce(content, oldHero, newHero, 'tachescorten/hero');

  // Insertion #2 : prompt 3 (nettoyage acide oxalique) — section nettoyage
  const oldNet = `Si les coulures ont déjà taché votre terrasse, ne paniquez pas : il existe des méthodes qui marchent par type de surface. Plus la tache est **fraîche**, plus le nettoyage est facile — agissez dans les jours qui suivent l'apparition pour maximiser vos chances.`;
  const newNet = `[duo image="/blog/brasero-corten-taches-terrasse-solutions_prompt_3.webp" pos="left" alt="Nettoyage d'une tache de rouille sur dalle claire avec brosse à poils durs et acide oxalique"]
**Les bons gestes, par type de surface**

Une tache de rouille fraîche se nettoie en 30 minutes avec les bons produits. Une tache de plusieurs mois demande parfois un traitement plus appuyé — mais aucune n'est définitive. La clé : agir vite, choisir la bonne méthode pour votre surface, et tester avant de généraliser.
[/duo]

Si les coulures ont déjà taché votre terrasse, ne paniquez pas : il existe des méthodes qui marchent par type de surface. Plus la tache est **fraîche**, plus le nettoyage est facile — agissez dans les jours qui suivent l'apparition pour maximiser vos chances.`;
  content = replaceOnce(content, oldNet, newNet, 'tachescorten/nettoyage');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 2 blocs [duo] insérés`);
}

// ─── 4. preparer-brasero-hiver-hivernage ──────────────────────────
{
  const slug = 'preparer-brasero-hiver-hivernage';
  let content = await getContent(slug);

  // Insertion #1 : prompt 1 (brasero givré) — avant 1er H2
  const oldHero = `\n## Est-ce qu'un brasero peut rester dehors en hiver ?`;
  const newHero = `\n[duo image="/blog/preparer-brasero-hiver-hivernage_prompt_1.webp" pos="right" alt="Brasero corten couvert d'une légère couche de givre matinal sur terrasse de campagne en hiver"]
**Le brasero face à l'hiver**

Un brasero artisanal en acier épais est conçu pour vivre dehors toute l'année. Mais entre "vivre dehors" et "passer l'hiver intact", il y a quatre gestes simples qui font toute la différence — et qui prennent moins de trente minutes à exécuter.
[/duo]\n## Est-ce qu'un brasero peut rester dehors en hiver ?`;
  content = replaceOnce(content, oldHero, newHero, 'hivernage/hero');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 1 bloc [duo] inséré`);
}

// ─── 5. pourquoi-brasero-artisanal-francais : ajout du prompt 1 ──
// La photo a un nom à espaces : "pourquoi-brasero-artisanal-francais prompt 1.webp"
{
  const slug = 'pourquoi-brasero-artisanal-francais';
  let content = await getContent(slug);

  // Insertion : prompt 1 (close-up acier 3 mm) — section "L'épaisseur d'acier"
  const oldEpais = `C'est le premier critère, le plus simple à mesurer, et celui qui sépare le plus radicalement un objet jetable d'un objet durable.`;
  const newEpais = `[duo image="/blog/pourquoi-brasero-artisanal-francais prompt 1.webp" pos="left" alt="Close-up macro sur la coupe d'une tôle d'acier de 3 mm dans un atelier de ferronnerie français"]
**Le premier critère qui se voit**

L'épaisseur d'acier d'un brasero ne se voit pas sur une photo de catalogue. Mais elle se voit dès qu'on prend la pièce en main, qu'on la pose sur la table, qu'on la frappe du doigt. Trois millimètres contre un — c'est cinq fois plus de matière, et cent fois plus de durabilité.
[/duo]

C'est le premier critère, le plus simple à mesurer, et celui qui sépare le plus radicalement un objet jetable d'un objet durable.`;
  content = replaceOnce(content, oldEpais, newEpais, 'pourquoi/epaisseur');

  await setContent(slug, content);
  console.log(`✓ ${slug} : 1 bloc [duo] (prompt 1) inséré`);
}

console.log('\n✅ Lot 3 terminé. 10 nouveaux blocs [duo] au total.');
