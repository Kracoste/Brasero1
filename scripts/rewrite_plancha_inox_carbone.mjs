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

const content = `Vous avez choisi votre brasero. Vous avez tranché sur le diamètre, sur le matériau du socle, sur la finition. Reste la dernière question, et probablement la plus structurante pour votre expérience de cuisinier au quotidien : la plancha sera-t-elle en **inox** ou en **acier carbone** ? La réponse à cette question va déterminer la manière dont vous saisirez vos viandes pendant les vingt prochaines années — et le rituel d'entretien que vous accepterez ou non d'adopter après chaque cuisson.

> L'acier carbone est exigeant et récompense l'entretien. L'inox est facile et pardonne tout. Ce ne sont pas deux niveaux de qualité — ce sont deux philosophies de cuisson.

Cet article compare les deux matériaux disponibles pour les planchas de nos braseros, point par point. Pas de hiérarchie absolue, pas de "meilleur" universel : la bonne plancha pour vous dépend de votre profil de cuisinier, de la fréquence de vos cuissons, et de votre rapport à l'entretien d'un outil.

---

## Deux matériaux, deux philosophies de cuisson

Quand vous choisissez un brasero plancha de l'Atelier LBF, deux options de plancha vous sont proposées : **inox** (acier inoxydable de 10 mm d'épaisseur) et **acier carbone** (8 mm d'épaisseur). Les deux sont fabriqués en France, soudés à la main, et conçus pour la cuisson au feu de bois sur foyer ouvert. Mais leur **comportement en cuisine** diffère sensiblement, et ce sont ces différences qui vont guider votre choix.

L'**acier carbone** est le matériau historique des planchas professionnelles et des poêles de chef. Conducteur, réactif, il développe au fil des cuissons une patine noire — le **culottage** — qui transforme la surface en outil quasi antiadhérent. C'est un matériau qui se mérite et qui se bonifie.

L'**inox** est le matériau de la simplicité. Il ne rouille pas, il ne demande pas de culottage, il se nettoie à l'eau sans précaution. Il saisit très bien, mais sans la signature thermique de l'acier carbone. C'est un matériau qui n'exige rien de vous.

## L'acier carbone : la saisie avant tout

L'acier carbone est probablement le matériau **le plus utilisé en cuisine professionnelle** dans le monde — woks chinois, poêles De Buyer, planchas de restaurant haut de gamme, plaques teppanyaki japonaises. Il y a une raison à cette domination : sa **conductivité thermique** est nettement supérieure à celle de l'inox, et la chaleur transite du foyer à l'aliment plus vite, plus uniformément, plus puissamment.

### Le culottage : un outil qui s'améliore avec le temps

Le vrai atout de l'acier carbone se révèle à l'usage. À chaque cuisson sur surface huilée, une fine couche de polymères de graisse — le **culottage** — se construit à la surface du métal. Cuisson après cuisson, cette patine noire s'épaissit, devient plus régulière, et finit par former un revêtement **antiadhérent naturel** qui n'a rien à envier aux meilleures poêles modernes.

Concrètement, après dix à quinze cuissons sur une plancha en acier carbone bien entretenue, vous pouvez saisir un poisson délicat ou un œuf au plat sans qu'ils n'accrochent. La saisie devient nette, le décollement se fait au moment exact que vous décidez, la croûte se forme en surface mais pas dans le métal. C'est un outil qui se construit avec vous.

Le culottage est un sujet à part entière, avec une méthode précise pour le démarrer et l'entretenir. Si vous voulez la procédure complète : [comment culotter une plancha en acier carbone — guide pas à pas](/blog/comment-culotter-plancha-acier-carbone).

### Saisie et réaction de Maillard

La conductivité thermique supérieure de l'acier carbone modifie la **vitesse à laquelle la réaction de Maillard se déclenche** — cette caramélisation des sucres et des protéines qui donne aux viandes grillées leur croûte dorée et leur arôme. Sur acier carbone, cette réaction démarre plus vite et se développe plus intensément qu'à température équivalente sur inox.

Le résultat à l'assiette : une **croûte plus marquée**, un goût plus prononcé, des contours plus nets. Pour les amateurs de saisie au feu de bois et les cuisiniers passionnés, c'est une différence sensible. Pour comprendre la chimie complète derrière ce phénomène, voir [la science du goût fumé sur plancha](/blog/cuisson-feu-bois-gout-fume-plancha).

### L'entretien : un rituel court mais non négociable

L'acier carbone demande un **geste après chaque cuisson** : racler à la spatule métallique pendant que la plancha est encore tiède, essuyer les résidus avec un chiffon en papier, repasser un chiffon légèrement huilé pour relancer la couche de protection. Cela prend deux minutes. Ce n'est pas négociable : un acier carbone laissé sans huile et exposé à l'humidité **rouille**.

C'est l'aspect le plus important à comprendre avant de choisir l'acier carbone. Si ce rituel de deux minutes vous semble pesant, choisissez l'inox sans hésiter — ce sera plus juste pour les deux parties.

[atelier]
**Le geste de l'artisan**
Les clients qui choisissent l'acier carbone sont en général des **cuisiniers passionnés** — gens qui ont déjà une poêle De Buyer dans la cuisine intérieure, qui aiment les outils qui se patinent, qui prennent plaisir au geste d'entretien. Le profil typique : utilisateur fréquent (au moins une fois par semaine en saison), curieux des techniques de saisie, à l'aise avec l'idée qu'un outil se "fait" plutôt qu'il ne s'achète. C'est aussi le matériau préféré des restaurateurs et des traiteurs qui équipent leur brasero de service.
[/atelier]

## L'inox : la tranquillité absolue

L'inox de 10 mm est l'autre option, et elle a ses propres qualités fortes — différentes mais réelles. La principale tient en une phrase : **l'inox ne rouille pas**.

### Aucun entretien spécifique

Après cuisson, un verre d'eau froide jeté sur la surface encore chaude (le choc thermique décolle les résidus), un coup de spatule, un chiffon, et c'est terminé. Pas besoin de huiler, pas de risque si la plancha reste sous la pluie pendant l'orage que vous n'avez pas vu arriver, pas de **culottage à entretenir** ni à reconstruire si jamais vous l'avez raté. C'est un matériau qui pardonne tout.

Pour la procédure complète d'entretien (lavage profond, traces tenaces, marques de chauffe), voir [l'entretien d'une plancha inox : la méthode complète](/blog/entretien-plancha-inox-brasero).

### Saisie correcte mais différente

L'inox de 10 mm — épaisseur que nous avons choisie spécifiquement pour compenser sa conductivité thermique inférieure — saisit très correctement. La masse importante du métal stocke beaucoup de chaleur, et une fois bien préchauffée, la plancha délivre une saisie franche sur viandes et poissons.

La **différence vs acier carbone** : la montée en température est plus progressive (5 à 10 minutes de plus pour atteindre la zone optimale), et la croûte de Maillard se forme moins agressivement. Pour la majorité des cuisiniers amateurs, cette différence est subtile et ne compromet pas le résultat. Pour les passionnés de saisie au feu de bois, elle reste perceptible.

### Une plancha qui reste constante

Là où l'acier carbone évolue, l'inox **reste constant**. La plancha que vous avez aujourd'hui ressemble à celle que vous aurez dans vingt ans — pas de patine, pas de teinte qui change, pas de surface qui se "fait". C'est un avantage si vous aimez la régularité et la prévisibilité ; c'est un inconvénient si vous appréciez l'idée d'un outil qui raconte une histoire.

[atelier]
**Le geste de l'artisan**
Les clients qui choisissent l'inox sont en général des **utilisateurs pragmatiques** — gens qui veulent un outil prêt à l'emploi sans rituel d'entretien, propriétaires de résidence secondaire qui n'utilisent leur brasero que de façon ponctuelle, ou simplement personnes qui préfèrent passer leur temps à cuisiner plutôt qu'à entretenir. Le profil typique : utilisateur occasionnel ou irrégulier, brasero qui reste dehors sans housse, exigence de zéro contrainte. L'inox n'est pas un choix par défaut — c'est un choix de tranquillité.
[/atelier]

## Le comparatif technique en un tableau

| Critère | Acier carbone (8 mm) | Inox (10 mm) |
|---|---|---|
| Conductivité thermique | Supérieure | Bonne |
| Vitesse de Maillard | Plus rapide, croûte plus marquée | Plus progressive, croûte moins agressive |
| Culottage | Oui, à construire et entretenir | Non, inutile |
| Antiadhérence | Excellente une fois culottée | Bonne (avec huile à la cuisson) |
| Risque de rouille | Réel si mal entretenu | Aucun |
| Entretien après cuisson | Spatule + chiffon huilé (2 min) | Coup d'eau + spatule (30 s) |
| Évolution dans le temps | S'améliore | Reste constant |
| Tolérance à l'oubli | Faible | Totale |
| Durée de vie | Plusieurs décennies (bien entretenue) | Plusieurs décennies (sans condition) |
| Prix relatif | Légèrement moins cher | Référence |

[chiffre]2 min vs 30 s|d'entretien après chaque cuisson — la vraie différence quotidienne[/chiffre]

## Comment choisir : le test des 5 questions

Plutôt qu'un score absolu, voici cinq questions concrètes qui vont trancher pour vous. Répondez honnêtement — il n'y a pas de bonne ou de mauvaise réponse.

- **À quelle fréquence prévoyez-vous d'utiliser votre brasero en saison ?**
  Plus d'une fois par semaine → acier carbone (le culottage se construit et s'entretient naturellement). Une fois par mois ou moins → inox (le culottage ne tiendrait pas avec une fréquence si basse).

- **Êtes-vous prêt à consacrer 2 minutes d'entretien après chaque cuisson, sans exception ?**
  Oui → acier carbone. Non, ou pas systématiquement → inox.

- **Votre brasero restera-t-il dehors sans housse pendant toute la saison ?**
  Oui → inox (l'acier carbone craindrait l'humidité prolongée). Non, il sera couvert ou rentré → acier carbone possible.

- **Aimez-vous l'idée d'un outil qui se patine et raconte votre usage au fil des années ?**
  Oui → acier carbone (la patine est exactement ça). Indifférent ou non → inox.

- **Êtes-vous prêt à accepter une croûte de Maillard légèrement moins marquée pour gagner en simplicité d'entretien ?**
  Oui → inox (le compromis est honnête). Non, la saisie passe avant tout → acier carbone.

Si vous avez répondu **trois fois ou plus en faveur de l'acier carbone** : prenez l'acier carbone. Si vous avez répondu **trois fois ou plus en faveur de l'inox** : prenez l'inox. Si c'est partagé, prenez l'**inox** — c'est le matériau qui pardonne le plus, et un acier carbone choisi par défaut sera frustrant.

## Mythes et idées reçues

Quelques affirmations qu'on entend régulièrement à l'atelier, et qui méritent d'être nuancées.

**"L'acier carbone, c'est forcément mieux pour saisir."**
Vrai dans l'absolu, sur la pure performance thermique. Faux en pratique si vous ne l'utilisez pas assez souvent pour maintenir le culottage : un acier carbone mal culotté est moins performant qu'un inox bien préchauffé. La constance d'usage compte plus que le matériau pris isolément.

**"L'inox ne sait pas saisir."**
Faux. L'inox de 10 mm que nous utilisons saisit très correctement, surtout après un préchauffage suffisamment long. La différence avec l'acier carbone existe, mais elle est de l'ordre du **détail gastronomique**, pas de la rupture qualitative. La majorité des cuisiniers amateurs ne la perçoivent pas en aveugle.

**"L'acier carbone, c'est compliqué et risqué."**
Faux. Le culottage demande deux minutes après chaque cuisson, et la procédure de premier culottage prend une demi-heure. Aucune compétence particulière n'est requise. La "complication" est plus une affaire de discipline (faire le geste systématiquement) que de difficulté technique.

**"L'inox demande zéro entretien."**
Faux à 100 %. L'inox demande un nettoyage après chaque cuisson — moins exigeant que le culottage, mais réel. Un inox abandonné sans nettoyage finit avec des traces de chauffe permanentes et des résidus carbonisés difficiles à enlever. Zéro entretien n'existe pas.

## Sur quels modèles ces options sont disponibles ?

Sur la majorité de notre gamme, les deux options sont proposées au choix lors de la commande. La structure du brasero est identique — même socle, mêmes dimensions, même fabrication française. Seul le matériau de la plancha change, et avec lui, votre style de cuisson.

[L'Obélix](/produits/brasero-acier-100-l-obelix) est disponible en plancha **acier carbone (8 mm)** ou **inox (10 mm)**, en diamètres 50, 80 et 100 cm — c'est notre modèle le plus polyvalent pour ce choix de matériau. [Le Coffy 80](/produits/brasero-coffy-80) est également proposé dans les deux configurations. Pour les modèles "premium" type [Le Fermier](/produits/le-fermier), c'est l'acier carbone qui est privilégié pour une cohérence avec l'esthétique générale du brasero, mais des configurations spéciales restent possibles.

Si vous hésitez encore après avoir lu cet article, le plus simple est de nous appeler ou de nous écrire — on vous orientera en fonction de votre profil de cuisinier réel, pas du matériau le plus cher ou le plus rentable.

---

## Pour aller plus loin

- [Comment culotter une plancha en acier carbone : guide pas à pas](/blog/comment-culotter-plancha-acier-carbone) — la méthode complète si vous choisissez l'acier carbone
- [Entretien d'une plancha inox : la méthode complète](/blog/entretien-plancha-inox-brasero) — tout savoir sur l'entretien si vous choisissez l'inox
- [Cuisson au feu de bois : la science du goût fumé sur plancha](/blog/cuisson-feu-bois-gout-fume-plancha) — la chimie de la cuisson sur plancha, indépendamment du matériau
- [Quel brasero choisir selon le nombre de convives](/blog/quel-brasero-choisir-nombre-convives) — pour boucler les choix : taille + matériau`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Plancha inox ou acier carbone : quel matériau choisir pour votre brasero ?",
    meta_title: "Plancha inox ou acier carbone : le comparatif (2026)",
    meta_description: "Inox ou acier carbone pour la plancha de votre brasero ? Conductivité, saisie, culottage, entretien, prix : le comparatif complet pour choisir le matériau adapté à votre style de cuisson.",
    excerpt: "Vous avez choisi votre brasero. Reste la dernière décision — la plancha sera-t-elle en inox ou en acier carbone ? Deux matériaux, deux philosophies de cuisson, deux profils d'entretien. Voici comment trancher.",
    content,
    read_time: 8,
    tags: ['plancha', 'inox', 'acier carbone', 'comparatif', 'matériau', 'guide d\'achat', 'culottage'],
    related_articles: [
      'comment-culotter-plancha-acier-carbone',
      'entretien-plancha-inox-brasero',
      'cuisson-feu-bois-gout-fume-plancha',
      'quel-brasero-choisir-nombre-convives',
    ],
    related_products: ['brasero-acier-100-l-obelix', 'brasero-coffy-80', 'brasero-en-acier-80-lemorris'],
    cta_product_slug: 'brasero-acier-100-l-obelix',
    cta_text: "Découvrir L'Obélix",
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'plancha-inox-ou-acier-carbone');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ plancha-inox-ou-acier-carbone réécrit`);
console.log(`  Mots: ~${wordCount}`);
