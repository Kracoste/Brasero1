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

const content = `L'hiver approche. Vous regardez votre brasero — encore tiède du dernier service d'octobre — et la question revient : est-ce qu'on le rentre ? Est-ce qu'on le bâche ? Est-ce qu'on le laisse tel quel et on verra au printemps ? La réponse honnête tient en une phrase : **un brasero artisanal en acier épais ne craint pas l'hiver. Il craint l'oubli.** Quelques gestes simples, faits une fois en novembre, suffisent à le retrouver intact aux premiers beaux jours, prêt à reprendre du service comme si la saison froide n'avait pas eu lieu.

> **Vous cherchez plutôt à *utiliser* votre brasero en hiver, pas à le ranger ?** → [Lire : Utiliser son brasero en hiver — cuisiner et chauffer la terrasse](/blog/brasero-hiver-cuisiner-chauffer-dehors)

> Le brasero ne craint pas l'hiver. Il craint l'oubli.

Cet article est le **protocole complet d'hivernage** : pourquoi un brasero peut rester dehors, quand commencer, les 4 étapes essentielles, l'hivernage minimal pour ceux qui n'ont que 10 minutes, et la remise en route au printemps. Une fois fait correctement, vous pouvez oublier votre brasero pendant 4 mois sans inquiétude.

---

## Est-ce qu'un brasero peut rester dehors en hiver ?

**Oui** — c'est même pour ça qu'il a été conçu. Nos braseros sont fabriqués en acier de **3 mm d'épaisseur** pour le socle, en finition [corten autopatinable](/blog/brasero-corten-avantages-inconvenients) ou en acier peint thermolaqué haute température. Les deux matériaux sont conçus pour vivre dehors **365 jours par an**. Aucun fabricant artisanal sérieux ne vendrait un brasero qu'il faut rentrer en hiver — ce serait avouer une faiblesse de matière.

Cela dit, l'hiver cumule des agressions qui n'existent pas en saison chaude :

- **Pluie prolongée** : pas la pluie d'orage de juin qui sèche en deux heures, mais la pluie battante de novembre qui dure trois jours sans interruption
- **Gel et cycles thermiques** : les variations de température entre jour et nuit (parfois 15 °C d'amplitude) font dilater puis contracter le métal
- **Neige et glace** : poids ponctuel sur la plancha, infiltration possible dans les zones non drainantes
- **Humidité constante** : le brasero ne sèche jamais entre deux pluies, ce qui est précisément ce qu'il faut éviter pour les surfaces non protégées
- **Cendres anciennes** : si vous laissez les cendres dans le foyer, elles deviennent une éponge à humidité

Un brasero **bien hiverné** traverse tout ça sans broncher. Un brasero **abandonné brut** finira la saison avec des micro-traces de rouille sur les zones les plus exposées (soudures, angles, plancha en acier carbone non huilée). Rien d'irréversible, mais des retouches inutiles au printemps.

## Quand commencer l'hivernage ?

Il n'y a pas de **date fixe** — un brasero hiverné le 15 octobre est aussi bien que hiverné le 30 novembre. Ce qui compte, c'est de le faire **avant que les conditions hivernales s'installent durablement**.

Trois signaux indiquent qu'il est temps de basculer :

- Vous **utilisez votre brasero moins de deux fois par mois** depuis quelques semaines
- Les **premières gelées sont annoncées** dans votre région (consultez Météo France pour votre département)
- Vous prévoyez de **ne pas allumer pendant au moins 6 semaines** d'affilée

Si vous **utilisez encore activement** votre brasero en hiver (cuisson, chauffage extérieur, soirées feu de bois), vous n'êtes pas dans la bonne logique : l'hivernage est pour les utilisateurs qui mettent leur brasero **en pause**. Pour les utilisateurs actifs en hiver, c'est l'autre article qu'il faut lire.

[chiffre]30 min / 4 étapes|c'est tout ce qu'il faut pour hiverner correctement un brasero[/chiffre]

## Étape 1 — Le nettoyage de fin de saison

Avant de bâcher, on nettoie. C'est l'étape **la plus négligée** et celle qui cause le plus de problèmes au printemps. Trois gestes successifs :

- **Videz intégralement les cendres du foyer.** Toutes. Les cendres sont **hygroscopiques** : elles absorbent l'humidité de l'air et la retiennent au contact de l'acier du bol. Un foyer plein de cendres en novembre, c'est un foyer humide en permanence pendant 4 mois — exactement le scénario qui crée des points de corrosion à long terme. Les cendres se mettent dans un sac, vont au compost ou à la poubelle.
- **Raclez la plancha à la spatule métallique** pour retirer tous les résidus de cuisson. Pas besoin d'aller jusqu'au métal nu — on retire juste les amas, les morceaux carbonisés, les graisses figées.
- **Essuyez la plancha avec un chiffon en papier**, sans produit. Le but est juste de retirer la couche de salissures meubles avant de passer à la protection.

Côté **socle**, un coup de chiffon humide pour enlever poussière, toiles d'araignée, salissures de la dernière cuisson. Pas de produit chimique, pas de détergent — l'eau claire suffit largement, et c'est tout ce que l'acier doit voir avant l'hiver.

## Étape 2 — Protéger la plancha selon son matériau

C'est l'étape **la plus importante**. La plancha est la pièce **la plus sensible** à l'hivernage parce qu'elle est plate, exposée, et qu'elle accumule l'eau qui ne s'évacue pas.

### Plancha en acier carbone

L'acier carbone **rouille** s'il reste exposé à l'humidité sans protection. C'est inévitable, ça fait partie du matériau. Le geste à faire :

- **Appliquez une couche généreuse d'huile** sur toute la surface, à chaud (la plancha doit être tiède, pas froide). Utilisez de l'**huile de tournesol, de colza ou de pépin de raisin** — toutes les huiles végétales neutres conviennent.
- **Étalez l'huile au chiffon** pour qu'elle pénètre dans les micro-pores du culottage et forme une barrière hydrophobe.
- **Idéalement, démontez la plancha** (sur les modèles où c'est possible) et **rangez-la à l'abri** : garage, cellier, abri de jardin. C'est la solution la plus sûre.
- **Si la plancha ne se démonte pas** ou si vous n'avez pas d'abri, **renouvelez la couche d'huile mi-hiver** (en janvier par exemple) pour reconstituer la barrière.

Pour la procédure complète d'entretien d'une plancha acier carbone, voir [le guide pas à pas du culottage](/blog/comment-culotter-plancha-acier-carbone).

### Plancha en inox

L'inox **ne rouille pas**, donc le protocole est radicalement plus simple :

- **Nettoyage standard** après la dernière cuisson (eau froide sur surface tiède, spatule, chiffon)
- **Pas d'huile nécessaire**
- **Une housse est recommandée** uniquement pour éviter les **dépôts de feuilles**, fientes d'oiseaux et saletés hivernales qui peuvent tacher temporairement la surface

Pour le détail de l'entretien inox, voir [l'entretien d'une plancha inox : la méthode complète](/blog/entretien-plancha-inox-brasero).

[atelier]
**Le geste de l'artisan**
L'huile qu'on recommande pour l'hivernage de la plancha acier carbone, c'est **n'importe quelle huile végétale neutre du supermarché** — colza, tournesol, pépin de raisin. Pas d'huile d'olive (elle rancit en quelques semaines et laisse une odeur). Pas d'huile minérale (graisseuse, non comestible, à proscrire pour une plancha qui sert à cuisiner). On applique au chiffon en papier sur plancha tiède, on étale jusqu'à ce que la surface soit visiblement luisante mais pas dégoulinante. C'est tout. Trois minutes de geste qui sauvent une plancha pendant quatre mois.
[/atelier]

## Étape 3 — Protéger le socle selon son matériau

### Socle en acier corten

Le corten est **fait pour l'hiver**. Aucune protection nécessaire. Mieux : l'hiver renforce la patine. Les cycles humide-sec, le gel, la neige sont exactement les conditions qui permettent à la patine corten d'atteindre sa densité et son aspect définitifs. Au printemps, votre brasero corten sera **plus beau qu'en automne** — la teinte se sera assombrie, les irrégularités se seront harmonisées.

Aucune housse sur le socle corten, surtout pas. Une housse étanche **bloquerait** la patine et créerait des conditions stagnantes paradoxalement plus défavorables que la pluie directe.

### Socle en acier peint thermolaqué

La peinture thermolaquée résiste très bien aux intempéries — c'est pour ça qu'elle est utilisée dans l'industrie automobile et le mobilier d'extérieur haut de gamme. Mais une **exposition prolongée à l'humidité hivernale** peut provoquer des **micro-éclats** sur les zones de stress mécanique : soudures, angles, points de fixation.

Pour préserver l'aspect au mieux :

- **Une housse de protection est fortement recommandée**, mais **respirante** (voir étape 4).
- **Inspectez les angles et les soudures** avant l'hiver : si vous voyez déjà des micro-éclats, **traitez-les préventivement** avec un peu d'antirouille suivi d'une retouche au pinceau de peinture haute température (vendue en bombe en quincaillerie, ~10 €).
- **En sortie d'hiver**, si quelques points de rouille superficielle apparaissent : ponçage léger au papier de verre fin (grain 120), antirouille, retouche peinture. 15 minutes de SAV pour repartir à neuf.

## Étape 4 — Choisir et poser la housse

Toutes les housses ne se valent pas. Une mauvaise housse fait **plus de dégâts** qu'une absence de housse — elle crée un microclimat humide stagnant qui accélère la corrosion. Quatre critères absolus :

- **Imperméable** sur le dessus pour bloquer la pluie et la neige. Mais surtout pas étanche partout.
- **Respirante** dans les pans latéraux. C'est **non négociable**. Une housse 100 % étanche transforme votre brasero en cocotte-minute à humidité, avec condensation interne, et toutes les surfaces métalliques mouillées 24 h/24. C'est **pire** que pas de housse du tout.
- **Ajustée à la taille du brasero**, pas une bâche flottante de 3 mètres. Une housse trop grande s'envole au vent, frotte sur l'acier (rayures sur peinture), et accumule l'eau dans les plis.
- **Résistante aux UV** pour ne pas se déliter au soleil d'hiver (oui, même en décembre les UV abîment les plastiques bas de gamme).

**Fixation** : sangles élastiques, cordons, ou clip de fixation aux pieds du brasero. L'hiver est venteux, et une housse qui s'envole en pleine tempête expose le brasero exactement aux conditions qu'on cherchait à éviter.

## Tableau récapitulatif par configuration

| Configuration | Plancha (étape 2) | Socle (étape 3) | Housse |
|---|---|---|---|
| Corten + acier carbone | Huile généreuse + abri si possible | Aucune protection | Recommandée respirante (plancha) |
| Corten + inox | Nettoyage standard | Aucune protection | Optionnelle (esthétique) |
| Peint + acier carbone | Huile généreuse + abri si possible | Inspection + retouches préventives | Obligatoire respirante |
| Peint + inox | Nettoyage standard | Inspection + retouches préventives | Recommandée respirante |

## L'hivernage minimal (10 minutes)

Si vous n'avez vraiment pas le temps de faire le protocole complet, voici les **deux gestes** qui évitent 90 % des problèmes :

- **Videz les cendres** du foyer (3 minutes)
- **Huilez la plancha en acier carbone** si c'est votre matériau (5 minutes)
- **Couvrez d'une housse ou d'une bâche respirante** (2 minutes)

Ce sont les trois gestes minimum qui font la différence entre un brasero impeccable au printemps et un brasero qui demande des retouches. Tout le reste — nettoyage parfait, traitement préventif des angles peints, démontage de la plancha — relève de la finesse, pas de la nécessité absolue.

[atelier]
**Le geste de l'artisan**
L'erreur SAV la plus fréquente qu'on voit en mars-avril, c'est la plancha acier carbone qu'on a oublié d'huiler en novembre. Résultat : une couche de rouille de surface sur toute la plancha. La bonne nouvelle : c'est **récupérable** dans 95 % des cas — un ponçage à la paille de fer, un nettoyage à l'eau chaude, un re-culottage rapide à l'huile, et la plancha repart pour 20 ans. La mauvaise : ces 30 minutes de récupération auraient pu être 5 minutes d'huilage en novembre. C'est l'erreur la plus rentable à corriger.
[/atelier]

## La remise en route au printemps

Le premier beau jour de mars ou avril, le rituel est inversé :

- **Retirez la housse** et inspectez visuellement le brasero — recherchez les éventuelles traces, points de rouille, dépôts.
- **Vérifiez l'état de la plancha** : si acier carbone, la couche d'huile a peut-être un peu épaissi/figé — c'est normal, ça se nettoie au premier feu.
- **Inspectez le socle** (peint surtout) : les éventuels micro-éclats se traitent maintenant par retouche peinture.
- **Allumez un petit feu** pour sécher l'ensemble et réveiller le métal après 4 mois de pause. Ce n'est pas un repas, juste un feu d'1 heure.
- **Si plancha acier carbone** : un [culottage rapide de remise en route](/blog/comment-culotter-plancha-acier-carbone) (une passe d'huile + cuisson d'oignons à feu vif) remet la surface en état antiadhérent en 10 minutes.

Pour le **premier feu** complet de la saison, en particulier si c'est un nouveau brasero, voir le [guide du premier feu et du rodage](/blog/premier-feu-rodage-brasero).

## Idées reçues sur l'hivernage

**"Il faut absolument rentrer le brasero dans le garage."**
Faux. Sauf si vous habitez en zone de gel extrême (montagne au-dessus de 1500 m) ou si vous voulez être au-delà du précautionneux, **un brasero artisanal n'a aucun besoin d'être rentré**. Il est conçu pour rester dehors. Le rentrer dans un garage non chauffé peut même être contre-productif : air confiné, condensation possible, manipulation à risque (67-155 kg).

**"Une bâche plastique 100 % étanche, c'est mieux que rien."**
Vrai sur 24 h, faux sur 4 mois. Une bâche étanche **piège l'humidité** sous la housse et crée un microclimat condensant. C'est pire que pas de housse du tout sur la durée. Une **housse respirante** (textile technique imperméable + ouvertures latérales) est indispensable.

**"Le corten doit aussi être bâché en hiver."**
Faux à 100 %. Le corten est l'inverse — il a besoin de l'exposition aux intempéries pour développer sa patine. Bâcher un corten, c'est bloquer son fonctionnement chimique et créer des zones de patine inégales. **Le corten ne se bâche jamais.**

**"On peut hiverner avec de l'huile alimentaire d'olive ou autre."**
Vrai mais avec nuances. **Huile d'olive** : à éviter, elle rancit et laisse une odeur désagréable. **Huile de palme/coco** : à éviter, elle se solidifie à basse température et fait une couche cassante. **Huile de tournesol, colza, pépin de raisin** : parfait. **Huile minérale industrielle** : à proscrire absolument sur une plancha qui sert ensuite à cuisiner.

**"Si je n'utilise pas mon brasero en hiver, autant le couvrir totalement même en plein été."**
Faux. Une housse en permanence accélère la rouille (humidité confinée), abîme la peinture (frottement, UV concentrés), et empêche le corten de patiner correctement. **La housse ne se met que pour les périodes de non-usage prolongé** — typiquement de novembre à mars. Le reste du temps, le brasero vit dehors à l'air libre, c'est ce qui le préserve.

---

## Pour aller plus loin

- [Utiliser son brasero en hiver : cuisiner et chauffer la terrasse au cœur du froid](/blog/brasero-hiver-cuisiner-chauffer-dehors) — l'autre approche, pour les utilisateurs actifs toute l'année
- [Comment culotter une plancha en acier carbone : guide pas à pas](/blog/comment-culotter-plancha-acier-carbone) — le détail complet de l'entretien acier carbone
- [Entretien d'une plancha inox : la méthode complète](/blog/entretien-plancha-inox-brasero) — pour les propriétaires de plancha inox
- [Premier feu : le rituel d'allumage et de rodage de votre brasero](/blog/premier-feu-rodage-brasero) — pour la remise en route ou un brasero neuf au printemps`;

