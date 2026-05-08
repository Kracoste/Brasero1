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

const content = `Acheter son premier brasero, c'est franchir un pas. Pas seulement parce qu'on engage entre 500 et 3 000 € selon le modèle, mais surtout parce qu'on choisit un objet qui va déterminer la manière dont on cuisine en extérieur pour les années qui viennent. Trop grand, on regrette le poids et la consommation. Trop petit, on est limité à chaque réception. Mauvaise qualité, on se déforme à la troisième chauffe. Le bon premier brasero existe — encore faut-il savoir comment le repérer.

> Le bon premier brasero, ce n'est pas le plus cher ni le plus grand. C'est celui qui correspond à votre usage habituel — pas à votre fantasme d'usage.

Cet article est le **guide d'orientation complet** pour un premier achat de brasero plancha. Les 4 questions à se poser avant de commander, les 5 erreurs classiques que voient régulièrement les artisans en SAV, le budget complet à prévoir au-delà du brasero lui-même, et nos recommandations claires par profil d'utilisateur. À la fin, vous saurez non seulement quel brasero choisir, mais aussi pourquoi.

---

## Avant tout : à qui s'adresse ce guide

Cet article est écrit pour les **futurs primo-acheteurs** : ceux qui n'ont jamais eu de brasero, qui hésitent encore, qui veulent comprendre les critères avant de comparer les modèles. Il est volontairement large et pédagogique — pas technique.

Si vous savez déjà ce que vous voulez et que vous cherchez du détail sur un point spécifique :

- Pour le **choix de la taille** précis : voir [quel brasero choisir selon le nombre de convives](/blog/quel-brasero-choisir-nombre-convives)
- Pour le **choix du matériau de plancha** : voir [plancha inox ou acier carbone](/blog/plancha-inox-ou-acier-carbone)
- Pour le **détail des prix** d'un brasero artisanal : voir [combien coûte un vrai brasero artisanal](/blog/prix-brasero-artisanal-decryptage)
- Pour la **valeur de l'artisanat français** : voir [pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais)

Le reste de cet article répond à la question plus large : "qu'est-ce qu'il faut savoir avant d'acheter, point à la ligne ?"

## Question 1 — Combien de convives en moyenne ?

C'est **la** question qui détermine la taille à choisir. Pas "combien au maximum une fois par an pour l'anniversaire de mamie", mais combien **80 % du temps**, dans votre usage habituel.

Un brasero trop grand pour votre usage courant, c'est de la consommation de bois inutile, des temps de chauffe plus longs que nécessaire, et un encombrement permanent au sol pour des grandes tablées qui n'arrivent que deux fois par an. Un brasero trop petit, c'est l'inverse — vous cuisinez en plusieurs fournées, vous n'arrivez jamais à finir en même temps que les invités sont à table.

### Les trois formats standards

- **2 à 4 personnes régulièrement** → format **50 cm**. La plancha fait 40 à 50 cm de diamètre, équivalente à une plancha de cuisine classique. Vous cuisinez pour un couple, une petite famille, un dîner à deux couples. C'est aussi le format de prédilection pour les balcons et terrasses contraintes.

- **4 à 8 personnes régulièrement** → format **80 cm**. C'est le **standard** des foyers qui reçoivent régulièrement, et notre format le plus vendu de loin. Assez de surface pour gérer plusieurs cuissons en parallèle, sans le poids démesuré du 100 cm.

- **Plus de 10 personnes régulièrement** → format **100 cm**. Attention : c'est du matériel proche du professionnel, plus de 100 kg, qui demande de la place et de la logistique. À réserver aux foyers qui font vraiment des grandes tablées en permanence, ou aux usages pro/événementiel.

Pour le détail complet du choix de taille avec capacités précises par diamètre, voir [le guide des tailles selon les convives](/blog/quel-brasero-choisir-nombre-convives).

## Question 2 — Quel espace avez-vous ?

Le brasero rayonne, il chauffe l'air alentour, il a besoin d'**air autour de lui**. La règle de base : **1,5 mètre de dégagement minimum** de tous les côtés par rapport à un mur, une pergola, une haie, du mobilier ou une plante.

[chiffre]1,5 m|de dégagement minimum tout autour du brasero — non négociable[/chiffre]

Concrètement, un brasero 50 cm avec son socle de 55 × 55 cm demande un **espace utile de 3,5 × 3,5 m** environ. Un brasero 80 cm reste sur la même empreinte au sol mais avec une plancha qui dépasse plus largement — l'espace utile passe à environ 4 × 4 m.

### Cas par configuration d'extérieur

**Balcon ou petite terrasse contrainte (< 8 m²)**
Privilégiez un format **50 cm**. Vérifiez les contraintes de copropriété si vous êtes en immeuble, et la **charge admissible** du balcon (souvent limitée à 250 kg/m²). Pour une terrasse en bois, voir aussi [installer un brasero sur terrasse en bois](/blog/brasero-terrasse-bois-securite).

**Terrasse moyenne (10-25 m²)**
Format **50 ou 80 cm** selon la taille de tablée habituelle. Le 80 cm reste confortable sur ce type d'espace si vous laissez le périmètre dégagé.

**Grand jardin / cour spacieuse (> 25 m²)**
Tous les formats sont possibles. La question devient juste l'usage habituel — pas l'espace.

## Question 3 — Quel budget réaliste ?

Voici les fourchettes pour un brasero plancha **artisanal français**, du moins cher au plus haut de gamme :

| Budget | Format | Type |
|---|---|---|
| 500 à 800 € | 50 cm | Premier brasero artisanal, qualité matériaux durables |
| 800 à 1 500 € | 80 cm | Modèle principal pour 6 à 8 convives |
| 1 500 à 2 500 € | 80 cm haut de gamme ou 100 cm | Modèles design, finitions soignées |
| 2 500 € et plus | 100 cm pro / pièces uniques | Sur mesure, événementiel, restaurateurs |

Vous trouverez aussi des **braseros industriels d'importation** à 200-400 €. La différence n'est pas seulement de prix : l'acier est plus mince (1 à 1,5 mm contre 3 mm), les soudures sont robotisées et superficielles, l'aspect ne tient pas dans le temps. Un brasero artisanal français est conçu pour durer **plusieurs décennies**, contre 3 à 5 saisons pour un industriel d'entrée de gamme. Ce ne sont pas le même objet ni la même expérience de cuisson.

Pour le détail de ce qui justifie le prix d'un brasero artisanal, voir [combien coûte un vrai brasero artisanal — la transparence sur les prix](/blog/prix-brasero-artisanal-decryptage).

## Question 4 — Plancha seule ou plancha + grille ?

La majorité des braseros modernes sont des **braseros plancha** : un foyer ouvert avec une couronne de plancha en acier qui s'enroule autour. Certains modèles ajoutent une **grille centrale** amovible pour la cuisson directe sur la flamme.

### Plancha uniquement

Polyvalence maximale : poissons, légumes émincés, viandes fines, œufs, crêpes salées, fromage grillé. Tous les aliments cuisent sans tomber, sans flamme parasite, avec une croûte uniforme. **C'est le choix le plus courant** pour un premier brasero, et le plus polyvalent à l'usage.

### Plancha + grille centrale

Ajoute la possibilité de saisir directement sur la flamme : grosses pièces de viande (côte de bœuf, gigot), brochettes traditionnelles, pièces qu'on veut marquer aux barreaux. Plus polyvalent que la plancha seule, mais plus cher — et sur un premier achat, **rarement indispensable**.

**Notre conseil pour un premier brasero** : la **plancha seule suffit largement**. Vous pouvez ajouter une grille en accessoire plus tard si vous sentez le besoin après quelques mois d'usage. Beaucoup de cuisiniers découvrent qu'ils utilisent finalement très peu la grille, et préfèrent la polyvalence de la plancha pure.

[atelier]
**Le geste de l'artisan**
La conversation type à l'atelier avec un client qui hésite : "Je veux la grille, c'est mieux non ?" — Pas forcément. La grille sert à griller. La plancha sert à griller **et** à saisir, **et** à cuire des choses qui tomberaient à travers une grille. Pour un premier brasero, on conseille systématiquement la plancha seule. Si dans 18 mois vous regrettez de ne pas avoir de grille, on vous en fabrique une compatible — c'est juste un accessoire à 80-150 €. Beaucoup ne reviennent jamais nous en demander une.
[/atelier]

## Les 5 erreurs classiques du premier achat

### Erreur 1 — Prendre trop grand "au cas où"

C'est l'erreur **la plus fréquente**. Vous recevrez peut-être 15 personnes une fois dans l'année, ou jamais. Ce n'est pas une raison pour acheter un brasero 100 cm qui consommera trois fois plus de bois pendant les 364 autres jours, qui pèsera 100 kg, et qui occupera trop de place sur votre terrasse au quotidien. **Dimensionnez pour l'usage courant, pas pour l'exception**.

### Erreur 2 — Négliger le poids et le déplacement

Un brasero 100 cm pèse plus de 100 kg, un Le Morris dépasse les 150 kg. Vous ne le déplacerez **jamais seul**. Si votre terrain est en pente, si vous devez passer par un escalier, par une porte étroite, par un escabeau pour atteindre la terrasse, **vérifiez la logistique avant de commander**. Une fois posé, c'est posé pour longtemps.

### Erreur 3 — Oublier les accessoires

Le brasero ne vient pas tout équipé. Pour un usage normal, il faut prévoir : une **raclette plancha**, une **spatule longue**, une **pince à barbecue longue**, une **housse de protection**, des **gants haute température**, et idéalement un **range-bûches**. Comptez **150 à 250 €** supplémentaires pour un équipement complet.

### Erreur 4 — Acheter industriel pour économiser

Un brasero industriel à 300 € se déforme et perd son aspect en quelques saisons. Un brasero artisanal vous accompagne pendant des décennies. **Ce ne sont pas le même objet, et ce n'est pas la même expérience de cuisson**. Si votre budget actuel ne permet pas l'artisanal, mieux vaut attendre quelques mois plutôt que d'acheter un industriel qu'il faudra remplacer dans 2-3 ans.

### Erreur 5 — Ne pas anticiper le bois et son stockage

Un brasero qui marche bien consomme **5 à 12 kg de bois sec par repas** selon la taille. Un usage régulier en saison (1 fois par semaine) demande environ **1,5 à 3 stères par an**. Avez-vous où le stocker ? À l'abri ? Sur palette ? Si non, prévoyez l'aménagement avant l'achat — c'est l'angle mort le plus fréquent. Voir [le guide complet des bois pour brasero](/blog/meilleur-bois-brasero-comparatif).

## Le budget complet : combien prévoir au-delà du brasero

Le brasero n'est qu'une partie du budget total à prévoir pour un démarrage propre. Voici la **vraie addition** pour un premier achat complet :

| Poste | Fourchette |
|---|---|
| Brasero artisanal 50 cm | 500 à 800 € |
| Raclette inox + spatule longue + pince barbecue | 50 à 100 € |
| Housse de protection respirante | 60 à 120 € |
| Gants haute température | 20 à 40 € |
| Premier stock de bois sec (0,5 stère) | 50 à 80 € |
| Tapis ignifugé (si terrasse bois) | 30 à 60 € |
| Allume-feu naturels (1 saison) | 15 à 25 € |
| **Total démarrage 50 cm** | **725 à 1 225 €** |

Le budget réel d'un premier brasero artisanal avec son équipement complet et son premier stock de bois tourne donc autour de **1 000 €**, pas 600. Anticipez l'enveloppe complète pour ne pas avoir à étaler les achats sur plusieurs mois.

## Délais et logistique de livraison

### Délai de fabrication

Un brasero artisanal n'est pas en stock comme un produit industriel. Il est **fabriqué à la commande**, ce qui implique un délai de production qui dépend de la saison :

- **Hors saison (octobre-mars)** : 2 à 4 semaines
- **Pleine saison (avril-septembre)** : 4 à 8 semaines, parfois plus

Anticipez : si vous voulez votre brasero pour les premiers beaux jours de mai, **commandez en mars au plus tard**. Tous les artisans français sont saturés en juin-juillet.

### Livraison

Un brasero pèse entre 67 et 155 kg selon le modèle. La livraison se fait par **transporteur spécialisé** sur palette, généralement avec déchargement au pas de votre porte (pas dans le jardin). Prévoyez :

- Un **accès véhicule** suffisant pour un camion de 7,5 tonnes
- **Deux personnes minimum** pour transporter le brasero du point de livraison à son emplacement définitif
- Un **chariot ou diable** si la distance dépasse 10 mètres

[atelier]
**Le geste de l'artisan**
L'erreur logistique qu'on voit le plus souvent : un client commande un brasero 100 cm pour sa terrasse en hauteur accessible uniquement par un escalier extérieur étroit. Le jour de la livraison, impossible de monter les 130 kg seul. Résultat : brasero qui dort au rez-de-chaussée pendant 3 semaines, le temps que le client trouve 2 amis disponibles. La règle qu'on partage à tous les nouveaux clients : **vérifiez le chemin du camion à l'emplacement final avant de commander**, pas après.
[/atelier]

## Notre recommandation par profil

### Profil 1 — Couple ou famille restreinte

**2 à 4 convives habituels, terrasse moyenne ou balcon généreux.**
→ Brasero **50 cm** type [Coffy](/produits/brasero-coffy-50). Format compact, polyvalent, qui passe partout. Suffisant pour 95 % de vos repas, et l'écart de prix avec les formats supérieurs vous laisse de la marge pour les accessoires.

### Profil 2 — Famille avec enfants ou recevant régulier

**4 à 8 convives habituels, terrasse normale, usage régulier.**
→ Brasero **80 cm** type [L'Obélix 80](/produits/brasero-acier-100-l-obelix) ou [Le Morris 80](/produits/brasero-en-acier-80-lemorris). Format polyvalent par excellence, c'est notre best-seller pour cette raison. Vous ne serez jamais limité par la surface.

### Profil 3 — Cuisinier passionné, recevant en grand

**8+ convives régulièrement, grande terrasse ou jardin, projet de cuisine extérieure ambitieux.**
→ Brasero **100 cm** type [Le Morris 100](/produits/brasero-morris-100). Surface généreuse, vraies zones thermiques, statut d'objet central. Pour ceux qui savent qu'ils l'utiliseront au moins 30 fois par an.

### Profil 4 — Résidence secondaire ou usage occasionnel

**Usage ponctuel, parfois plusieurs mois entre deux services, simplicité et tranquillité avant tout.**
→ Brasero **50 cm en acier corten** + **plancha inox**. Le combo zéro entretien : le corten n'a pas besoin d'être bâché, l'inox ne demande pas de culottage. Vous arrivez, vous allumez, vous cuisinez. Vous repartez sans rituel particulier.

## Idées reçues sur le premier brasero

**"Mieux vaut commencer petit pour tester avant de prendre plus grand."**
Vrai si vous êtes vraiment incertain et que votre budget est serré. **Faux si vous savez déjà que vous recevez régulièrement** — vous regretterez d'avoir pris trop petit dès la 5e tablée. Le 50 cm est parfait **pour son usage** (couples, petites tablées, balcons), pas comme "essai" avant un 80 cm.

**"Un brasero artisanal, c'est compliqué pour un débutant."**
Faux. Le brasero plancha est **plus facile à utiliser** qu'un barbecue à grille — pas de flammes parasites, pas de graisses qui tombent, pas d'aliments qui passent à travers. La courbe d'apprentissage est de 2-3 sessions pour les bases, et tout le reste se fait au feeling. Voir [maîtriser la température sur un brasero plancha](/blog/temperature-cuisson-brasero-plancha).

**"Il faut être un cuisinier confirmé pour cuisiner au brasero."**
Faux. Posez une côte de bœuf sur une plancha bien chaude, attendez 2 minutes par face, vous avez un repas digne d'un bon restaurant. La technique vient en cuisinant — pas avant. Le brasero est **plus indulgent** qu'un piano de cuisine domestique parce que les zones thermiques permettent de rattraper presque toutes les situations.

**"Si je me trompe je peux le revendre."**
Vrai mais nuancé. Le marché de l'occasion pour braseros artisanaux français existe (les bons modèles **se revendent toujours**, parfois quasiment au prix d'achat sur les modèles iconiques), mais c'est de la logistique : poids, transport, photos, négociation. Mieux vaut **bien choisir au départ** que de compter sur la revente.

---

## Pour aller plus loin

- [Quel brasero choisir selon le nombre de convives](/blog/quel-brasero-choisir-nombre-convives) — le détail des tailles avec capacités réelles
- [Plancha inox ou acier carbone : quel matériau choisir](/blog/plancha-inox-ou-acier-carbone) — le choix du matériau de plancha
- [Combien coûte un vrai brasero artisanal ?](/blog/prix-brasero-artisanal-decryptage) — la décomposition transparente des prix
- [Pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais) — le manifeste de l'artisanat français`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Acheter son premier brasero : le guide complet pour ne pas se tromper",
    meta_title: "Premier brasero : guide d'achat débutant 2026 (taille, budget)",
    meta_description: "Vous achetez votre premier brasero ? Le guide complet pour bien choisir : taille selon convives, espace au sol, budget réaliste, plancha seule ou avec grille, erreurs à éviter et recommandations par profil.",
    excerpt: "Acheter son premier brasero, c'est un choix qui va déterminer votre expérience de cuisinier au feu de bois pendant des années. Voici les 4 questions à se poser avant de commander, les 5 erreurs classiques à éviter, et nos recommandations par profil.",
    content,
    read_time: 8,
    tags: ['guide', 'débutant', 'achat', 'brasero', 'budget', 'choix', 'premier brasero'],
    related_articles: [
      'quel-brasero-choisir-nombre-convives',
      'plancha-inox-ou-acier-carbone',
      'prix-brasero-artisanal-decryptage',
      'pourquoi-brasero-artisanal-francais',
    ],
    related_products: ['brasero-coffy-50', 'brasero-coffy-80', 'le-fermier'],
    cta_product_slug: 'brasero-coffy-50',
    cta_text: 'Découvrir Le Coffy',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'premier-brasero-guide-debutant');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ premier-brasero-guide-debutant réécrit`);
console.log(`  Mots: ~${wordCount}`);
