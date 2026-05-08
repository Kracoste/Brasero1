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

const content = `Un mariage, ce n'est pas un repas — c'est un souvenir collectif. Une soirée d'été à 30 personnes, ce n'est pas un dîner — c'est un moment qu'on raconte encore six mois plus tard. Un anniversaire d'adulte, un gala d'entreprise, une réception publique : tous ces formats ont quelque chose en commun. Les invités vont se souvenir de **trois éléments** précis du repas — le vin, l'ambiance, et la **scène de cuisine**. Le brasero coche ces trois cases en un seul équipement.

> En événementiel, le brasero n'est pas un équipement de cuisine. C'est une scène où la cuisine devient spectacle.

Cet article est le **guide complet d'usage événementiel du brasero plancha** — pour wedding planners, traiteurs, agences événementielles, organisateurs particuliers, restaurateurs prestataires extérieurs et tous ceux qui veulent transformer une réception en moment marquant. Six typologies d'événements (du mariage au food truck), choix du modèle, cuisine face public, menus qui fonctionnent, remorque brasero pour prestation nomade, logistique terrain, timing du service, retours d'expérience réels, et configurations sur mesure pour pros.

---

## Pourquoi le brasero transforme un événement

Les convives d'un événement gardent en mémoire **trois choses** du repas : le vin, l'ambiance générale, et le **spectacle de la cuisine**. Un brasero installé au cœur d'une réception active ces trois leviers simultanément :

[chiffre]3 sens|sont activés simultanément par un brasero — vue, ouïe, odorat — contre un seul pour un buffet classique[/chiffre]

- **Visuel** — la flamme attire les regards dès la tombée du jour, et le bol incandescent reste un point focal pendant tout le service. Sur photos et vidéos, un brasero en fonctionnement génère immédiatement des images que les invités, les photographes et les comptes Instagram partagent spontanément. C'est de la **publicité gratuite** pour le traiteur ou le wedding planner.
- **Sensoriel** — la chaleur radiante perceptible à 3 mètres, le crépitement des braises, l'odeur du bois sec qui se consume créent une ambiance qu'aucun four professionnel ni plancha à gaz ne peut reproduire. C'est ce qui transforme une réception "réussie" en réception "mémorable".
- **Gustatif** — la cuisson au feu de bois sur plancha en acier épais développe un profil aromatique impossible ailleurs (saisie nette, fumée subtile, croûte de Maillard prononcée). Voir [la science du goût fumé](/blog/cuisson-feu-bois-gout-fume-plancha) pour les mécanismes chimiques.

C'est pour ces trois raisons cumulées que les wedding planners haut de gamme et les traiteurs événementiels intègrent de plus en plus de braseros dans leurs concepts depuis 2020. Ce n'est pas une mode — c'est un **changement structurel** dans la manière de concevoir l'expérience invité.

## Les 6 typologies d'événements brasero

Le brasero ne s'utilise pas de la même manière selon le format de l'événement. Voici les six configurations principales et leurs spécificités.

### 1. Mariage et réception civile (50-200 convives)

Le **format reine** de l'événementiel brasero. Cocktail dînatoire avec brasero comme animation de cuisine, repas assis avec brasero en cuisine ouverte, ou format mixte (apéro autour du brasero + repas assis). Le brasero devient un **point d'ancrage visuel** des photos de mariage, souvent au centre du décor.

### 2. Soirée privée / garden party (20-50 personnes)

Format **intermédiaire** : pas un événement professionnel formel, mais plus qu'un dîner familial. Crémaillère, anniversaire d'adulte (40 ans, 50 ans, retraite), réception entre amis pour une occasion spéciale. Le brasero installé dans un jardin privé crée une ambiance "guinguette premium" qui dure souvent très tard dans la nuit.

### 3. Anniversaire (adulte ou enfant)

**Pour adulte** : c'est l'occasion type de marquer le coup avec un brasero — anniversaires des dizaines (40, 50, 60 ans), départs en retraite, événements personnels marquants. La cuisine face public devient le fil rouge de la soirée.

**Pour enfant** : possible, mais avec **précautions renforcées**. Distance de sécurité doublée (3 m minimum vs 1,5 m), barrière physique (mobilier disposé en cercle dégagé), surveillance constante d'un adulte dédié pendant la cuisson. Privilégier un format compact 50 cm pour limiter la zone de danger, et activer le brasero après le passage des enfants en zone de jeu.

### 4. Réception d'entreprise / gala / soirée VIP

Lancement de produit, soirée client, séminaire de cohésion, gala caritatif, soirée RH. Le brasero apporte une **dimension expérientielle** que les buffets classiques n'offrent plus. Particulièrement efficace pour les **événements B2B haut de gamme** où les invités voient passer des centaines de prestations dans l'année — il faut se différencier.

### 5. Festival / événement public

Salon de l'agriculture, foire commerciale, festival gastronomique, marché nocturne, salon professionnel. Le brasero devient à la fois **outil de cuisine** et **stand visible** depuis les allées. Demande une logistique spécifique (autorisation feu en lieu public, distance sécurité, présence sécurité incendie).

### 6. Prestation traiteur nomade / food truck brasero

L'usage le plus complexe : **brasero installé sur remorque ou véhicule** pour interventions sur sites multiples (mariages itinérants, festivals, salons, prestations à domicile). Demande une remorque homologuée et des solutions de transport spécifiques (voir section dédiée plus bas).

## Quel modèle pour quel événement

| Événement | Convives | Format recommandé | Modèle type |
|---|---|---|---|
| Soirée privée intime | 10-20 | 80 cm | Obélix 80 / Morris 80 |
| Anniversaire / garden party | 20-40 | 80 cm ou 100 cm | Morris 80 / Morris 100 |
| Réception d'entreprise | 40-80 | 100 cm | Morris 100 / Obélix 100 |
| Mariage standard | 80-150 | 100 cm | Morris 100 (voire 2 unités) |
| Grand mariage / gala | 150+ | 2× 100 cm | 2 Morris 100 en parallèle |
| Festival / public | Variable | 100 cm + remorque | Configuration dédiée |
| Prestation nomade traiteur | Variable | 80 ou 100 cm sur remorque | Sur mesure |

### Le critère visuel : Le Morris vs autres modèles

Pour un usage événementiel, deux critères priment sur la pure capacité de cuisson : la **présence visuelle** et la **photogénie**. Tous nos braseros 100 cm ont la même surface utile, mais ils n'ont pas la même **personnalité formelle**.

[Le Morris 100 cm](/produits/brasero-morris-100) a été pensé spécifiquement pour l'événementiel haut de gamme et la restauration prestige. Ses lignes plus marquées, son socle iconique, ses proportions étudiées en font un objet qui **fonctionne comme une sculpture habitée**, qui s'active à l'allumage et qui imprime visuellement chaque photo de l'événement. C'est le modèle que nous recommandons systématiquement aux wedding planners et aux traiteurs qui travaillent sur du premium.

L'**acier corten** avec sa patine brun-orangé évolutive produit visuellement le résultat le plus photogénique. C'est un matériau "vivant" qui prend la lumière différemment selon l'heure de la journée — apparence rouge cuivré au soleil couchant, brun chaud sous lumière artificielle. Pour un usage événementiel, c'est le matériau de choix sans hésitation.

## La cuisine face public : l'effet teppanyaki occidental

Un brasero événementiel bien mis en scène, c'est l'**équivalent occidental d'un comptoir teppanyaki japonais** : une cuisine ouverte, à l'air libre, où le chef opère **face aux convives** plutôt que caché en cuisine.

Pour que le concept fonctionne, il faut penser l'aménagement comme une **scène théâtrale** :

- **Comptoir de dressage** — table haute (90-100 cm) à côté du brasero, longueur 1,80 à 2,40 m, pour dresser les assiettes à la sortie de cuisson. Préfère une table massive en bois ou inox brossé qui supporte le passage rapide.
- **Planche à découper bois massif** — pour trancher les pièces face au public (côte de bœuf, gigot, tomahawk, magret). Le **geste de découpe** est aussi spectaculaire que la cuisson.
- **Éclairage** — en soirée, éclairer la zone de travail sans tuer l'ambiance de la flamme. **Spot chaud** dirigé sur la planche de découpe (2700K), pas sur le brasero. La flamme reste la source lumineuse principale.
- **Chef visible** — l'équipe de cuisine doit être en tenue propre et présentable (blouse blanche ou tablier en cuir), capable d'**interagir avec les invités** : expliquer la cuisson, raconter le bois, présenter la viande. Le chef devient ambassadeur du brasero.
- **Distance public** — un cordon de séparation discret (corde, banc, tapis tracé au sol) à 1,5-2 m du brasero. Les invités peuvent observer sans risquer la chaleur.

[atelier]
**Le geste de l'artisan**
Le détail qui change tout sur les prestations événementielles : la **mise en scène du bois**. Les bûches stockées à proximité du brasero ne devraient pas être cachées dans une caisse — elles doivent être **visibles, empilées proprement** (style scandinave, croisé, hauteur 1 m), et faire partie du décor. Les invités voient le bois, comprennent que c'est du **vrai feu de bois**, et toute la mise en scène prend du sens. Sans le bois visible, l'effet "cuisine traditionnelle premium" s'efface — on a juste un appareil de cuisson au milieu d'une fête.
[/atelier]

## Les menus qui marchent en événementiel brasero

Un brasero plancha permet une **gamme étonnamment large** de cuissons en service continu. Voici les menus types qui fonctionnent réellement, par moment du repas.

### Apéritif et amuse-bouche

- **Gambas entières flambées** au pastis (effet visuel garanti, 2 min de cuisson)
- **Tartines bruschetta** chaudes à la mozzarella et tomates fraîches
- **Brochettes de fromage halloumi** + tomates confites
- **Mini-burgers** plancha avec pain toasté
- **Chorizo entier** doré sur la plancha, tranché et servi sur pic en bois

### Entrée

- **Carpaccio de bœuf juste tiédi** — viande crue saisie 5 secondes par face pour effet température
- **Saint-Jacques caramélisées** au beurre noisette
- **Asperges vertes** rôties à l'huile et fleur de sel
- **Demi-homards** ou langoustines flambés

### Plat principal

- **Côte de bœuf** entière saisie face public puis tranchée à la planche (effet maximum)
- **Magrets de canard** en série, croûte croustillante, chair rosée
- **Gigot d'agneau** désossé puis saisi sur les deux faces
- **Poulet en crapaudine** (poulet aplati) cuisson lente sur la plancha
- **Pavés de saumon** côté peau croustillant

### Dessert

- **Ananas flambé au rhum** — feu vif, effet visuel exceptionnel pour finir le repas
- **Pêches caramélisées** au sucre roux et vanille
- **Bananes flambées** au cognac
- **Camembert grillé** servi avec pain de campagne et confiture

### Tableau temps de cuisson en service événementiel

| Pièce | Quantité par fournée 100 cm | Temps |
|---|---|---|
| Gambas | 30-40 unités | 2 min |
| Saint-Jacques | 25-30 unités | 90 s |
| Magrets canard | 8-10 entiers | 8-10 min |
| Côtes de bœuf | 1-2 (1,5 kg) | 12-15 min + repos |
| Pavés saumon | 12-15 unités | 4-5 min |
| Ananas tranches | 20-25 tranches | 3 min |

Pour les détails de cuisson par catégorie, voir [recettes viandes rouges](/blog/recettes-viandes-rouges-brasero-plancha) et [cuissons délicates poissons et légumes](/blog/legumes-poissons-brasero-plancha-cuissons-delicates).

## La remorque brasero : la prestation nomade

Pour les **traiteurs et chefs à domicile** qui interviennent sur plusieurs sites différents (mariages itinérants, festivals, salons, prestations clientèle), la solution clé est la **remorque brasero** — un brasero installé sur un châssis homologué pour la route, transportable derrière n'importe quel véhicule équipé d'un attelage.

### Configurations possibles

- **Remorque légère mono-essieu** (PTAC < 750 kg) — adapté aux braseros 80 cm. Tracté par n'importe quel véhicule sans permis BE. Encombrement réduit, manœuvres faciles.
- **Remorque double essieu** (PTAC 750-1500 kg) — pour braseros 100 cm + équipement (planche de découpe, comptoir, range-bûches, accessoires). Demande un permis BE selon la masse cumulée du véhicule tracteur + remorque.
- **Châssis fixe sur véhicule utilitaire** — brasero soudé sur le plateau d'un Trafic, Jumper ou plateau pick-up. Configuration haut de gamme pour traiteurs établis, transformation type "food truck brasero".

### Critères techniques essentiels

- **Homologation route** — la remorque doit être immatriculée et assurée. Toute remorque non homologuée est interdite sur voie publique.
- **Système d'arrimage** du brasero sur le châssis — sangles certifiées, points d'ancrage soudés, garde-corps. Un brasero qui bouge en virage, c'est l'accident assuré.
- **Distance brasero/châssis** — minimum 30 cm pour éviter la propagation de chaleur vers les éléments structuraux et les pneus.
- **Stockage du bois** — coffre dédié, bâché, éloigné du brasero éteint pendant le transport.
- **Roulement à froid uniquement** — un brasero **ne se transporte jamais allumé**. Aucune réglementation routière française n'autorise le transport d'un foyer en combustion.

### Cas d'usage concrets

- **Traiteur événementiel itinérant** — 30-50 prestations par an, mariages multiples, recettage 4-6 mois à l'avance
- **Food truck brasero** — service de cuisine de rue, festivals gastronomiques, marchés nocturnes
- **Domaine de réception itinérant** — château ou domaine qui propose ses prestations brasero hors site, en dehors du domaine principal

Pour les **configurations sur mesure** brasero + remorque, nous travaillons en partenariat avec des constructeurs spécialisés en remorques événementielles homologuées. N'hésitez pas à nous contacter en amont du projet pour étudier la configuration la plus adaptée.

## Logistique d'un événement brasero statique

C'est l'aspect que **beaucoup d'organisateurs sous-estiment**. Un brasero 100 cm n'est pas un accessoire qu'on transporte dans un break.

### Poids et manutention

- Brasero **100 cm** : 100 à 155 kg selon modèle, hors options
- Brasero **80 cm** : 89 à 96 kg
- Plus accessoires (planche, comptoir, bois) : prévoir + 80-120 kg supplémentaires

À prévoir pour un transport ponctuel :
- **Camion utilitaire** type Trafic, Jumper, Master selon le modèle
- **Diable trois roues** pour le déplacement en intérieur (moquettes, dénivelés faibles)
- **Deux personnes minimum** pour la manutention, idéalement quatre pour les longues distances
- Un trajet **sans marches**, ou rampe pour les dénivelés

### Sol et emplacement

Le brasero doit être posé sur un sol **stable, plat et non inflammable**.

À éviter absolument : pelouse (affaissement sous le poids cumulé brasero + cuisinier + service, et risque d'étincelles), terrasse bois sans protection (voir [le guide terrasse bois](/blog/brasero-terrasse-bois-securite)), gravier fin instable.

Idéal : **dalle béton, pavé, terrasse carrelage, plaque inox de protection** posée sur le sol comme socle nomade.

### Dégagement public et sécurité

- **2 mètres minimum** de tous côtés pour un événement avec public proche (vs 1,5 m en domestique)
- Pour événements **avec enfants** : 3 m minimum, barrière physique (mobilier en cercle, cordon)
- Présence d'un **extincteur** de proximité (CO2 ou poudre 6 kg) — obligatoire dans certaines configurations professionnelles
- Sortie de secours dégagée

### Alimentation en bois

Pour un service de **3 à 4 heures** avec un 100 cm en activité continue :
- **0,15 à 0,20 stère** de bois sec (30-40 bûches standard, ou une grosse brouette pleine)
- Privilégier **chêne, hêtre, charme** secs (taux humidité < 20 %)
- Éviter résineux (étincelles dangereuses en public, fumée excessive)

Voir [le guide complet des bois pour brasero](/blog/meilleur-bois-brasero-comparatif) pour le détail des essences.

## Le timing d'un service événementiel

| Étape | Avant le service | Durée | Action |
|---|---|---|---|
| Installation matérielle | T-3 h | 30-45 min | Posage brasero, comptoir, planche |
| Préparation bois | T-2 h | 15 min | Empilage, allume-feu prêts |
| Allumage | T-1 h | 5 min | Petit bois, montée progressive |
| Phase braises | T-30 min | — | Foyer mature, plancha à 200 °C |
| Test plancha | T-15 min | 5 min | Test eau Leidenfrost (validation) |
| **Service** | T0 | 3-4 h | Production en continu |
| Fin de service | T+3-4 h | — | Arrêt cuisson, brasero finit en braises |
| Refroidissement | T+5-6 h | 1-2 h | Brasero non manipulable encore |
| Démontage | T+6-7 h | 30 min | Évacuation cendres, nettoyage |

**Important** : le brasero ne se manipule pas immédiatement après service. Le bol reste à 200-300 °C pendant 1 à 2 heures après extinction. Prévoyez ce temps dans votre planning de démontage.

## Trois cas réels de prestations

### Cas 1 — Mariage 80 convives en Drôme

**Format** : mariage hors les murs en domaine viticole.
**Menu** : carpaccio chaud à l'apéritif, côtes de bœuf en plat principal, ananas flambés au rhum en dessert.
**Logistique** : Morris 100 cm installé à T-3 h sur dalle béton du domaine. Allumage T-1 h. Service continu de 19h à 22h30.
**Consommation** : 0,2 stère de chêne sec.
**Effet** : brasero filmé et photographié en permanence par les invités. Trois invités ont ensuite commandé le même modèle pour leur résidence. **L'effet bouche-à-oreille typique** des prestations brasero réussies.

### Cas 2 — Soirée privée 30 personnes

**Format** : anniversaire 40 ans en jardin privé.
**Menu** : apéritif plancha (gambas, halloumi, brochettes), magrets de canard en plat, pêches caramélisées en dessert.
**Logistique** : Obélix 80 cm sur terrasse pierre. Allumage tôt (T-1h30) pour permettre l'apéro qui commence dès l'arrivée des invités.
**Consommation** : 0,12 stère.
**Effet** : la soirée s'est étirée jusqu'à 2h du matin autour du brasero — exactement le format que recherchait le client.

### Cas 3 — Réception d'entreprise 150 personnes

**Format** : lancement de produit en gala B2B premium dans une ancienne grange rénovée.
**Menu** : apéritif dînatoire intégral, 8 stations de cuisson en parallèle dont 2 braseros 100 cm en cuisine ouverte au centre.
**Logistique** : 2 Morris 100 alignés. Équipe de 4 chefs en blouse, planches de découpe massives en chêne. Éclairage scénique chaud sur les comptoirs.
**Consommation** : 0,4 stère cumulée sur 4 h.
**Effet** : photos de la prestation utilisées par l'agence événementielle pour ses présentations commerciales pendant les deux années suivantes.

[atelier]
**Le geste de l'artisan**
Ce qu'on apprend en 5 ans de prestations événementielles : **le brasero ne fait pas tout seul un événement réussi**. Il faut un **chef qui aime cuisiner devant les gens**, pas un chef qui s'enferme dans sa cuisine. Les meilleurs prestataires brasero sont ceux qui aiment l'interaction avec le public — qui expliquent, qui plaisantent, qui partagent leur passion du feu de bois. Un grand chef silencieux derrière son brasero produit une prestation médiocre. Un chef passionné au feu de joie produit une prestation inoubliable. Le matériel est secondaire — c'est l'humain qui fait l'événement.
[/atelier]

## Achat, location, ou configuration sur mesure

### Pour traiteur récurrent / wedding planner

**Achat** rentabilisé dès la 10e à 15e prestation. Un Morris 100 amorti sur 20 ans représente un coût matériel marginal par événement. Les pros qui s'équipent commandent souvent **deux unités identiques** pour pouvoir gérer les très grands événements (150+ convives) ou avoir une unité de secours.

### Pour usage ponctuel (un seul événement particulier)

**Location** auprès de loueurs spécialisés événementiel, ou auprès de traiteurs équipés (qui louent leur matériel hors prestation). L'Atelier LBF ne fait pas de location directe.

### Configurations sur mesure pour pros

Pour les professionnels qui s'équipent durablement, nous proposons :

- **Gravure logo** sur le socle (laser ou poinçon)
- **Socle personnalisé** (couleur thermolaquée spécifique, dimensions adaptées)
- **Configuration sur remorque** en partenariat avec constructeurs spécialisés
- **Conditions B2B** sur les commandes multiples ou les renouvellements de gamme

Contactez-nous en amont du projet pour étudier ensemble la configuration la plus adaptée à votre activité.

## Le bouche-à-oreille pour les pros

L'argument économique le plus puissant pour un wedding planner ou un traiteur qui hésite à investir dans un brasero : **l'effet de bouche-à-oreille indirect**.

Un brasero en activité dans une réception est **photographié et filmé en permanence** par les invités, les photographes officiels, les vidéastes. Ces images circulent sur les réseaux sociaux, dans les présentations commerciales, dans les portfolios. Elles **génèrent des demandes** auprès du prestataire qui a fait la prestation, et auprès du fabricant du brasero. **C'est de la publicité gratuite** qui dure pendant 2-3 ans après l'événement.

À l'inverse, un buffet classique ne génère **aucune image marquante**. Personne ne photographie un buffet. Le différenciateur visuel devient un facteur direct d'acquisition de nouveaux clients.

## Idées reçues sur le brasero événementiel

**"C'est trop dangereux pour un événement avec enfants."**
Faux avec dégagement adapté. 3 m de distance + barrière physique (mobilier disposé en cercle) + un adulte dédié à la surveillance pendant la cuisson suffisent à neutraliser le risque. Plus de 80 % des mariages en France ont des enfants invités, et les prestations brasero se font sans incident.

**"Le bois fume sur les robes des invités."**
Faux avec bois sec dur (chêne, hêtre, charme). Un bois bien sec brûle proprement, avec une fumée fine et neutre qui ne marque ni les vêtements ni les cheveux. Le problème n'apparaît qu'avec du bois humide ou résineux — qu'on évite scrupuleusement en événementiel.

**"C'est compliqué pour le chef qui ne connaît pas."**
Faux après 1 prestation. Un chef professionnel maîtrise les bases du feu de bois en 2-3 services. La courbe d'apprentissage est rapide parce que la **cuisine plancha est techniquement simple** (zones thermiques visibles, contact direct avec l'aliment, pas de paramètres cachés à régler).

**"Mieux vaut un kamado pour un événement haut de gamme."**
Non. Le kamado est excellent pour la **cuisson lente fermée** (smoking, pulled pork, basse température), mais il ne joue **pas le rôle de scène** d'un brasero ouvert. Pour l'événementiel, c'est le **spectacle visuel** qui compte autant que la cuisson — et là, le brasero plancha est imbattable.

**"Les wedding planners qui prennent du brasero, c'est juste une mode."**
Faux. C'est un **changement structurel** de la conception des événements depuis 2018-2020 : passage de la "réception classique" à l'"expérience invité immersive". Le brasero répond à cette demande de manière unique, avec un coût matériel raisonnable rapporté à la durée de vie de l'objet.

---

## Pour aller plus loin

- [Comment choisir son braséro quand on est restaurateur](/blog/choisir-brasero-restaurateur-professionnel) — pour les pros de la restauration en usage permanent
- [Quel brasero choisir selon le nombre de convives](/blog/quel-brasero-choisir-nombre-convives) — pour le détail des tailles
- [Cuisson au feu de bois : la science du goût fumé](/blog/cuisson-feu-bois-gout-fume-plancha) — la chimie qui fait la différence en bouche
- [Pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais) — l'investissement durable pour les pros`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Brasero pour mariage, événement et soirée : la cuisine face public qui marque",
    meta_title: "Brasero mariage, événement, soirée : guide pro (2026)",
    meta_description: "Brasero pour mariage, soirée, anniversaire, réception d'entreprise ou prestation nomade : choix du modèle, cuisine face public, remorque brasero, logistique, menus, cas réels.",
    excerpt: "Mariage, soirée d'été, anniversaire, gala, prestation nomade : le brasero transforme un événement en souvenir collectif. Voici comment l'orchestrer selon le format — du dîner intime à la réception 150 personnes, en statique ou sur remorque.",
    content,
    read_time: 11,
    tags: ['événement', 'mariage', 'soirée', 'anniversaire', 'réception', 'gala', 'food truck', 'remorque brasero', 'wedding planner', 'traiteur', 'B2B'],
    related_articles: [
      'choisir-brasero-restaurateur-professionnel',
      'quel-brasero-choisir-nombre-convives',
      'cuisson-feu-bois-gout-fume-plancha',
      'pourquoi-brasero-artisanal-francais',
    ],
    related_products: ['brasero-morris-100', 'brasero-acier-100-l-obelix', 'le-fermier'],
    cta_product_slug: 'brasero-morris-100',
    cta_text: 'Découvrir Le Morris',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'brasero-evenement-mariage-reception');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ brasero-evenement-mariage-reception réécrit`);
console.log(`  Mots: ~${wordCount}`);
