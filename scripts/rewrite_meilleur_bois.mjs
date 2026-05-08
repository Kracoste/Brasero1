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

const content = `Le bois que vous mettez dans votre brasero détermine plus de choses que vous ne le pensez : la qualité des braises, la durée de chaleur exploitable, la propreté de la combustion, et même le goût des aliments cuits sur la plancha. On peut investir 2 000 € dans un brasero artisanal et le transformer en feu de camp médiocre simplement en y brûlant le mauvais bois.

> Le brasero amplifie la qualité du combustible. Du bon bois donne des résultats spectaculaires. Du mauvais bois donne au mieux des déceptions, au pire des problèmes.

Cet article est le guide complet du **bois de brasero** : les cinq essences qu'on recommande, les critères qui les distinguent, les bois à proscrire absolument, comment vérifier qu'un bois est sec, et le format de bûches qui donne les meilleurs résultats. C'est l'article qu'on aurait aimé lire la première fois qu'on a allumé un brasero.

---

## Pourquoi le choix du bois change tout

Tous les bois brûlent. Aucun ne brûle de la même manière. Pour un brasero plancha, vous ne cherchez pas un feu de cheminée — un feu spectaculaire avec des grandes flammes — mais un **lit de braises denses**, capable de maintenir une chaleur stable pendant 1 à 2 heures, le temps d'un vrai repas.

Cette nuance change tout dans le choix de l'essence. Un bois résineux fait de belles flammes, mais s'éteint en 20 minutes et n'a presque pas de braises. Un bois dur de feuillu donne moins de flammes mais des braises massives qui restent rouges sous la plancha pendant le service entier.

[chiffre]< 20 %|taux d'humidité maximum pour un bois de brasero exploitable[/chiffre]

Pour le **chauffage d'ambiance** en intersaison ou en hiver, vous cherchez la même chose : un feu qui dure, qui rayonne, et qui ne projette pas d'étincelles sur les invités. Là encore, c'est la **densité** et le **taux d'humidité** qui font la différence — pas l'essence "noble" ou "modeste" affichée par votre fournisseur.

## Les 4 critères qui définissent un bon bois de brasero

Avant de passer aux essences une à une, voici les critères qui les classent — et qui vous permettront de juger un tas de bois proposé par un fournisseur que vous ne connaissez pas.

- **Le pouvoir calorifique** (PCI) — exprimé en kWh/stère, c'est l'énergie totale dégagée par la combustion. Le chêne tourne autour de 2 000 kWh/stère, le charme atteint 2 100, les résineux plafonnent à 1 500.
- **La densité** — un bois dense brûle plus lentement et donne des braises plus durables. C'est la différence entre une bûche qui dure 45 minutes et une qui dure 1 h 30.
- **Le taux d'humidité** — capital. Un bois à 25 % d'humidité **gaspille un tiers de son énergie** à évaporer son eau. Cible : moins de 20 %, idéalement 15 à 18 %.
- **Le comportement à la combustion** — quantité de fumée, projections d'étincelles, dépôts sur la plancha, propreté de la cendre.

Ces quatre critères suffisent à classer toutes les essences. Voici les cinq qui passent le test pour un brasero plancha.

## 1. Le chêne — la référence absolue

Le chêne est le bois de référence pour le brasero plancha en France. C'est la valeur sûre, celle qu'on recommande sans hésiter à un client qui démarre. Son **pouvoir calorifique avoisine 2 000 kWh/stère**, sa combustion est lente et régulière, et ses braises sont denses, durables, avec un rayonnement infrarouge puissant qui chauffe la plancha de manière homogène.

- **Braises** : excellentes, durée 1 h 30 à 2 h
- **Fumée** : modérée, parfum agréable rappelant les vieilles cheminées
- **Étincelles** : très rares
- **Prix** : moyen — 70 à 100 €/stère selon les régions et les saisons
- **Disponibilité** : excellente partout en France
- **Difficulté de fendage** : moyenne (plus dur quand il est noueux)

**L'avis de l'atelier** : si vous ne devez acheter qu'une seule essence, prenez du chêne. C'est le combustible qui pardonne le plus, qui donne les meilleurs résultats sur 95 % des cuissons, et qui se trouve partout. C'est notre recommandation par défaut.

## 2. Le hêtre — la montée en température rapide

Le hêtre monte en température plus vite que le chêne. C'est un bois qui s'allume bien, qui donne des braises rapidement (en 25 minutes contre 30-35 pour le chêne), et qui brûle très proprement. En revanche, ses braises durent un peu moins longtemps — on parle d'1 h à 1 h 15 sur une grosse bûche.

- **Braises** : très bonnes, montée rapide
- **Fumée** : faible, neutre
- **Étincelles** : rares
- **Prix** : similaire au chêne, parfois légèrement supérieur dans le quart nord-est
- **Disponibilité** : excellente, surtout dans l'est et le nord de la France
- **Difficulté de fendage** : faible (se fend très bien)

**L'avis de l'atelier** : excellent en complément du chêne. La pratique idéale pour beaucoup de cuisiniers : démarrer avec deux à trois bûches de hêtre pour avoir des braises vite, puis ajouter du chêne pour la durée du service. Le hêtre est aussi le bois préféré de beaucoup de fumoirs traditionnels — sa fumée est particulièrement neutre.

## 3. Le charme — la densité maximale

Le charme est l'essence **la plus dense des forêts françaises courantes**. Plus dense que le chêne, plus dense que le hêtre. Sa combustion est la plus longue, ses braises sont les plus durables, et un foyer chargé de charme tient pratiquement le double de temps qu'un foyer chargé de hêtre. Le revers : c'est plus difficile à fendre (le bois est tellement dense qu'il résiste à la hache) et un peu plus long à allumer.

- **Braises** : exceptionnelles, durée 2 h à 2 h 30
- **Fumée** : très faible
- **Étincelles** : quasi inexistantes
- **Prix** : similaire au chêne quand on en trouve
- **Disponibilité** : moyenne — beaucoup moins courant que le chêne, à chercher chez les bûcherons locaux
- **Difficulté de fendage** : élevée (utiliser un bon fendeur)

**L'avis de l'atelier** : le meilleur bois pour les longues soirées d'hiver autour du brasero. Si vous trouvez du charme à un prix raisonnable, n'hésitez pas — c'est probablement le combustible le plus performant pour le brasero plancha. Mais ne comptez pas le fendre à la hache : un [fendeur à bûches](/produits/fendeur-a-buches) devient quasi indispensable.

## 4. Le frêne — le compromis facile

Le frêne est moins dense que les trois précédents, mais il a deux qualités majeures : il **se fend très facilement** et il **sèche vite** (un an à un an et demi suffit, contre deux ans pour du chêne en grosse section). C'est un bois polyvalent, propre, qui brûle franchement.

- **Braises** : bonnes, durée 1 h à 1 h 15
- **Fumée** : très faible
- **Étincelles** : rares
- **Prix** : souvent moins cher que le chêne (10 à 20 % d'écart)
- **Disponibilité** : excellente
- **Difficulté de fendage** : très faible

**L'avis de l'atelier** : un excellent choix d'appoint, particulièrement adapté à ceux qui fendent leur bois eux-mêmes. Ses braises sont moins puissantes que celles du chêne mais largement suffisantes pour la cuisson sur plancha. C'est le bois qu'on recommande quand le budget est un peu plus serré ou quand on veut compléter un stock de chêne sans se ruiner.

## 5. Le bois densifié (bûches compressées)

Les bûches densifiées sont fabriquées à partir de **sciure de bois compactée à haute pression**, sans liant chimique pour les meilleures références. Leur pouvoir calorifique est 2 à 3 fois supérieur au bois bûche classique pour un volume équivalent — ce qui en fait des combustibles redoutables d'efficacité, et particulièrement intéressants pour ceux qui n'ont pas de place pour stocker des stères.

- **Braises** : très bonnes, durée 1 h 30 à 2 h
- **Fumée** : très faible
- **Étincelles** : aucune
- **Prix** : plus cher au kilo (15 à 25 % de plus que le bois classique), mais beaucoup plus performant au volume
- **Disponibilité** : magasins de bricolage, points de vente bois, en ligne
- **Spécificité** : taux d'humidité ultra-bas (8 à 10 %) garanti d'usine

**L'avis de l'atelier** : excellent **complément** du bois bûche classique. On les recommande surtout pour deux usages : les soirées longues (la bûche densifiée brûle proprement et longtemps), et pour ceux qui ont peu de place pour stocker (un sac de 10 bûches densifiées remplace quasiment 0,1 stère de chêne et tient dans un coin de garage). Vérifiez toujours l'absence de liants chimiques sur l'étiquette — c'est un critère sanitaire pour la cuisson.

[atelier]
**Le geste de l'artisan**
À l'atelier, le combustible qu'on utilise nous-mêmes pour les démos clients et les tests produits, c'est un mélange : 70 % de chêne, 20 % de hêtre, 10 % de charme quand on en trouve. Pour les cuissons techniques (Saint-Jacques, poissons délicats), on bascule sur du hêtre pur — moins de fumée, contrôle thermique plus fin. Pour les soirées d'hiver longues, on charge en charme. C'est cette combinaison qui donne les meilleurs résultats sur tous les usages.
[/atelier]

## Tableau comparatif des 5 essences

| Bois | Pouvoir calorifique | Durée des braises | Fumée | Étincelles | Prix relatif | Difficulté de fendage |
|---|---|---|---|---|---|---|
| Chêne | ★★★★ | ★★★★ | Modérée | Rares | Référence | Moyenne |
| Hêtre | ★★★★ | ★★★ | Faible | Rares | = | Faible |
| Charme | ★★★★★ | ★★★★★ | Très faible | Très rares | = | Élevée |
| Frêne | ★★★ | ★★★ | Très faible | Rares | -10 à -20 % | Très faible |
| Densifié | ★★★★★ | ★★★★ | Très faible | Aucune | +15 à +25 % | N/A |

## Les bois à éviter absolument

Tous les bois ne sont pas faits pour brûler dans un brasero. Certains compromettent la cuisson, d'autres compromettent la sécurité, d'autres encore sont franchement dangereux pour la santé.

- **Pin, sapin, épicéa et autres résineux** — ils brûlent trop vite, projettent des **étincelles incandescentes** dangereuses pour les convives et le mobilier extérieur, et leur résine encrasse durablement la plancha avec des dépôts qui modifient son culottage.
- **Bois humide** (taux d'humidité supérieur à 25 %) — fume énormément, produit peu de chaleur, encrasse la plancha et génère de la **créosote** — un goudron qui se dépose dans le foyer et qui devient inflammable à terme. C'est le combustible qui ruine un brasero plus vite que n'importe quoi d'autre.
- **Bois traité, peint ou verni** — palettes industrielles, déchets de menuiserie, bois de construction — dégage des fumées **toxiques** chargées en métaux lourds et en composés organiques volatils. À ne **jamais** brûler dans un brasero où l'on cuisine, point final.
- **Palettes en général** — même non traitées en apparence, elles ont souvent été en contact avec des produits chimiques industriels lors de leur usage de transport. Le risque sanitaire ne vaut pas le gain économique.
- **Bois exotiques** (eucalyptus brut, châtaignier en grosse section) — l'eucalyptus projette beaucoup d'étincelles ; le châtaignier en bûche entière est connu pour "claquer" fort à la combustion à cause de ses inclusions d'air.
- **Bois flotté** (récupéré sur les plages) — souvent imprégné de sel, qui corrode l'acier de votre brasero à chaque combustion.

[atelier]
**Le geste de l'artisan**
L'erreur qu'on voit le plus souvent en SAV ? Des clients qui ont brûlé du résineux ou du bois trop humide pendant les premières semaines, et qui nous appellent en pensant que leur brasero a un défaut. Plancha encrassée de résine, traces noires, dépôts collants : neuf fois sur dix, c'est le combustible. Un nettoyage profond et un retour au bois sec de feuillus règlent le problème en une cuisson.
[/atelier]

## Comment vérifier qu'un bois est sec

Le taux d'humidité est probablement le critère **le plus important** de tous, et le plus souvent négligé. Quatre indices visuels suffisent à juger un tas de bois :

- **Le poids relatif** — un bois sec est nettement plus léger qu'un bois humide de même volume. Comparez deux bûches de même essence et de même taille : la sèche fera presque la moitié du poids.
- **Le son** — frappez deux bûches l'une contre l'autre. Le bois sec **sonne creux**, presque comme du bois de musique. Le bois humide fait un son sourd et mat.
- **L'écorce** — sur un bois sec, l'écorce se **détache facilement** au pouce. Sur un bois humide, elle adhère encore au tronc.
- **Les fissures de séchage** — un bois sec présente de **fines fissures radiales** aux extrémités, signe que la matière s'est rétractée pendant le séchage.

En cas de doute, un **testeur d'humidité** électronique se trouve en quincaillerie pour 10 à 15 €. Vous plantez les deux pointes dans le bois fendu (pas l'écorce), et l'écran affiche le taux. Pour un brasero, refusez tout bois affichant plus de 22 %.

## Le format des bûches : longueur et fendage

Pour un brasero, des bûches de **25 à 33 cm** sont idéales. Plus longues, elles dépassent du bol et déséquilibrent le foyer. Plus courtes, elles se consument trop vite et obligent à recharger sans cesse.

Le **fendage** compte aussi. Refendez les grosses bûches en quartiers de 8 à 10 cm de diamètre — elles s'allument beaucoup plus facilement, prennent feu uniformément et produisent des braises plus rapidement qu'une bûche entière trop épaisse. Pour un foyer de brasero plancha standard, l'idéal est un **mélange** : 70 % de quartiers fendus pour la combustion principale, 30 % de petits éclats pour relancer le feu en milieu de service.

[cta:fendeur-a-buches]Voir le fendeur à bûches[/cta]

## Combien de bois pour un repas ?

Un repas standard sur un brasero plancha demande approximativement :

- **Brasero 50 cm** : 4 à 6 kg de bois sec (un demi-cageot type cagette de marché)
- **Brasero 80 cm** : 6 à 9 kg
- **Brasero 100 cm** : 8 à 12 kg

Pour une **soirée prolongée** (cuisson + chauffage d'ambiance pendant 4 à 5 heures), comptez le double. C'est utile à connaître pour dimensionner votre stock annuel : un usage régulier (une à deux fois par semaine en saison + week-ends d'hiver) consomme entre 2 et 4 stères de bois sec par an.

## Où acheter et comment stocker

**Où acheter** :
- **Bûcherons et exploitants forestiers locaux** — c'est le meilleur rapport qualité-prix. Ils livrent souvent à domicile, le bois est généralement plus sec que celui des grandes surfaces.
- **ONF et coopératives forestières** — bois certifié, traçabilité de la coupe à la livraison.
- **Plateformes en ligne spécialisées** — pratique pour le bois densifié, à éviter pour le bois bûche (frais de livraison qui ruinent l'économie).
- **À éviter** : les sacs de "bois de cheminée" en grandes surfaces, souvent humides, mal triés, et ruineux au kilo.

**Comment stocker** :
- **Sous abri ventilé**, jamais en bâche fermée (la condensation re-mouille le bois)
- **Sur palette ou tasseaux**, jamais à même le sol
- **Empilé en croisé** pour la circulation d'air
- **Le côté coupe vers l'extérieur** pour faciliter l'évaporation
- **À l'abri du soleil direct** sur l'écorce (le bois se craquelle trop vite et perd en cohésion)

Un bois fendu et bien stocké en mai sera idéal pour l'hiver suivant. Un bois fendu et stocké en septembre ne sera pas prêt avant l'année d'après — anticipez.

---

## Pour aller plus loin

- [Cuisson au feu de bois : la science du goût fumé sur plancha](/blog/cuisson-feu-bois-gout-fume-plancha) — pourquoi le bois donne ce goût qu'aucun charbon ne reproduit
- [Premier feu : le rituel d'allumage et de rodage de votre brasero](/blog/premier-feu-rodage-brasero) — la méthode upside-down et les techniques d'allumage
- [Maîtriser la température de cuisson sur un brasero plancha](/blog/temperature-cuisson-brasero-plancha) — comment lire les braises et créer des zones de chaleur
- [Utiliser son brasero en hiver : cuisiner et chauffer la terrasse](/blog/brasero-hiver-cuisiner-chauffer-dehors) — l'usage hivernal qui consomme le plus de bois`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Quel bois pour votre brasero : les 5 meilleures essences (et celles à éviter)",
    meta_title: "Quel bois pour brasero : 5 meilleures essences (guide 2026)",
    meta_description: "Chêne, hêtre, charme, frêne, bois densifié : le comparatif complet des bois pour brasero. Pouvoir calorifique, densité, fumée, prix. Et la liste des bois à proscrire absolument.",
    excerpt: "Le bois que vous mettez dans votre brasero détermine la qualité des braises, la durée de la chaleur et le goût des cuissons. Voici les 5 essences qui font la différence — et celles qui ruinent votre repas.",
    content,
    read_time: 9,
    tags: ['bois', 'chauffage', 'braises', 'essence de bois', 'combustion', 'chêne', 'hêtre', 'charme', 'frêne', 'bois densifié'],
    related_articles: [
      'cuisson-feu-bois-gout-fume-plancha',
      'premier-feu-rodage-brasero',
      'temperature-cuisson-brasero-plancha',
      'brasero-hiver-cuisiner-chauffer-dehors',
    ],
    related_products: ['fendeur-a-buches'],
    cta_product_slug: 'fendeur-a-buches',
    cta_text: 'Voir le fendeur à bûches',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'meilleur-bois-brasero-comparatif');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ meilleur-bois-brasero-comparatif réécrit`);
console.log(`  Mots: ~${wordCount}`);
