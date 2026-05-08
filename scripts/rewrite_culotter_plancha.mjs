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

const content = `Une plancha en acier carbone n'est pas un objet fini quand vous la sortez du carton. C'est une **matière première** qui attend de devenir un outil. Le culottage est ce qui fait la transition : la formation, à la surface du métal, d'une couche noire dense, lisse et naturellement antiadhérente, construite cuisson après cuisson par la polymérisation contrôlée de couches d'huile. C'est un savoir-faire ancien — celui des poêles en fer des chefs, des woks chinois, des plaques teppanyaki — appliqué à votre plancha de brasero.

> Le culottage est ce qui transforme un morceau d'acier en outil de chef. C'est un investissement de quelques cuissons qui paie pendant vingt ans.

Cet article est le **guide pas-à-pas complet** du culottage d'une plancha de brasero en acier carbone : ce que c'est exactement, comment le faire correctement la toute première fois, comment l'entretenir au quotidien, comment rattraper les accidents, et combien de temps il dure. Si vous venez d'acquérir un brasero plancha acier carbone, c'est l'article à lire **avant** votre premier feu.

---

## Qu'est-ce que le culottage, vraiment ?

Le culottage est une **fine couche de polymères** qui se forme à la surface de l'acier carbone quand on chauffe une couche d'huile au-delà de son point de fumée. Sous l'effet de la chaleur, les molécules de l'huile (acides gras, triglycérides) se réorganisent et se lient entre elles pour former un réseau **réticulé** — un revêtement dur, lisse, brun-noir, chimiquement stable.

C'est exactement le même processus qui forme la couche protectrice des poêles en fonte non émaillée, des poêles en fer du chef De Buyer, des woks chinois traditionnels. La différence avec un revêtement industriel (téflon, céramique) : ici, **vous le construisez vous-même**, **il s'auto-répare** à chaque cuisson, et il est **naturel** — aucun composé synthétique, aucun risque sanitaire à la chauffe, aucun éclat qui se détache dans la nourriture.

[chiffre]5 à 10|sessions de cuisson pour atteindre un culottage mature[/chiffre]

Une fois mature, le culottage transforme votre plancha en **surface antiadhérente naturelle**. Un œuf glisse, un poisson se décolle au moment où vous décidez, des oignons caramélisent sans accrocher. C'est l'outil que tous les chefs professionnels utilisent quand ils veulent un vrai contact thermique, sans interface synthétique entre l'aliment et le métal.

## Pourquoi culotter (et pas faire autrement) ?

Plusieurs raisons techniques font qu'on ne peut pas simplement "utiliser une plancha en acier carbone non culottée" :

- **L'acier carbone brut adhère à tout.** Sans culottage, un œuf, un poisson, une crêpe se collent au métal nu et s'arrachent en lambeaux. Ce n'est pas une question de propreté, c'est une question d'absence de couche d'interface.
- **L'acier carbone brut rouille en quelques heures.** Sans la couche de polymères qui le protège, l'acier exposé à l'humidité — même celle de la viande qu'on pose dessus — développe une oxydation en surface. Le culottage est aussi une **protection anti-corrosion**.
- **L'acier carbone brut est moins performant thermiquement.** La couche de culottage améliore légèrement la diffusion de chaleur en lissant les micro-irrégularités du métal, et augmente l'**émissivité infrarouge** de la surface (la chaleur radiante qui cuit l'aliment par-dessus).

Quant aux alternatives modernes : un **revêtement téflon** se raye, s'écaille au bout de quelques années, et ne supporte pas les hautes températures du brasero. Une **plancha en céramique** est cassante, sensible aux chocs thermiques, et ne tient pas la durée. Un **acier inoxydable** est plus simple à vivre mais offre moins de saisie (sujet traité dans [le comparatif inox vs acier carbone](/blog/plancha-inox-ou-acier-carbone)). Le culottage sur acier carbone est, en 2026, **le meilleur compromis durabilité × performance × naturalité** disponible pour une plancha de brasero.

## Avant le tout premier culottage : la préparation

Votre plancha en acier carbone arrive de l'atelier avec une **fine couche de protection** appliquée en sortie de production : généralement un film d'huile minérale alimentaire ou de cire de protection, qui empêche la rouille pendant le transport et le stockage. Cette couche doit être retirée **intégralement** avant le premier culottage, sinon elle empêchera la bonne adhérence des couches suivantes.

**Étape de préparation initiale :**

- **Lavez la plancha à l'eau chaude avec un peu de liquide vaisselle.** C'est la **seule fois de sa vie** où vous utiliserez du savon sur cette plancha. Frottez avec une éponge non-abrasive jusqu'à ce que la surface soit visiblement propre et que l'eau coule sans laisser de gouttes grasses.
- **Rincez abondamment à l'eau claire.** Aucune trace de savon ne doit rester — elle compromettrait la polymérisation.
- **Séchez immédiatement** au chiffon en papier, intégralement. Ne laissez aucune zone humide. **L'acier carbone exposé à l'eau forme des points de rouille en quelques heures.**
- **Allumez votre brasero immédiatement** après le séchage, ou re-passez un chiffon en papier huilé léger si vous attendez plus d'une heure avant de culotter.

C'est la seule étape qui demande de la rigueur — passer trop vite sur la préparation initiale, c'est démarrer le culottage sur une surface contaminée par les résidus d'usine, avec un résultat irrégulier et fragile.

## Le premier culottage : la méthode pas-à-pas

Une fois la plancha préparée et le brasero allumé avec du bois sec de feuillus (chêne, hêtre — voir [le guide des bois pour brasero](/blog/meilleur-bois-brasero-comparatif)), vous êtes prêt à enchaîner cinq étapes, dans l'ordre, sans interruption.

### Étape 1 — Chauffer la plancha à bonne température

Allumez votre brasero et laissez les **braises se former** complètement — comptez 25 à 35 minutes selon le bois et la taille du foyer. La plancha doit être **uniformément chaude**, pas seulement au centre. La température cible est entre **180 et 220 °C** sur toute la surface.

Vous le verrez visuellement : sur acier carbone propre, la surface vire au **gris-bleuté** quand elle atteint la bonne zone thermique. Si vous avez un thermomètre infrarouge sans contact, c'est encore mieux — visez ~200 °C.

### Étape 2 — Appliquer la première couche d'huile

Versez **une cuillère à soupe d'huile à point de fumée élevé** au centre de la plancha chaude. Étalez **immédiatement** avec un chiffon en papier replié et tenu avec une **pince à barbecue longue** (la plancha est à 200 °C — ne touchez jamais directement).

L'huile doit former une **fine pellicule visible** sur toute la surface, sans flaques. Si vous voyez des zones où l'huile s'accumule en mare, étalez davantage. Si vous voyez des zones sèches non couvertes, ajoutez une demi-cuillère.

Choix de l'huile : voir le tableau dans la section suivante. Pour un premier culottage, **huile de pépin de raisin** ou **huile de lin alimentaire** donnent les meilleurs résultats. À défaut, huile de tournesol ou de colza fonctionnent bien.

### Étape 3 — Laisser fumer (la polymérisation)

L'huile va **fumer abondamment** — c'est exactement ce qu'on veut. La fumée blanche/grise qui monte de la plancha, c'est la **polymérisation en train de se faire** : les molécules d'huile passent de l'état liquide à l'état de polymères solides, attachés à la surface du métal.

Laissez fumer **2 à 4 minutes** jusqu'à ce que la fumée diminue très nettement et qu'il n'y ait plus que de fines volutes. La surface aura visiblement **foncé** — passé du gris-bleu de l'acier propre à un brun doré naissant.

### Étape 4 — Essuyer puis répéter 3 à 4 fois

Une fois la fumée presque arrêtée, **essuyez l'excédent** avec un chiffon en papier propre tenu à la pince. Le but : enlever la fine pellicule de polymère mou non-adhérent, en gardant la couche dure qui s'est liée au métal.

Puis **recommencez** : nouvelle cuillère à soupe d'huile, étalage, fumée, essuyage. Trois à quatre passes successives donnent un culottage de base solide. Après ces passes, la plancha présente une **teinte brun-doré uniforme**, déjà visiblement différente de l'acier brut du début.

### Étape 5 — La première cuisson de scellement

Pour **sceller le culottage** de manière durable, faites une dernière session : cuisinez quelque chose de **gras et acide** sur la plancha encore chaude. Trois options qui marchent toutes :

- **Oignons émincés revenus dans l'huile pendant 10 minutes** (le grand classique)
- **Lardons fumés cuits jusqu'à coloration** (la graisse du porc se polymérise très bien)
- **Légumes revenus dans du beurre** (courgettes, poivrons en lanières)

Cette première cuisson "réelle" complète le culottage initial en y ajoutant des résidus organiques qui se polymérisent et stabilisent la couche.

À la fin de cette session, votre plancha est **culottée à 60 %**. Les 40 % restants viendront des 5 à 10 cuissons suivantes — chaque service ajoute sa couche, jusqu'à un noir profond mature au bout d'une à deux saisons d'usage régulier.

[atelier]
**Le geste de l'artisan**
À l'atelier, sur les démos clients, on culotte les planchas neuves à l'huile de lin alimentaire — point de fumée à 230 °C, indice d'iode élevé (donc forte tendance à polymériser, c'est exactement ce qu'on cherche), et goût neutre une fois polymérisée. On fait systématiquement 4 passes au lieu de 3, en patientant bien entre chaque (5 minutes pour que la couche durcisse vraiment) et on termine par une cuisson d'oignons émincés. La plancha repart chez le client avec une base de culottage solide, qui n'attend que ses propres cuissons pour mûrir.
[/atelier]

## Le tableau des huiles : laquelle choisir ?

Toutes les huiles ne se valent pas pour le culottage. Le critère qui compte le plus, c'est l'**indice d'iode** (capacité de l'huile à polymériser) couplé au **point de fumée** (température à laquelle l'huile commence à se décomposer). Voici le tri :

| Huile | Point de fumée | Indice d'iode | Goût après cuisson | Verdict |
|---|---|---|---|---|
| Pépin de raisin | 216 °C | 124-143 | Neutre | ★★★★★ Idéale |
| Lin alimentaire | 230 °C | 170-203 | Neutre | ★★★★★ Top performance |
| Tournesol classique | 230 °C | 118-141 | Neutre | ★★★★ Très bon |
| Colza | 220 °C | 94-120 | Neutre | ★★★★ Très bon |
| Avocat | 270 °C | 70-90 | Neutre | ★★★ Bon mais cher |
| Olive (vierge) | 190 °C | 75-94 | Marqué | ★ À éviter |
| Coco | 175 °C | 8-13 | Marqué | ✗ Inadaptée |
| Beurre | 150 °C | n/a | Marqué | ✗ Brûle trop vite |
| Huile minérale | 250 °C | 0 | Sans | ✗ Non comestible |

Les deux gagnantes : **pépin de raisin** (équilibre parfait, dispo en supermarché) et **lin alimentaire** (le choix des puristes, en magasin bio). Tournesol et colza sont parfaits aussi et coûtent moitié prix. Évitez l'huile d'olive (point de fumée trop bas, goût qui ne disparaît pas) et tout ce qui se solidifie à froid (coco, palme).

## L'entretien quotidien après cuisson

Le culottage **se construit** au premier culottage et **se renforce** à chaque cuisson — à condition de respecter un rituel court mais non négociable après chaque service.

**Le rituel des 2 minutes (à la fin de chaque cuisson) :**

- **Pendant que la plancha est encore tiède** (50-80 °C, donc 10-15 minutes après l'extinction du foyer), **raclez à la spatule métallique** pour décoller les résidus de cuisson. Ils partent facilement à cette température.
- **Essuyez avec un chiffon en papier sec**. Tous les résidus liquides et particules doivent disparaître.
- **Repassez un chiffon en papier légèrement huilé** (2-3 gouttes d'huile végétale neutre, pas plus). Le but : reformer une fine pellicule de protection qui scelle la surface jusqu'à la prochaine cuisson.

C'est tout. Deux minutes, trois gestes.

**Ce qu'il ne faut JAMAIS faire** sur une plancha culottée :

- **Pas d'eau froide sur plancha chaude** — choc thermique, déformation possible, et **destruction localisée du culottage** par contraction brutale.
- **Pas de savon ni détergent** — le savon dissout les polymères et ramène l'acier à nu. C'est ce qui détruit instantanément un culottage construit pendant des mois.
- **Pas de paille de fer ou éponge abrasive métallique** sur le culottage normal — réservé aux situations de récupération (voir plus bas).
- **Pas d'eau qui stagne** : si vous nettoyez à l'eau (jamais en routine, seulement en récupération), séchez immédiatement et complètement.
- **Pas de plancha mouillée laissée sous la pluie** — l'acier carbone rouille en quelques heures même à travers une fine couche d'huile en mauvais état.

## Comment savoir si le culottage est mature ?

Quatre signes vous indiquent que votre culottage a atteint son régime de croisière :

- **Couleur** — la plancha est passée du gris d'acier brut au **noir profond uniforme**, avec parfois quelques nuances brun foncé sur les bords moins sollicités.
- **Toucher** — la surface est **lisse et soyeuse** au passage du doigt (plancha froide, hein), pas rugueuse, pas collante.
- **Comportement à la cuisson** — un œuf au plat **ne colle pas** et se décolle d'un coup de spatule. Un poisson se retire entier au moment voulu.
- **Réaction à l'eau** — quelques gouttes d'eau jetées sur la plancha tiède **forment des perles qui glissent** sans tremper la surface (effet hydrophobe du culottage mature).

**Calendrier réaliste** par diamètre de plancha (en cuissons régulières d'un repas familial) :

| Plancha | Sessions pour culottage de base | Sessions pour maturité |
|---|---|---|
| 50 cm | 3 à 5 | 8 à 12 |
| 80 cm | 5 à 8 | 12 à 18 |
| 100 cm | 8 à 12 | 18 à 25 |

Plus le diamètre est grand, plus il y a de surface à culotter, et plus la couverture homogène demande de cuissons.

## Rattraper un culottage abîmé

Le culottage **n'est pas fragile** mais il peut être **localement endommagé** par un accident. Trois cas typiques, trois solutions.

### Cas n°1 — Petite zone rayée ou blanchie

Spatule métallique mal manipulée, ustensile qui rate la cible, frottement involontaire : une zone localisée a perdu son culottage. Le métal est visible.

**Solution :** ignorez l'incident, continuez à cuisiner normalement. Le culottage **se reconstruit naturellement** sur la zone abîmée en 2 à 3 cuissons. Les passes d'huile post-cuisson scellent la zone, et après 4-5 services, la zone est invisible.

### Cas n°2 — Rouille de surface (oubli après cuisson, plancha mouillée)

Vous avez oublié de huiler après la dernière cuisson, et il a plu pendant la nuit. Au matin : rouille fine sur toute la plancha.

**Solution :**
- **Frottez les zones rouillées** à la **paille de fer fine** (grade 0 ou 00) jusqu'à retrouver le métal sain. Ne frottez pas trop fort — vous voulez retirer la rouille, pas creuser le métal.
- **Nettoyez à l'eau chaude**, **séchez immédiatement** au chiffon en papier.
- **Refaites un culottage rapide** : étapes 1 à 4 du premier culottage (3 passes d'huile), puis première cuisson grasse de scellement.

Comptez **45 minutes** de récupération totale. La plancha repart à 80 % du culottage qu'elle avait avant l'incident.

### Cas n°3 — Culottage entièrement perdu (refonte complète)

Cas extrême : votre plancha a été lavée au lave-vaisselle, ou vous l'avez retrouvée après un hiver oublié sans protection. Le culottage est intégralement détruit.

**Solution :**
- **Ponçage à la paille de fer** ou au papier de verre fin (grain 240) sur **toute la surface**, jusqu'à acier nu.
- **Lavage à l'eau et savon** pour retirer toutes les particules de ponçage.
- **Séchage intégral immédiat**.
- **Re-culottage complet** en suivant la méthode des 5 étapes du premier culottage.

Comptez **1 h 30** pour la refonte complète. La plancha redevient ensuite parfaitement fonctionnelle — c'est l'avantage de l'acier carbone : tout est rattrapable, toujours.

[atelier]
**Le geste de l'artisan**
Le truc qu'on partage rarement aux clients : si vous avez un culottage **collant ou poisseux** (signe d'un excès d'huile mal polymérisée), pas la peine de tout refaire. Frottez à la paille de fer fine **sur les zones poisseuses uniquement**, sans toucher aux zones saines. Puis recouchez **une seule** passe d'huile très fine, et faites une cuisson grasse normale derrière. Le culottage se "relisse" en deux services. C'est la maintenance la plus fréquente sur les planchas mal culottées au départ.
[/atelier]

## Idées reçues sur le culottage

**"Plus c'est noir, mieux c'est."**
Faux. Un culottage **trop épais** devient **collant** plutôt qu'antiadhérent. Le bon culottage est **noir profond** mais **lisse et sec** au toucher. Si la plancha est noire mais poisseuse, c'est de l'huile mal polymérisée qu'il faut retirer.

**"Une plancha culottée ne se lave jamais."**
Vrai en routine, faux en cas de besoin. Le **rituel quotidien** se fait **sans eau** (raclette + chiffon huilé). Mais une fois par an, ou en cas de cuisson de quelque chose qui a vraiment laissé une odeur tenace (poisson très puissant), un **passage rapide à l'eau chaude sans savon** est tolérable, à condition de **sécher immédiatement** et de re-huiler.

**"L'huile de lin est la meilleure, point."**
Vrai techniquement (indice d'iode le plus élevé = polymérisation maximale), mais **plus chère et plus rare** que l'huile de pépin de raisin qui donne 95 % du résultat pour la moitié du prix. Pour un usage domestique, pépin de raisin ou tournesol suffisent largement.

**"Le culottage se fait en une seule grosse session."**
Faux. Le culottage **initial** se fait en une session (les 5 étapes), mais la **maturité** demande 5 à 10 cuissons réelles. Vouloir tout faire en un soir avec 10 passes d'huile donne souvent un culottage **épais et collant** au lieu d'un culottage fin et dur.

**"Une plancha culottée, c'est sale et microbiologiquement risqué."**
Faux à 100 %. La **chaleur du foyer** (200-300 °C) **stérilise** la surface à chaque allumage. Aucun pathogène ne survit à ces températures. Les chefs cuisinent sur des poêles culottées depuis des siècles dans toutes les cuisines professionnelles du monde, sans incident sanitaire jamais documenté.

## Combien de temps dure un culottage ?

**À vie**, sous condition d'entretien régulier. Une plancha culottée correctement et entretenue selon le rituel des 2 minutes peut **durer 20, 30, 40 ans** sans nécessiter de refonte complète. Le culottage **s'auto-renouvelle** à chaque cuisson : les nouvelles couches d'huile renforcent les anciennes, et la plancha ne fait que mûrir avec le temps.

Les seuls cas où une refonte complète devient nécessaire :
- **Lavage accidentel au lave-vaisselle** (le détergent puissant détruit tout)
- **Hiver oublié sans aucune protection** (rouille profonde sur toute la surface)
- **Choc thermique violent** (eau glacée jetée sur plancha rouge — peut faire péter le culottage par micro-fractures)

En usage normal, un re-culottage complet n'est **jamais nécessaire**. Le retouches localisées et le rituel d'entretien suffisent pour une vie entière de service.

---

## Pour aller plus loin

- [Plancha inox ou acier carbone : quel matériau choisir](/blog/plancha-inox-ou-acier-carbone) — pour comprendre le choix du matériau et le compromis culottage / tranquillité
- [Hivernage du brasero : comment le ranger et le protéger](/blog/preparer-brasero-hiver-hivernage) — protéger sa plancha culottée pendant la saison froide
- [Premier feu : le rituel d'allumage et de rodage de votre brasero](/blog/premier-feu-rodage-brasero) — la méthode complète pour démarrer un brasero neuf
- [Quel bois pour votre brasero : les 5 meilleures essences](/blog/meilleur-bois-brasero-comparatif) — le combustible qui produit la chaleur de polymérisation`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Comment culotter une plancha en acier carbone : la méthode complète pas à pas",
    meta_title: "Culottage plancha acier carbone : guide pas-à-pas (2026)",
    meta_description: "Le guide complet du culottage d'une plancha en acier carbone : préparation initiale, méthode pas-à-pas, choix de l'huile, entretien quotidien, rattrapage d'un culottage abîmé. Tout ce qu'un propriétaire de plancha doit savoir.",
    excerpt: "Le culottage transforme votre plancha en acier carbone en surface antiadhérente naturelle qui se bonifie cuisson après cuisson. Voici la méthode pas-à-pas pour réussir votre premier culottage, l'entretenir, et rattraper les accidents.",
    content,
    read_time: 9,
    tags: ['culottage', 'plancha', 'acier carbone', 'technique', 'entretien', 'huile', 'polymérisation'],
    related_articles: [
      'plancha-inox-ou-acier-carbone',
      'preparer-brasero-hiver-hivernage',
      'premier-feu-rodage-brasero',
      'meilleur-bois-brasero-comparatif',
    ],
    related_products: ['brasero-acier-100-l-obelix', 'brasero-en-acier-80-lemorris', 'brasero-coffy-80'],
    cta_product_slug: 'brasero-acier-100-l-obelix',
    cta_text: "Découvrir L'Obélix",
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'comment-culotter-plancha-acier-carbone');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ comment-culotter-plancha-acier-carbone réécrit`);
console.log(`  Mots: ~${wordCount}`);
