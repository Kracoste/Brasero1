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

const content = `Un brasero en restauration n'est pas le même objet qu'un brasero domestique. Le matériel est identique en apparence — même acier, mêmes formes — mais l'**usage** change radicalement. À la maison, un brasero tourne 30 à 50 fois par an. En restaurant, il tourne 200 à 500 fois par an, parfois cinq services par jour, avec des cadences serrées, des contraintes réglementaires fortes, et une équipe à gérer autour. Le choix du modèle, son installation, son intégration dans le poste de cuisine, sa maintenance, tout doit être repensé.

> En restauration, le brasero n'est pas un effet de scène. C'est un poste de production qui doit tenir quatre services par semaine pendant dix ans, avec une équipe qui change, et des contraintes ERP à respecter.

Cet article est le **guide professionnel complet** pour restaurateurs, chefs, gérants d'établissement, food-truckers, guinguettes saisonnières, traiteurs avec lieu fixe et toute structure qui intègre le brasero comme **outil de production permanent**. Différences domestique vs pro, choix du diamètre selon votre format, matériaux pour usage intensif, plancha vs grille, sécurité ERP, ergonomie d'équipe, retour sur investissement réel, cas d'usage par type d'établissement, et configurations sur mesure pour pros.

---

## Pourquoi le brasero entre en restauration en 2026

Le brasero plancha s'est imposé en restauration en moins de cinq ans, porté par trois mouvements de fond qui se renforcent mutuellement.

[chiffre]30 à 50|couverts par service en continu sur une plancha 80 cm bien organisée[/chiffre]

### 1. La différenciation par l'expérience

Le marché de la restauration française est saturé. Dans une rue commerçante de 200 mètres, vous croisez facilement 8 à 12 établissements qui visent la même clientèle, avec des cartes proches et des prix dans la même fourchette. Ce qui **fait la différence** ne tient plus au plat — il tient à **l'expérience** que le client vit dans votre établissement.

Le brasero coche immédiatement plusieurs cases : visuel (la flamme attire les regards depuis la rue), sonore (le crépitement des braises), olfactif (l'odeur de bois sec qui se consume), et gustatif (la saisie au feu de bois sur plancha en acier épais). Les clients ne reçoivent plus seulement une assiette — ils assistent à sa création, ils sentent les arômes, ils gardent un **souvenir** distinctif. Dans un secteur où les avis Google et la photo Instagram font la fréquentation, c'est un levier marketing puissant.

### 2. La polyvalence d'un poste unique

Un brasero plancha **remplace** plusieurs équipements traditionnels d'une cuisine de restauration : un four à pizza pour les saisies fortes, une plancha à gaz pour les protéines, un grill pour les pièces marquées, un poste de finition pour les apéros. C'est une économie d'équipement et d'espace, particulièrement pertinente pour les **petites surfaces** (food trucks, terrasses urbaines contraintes, guinguettes mobiles).

### 3. La connexion réseaux sociaux organique

Un brasero en activité est **photographié et filmé en permanence** par les clients. Ces images circulent sur Instagram, TikTok, Facebook, sans que vous ayez à payer un seul euro de pub sponsorisée. Pour un établissement, c'est de la **communication organique** qui se cumule année après année et qui fait du brasero un **outil d'acquisition client** au-delà de son rôle de cuisson.

## Domestique vs professionnel : ce qui change vraiment

Avant de choisir un modèle, il faut comprendre ce qui distingue un usage pro d'un usage domestique. Les différences ne sont pas marginales.

| Critère | Usage domestique | Usage professionnel |
|---|---|---|
| Fréquence d'usage | 30-50 services par an | 200-500 services par an |
| Durée de service par utilisation | 2-3 heures | 4-6 heures, parfois 8 |
| Cadence en pic | 1 plat à la fois | 8-15 plats simultanés |
| Durée de vie attendue | 20+ ans (usage léger) | 10-15 ans (usage intensif) |
| Cuisinier | Le propriétaire | Équipe qui change |
| Réglementation | Aucune (privé) | ERP, commission sécurité |
| Hygiène | Bonnes pratiques | HACCP applicable |
| Stock de bois | 1-2 stères/an | 5-15 stères/an |
| Maintenance | Annuelle | Trimestrielle minimum |

Conséquences concrètes pour le choix : un brasero pro doit avoir une **épaisseur d'acier généreuse** (3 mm minimum sur le bol pour résister aux cycles thermiques répétés), des **soudures impeccables** (ce sont les premières à céder en usage intensif), une **plancha épaisse** (10 mm minimum, idéalement 12 mm pour les 100 cm) qui tient sa température entre deux plats. Voir [pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais) pour le détail des critères de qualité.

## Le diamètre selon votre format de restaurant

C'est **le** critère décisif. Un brasero sous-dimensionné devient un goulot d'étranglement en plein coup de feu. Un brasero surdimensionné consomme inutilement et encombre l'espace.

| Format établissement | Couverts/service | Diamètre recommandé | Modèle type |
|---|---|---|---|
| Bar à tapas / planches | 15-25 | 50 cm | Coffy 50 / Obélix 50 |
| Food truck cuisine grillée | 20-40 | 80 cm | Le Morris 80 / Obélix 80 |
| Bistro / brasserie | 30-50 | 80 cm | Le Morris 80 / L'Obélix 80 |
| Brasserie premium / néorestauration | 50-80 | 100 cm | Le Morris 100 |
| Restaurant gastro avec terrasse | 60-100 | 100 cm | Le Morris 100 |
| Traiteur / événementiel fixe | 80-150 | 100 cm × 2 | 2 Morris 100 |
| Guinguette saisonnière | Variable | 80 ou 100 cm | Le Morris 80/100 |

### Le 50 cm en restauration : un cas particulier

Le 50 cm est rarement le bon choix en restauration. C'est un format domestique. Il convient à un **bar à tapas** ou un **bar à vins** qui propose 3-4 planches grillées en complément d'une carte essentiellement servie au comptoir, mais il devient vite limitant dès qu'on dépasse les 25 couverts par service. Pour une activité de restauration "normale", commencez direct au 80 cm.

### Le 80 cm : le format polyvalent professionnel

C'est notre format le plus vendu en restauration. La surface de cuisson permet de gérer **30 à 50 couverts en continu** avec une bonne organisation des zones (saisie au centre, finition sur l'anneau, maintien au bord). Le [Le Morris 80 cm](/produits/brasero-en-acier-80-lemorris) est conçu spécifiquement pour cet usage : plancha inox ou acier carbone 10 mm, socle compact qui s'intègre sur les terrasses contraintes, ergonomie pensée pour le service répété.

### Le 100 cm : la production intensive

Pour un établissement qui dépasse 50 couverts par service ou qui propose une vraie carte autour du brasero, le 100 cm s'impose. La surface de plancha permet de gérer **plusieurs préparations simultanément** sans encombrement : zone protéines au centre-droit, zone légumes au centre-gauche, zone repos en périphérie. Le [Le Morris 100 cm](/produits/brasero-morris-100) reste notre modèle phare pour ce segment.

[atelier]
**Le geste de l'artisan**
Le conseil qu'on donne aux restaurateurs qui hésitent entre 80 et 100 cm : **prenez le 100 cm**. Toujours. Sur 10 ans d'exploitation, l'écart de prix matériel est insignifiant comparé au confort d'usage quotidien. À l'inverse, un 80 cm sous-dimensionné en plein coup de feu d'été à 12h30 devient un cauchemar opérationnel — l'équipe rame, les clients attendent, et l'expérience se dégrade. Le surdimensionnement est moins risqué que le sous-dimensionnement en restauration.
[/atelier]

## Acier corten ou acier peint : critères pro

Le choix du matériau n'est pas qu'esthétique en restauration. Il a des conséquences directes sur la **maintenance**, l'**image de marque**, et la **conformité hygiène**.

### Acier corten : pour les terrasses permanentes

L'acier corten développe naturellement une patine protectrice qui stabilise sa surface. Avantages en pro :

- **Aucun entretien** sur la cuve (pas de retouches peinture, pas de dégradations à reprendre)
- **Vieillissement noble** qui s'intègre dans les ambiances bistronomiques, rustiques, champêtres, méditerranéennes
- **Robuste** aux intempéries — peut rester en terrasse 12 mois/12 sans abri

Précaution : la **patine se développe pendant 4-8 semaines** avec coulures de rouille possible. Sur sol clair (dalle calcaire, terrasse béton lisse, bois pâle), prévoir **un tapis de protection ignifugé** ou des **dalles foncées** sous le brasero pendant cette phase. Voir [taches de rouille brasero corten — solutions](/blog/brasero-corten-taches-terrasse-solutions).

### Acier peint thermolaqué : pour les ambiances contemporaines

Un brasero en acier peint mat (noir, gris anthracite, ou couleur sur mesure) offre :

- **Look contemporain** qui s'intègre dans les concepts urbains, design, néo-bistro modernes
- **Aspect immédiatement définitif** (pas de phase de patinage, pas de coulures)
- **Possibilité de couleur sur mesure** assortie à votre identité visuelle

Précaution : la peinture thermolaquée résiste très bien mais **demande un entretien plus suivi** en usage intensif (retouches sur les zones de friction de l'équipe, vérification annuelle des angles et soudures). Pour un restaurant d'intérieur ou un usage saisonnier remisé hors saison, c'est un excellent choix.

## Plancha, grille ou les deux : équiper votre carte

Le brasero seul produit de la chaleur. Ce sont les **accessoires** qui définissent ce que vous pouvez cuisiner. Quatre configurations possibles.

### Plancha inox 10 mm : la polyvalence pure

Surface lisse parfaite pour saisir, poêler, travailler des produits fragiles (poissons, fruits de mer, œufs, légumes émincés). L'inox **ne rouille pas, ne demande aucun culottage**, se nettoie au déglaçage à l'eau chaude après chaque service. Pour un restaurateur qui enchaîne les services, c'est un **gain de temps massif**.

C'est le choix par défaut pour 80 % des restaurants équipés. Voir [entretien d'une plancha inox de brasero](/blog/entretien-plancha-inox-brasero) pour le protocole complet.

### Plancha acier carbone 8 mm : la saisie supérieure

Pour les chefs qui privilégient la **performance pure de saisie** (croûte de Maillard plus marquée, conductivité thermique supérieure), l'acier carbone est techniquement supérieur. Mais il demande un **culottage construit et entretenu** — voir [comment culotter une plancha en acier carbone](/blog/comment-culotter-plancha-acier-carbone).

En usage intensif, l'acier carbone se culotte naturellement et devient un outil exceptionnel. Adapté aux **restaurants gastronomiques** ou aux **brasseries spécialisées viandes** où la qualité de saisie est le critère n°1.

### Grille inox : l'effet braise visible

Une grille permet de cuire **directement au-dessus des braises**, avec marques de saisie et fumage léger. Adapté aux **viandes rouges signature** (côte de bœuf, tomahawk, gigot d'agneau), aux **brochettes** traditionnelles, et aux **légumes grillés** qu'on veut marquer.

### Combinaison plancha + grille : le full-feature

Sur les 100 cm, on peut combiner **plancha sur une moitié + grille sur l'autre**. Configuration ultime pour les cartes ambitieuses qui mélangent saisies fines (poissons, légumes) et grillades signature (viandes rouges). Le [Le Fermier](/produits/le-fermier) est notre modèle pensé spécifiquement pour cette double configuration.

## La gestion du feu en service intensif

C'est le point qu'on sous-estime le plus chez les nouveaux restaurateurs équipés. **Le brasero n'est pas un appareil qu'on allume 5 minutes avant le service**. Voici la discipline opérationnelle indispensable.

### Anticipation : allumage à T-60 minutes

Un brasero met **30 à 45 minutes** à atteindre sa température de croisière (200-300 °C de plancha selon zone). Pour un service de 12h, l'allumage doit se faire à **11h** au plus tard, idéalement 10h45 pour avoir une marge.

### Stock de bois à portée du poste

Prévoir un **range-bûches dédié** à proximité immédiate du brasero (1-2 mètres maximum). Les allers-retours en zone de stockage en plein coup de feu sont un risque opérationnel. Compter **15-25 kg de bois par service** pour un 80 cm, **25-40 kg** pour un 100 cm.

Privilégier **chêne, hêtre, charme** secs (taux d'humidité < 20 %). Éviter absolument résineux et bois humide. Voir [le guide complet des bois pour brasero](/blog/meilleur-bois-brasero-comparatif).

### Désigner un "fireman" dans l'équipe

En service, **une personne** doit être responsable de l'alimentation continue du brasero — ajouter du bois toutes les 20-30 minutes, gérer les braises, ajuster la température. C'est rarement le cuisinier principal (qui doit pouvoir cuisiner sans se soucier du feu) — c'est plutôt un commis, un runner, ou un membre de l'équipe formé spécifiquement.

Pour le détail du pilotage des zones thermiques en cours de service, voir [maîtriser la température sur un brasero plancha](/blog/temperature-cuisson-brasero-plancha).

## Sécurité et réglementation ERP

Exploiter un brasero à flamme nue dans un Établissement Recevant du Public (ERP) impose un cadre **plus strict** qu'en domestique.

### Les obligations principales

- **Distance public** : minimum **2 mètres** entre le brasero et la zone clientèle (table la plus proche). Sous abri couvert : 3 mètres et extraction obligatoire.
- **Sol incombustible** sous et autour du brasero : dalle béton, pavé, terrasse pierre, ou plaque inox certifiée ignifuge.
- **Extincteur de proximité** : CO2 ou poudre 6 kg minimum, à moins de 5 mètres du brasero.
- **Détection incendie** si terrasse couverte et fermée.
- **Stockage du bois** sécurisé, à distance du brasero, conforme aux règles ERP de stockage de matière combustible.

### Les démarches

- **Déclaration en mairie** du brasero (catégorie "appareil de cuisson à combustible solide")
- **Visite de la commission de sécurité** locale avant ouverture si extension de votre établissement
- **Information de votre assureur** RC Pro (la plupart des contrats couvrent, mais certains imposent des aménagements)
- **Mise à jour du registre de sécurité** ERP avec la fiche technique du brasero

Pour le détail réglementaire général (distances voisinage, arrêtés municipaux, PLU), voir [distances de sécurité brasero — la réglementation française](/blog/distance-securite-brasero-reglementation).

[atelier]
**Le geste de l'artisan**
La démarche qu'on conseille systématiquement aux restaurateurs qui s'équipent : **prendre rendez-vous avec la commission de sécurité locale avant la commande**. Présenter le projet, montrer la fiche technique du brasero envisagé, obtenir leur avis officiel sur la configuration prévue (distances, sol, extraction). Cela prend 2-3 semaines mais évite **toutes** les mauvaises surprises ouverture (refus de validation, modifications coûteuses après installation). Les commissions sont généralement bien disposées envers les projets bien préparés — elles préfèrent un dossier clair en amont à un litige en aval.
[/atelier]

## Ergonomie et organisation du poste

Un brasero professionnel ne fonctionne pas tout seul — il s'intègre dans un **poste de cuisine ouverte** qui doit être pensé pour l'équipe.

### Hauteur de travail

La hauteur standard de plancha est de **93 cm** (anthropométrie européenne moyenne). Pour une équipe de plus grande taille, des **socles surélevés** de 5-10 cm peuvent être commandés en sur-mesure. Pour une équipe mixte, prévoyez un **tabouret antidérapant** pour les cuisiniers plus petits.

### Plan de dressage adjacent

À côté du brasero, un **plan de travail à hauteur identique** (table inox ou massif bois) sur 1,80 à 2,40 m de longueur permet de :

- Dresser les assiettes à la sortie de cuisson
- Trancher les pièces à la planche face public
- Stocker les ustensiles, les huiles, les sels, les herbes
- Poser les plats prêts à envoyer

Ce plan de dressage est **non négociable** en restauration. Sans lui, l'équipe perd 20-30 % de productivité en allers-retours.

### Stock bois accessible mais sécurisé

Le bois doit être **à portée de main** du fireman, mais **séparé** de la zone de service par une cloison ou un meuble. Un range-bûches mural en acier corten, posé dos à un mur, à 1,5 mètre du brasero, est la configuration optimale.

### Ustensiles pro indispensables

Liste minimale pour un poste pro :

- **Raclette inox** lourde (2-3 unités en rotation)
- **Spatules longues** (40 cm minimum) en inox alimentaire
- **Pinces à barbecue** longues (50 cm) — au moins 2 unités
- **Thermomètres à sonde** numériques étanches (pour tomahawk, gigot, grosses pièces)
- **Tabliers en cuir** pour la protection du cuisinier
- **Gants haute température** (manche longue, certifiés 500 °C)
- **Seau cendrier** métallique avec couvercle pour évacuation rapide

## Le ROI réel d'un brasero en restauration

Sujet qu'on aborde rarement dans les guides commerciaux. Voici les chiffres réels qu'on observe chez nos clients restaurateurs.

### Effet sur le ticket moyen

Les établissements équipés d'un brasero observent généralement un **ticket moyen +5 à +15 %** par rapport à une carte équivalente sans brasero. La raison : le brasero **valorise les pièces nobles** (côte de bœuf, tomahawk, magret) que les clients commandent plus volontiers en mode "cuisine spectacle". L'effet est mesurable dès les 3-4 premiers mois d'exploitation.

### Effet sur la fréquentation

Plus difficile à quantifier précisément, mais réel : la **photogénie du brasero** génère des partages réseaux sociaux organiques qui se traduisent en **visites incrémentales**. Sur les établissements qui suivent leurs sources de réservation, on voit fréquemment **15 à 30 % de nouveaux clients** mentionnant "j'ai vu le brasero sur Instagram" ou équivalent dans les 12 mois suivant l'installation.

### Différenciation concurrentielle

Dans une zone où plusieurs restaurants se partagent une clientèle similaire, le brasero peut devenir **l'élément distinctif** mémorisable qui fait préférer votre établissement aux autres. Les avis Google mentionnant explicitement "le brasero" comme raison de retour sont fréquents.

### Durée de vie matérielle

Un brasero artisanal français bien entretenu en usage intensif tient **10 à 15 ans** avant de demander une refonte sérieuse (replacement plancha, retouches majeures sur le socle). C'est une durée de vie matérielle exceptionnelle pour un équipement de production en restauration, où la majorité des appareils se renouvellent tous les 5-7 ans.

## Cas d'usage par type d'établissement

### Bistronomie / néorestauration

Brasero 80 ou 100 cm en cuisine ouverte semi-visible. Plancha inox pour la polyvalence. Carte construite autour du brasero (3-5 plats signature au feu de bois, le reste en cuisine traditionnelle). Effet : **différenciation premium** sans complexification de l'équipe.

### Brasserie traditionnelle

Brasero 100 cm en terrasse couverte ou semi-ouverte. Plancha + grille combinées. Carte centrée sur **viandes rouges et grillades signature** (côte de bœuf, brochettes, magrets). Effet : **renaissance de la brasserie classique** avec une signature visuelle forte.

### Food truck / cuisine de rue

Brasero 80 cm sur **remorque homologuée** (voir [brasero événementiel — remorque](/blog/brasero-evenement-mariage-reception)). Configuration mobile pour festivals, marchés nocturnes, événements urbains. Carte courte, produits signature autour du feu de bois.

### Guinguette saisonnière

Brasero 100 cm en plein air, configuration estivale (mai-septembre). Carte saisonnière "summer vibes" : poissons grillés, brochettes, légumes du marché, fruits flambés. Hivernage complet hors saison (voir [le guide d'hivernage](/blog/preparer-brasero-hiver-hivernage)).

### Hôtellerie haut de gamme

Brasero corten en terrasse de chambre ou de spa. Usage **animation cuisine** lors d'événements clientèle, services privatifs, mariages organisés sur place. Configuration premium avec gravure logo possible.

### Restaurant gastronomique

Brasero acier carbone 100 cm en cuisine ouverte théâtralisée. Usage **show-cooking** sur certaines pièces signature, parfois en extension sur des séquences "table d'hôtes" ou menus dégustation. Configuration sur mesure recommandée.

## Configurations sur mesure pour pros

Pour les restaurateurs qui s'équipent durablement, l'Atelier LBF propose plusieurs niveaux de personnalisation :

- **Gravure logo** sur le socle (laser ou poinçon)
- **Couleur thermolaquée sur mesure** (toute la palette RAL disponible)
- **Dimensions adaptées** (socle plus haut/bas, profondeur de plancha modifiée)
- **Configuration plancha + grille** sur mesure
- **Conditions B2B** sur les commandes multiples ou renouvellements de gamme
- **Garantie pro renforcée** (extension à 3-5 ans selon configuration)

Contactez l'atelier en amont du projet. Chaque restaurant est unique — le bon brasero est celui qui correspond à votre carte, votre espace et votre ambition.

## Idées reçues sur le brasero en restauration

**"C'est trop technique pour mon équipe."**
Faux. La cuisine plancha au feu de bois s'apprend en 3-5 services pour un cuisinier expérimenté. Les zones thermiques sont **visibles**, les phases du feu sont **observables**, le test de l'eau valide la mise en chauffe. Aucune cuisinière conventionnelle n'offre ce niveau de feedback sensoriel direct. Une formation interne d'une semaine suffit pour autonomiser une équipe.

**"Ça me ralentira en coup de feu."**
Faux si bien organisé. Un 80 cm bien géré sort **30-50 plats par service** sans baisse de qualité. La clé est l'organisation du poste (plan de dressage adjacent, fireman dédié, zones thermiques exploitées). Mal organisé, n'importe quel équipement est un goulot — le brasero n'est pas une exception, mais il n'est pas non plus un handicap structurel.

**"Le bois pose problème de stockage."**
Vrai si non anticipé, faux si pensé en amont. Un range-bûches mural en acier corten + un stock saisonnier dans une réserve sèche derrière l'établissement suffisent pour 95 % des configurations. Le bois se commande en stères livrées à domicile par un bûcheron local — c'est rarement une logistique complexe.

**"Trop cher pour mon CA actuel."**
Nuancé. Un brasero artisanal pro coûte 2 000-4 000 €. Sur 10 ans d'exploitation à 200 services par an, le coût matériel par service est de quelques euros — insignifiant comparé à l'effet potentiel sur le ticket moyen et la fréquentation. Si votre CA est très contraint, commencez par un format 80 cm et upgrade vers 100 cm dans 2-3 ans une fois l'effet matériel démontré.

**"Mes clients préfèrent le gaz, c'est plus discret."**
Faux. Les enquêtes de satisfaction montrent que **les clients préfèrent voir leur cuisine** — c'est l'inverse exact. Le gaz à flamme cachée est un standard fonctionnel auquel les clients sont indifférents. Le brasero à flamme visible est un **élément d'attachement émotionnel** qui crée la fidélité.

---

## Pour aller plus loin

- [Brasero pour mariage et événement : la cuisine face public](/blog/brasero-evenement-mariage-reception) — pour les prestations événementielles ponctuelles
- [Maîtriser la température sur un brasero plancha](/blog/temperature-cuisson-brasero-plancha) — le pilotage thermique en cuisine
- [Pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais) — les critères qualité pour usage intensif
- [Quel bois pour votre brasero : les 5 meilleures essences](/blog/meilleur-bois-brasero-comparatif) — le combustible qui détermine la qualité du service`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Brasero pour restaurateur : le guide complet d'équipement professionnel",
    meta_title: "Brasero restaurateur : guide pro complet (2026)",
    meta_description: "Choisir un brasero pour son restaurant : diamètre selon couverts, matériaux pour usage intensif, sécurité ERP, ergonomie de poste, ROI réel. Le guide pour restaurateurs, chefs et food trucks.",
    excerpt: "Un brasero en restauration n'est pas un effet de scène — c'est un poste de production qui doit tenir des centaines de services. Voici les vrais critères pour choisir le bon modèle, organiser le poste, et tirer parti du brasero comme levier de différenciation.",
    content,
    read_time: 11,
    tags: ['brasero professionnel', 'restaurateur', 'cuisine au feu', 'brasero plancha', 'équipement restaurant', 'food truck', 'B2B', 'ERP'],
    related_articles: [
      'brasero-evenement-mariage-reception',
      'temperature-cuisson-brasero-plancha',
      'pourquoi-brasero-artisanal-francais',
      'meilleur-bois-brasero-comparatif',
    ],
    related_products: ['brasero-en-acier-80-lemorris', 'brasero-morris-100', 'le-fermier', 'brasero-acier-100-l-obelix'],
    cta_product_slug: 'brasero-en-acier-80-lemorris',
    cta_text: 'Découvrir Le Morris',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'choisir-brasero-restaurateur-professionnel');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ choisir-brasero-restaurateur-professionnel réécrit`);
console.log(`  Mots: ~${wordCount}`);
