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

const content = `Vous avez une belle terrasse en bois et l'envie d'y poser un brasero, mais une question vous freine : est-ce qu'on peut vraiment **faire du feu** sur du bois ? Est-ce raisonnable ? Légal ? Sans danger ? La réponse honnête tient en deux phrases : oui, c'est compatible, et oui, des milliers de propriétaires le font sans aucun incident. À condition de comprendre les **trois risques réels** d'une telle installation et de les **neutraliser** avec quelques précautions simples qui se prennent une seule fois, à l'installation.

> Un brasero sur une terrasse en bois, c'est compatible. À condition de comprendre les trois risques réels et de les neutraliser dès l'installation.

Cet article est le **guide complet** d'installation d'un brasero plancha sur terrasse bois : les trois risques techniques (chaleur radiante, poids, projections), les protections concrètes par catégorie de bois, les distances de sécurité spécifiques, le cas particulier des balcons en copropriété, la check-list pré-installation, et les idées reçues à corriger. À la fin, vous saurez si votre terrasse peut accueillir un brasero — et si oui, comment l'installer sans risque.

---

## Compatible, à condition de... : la réponse honnête

Un brasero plancha **peut** être installé sur une terrasse en bois. Ce n'est pas un compromis, ce n'est pas une exception — c'est un usage **courant** et documenté, pratiqué par une part importante de nos clients qui ont précisément ce type de configuration : terrasse bois en plein jardin, balcon-terrasse en bois exotique, deck composite contemporain.

L'installation se fait sans incident dans **l'immense majorité des cas**, sous réserve de respecter trois règles techniques qui répondent aux trois risques réels d'un brasero sur surface combustible :

- **Le risque thermique** : la chaleur rayonnante sous le brasero peut, sur le long terme, sécher et fragiliser le bois directement en dessous. Solution : une protection passive entre le brasero et le bois.
- **Le risque structurel** : le poids du brasero (67 à 155 kg selon les modèles) doit être supportable par la terrasse. Solution : un calcul simple de charge au sol.
- **Le risque de projection** : étincelles et braises peuvent occasionnellement quitter le foyer. Solution : un brasero plancha couvert et une distance dégagée autour.

Le reste de l'article traite ces trois risques un par un, avec des solutions concrètes. Aucune n'est compliquée à mettre en œuvre, et l'ensemble se règle généralement en une après-midi.

[chiffre]60 à 80 cm|distance de dégagement minimale recommandée tout autour du brasero[/chiffre]

## Risque n°1 — La chaleur rayonnante sous le brasero

C'est le risque le plus souvent évoqué, et celui qui est en pratique le plus simple à neutraliser. Mécanisme physique : le bol et le foyer du brasero, en pleine combustion, atteignent **400 à 600 °C** au cœur du foyer. Cette chaleur **rayonne vers le bas** par rayonnement infrarouge à travers le fond du bol, et par convection ascendante de l'air chaud autour du brasero.

Sur un brasero artisanal correctement conçu, le **socle surélève le foyer** de 30 à 40 cm au-dessus du sol. Cette distance suffit pour que la température directement sous le socle ne dépasse pas **60 à 80 °C** en plein régime — bien en-dessous du seuil d'ignition du bois (environ 250-300 °C selon les essences).

**Mais** : sur la durée, des sessions répétées au même endroit peuvent **dessécher** progressivement le bois sous le brasero, créant des fissures, des changements de teinte, voire à très long terme une zone fragilisée. La solution est simple : intercaler une **protection** entre le brasero et le bois.

### Les 4 protections possibles

| Protection | Coût | Efficacité | Esthétique | Idéal pour |
|---|---|---|---|---|
| Tapis ignifugé fibre de verre | 30-60 € | ★★★★ | ★★ | Usage saisonnier, déplacement facile |
| Plaque acier ou fonte | 80-200 € | ★★★★★ | ★★★ | Usage intensif, brasero stable au même endroit |
| Dalles pierre naturelle (4×40×40 cm) | 40-100 € | ★★★★★ | ★★★★★ | Installation permanente, intégration paysagère |
| Lit de gravier (sur géotextile) | 30-80 € | ★★★ | ★★★★ | Coin brasero définitif, esthétique brute |

Le **tapis ignifugé en fibre de verre** est le choix le plus pragmatique pour la majorité des installations : économique, efficace, ne marque pas le bois, se range hors saison.

[atelier]
**Le geste de l'artisan**
Pour les clients qui installent un brasero sur une belle terrasse en ipé ou en cumaru qu'ils ne veulent surtout pas marquer, on recommande systématiquement les **dalles de pierre naturelle** (4 dalles de 40×40 cm, basalte, ardoise ou granit foncé). C'est plus cher qu'un tapis, mais ça crée un "socle paysager" qui s'intègre comme un élément permanent et qui devient même un détail esthétique. La pierre absorbe la chaleur sans broncher, ne tache pas, ne se déforme pas, et ne risque rien sur 30 ans.
[/atelier]

## Risque n°2 — Le poids et la charge au sol

Un brasero artisanal pèse lourd. Voici les charges réelles de la gamme Atelier LBF :

| Modèle | Poids | Empreinte au sol | Charge effective |
|---|---|---|---|
| Brasero Coffy 50 cm | ~60 kg | 50 × 50 cm | 240 kg/m² |
| Brasero L'Obélix 50 cm | 67 kg | 55 × 55 cm | 221 kg/m² |
| Brasero L'Obélix 80 cm | 89 kg | 55 × 55 cm | 294 kg/m² |
| Brasero L'Obélix 100 cm | 96 kg | 55 × 55 cm | 317 kg/m² |
| Brasero Le Morris | 155 kg | empreinte étendue | ~250 kg/m² |

Ajoutez **30 à 50 kg de bois** dans le range-bûches en pleine saison, et **10-15 kg** sur la plancha en cuisson, et vous arrivez à une charge effective totale de **300 à 400 kg/m²** sur le pic de service.

### La capacité d'une terrasse en bois standard

Une terrasse en bois sur lambourdes, **correctement construite selon les normes du DTU 51.4** (Document Technique Unifié pour les terrasses en bois), supporte par défaut :

- **Charge d'exploitation** : 250 kg/m² uniformément répartie
- **Charge ponctuelle locale** : jusqu'à 500 kg/m² sur certaines zones (point dur sur lambourde)

**Conclusion** : un brasero L'Obélix 80 cm (294 kg/m² effectifs) est dans la norme acceptable d'une terrasse standard, à condition que les **lambourdes soient correctement positionnées** sous le brasero. Un brasero Le Morris (155 kg) demande plus d'attention et peut nécessiter une **vérification structurelle** pour les terrasses anciennes ou auto-construites.

### Quand consulter un constructeur

- Terrasse **construite avant 2010** sans documentation
- Terrasse **auto-construite** sans calcul de charge initial
- Terrasse sur **pilotis hauts** (> 50 cm)
- Brasero placé en **bord de terrasse** (porte-à-faux de moins de 30 cm)
- Réception régulière de **8+ convives** autour du brasero (charge dynamique cumulée)

Dans ces cas, un constructeur ou un artisan local peut vérifier en 30 minutes si la structure est dimensionnée, et au besoin renforcer une zone localisée par l'ajout d'une lambourde supplémentaire.

## Risque n°3 — Les projections d'étincelles et braises

C'est le risque psychologique le plus fort ("je vois mon brasero rouge sur ma terrasse en bois et j'imagine le pire") et en pratique le plus faible — surtout sur un **brasero plancha** par opposition à un foyer ouvert.

### Pourquoi un brasero plancha est plus sûr qu'un foyer ouvert

Trois caractéristiques structurelles d'un brasero plancha réduisent massivement les projections :

- **La plancha couvre le foyer** : la couronne d'acier qui s'enroule autour du foyer **agit comme un cape-feu partiel**. Les étincelles qui montent en spirale ne peuvent pas s'échapper dans toutes les directions — elles sont déviées et retombent dans le foyer.
- **Le socle surélève le feu** : le foyer est à 30-40 cm du sol, donc loin du bois directement.
- **Le bol contient les braises** : pas de feu ouvert qui peut s'étaler, pas de bûche qui peut rouler hors du foyer comme dans un feu de camp.

En pratique, sur un brasero plancha bien chargé en bois sec de feuillus (chêne, hêtre — voir [le guide des bois](/blog/meilleur-bois-brasero-comparatif)), les projections d'étincelles sont **extrêmement rares** et restent confinées dans un rayon de 30-50 cm autour du brasero.

### Les conditions à éviter

- **Vent fort > 30 km/h** : par grand vent, n'utilisez pas le brasero. Les étincelles peuvent être emportées sur plusieurs mètres et atterrir sur du bois sec, du tissu de mobilier, des feuilles mortes, etc.
- **Bois résineux** (pin, sapin) : pétille fort, projette des étincelles incandescentes, **interdit** sur terrasse bois.
- **Bois humide** : crachote, fume, peut projeter des particules carbonisées qui marquent le bois.
- **Ouverture du foyer en grand** : ne déstabilisez pas le foyer en cours de service avec un tisonnier — gardez le couvercle de plancha en place.

## Les distances de sécurité spécifiques sur terrasse bois

| Direction | Distance minimale | Attention particulière |
|---|---|---|
| Au-dessus (parasol, store, pergola) | **2 m** | Combustibles aériens — risque maximal |
| Latéral (mobilier en tissu, plantes) | **1 m** | Coussins, parasols repliés, cache-pots plastique |
| Façade de maison | **1,5 m** | Verticalité = effet de paroi qui réfléchit la chaleur |
| Sous le brasero (le bois) | **Protection passive obligatoire** | Tapis, plaque, dalle ou gravier (voir tableau) |
| Auvent fermé / abri couvert | **Jamais sous** | Confinement de fumée + accumulation thermique |
| Branches d'arbre | **3 m** | Bois sec en hauteur = très dangereux |

Pour le détail réglementaire général (distances aux voisins, arrêtés municipaux, PLU), voir [le guide complet de la réglementation brasero française](/blog/distance-securite-brasero-reglementation).

## Les types de terrasses en bois et leurs particularités

Toutes les terrasses en bois ne réagissent pas de la même manière à la chaleur d'un brasero. Voici les 4 catégories courantes et leurs spécificités.

### Bois exotique massif (ipé, cumaru, padouk, teck)

C'est le **bois le plus résistant** à la chaleur et au vieillissement. Densité élevée, faible inflammabilité, durée de vie naturelle de 30 à 50 ans en extérieur. Un brasero sur ipé ou cumaru, avec une protection passive sous le socle, est l'installation **la plus tranquille** qu'on puisse faire.

**Précaution** : les bois exotiques peuvent **changer de teinte** sous l'effet de la chaleur prolongée (zone légèrement plus pâle directement sous le brasero, par dessèchement). Une plaque ou des dalles évitent ce phénomène.

### Bois résineux traités (pin classe 4, douglas, mélèze)

Plus tendres, plus inflammables que les exotiques, mais **traités autoclave** pour résister à l'extérieur. La chaleur d'un brasero ne pose pas de problème d'inflammation directe avec une protection passive, mais **la résine peut suinter** sous l'effet de la chaleur prolongée et créer des taches collantes.

**Précaution** : utilisez une **plaque opaque** (acier, dalles) plutôt qu'un tapis fin — la plaque crée une vraie barrière thermique. Surveillez les premières utilisations.

### Bois composite (bois-plastique recyclé)

Les composites haut de gamme (Fiberon, Trex, Silvadec) résistent bien à la chaleur. Les composites bas de gamme **peuvent fondre** ou se déformer à des températures aussi basses que **70-80 °C**.

**Précaution** : **vérifiez impérativement la fiche technique** de votre composite avant installation. Si la résistance thermique n'est pas spécifiée, optez pour des dalles de pierre comme protection — c'est la seule barrière thermique fiable pour un composite incertain.

### Caillebotis bois

Cas particulier : les caillebotis (planches courtes assemblées en carré) sont souvent **non solidaires** entre eux et reposent sur une simple structure légère. La charge ponctuelle d'un brasero peut les déstabiliser, et les **espaces entre les lattes** peuvent capter des cendres ou des particules incandescentes.

**Précaution** : posez **impérativement une plaque rigide** (60×60 cm minimum) sous le brasero pour répartir la charge ET combler les espaces inter-lattes.

[atelier]
**Le geste de l'artisan**
L'erreur qu'on voit régulièrement avec les terrasses **composites bas de gamme** (sous 30 €/m² en grande surface), c'est la fonte localisée sous le brasero après quelques services. Ce n'est pas dramatique pour la sécurité — ça ne s'enflamme pas — mais ça **abîme définitivement** la terrasse avec une zone déformée visible. La règle absolue : tout composite qui ne mentionne pas explicitement une **résistance à au moins 100 °C** dans sa fiche technique doit recevoir une **plaque rigide opaque** sous le brasero. Pas de demi-mesure sur ce point.
[/atelier]

## Cas particulier : balcon ou terrasse en copropriété

Si votre terrasse est une **terrasse-balcon en copropriété** (et non un jardin privatif), trois vérifications supplémentaires s'imposent :

- **Le règlement de copropriété** : certaines copropriétés interdisent purement et simplement les feux ouverts sur balcon, indépendamment de la sécurité technique. Demandez le règlement au syndic et lisez la section "usage des parties privatives".
- **La charge admissible** : la plupart des balcons d'immeuble sont calculés pour **250 kg/m² maximum**, parfois moins sur les immeubles anciens. Avec un brasero de 96 kg + 30 kg de bois + 4-6 personnes autour, vous pouvez dépasser cette limite. Un constructeur peut vérifier sur plan.
- **L'assurance habitation** : informez votre assureur de l'installation. Certaines polices excluent les sinistres causés par "feu ouvert non déclaré".

Pour les balcons d'appartement urbains, **le brasero plancha 50 cm est généralement la seule taille pertinente** (encombrement, poids, voisinage). Au-delà, c'est rarement compatible avec les contraintes immobilières.

## Check-list avant installation

Avant de commander ou d'installer votre brasero sur terrasse bois, validez ces 10 points :

- [ ] La terrasse est dimensionnée pour la charge effective du brasero (vérification poids/m²)
- [ ] Une protection passive sous le brasero est prévue (tapis, plaque, dalles, gravier)
- [ ] Le bois de la terrasse est connu (essence + traitement)
- [ ] Pour un composite : la résistance thermique est ≥ 100 °C
- [ ] La distance au-dessus est de 2 m sans matériau combustible
- [ ] La distance latérale aux meubles en tissu/plastique est de 1 m
- [ ] Le brasero n'est pas en bord de terrasse en porte-à-faux
- [ ] Pour copropriété : règlement consulté + assureur informé
- [ ] Le bois utilisé sera du feuillu sec (pas de résineux, pas d'humide)
- [ ] Une zone d'évacuation de cendres est prévue à proximité

Si les 10 points sont validés, votre installation est **sûre et durable**.

## Idées reçues sur le brasero sur terrasse bois

**"Une terrasse en bois prend forcément feu sous un brasero."**
Faux. Avec une protection passive correcte (tapis ignifugé, plaque, dalles), le bois sous le brasero ne dépasse jamais les températures critiques d'inflammation. Des dizaines de milliers d'installations existent en France sans incident.

**"Il faut absolument une plaque en métal énorme."**
Faux. Un simple tapis en fibre de verre de 90×90 cm suffit pour 95 % des installations. La "plaque énorme" est un mythe inutile pour la majorité des cas — sauf composites bas de gamme et caillebotis.

**"Le bois exotique est ininflammable, donc pas besoin de protection."**
Faux. L'ipé et le cumaru sont **résistants** à l'inflammation, mais ils ne sont pas ininflammables. Ils peuvent **se dessécher**, **changer de teinte** ou **fissurer** sous l'effet d'une chaleur prolongée. Une protection reste nécessaire — juste moins critique que sur résineux.

**"Un brasero artisanal est plus dangereux qu'un barbecue car il fait du vrai feu."**
Faux. Un brasero plancha est **structurellement plus sûr** qu'un barbecue à grille ouverte sur terrasse bois : la plancha couvre le foyer, le socle surélève le feu, le poids stabilise l'ensemble. Les barbecues à roulettes qui basculent sont une cause d'incident bien plus fréquente.

**"Mon assurance ne couvrira pas en cas de problème."**
Vrai si vous n'informez pas votre assureur, faux si vous le faites. Une simple déclaration d'installation auprès de votre compagnie d'assurance habitation suffit dans la majorité des cas — coût zéro, démarche en 5 minutes par téléphone.

---

## Pour aller plus loin

- [Distances de sécurité brasero : la réglementation française](/blog/distance-securite-brasero-reglementation) — le détail réglementaire général (voisinage, PLU, arrêtés municipaux)
- [Brasero corten et taches de rouille : protéger sa terrasse](/blog/brasero-corten-taches-terrasse-solutions) — pour les terrasses claires si vous choisissez le corten
- [Quel brasero choisir selon le nombre de convives](/blog/quel-brasero-choisir-nombre-convives) — choisir la bonne taille selon votre espace
- [Créer un coin brasero dans votre jardin : 7 idées d'aménagement](/blog/amenager-coin-brasero-jardin) — l'inspiration pour intégrer le brasero dans votre extérieur`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Installer un brasero sur une terrasse en bois : sécurité, protection et précautions",
    meta_title: "Brasero terrasse en bois : guide sécurité complet (2026)",
    meta_description: "Peut-on poser un brasero sur une terrasse en bois ? Oui, avec les bonnes précautions. Protection thermique, charge au sol, distances, types de bois, balcons en copropriété : le guide complet d'installation sécurisée.",
    excerpt: "Oui, on peut installer un brasero sur une terrasse en bois. À condition de comprendre les trois risques réels (chaleur, poids, projections) et de les neutraliser avec des protections simples. Voici le guide complet d'installation sécurisée.",
    content,
    read_time: 8,
    tags: ['terrasse bois', 'sécurité', 'installation', 'protection thermique', 'composite', 'balcon', 'copropriété'],
    related_articles: [
      'distance-securite-brasero-reglementation',
      'brasero-corten-taches-terrasse-solutions',
      'quel-brasero-choisir-nombre-convives',
      'amenager-coin-brasero-jardin',
    ],
    related_products: ['brasero-acier-100-l-obelix', 'brasero-coffy-50', 'brasero-en-acier-80-lemorris'],
    cta_product_slug: 'brasero-acier-100-l-obelix',
    cta_text: "Découvrir L'Obélix",
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'brasero-terrasse-bois-securite');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ brasero-terrasse-bois-securite réécrit`);
console.log(`  Mots: ~${wordCount}`);
