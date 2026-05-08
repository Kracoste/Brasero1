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

const content = `Combien serez-vous autour du brasero, le plus souvent ? Pas le grand repas annuel avec quinze cousins, pas le tête-à-tête exceptionnel : le **repas habituel**, celui qui revient toutes les semaines en saison. La réponse à cette seule question décide de la taille à choisir, de la consommation de bois, et de la sérénité du cuisinier qui aura ou non le temps de boire un verre avec ses invités.

> Un brasero trop petit, vous cuisinez en plusieurs fournées et passez la soirée derrière la plancha. Un brasero trop grand, vous brûlez du bois pour rien.

Le diamètre du brasero plancha — 50, 80 ou 100 cm — est le critère qui détermine la **capacité de cuisson simultanée** et la consommation de bois. Tout le reste (matériau, plancha inox ou carbone, finition corten ou peinte) viendra après. Cet article est le guide concret pour choisir le bon diamètre, sans se tromper, en fonction de votre tablée habituelle, de votre espace et de votre fréquence d'usage.

---

## Le diamètre, c'est tout

Sur un brasero plancha, le diamètre désigne la **largeur de la plancha de cuisson** (la couronne plate où vous saisissez), pas la largeur du foyer en dessous. C'est cette surface qui détermine combien de pièces vous pouvez poser en même temps — donc combien de convives vous servez sans cuire en plusieurs fois.

Trois diamètres standards couvrent l'immense majorité des usages domestiques :

[chiffre]4 / 8 / 12|convives en simultané sur une plancha 50 / 80 / 100 cm[/chiffre]

Ces chiffres sont des **capacités confortables**, pas des maximums théoriques. On peut entasser plus, on peut faire moins. Mais c'est dans cette zone qu'on cuisine bien, qu'on a la marge thermique nécessaire pour saisir correctement, et qu'on garde la main sur ce qu'on fait. Tout le reste de l'article décline ces trois formats.

## 50 cm : le format duo (2 à 4 convives)

Le brasero plancha de 50 cm est fait pour les **repas intimes**. Deux entrecôtes avec leurs légumes en accompagnement, quatre portions de poisson, un apéritif plancha varié pour quatre convives : c'est le bon ratio entre place de cuisson et concentration thermique.

Ce qu'on peut cuisiner confortablement sur 50 cm :

- 2 steaks épais (entrecôtes, faux-filets) avec leurs accompagnements en simultané
- 4 portions de poisson (filets, pavés, dorade entière de petite taille)
- Un apéritif plancha complet pour 4 personnes (gambas, légumes grillés, fromage de chèvre, brochettes)
- 2 à 3 hamburgers maison, viande + pain toasté en parallèle
- Une cuisson en deux temps pour 4 personnes (saisie puis légumes)

### Les avantages du petit format

Le 50 cm **concentre toute la chaleur du foyer** sur une surface réduite. Trois conséquences directes :

- **Montée en température la plus rapide** de la gamme — vous saisissez 15 à 20 minutes après l'allumage
- **Saisie la plus intense** — la chaleur radiante est ramassée, idéale pour des cuissons courtes à haute température
- **Consommation de bois la plus faible** — quelques bûches suffisent pour un repas complet

C'est aussi le format le plus léger (~67 kg sur les modèles type Obélix 50), repositionnable à deux personnes sans effort. Idéal pour un balcon généreux, une petite terrasse, une résidence secondaire ou un usage strictement de couple.

[atelier]
**Le geste de l'artisan**
Les clients qui choisissent le 50 cm sont en général des couples sans enfants à la maison, des résidents secondaires qui ne reçoivent que ponctuellement, ou des urbains avec terrasse contrainte. Le profil "amateur de cuisine au feu de bois pour deux" est aussi très représenté : le 50 cm permet de cuisiner souvent (deux à trois fois par semaine en saison) sans gérer un grand foyer à chaque fois. C'est le format de la régularité.
[/atelier]

## 80 cm : le format convivial (6 à 8 convives)

Le 80 cm est le **format polyvalent par excellence**, et de loin le plus vendu de la gamme. C'est le choix le plus fréquent pour les familles avec enfants, les couples qui reçoivent régulièrement, et les amateurs de repas entre amis.

Ce qu'on peut cuisiner confortablement sur 80 cm :

- 6 à 8 pièces de viande en simultané (côtes de porc, magrets, entrecôtes)
- Un repas complet pour 6 personnes : protéine + légumes + accompagnements en parallèle
- Un apéritif plancha généreux pour 8 (gambas, légumes, charcuterie grillée, fromage)
- Une paella ou un plat en sauce pour 6 à 8 personnes
- Plusieurs cuissons en zones thermiques différentes (saisie côté foyer, cuisson douce en périphérie)

### L'équilibre parfait

Le 80 cm offre **assez de surface pour ne pas cuire en plusieurs fois**, tout en gardant une concentration thermique suffisante pour saisir correctement sur toute la zone. C'est le format qui consomme raisonnablement en bois tout en servant une tablée conviviale.

Côté ergonomie, c'est aussi le format dont la **profondeur de plancha** (~15 cm de couronne plate) permet le plus de flexibilité : assez large pour cuisiner deux types de pièces côte à côte, pas trop large pour qu'on n'ait pas à se contorsionner pour atteindre le centre.

[atelier]
**Le geste de l'artisan**
Si vous nous appelez sans savoir quoi choisir, on vous orientera neuf fois sur dix vers le 80 cm. C'est le format qui pardonne le plus : il encaisse une tablée à 4 sans gaspiller, et il tient une tablée à 8 sans s'essouffler. C'est aussi celui qui revend le mieux d'occasion si un jour vous changez d'avis — un 80 cm trouve toujours preneur.
[/atelier]

## 100 cm : le format grandes tablées (10 à 12 convives)

Le 100 cm est la **surface de cuisson la plus ambitieuse** de la gamme domestique. C'est le format pour ceux qui reçoivent régulièrement en grand nombre, qui organisent des événements familiaux ou amicaux, ou qui veulent un brasero qui devient le centre d'une terrasse de réception.

Ce qu'on peut cuisiner confortablement sur 100 cm :

- 10 à 12 pièces de viande en une seule fournée (côte de bœuf, gigot, magrets en série)
- Un buffet plancha complet pour 12 personnes
- Plusieurs plats en parallèle avec **vraies zones thermiques** différenciées
- Des cuissons longues : poulet entier aplati en crapaudine, côte de bœuf de 1,5 kg, gigot d'agneau
- Un service de type "brasero ouvert" où chacun saisit sa pièce sous la conduite du cuisinier

### La puissance brute

Le 100 cm demande un foyer plus généreux, donc **plus de bois**. Comptez 30 à 50 % de consommation supplémentaire par rapport à un 80 cm pour un repas équivalent. Mais la surface immense permet des techniques impossibles sur les formats plus petits : zones de saisie à haute température près du foyer, zones de cuisson douce en périphérie, repos des viandes pendant qu'on saisit la suite.

C'est aussi le format de prédilection des **restaurateurs et professionnels de l'événementiel**. Si vous êtes dans cette catégorie, on a écrit deux guides spécifiquement pour vous : [comment choisir son braséro quand on est restaurateur](/blog/choisir-brasero-restaurateur-professionnel) et le [brasero pour mariage et réception](/blog/brasero-evenement-mariage-reception).

## La règle d'or : prendre la taille au-dessus

Si vous hésitez entre deux tailles, **prenez la taille au-dessus**. Cette règle est née de cinq ans de retours clients, et elle ne souffre pas d'exception. Trois raisons :

- **On regrette rarement d'avoir trop de surface**, mais on regrette souvent de ne pas en avoir assez quand les invités débarquent à l'improviste, ou quand la famille s'agrandit
- **Une plancha plus grande peut toujours fonctionner avec un foyer modéré** : sur un 80 cm, vous pouvez très bien faire un repas pour 2 en allumant un petit feu. L'inverse n'est pas vrai : un 50 cm ne sert pas 8 personnes
- **La revente** : un 80 cm ou un 100 cm trouvent toujours preneur en occasion. Un 50 cm a un marché plus étroit

La seule contre-indication formelle au "taille au-dessus" : un **espace au sol vraiment contraint** (balcon de 2 m²) ou une **fréquence d'usage très faible** (quelques fois par an seulement, sans projet de recevoir).

## Le tableau de décision

| Critère | 50 cm | 80 cm | 100 cm |
|---|---|---|---|
| Convives confortables | 2 à 4 | 6 à 8 | 10 à 12 |
| Repas intime | ★★★ | ★★ | ★ |
| Repas familial | ★ | ★★★ | ★★ |
| Grandes réceptions | — | ★★ | ★★★ |
| Montée en température | 15-20 min | 25-30 min | 30-40 min |
| Consommation de bois | Faible | Modérée | Élevée |
| Poids approximatif | 67 kg | 90-95 kg | ~100 kg |
| Encombrement au sol | 55 × 55 cm | 55 × 55 cm | 55 × 55 cm |

[compare]
[col]**Vous hésitez entre 50 et 80 cm ?**
- Si vous recevez ne serait-ce que 4 fois par an des amis ou de la famille élargie : prenez le 80
- Si vous êtes vraiment et durablement sur du tête-à-tête : prenez le 50
- Si vous êtes en résidence secondaire avec usage ponctuel : 50
- Si c'est votre brasero principal toute l'année : 80[/col]
[col]**Vous hésitez entre 80 et 100 cm ?**
- Si vous recevez régulièrement plus de 8 personnes : prenez le 100
- Si vous organisez des événements (anniversaires, fêtes) : 100
- Si votre tablée habituelle est de 6, avec rares pointes à 10 : 80
- Si vous voulez vraiment exploiter les zones thermiques : 100[/col]
[/compare]

## Et l'encombrement au sol ?

Bonne nouvelle : sur les modèles à socle compact (gamme Obélix notamment), les trois diamètres **partagent le même socle au sol de 55 × 55 cm**. C'est seulement le **bol et la plancha** qui changent de diamètre. La hauteur de travail reste constante à 93 cm — celle qui permet de cuisiner debout sans se casser le dos.

Ce qui change avec le diamètre, c'est la **dépasse de plancha** par rapport au socle :

- **50 cm** : la plancha dépasse peu, l'objet reste contenu visuellement
- **80 cm** : la plancha déborde nettement du socle, créant la silhouette "soucoupe sur cube" caractéristique
- **100 cm** : la plancha forme une vraie couronne autour du foyer, avec un effet visuel plus imposant

Cela compte pour le **passage** autour du brasero : prévoyez au minimum 80 cm de dégagement tout autour pour cuisiner et faire passer les convives sans frôler une plancha à 250 °C.

---

## Pour aller plus loin

- [Acheter son premier brasero : le guide du débutant](/blog/premier-brasero-guide-debutant) — quel modèle pour démarrer, quel budget, quelle erreur éviter
- [Plancha inox ou acier carbone : quel matériau choisir](/blog/plancha-inox-ou-acier-carbone) — une fois la taille décidée, le choix du matériau de plancha
- [Comment choisir son braséro quand on est restaurateur](/blog/choisir-brasero-restaurateur-professionnel) — pour les usages professionnels et grandes tablées régulières
- [Pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais) — ce qui distingue un brasero artisanal quel que soit son diamètre`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Quel brasero choisir selon le nombre de convives : 50, 80 ou 100 cm ?",
    meta_title: "Quel brasero choisir : 50, 80 ou 100 cm selon les convives",
    meta_description: "50, 80 ou 100 cm de diamètre ? Le guide complet pour choisir la taille de votre brasero plancha selon le nombre de convives, l'usage et l'espace. Capacités réelles, conseils d'artisan.",
    excerpt: "Combien serez-vous autour du brasero, le plus souvent ? La réponse à cette seule question décide de la taille à choisir, de la consommation de bois, et de la sérénité du cuisinier. Le guide pour ne pas se tromper.",
    content,
    read_time: 7,
    tags: ['guide d\'achat', 'taille brasero', 'diamètre', 'convives', '50 cm', '80 cm', '100 cm'],
    related_articles: [
      'premier-brasero-guide-debutant',
      'plancha-inox-ou-acier-carbone',
      'pourquoi-brasero-artisanal-francais',
    ],
    related_products: ['brasero-acier-100-l-obelix', 'brasero-en-acier-80-lemorris', 'brasero-coffy-50'],
    cta_product_slug: 'brasero-acier-100-l-obelix',
    cta_text: "Découvrir L'Obélix",
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'quel-brasero-choisir-nombre-convives');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ quel-brasero-choisir-nombre-convives réécrit`);
console.log(`  Mots: ~${wordCount}`);
