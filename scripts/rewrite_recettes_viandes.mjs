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

const content = `La viande rouge, c'est exactement ce pour quoi un brasero plancha a été pensé. La combinaison d'une chaleur vive au centre du foyer, d'une plancha en acier épais qui ne perd pas sa température entre deux pièces, et d'une fumée subtile de bois sec qui parfume légèrement la croûte donne un résultat qu'**aucun barbecue à gaz, aucune plancha électrique, aucun four professionnel ne peut approcher**. C'est de la cuisine sérieuse, à mi-chemin entre le grill argentin et le teppanyaki japonais — une cuisine de précision dans le timing et de respect dans le repos.

> Une grande viande au brasero, ce n'est pas une question de talent. C'est une question de timing, de température, et de respect du repos.

Cet article est le **guide pratique des recettes de viandes rouges** au brasero plancha. Les 4 règles techniques universelles qui font marcher toutes les recettes, le rappel des 3 zones thermiques de la plancha, **8 recettes pas-à-pas** (côte de bœuf, entrecôte, magret, agneau, carpaccio chaud, tomahawk, pavé à l'os, rumsteck snacké), le tableau récapitulatif des cuissons par pièce, les 5 erreurs qui gâchent une viande, et les modèles de brasero les plus adaptés à ce type de cuisson.

---

## Avant les recettes : les 4 règles qui les font toutes marcher

Avant n'importe quelle recette précise, il y a quatre règles techniques qui s'appliquent à **toutes** les viandes rouges au brasero. Si l'une est absente, le résultat sera décevant — peu importe la qualité de la pièce ou la précision du timing.

[chiffre]2 h / 3 zones / 10 min|tempérer 2 heures, exploiter 3 zones thermiques, reposer 10 minutes[/chiffre]

### Règle 1 — Tempérer la viande 2 heures avant cuisson

Sortir la viande du frigo **2 heures avant** la cuisson. C'est non négociable. Une viande froide à cœur (4-6 °C) ne cuit jamais correctement à la plancha : le choc thermique fait contracter les fibres, la viande rend de l'eau au lieu de saisir, et le centre reste cru pendant que la croûte brûle. Une viande tempérée (15-18 °C à cœur) saisit instantanément et cuit uniformément.

### Règle 2 — Saisir au centre, finir sur l'anneau

La plancha n'est jamais uniforme. Le **centre** (au-dessus du foyer) est à 350-400 °C, l'**anneau intermédiaire** à 250-300 °C, le **bord** à 150-200 °C. Toute viande rouge se cuit en deux temps : **saisie au centre** pour créer la croûte de Maillard, puis **finition sur l'anneau** pour cuire à cœur sans brûler la croûte. Le bord sert au repos. Pour le détail, voir [maîtriser la température sur un brasero plancha](/blog/temperature-cuisson-brasero-plancha).

### Règle 3 — Saler juste avant ou pendant la cuisson

Le sel **fait sortir l'eau** de la viande par osmose. Saler 30 minutes avant cuisson, c'est garantir que la viande aura rendu son jus avant même de toucher la plancha — elle bouillira au lieu de saisir. Salez **juste avant de poser** la pièce sur le métal, ou pendant la cuisson une fois la croûte formée. Le sel ajouté en fin de cuisson reste en surface et ne pénètre pas. C'est différent.

### Règle 4 — Reposer la viande systématiquement

Le repos est aussi important que la cuisson. Pendant que la viande cuit, ses fibres se contractent et chassent les jus vers le centre. Si vous tranchez immédiatement, **30 % des jus s'écoulent dans l'assiette** et la viande devient sèche. Pendant le repos (5 à 15 minutes selon l'épaisseur), les fibres se détendent et les jus se redistribuent uniformément. Une viande non reposée est une viande gâchée — quel que soit le talent du cuisinier.

## Comprendre les 3 zones thermiques (rappel rapide)

Pour les recettes qui suivent, gardez en tête ces 3 températures de plancha :

| Zone | Position | Température | Usage |
|---|---|---|---|
| Centre | Au-dessus du foyer | 350-400 °C | Saisie pure, croûte de Maillard |
| Anneau intermédiaire | Bande médiane | 250-300 °C | Cuisson vive, finition |
| Bord extérieur | Pourtour | 150-200 °C | Repos, maintien |

Toutes les recettes ci-dessous utilisent ces 3 zones en alternance. Pour comprendre la dynamique complète et apprendre à piloter ces zones, voir le guide dédié [maîtriser la température sur un brasero plancha](/blog/temperature-cuisson-brasero-plancha).

## Recette 1 — La côte de bœuf (2 à 3 personnes)

**Pièce idéale** : 1,2 kg, 5 à 6 cm d'épaisseur, **maturée 30 jours minimum** (idéalement 45 jours pour les amateurs). Race rustique de qualité (Salers, Aubrac, Limousine, Angus). À demander à votre boucher en commande quelques jours avant.

**Préparation** :
- Sortir du frigo 2 heures avant
- Sécher au papier absorbant les deux faces
- Huiler très légèrement (huile neutre type tournesol ou pépin de raisin)
- Saler au gros sel **juste avant de poser**

**Cuisson** :
1. **Centre de la plancha** (350-400 °C) — 3 minutes face A pour créer la croûte
2. **Centre** — 3 minutes face B
3. **Anneau intermédiaire** (250-300 °C) — 4 minutes face A
4. **Anneau intermédiaire** — 4 minutes face B
5. **Bord** (repos) — 10 minutes couvert sans serrer (papier alu non hermétique sur planche bois)

**Trancher** perpendiculairement aux fibres, en tranches de 1,5 cm. Servir avec **fleur de sel** et **poivre noir frais** uniquement — pas de sauce.

**Cuisson cible** : 52-55 °C à cœur (saignant à point).

## Recette 2 — L'entrecôte maturée (1 personne par pièce)

**Pièce idéale** : 350-400 g, 3 cm d'épaisseur, persillée (Black Angus ou Charolaise maturée).

L'entrecôte est plus fine que la côte — elle demande **moins de temps mais une saisie plus agressive**. L'erreur classique est de la traiter comme une côte et de la surcuire.

**Cuisson saignant** :
1. **Centre** — 90 secondes face A (jusqu'à voir la croûte se former, pas attendre qu'elle soit prête)
2. **Centre** — 90 secondes face B
3. **Anneau** — 90 secondes face A
4. **Anneau** — 90 secondes face B
5. **Bord** — 5 minutes de repos

**Cuisson à point** : ajoutez 30 secondes par face sur l'anneau (étapes 3 et 4).

Servir avec **beurre maître d'hôtel** (beurre + persil + jus de citron + fleur de sel) ou simplement nature — la viande maturée n'a besoin de rien.

## Recette 3 — Le magret de canard (2 à 3 personnes par magret)

**Pièce idéale** : magret de canard du Sud-Ouest IGP, 400-500 g, **peau quadrillée au couteau** (entailles superficielles en losanges sans entamer la chair).

Le magret a une cuisson particulière : **côté peau d'abord à froid**, pour faire fondre le gras lentement, puis côté chair à plancha chaude. La plancha est idéale — bien meilleure qu'une grille où la graisse s'enflammerait.

**Cuisson** :
1. **Anneau intermédiaire** (250 °C, **pas le centre**, sinon la peau brûle avant que le gras fonde) — poser **côté peau**, 8 minutes sans toucher
2. **Retirer le gras qui s'accumule** à la cuillère pendant la cuisson (gardez-le pour rissoler des pommes de terre — c'est de l'or culinaire)
3. **Anneau** — retourner **côté chair**, 4 minutes pour rosé, 5 minutes pour à point
4. **Bord** — 5 minutes de repos

**Trancher** en biais (45°), en tranches de 1 cm. Servir avec une **réduction de vinaigre balsamique** (faire réduire 100 ml de balsamique dans une casserole à feu doux 10 min, jusqu'à consistance sirupeuse).

**Cuisson cible** : 58 °C à cœur pour rosé.

[atelier]
**Le geste de l'artisan**
Le détail qui change tout sur une côte de bœuf : **les 10 dernières secondes de saisie**. Avant de la passer sur l'anneau, on appuie fermement sur la viande avec une spatule large, à plat sur la plancha, pendant 10 secondes par face. Cette pression force le contact total entre la viande et le métal — la croûte qui se forme à ce moment-là est **la plus uniforme et la plus dorée** possible. C'est un geste de quelques secondes qui distingue une côte correcte d'une côte de boucher étoilé. À tester sur votre prochaine cuisson.
[/atelier]

## Recette 4 — Les brochettes d'agneau marinées (4 brochettes pour 2 personnes)

**Pièce idéale** : 800 g de **gigot d'agneau désossé** ou de selle d'agneau, coupée en cubes de 3 cm. Demandez à votre boucher de désosser à la coupe.

**Marinade** (à faire 2 heures avant — pas plus, le citron commence à "cuire" la viande au-delà) :
- 3 cuillères à soupe d'huile d'olive vierge extra
- 2 gousses d'ail pressées
- 1 cuillère à café de romarin frais haché
- 1 cuillère à café de thym frais
- 1/2 cuillère à café de cumin moulu (optionnel mais excellent)
- Le jus d'1/2 citron
- Poivre noir
- **Pas de sel dans la marinade** (osmose qui assèche la viande)

**Préparation** : embrocher 5-6 cubes par brochette en alternant avec **morceaux d'oignon rouge** et **demi-poivrons rouges** pour le visuel.

**Cuisson sur grille centrale** (modèle [Le Fermier](/produits/le-fermier) idéal) ou sur centre de plancha, **flamme directe** :
- 2 minutes face 1
- Tourner d'1/4 de tour : 2 minutes face 2
- Tourner d'1/4 de tour : 1 minute face 3
- Tourner d'1/4 de tour : 1 minute face 4

**Saler** à la fin avec fleur de sel. Servir immédiatement avec **yaourt grec à la menthe** (yaourt grec + menthe ciselée + ail râpé + sel).

**Cuisson totale** : 6 minutes pour rosé, 8 minutes pour à point.

## Recette 5 — Le carpaccio chaud (technique signature)

Une **technique simple mais spectaculaire** qui impressionne toujours en début de repas. Le principe : saisir 8-10 secondes à peine un carpaccio de bœuf pour lui donner le **goût du feu** sans le cuire.

**Pièce idéale** : 400 g de **filet de bœuf** (ou rumsteck premium) tranché très fin chez le boucher (**moins de 2 mm d'épaisseur**), idéalement à la trancheuse.

**Préparation** : conserver les tranches au frais, **séparées par du papier sulfurisé** pour qu'elles ne collent pas entre elles.

**Cuisson** :
1. Plancha au **maximum** (centre, juste après alimentation du foyer pour pic thermique)
2. **Huiler très légèrement une face** de chaque tranche (pinceau ou doigt huilé)
3. Poser sur la plancha **côté huilé** vers le bas, 8 secondes
4. Retourner avec une pince fine, 8 secondes
5. Retirer immédiatement et dresser sur **assiette froide**

**Dressage** : disposer les tranches en rosace sur l'assiette, saler à la fleur de sel, arroser d'**huile d'olive parfumée** (truffe, romarin), ajouter des **copeaux de parmesan**, **roquette** sauvage, **pignons grillés**. Servir immédiatement.

La viande reste **crue à cœur** mais a pris la fumée du brasero et la marque thermique de la plancha. C'est une entrée qui transforme un dîner classique en moment fort.

## Recette 6 — Le tomahawk en cuisson alternée (4 à 6 personnes)

**Pièce idéale** : un **tomahawk de 1,5 à 2 kg** (côte de bœuf avec son manche d'os de 25-30 cm), idéalement maturé 30 jours minimum.

C'est **la pièce de démonstration par excellence**. Tellement épaisse qu'une cuisson uniquement en saisie ne suffit pas — il faut alterner saisie et cuisson douce, ce que les Américains appellent le "reverse sear".

**Préparation** :
- 3 heures à température ambiante (oui, 3 et pas 2 — l'épaisseur impose plus de tempérage)
- Sécher
- Huiler légèrement
- Saler juste avant cuisson

**Cuisson alternée** :
1. **Saisie centre plancha** — 3 minutes face A pour la croûte
2. **Centre** — 3 minutes face B pour symétrie
3. **Bord** (150 °C) — **cuisson indirecte 15 à 20 minutes**, en retournant toutes les 5 minutes
4. **Repos** sur planche bois — 15 minutes (couvert sans serrer)

**Thermomètre à sonde fortement recommandé**. Cible :
- 50 °C à cœur = saignant
- 54 °C = à point saignant
- 58 °C = à point
- 62 °C = bien cuit (sacrilège sur tomahawk, mais à savoir)

**Découpe spectaculaire** : présenter la pièce entière sur planche, trancher à table en lamelles de 1 cm dans le sens contraire des fibres. Pour un tomahawk en contexte événementiel ou restaurant, [Le Morris 100 cm](/produits/brasero-morris-100) donne la surface et la puissance pour gérer 2 pièces en parallèle.

## Recette 7 — Le pavé de bœuf à l'os (1 personne par pavé)

**Pièce idéale** : pavé de bœuf à l'os, 350-400 g, 3,5 cm d'épaisseur. Le boucher coupe une côte épaisse et garde un morceau d'os apparent côté périphérie.

L'os garde la viande **plus juteuse** pendant la cuisson et apporte du goût. C'est entre l'entrecôte (sans os) et la côte de bœuf (gros os).

**Cuisson** :
1. **Centre** — 2 minutes face A
2. **Centre** — 2 minutes face B
3. **Anneau** — 3 minutes face A
4. **Anneau** — 3 minutes face B
5. **Bord** — 7 minutes de repos

**Particularité** : pendant le repos, **caler le pavé sur l'os** (l'os côté plancha, viande vers le haut) pour transmettre encore un peu de chaleur à cœur via l'os qui conserve la température.

Servir avec **tombée d'échalotes** (50 g d'échalotes émincées, suées 10 min au beurre + filet de vinaigre balsamique).

## Recette 8 — Le rumsteck snacké (1 à 2 personnes par pièce)

**Pièce idéale** : pavé de rumsteck, 300-350 g, 2,5 cm d'épaisseur. C'est le **meilleur rapport qualité-prix** des viandes à plancha — moins persillé que la côte mais plus tendre que la bavette.

**Cuisson "snackée"** (saisie franche, intérieur très saignant) :
1. **Centre** — 1 minute face A
2. **Centre** — 1 minute face B
3. **Anneau** — 1 minute face A
4. **Anneau** — 1 minute face B
5. **Bord** — 4 minutes de repos

**Cuisson totale** : 4 minutes seulement. C'est volontaire — le rumsteck brille en saignant et durcit à point.

**Trancher en biais**, fines tranches de 8 mm, servir sur **roquette + parmesan + huile d'olive truffée**. C'est une entrée chaude qui fait toujours mouche.

## Tableau récapitulatif des cuissons par pièce

| Pièce | Poids | Tempérage | Saisie centre | Anneau | Repos | Cible cœur |
|---|---|---|---|---|---|---|
| Côte de bœuf | 1,2 kg | 2 h | 3 min × 2 | 4 min × 2 | 10 min | 52-55 °C |
| Entrecôte | 350-400 g | 2 h | 90 s × 2 | 90 s × 2 | 5 min | 52-55 °C |
| Magret canard | 400-500 g | 1 h | — | 8 min peau + 4 min chair | 5 min | 58 °C |
| Brochettes agneau | 800 g | 1 h | — | 6 min total grille | 0 (servi direct) | 58 °C |
| Carpaccio chaud | 400 g | 30 min | 8 s × 2 | — | — | cru à cœur |
| Tomahawk | 1,5-2 kg | 3 h | 3 min × 2 | 15-20 min indirect | 15 min | 50-54 °C |
| Pavé à l'os | 350-400 g | 2 h | 2 min × 2 | 3 min × 2 | 7 min | 52-55 °C |
| Rumsteck snacké | 300-350 g | 1 h | 1 min × 2 | 1 min × 2 | 4 min | 48-52 °C |

[atelier]
**Le geste de l'artisan**
Le secret le mieux gardé des amateurs sérieux : **commandez votre viande chez un boucher artisan, jamais en grande surface**. Une côte de bœuf à 35 €/kg chez le boucher du quartier qui la maturée lui-même bat à plate couture une côte de bœuf à 28 €/kg de grande surface non maturée. La différence n'est pas dans le prix — elle est dans la **qualité de l'animal**, la **maturation**, et le **conseil** que vous recevrez ("celle-ci est de Salers maturée 35 jours, parfaite pour brasero"). Construisez une relation avec un boucher dans votre ville. C'est le geste qui élève toute votre cuisine au brasero d'un cran.
[/atelier]

## Les 5 erreurs qui gâchent une viande au brasero

**1. Viande froide au cœur**
Sortie du frigo trop tard → cuisson irrégulière, fibres contractées, eau qui sort. **Toujours tempérer 2 h** (3 h pour les pièces de 1,5 kg+).

**2. Saler 30 minutes avant**
Le sel fait sortir l'eau par osmose, la viande bout au lieu de saisir. Saler **juste avant** ou **pendant** la cuisson, jamais 30 minutes avant.

**3. Plancha pas assez chaude**
Si la viande colle ou ne marque pas, la plaque n'est pas à température. **Faites le test de l'eau** (effet Leidenfrost) avant de poser. Voir [maîtriser la température](/blog/temperature-cuisson-brasero-plancha).

**4. Ne pas laisser reposer**
Trancher trop tôt vide la viande de ses jus. Le repos fait **30 % du rendu final**. Ne tranchez jamais une grande pièce avant 10-15 minutes de repos.

**5. Huiler la plancha au lieu de la viande**
L'huile sur le métal brûle en quelques secondes et fait fumer la plancha sans rien apporter. **Toujours huiler la pièce**, jamais la plaque.

## Quel modèle de brasero pour la viande rouge

Tous nos braseros gèrent très bien la viande rouge, mais certains modèles ont des avantages spécifiques :

- **[Le Fermier](/produits/le-fermier)** : la **grille centrale inox** en plus de la plancha permet la flamme directe — idéal pour les **brochettes**, le **tomahawk** en finition, et toutes les pièces où la marque de grille est recherchée. C'est notre modèle phare pour les amateurs de viande.
- **[L'Obélix 80 cm](/produits/brasero-acier-100-l-obelix)** : plancha 10 mm pure, format polyvalent, parfait pour les **côtes de bœuf, entrecôtes, magrets** au quotidien familial.
- **[Le Morris 100 cm](/produits/brasero-morris-100)** : surface généreuse pour gérer **plusieurs pièces en parallèle** lors de réceptions ou pour les très grosses pièces (tomahawk de 2 kg+, gigots d'agneau désossés).

Le matériau de plancha (inox vs acier carbone) joue aussi un rôle. Pour les amateurs de **saisie maximale**, l'acier carbone bien culotté donne une croûte plus marquée. Voir [le comparatif inox vs acier carbone](/blog/plancha-inox-ou-acier-carbone) pour le détail.

## Idées reçues sur la viande au brasero

**"Plus c'est saignant, mieux c'est."**
Faux nuancé. Le **saignant** est la cuisson la plus mise en valeur par la plancha pour les grandes pièces (côte, tomahawk, entrecôte maturée). Mais une cuisson **à point** est légitime sur certaines pièces (pavé à l'os, rumsteck plus épais, magret bien rosé). L'important n'est pas le degré de cuisson — c'est la **régularité** et le **respect du repos**.

**"Une marinade longue (24 h), c'est mieux."**
Faux. Au-delà de **2-3 heures**, les acides de la marinade (citron, vinaigre, vin) commencent à dénaturer les protéines en surface — la viande devient **floconneuse** au lieu de tendre. Pour l'agneau, 2 heures suffisent. Pour le bœuf, **pas de marinade du tout** sauf cas très spécifique — la qualité de la pièce parle d'elle-même.

**"Le sel ne fait pas vraiment de différence dans le timing."**
Faux. Le moment du salage **change tout** : 30 min avant = viande qui rend son eau et bout. Juste avant = viande qui saisit parfaitement. C'est de la chimie, pas de l'opinion. Testez sur deux pièces identiques côte à côte — vous verrez la différence en 90 secondes.

**"Une plaque grill ferait la même chose qu'une plancha brasero."**
Faux. Une plancha brasero offre **3 zones thermiques distinctes** sur une seule surface, alors qu'une plaque grill conventionnelle n'en a qu'une. La possibilité de saisir au centre puis finir sur l'anneau, sans déplacer la viande sur un autre appareil, est ce qui distingue le vrai brasero d'une plancha de cuisine. Sans cette dynamique, vos pièces de 5 cm d'épaisseur seront **brûlées dehors et crues dedans**.

**"Le brasero, c'est trop technique pour cuisiner régulièrement."**
Faux. Une fois les 4 règles maîtrisées (tempérage, zones, sel, repos), le brasero est **plus simple** qu'un piano de cuisine domestique : vous **voyez** la chaleur (couleur des braises, halo au-dessus de la plancha), vous **entendez** la cuisson, vous **sentez** la fumée. Tous les paramètres sont visibles. Aucune cuisinière intérieure n'offre ce niveau de feedback sensoriel.

---

## Pour aller plus loin

- [Maîtriser la température sur un brasero plancha](/blog/temperature-cuisson-brasero-plancha) — le pilotage des 3 zones thermiques en détail
- [Légumes et poissons au brasero plancha : les cuissons délicates](/blog/legumes-poissons-brasero-plancha-cuissons-delicates) — l'autre versant de la cuisson au brasero
- [Cuisson au feu de bois : la science du goût fumé](/blog/cuisson-feu-bois-gout-fume-plancha) — la chimie de Maillard et des phénols
- [Quel bois pour votre brasero : les 5 meilleures essences](/blog/meilleur-bois-brasero-comparatif) — le combustible qui donne le goût`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Viandes rouges au brasero plancha : 8 recettes et les gestes qui font la différence",
    meta_title: "Recettes viandes rouges brasero : 8 recettes pas-à-pas (2026)",
    meta_description: "8 recettes de viandes rouges au brasero plancha : côte de bœuf, entrecôte, magret, agneau, tomahawk, carpaccio chaud. Temps de cuisson précis, zones thermiques, marinades, repos. Le guide complet du carnivore.",
    excerpt: "La viande rouge est ce pour quoi un brasero plancha est vraiment pensé. 8 recettes pas-à-pas avec les temps de cuisson précis, les marinades qui marchent, et les 4 règles techniques qui transforment chaque pièce en grande viande.",
    content,
    read_time: 10,
    tags: ['recettes', 'viandes rouges', 'cuisson', 'plancha', 'côte de bœuf', 'entrecôte', 'magret', 'agneau', 'tomahawk', 'carpaccio'],
    related_articles: [
      'temperature-cuisson-brasero-plancha',
      'legumes-poissons-brasero-plancha-cuissons-delicates',
      'cuisson-feu-bois-gout-fume-plancha',
      'meilleur-bois-brasero-comparatif',
    ],
    related_products: ['le-fermier', 'brasero-acier-100-l-obelix', 'brasero-morris-100'],
    cta_product_slug: 'le-fermier',
    cta_text: 'Découvrir Le Fermier',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'recettes-viandes-rouges-brasero-plancha');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ recettes-viandes-rouges-brasero-plancha réécrit`);
console.log(`  Mots: ~${wordCount}`);
