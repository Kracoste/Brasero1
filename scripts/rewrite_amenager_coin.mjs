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

// URLs des 7 photos existantes en Supabase storage
const IMG_FERMIER_GRAVIER = 'https://kxztmjqxsskvbqcohtgj.supabase.co/storage/v1/object/public/blog/1774519312609-blog_brasero_idee_creation_jardin_brasero_lefermier.webp';
const IMG_OBELIX_SALON = 'https://kxztmjqxsskvbqcohtgj.supabase.co/storage/v1/object/public/blog/1774519377006-blog_idee-salon_exterieur__brasero_lobelix.webp';
const IMG_COFFY_AMBIANCE = 'https://kxztmjqxsskvbqcohtgj.supabase.co/storage/v1/object/public/blog/1774519435413-blog_idee_salon_exterieur_brasero_le_coffy.webp';
const IMG_FERMIER_REPAS = 'https://kxztmjqxsskvbqcohtgj.supabase.co/storage/v1/object/public/blog/1774519490258-blog_salon_exterieur_idee_brasero_le_fermier.webp';
const IMG_OBELIX_AMIS = 'https://kxztmjqxsskvbqcohtgj.supabase.co/storage/v1/object/public/blog/1774519588899-blog_idee_salon_exterieur_brasero_lobelix.webp';
const IMG_MORRIS_BOIS = 'https://kxztmjqxsskvbqcohtgj.supabase.co/storage/v1/object/public/blog/1774519671798-blog_idee_jardin_exterieur_brasero_le_morris.webp';
const IMG_COFFY_SOL = 'https://kxztmjqxsskvbqcohtgj.supabase.co/storage/v1/object/public/blog/1774518167388-blog_idee_jardin_exterieur_brasero_le_coffy.webp';

