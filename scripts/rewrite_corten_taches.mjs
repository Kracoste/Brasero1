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

const content = `Vous avez un brasero corten, ou vous êtes sur le point d'en acheter un, et la même question revient : "Et la rouille qui coule sur ma terrasse, j'en fais quoi ?" C'est probablement la **première inquiétude** des futurs propriétaires de brasero corten, et c'est une inquiétude légitime. La bonne nouvelle : c'est un phénomène temporaire, prévisible, et **100 % gérable** avec les bonnes précautions. La mauvaise : si on ne fait rien, des taches peuvent apparaître sur certaines surfaces, et elles ne partent pas toutes seules.

> Les coulures de rouille du corten sont temporaires et 100 % gérables. C'est de la chimie, pas un défaut.

Cet article est le **guide pratique complet** pour gérer cette phase de patinage : pourquoi le corten coule au début, combien de temps ça dure, comment protéger votre terrasse selon sa surface, comment nettoyer les taches existantes par type de sol, et quand vous pouvez enfin poser le brasero "n'importe où" sans précaution. C'est l'article qu'on aurait aimé fournir avec chaque brasero corten livré.

---

## Pourquoi le corten coule au début (et pourquoi ça s'arrête)

L'acier corten est un alliage spécifiquement conçu pour développer une **patine d'oxyde protectrice** au contact de l'air et de l'eau. Cette patine — la fameuse couleur brun-orangée — n'est pas un défaut : c'est ce qui rend l'acier corten **résistant aux décennies sans entretien**. Mais cette patine ne se forme pas instantanément. Elle se construit pendant les premières semaines de vie du brasero en extérieur, et c'est cette construction qui produit les coulures.

Dans le détail chimique : pendant la phase active d'oxydation, des **micro-particules d'oxyde de fer** se forment à la surface du métal. Tant que la couche n'est pas suffisamment dense et adhérente, ces particules peuvent être **dissoutes par la pluie** et entraînées vers le bas du brasero, créant des coulures orangées qui peuvent atteindre le sol et s'y déposer.

[chiffre]4 à 8 semaines|durée moyenne de la phase de coulures actives sur un brasero corten[/chiffre]

Le phénomène s'arrête de lui-même quand la patine atteint une **densité critique** : la couche d'oxyde devient adhérente, hydrophobe, et la pluie n'arrive plus à dissoudre des particules. À partir de ce moment-là, votre brasero ne coule plus du tout — et il ne coulera plus jamais, même après vingt ans en extérieur.

## La phase de patinage : ce qui influence la durée

Les 4 à 8 semaines évoquées sont une moyenne. Trois facteurs principaux influencent la durée réelle dans votre cas :

- **Le climat** — Un climat **humide et pluvieux** (Bretagne, Normandie, Pays basque) accélère la patine : l'oxydation est continue, l'eau apporte les conditions chimiques nécessaires. Comptez 4 à 6 semaines. Un climat **sec** (Provence, sud Méditerranée) ralentit le processus : 6 à 8 semaines, parfois plus si l'été est très sec sans aucune pluie.
- **L'alternance pluie / soleil** — C'est paradoxalement le scénario qui **stabilise la patine le plus vite**. Les cycles humide-sec font littéralement "respirer" l'acier, qui développe une couche plus dense plus rapidement. Une terrasse exposée à la pluie et au soleil verra son brasero patiner plus vite qu'un brasero installé sous un préau permanent.
- **L'orientation et l'exposition** — Un brasero installé plein sud, exposé à la pluie battante, patinera plus vite et plus uniformément qu'un brasero abrité ou installé en zone protégée. L'exposition aux **embruns marins**, en bord de mer, accélère encore le processus (sujet traité en détail dans le guide [brasero corten en bord de mer](/blog/brasero-corten-bord-mer-air-salin)).

Pendant cette phase, votre brasero **passe de l'orangé vif au brun profond**. C'est une transition esthétique que beaucoup de propriétaires apprécient — chaque semaine, le brasero évolue, et la patine finit par s'harmoniser avec son environnement.

## Le tableau des risques par type de surface

Toutes les surfaces ne réagissent pas de la même manière aux coulures de corten. Voici une cartographie claire des risques :

| Surface au sol | Risque de tache | Difficulté de nettoyage | Verdict |
|---|---|---|---|
| Pierre naturelle claire (calcaire, marbre, travertin) | ★★★★★ | Élevée | Protection obligatoire |
| Béton lissé clair | ★★★★ | Élevée | Protection obligatoire |
| Carrelage clair | ★★★ | Moyenne | Protection recommandée |
| Bois clair non traité | ★★★★ | Très élevée | Protection obligatoire |
| Bois huilé / saturateur | ★★ | Moyenne | Protection recommandée |
| Bois composite | ★★ | Faible | Protection légère |
| Dalle pierre foncée (basalte, ardoise) | ★ | Faible | Aucune précaution |
| Béton brut anthracite | ★ | Faible | Aucune précaution |
| Gravier | — | — | Aucune précaution |
| Terre / pelouse | — | — | Aucune précaution |

La règle de lecture : **plus la surface est claire et poreuse, plus le risque est élevé**. Une pierre blanche poreuse capture les particules d'oxyde dans ses micro-cavités, ce qui rend le nettoyage difficile. Un gravier foncé, à l'inverse, "avale" les coulures sans laisser de trace visible.

## Comment protéger AVANT que les taches arrivent

C'est de loin la stratégie la plus efficace : **prévenir au lieu de nettoyer**. Voici les solutions concrètes par type de surface.

### Sur pierre claire ou béton lissé

Posez un **tapis de protection ignifugé** ou un morceau de géotextile épais sous le brasero pendant les 4 à 8 premières semaines. Le géotextile (vendu en jardinerie pour 5-10 €/m²) est idéal : il absorbe les coulures, supporte la chaleur résiduelle du foyer, et il se jette une fois la phase de patinage terminée.

À défaut, une **bâche en PVC épais** fonctionne aussi, mais elle ne supporte pas le contact direct avec le bol chaud (à éloigner de la zone d'aplomb du foyer).

### Sur terrasse en bois clair

C'est la surface la plus sensible — les coulures pénètrent dans les fibres du bois et y sont **très difficiles à enlever**. Deux options selon votre projet :

- **Tapis de protection ignifugé** + retrait après stabilisation (recommandé)
- **Plaque de pierre foncée** (ardoise, basalte 60×60 cm) posée comme socle décoratif sous le brasero — solution durable et esthétique, qui devient permanente

Les bois huilés ou saturés résistent mieux que les bois bruts, mais le risque reste réel. Le bois composite résiste un peu mieux mais peut quand même se tacher sur une exposition prolongée.

### Sur gravier ou terre

Aucune précaution nécessaire. Posez le brasero, ne vous occupez de rien — les coulures disparaissent dans le sol sans laisser de trace visible.

### Sur dalles pierre foncée

Aucune précaution nécessaire en pratique. Les coulures peuvent éventuellement laisser des traces très légères qui se confondent avec la teinte naturelle de la pierre, et qui s'estompent avec les pluies suivantes.

[atelier]
**Le geste de l'artisan**
Quand un client nous appelle avant la livraison pour s'inquiéter de sa terrasse claire, on lui recommande systématiquement la même chose : commander en même temps que le brasero un mètre carré de **géotextile renforcé** chez un fournisseur de jardinage, le poser sous le brasero les 6 premières semaines, et **prendre ce temps comme une période de transition** pendant laquelle on observe la patine se construire. Une fois la couleur du brasero stabilisée en brun profond uniforme, on retire le géotextile, on rince légèrement le sol à l'eau claire, et la vie normale reprend. Pas de panique, pas de mauvaise surprise.
[/atelier]

## Comment nettoyer des taches déjà présentes

Si les coulures ont déjà taché votre terrasse, ne paniquez pas : il existe des méthodes qui marchent par type de surface. Plus la tache est **fraîche**, plus le nettoyage est facile — agissez dans les jours qui suivent l'apparition pour maximiser vos chances.

### Pierre naturelle ou béton

**Méthode 1 — Jus de citron + gros sel** (taches récentes)
- Versez du jus de citron pur sur la tache jusqu'à recouvrir
- Saupoudrez généreusement de gros sel
- Laissez agir 30 à 60 minutes
- Frottez avec une brosse à poils durs, sans relâcher
- Rincez abondamment à l'eau claire

**Méthode 2 — Acide oxalique dilué** (taches plus tenaces)
L'acide oxalique (aussi appelé "sel d'oseille") est le produit naturel le plus efficace contre la rouille. Disponible en droguerie ou en magasin de bricolage pour 5-10 €.

- Diluez 1 cuillère à soupe dans 1 litre d'eau **tiède** (pas chaude)
- Appliquez à la brosse sur la tache
- Laissez agir 15 à 20 minutes
- Frottez et rincez à grande eau

⚠️ Portez des gants et des lunettes — l'acide oxalique est irritant. Testez d'abord sur une zone peu visible (certaines pierres sensibles peuvent réagir).

**Méthode 3 — Antirouille du commerce**
Les produits type "Rubigine", "Rouille Net" ou équivalents fonctionnent très bien sur pierre et béton. Suivez les instructions du fabricant. Plus chers mais plus rapides.

### Terrasse en bois

C'est la situation la plus délicate. Trois pistes selon la profondeur de la tache :

- **Tache de surface** : acide oxalique dilué (méthode ci-dessus), avec **test préalable** sur une zone cachée. Le produit peut éclaircir le bois.
- **Tache moyenne** : ponçage léger au papier de verre **grain 120 puis 180**, suivi d'une application d'huile bois ou de saturateur pour uniformiser la teinte.
- **Tache profonde et incrustée** : ponçage plus agressif (grain 80 → 120 → 180), refonte complète du saturateur sur la zone. Le bois peut nécessiter une lasure de raccord pour retrouver sa teinte d'origine.

Pour les bois **huilés** ou **saturés**, le ponçage donne de très bons résultats car la tache n'a souvent pénétré que la couche de finition.

### Carrelage

C'est la surface la plus simple à nettoyer.

- **Vinaigre blanc chaud** : chauffez du vinaigre blanc sans bouillir, appliquez sur la tache, laissez agir 10 à 15 minutes, frottez et rincez. Efficace sur 90 % des cas.
- **Antirouille du commerce** : pour les taches anciennes, les produits du commerce fonctionnent très bien sur les surfaces lisses non poreuses.

### Composite ou résine

Surfaces lisses, non poreuses, traitement simple :

- Eau savonneuse + frottement à la brosse douce pour les taches fraîches
- Acide oxalique très dilué (1 cuillère à café dans 1 litre) pour les taches plus marquées
- Éviter les produits abrasifs qui pourraient rayer la surface

[atelier]
**Le geste de l'artisan**
La méthode qu'on utilise nous-mêmes pour les démos clients sur dalle de pierre claire, c'est l'**acide oxalique dilué** appliqué tiède au pinceau, laissé 15 minutes, brossé énergiquement, rincé à grande eau. C'est la méthode la plus fiable, peu coûteuse, qui marche sur 95 % des situations. La seule règle absolue : **toujours tester sur une zone cachée** avant d'appliquer sur la zone visible. Certaines pierres calcaires très tendres peuvent légèrement blanchir au contact de l'acide.
[/atelier]

## Le cas particulier du bois clair

Le bois clair non traité (chêne brut, mélèze, pin) est la surface la plus à risque, et celle qui demande le plus d'attention. Voici pourquoi :

- Le bois est **poreux** : les particules d'oxyde de fer pénètrent dans les fibres
- La rouille **réagit avec les tanins** du bois : sur les bois riches en tanins (chêne notamment), les particules de fer se lient chimiquement aux tanins et noircissent la zone
- Le bois est **sensible aux acides** : les méthodes de nettoyage par acide oxalique peuvent éclaircir le bois et créer une zone visiblement plus claire

Pour les terrasses en bois clair, **la prévention est de loin la meilleure stratégie**. Si vous achetez un brasero corten et que votre terrasse est en bois clair, prévoyez impérativement une protection (géotextile, plaque de pierre, dalle de béton décoratif) pendant les 8 premières semaines. C'est non négociable.

Si la tache est déjà là et que les méthodes douces n'ont pas suffi, le **ponçage + huile/saturateur** reste la solution la plus fiable, mais demande un peu de temps et de matériel.

## Combien de temps avant de "pouvoir poser n'importe où" ?

Trois phases successives dans la vie de votre brasero corten :

- **Phase 1 — Coulures actives (semaines 1 à 8)** : protection obligatoire sur surfaces sensibles, le brasero "vit" et se patine
- **Phase 2 — Stabilisation (mois 2 à 4)** : les coulures cessent, mais des micro-particules peuvent encore se déposer après une grosse pluie. On peut commencer à retirer la protection sur les surfaces moyennement sensibles.
- **Phase 3 — Stabilité totale (à partir du 4e mois)** : la patine est complète, le brasero ne coule plus du tout. Vous pouvez le déplacer **librement sur n'importe quelle surface**, y compris pierre blanche poreuse, sans aucun risque de tache.

Au-delà de 4 mois, le brasero corten est probablement l'objet d'extérieur **le plus simple à vivre** au quotidien : aucun entretien, aucune protection, aucune retouche jamais.

## Mythes et idées reçues

**"Un brasero corten taché est foutu, il faut le rentrer."**
Faux. Les taches sur le sol n'affectent en rien le brasero lui-même. Une fois la patine stabilisée, le brasero ne coule plus, et il peut rester dehors en permanence.

**"Une couche de vernis sur le corten empêche les coulures."**
Vrai mais contre-productif. Vernir un corten **bloque** la patine et fige l'aspect orangé vif des premières semaines. Au premier impact, le vernis s'écaille, l'oxydation reprend localement, et vous obtenez des taches inégales et permanentes. Le corten doit pouvoir respirer.

**"L'acier peint, c'est plus simple, pas de coulures."**
Vrai sur les coulures, mais c'est un autre compromis : la peinture se patine elle aussi, peut s'écailler aux soudures, demande des retouches ponctuelles avec le temps. Ce n'est pas une solution sans entretien — juste un entretien différent. Le sujet est traité en détail dans [le guide pivot corten vs acier peint](/blog/brasero-corten-avantages-inconvenients).

**"Plus j'attends pour nettoyer, plus c'est facile."**
Faux. C'est l'inverse exact : une tache fraîche se nettoie en 30 minutes, une tache de 6 mois nécessite parfois un ponçage. **Agissez vite**, dès que vous voyez apparaître les premières coulures.

## Quand contacter l'atelier

Dans 99 % des cas, ces méthodes suffisent et la phase de patinage se passe sans problème majeur. Mais si :

- Les **coulures persistent au-delà de 3 mois** (au-delà de la fenêtre normale)
- Vous observez des **taches noires** ou des **dépôts collants** (pas de simple oxyde orange)
- Une zone **continue de couler** alors que le reste du brasero a stabilisé sa patine

→ Contactez l'atelier. Ce sont des situations rares mais qui peuvent indiquer un défaut localisé sur le brasero (zone de soudure mal protégée, contamination de surface en fabrication). Nous diagnostiquons avec une photo et nous trouvons systématiquement une solution.

---

## Pour aller plus loin

- [Brasero corten : avantages, inconvénients et retour d'expérience](/blog/brasero-corten-avantages-inconvenients) — la page pivot du cluster corten, vue d'ensemble du matériau
- [Brasero corten en bord de mer : tient-il l'air salin ?](/blog/brasero-corten-bord-mer-air-salin) — pour les propriétaires en zone côtière
- [Pourquoi choisir un brasero artisanal fabriqué en France](/blog/pourquoi-brasero-artisanal-francais) — la fabrication française et la garantie qui va avec
- [Hivernage du brasero : comment le ranger et le protéger](/blog/preparer-brasero-hiver-hivernage) — pour anticiper la première saison froide`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Brasero corten et taches de rouille : protéger sa terrasse et nettoyer les coulures",
    meta_title: "Taches rouille brasero corten : prévention et nettoyage",
    meta_description: "Coulures de rouille du brasero corten sur terrasse : pourquoi ça coule, combien de temps, comment protéger pierre, bois et carrelage, comment nettoyer les taches existantes. Le guide complet.",
    excerpt: "Votre brasero corten va couler un peu pendant 4 à 8 semaines, c'est normal et temporaire. Voici comment protéger votre terrasse selon sa surface, et comment nettoyer les coulures qui auraient déjà taché — avec les bonnes méthodes par type de sol.",
    content,
    read_time: 8,
    tags: ['corten', 'rouille', 'taches', 'terrasse', 'nettoyage', 'protection', 'patine', 'acide oxalique'],
    related_articles: [
      'brasero-corten-avantages-inconvenients',
      'brasero-corten-bord-mer-air-salin',
      'pourquoi-brasero-artisanal-francais',
      'preparer-brasero-hiver-hivernage',
    ],
    related_products: ['brasero-acier-100-l-obelix', 'le-fermier'],
    cta_product_slug: 'brasero-acier-100-l-obelix',
    cta_text: "Découvrir L'Obélix",
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'brasero-corten-taches-terrasse-solutions');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ brasero-corten-taches-terrasse-solutions réécrit`);
console.log(`  Mots: ~${wordCount}`);
