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

const content = `L'inox est la matière la plus simple à vivre sur un brasero. Pas de culottage à entretenir, pas de risque de rouille à surveiller, pas de patine qui évolue. Une plancha inox vous laisse tranquille — c'est tout l'intérêt de ce matériau. Mais "simple" ne veut pas dire **"sans entretien"** : pour qu'une plancha en acier inoxydable reste impeccable pendant vingt ans, il y a quelques gestes à faire systématiquement, et surtout quelques erreurs classiques à ne jamais commettre.

> L'inox ne demande presque rien. Mais ce "presque rien", il faut le faire bien — et ne jamais sortir de la liste des gestes autorisés.

Cet article est le **protocole d'entretien complet** d'une plancha inox de brasero : pourquoi l'inox est si simple à entretenir (la chimie derrière), le rituel des 3 minutes après chaque cuisson, l'entretien profond annuel, les 6 erreurs qui ruinent une plancha, le tableau de dépannage des problèmes courants, et la durée de vie réelle d'une plancha inox bien soignée. À la fin, votre plancha aura la même allure dans vingt ans qu'au jour de la livraison.

---

## Pourquoi l'inox est plus simple à vivre que l'acier carbone

L'inox alimentaire (le 304 ou le 316L que nous utilisons sur nos planchas brasero) doit sa résistance à un détail chimique invisible : la **couche passive d'oxyde de chrome** qui se forme spontanément à la surface du métal au contact de l'oxygène de l'air. Cette pellicule de quelques nanomètres d'épaisseur — totalement transparente — protège l'acier en dessous contre la corrosion, l'oxydation, l'humidité et la plupart des agressions chimiques.

Conséquence pratique : pas de culottage à construire, pas de rouille à craindre, pas de patine à entretenir. La plancha qui sort de l'atelier est **immédiatement opérationnelle** et reste parfaitement performante pendant des décennies — à condition de **ne pas attaquer cette couche passive** par de mauvais gestes.

L'entretien d'une plancha inox tient donc en deux principes :

- **Garder la surface propre** pour que rien ne stagne
- **Préserver la couche passive** en évitant les produits et matériaux qui la détruisent

Tout le reste de l'article décline ces deux principes.

[chiffre]3 minutes|c'est le temps total d'entretien après chaque cuisson sur une plancha inox[/chiffre]

## Le rituel des 3 minutes après chaque cuisson

L'inox se nettoie **chaud**, juste après la fin du service, quand la plancha est encore à 80-100 °C. C'est le moment où les résidus se décollent le plus facilement — sans détergent, sans produit agressif, simplement avec de l'eau et un peu d'huile de coude.

### Étape 1 — Racler à chaud (1 minute)

Avec une **raclette en inox** (jamais en métal qui rouille type fer ordinaire, jamais en plastique qui fond), passez la lame sur toute la surface de la plancha en poussant les résidus vers un coin. Les sucs séchés se détachent en lamelles, les graisses cuites se raclent sans effort. Ne forcez pas — la chaleur fait le travail à votre place.

### Étape 2 — Déglacer à l'eau chaude (1 minute)

Versez **un verre d'eau chaude** au centre de la plancha. Le choc thermique modéré (l'eau est chaude, pas froide) finit de décoller ce qui restait. L'eau devient immédiatement brune — c'est le signe que le nettoyage fonctionne. Avec la raclette, poussez l'eau et les résidus vers le bord, dans un récipient.

**Important** : utilisez de l'eau **chaude**, jamais glacée. Verser de l'eau froide sur une plancha à 350 °C crée un choc thermique violent qui, à long terme, peut déformer la plaque.

### Étape 3 — Essuyer immédiatement (1 minute)

Avec un **papier absorbant** ou un chiffon en coton dédié à la plancha, essuyez intégralement la surface jusqu'à ce qu'elle soit **complètement sèche**. Aucune zone humide ne doit rester. Même l'inox peut développer des **micro-taches** si l'eau stagne pendant des heures, surtout si elle contient du calcaire.

C'est tout. Trois étapes, trois minutes, et la plancha est prête pour le service suivant — ou pour être stockée jusqu'à la prochaine utilisation.

[atelier]
**Le geste de l'artisan**
Le truc qu'on partage rarement : versez l'eau chaude **au centre** de la plancha, pas sur les bords. La couronne d'inox du brasero a une forme légèrement bombée vers le centre — l'eau s'étale en partant du milieu et nettoie toute la surface en circulant naturellement vers les bords. Verser sur le bord gaspille de l'eau qui coule directement par terre sans avoir nettoyé grand-chose. C'est un détail, mais c'est ce qui distingue un nettoyage rapide d'un nettoyage bâclé.
[/atelier]

## Les outils indispensables (et ceux à proscrire)

L'entretien d'une plancha inox demande **très peu de matériel**. Investir dans 3 outils de qualité dès l'achat évite 90 % des problèmes.

### Les 3 outils indispensables

- **Raclette en inox alimentaire** (lame inox + manche bois ou plastique alimentaire) — 15 à 30 €. C'est l'outil principal, à acheter en qualité professionnelle. Une bonne raclette dure 10-15 ans. Évitez les premiers prix qui plient ou se cassent.
- **Chiffons en coton dédiés** ou rouleaux de papier absorbant épais. Plusieurs chiffons en rotation, lavés régulièrement.
- **Pâte à l'inox** (Miror Inox ou équivalent) — 5 à 8 € le tube, dure plusieurs années. Pour l'entretien profond annuel uniquement.

### Les 5 outils à PROSCRIRE absolument

- **Paille de fer / laine d'acier** — laisse des résidus microscopiques de fer qui rouillent en surface et donnent l'illusion que la plancha rouille (alors que c'est la paille qui rouille à sa surface). Les taches orangées ainsi créées sont **très difficiles à enlever**.
- **Tampon vert (côté abrasif d'éponge)** — micro-rayures sur la couche passive, ternit la surface durablement.
- **Brosse métallique** — même problème que la paille de fer.
- **Couteau de cuisine** — la plancha n'est pas une planche à découper. Trancher dessus crée des **rayures profondes** qui altèrent l'aspect ET deviennent des zones où la nourriture accroche.
- **Décapants fours basiques** — extrêmement agressifs, attaquent la couche passive en profondeur.

## L'entretien profond : une fois par an

Même avec un nettoyage quotidien correct, l'inox peut développer au fil du temps :

- Un **léger voile gris** par endroits (oxydation très superficielle)
- Des **traces d'eau calcaire** si vous utilisez de l'eau dure
- Une **perte de brillant** sur les zones les plus sollicitées (centre)

Une fois par an — idéalement **en fin de saison, avant l'hivernage** (voir [le guide de l'hivernage](/blog/preparer-brasero-hiver-hivernage)) — un entretien profond remet la plancha à neuf.

### Méthode en 4 étapes

1. **Lavage à l'eau chaude savonneuse** — savon noir liquide ou liquide vaisselle neutre, jamais d'eau de Javel (voir section erreurs). Frottez avec une éponge non-abrasive jusqu'à propreté visible.

2. **Application de pâte à l'inox** — appliquez une noisette de pâte à l'inox sur un chiffon doux propre. Frottez **dans le sens du brossage** de l'inox (vous verrez des rayures très fines qui indiquent la direction — c'est le sens du grain du métal). **Jamais en cercles, jamais perpendiculairement** au grain. La pâte enlève le voile gris, ravive la brillance, et redonne un aspect satiné uniforme.

3. **Rinçage abondant à l'eau claire** + séchage immédiat au chiffon en coton.

4. **Optionnel — fine couche d'huile alimentaire** (tournesol ou pépin de raisin) passée au papier absorbant. Très fine couche, juste un voile. Ça ne forme pas un culottage comme sur acier carbone, mais ça **protège la plancha pendant le stockage hivernal** et lui donne un aspect satiné lumineux.

Résultat : la plancha retrouve l'aspect qu'elle avait au jour de la livraison.

## Les 6 erreurs qui abîment une plancha inox

### 1. L'eau de Javel — l'erreur n°1

À **proscrire absolument**. L'eau de Javel contient des **ions chlorure** qui attaquent la couche passive de l'inox en quelques minutes. Conséquence : **piqûres de corrosion** qui apparaissent en quelques semaines, parfois définitives.

**Règle absolue** : aucun produit chloré sur l'inox. Ni Javel, ni anti-calcaire chloré, ni certains détergents WC, ni eau de piscine.

### 2. La paille de fer ou la laine d'acier

Voir section "outils à proscrire" plus haut. **Toujours utiliser des ustensiles en inox ou plastique alimentaire**, jamais en fer ordinaire.

### 3. Le choc thermique à froid

Verser de l'eau **glacée** sur une plancha encore très chaude (>250 °C) crée un choc thermique qui peut, à la longue, **déformer légèrement** la plaque (l'inox 10 mm résiste bien, mais il a ses limites). Toujours déglacer à l'eau **chaude**, ou attendre que la plancha soit descendue à 100 °C avant de la nettoyer si vous n'avez que de l'eau froide.

### 4. Le stockage mouillé

Ranger une plancha encore humide sous une housse, c'est **piéger l'humidité** dans un microclimat confiné qui finit par créer des conditions d'oxydation. Toujours **sécher complètement** avant de couvrir ou de stocker — même pour 24 h.

### 5. Les couteaux qui rayent

La plancha est une **surface de cuisson**, pas une planche à découper. Trancher une viande directement sur la plancha laisse des **rayures profondes** qui altèrent l'aspect et, à la longue, créent des zones où la nourriture accroche. **Toujours dresser sur une planche à découper** à part.

### 6. Les décapants fours

Certains nettoyants pour fours sont **extrêmement basiques** (pH > 13) et attaquent l'inox en profondeur. Si vous avez vraiment une cuisson très carbonisée (rare sur inox), préférez **laisser tremper de l'eau bouillante + savon noir une nuit** plutôt que de sortir l'artillerie chimique.

[atelier]
**Le geste de l'artisan**
L'erreur SAV la plus fréquente qu'on voit sur les planchas inox, c'est **les taches orangées** qui apparaissent quelques semaines après l'achat. Neuf fois sur dix, le client a utilisé une éponge avec un côté abrasif **vert** pour gratter une cuisson rebelle. Le vert contient des particules métalliques qui se déposent dans la surface inox et rouillent à l'air. Solution : pâte à l'inox + frottage doux dans le sens du grain, et la plancha retrouve son aspect en 10 minutes. Mais le réflexe à acquérir, c'est : **jamais d'éponge verte sur inox**.
[/atelier]

## Tableau de dépannage des problèmes courants

| Problème | Cause probable | Solution |
|---|---|---|
| Voile gris superficiel | Oxydation très légère | Pâte à l'inox + frottage dans le sens du grain |
| Traces blanches/calcaires | Eau dure laissée sécher | Vinaigre blanc dilué (1:1 eau), rinçage immédiat |
| Auréoles d'eau | Plancha mal séchée | Repassage chiffon humide + séchage immédiat |
| Marques brunes | Sucre brûlé / chauffe excessive | Bicarbonate + eau chaude, frottement doux |
| Rayures fines | Frottement abrasif | Pâte à l'inox dans le sens du grain |
| Rayures profondes | Couteau / objet métallique | Irréversible — limiter à l'esthétique |
| Taches orangées | Résidus de fer (paille, éponge verte) | Pâte à l'inox + retrait des résidus métalliques |
| Piqûres de corrosion | Contact avec chlore | Surface localement attaquée — non récupérable |

## Le cas particulier du calcaire

Si vous habitez dans une région à **eau dure** (Île-de-France, Nord, Bourgogne, Provence...), des **traces blanches** peuvent apparaître au fil du temps, surtout si vous laissez sécher l'eau à l'air libre.

**Méthode douce — Vinaigre blanc dilué**

- Mélangez 1 volume de vinaigre blanc + 1 volume d'eau tiède
- Appliquez au chiffon, laissez agir 5 minutes
- Frottez doucement dans le sens du grain
- Rincez abondamment et séchez

**Méthode plus forte — Acide citrique**

Pour les traces calcaires tenaces (rare sur inox bien entretenu) :

- Diluez 1 cuillère à soupe d'acide citrique (vendu en droguerie pour 4-6 €) dans 1 litre d'eau tiède
- Appliquez avec une éponge non-abrasive
- Laissez agir 10 minutes
- Rincez et séchez

**Prévention** : essuyer **immédiatement** après chaque rinçage, avant que l'eau s'évapore en laissant ses minéraux. C'est la meilleure défense contre le calcaire.

## Avant hivernage : la préparation spécifique

L'entretien quotidien suffit pour la majorité de l'année. **En fin de saison**, avant de stocker la plancha pour l'hiver, ajoutez deux gestes spécifiques :

1. **Faites l'entretien profond annuel** (méthode 4 étapes ci-dessus)
2. **Appliquez une fine couche d'huile végétale** sur toute la surface, juste un voile, pour protéger contre l'humidité hivernale

Pour le reste du protocole d'hivernage du brasero (cendres, socle, housse), voir le [guide complet de l'hivernage](/blog/preparer-brasero-hiver-hivernage).

## Idées reçues sur l'entretien inox

**"L'inox ne tache jamais."**
Faux. L'inox **résiste très bien** mais peut être taché par : le calcaire, les résidus de fer, le chlore, certains acides forts, et les éponges abrasives. La différence avec l'acier ordinaire : ces taches sont presque toujours **récupérables** par les bonnes méthodes.

**"On peut tout passer au lave-vaisselle."**
Vrai pour les petites pièces (raclette, couvercle de bol), faux pour la plancha elle-même. Les détergents lave-vaisselle sont souvent agressifs (pH élevé), et les cycles de chauffe + séchage en circuit fermé peuvent **piéger l'humidité** qui crée des taches. La plancha se nettoie à la main, à chaud, après cuisson — c'est plus rapide et plus efficace.

**"Une plancha inox vieillit forcément moins bien qu'un acier carbone culotté."**
Nuancé. Une plancha inox **bien entretenue** garde son aspect quasi intact pendant 20 ans. Une plancha acier carbone bien culottée développe une patine appréciée mais qui peut aussi être ratée (rouille, culottage poisseux). Les deux matériaux ont leurs forces — voir le [comparatif inox vs acier carbone](/blog/plancha-inox-ou-acier-carbone) pour le détail du choix.

**"Plus on frotte, mieux c'est."**
Faux. L'inox demande des **gestes doux** dans le bon sens (le sens du grain). Frotter fort, en cercles, avec des produits abrasifs **abîme la couche passive** sans rien améliorer en propreté. La règle : nettoyage régulier doux > nettoyage rare et agressif.

**"Une rayure sur inox, c'est définitif."**
Faux pour les rayures **fines** (pâte à l'inox + frottage dans le sens du grain les estompe), vrai pour les rayures **profondes** (couteau, objet pointu). C'est pour ça qu'on ne tranche jamais directement sur la plancha.

## Durée de vie réelle d'une plancha inox bien entretenue

Une plancha inox 10 mm qui reçoit l'entretien décrit dans cet article n'a **pas de durée de vie fonctionnelle limite**. Les braseros que nous avons fabriqués il y a dix ans, équipés de planchas inox d'origine, sont toujours en service chez les premiers clients qui les ont achetés — utilisés plusieurs dizaines de fois par an, sans aucune intervention au-delà du protocole quotidien.

C'est la vraie force de l'inox sur le long terme : **ce n'est pas un consommable**. Contrairement à certains revêtements antiadhésifs qui se dégradent après quelques années, contrairement à certains métaux qui finissent par se percer aux zones de contrainte, l'inox alimentaire 10 mm est un **achat définitif**.

Considérez votre plancha inox comme un investissement à vie — à condition de l'entretenir selon la méthode ci-dessus. Trois minutes après chaque cuisson, un entretien profond annuel, six erreurs à éviter : c'est tout ce qu'il faut pour qu'elle ait la même allure dans vingt ans qu'au jour de sa livraison.

---

## Pour aller plus loin

- [Plancha inox ou acier carbone : quel matériau choisir](/blog/plancha-inox-ou-acier-carbone) — pour comprendre le choix entre les deux matériaux
- [Comment culotter une plancha en acier carbone : guide pas à pas](/blog/comment-culotter-plancha-acier-carbone) — l'autre protocole, pour ceux qui ont choisi l'acier carbone
- [Hivernage du brasero : comment le ranger et le protéger](/blog/preparer-brasero-hiver-hivernage) — la préparation spécifique de fin de saison
- [Maîtriser la température sur un brasero plancha](/blog/temperature-cuisson-brasero-plancha) — pour exploiter pleinement votre plancha bien entretenue`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Entretien d'une plancha inox de brasero : la méthode complète au quotidien",
    meta_title: "Entretien plancha inox brasero : guide complet (2026)",
    meta_description: "Comment entretenir une plancha inox de brasero pour qu'elle dure 20 ans : nettoyage des 3 minutes après cuisson, entretien profond annuel, 6 erreurs à éviter, dépannage des taches courantes. Le guide complet.",
    excerpt: "L'inox est la matière la plus simple à vivre sur un brasero — pas de culottage, pas de rouille à craindre. Mais 'simple' ne veut pas dire 'sans entretien'. Voici le protocole en 3 minutes après chaque cuisson, l'entretien profond annuel, et les 6 erreurs qui ruinent une plancha.",
    content,
    read_time: 7,
    tags: ['entretien', 'plancha', 'inox', 'nettoyage', 'durée de vie', 'calcaire', 'protection'],
    related_articles: [
      'plancha-inox-ou-acier-carbone',
      'comment-culotter-plancha-acier-carbone',
      'preparer-brasero-hiver-hivernage',
      'temperature-cuisson-brasero-plancha',
    ],
    related_products: ['brasero-coffy-80', 'brasero-acier-100-l-obelix', 'brasero-en-acier-80-lemorris'],
    cta_product_slug: 'brasero-coffy-80',
    cta_text: 'Voir nos braséros plancha',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'entretien-plancha-inox-brasero');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ entretien-plancha-inox-brasero réécrit`);
console.log(`  Mots: ~${wordCount}`);