const wordCount = content.split(/\s+/).length;

const { error } = await supabase
  .from('blog_posts')
  .update({
    title: "Hivernage du brasero : comment le ranger et le protéger pendant l'hiver",
    meta_title: "Hivernage brasero : ranger et protéger en 4 étapes (guide 2026)",
    meta_description: "Comment hiverner votre brasero pour qu'il traverse l'hiver intact : nettoyage de fin de saison, protection de la plancha selon le matériau, housse adaptée, remise en route au printemps. Protocole complet en 4 étapes.",
    excerpt: "L'hiver approche. Votre brasero peut rester dehors toute la saison froide à condition de respecter quelques gestes simples. Voici le protocole d'hivernage en 4 étapes : nettoyage, protection de la plancha, du socle, et choix de la housse.",
    content,
    read_time: 7,
    tags: ['hiver', 'hivernage', 'entretien', 'protection', 'housse', 'rangement', 'préservation'],
    related_articles: [
      'brasero-hiver-cuisiner-chauffer-dehors',
      'comment-culotter-plancha-acier-carbone',
      'entretien-plancha-inox-brasero',
      'premier-feu-rodage-brasero',
    ],
    related_products: ['brasero-acier-100-l-obelix', 'brasero-en-acier-80-lemorris'],
    cta_product_slug: 'brasero-acier-100-l-obelix',
    cta_text: 'Voir nos braseros',
    updated_at: new Date().toISOString(),
  })
  .eq('slug', 'preparer-brasero-hiver-hivernage');

if (error) { console.error(error); process.exit(1); }
console.log(`✓ preparer-brasero-hiver-hivernage réécrit`);
console.log(`  Mots: ~${wordCount}`);
