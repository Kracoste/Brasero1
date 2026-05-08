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

const content = `Sur un brasero plancha, il n'y a pas de bouton de réglage. Pas de thermostat, pas d'écran à 0,5 °C près, pas de molette graduée. Et pourtant, on cuisine avec une précision étonnante — celle des cuisiniers professionnels qui travaillent au feu de bois depuis des siècles, et qui maîtrisent leur foyer avec un niveau de finesse qui laisse pantois ceux qui découvrent la discipline. La différence : ici, **on pilote la chaleur** avec du bois et avec de la place sur la surface, au lieu de la régler avec un cadran.

> Sur un brasero plancha, la chaleur ne se règle pas avec un bouton — elle se pilote avec du bois et de la place sur la surface.

Cet article est le **guide pratique** pour maîtriser la température de cuisson sur un brasero plancha : les 4 phases thermiques de votre foyer, comment identifier l'état des braises, le test de l'eau qui valide la mise en chauffe, les 3 zones thermiques de la plancha, la technique du déplacement, le pilotage actif, les tableaux de cuisson par aliment, et les erreurs à éviter. À la fin, vous saurez **piloter** votre brasero — pas juste l'allumer.

---

## La chaleur au feu de bois : un autre rapport au temps

Sur un appareil électrique ou à gaz, la température est un **paramètre** : on tourne un bouton, le système ajuste, on cuisine à 220 °C exactement. C'est efficace, c'est reproductible, et c'est complètement différent de ce qui se passe sur un brasero plancha.

Sur un brasero, la chaleur est un **flux dynamique** qui dépend du combustible engagé, de l'âge des braises, de la position du bois, du vent, de l'humidité de l'air, et de la quantité d'aliments posés sur la plancha. Tous ces paramètres bougent en temps réel pendant le service. Le rôle du cuisinier n'est pas de "régler la température" — c'est de **doser le bois**, **placer les aliments dans les bonnes zones**, et **déplacer en cours de cuisson** selon ce qui se passe sous la plancha.

Cette philosophie s'apprend en 3 à 5 sessions. Une fois acquise, elle change durablement la manière dont on cuisine en extérieur — et beaucoup de cuisiniers passionnés ne reviennent plus jamais en arrière.

## Les 4 phases thermiques de votre brasero

Tout service au brasero plancha passe par quatre phases successives, dont la durée totale tourne autour de **2 à 3 heures** pour un repas standard.

### Phase 1 — L'allumage (0 à 20 min)

Vous mettez du petit bois sec et un allume-feu naturel au centre du foyer, vous ajoutez progressivement des bûches en laissant de l'air circuler entre elles. La plancha **n'est pas encore chaude** — n'y posez rien. Si vous tentez une cuisson à ce stade, l'aliment colle, brûle par endroits, refroidit le métal localement et compromet le reste du service.

Pour la méthode complète d'allumage et le rituel de premier feu sur un brasero neuf, voir le guide dédié : [premier feu et rodage de votre brasero](/blog/premier-feu-rodage-brasero).

### Phase 2 — La formation des premières braises (20 à 35 min)

Les bûches initiales ont commencé à s'effondrer en braises rougeoyantes. La plancha **monte sérieusement en température**. C'est le moment du **test de l'eau** (voir plus bas) — si la plancha le valide, vous pouvez commencer à cuisiner. Sinon, attendez 5 à 10 minutes de plus.

### Phase 3 — La zone optimale de cuisson (35 min à 2 h)

C'est la fenêtre principale du service. Les braises sont **denses, rouges profondes, recouvertes d'une fine cendre blanche** qui indique leur stabilité thermique. La plancha délivre une chaleur régulière sur toute sa surface, avec un gradient marqué entre le centre (très chaud) et les bords (modéré).

[chiffre]45 à 90 min|fenêtre de cuisson optimale après allumage[/chiffre]

C'est pendant cette phase que vous saisirez l'essentiel des aliments. Pour la prolonger, ajoutez régulièrement de **petites bûches de bois sec** (refendu fin) ou laissez le foyer puiser dans son lit de braises selon votre besoin.

### Phase 4 — La décroissance (2 h et au-delà)

Le foyer commence à perdre de l'intensité, la cendre blanchit, les braises se font moins denses. Deux choix :

- **Recharger** avec 2-3 bûches pour repartir sur une phase 3 prolongée (le service continue)
- **Laisser descendre** pour finir les cuissons douces à basse température, puis profiter du foyer rougeoyant comme **chauffage d'ambiance** une fois le repas terminé

## Reconnaître l'état des braises (4 indicateurs visuels)

Pas besoin de thermomètre. Quatre indicateurs objectifs vous disent où en est votre foyer en un coup d'œil.

### 1. La couleur

- **Rouge orangé vif** avec flammes dansantes : phase d'allumage, trop chaud et trop irrégulier pour cuisiner — la chaleur est instable.
- **Rouge profond** sans flamme, braises bien formées : phase optimale, c'est le moment idéal pour saisir.
- **Rouge sombre recouvert de cendre blanche** : braises matures, **chaleur la plus stable** de tout le service. C'est l'état recherché.
- **Cendre grise dominante, rougeoiement résiduel** : phase de décroissance, à recharger ou à utiliser pour les finitions douces.

### 2. La densité du lit de braises

Un **lit dense** (épaisseur 5-8 cm de braises tassées) délivre une chaleur uniforme et soutenue. Un **lit clairsemé** (braises éparpillées avec des trous) crée des zones froides sous la plancha — la cuisson devient inégale et imprévisible.

### 3. Les bruits du foyer

- **Craquements secs et réguliers** : combustion saine, bois bien sec, chaleur stable.
- **Sifflements et fumée acide** : bois trop humide ou résineux — la chaleur est compromise et la fumée gâchera les aliments. Voir [le guide des bois pour brasero](/blog/meilleur-bois-brasero-comparatif).
- **Silence presque total avec rougeoiement** : phase de braises matures, exactement ce qu'on cherche pour la cuisson.

### 4. Le halo de chaleur visible

Penchez-vous au-dessus de la plancha à 30-40 cm de distance. Vous devez sentir une **chaleur qui pousse vers le haut**, et voir un léger tremblement de l'air au-dessus de la surface (l'air chauffé qui monte). Si vous ne sentez rien, le foyer est trop faible. Si la chaleur est insoutenable à 50 cm, le foyer est trop intense — laissez les braises se calmer 5 minutes.

## Le test de l'eau (effet Leidenfrost)

C'est le test **objectif** qui valide qu'une plancha est à bonne température pour cuisiner. Quelques gouttes d'eau froide jetées sur la plancha doivent **danser et glisser** sans s'évaporer, formant des perles sphériques qui rebondissent et se déplacent.

C'est l'**effet Leidenfrost** : à partir d'environ 200 °C, la goutte d'eau qui touche le métal se transforme instantanément en une fine couche de vapeur sous elle, qui isole la goutte du métal et la fait flotter. La goutte vit plusieurs secondes au lieu de s'évaporer en milliseconde.

**Interprétation** :

- **Les gouttes dansent et glissent** sur la plancha (≥ 200 °C) → vous pouvez cuisiner. C'est le bon moment.
- **Les gouttes grésillent et s'évaporent en 1-2 secondes** (~150-200 °C) → trop tiède pour saisir, mais bon pour les cuissons douces.
- **Les gouttes restent en flaque et bouillent lentement** (< 150 °C) → trop froid, attendez 10 minutes.

[atelier]
**Le geste de l'artisan**
On fait toujours le test de l'eau **avant la première saisie**, jamais après. Si vous le faites en milieu de service alors qu'il y a des graisses sur la plancha, les gouttes se mélangent à l'huile et donnent une lecture faussée. Le test n'est pertinent que sur surface propre, en début de service. Une fois validé, vous pouvez cuisiner sereinement pendant 60 à 90 minutes sans avoir à le refaire.
[/atelier]

## Les 3 zones thermiques de la plancha

Sur un brasero plancha, la plancha est une **couronne** d'acier qui s'enroule autour du foyer ouvert. Cette géométrie crée naturellement trois zones thermiques distinctes — c'est l'avantage majeur d'un brasero par rapport à une plancha plate à gaz.

| Zone | Position | Température | Usage |
|---|---|---|---|
| Zone chaude | Au plus près du foyer (centre) | 250-350 °C | Saisie haute température : steaks, gambas, magrets |
| Zone intermédiaire | Bande médiane | 150-200 °C | Cuisson douce : poissons, légumes, sauces qui mijotent |
| Zone tiède | Bord extérieur | 80-120 °C | Repos des viandes, maintien au chaud, cuisson lente |

Ces températures varient légèrement selon le diamètre du brasero ([50, 80 ou 100 cm](/blog/quel-brasero-choisir-nombre-convives)) et la quantité de bois engagée, mais la **logique des trois zones** reste universelle.

## La technique du déplacement

C'est probablement la technique la plus importante à acquérir, et celle qui distingue le cuisinier débutant du cuisinier averti.

Le principe : **la cuisson sur brasero plancha est dynamique**. On ne pose pas un aliment sur la plancha pour le laisser cuire jusqu'au bout au même endroit. On le **déplace** au cours de la cuisson, de la zone chaude vers la zone intermédiaire ou tiède, pour adapter la température à chaque étape.

**Exemple concret** : une entrecôte de 2 cm

1. **Pose au centre** (zone chaude) pendant 2 minutes côté A → croûte de Maillard nette
2. **Retournement, toujours au centre**, pendant 2 minutes côté B → croûte symétrique
3. **Déplacement vers la zone intermédiaire** pendant 1-2 minutes pour finir la cuisson à cœur sans surcuire la croûte
4. **Repos sur la zone tiède** pendant 3-4 minutes pour que les jus se redistribuent dans la viande

Quatre étapes, trois zones, une viande parfaite. C'est ce qu'aucune plancha à température fixe ne peut offrir.

[atelier]
**Le geste de l'artisan**
Sur un service à 6 personnes, on commence par poser **les légumes en zone intermédiaire** pendant que les braises finissent de mûrir (cuisson lente de 8-10 minutes). Quand la zone chaude est prête, on saisit les viandes au centre, et on déplace les viandes saisies vers la zone tiède pendant qu'on saisit la suite. Tout cuit en parallèle, rien n'attend, rien ne refroidit. C'est ce que fait un cuisinier professionnel qui a 5 plats à envoyer en même temps. Sur brasero, ce ballet devient naturel après 4-5 services.
[/atelier]

## Comment piloter activement la température

Vous avez trois leviers pour ajuster la chaleur en cours de service.

### Pour monter en température

- **Ajouter une bûche** (refendue fin) au centre du foyer, sous la zone chaude
- **Rapprocher les braises** existantes vers le centre avec un tisonnier
- **Attendre 5 minutes** que la plancha absorbe la chaleur avant de cuisiner

### Pour baisser la température

- **Écarter les braises** du centre vers les bords du foyer
- **Cuisiner sur la zone intermédiaire** ou tiède plutôt qu'au centre
- **Ne pas couvrir le foyer** (l'air doit circuler — un foyer étouffé fume au lieu de chauffer proprement)

### Pour maintenir la température

- **Ajouter régulièrement de petites bûches** ou du bois refendu fin (toutes les 20-30 minutes)
- **Garder un lit de braises constant** sous la plancha, sans laisser apparaître le fond du foyer
- **Utiliser du bois dense** (chêne, charme) pour des braises longue durée

## Tableau de cuisson par aliment

Temps indicatifs sur une plancha à bonne température (test de l'eau validé). À ajuster selon l'épaisseur et la cuisson souhaitée.

| Aliment | Zone | Temps face A | Temps face B | Note |
|---|---|---|---|---|
| Entrecôte 2 cm (saignant) | Chaude | 2 min | 2 min | Repos 3 min en zone tiède |
| Entrecôte 2 cm (à point) | Chaude → Intermédiaire | 2 min | 2 min + 2 min | Finir en zone intermédiaire |
| Magret de canard | Chaude (peau) → Intermédiaire | 5-6 min | 2-3 min | Côté peau d'abord, à froid |
| Côte d'agneau | Chaude | 3 min | 3 min | Repos 2 min |
| Filet de poulet | Intermédiaire | 5-6 min | 5-6 min | Cuisson plus douce |
| Saint-Jacques | Chaude | 1 min | 1 min | Caramélisation rapide |
| Gambas entières | Chaude | 1-2 min | 1-2 min | Surveiller la couleur |
| Filet de saumon | Intermédiaire (peau) | 4 min | 1-2 min | Côté peau d'abord |
| Dorade entière | Intermédiaire | 4-5 min | 4-5 min | Selon poids |
| Légumes émincés | Intermédiaire | 3-5 min | en remuant | Courgettes, oignons, poivrons |
| Asperges vertes | Chaude | 2 min | 2 min | À huile et sel uniquement |
| Œufs au plat | Intermédiaire | 3-4 min | — | Sur plancha culottée |
| Halloumi tranché | Chaude | 2 min | 2 min | Croûte dorée |

Pour les recettes détaillées par catégorie, voir : [recettes viandes rouges au brasero plancha](/blog/recettes-viandes-rouges-brasero-plancha) et [cuissons délicates : poissons et légumes](/blog/legumes-poissons-brasero-plancha-cuissons-delicates).

## Les 5 erreurs classiques (et comment les éviter)

**1. Toucher trop souvent les aliments.**
La saisie demande un **contact prolongé**. Quand vous posez un aliment sur la plancha, **laissez-le tranquille** pendant le temps prescrit. Ne le bougez pas, ne le retournez pas avant que la croûte se soit formée. Quand la saisie est complète, l'aliment se **détache naturellement** du métal. S'il colle, c'est qu'il n'est pas prêt — patience.

**2. Cuisiner avant la phase optimale.**
Cuire en phase 1 (allumage) ou en début de phase 2 (braises non stabilisées) garantit un résultat médiocre : croûte irrégulière, intérieur cru, fumée parasite. **Faites le test de l'eau** avant la première saisie, sans exception.

**3. Saturer la plancha.**
Poser trop d'aliments en même temps **fait chuter la température** localement (le métal absorbe l'énergie pour chauffer la nouvelle masse au lieu de saisir). Résultat : les aliments **bouillent dans leur propre jus** au lieu de saisir. Cuisinez en plusieurs passes si nécessaire — la zone tiède garde au chaud les premières fournées pendant que vous saisissez les suivantes.

**4. Ouvrir/déranger le foyer pendant la cuisson.**
Si vous attisez les braises pour faire des étincelles, vous **déstabilisez la chaleur** sous la plancha. Le foyer doit être préparé en **phase 2** et laissé tranquille pendant la **phase 3**. Si vous ajoutez du bois, faites-le **discrètement** par un côté, sans remuer ce qui est déjà en place.

**5. Cuisiner sur des cendres "froides".**
Une fine couche de cendre **blanche** sur les braises, c'est sain — c'est le signe d'une combustion stabilisée. Mais une **épaisse couche de cendre grise** qui recouvre tout, c'est la fin du foyer : les braises sont mortes en dessous. Soit vous rechargez en bois, soit vous terminez le service en zone tiède uniquement.

## Comment relancer un brasero qui faiblit en milieu de service

Vous êtes au milieu d'un repas, la plancha commence à descendre en température, et il vous reste encore deux services à envoyer. Que faire ?

**Signaux que le foyer faiblit** :
- Le test de l'eau ne réagit plus comme au début (gouttes qui s'évaporent au lieu de glisser)
- Les aliments **collent** alors qu'ils décollaient en début de service
- La plancha **ne fume plus** quand vous y déposez un aliment gras

**3 manières de relancer**

- **Recharge active** : ajoutez 2-3 bûches refendues fin **dans une zone latérale du foyer** (pas au centre, pour ne pas étouffer le lit de braises existant). Attendez 8-10 minutes que les nouvelles bûches deviennent braises. Le service repart pour 30-45 minutes.
- **Concentration** : avec un tisonnier, **ramenez toutes les braises existantes au centre** sous la plancha. Vous obtenez une zone chaude relancée pendant 15-20 minutes, parfait pour finir un service en cours sans recharger.
- **Bascule en cuisson douce** : si vous n'avez plus que de la cuisson lente à faire (légumes, poissons délicats, repos de viandes déjà saisies), laissez le foyer descendre et exploitez la **zone intermédiaire** comme zone principale. La fin de service se fait à 150-200 °C plutôt qu'à 280 °C, et c'est très bien comme ça.

## Pour aller plus loin

Après quelques sessions, vous identifierez instinctivement la bonne zone, le bon moment d'ajouter du bois, et la bonne phase pour déplacer les aliments. C'est cette **maîtrise dynamique** qui fait la différence entre un repas correct et un repas réussi — et c'est aussi ce qui rend la cuisson au brasero plancha si différente, et si satisfaisante, par rapport à un appareil de cuisson conventionnel.

---

## Pour aller plus loin

- [Quel bois pour votre brasero : les 5 meilleures essences](/blog/meilleur-bois-brasero-comparatif) — le combustible qui détermine la qualité des braises
- [Premier feu : le rituel d'allumage et de rodage de votre brasero](/blog/premier-feu-rodage-brasero) — la méthode complète d'allumage, étape par étape
- [Recettes de viandes rouges au brasero plancha](/blog/recettes-viandes-rouges-brasero-plancha) — application des techniques de température sur les viandes
- [Légumes et poissons au brasero plancha : les cuissons délicates](/blog/legumes-poissons-brasero-plancha-cuissons-delicates) — les zones thermiques appliquées aux cuissons fines`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Maîtriser la température sur un brasero plancha : zones thermiques et pilotage des braises",
    meta_title: "Température cuisson brasero plancha : guide complet (2026)",
    meta_description: "Comment contrôler la température sur un brasero plancha sans thermostat : reconnaître les braises, exploiter les 3 zones thermiques, déplacer les aliments, relancer un foyer. Tableaux de cuisson, erreurs à éviter.",
    excerpt: "Sur un brasero plancha, il n'y a pas de bouton de réglage. La chaleur se pilote avec du bois et avec la place sur la surface. Voici la méthode pour cuisiner avec précision sans thermomètre, exploiter les zones thermiques et maîtriser le déplacement des aliments.",
    content,
    read_time: 8,
    tags: ['cuisson', 'température', 'braises', 'technique', 'plancha', 'zones thermiques', 'pilotage'],
    related_articles: [
      'meilleur-bois-brasero-comparatif',
      'premier-feu-rodage-brasero',
      'recettes-viandes-rouges-brasero-plancha',
      'legumes-poissons-brasero-plancha-cuissons-delicates',
    ],
    related_products: ['brasero-acier-100-l-obelix', 'brasero-en-acier-80-lemorris', 'brasero-coffy-80'],
    cta_product_slug: 'brasero-acier-100-l-obelix',
    cta_text: 'Voir nos braseros plancha',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'temperature-cuisson-brasero-plancha');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ temperature-cuisson-brasero-plancha réécrit`);
console.log(`  Mots: ~${wordCount}`);
