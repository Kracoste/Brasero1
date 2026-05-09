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

const content = `Le brasero plancha est devenu en dix ans **l'équipement star** de la cuisine extérieure française. Il a remplacé le barbecue à charbon dans des centaines de jardins, transformé l'usage des terrasses, redonné goût à la cuisine au feu de bois, et créé un nouveau marché — celui de l'artisanat français haut de gamme dans le mobilier d'extérieur. Mais entre les modèles importés à 200 € en grande surface et les braseros artisanaux à 2 500 €, comment s'y retrouver ? Et surtout, comment **bien choisir** pour ne pas se retrouver avec un objet qui se déforme à la troisième chauffe ou qu'on n'utilise jamais parce qu'il ne correspond pas à son vrai usage ?

> Le brasero plancha n'est pas un barbecue plus grand. C'est une autre façon de cuisiner, et une autre façon de recevoir. À condition de bien le choisir, il devient le cœur d'une vraie pièce à vivre extérieure pour vingt ans.

Cet article est le **guide ultime** du brasero plancha — la page de référence qui donne une vue d'ensemble de tous les sujets qui comptent (choix, usage, entretien, prix, sécurité, aménagement) et qui pointe vers nos guides spécialisés dès qu'un sujet mérite d'être approfondi en détail. Il est rédigé par Hugo, artisan fabricant de braseros plancha en Deux-Sèvres depuis cinq ans, sur la base de centaines de commandes, de retours clients et de prestations événementielles. C'est tout ce que j'aurais voulu lire avant d'acheter mon premier brasero — vu de l'intérieur de la filière.

[duo image="/blog/premier-brasero-guide-debutant_prompt_3.webp" pos="right" alt="Trois braseros artisanaux français côte à côte sur une terrasse en pierre : Coffy 50 cm, Le Fermier corten et L'Obélix 80 cm"]
**Trois formats, une même philosophie**

Coffy 50, Fermier corten, Obélix 80 : trois braseros qui couvrent l'essentiel des usages domestiques en France. Même fabrication artisanale, même acier épais, même conception ergonomique. Ce qui change : la taille, le matériau de cuve, la finition. Le reste de cet article vous aide à choisir lequel correspond à votre projet.
[/duo]

---

## Qu'est-ce qu'un brasero plancha exactement ?

Un brasero plancha, c'est un foyer en acier ouvert au feu de bois, surmonté d'une **plaque de cuisson en couronne** (la plancha) qui chauffe par conduction grâce aux flammes et aux braises du dessous. La plancha est circulaire, posée sur le haut du foyer, et entoure un orifice central qui laisse les flammes monter — ce qui crée naturellement plusieurs zones de température sur la même plaque.

### Ce qui le distingue d'un brasero décoratif

Un brasero décoratif (foyer en acier ouvert sans plancha) sert à **chauffer et créer une ambiance**, mais ne permet pas de cuisiner correctement — pas de surface plane, pas de zones thermiques exploitables, contact direct avec les flammes. Le brasero plancha **ajoute la dimension culinaire** au foyer ouvert : on cuisine **dessus**, pas dedans, sur une vraie surface de cuisson en acier épais.

### Ce qui le distingue d'un barbecue traditionnel

Sur un barbecue, la cuisson se fait **sur une grille** au-dessus du feu : graisses qui tombent dans les braises, flammes parasites, petits aliments qui passent à travers, chaleur uniforme. Sur un brasero plancha, la cuisson se fait **sur une surface continue d'acier** chauffée par conduction : pas de flamme parasite, tous les aliments sont cuisinables (œufs, fromages, légumes émincés inclus), zones thermiques distinctes (saisie au centre, cuisson douce au bord), gestion fine de la température. Pour le détail complet du comparatif, voir [brasero plancha vs barbecue traditionnel](/blog/brasero-plancha-vs-barbecue).

[chiffre]365 jours / an|c'est l'usage potentiel d'un brasero plancha — cuisson l'été, chauffage extérieur l'hiver[/chiffre]

## Pourquoi le brasero plancha cartonne en France

Cinq raisons cumulatives expliquent l'essor du brasero plancha depuis 2018-2020.

### 1. La convivialité du feu

Le feu **fixe le regard, calme le rythme respiratoire, rassemble les corps**. C'est un réflexe millénaire que des études en chronopsychologie ont objectivement mesuré. Une soirée autour d'un brasero ne se compare pas à une soirée autour d'une plancha à gaz ou d'un four électrique — l'objet **active des circuits émotionnels** qui transforment l'expérience.

### 2. La polyvalence de cuisson

Un brasero plancha **remplace plusieurs équipements** : barbecue (saisies fortes), plancha à gaz (poissons, légumes), plaque grill (brochettes, marquage), four à pizza (cuissons à haute température). Un seul poste, des dizaines de techniques de cuisson différentes — du carpaccio chaud à la côte de bœuf maturée en passant par les Saint-Jacques caramélisées.

### 3. L'usage 365 jours par an

Contrairement au barbecue à charbon qui dort sous bâche d'octobre à avril, un brasero plancha s'utilise **toute l'année**. La chaleur radiante du foyer chauffe les invités à 3-5 mètres de distance, ce qui rend l'usage hivernal pertinent. Voir [utiliser son brasero en hiver](/blog/brasero-hiver-cuisiner-chauffer-dehors) pour le détail de cet usage spécifique.

### 4. La durabilité d'un investissement à vie

Un brasero artisanal français bien fabriqué (acier 3 mm, soudures à la main, finition corten ou peinture haute température) **dure plusieurs décennies** sans intervention majeure. Ce n'est pas un consommable qui se renouvelle tous les 3-5 ans comme un barbecue d'entrée de gamme — c'est un objet qu'on garde et qu'on transmet.

### 5. La signature "made in France" qui résonne

Dans un marché saturé de produits importés, le brasero artisanal français est **un objet de provenance claire**, fabriqué à la main par des soudeurs qualifiés dans des ateliers identifiables. C'est un argument qui parle à une partie croissante des consommateurs français — voir [pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais).

## Choisir son brasero : les 5 critères qui comptent

Le choix d'un brasero se joue sur cinq critères dans cet ordre de priorité. Commencez par le diamètre, finissez par les détails de finition.

### Critère 1 — Le diamètre selon vos convives

C'est **le critère décisif**. Trois formats standards couvrent l'essentiel des usages :

- **50 cm** : 2-4 convives, balcons et petites terrasses
- **80 cm** : 6-8 convives, format polyvalent le plus vendu
- **100 cm** : 10-12 convives, grandes tablées et professionnels

Pour le détail des capacités réelles par diamètre, le tableau de décision et les conseils par profil, voir [quel brasero choisir selon le nombre de convives](/blog/quel-brasero-choisir-nombre-convives).

### Critère 2 — Le matériau de cuve

Deux options principales en artisanat français :

**Acier corten autopatinable** : développe naturellement une patine brun-orangée évolutive, ne demande aucun entretien, vit dehors toute l'année. Idéal pour jardins naturels, terrasses pierre, esprit brut. Voir [le pivot complet acier corten](/blog/brasero-corten-avantages-inconvenients).

**Acier peint thermolaqué** (généralement noir mat) : aspect immédiatement définitif, intégration urbaine et contemporaine, demande des retouches ponctuelles dans le temps mais reste impeccable plusieurs décennies bien entretenu.

Le corten est un **choix de vie** ("je veux un objet qui mûrit"), l'acier peint est un **choix d'esthétique constante** ("je veux que ça reste comme au jour 1").

### Critère 3 — Le matériau de plancha

Sur la plancha elle-même (la couronne où vous cuisinez), deux options :

**Inox 10 mm** : ne rouille pas, aucun culottage à entretenir, nettoyage facile, performance constante. Le choix de la **tranquillité**. Voir [entretien d'une plancha inox](/blog/entretien-plancha-inox-brasero).

**Acier carbone 8 mm** : se culotte au fil des cuissons (couche antiadhérente naturelle), conductivité thermique supérieure, croûte de Maillard plus marquée, demande un entretien systématique de 2 minutes après chaque service. Le choix de la **performance et de la patine**. Voir [comment culotter une plancha en acier carbone](/blog/comment-culotter-plancha-acier-carbone).

Pour le comparatif complet et le test décisionnel, voir [plancha inox ou acier carbone](/blog/plancha-inox-ou-acier-carbone).

### Critère 4 — L'épaisseur d'acier (la fondation)

C'est le critère **technique** qui sépare un objet jetable d'un objet durable.

| Épaisseur acier | Comportement | Durée de vie |
|---|---|---|
| 1-1,5 mm (industriel bas de gamme) | Se déforme dès les premières chauffes | 1-3 saisons |
| 2-3 mm | Tient correctement sans excès | 5-10 ans |
| **3 mm + (artisanal)** | **Indéformable, soudures qui tiennent** | **20-30+ ans** |

Notre standard atelier : **3 mm sur le bol et le socle, 8-10 mm sur la plancha**. C'est ce qui permet à nos braseros de dépasser largement la durée de vie d'un brasero importé. Voir [pourquoi un brasero artisanal coûte ce qu'il coûte](/blog/prix-brasero-artisanal-decryptage) pour la décomposition complète.

### Critère 5 — Les soudures et la fabrication

Détail invisible mais décisif. Sur un brasero artisanal, **chaque soudure est faite à la main**, généralement en TIG (gaz inerte tungstène) pour les jonctions visibles, qui offre une **pénétration totale** et zéro porosité. Sur un brasero industriel, les soudures sont **robotisées et superficielles** — ce sont les premières à céder en usage répété. Toujours vérifier la qualité des soudures sur les photos produit, ou lors d'une visite atelier si possible.

[atelier]
**Le geste de l'artisan**
Le test que je fais sur chaque brasero qui sort de l'atelier : un coup sec à la **paume de la main** sur le bol et la plancha pour écouter le son. Un acier épais correctement soudé sonne **plein, mat, sourd** — comme une cloche bien fondue. Un acier mince ou mal soudé sonne **cliquetant, métallique, presque grêle**. Si vous pouvez tester avant achat, ce simple geste vous renseigne instantanément sur la qualité de fabrication. Aucune fiche produit ne le mentionne, mais c'est l'un des indicateurs les plus fiables.
[/atelier]

## L'usage : allumage, gestion du feu, cuissons

Une fois le brasero choisi, encore faut-il savoir s'en servir. La courbe d'apprentissage est rapide (3-5 sessions pour les bases) mais demande de comprendre quelques principes.

### Le premier feu : un rituel technique

Le premier feu d'un brasero artisanal n'est pas un simple feu de camp. C'est un **rituel de rodage** qui conditionne la durée de vie de l'acier et la qualité de toutes les cuissons à venir. Méthode upside-down, montée progressive en température, première chauffe contrôlée — voir [premier feu et rodage de votre brasero](/blog/premier-feu-rodage-brasero) pour la procédure complète étape par étape.

### Le bois : combustible décisif

Le bois que vous mettez dans votre brasero détermine la **qualité des braises**, la **durée de chaleur exploitable**, et même le **goût des aliments**. Cinq essences fonctionnent bien (chêne, hêtre, charme, frêne, bois densifié), trois sont à proscrire absolument (résineux, bois humide, bois traité). Voir [quel bois pour votre brasero](/blog/meilleur-bois-brasero-comparatif) pour le comparatif complet.

### Maîtriser la température

Sur un brasero plancha, la température ne se règle pas avec un bouton — elle se **pilote** avec du bois et avec la position des aliments sur la plancha. Trois zones thermiques distinctes (centre 350 °C, anneau 250 °C, bord 150 °C) permettent de saisir, cuire et reposer **sur la même surface**. Voir [maîtriser la température sur un brasero plancha](/blog/temperature-cuisson-brasero-plancha) pour le pilotage complet.

### La science derrière le goût

Pourquoi une côte de bœuf au brasero a-t-elle un goût qu'aucune plancha électrique ne peut reproduire ? La réponse est scientifique : **réaction de Maillard amplifiée**, **bain de phénols et furanes** issus de la combustion du bois, **rayonnement infrarouge** spécifique des braises. Voir [la science du goût fumé sur plancha](/blog/cuisson-feu-bois-gout-fume-plancha) pour la chimie complète.

## Cuisiner au brasero : 4 grandes familles de cuissons

Le brasero plancha permet une gamme étonnamment large de cuissons. Voici les quatre grandes familles avec leurs articles dédiés.

### Les viandes rouges

Côtes de bœuf maturées, entrecôtes, magrets de canard, gigots d'agneau, tomahawks — les viandes rouges sont **la cuisine de prédilection** du brasero. Saisie au centre, finition à l'anneau, repos au bord : le triptyque qui transforme chaque pièce en grande viande. Pour les recettes pas-à-pas avec temps de cuisson précis, voir [viandes rouges au brasero plancha — 8 recettes](/blog/recettes-viandes-rouges-brasero-plancha).

### Les cuissons délicates : poissons et légumes

Le brasero n'est pas réservé aux côtes de bœuf. Saint-Jacques caramélisées, dorade entière, asperges grillées, fruits caramélisés, fromage halloumi : la plancha permet des **cuissons fines** que la grille rendrait impossibles. Voir [légumes et poissons au brasero plancha — les cuissons délicates](/blog/legumes-poissons-brasero-plancha-cuissons-delicates) pour le guide chef complet.

### Les apéritifs et entrées

Bruschettas chaudes, gambas flambées au pastis, brochettes mini-chorizo, mini-burgers, carpaccio chaud, fromages grillés — le brasero excelle aussi dans les **petites pièces d'apéritif** servies au fil de l'arrivée des invités. C'est la cuisine "ouverte" par excellence où l'on grignote au fur et à mesure de la soirée.

### Les desserts au feu de bois

Souvent oubliés, les desserts au brasero offrent un final spectaculaire : ananas flambé au rhum, pêches caramélisées, bananes au cognac, camembert grillé. La caramélisation des sucres au contact de la plancha chaude développe un profil aromatique unique, impossible à reproduire en cuisine intérieure.

## Entretien : les gestes qui font durer 20 ans

Un brasero artisanal bien entretenu dépasse largement les 20 ans de service. Voici les quatre piliers de cet entretien.

### Plancha inox : le rituel des 3 minutes

Après chaque cuisson : raclette à chaud, déglaçage à l'eau chaude, essuyage immédiat. Trois minutes, trois gestes, jamais de produit chimique. Voir [entretien d'une plancha inox](/blog/entretien-plancha-inox-brasero).

### Plancha acier carbone : le culottage qui se construit

Différent de l'inox : huilage systématique après chaque cuisson, jamais de savon, paille de fer en cas de rouille superficielle uniquement. La plancha développe une patine antiadhérente qui se bonifie au fil des années. Voir [comment culotter une plancha en acier carbone](/blog/comment-culotter-plancha-acier-carbone).

### Hivernage : protéger pendant la saison froide

Quatre étapes simples (nettoyage de fin de saison, protection plancha selon matériau, protection socle si peint, housse respirante adaptée) prennent 30 minutes une fois par an et garantissent un brasero impeccable au printemps. Voir [hivernage du brasero — guide complet](/blog/preparer-brasero-hiver-hivernage).

### L'alternative : utiliser activement en hiver

Pour ceux qui ne veulent pas remiser leur brasero, l'usage hivernal actif est une vraie option : cuisson par grand froid, chauffage radiant pour la terrasse, soirées d'hiver autour du foyer. Voir [utiliser son brasero en hiver](/blog/brasero-hiver-cuisiner-chauffer-dehors).

## Sécurité, réglementation, installation

Un brasero plancha est un objet qui produit du feu — quelques règles de sécurité et de réglementation s'appliquent.

### Distances de sécurité générales

| Direction | Distance minimale |
|---|---|
| Aérien (parasol, store, pergola) | 2 m |
| Latéral (mobilier, plantes) | 1 m |
| Façade de maison | 1,5 m |
| Auvent fermé | À proscrire totalement |
| Branches d'arbre | 3 m |

Pour le détail réglementaire complet (arrêtés préfectoraux, distances voisinage, PLU, troubles de voisinage, ERP), voir [distances de sécurité brasero — la réglementation française](/blog/distance-securite-brasero-reglementation).

### Cas particulier : la terrasse en bois

Trois risques techniques à neutraliser : la chaleur rayonnante, le poids (jusqu'à 155 kg), les projections d'étincelles. Avec une protection passive adaptée (tapis ignifugé, plaque, dalles foncées) et un placement réfléchi, le brasero sur terrasse bois est parfaitement compatible. Voir [installer un brasero sur une terrasse en bois](/blog/brasero-terrasse-bois-securite).

### Pour les pros : les obligations ERP

En restauration, événementiel ou ERP, des règles supplémentaires s'appliquent (distance public 2 m minimum, sol incombustible, extincteur de proximité, déclaration en mairie, RC Pro adaptée). Voir [brasero pour restaurateur](/blog/choisir-brasero-restaurateur-professionnel) et [brasero événement et mariage](/blog/brasero-evenement-mariage-reception).

## Le prix : ce qui justifie l'écart entre 200 € et 2 500 €

L'écart de prix entre un brasero importé d'entrée de gamme et un brasero artisanal français premium peut atteindre **un facteur 12**. Ce n'est pas du marketing — ce sont des différences réelles d'épaisseur d'acier, de qualité de soudure, de durée de vie, de SAV et de fabrication française. Voir le décryptage complet matière par matière, geste par geste, dans [combien coûte un vrai brasero artisanal](/blog/prix-brasero-artisanal-decryptage).

Et pour comprendre **ce que vous achetez vraiment** au-delà de l'objet (savoir-faire, emploi local, durabilité, transmission), voir [pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais).

## Aménager un coin brasero : créer une vraie pièce à vivre

Un brasero ne s'installe pas dans un coin perdu du jardin. Il devient le **point focal d'une vraie pièce à vivre extérieure** qui s'organise autour : sol défini (gravier, dalles, pierre), salon de jardin en arc de cercle, éclairage doux, table à proximité, végétation structurante, rangement bois mis en scène. Construit par étapes sur 2-3 saisons, c'est un projet d'aménagement à part entière. Voir [aménager un coin brasero — créer une vraie pièce à vivre extérieure](/blog/amenager-coin-brasero-jardin) pour le guide complet avec mobilier, marques recommandées et plan en 3 ans.

## Le brasero pour les pros

Au-delà de l'usage domestique, le brasero plancha s'est imposé en restauration, événementiel et hôtellerie haut de gamme.

### En restauration permanente

Bistronomie, brasserie premium, food truck, guinguette saisonnière, restaurant gastronomique : le brasero pro demande des choix spécifiques (épaisseur d'acier renforcée, ergonomie d'équipe, conformité ERP, gestion du feu en service intensif). Voir [brasero pour restaurateur — guide complet](/blog/choisir-brasero-restaurateur-professionnel).

### En événementiel

Mariages, soirées privées, anniversaires d'adultes, galas d'entreprise, prestations nomades sur remorque homologuée : le brasero événementiel transforme une réception en souvenir collectif. Voir [brasero pour mariage et événement — la cuisine face public](/blog/brasero-evenement-mariage-reception).

[atelier]
**Pourquoi je fabrique des braseros**
On me demande souvent pourquoi j'ai monté cet atelier en Deux-Sèvres plutôt que de continuer dans la métallurgie classique. La réponse honnête : parce que j'aime fabriquer des objets qui **dureront plus longtemps que moi**. Un brasero soudé correctement, en acier de 3 mm, peut tenir 30, 40, 50 ans. Il sera transmis aux enfants des clients qui l'ont acheté. Il fera vivre des soirées de famille pendant des décennies. C'est un type d'objet qu'on ne fabrique presque plus dans la France de 2026 — l'industrie a basculé sur du jetable rapide. À l'atelier, on fait l'inverse, à contre-courant. C'est ce qui rend le métier valable à mes yeux.
[/atelier]

## FAQ : les questions qu'on me pose tous les jours

### Puis-je utiliser du charbon au lieu du bois ?

Non. Le brasero plancha est conçu pour le **feu de bois** (température, convection, profil aromatique). Le charbon génère trop de chaleur ponctuelle et pas assez de flamme dynamique. Réservez-le aux barbecues à grille classiques.

### Quel bois utiliser ?

**Bois dur et sec uniquement** : chêne, hêtre, charme, frêne. Évitez résineux (pin, sapin) qui projettent des étincelles et encrassent. Bois humide = fumée + mauvaise cuisson + créosote dans le foyer. Séchage minimum : 18-24 mois. Voir [le guide complet des bois](/blog/meilleur-bois-brasero-comparatif).

### Combien de temps dure une cuisson ?

Comptez 2-3 h de session : 25-35 min d'allumage et montée en température, 1 h 30 - 2 h de cuisson active sur braises stables, puis foyer rougeoyant pour prolonger la soirée.

### Plancha inox ou acier carbone ?

**Carbone** pour la cuisson pure (meilleure conduction, croûte plus marquée). **Inox** pour la tranquillité (zéro entretien, zéro rouille). Voir [le comparatif complet](/blog/plancha-inox-ou-acier-carbone) pour le test décisionnel personnalisé.

### Combien de bois consommé par session ?

Environ **5-8 kg** pour une session de 2 h sur un 80 cm avec 6-8 personnes. **8-12 kg** pour un 100 cm. Prévoyez une réserve sèche à proximité.

### Peut-on l'installer sur une terrasse en bois ?

Oui avec une protection passive adaptée (tapis ignifugé, plaque, dalles foncées). Voir [le guide dédié terrasse bois](/blog/brasero-terrasse-bois-securite).

### Le brasero corten va-t-il tacher ma terrasse claire ?

Pendant 4-8 semaines (phase de patinage), oui — coulures de rouille possibles. Après stabilisation de la patine, plus de coulures du tout. Voir [taches de rouille brasero corten — solutions](/blog/brasero-corten-taches-terrasse-solutions).

### Combien dure un brasero artisanal ?

20 à 30 ans en usage domestique normal. 10 à 15 ans en usage professionnel intensif. Sans aucune intervention majeure si l'entretien est respecté.

### Le brasero peut-il rester dehors en hiver ?

Oui — c'est même pour ça qu'il est conçu. Un hivernage simple (30 minutes une fois par an) suffit. Voir [hivernage du brasero](/blog/preparer-brasero-hiver-hivernage). Ou bien, on peut continuer à l'utiliser activement toute la saison froide — voir [utiliser son brasero en hiver](/blog/brasero-hiver-cuisiner-chauffer-dehors).

### Pourquoi acheter français plutôt qu'importer ?

Acier épais réel, soudures à la main, fabrication identifiable, SAV direct, durée de vie 4 à 10 fois supérieure, savoir-faire transmis. Voir [pourquoi un brasero artisanal français](/blog/pourquoi-brasero-artisanal-francais).

## Le mot d'artisan

Un brasero plancha, c'est un objet qui peut vous accompagner **vingt ans, peut-être plus**, transformer votre façon de cuisiner, et devenir le cœur de votre jardin. Mais c'est aussi un marché où le marketing prend souvent le pas sur la qualité réelle, et où il est facile de se tromper si on n'a pas les repères.

Si vous devez retenir trois choses de ce guide :

1. **L'épaisseur d'acier prime sur tout le reste**. Visez 3 mm minimum sur le bol, 8-10 mm sur la plancha.
2. **Un fabricant français artisanal** coûte plus cher à l'achat mais offre une durée de vie qui transforme l'arithmétique sur 20 ans — et il **répare** quand quelque chose dysfonctionne.
3. **Un brasero bien entretenu dure 20 ans**. Huilez après chaque usage si plancha carbone, hivernez correctement, patientez sur la patine corten. Le reste se fait tout seul.

Si ce guide vous a été utile, je vous invite à découvrir nos modèles fabriqués à la main dans notre atelier de Moncoutant (Deux-Sèvres). Chaque brasero est réalisé en acier 3 mm et plus, soudé en TIG, et testé avant expédition. Nous sommes joignables si vous avez des questions techniques avant achat — c'est exactement le genre d'échange qu'on adore avoir.

---

## Approfondir par sujet

**🔥 Choisir son brasero**
- [Quel brasero choisir selon le nombre de convives](/blog/quel-brasero-choisir-nombre-convives)
- [Plancha inox ou acier carbone : quel matériau choisir](/blog/plancha-inox-ou-acier-carbone)
- [Brasero corten : avantages, inconvénients et retour d'expérience](/blog/brasero-corten-avantages-inconvenients)
- [Acheter son premier brasero : le guide du débutant](/blog/premier-brasero-guide-debutant)
- [Pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais)
- [Combien coûte un vrai brasero artisanal ? La transparence sur les prix](/blog/prix-brasero-artisanal-decryptage)

**🍖 Cuisiner au brasero**
- [Premier feu : le rituel d'allumage et de rodage](/blog/premier-feu-rodage-brasero)
- [Maîtriser la température sur un brasero plancha](/blog/temperature-cuisson-brasero-plancha)
- [Quel bois pour votre brasero : les 5 meilleures essences](/blog/meilleur-bois-brasero-comparatif)
- [Cuisson au feu de bois : la science du goût fumé sur plancha](/blog/cuisson-feu-bois-gout-fume-plancha)
- [Viandes rouges au brasero plancha : 8 recettes](/blog/recettes-viandes-rouges-brasero-plancha)
- [Légumes et poissons au brasero plancha : les cuissons délicates](/blog/legumes-poissons-brasero-plancha-cuissons-delicates)

**🛠️ Entretenir et faire durer**
- [Comment culotter une plancha en acier carbone](/blog/comment-culotter-plancha-acier-carbone)
- [Entretien d'une plancha inox de brasero](/blog/entretien-plancha-inox-brasero)
- [Hivernage du brasero : ranger et protéger](/blog/preparer-brasero-hiver-hivernage)
- [Utiliser son brasero en hiver : cuisiner et chauffer](/blog/brasero-hiver-cuisiner-chauffer-dehors)
- [Brasero corten et taches de rouille : protéger sa terrasse](/blog/brasero-corten-taches-terrasse-solutions)
- [Brasero corten en bord de mer : tient-il l'air salin ?](/blog/brasero-corten-bord-mer-air-salin)

**🔒 Sécurité et installation**
- [Distances de sécurité brasero : la réglementation française](/blog/distance-securite-brasero-reglementation)
- [Installer un brasero sur une terrasse en bois](/blog/brasero-terrasse-bois-securite)

**🪑 Aménager et recevoir**
- [Aménager un coin brasero : créer une vraie pièce à vivre](/blog/amenager-coin-brasero-jardin)

**👨‍🍳 Pour les pros**
- [Brasero pour restaurateur : guide professionnel complet](/blog/choisir-brasero-restaurateur-professionnel)
- [Brasero pour mariage et événement : la cuisine face public](/blog/brasero-evenement-mariage-reception)

**📊 Comparatifs**
- [Brasero plancha vs barbecue traditionnel](/blog/brasero-plancha-vs-barbecue)
- [Brasero ou plancha électrique : pourquoi le feu de bois change tout](/blog/brasero-vs-plancha-electrique)`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Brasero plancha : le guide ultime pour choisir, utiliser et entretenir (par un artisan français)",
    meta_title: "Brasero plancha : guide ultime 2026 (par un artisan français)",
    meta_description: "Le guide complet du brasero plancha : choisir le bon modèle, maîtriser la cuisson au feu de bois, entretenir pour 20 ans, comprendre les prix. Rédigé par Hugo, artisan fabricant français à Moncoutant.",
    excerpt: "Le guide le plus complet du web francophone sur le brasero plancha, rédigé par un artisan fabricant français. Choix du modèle, cuisson, entretien, prix, sécurité, aménagement : tout ce qu'il faut savoir avant et après l'achat.",
    content,
    read_time: 16,
    tags: ['brasero', 'plancha', 'guide', 'artisan', 'made in france', 'pillar', 'ressource'],
    related_articles: [
      'pourquoi-brasero-artisanal-francais',
      'quel-brasero-choisir-nombre-convives',
      'plancha-inox-ou-acier-carbone',
      'brasero-corten-avantages-inconvenients',
    ],
    related_products: ['brasero-acier-100-l-obelix', 'le-fermier', 'brasero-en-acier-80-lemorris', 'brasero-coffy-80'],
    cta_product_slug: 'brasero-acier-100-l-obelix',
    cta_text: 'Voir nos braseros',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'guide-ultime-brasero-plancha');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ guide-ultime-brasero-plancha (PILLAR) réécrit`);
console.log(`  Mots: ~${wordCount}`);