const content = `Un brasero, ce n'est pas qu'un appareil de cuisson posé dans un coin du jardin. C'est l'**élément central** d'un véritable espace de vie extérieur — une pièce à vivre à part entière, où l'on cuisine, où l'on reçoit, où l'on prolonge la soirée bien après le repas. Et cet espace ne se crée pas en posant deux chaises à côté du brasero : il se conçoit, comme on conçoit un salon, en faisant dialoguer le mobilier, l'éclairage, le sol, la végétation, les matières.

> Une vraie pièce à vivre extérieure n'est pas un mobilier de jardin posé dans l'herbe. C'est un espace pensé, où chaque élément travaille avec les autres pour qu'on ait envie d'y rester.

Cet article est le **guide complet** pour transformer votre extérieur — terrasse, jardin, cour, ou même grand balcon — en véritable pièce à vivre autour d'un brasero. Sept idées concrètes (sol, salon de jardin, canapé d'extérieur, éclairage, table, végétation, rangement bois), un bonus sur les détails qui font la différence, des conseils sur le mobilier extérieur premium qui dure vraiment, et une méthode pour construire le projet par étapes plutôt que tout d'un coup.

---

## Repenser l'extérieur comme une vraie pièce à vivre

L'aménagement extérieur a profondément changé en France depuis dix ans. Le jardin "décoratif" — qu'on regarde par la fenêtre, qu'on tond le samedi, où l'on sort le mobilier de jardin uniquement pour les occasions — a cédé la place au jardin **habité**. On y mange, on y travaille parfois, on y reçoit, on y prolonge les soirées d'été. Le mobilier d'extérieur n'est plus une version réduite et fragile du mobilier intérieur : c'est devenu une catégorie à part entière, avec ses canapés résistants aux intempéries, ses salons de jardin haut de gamme conçus pour rester dehors toute l'année, ses tapis pensés pour résister aux UV.

Dans cette évolution, **le brasero a pris une place centrale**. Pas comme un simple barbecue qu'on range après usage, mais comme **point focal permanent** autour duquel s'organise tout le reste : on regarde le feu, on mange face au feu, on discute face au feu. Trois fonctions cohabitent dans cette pièce extérieure : **cuisiner**, **partager le repas**, **contempler**. Et le brasero les orchestre toutes les trois.

Le reste de l'article passe en revue les sept éléments à articuler pour créer cet espace.

## Le brasero comme point focal

Avant de parler mobilier, il faut comprendre **pourquoi le brasero attire**. C'est un réflexe millénaire : le feu **fixe le regard**, **calme le rythme respiratoire**, **rapproche les corps**. Des études en chronopsychologie l'ont mesuré — la simple présence d'un foyer visible diminue la tension artérielle et favorise les liens sociaux. C'est ce qui rend une soirée autour d'un brasero qualitativement différente d'un dîner sous une lumière électrique fixe.

[chiffre]3 à 4 m|le diamètre du cercle de vie qui se crée naturellement autour d'un brasero[/chiffre]

L'aménagement doit **amplifier** cette attraction, pas la concurrencer. Concrètement :

- Le brasero est **central** dans l'espace — pas relégué dans un coin
- Le mobilier converge **vers** le brasero, pas dos à lui
- L'éclairage d'ambiance reste **doux** pour ne pas écraser la lumière des flammes
- L'espace au sol est **dégagé** pour que l'on puisse circuler entre le feu et le mobilier

Ce sont les principes. Voyons maintenant les sept idées concrètes pour les mettre en œuvre.

## Idée 1 — Le cercle paysager au sol

[duo image="${IMG_FERMIER_GRAVIER}" pos="right" alt="Brasero Le Fermier en acier corten posé sur une terrasse de gravier clair, intégré dans un jardin paysager français"]
**Le sol qui définit l'espace**

Délimiter visuellement la zone du brasero, c'est la première étape pour la transformer en pièce à vivre. Un cercle de 3 à 4 mètres de diamètre, dans une matière différente du reste du jardin, suffit à créer cette identité spatiale. Le gravier reste la solution la plus simple, la plus sûre, et la plus belle.
[/duo]

Le **gravier** est ignifuge, absorbe les éventuelles cendres ou braises tombées, et crée une **séparation visuelle** nette avec le reste du jardin. Quelques règles de choix :

- **Gravier clair** (calcaire, marbre concassé) pour un contraste fort avec un [brasero corten](/blog/brasero-corten-avantages-inconvenients) brun-orangé
- **Gravier foncé** (ardoise concassée, basalte) pour un rendu sobre avec un brasero en acier peint noir
- **Granulométrie 8-16 mm** : assez fin pour être confortable au pied, assez gros pour ne pas s'incruster dans les chaussures

Pour l'accès depuis la terrasse principale ou la maison, prévoyez des **pas japonais** ou des **dalles de pierre** intégrées dans le gravier — vous évitez ainsi de marcher dans le gravier à chaque trajet.

**Alternatives au gravier** :
- **Dalles en pierre naturelle** (basalte, schiste, granit) en pose contiguë
- **Béton ciré ou béton brut** pour un rendu contemporain minimaliste
- **Mix gravier + grandes dalles** pour les coins brasero un peu plus structurés

## Idée 2 — Le salon de jardin en arc de cercle

[duo image="${IMG_OBELIX_SALON}" pos="left" alt="Salon d'extérieur avec canapé, fauteuils et brasero L'Obélix au centre — composition en arc de cercle ouvert"]
**Le salon qui regarde le feu**

Le mobilier du coin brasero ne doit pas être placé n'importe comment. L'arc de cercle ouvert — pas le cercle complet — est la disposition qui marche le mieux. Elle laisse un accès pour le cuisinier, crée une scène où chacun voit les autres, et place le brasero dans le rôle d'orateur silencieux.
[/duo]

Disposez les assises (canapé, banc, fauteuils, poufs) en **arc de cercle ouvert** autour du brasero, à **1,5 à 2 mètres** du foyer. L'arc est préférable au cercle fermé : il **laisse un accès dégagé** pour le cuisinier qui passe régulièrement entre la maison et le brasero, et il crée une scène plus naturelle — le brasero au centre, les convives face à face, sans personne qui tourne le dos au feu.

### Le mobilier extérieur qui fonctionne

| Type | Confort | Durabilité | Prix | Usage idéal |
|---|---|---|---|---|
| Canapé d'extérieur teck/aluminium | ★★★★★ | ★★★★★ | €€€€ | Soirées longues, recevant régulier |
| Banc en bois massif | ★★★ | ★★★★★ | €€ | Esprit "rustique premium", durable |
| Chaises Adirondack | ★★★★ | ★★★★ | €€ | Confort profond, coin contemplatif |
| Poufs d'extérieur déhoussables | ★★★★ | ★★★ | €€ | Modulable, déplaçable, jeune |
| Fauteuils résine tressée | ★★★★ | ★★★★ | €€€ | Confort + esthétique design |
| Muret pierre sèche + coussins | ★★★ | ★★★★★ | €€€ | Intégration paysagère totale |

[atelier]
**Le geste de l'artisan**
Le conseil qu'on donne aux clients qui demandent : **placez les assises à 1,5 m du brasero, pas à 2 m**. À 2 m, vous ne sentez plus la chaleur radiante en automne ; les invités ont froid et finissent par rentrer. À 1,5 m, vous êtes dans le confort thermique optimal — assez près pour profiter du feu, assez loin pour ne pas avoir à se reculer en pleine cuisson. C'est dix centimètres qui changent toute l'expérience d'une soirée d'arrière-saison.
[/atelier]

## Idée 3 — L'éclairage d'ambiance qui prolonge la soirée

[duo image="${IMG_COFFY_AMBIANCE}" pos="right" alt="Coin brasero Coffy le soir avec guirlandes lumineuses tendues, ambiance feutrée d'une soirée d'été"]
**Une lumière qui ne concurrence pas le feu**

Quand le brasero crépite, sa lumière domine l'espace. L'éclairage électrique doit être pensé pour **compléter**, pas pour rivaliser. Les soirées les plus magiques sont celles où l'on ne distingue plus les ampoules — juste une chaleur lumineuse diffuse autour des flammes.
[/duo]

L'éclairage du coin brasero se pense en **trois niveaux** :

- **Lumière focale** = le feu lui-même. Elle ne se règle pas, c'est l'élément central naturel.
- **Lumière d'ambiance** = guirlandes, lanternes, spots discrets. Elle baigne l'espace sans concurrencer le feu.
- **Lumière ponctuelle** = lampes de table, photophores, bougies. Elle crée des points chaleureux sur les surfaces (table à manger, accoudoir de canapé).

**Les bonnes solutions** :

- **Guirlandes lumineuses guinguette** (LED 2700K, blanc chaud) tendues entre des poteaux ou des arbres — l'option la plus populaire et la plus efficace, à partir de 30 € pour 10 mètres de qualité acceptable
- **Lanternes posées au sol** à distance du brasero — bougies LED ou vraies bougies dans des photophores en métal
- **Spots encastrés** dans le sol ou dans un muret — discrets, durables, parfaits pour souligner un cheminement
- **Lampes solaires design** en bambou ou métal patiné — autonomie complète, look chaleureux

**À éviter absolument** :
- Projecteurs LED puissants type éclairage de chantier
- Spots blancs froids (5000K et au-delà)
- Tout ce qui clignote ou change de couleur

La règle d'or : la magie du brasero, c'est la **lumière vivante du feu**. Si vous voyez d'abord les ampoules, c'est raté.

## Idée 4 — La table à proximité pour partager le repas

[duo image="${IMG_FERMIER_REPAS}" pos="left" alt="Brasero Le Fermier en cuisson avec table dressée à proximité pour le repas autour du feu"]
**Le repas qui se vit autour du feu**

Le brasero n'est pas un poste de cuisson isolé — c'est un théâtre. Le cuisinier saisit, retourne, déplace, et les convives **voient** ce qui se passe. Pour amplifier ce rituel, la table doit être à portée de regard, à portée de voix, à portée de main pour ceux qui veulent participer.
[/duo]

Trois configurations possibles selon votre usage :

- **Table haute mange-debout** à 1,5 mètre du brasero — parfait pour les apéros plancha, les repas conviviaux décontractés, les soirées qui s'étirent sans formalité
- **Table de repas classique** à 2-3 mètres pour les dîners assis structurés — viandes saisies servies juste après, légumes encore fumants, ambiance "table d'hôtes"
- **Table basse + canapé** pour les soirées contemplatives — pas de vrai repas, juste apéro long, planches à grignoter, conversations qui durent

Le cuisinier reste **proche du feu**, les convives sont **à portée de voix et de vue**. Tout le monde participe au repas — c'est la convivialité unique du brasero, qui n'existe ni au barbecue (le cuisinier est isolé) ni en cuisine intérieure (les invités attendent).

## Idée 5 — La végétation structurante

[duo image="${IMG_OBELIX_AMIS}" pos="right" alt="Brasero L'Obélix entouré d'amis dans un jardin avec graminées et végétation méditerranéenne autour"]
**Les plantes qui dialoguent avec le feu**

La végétation n'est pas un détail décoratif. Bien choisie, elle structure visuellement l'espace, filtre les regards, apporte du mouvement, et accompagne les saisons. Mal choisie, elle s'enflamme en juillet ou meurt à la première gelée.
[/duo]

Les plantes autour du coin brasero doivent répondre à trois critères : **résistantes à la chaleur** rayonnante, **non inflammables** à proximité immédiate, **belles toute l'année** (ou au moins en saison brasero).

**Les valeurs sûres** :

- **Graminées ornementales** (miscanthus, stipa, panicum) — mouvement naturel, légères, resistantes, magnifiques en automne. Plantez-les à 2 mètres minimum du foyer.
- **Lavande** — parfumée, méditerranéenne, résistante à la sécheresse, idéale en bordure du cercle de gravier. Floraison de juin à août, parfait pour la saison d'usage.
- **Olivier en pot** — le classique des jardins méditerranéens. Un olivier de chaque côté du brasero crée immédiatement un cachet et marque l'espace.
- **Sauge officinale ou romarin** — aromatiques résistants, utiles à la cuisine, beaux toute l'année.
- **Buis ou laurier en haie basse** — pour délimiter l'espace sans bloquer la vue.

**À éviter** :
- Bambou sec ou paille (très inflammable)
- Cyprès et autres résineux à proximité immédiate
- Plantes annuelles fragiles qui mourront sous la chaleur

## Idée 6 — Le rangement bois comme élément déco

[duo image="${IMG_MORRIS_BOIS}" pos="left" alt="Brasero Le Morris avec range-bûches mural en acier corten et bûches empilées de manière organisée"]
**Le bois empilé, élément architectural**

Le bois pour le brasero ne devrait pas être caché. Bien empilé, organisé, mis en scène, il devient un **élément décoratif à part entière** — il annonce le feu, évoque la chaleur, donne du caractère brut au coin brasero. Les Scandinaves et les Japonais ont fait de l'empilement du bois un art.
[/duo]

Si votre brasero a un [range-bûches intégré](/produits/brasero-acier-100-l-obelix), c'est déjà un premier élément. Complétez avec un **rangement bois visible** à proximité :

- **Range-bûches mural en acier corten** — raccord esthétique parfait avec un brasero corten, durable, structuré
- **Empilement le long d'un mur ou d'une clôture** — empilage croisé, hauteur 1,2-1,5 m, longueur libre selon le mur disponible. Le geste japonais : strier l'empilement par alternance de bûches longues et courtes
- **Cercle d'empilement** autour d'un poteau — option scandinave, très visuelle, demande un peu de technique
- **Panier en osier ou en métal** près du brasero pour le bois du soir

Pour le **choix du bois** lui-même (essences, séchage, stockage), voir [le guide complet des bois pour brasero](/blog/meilleur-bois-brasero-comparatif).

## Idée 7 — Le sol adapté à l'usage

![Sol mixte pierre et gravier autour du brasero Coffy](${IMG_COFFY_SOL})

Le sol sous et autour du brasero doit être **incombustible** et **facile à nettoyer**. Plusieurs options selon votre style et votre budget :

- **Gravier** : la solution la plus simple et la plus sûre. Esprit campagne, jardin paysager.
- **Dalles en pierre naturelle** : élégantes, résistantes à la chaleur, intemporelles. Esprit haut de gamme.
- **Béton ciré ou béton brut** : contemporain, facile à nettoyer, durable. Esprit minimaliste.
- **[Terrasse en bois avec protection adaptée](/blog/brasero-terrasse-bois-securite)** : possible avec un tapis ignifugé ou des dalles de pierre sous le brasero. Voir le guide dédié.

**Évitez le gazon directement sous le brasero** — les éventuelles braises tombées le brûleront, les cendres le jauniront, et le poids du brasero (67 à 155 kg) tassera la terre.

## Bonus — Les détails qui font la différence

Au-delà des sept idées principales, quelques **détails finaux** qui transforment un coin brasero correct en pièce à vivre vraiment qualitative :

- **Tapis d'extérieur résistant aux UV** — sous le canapé ou la table basse, à 2 m minimum du brasero. Un tapis en polypropylène tissé donne immédiatement un caractère "salon" à l'espace, à partir de 80 €.
- **Coussins déhoussables** — laver les housses en hiver, les remettre au printemps. Comptez 30-50 € par coussin de qualité.
- **Plaids en laine ou en coton** rangés dans un panier près du canapé — pour les soirées d'arrière-saison, c'est ce qui fait basculer une soirée d'octobre dans le confort.
- **Voile d'ombrage déporté** — pour les après-midi d'été plein soleil, un voile triangulaire à 4-5 mètres du brasero. Ne jamais au-dessus du foyer.
- **Point d'eau à proximité** (robinet extérieur, arrivée d'eau enterrée) — pour rincer rapidement les mains, nettoyer les ustensiles, gérer un imprévu. Ce détail pratique change tout le confort d'usage.
- **Petite étagère ou desserte** près du brasero — pour poser ustensiles, plats à servir, verres. Un guéridon en bois ou en acier corten suffit.

Ces six détails ajoutent rarement plus de 300-500 € au budget total, et c'est ce qui distingue un coin brasero "fonctionnel" d'un vrai espace de réception qui donne envie d'y rester quatre heures.

## Le mobilier extérieur premium : ce qui dure vraiment

Le mobilier d'extérieur premium est un **investissement** différent de celui du mobilier intérieur : il doit résister aux UV, aux intempéries, aux variations de température, parfois à la grêle, sans intervention. Les critères qui distinguent un vrai salon de jardin durable d'un mobilier d'entrée de gamme :

- **Le matériau de structure** : aluminium thermolaqué, teck massif, acier corten, résine tressée HDPE de qualité. Évitez : bois pin/sapin non traité, métaux peints bas de gamme, résines bon marché qui jaunissent.
- **Le revêtement et les coussins** : tissu **outdoor déperlant** (Sunbrella, Olefin), pas de tissu intérieur déguisé. Les bons tissus outdoor tiennent 8-15 ans aux UV sans décoloration majeure.
- **Les fixations et soudures** : vis en inox, soudures continues, pas de fixations apparentes en métal qui rouillera.
- **La garantie** : un fabricant sérieux garantit son mobilier 5 à 10 ans. Si la garantie est de 2 ans, méfiance.

[atelier]
**Le geste de l'artisan**
On nous demande régulièrement quels canapés d'extérieur on conseille à nos clients. Notre réponse honnête : **les marques françaises et italiennes spécialisées outdoor** (Manutti, Ethimo, Vincent Sheppard, Fermob, Vlaemynck) — elles ont 30 ans de R&D sur les matériaux extérieurs. Pour un canapé 3 places, comptez 1 500 à 4 000 € selon le niveau. C'est un budget important, mais c'est un objet qui restera dehors 10-15 ans sans intervention. Comparativement, un salon "entrée de gamme grande surface" demande à être remplacé tous les 3-4 ans — l'arithmétique finit par favoriser le premium.
[/atelier]

## Construire le projet en plusieurs étapes

Aménager un vrai coin brasero coûte **3 000 à 8 000 €** selon le niveau d'ambition (brasero + sol + mobilier + éclairage + végétation + accessoires). Tout faire d'un coup peut être lourd financièrement et logistiquement. **Construire par étapes** est souvent plus malin :

### Année 1 — Le cœur

- **Brasero** + accessoires de base
- **Sol** : gravier ou dalles
- **Une assise simple** : 2 chaises Adirondack, un banc en bois, ou une banquette improvisée

C'est suffisant pour démarrer et profiter dès la première saison.

### Année 2 — Le confort

- **Canapé d'extérieur** ou salon complet
- **Éclairage d'ambiance** (guirlandes, lanternes)
- **Table** dédiée

L'espace passe du fonctionnel au confortable.

### Année 3 — Les finitions

- **Végétation structurante** mature (les plantes mises en année 1 commencent à prendre forme)
- **Tapis d'extérieur**, **plaids**, **coussins** finaux
- **Range-bûches design**, **petits éléments décoratifs**

L'espace devient une vraie pièce à vivre, intégrée et personnelle.

Cette progression sur trois saisons permet d'**affiner les choix** au fur et à mesure de l'usage : on sait où placer le canapé après avoir vécu un été avec le brasero, on sait quelles plantes ajouter après avoir observé les expositions, on sait quel éclairage convient après avoir testé les soirées.

## L'erreur à éviter : le coin perdu

Ne placez **jamais** votre brasero dans un coin perdu du jardin "parce qu'il y a de la place". Le brasero doit être **au cœur de votre espace de vie extérieur**, là où les gens passent naturellement, là où l'on se réunit déjà.

- **Près de la cuisine extérieure** ou de l'accès à la maison
- **Adjacent à la terrasse principale**, pas en fond de jardin
- **Visible depuis la maison** (par une fenêtre ou une porte-fenêtre) — le simple fait de le voir donne envie d'allumer

Un brasero relégué au fond du jardin sera utilisé 3 fois par saison. Un brasero placé au centre de l'espace de vie sera utilisé 30 à 40 fois par saison. C'est tout l'investissement qui change de rentabilité émotionnelle.

## Idées reçues sur l'aménagement extérieur

**"Un salon de jardin en hiver, c'est gâché."**
Faux. Un mobilier d'extérieur premium est conçu pour rester dehors 12 mois sur 12. Les coussins se rentrent (ou se mettent dans une boîte étanche), la structure reste en place. En hiver, l'espace garde son identité visuelle même inutilisé, et il est immédiatement disponible aux premiers beaux jours sans avoir à tout ressortir du garage.

**"Le mobilier d'extérieur premium, c'est inaccessible financièrement."**
Faux nuancé. Un canapé d'extérieur premium coûte 1 500-3 000 €. Un salon "grande surface" 400-800 €. Mais le premium dure 10-15 ans, le bon marché 3-4 ans. Sur 12 ans : **deux salons grande surface = un salon premium**. C'est juste une question de répartition du budget dans le temps.

**"Il faut un grand jardin pour avoir un vrai coin brasero."**
Faux. Une terrasse de 15 m² suffit largement pour un brasero 50 cm + un canapé 2 places + une petite table. La compacité oblige même à mieux concevoir l'espace, sans pièce perdue. Les coins brasero les plus réussis qu'on voit sont souvent des terrasses urbaines de 12-20 m², pas des jardins de 500 m².

**"Le brasero abîme le jardin autour."**
Faux si l'aménagement est correct. Les éventuelles cendres tombent dans le cercle de gravier ou sur les dalles, jamais dans la pelouse. Avec un placement réfléchi et une protection au sol, le brasero peut rester dehors 20 ans sans laisser de traces dans le jardin.

---

## Pour aller plus loin

- [Quel brasero choisir selon le nombre de convives](/blog/quel-brasero-choisir-nombre-convives) — choisir la bonne taille de brasero pour votre espace
- [Installer un brasero sur une terrasse en bois](/blog/brasero-terrasse-bois-securite) — pour les terrasses bois spécifiquement
- [Quel bois pour votre brasero : les 5 meilleures essences](/blog/meilleur-bois-brasero-comparatif) — le combustible et son stockage
- [Pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais) — le manifeste de l'artisanat français qui durera 20 ans dans votre coin brasero`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Aménager un coin brasero : créer une vraie pièce à vivre extérieure",
    meta_title: "Aménager coin brasero : salon de jardin & extérieur (2026)",
    meta_description: "Comment aménager un véritable espace de vie extérieur autour d'un brasero : sol, salon de jardin, canapé extérieur, éclairage, table, végétation, mobilier durable. 7 idées + bonus pour transformer votre extérieur.",
    excerpt: "Un brasero, ce n'est pas qu'un appareil de cuisson — c'est le cœur d'une vraie pièce à vivre extérieure. Voici 7 idées concrètes (sol, salon de jardin, canapé, éclairage, végétation) pour transformer votre terrasse ou jardin en espace où l'on a envie de passer ses soirées.",
    content,
    read_time: 9,
    tags: ['aménagement', 'jardin', 'terrasse', 'salon de jardin', 'canapé extérieur', 'décoration', 'pièce à vivre', 'mobilier extérieur', 'inspiration'],
    related_articles: [
      'quel-brasero-choisir-nombre-convives',
      'brasero-terrasse-bois-securite',
      'meilleur-bois-brasero-comparatif',
      'pourquoi-brasero-artisanal-francais',
    ],
    related_products: ['brasero-acier-100-l-obelix', 'brasero-en-acier-80-lemorris', 'le-fermier'],
    cta_product_slug: 'brasero-acier-100-l-obelix',
    cta_text: 'Voir nos braseros',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'amenager-coin-brasero-jardin');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ amenager-coin-brasero-jardin réécrit`);
console.log(`  Mots: ~${wordCount}`);
