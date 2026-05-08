/**
 * Étape 2 anti-cannibalisme : transformer brasero-corten-avantages-inconvenients
 * en page pivot du cluster corten.
 * - Enrichi à ~2000 mots
 * - Couvre tous les sous-sujets en surface
 * - Renvoie vers les articles profonds (#10 taches, #11 bord de mer)
 */
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

const newContent = `## L'acier corten, c'est quoi exactement ?

L'acier corten — abréviation de **COR**rosion **TEN**sile, un alliage breveté dans les années 1930 par US Steel — est un acier auquel on ajoute du cuivre, du chrome, du nickel et du phosphore en faibles proportions. Cette composition change radicalement son comportement face à l'humidité.

Au contact de l'air et de l'eau, le corten développe une couche d'oxyde brun-orangé — la fameuse **patine** — qui se stabilise et **protège le métal** au lieu de le ronger. Contrairement à la rouille d'un acier standard qui s'enfonce et finit par perforer la pièce, la patine corten **arrête sa propre progression** au bout de quelques mois. C'est un matériau qui se défend tout seul.

On le trouve en architecture (musée du MuCEM à Marseille, ponts du Mississippi), en art contemporain (Richard Serra, Anish Kapoor) et dans le mobilier d'extérieur haut de gamme. Il est conçu pour vivre dehors, sans rentrer, sans s'entretenir, pendant des décennies.

> **Vue d'ensemble du cluster corten.** Cet article fait le tour complet des avantages et inconvénients. Pour les deux questions les plus pointues, deux guides dédiés vous attendent : les [taches de rouille sur terrasse](/blog/brasero-corten-taches-terrasse-solutions) et le [comportement du corten en bord de mer face à l'air salin](/blog/brasero-corten-bord-mer-air-salin).

---

## Les avantages du brasero corten

### Zéro entretien sur toute la durée de vie

C'est l'avantage qui change tout. Un brasero en acier corten ne demande **aucun traitement** : ni peinture, ni vernis, ni antirouille, ni huilage du socle. La patine se forme naturellement et se régénère d'elle-même si elle est rayée. Vous pouvez laisser votre brasero dehors toute l'année — pluie, neige, gel, soleil, embruns — sans intervenir.

Concrètement, sur 10 ans d'usage, un brasero corten **ne vous coûte rien** en entretien, là où un brasero peint demandera ponctuellement des retouches anti-rouille sur les zones de soudure ou les angles. Un brasero [fabriqué dans les Deux-Sèvres](/fabrication) par l'Atelier LBF est pensé pour traverser les saisons sans intervention.

### Une esthétique vivante qui mûrit avec le temps

La patine corten **évolue**. Et c'est probablement ce qui plaît le plus aux propriétaires. Les premières semaines, les tons sont orangés vifs, parfois irréguliers — le brasero "respire". Progressivement, la couleur s'assombrit vers un **brun chaud profond**, plus mat, plus homogène. Après six à douze mois, votre brasero a sa teinte définitive — un brun terre qui s'accorde naturellement au bois, à la pierre, au béton brut, à la végétation.

Chaque brasero corten est **unique**. La patine se développe différemment selon l'orientation (pluie, soleil dominant, vent), créant des variations de teintes propres à chaque exemplaire. Deux braseros identiques sortis du même atelier auront des patines visiblement différentes après six mois en extérieur.

### Une résistance structurelle supérieure à l'acier standard

À épaisseur égale, le corten est **mécaniquement plus résistant** que l'acier S235 classique : limite élastique d'environ 355 MPa contre 235 MPa. Nos socles en corten de 3 mm supportent sans faillir des charges supérieures à 100 kg (bol rempli de braises + plancha en fonte + bois). La patine ne fragilise pas la structure : elle ne fait que quelques dizaines de microns d'épaisseur et n'altère pas le métal en profondeur.

### Une durée de vie qui se compte en décennies

Les ouvrages en corten en architecture ont des durées de vie documentées de **50 à 100 ans** sans intervention majeure. Pour un brasero, cela signifie : pas de pièces d'usure, pas de revêtement qui s'écaille, pas de mécanisme qui se grippe, pas de soudure qui rouille parce que la peinture s'est éclatée. C'est un objet qui se transmet.

À titre de comparaison, un brasero peint thermolaqué bien entretenu tient 15 à 25 ans avant que la peinture ne demande des retouches sérieuses. Un brasero corten dépasse facilement le double — et encore, on parle de la borne basse.

---

## Les inconvénients réels (sans filtre)

### Les coulures de rouille pendant la phase de patinage

C'est **le** point d'attention numéro un, celui qui cristallise le plus de questions à l'atelier. Pendant les 4 à 8 premières semaines, avant que la patine ne se stabilise, des **coulures d'oxyde orangé** peuvent apparaître sous l'effet de la pluie. Ces coulures tachent les surfaces poreuses claires : dalle en pierre blanche, terrasse en bois clair, béton lissé.

La solution est simple : pendant la phase de patinage, placez votre brasero sur une **surface minérale foncée** (gravier, pierre naturelle sombre, béton brut) ou utilisez un tapis de protection ignifugé. Une fois la patine stabilisée, les coulures cessent presque totalement.

Ce sujet est suffisamment important pour mériter son propre guide. Si vous craignez pour votre dalle ou si vous avez déjà des taches : → [Lire le guide complet : taches de rouille corten sur terrasse — comment protéger et nettoyer](/blog/brasero-corten-taches-terrasse-solutions).

### Le comportement en bord de mer demande des nuances

L'air salin accélère la formation de la patine et modifie légèrement son comportement. Le corten **tient** très bien en bord de mer — c'est même un de ses terrains de prédilection — mais il y a des précautions à connaître selon que vous êtes en Bretagne, en Vendée, sur la Côte d'Azur ou en Corse.

Plutôt que de résumer ici de façon imprécise, on a écrit un guide dédié, alimenté par cinq ans de retours clients dans toutes les régions côtières françaises : → [Brasero corten en bord de mer : tient-il l'air salin ?](/blog/brasero-corten-bord-mer-air-salin)

### L'aspect "rouillé" divise

Certains visiteurs non avertis voient un brasero corten et pensent : "il est rouillé, il est abîmé, il faut le repeindre". C'est un choix esthétique fort qui ne plaît pas à tout le monde. Si vous (ou les membres de votre foyer) préférez un aspect **net, uniforme et constant**, regardez plutôt nos modèles en acier peint thermolaqué noir mat.

Pour vous aider à départager, on a aussi écrit un comparatif des [matériaux de plancha — inox ou acier carbone](/blog/plancha-inox-ou-acier-carbone), qui complète bien ce choix de socle.

### Pas de choix de couleur

Le corten est brun-orangé puis brun foncé. Point. Pas de noir, pas de gris anthracite, pas de blanc, pas de vert. Si vous voulez **personnaliser** la teinte de votre brasero — par exemple pour s'accorder à un mobilier ou à un projet paysager précis — l'acier peint thermolaqué offre toute la palette RAL.

### Le prix est légèrement supérieur

Le corten coûte plus cher à la matière (~30 % de plus que l'acier S235 classique) et demande un savoir-faire de soudure spécifique. Conséquence : un brasero corten est généralement **150 à 300 € plus cher** qu'un équivalent en acier peint. C'est un investissement qui se rentabilise par l'absence d'entretien sur la durée.

Pour comprendre plus largement ce qui justifie le prix d'un brasero artisanal français, voir notre [décryptage complet du prix d'un brasero artisanal](/blog/prix-brasero-artisanal-decryptage).

---

## Corten ou acier peint : tableau récapitulatif

| Critère | Acier corten | Acier peint thermolaqué |
|---|---|---|
| Entretien | Aucun | Housse recommandée, retouches ponctuelles |
| Esthétique | Patine vivante, évolutive | Noir mat constant |
| Résistance intempéries | Excellente, durée 50+ ans | Très bonne, durée 15-25 ans |
| Coulures temporaires | Oui, 4 à 8 semaines | Aucune |
| Choix de couleur | Brun corten uniquement | Toute la palette RAL |
| Prix | +150 à 300 € vs acier peint | Référence |
| Idéal pour | Jardins naturels, esprit brut, bord de mer | Terrasses urbaines, esthétique nette |

---

## À qui s'adresse vraiment un brasero corten ?

**Le corten est fait pour vous si :**

- Vous voulez un objet qui s'intègre à un jardin naturel, à un esprit brut, minéral ou contemporain
- Vous ne voulez **rien** entretenir, jamais
- Vous gardez votre brasero dehors toute l'année sans le rentrer
- Vous appréciez l'idée d'un matériau qui mûrit et raconte le temps qui passe
- Votre sol est en gravier, pierre naturelle foncée, béton brut, ou vous acceptez d'utiliser un tapis pendant 2 mois
- Vous habitez en bord de mer (le corten y est parfaitement à l'aise — voir le [guide dédié](/blog/brasero-corten-bord-mer-air-salin))

**Le corten n'est pas pour vous si :**

- Vous avez une terrasse en pierre claire et vous ne voulez voir aucune trace, même temporaire
- L'aspect "rouille" vous met mal à l'aise visuellement
- Vous voulez assortir le brasero à un coloris précis
- Vous cherchez le prix d'entrée le plus bas possible

---

## Mon avis après des années à fabriquer les deux

Sur les braseros que nous expédions chaque mois depuis l'atelier, environ **60 % partent en corten** et 40 % en acier peint. Les retours clients sur le corten, après deux ans d'usage, sont **systématiquement enthousiastes** : pas un seul propriétaire ne nous a demandé à repeindre. Les seules réclamations que nous avons eues concernaient des coulures sur dalle claire dans les premières semaines — un sujet 100 % traitable avec les bonnes précautions.

Mon conseil honnête : si vous hésitez, **demandez-vous d'abord ce que vous voulez voir dans votre jardin dans dix ans**. Un brasero qui aura le même aspect qu'au premier jour ? Choisissez le peint. Un brasero qui aura mûri avec votre jardin, qui aura sa propre histoire visuelle, qui demande zéro effort ? Le corten est imbattable.

C'est aussi le matériau qu'on choisit nous-mêmes pour les braseros qu'on garde à l'atelier. Ça en dit long.

---

## Pour aller plus loin sur le corten

- [Taches de rouille corten sur terrasse : comment protéger et nettoyer](/blog/brasero-corten-taches-terrasse-solutions) — la question pratique des coulures, en détail
- [Brasero corten en bord de mer : tient-il l'air salin ?](/blog/brasero-corten-bord-mer-air-salin) — retours d'expérience par région côtière
- [Pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais) — la philosophie de fabrication
- [Combien coûte un vrai brasero artisanal ? La transparence sur les prix](/blog/prix-brasero-artisanal-decryptage) — décryptage des prix`;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Brasero corten : avantages, inconvénients et retour d'expérience après des années",
    meta_title: "Brasero corten : avantages, inconvénients (guide pivot 2026)",
    meta_description: "Acier corten pour brasero : patine, résistance, durée de vie, coulures temporaires, prix. Tous les avantages et inconvénients après des années de fabrication, par un artisan français.",
    excerpt: "L'acier corten fascine par sa patine rouille naturelle et son zéro entretien, mais il soulève des questions légitimes : est-ce que ça tache ? Est-ce solide ? Comment ça vieillit ? Le retour d'expérience complet d'un fabricant français, avec deux guides spécialisés pour aller plus loin.",
    content: newContent,
    read_time: 11,
    tags: ['corten', 'acier corten', 'patine', 'rouille', 'avantages', 'inconvénients', 'brasero', 'guide pivot'],
    related_articles: [
      'brasero-corten-taches-terrasse-solutions',
      'brasero-corten-bord-mer-air-salin',
      'pourquoi-brasero-artisanal-francais',
    ],
    related_products: ['brasero-acier-100-l-obelix', 'le-fermier'],
    cta_product_slug: 'le-fermier',
    cta_text: 'Découvrir nos braseros corten artisanaux',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'brasero-corten-avantages-inconvenients');

if (error) { console.error(error); process.exit(1); }
console.log('✓ #9 brasero-corten-avantages-inconvenients enrichi en page pivot');
console.log(`  Mots: ~${newContent.split(/\s+/).length}`);
