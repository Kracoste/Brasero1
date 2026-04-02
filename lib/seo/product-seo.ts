/**
 * SEO dynamique par produit — descriptions longues, FAQ, meta tags
 * Chaque modèle (L'Obélix, Le Coffy, Le Morris, Le Fermier) a son propre contenu SEO.
 * Anti-cannibalisme : chaque fiche cible des mots-clés distincts par modèle ET par taille.
 */

import type { Product } from "@/lib/schema";

// ── Types ──────────────────────────────────────────────────────────────────

type ProductSEO = {
  description: string;
  faq: Array<{ question: string; answer: string }>;
  keywords: string[];
};

// ── Détection du modèle ────────────────────────────────────────────────────

type ModelKey = "obelix" | "coffy" | "morris" | "fermier" | "generic";

function detectModel(product: Product): ModelKey {
  const slug = product.slug.toLowerCase();
  const name = product.name.toLowerCase();
  const shortName = ((product.specs as Record<string, unknown>)?.shortName as string || "").toLowerCase();

  if (slug.includes("obelix") || name.includes("obélix") || name.includes("obelix") || shortName.includes("obélix")) return "obelix";
  if (slug.includes("coffy") || name.includes("coffy") || shortName.includes("coffy")) return "coffy";
  if (slug.includes("morris") || name.includes("morris") || shortName.includes("morris")) return "morris";
  if (slug.includes("fermier") || name.includes("fermier") || shortName.includes("fermier")) return "fermier";
  return "generic";
}

function detectPlanchaType(product: Product): string {
  const specs = product.specs as Record<string, unknown> | undefined;
  const mat = (specs?.planchaMaterial as string | undefined)?.toLowerCase() || "";
  if (mat === "acier" || mat.includes("carbone")) return "acier carbone";
  if (mat === "inox") return "inox";
  return "acier carbone";
}

// ── Descriptions SEO par modèle ────────────────────────────────────────────

function descObelix(product: Product): string {
  const diameter = product.diameter ?? 80;
  const price = product.price;
  const plancha = detectPlanchaType(product);
  const weight = product.weight ?? (diameter >= 100 ? 115 : diameter >= 80 ? 84 : 62);
  const guests = diameter >= 100 ? "10 à 12" : diameter >= 80 ? "6 à 8" : "2 à 4";

  return `L'Obélix ${diameter}cm est le brasero plancha Atelier LBF conçu pour allier compacité et performance de cuisson. Son architecture unique — socle carré de 55 × 55 cm surmonté d'un bol de 100 cm — lui confère une stabilité exemplaire tout en libérant la vue sur le feu. La plancha en ${plancha} de ${diameter} cm et 8 mm d'épaisseur assure une montée en température rapide et une répartition homogène de la chaleur sur toute la surface.

Contrairement aux braseros sur socle tubulaire, L'Obélix s'appuie sur quatre pieds en tube carré soudés à plat, qui résistent aux chocs et au poids des aliments les plus lourds. Avec ses ${weight} kg d'acier, il ne bougera pas d'un centimètre même par grand vent. Son range-bûches intégré au socle maintient votre bois de qualité à portée de main, sec et prêt à alimenter le feu.

Format idéal pour ${guests} personnes, L'Obélix ${diameter}cm est taillé pour les terrasses de ${diameter <= 50 ? "petite et moyenne taille — moins de 15 m²" : diameter <= 80 ? "taille moyenne — entre 15 et 40 m²" : "grande taille — à partir de 30 m²"}. À ${price} €, c'est l'entrée dans la gamme Atelier LBF la plus polyvalente : feu de bois le soir, plancha le week-end, sans jamais avoir à choisir.

Fabriqué à la main à Moncoutant dans les Deux-Sèvres. Livré monté, avec grille de cuisson incluse. Garantie 2 ans.`;
}

function descCoffy(product: Product): string {
  const diameter = product.diameter ?? 80;
  const price = product.price;
  const weight = product.weight ?? (diameter >= 100 ? 89 : diameter >= 80 ? 77 : 62);
  const guests = diameter >= 100 ? "10 à 12" : diameter >= 80 ? "6 à 8" : "2 à 4";

  return `Le Coffy ${diameter}cm est le brasero plancha minimaliste de l'Atelier LBF. Trois pieds en acier inclinés, un bol de 100 cm, une plancha en acier carbone de ${diameter} cm et 8 mm d'épaisseur : pas d'ornement superflu, que de la fonction. Ce design tripode n'est pas qu'une question d'esthétique — il libère totalement le dessous du brasero, ce qui facilite l'entretien, améliore la ventilation du feu et donne une impression de légèreté visuelle malgré les ${weight} kg que pèse l'engin.

La plancha acier carbone du Coffy est la même que celle utilisée dans les cuisines professionnelles : une fois culottée après quelques cuissons, elle développe une surface naturellement antiadhésive, sans revêtement chimique. Viandes saisies, légumes rôtis, poissons entiers — la cuisson plancha au feu de bois est d'une autre dimension que l'électrique ou le gaz.

Le Coffy ${diameter}cm convient pour ${guests} personnes. ${diameter <= 50 ? "Sa petite empreinte au sol en fait le compagnon idéal des balcons généreux, terrasses d'appartements et petits jardins de ville." : diameter <= 80 ? "C'est la taille idéale pour les repas en famille ou entre amis — assez grand pour cuisiner pour 8, assez compact pour une terrasse standard." : "Dans sa version 100 cm, Le Coffy devient la pièce centrale des grandes réceptions — 10 à 12 personnes peuvent manger simultanément."}

À ${price} €, Le Coffy ${diameter}cm est le rapport qualité/prix le plus serré de la gamme Atelier LBF. Fabriqué à la main à Moncoutant (79). Livré monté, grille incluse. Garantie 2 ans.`;
}

function descMorris(product: Product): string {
  const diameter = product.diameter ?? 100;
  const price = product.price;
  const weight = product.weight ?? 155;
  const plancha = detectPlanchaType(product);

  return `Le Morris ${diameter}cm est le brasero plancha haut de gamme de l'Atelier LBF. À ${price} €, il s'adresse aux amateurs exigeants qui refusent de choisir entre l'esthétique et la performance. Sa plancha ${plancha} de ${diameter === 80 ? "80" : "80"} cm, épaisseur 10 mm — soit 2 mm de plus que la plupart des braseros du marché — garantit une inertie thermique supérieure pour une cuisson parfaitement maîtrisée, même pour des pièces de viande épaisses.

Ce qui distingue Le Morris de tous les autres braseros Atelier LBF, c'est sa conception double-zone : la plancha ${plancha} pourtour entoure une grille centrale en ${plancha} de 25 cm, permettant la cuisson à la flamme directe et à la plancha simultanément. Deux modes de cuisson en même temps, pour deux aliments différents sur le même feu. Les amateurs de cuisine au brasero comprennent immédiatement la valeur de cette configuration.

Avec ses ${weight} kg, Le Morris ${diameter}cm est conçu pour rester dehors toute l'année. Son acier traité résiste aux intempéries, et la ${plancha === "inox" ? "plancha inox" : "plancha acier carbone"} ne rouille pas. ${plancha === "inox" ? "L'inox est la finition recommandée pour une utilisation intensive ou en zone côtière." : "L'acier carbone culotté est la référence des cuisiniers au brasero."}

Capacité 10 à 12 personnes. Fabriqué à la main dans les Deux-Sèvres. Livré monté. Garantie 2 ans.`;
}

function descFermier(product: Product): string {
  const diameter = product.diameter ?? 80;
  const price = product.price;
  const weight = product.weight ?? 93;

  return `Le Fermier est le brasero plancha en acier corten de l'Atelier LBF. Unique dans la gamme, sa finition corten ne nécessite aucun entretien : l'acier développe naturellement une patine de rouille protectrice orange-brun qui s'épaissit et se stabilise avec le temps pour former un bouclier contre la corrosion. Vous n'avez rien à faire — ni peinture, ni huile, ni housse obligatoire. Le Fermier vieillit bien.

Sa conception double-zone — plancha inox de ${diameter} cm entourant une grille centrale inox de 25 cm — offre les mêmes avantages que Le Morris en termes de polyvalence : flamme directe d'un côté, plancha douce de l'autre, simultanément. La plancha inox est idéale pour les familles qui veulent faciliter le nettoyage et éviter le culottage de l'acier carbone.

Le corten du socle contraste avec l'inox brillant de la plancha : Le Fermier est autant un objet décoratif qu'un outil de cuisson. Il s'intègre parfaitement dans les jardins avec des matériaux naturels (bois, pierre, terre cuite) et apporte une chaleur visuelle unique dès que la patine commence à prendre — généralement après la première pluie.

À ${price} €, Le Fermier est le seul brasero corten de la gamme Atelier LBF. Capacité 10 à 12 personnes. Poids : ${weight} kg. Dimensions : Ø${diameter} cm. Fabriqué à la main à Moncoutant (79). Livré monté. Garantie 2 ans.`;
}

function descGenericBrasero(product: Product): string {
  const diameter = product.diameter ?? 80;
  const price = product.price;
  const plancha = detectPlanchaType(product);

  return `${product.name} est un brasero plancha artisanal fabriqué à la main par l'Atelier LBF à Moncoutant dans les Deux-Sèvres. Découpe laser, formage et soudure réalisés en France par nos artisans — chaque brasero sort d'atelier contrôlé à la main avant expédition.

Sa plancha en ${plancha} de ${diameter} cm et 8 mm d'épaisseur offre une surface de cuisson homogène que les planchas à gaz ne peuvent pas égaler : la chaleur du feu de bois est irrégulière, vivante, et c'est précisément ce qui donne aux aliments ce goût fumé impossible à reproduire en cuisine.

À ${price} €, c'est un investissement dans un objet durable, fabriqué en France, qui peut se transmettre. Pas de pièces d'usure, pas d'électronique, pas de bouteille de gaz — juste de l'acier et du bois. Livré monté avec grille de cuisson. Garantie 2 ans.`;
}

// ── FAQ SEO par modèle ─────────────────────────────────────────────────────

function faqObelix(product: Product): Array<{ question: string; answer: string }> {
  const diameter = product.diameter ?? 80;
  const price = product.price;
  const guests = diameter >= 100 ? "10 à 12" : diameter >= 80 ? "6 à 8" : "2 à 4";
  const plancha = detectPlanchaType(product);

  return [
    {
      question: `Quelle est la différence entre L'Obélix ${diameter}cm et les autres tailles ?`,
      answer: `L'Obélix existe en 3 tailles : 50 cm (2 à 4 personnes, 850 €), 80 cm (6 à 8 personnes, 1 400 €) et 100 cm (10 à 12 personnes, 1 850 €). La taille ${diameter} cm est la version pour ${guests} personnes. Le socle carré reste identique sur toutes les tailles — c'est le diamètre du bol et de la plancha qui change. Choisissez selon la surface de votre terrasse et le nombre de convives habituels.`,
    },
    {
      question: `Pourquoi le socle de L'Obélix est-il carré et non rond ?`,
      answer: `Le socle carré de L'Obélix (55 × 55 cm) est un choix délibéré : il offre une assise plus stable que les pieds tubulaires ronds, surtout sur une terrasse en bois ou en pierre irrégulière. Le volume sous le socle sert de range-bûches intégré — pratique pour garder du bois sec à portée sans encombrer la terrasse. C'est ce que les utilisateurs apprécient en premier après réception.`,
    },
    {
      question: `La plancha de L'Obélix ${diameter}cm est-elle en acier carbone ou en inox ?`,
      answer: `La plancha de L'Obélix ${diameter}cm est en ${plancha} de ${diameter} cm de diamètre et 8 mm d'épaisseur. ${plancha === "acier carbone" ? "L'acier carbone se culotte progressivement après chaque cuisson pour former une surface naturellement antiadhésive — un vrai plus par rapport à l'inox sur les cuissons délicates. Il est recommandé de l'huiler légèrement après chaque utilisation pour accélérer le culottage." : "L'inox est l'option facile d'entretien : pas de culottage nécessaire, nettoyage rapide à l'eau chaude, résistance à la corrosion supérieure."}`,
    },
    {
      question: `Combien de personnes peut accueillir L'Obélix ${diameter}cm ?`,
      answer: `L'Obélix ${diameter}cm est conçu pour ${guests} personnes. En pratique, la surface de la plancha permet de cuire simultanément ${diameter >= 100 ? "plusieurs entrecôtes, une dizaine de brochettes ou un poisson entier de 2 kg" : diameter >= 80 ? "4 à 6 entrecôtes ou une dizaine de légumes en même temps" : "2 à 3 steaks ou 4 à 5 brochettes"}. Pour les grandes tablées, vous pouvez faire plusieurs tournées successives car l'inertie thermique de la plancha 8 mm maintient la température.`,
    },
    {
      question: `L'Obélix peut-il rester dehors toute l'année ?`,
      answer: `Oui, L'Obélix est construit pour résister aux intempéries françaises. La structure en acier traité tient aux pluies, gelées et variations de température. Cependant, nous recommandons une housse en hiver ou de retirer la plancha en acier carbone sous un abri — non pas pour protéger la structure, mais pour éviter que l'eau stagnante n'abîme le culottage de la plancha. Le socle et le bol sont conçus pour l'extérieur permanent.`,
    },
    {
      question: `L'Obélix ${diameter}cm est-il livré monté ?`,
      answer: `Oui, L'Obélix ${diameter}cm est livré entièrement assemblé, prêt à l'utilisation dès déballage. Plancha et grille de cuisson sont incluses. L'emballage est sur mesure : carton double cannelure renforcé et mousse haute densité pour absorber les chocs du transport. Nous livrons partout en France métropolitaine sous 5 à 10 jours ouvrés. Le prix de livraison est inclus dans le prix affiché de ${price} €.`,
    },
    {
      question: `L'Obélix ${diameter}cm est-il adapté à une terrasse en bois ?`,
      answer: `Oui, sous réserve de placer L'Obélix sur un support ignifugé (dalle en béton, carrelage ou plaque de protection thermique). Nous déconseillons de poser directement le brasero sur une terrasse en bois composite sans protection, car les chutes de braises sous le bol peuvent carboniser le bois. Une plaque en métal ou en ardoise de 80 × 80 cm sous le brasero est suffisante.`,
    },
    {
      question: `Quelle est la garantie de L'Obélix ${diameter}cm ?`,
      answer: `L'Obélix ${diameter}cm est garanti 2 ans contre tout défaut de fabrication. La garantie couvre la structure, les soudures et la plancha. Elle ne couvre pas l'usure normale du culottage, les rayures superficielles ou la rouille superficielle sur les parties non traitées en milieu marin. Notre SAV est joignable par téléphone et email depuis l'atelier de Moncoutant.`,
    },
  ];
}

function faqCoffy(product: Product): Array<{ question: string; answer: string }> {
  const diameter = product.diameter ?? 80;
  const price = product.price;
  const guests = diameter >= 100 ? "10 à 12" : diameter >= 80 ? "6 à 8" : "2 à 4";

  return [
    {
      question: `Quelle est la différence entre Le Coffy ${diameter}cm et L'Obélix ${diameter}cm ?`,
      answer: `Le Coffy et L'Obélix ont la même plancha acier carbone 8 mm et le même bol de 100 cm, mais leur socle diffère fondamentalement. L'Obélix a un socle carré avec range-bûches intégré — idéal pour stocker le bois. Le Coffy a un design tripode minimaliste sans rangement — il mise sur l'élégance visuelle et la facilité de nettoyage dessous. Le Coffy est environ 100 € moins cher à diamètre équivalent. Choisissez L'Obélix si vous voulez le range-bûches intégré, Le Coffy si vous privilégiez le design épuré.`,
    },
    {
      question: `Pourquoi Le Coffy a-t-il 3 pieds au lieu de 4 ?`,
      answer: `Le design tripode du Coffy est un choix d'ingénierie : trois points de contact garantissent la stabilité sur toutes les surfaces, même légèrement irrégulières, là où un socle à 4 pieds peut vaciller sur un pavé bombé. Les trois pieds en tube carré d'acier de forte épaisseur sont dimensionnés pour supporter les ${product.weight ?? 77} kg du brasero et la charge d'aliments sans déformation.`,
    },
    {
      question: `La plancha du Coffy ${diameter}cm est-elle antiadhésive ?`,
      answer: `La plancha acier carbone du Coffy n'a pas de revêtement antiadhésif chimique. Après 3 à 5 cuissons, elle se culotte naturellement — une fine couche de graisse carbonisée se dépose sur l'acier pour former une surface naturellement antiadhésive, plus saine et plus durable que le Téflon. Pour accélérer le culottage, huilez la plancha à chaud avec une huile neutre (tournesol, arachide) avant chaque cuisson les premières fois.`,
    },
    {
      question: `Le Coffy ${diameter}cm convient-il pour une terrasse de ${diameter <= 50 ? "balcon ou petit jardin" : "taille standard"} ?`,
      answer: `${diameter <= 50 ? `Le Coffy 50cm est le plus compact de la gamme Atelier LBF. Son emprise au sol est d'environ 80 × 80 cm (pieds inclus), ce qui en fait l'option idéale pour les terrasses à partir de 10 m² et les balcons spacieux. À 62 kg, il est le plus léger de la gamme — un déménagement reste envisageable à deux.` : diameter <= 80 ? `Le Coffy 80cm nécessite une zone dégagée d'environ 120 × 120 cm autour du brasero pour circuler en sécurité. Une terrasse de 15 m² minimum est recommandée. Ses 77 kg en font un objet stable mais difficile à déplacer seul.` : `Le Coffy 100cm est le format grand rassemblement — prévoir une zone dégagée de 150 × 150 cm minimum. Ses 89 kg en font un objet permanent dans votre jardin.`}`,
    },
    {
      question: `Comment nettoyer la plancha du Coffy ${diameter}cm ?`,
      answer: `Nettoyage à chaud (recommandé) : versez un filet d'eau sur la plancha encore chaude, raclez avec la spatule fournie pour détacher les résidus, puis essuyez avec du papier absorbant. Appliquez un filet d'huile pour protéger la surface jusqu'à la prochaine utilisation. Évitez l'eau froide sur plancha très chaude (choc thermique). En hiver, si vous rangez le brasero, appliquez une couche d'huile généreuse sur la plancha avant stockage.`,
    },
    {
      question: `Combien de personnes peut accueillir Le Coffy ${diameter}cm ?`,
      answer: `Le Coffy ${diameter}cm est dimensionné pour ${guests} personnes. La surface de cuisson plancha de ${diameter} cm de diamètre permet de cuire simultanément ${diameter >= 100 ? "une dizaine de pièces de viande ou un repas complet pour 12 personnes en 2 tournées" : diameter >= 80 ? "6 à 8 pièces de viande, des légumes et des poissons en même temps" : "2 à 3 pièces de viande ou 4 à 5 brochettes par tournée"}. Le feu de bois maintient une température stable sur la plancha grâce à l'inertie des 8 mm d'acier.`,
    },
    {
      question: `Le Coffy ${diameter}cm est-il livré assemblé ?`,
      answer: `Oui, Le Coffy ${diameter}cm arrive à domicile entièrement monté et prêt à l'emploi. Plancha acier carbone et grille de cuisson sont incluses. Emballage sur mesure carton double cannelure + mousse haute densité. Livraison partout en France métropolitaine sous 5 à 10 jours ouvrés. Le prix de ${price} € inclut la livraison.`,
    },
    {
      question: `Quelle est la durée de vie d'un Coffy ${diameter}cm ?`,
      answer: `Un brasero Atelier LBF bien entretenu dure 15 à 20 ans minimum. L'acier épais (bol en 3 mm, plancha en 8 mm) ne se déforme pas et ne se perce pas avec un usage normal. Les seuls points d'attention sont la plancha (huiler après chaque utilisation pour maintenir le culottage) et la finition peinte du socle (retoucher avec de la peinture haute température si une égratignure apparaît). La structure soudée est garantie 2 ans mais conçue pour durer bien au-delà.`,
    },
  ];
}

function faqMorris(product: Product): Array<{ question: string; answer: string }> {
  const diameter = product.diameter ?? 100;
  const price = product.price;
  const plancha = detectPlanchaType(product);
  const planchaLabel = plancha === "inox" ? "plancha inox" : "plancha acier carbone";

  return [
    {
      question: `Qu'est-ce qui justifie le prix du Morris ${diameter}cm par rapport aux autres braseros ?`,
      answer: `Le Morris ${diameter}cm est à ${price} € pour plusieurs raisons concrètes : plancha ${plancha} de 10 mm d'épaisseur (contre 8 mm sur les autres modèles), conception double-zone avec grille centrale inox pour cuisson à la flamme et plancha simultanément, finitions supérieures, poids de ${product.weight ?? 155} kg qui assure une inertie thermique incomparable. C'est le brasero qui se rapproche le plus d'un équipement de restauration professionnelle pour un jardin privé.`,
    },
    {
      question: `Comment fonctionne la double-zone de cuisson du Morris ${diameter}cm ?`,
      answer: `La zone plancha (${planchaLabel} de ${diameter === 80 ? 80 : diameter}cm en anneau extérieur) est chauffée par la réflexion de la chaleur du feu. La zone grille (25 cm de diamètre en position centrale) permet une cuisson directe à la flamme, idéale pour saisir à haute température. Concrètement : vous saisissez une entrecôte sur la grille 2 minutes, puis la terminez sur la plancha à feu doux. Ou vous grillez des légumes sur la plancha pendant que votre poisson est sur la grille. Deux aliments, deux textures, un seul brasero.`,
    },
    {
      question: `La plancha du Morris ${diameter}cm est-elle en inox ou en acier carbone ?`,
      answer: `La plancha du Morris est en ${plancha}. ${plancha === "inox" ? "L'inox présente plusieurs avantages sur l'acier carbone pour un usage intensif : résistance à la corrosion supérieure (idéal en région côtière ou pour les braseros stockés à l'extérieur en permanence), entretien simplifié (nettoyage à l'eau chaude sans culottage), et brillance conservée dans le temps. En contrepartie, l'inox diffuse la chaleur légèrement moins uniformément que l'acier carbone — ce qui est compensé par les 10 mm d'épaisseur du Morris." : "L'acier carbone 10 mm du Morris est la référence absolue pour la cuisson plancha : inertie thermique maximale, montée en température rapide, et une fois culottée, la surface est naturellement antiadhésive. C'est la même technologie que les planchas des grandes tables."}`,
    },
    {
      question: `Le Morris ${diameter}cm peut-il rester dehors toute l'année ?`,
      answer: `Oui, et c'est précisément sa vocation. Avec ${product.weight ?? 155} kg sur les pieds, Le Morris ne bouge pas. Son acier traité résiste aux intempéries. La ${planchaLabel} ${plancha === "inox" ? "ne rouille pas" : "doit être légèrement huilée si elle reste exposée plusieurs semaines sans utilisation, pour maintenir le culottage"}. Nous recommandons de le laisser sur sa surface définitive (dalle, pavés, béton) car une fois installé, vous n'aurez pas envie de le déplacer.`,
    },
    {
      question: `Quelle surface de terrasse faut-il pour Le Morris ${diameter}cm ?`,
      answer: `Le Morris ${diameter}cm occupe environ ${diameter} cm de diamètre + ses 4 pieds qui débordent légèrement. Prévoyez une zone dégagée d'au moins 150 × 150 cm autour du brasero pour circuler et servir en sécurité. Une terrasse de 20 m² minimum est recommandée. Le Morris est un investissement de jardin ou de terrasse, pas un objet de balcon.`,
    },
    {
      question: `Le Morris ${diameter}cm est-il livré monté ?`,
      answer: `Oui, Le Morris ${diameter}cm est livré entièrement assemblé. Vu son poids (${product.weight ?? 155} kg), la livraison se fait obligatoirement par transporteur spécialisé avec hayon. Prévenez-nous de toute contrainte d'accès à votre domicile (escaliers, passage étroit, code portail). La livraison est incluse dans le prix affiché.`,
    },
    {
      question: `Combien de personnes peut-on accueillir avec Le Morris ${diameter}cm ?`,
      answer: `Le Morris ${diameter}cm est le brasero des grandes tablées : 10 à 12 personnes peuvent manger simultanément. La surface combinée plancha + grille permet de cuire un repas complet pour 12 en une seule fournée : viandes sur la grille directe, légumes et poissons sur la plancha extérieure. C'est le brasero pensé pour les grandes soirées estivales et les repas de famille.`,
    },
    {
      question: `Quelle est la garantie du Morris ${diameter}cm ?`,
      answer: `Le Morris ${diameter}cm bénéficie d'une garantie fabricant de 2 ans couvrant tous les défauts de fabrication, de structure et de soudure. La plancha ${plancha} est garantie sans déformation ni fissure. Notre SAV de Moncoutant (Deux-Sèvres) est joignable directement pour toute demande — pas de centre d'appel externalisé.`,
    },
  ];
}

function faqFermier(product: Product): Array<{ question: string; answer: string }> {
  const diameter = product.diameter ?? 80;
  const price = product.price;

  return [
    {
      question: `L'acier corten du Fermier va-t-il rouiller ?`,
      answer: `L'acier corten (aussi appelé acier autopatinable) est conçu pour rouiller — mais de façon contrôlée. Cette rouille de surface forme une couche protectrice dense qui bloque la corrosion en profondeur, contrairement à l'acier ordinaire qui rouille jusqu'au cœur. La patine du Fermier évolue du rouge-orangé vif (premières semaines) vers un brun-bordeaux sombre et uniforme (après 6 à 12 mois). C'est un processus naturel, pas un défaut. Votre brasero sera plus solide à 10 ans qu'à la livraison.`,
    },
    {
      question: `En quoi Le Fermier est-il différent des autres braseros Atelier LBF ?`,
      answer: `Le Fermier est le seul brasero corten de la gamme Atelier LBF — c'est la principale différence. Les autres modèles (L'Obélix, Le Coffy) sont en acier peint. Le Fermier partage avec Le Morris sa conception double-zone (plancha inox entourant une grille centrale inox), ce qui en fait un choix privilégié pour les cuissons mixtes. À ${price} €, c'est aussi le seul modèle qui combine corten + inox dans la gamme.`,
    },
    {
      question: `Faut-il protéger Le Fermier en hiver ?`,
      answer: `Non, c'est l'un des grands avantages du corten : aucune protection hivernale n'est nécessaire sur la structure. La pluie, la neige et le gel accélèrent même la formation de la patine protectrice. En revanche, nous recommandons de retirer et stocker à l'abri la plancha inox en hiver prolongé pour éviter l'apparition de dépôts calcaires (eau de pluie). La structure en corten peut rester dehors 365 jours par an.`,
    },
    {
      question: `Comment fonctionne la plancha inox du Fermier ?`,
      answer: `La plancha inox du Fermier entoure une grille centrale en inox de 25 cm. La plancha monte en température par rayonnement du feu et offre une cuisson douce et homogène. L'inox ne se culotte pas (contrairement à l'acier carbone) — il s'entretient plus simplement : nettoyage à l'eau chaude et au tampon inox après chaque utilisation, sans obligation d'huiler la surface. C'est la plancha recommandée pour ceux qui veulent un entretien minimal.`,
    },
    {
      question: `La patine corten du Fermier va-t-elle tacher ma terrasse ?`,
      answer: `Oui, pendant les premières semaines d'exposition à la pluie, l'eau de ruissellement du corten contient des oxydes de fer qui peuvent laisser des traces orange sur les surfaces claires (dalle blanche, terrasse en bois clair). Nous recommandons d'appliquer un produit anti-rouille de surface sur votre terrasse avant installation, ou de placer une bâche de protection sous le brasero pendant les 4 à 6 premières semaines (période d'oxydation active). Après stabilisation de la patine, les coulures cessent.`,
    },
    {
      question: `Combien de personnes peut accueillir Le Fermier ?`,
      answer: `Le Fermier ${diameter}cm est conçu pour 10 à 12 personnes. Sa double-zone de cuisson (plancha inox extérieure + grille centrale) permet de cuire viandes, poissons et légumes simultanément pour toute la tablée. C'est le brasero corten idéal pour les grandes réunions de famille ou les repas entre amis dans un grand jardin.`,
    },
    {
      question: `Le Fermier est-il livré assemblé ?`,
      answer: `Oui, Le Fermier est livré entièrement monté et prêt à l'emploi. Plancha inox et grille inox sont incluses. Emballage renforcé pour protéger la patine en cours de formation. Livraison partout en France métropolitaine sous 5 à 10 jours ouvrés. Le prix de ${price} € inclut la livraison.`,
    },
    {
      question: `Quelle est la garantie du Fermier ?`,
      answer: `Le Fermier est garanti 2 ans par l'Atelier LBF contre tout défaut de fabrication. La formation de patine corten est un processus normal, non couvert par la garantie (elle est inhérente au matériau). La plancha inox et la grille inox sont couvertes contre tout défaut de matière. SAV joignable depuis Moncoutant (Deux-Sèvres).`,
    },
  ];
}

function faqGenericBrasero(product: Product): Array<{ question: string; answer: string }> {
  const diameter = product.diameter ?? 80;
  const plancha = detectPlanchaType(product);

  return [
    {
      question: `En quel matériau est fabriqué ${product.name} ?`,
      answer: `${product.name} est fabriqué en ${product.material} dans notre atelier de Moncoutant (Deux-Sèvres). La plancha est en ${plancha}. L'acier utilisé pour la structure est de haute qualité, découpé au laser et soudé à la main par nos artisans.`,
    },
    {
      question: `Combien de personnes peut accueillir ${product.name} ?`,
      answer: `${product.name} en ${diameter} cm est adapté pour ${diameter >= 100 ? "10 à 12" : diameter >= 80 ? "6 à 8" : "2 à 4"} personnes. La plancha de ${diameter} cm offre une surface de cuisson suffisante pour un repas complet en une ou deux tournées.`,
    },
    {
      question: `Quel bois utiliser avec ${product.name} ?`,
      answer: `Utilisez exclusivement du bois sec de feuillus (chêne, hêtre, charme, frêne) avec un taux d'humidité inférieur à 20%. Évitez les bois résineux (pin, sapin) qui produisent des flammes trop hautes, des étincelles et encrassent la plancha. Les bûches compressées (densifiées) sont également compatibles.`,
    },
    {
      question: `Quelle est la garantie de ${product.name} ?`,
      answer: `${product.name} est garanti 2 ans par l'Atelier LBF contre tout défaut de fabrication. Notre SAV est joignable directement depuis Moncoutant (Deux-Sèvres) par téléphone et email.`,
    },
    {
      question: `${product.name} est-il livré monté ?`,
      answer: `Oui, ${product.name} est livré entièrement assemblé et prêt à l'emploi. Plancha et grille de cuisson sont incluses. Livraison partout en France métropolitaine sous 5 à 10 jours ouvrés.`,
    },
  ];
}

// ── FAQ fendeur ────────────────────────────────────────────────────────────

function faqFendeur(product: Product): Array<{ question: string; answer: string }> {
  return [
    {
      question: `Comment utiliser le fendeur à bûches ${product.name} ?`,
      answer: `Posez le fendeur sur le sol, debout. Placez votre bûche à la verticale sur le coin acier. Frappez avec un maillet ou une massette sur la tête du fendeur — la bûche se fend net, sans effort et sans danger. Contrairement à une hache, vous n'avez pas de geste de balancier risqué : le fendeur travaille verticalement, les deux mains restent toujours en sécurité au-dessus du point de frappe.`,
    },
    {
      question: `Quelle épaisseur de bûche peut fendre ${product.name} ?`,
      answer: `Le ${product.name} est conçu pour des bûches de 20 à 40 cm de diamètre maximum. Pour les très grosses pièces (rondins de plus de 40 cm), nous recommandons de commencer par les bords avant d'attaquer le cœur. Les bûches sèches se fendent plus facilement que les bûches vertes — privilégiez un bois sec (moins de 20% d'humidité) pour un résultat optimal.`,
    },
    {
      question: `Le fendeur ${product.name} est-il plus sécurisé qu'une hache ?`,
      answer: `Oui, significativement. Avec une hache, la lame peut dévier en cas de nœud, et le geste de balancier expose les pieds et les jambes. Avec le fendeur ${product.name}, la bûche est posée au sol et le fendeur est guidé verticalement — les mains restent toujours en sécurité derrière le point de frappe. C'est l'outil recommandé pour les personnes qui n'ont pas l'habitude de manier une hache, notamment en présence d'enfants.`,
    },
    {
      question: `Le fendeur ${product.name} est-il fabriqué en France ?`,
      answer: `Oui, le ${product.name} est fabriqué artisanalement dans notre atelier de Moncoutant (Deux-Sèvres), en acier ${product.material}. Chaque fendeur est contrôlé avant expédition. Nous utilisons de l'acier français de première qualité pour garantir la résistance aux impacts répétés.`,
    },
    {
      question: `Quel maillet utiliser avec le fendeur ${product.name} ?`,
      answer: `Un maillet en caoutchouc de 1 à 2 kg suffit pour les bûches tendres (peuplier, aulne, bouleau). Pour les bois durs (chêne, hêtre, charme), optez pour une massette en acier de 2 à 3 kg. Ne frappez pas avec un marteau classique (tête trop petite). Le ${product.name} n'est pas livré avec le maillet — il est disponible dans tout magasin de bricolage.`,
    },
    {
      question: `Quelle est la garantie du fendeur ${product.name} ?`,
      answer: `Le ${product.name} est garanti 2 ans par l'Atelier LBF. La garantie couvre les défauts de fabrication et les ruptures de soudure. L'usure normale du coin (écrasement progressif après des milliers de fentes) n'est pas couverte mais peut être reprise par notre atelier.`,
    },
  ];
}

// ── FAQ accessoires ────────────────────────────────────────────────────────

function faqAccessoire(product: Product): Array<{ question: string; answer: string }> {
  const name = product.name;
  const nameLower = name.toLowerCase();

  if (nameLower.includes("spatule")) {
    return [
      { question: `La spatule ${name} est-elle compatible avec toutes les planchas ?`, answer: `Oui, la spatule ${name} est conçue pour fonctionner sur toutes les planchas (acier carbone, inox, fonte). Sa lame fine et flexible s'adapte à la courbure légère des planchas rondes de brasero. Compatible avec tous les modèles Atelier LBF (L'Obélix, Le Coffy, Le Morris, Le Fermier) en 50, 80 et 100 cm.` },
      { question: `Comment entretenir la spatule ${name} ?`, answer: `Lavez la spatule à l'eau chaude après chaque utilisation. Ne la passez pas au lave-vaisselle (le détergent agresse l'acier). Séchez-la immédiatement pour éviter la rouille superficielle. Appliquez un film d'huile alimentaire sur la lame si vous ne l'utilisez pas pendant plusieurs semaines.` },
      { question: `La spatule ${name} résiste-t-elle à la chaleur de la plancha ?`, answer: `La lame en acier résiste à plus de 500°C — bien au-delà des températures atteintes sur une plancha de brasero (200 à 350°C maximum). Le manche est dimensionné pour que vos mains restent à distance sécurisée des surfaces chaudes.` },
    ];
  }

  if (nameLower.includes("pique")) {
    return [
      { question: `La pique ${name} est-elle compatible avec tous les braseros ?`, answer: `Oui, la pique ${name} est compatible avec l'ensemble de la gamme Atelier LBF. Sa longueur permet de manipuler les braises dans un bol de 100 cm de diamètre en maintenant vos mains à distance des flammes.` },
      { question: `Comment utiliser la pique ${name} pour le feu ?`, answer: `Utilisez la pique pour repositionner les bûches, écarter les braises, créer des zones de chaleur différente ou retourner un aliment directement sur la grille. Le bout pointu permet aussi d'accrocher une bûche pour l'orienter sans la toucher.` },
      { question: `La pique ${name} rouille-t-elle avec l'utilisation ?`, answer: `Une légère rouille superficielle peut apparaître si vous laissez la pique mouillée après utilisation. Séchez-la après chaque usage et appliquez un film d'huile sur l'acier. La rouille superficielle ne compromet pas la solidité — elle s'enlève facilement avec de la laine de verre.` },
    ];
  }

  if (nameLower.includes("planche") || nameLower.includes("acajou") || nameLower.includes("découper")) {
    return [
      { question: `La planche à découper en acajou est-elle alimentaire ?`, answer: `Oui, l'acajou est un bois utilisé en cuisine depuis des siècles. Il est naturellement dense et peu poreux, ce qui limite l'absorption des bactéries et facilite le nettoyage. Assurez-vous de ne jamais immerger la planche dans l'eau (fissures du bois) et de l'huiler régulièrement avec de l'huile minérale alimentaire.` },
      { question: `Comment entretenir la planche à découper en acajou ?`, answer: `Lavez à l'eau tiède avec une éponge légèrement savonneuse, séchez immédiatement. Une fois par mois, appliquez de l'huile de lin alimentaire ou de l'huile minérale sur toutes les faces — laissez pénétrer 30 minutes, essuyez le surplus. Ne passez jamais la planche au lave-vaisselle.` },
      { question: `Quelle taille fait la planche à découper ?`, answer: `Consultez la fiche produit pour les dimensions exactes. La planche est conçue pour s'utiliser à côté du brasero — pour découper les viandes grillées, dresser les plateaux ou présenter les accompagnements directement à table.` },
    ];
  }

  if (nameLower.includes("kit") || nameLower.includes("ustensile")) {
    return [
      { question: `Quels ustensiles sont inclus dans le kit ?`, answer: `Le kit ${name} comprend les ustensiles essentiels pour la cuisson au brasero : spatule, pique à braises et accessoires de cuisson. Consultez la fiche produit pour la liste complète. Chaque pièce est fabriquée en acier inoxydable ou acier traité pour résister aux températures extrêmes.` },
      { question: `Le kit ${name} est-il compatible avec tous les braseros Atelier LBF ?`, answer: `Oui, le kit est conçu pour la gamme complète Atelier LBF (L'Obélix, Le Coffy, Le Morris, Le Fermier) en 50, 80 et 100 cm. Les longueurs des ustensiles sont calculées pour les bols de 100 cm de diamètre.` },
      { question: `Comment entretenir les ustensiles du kit ${name} ?`, answer: `Lavez à l'eau chaude après chaque utilisation, séchez immédiatement. Appliquez un film d'huile alimentaire sur les lames et embouts en acier si vous ne les utilisez pas pendant plusieurs semaines. Stockez dans un endroit sec, idéalement dans la pochette ou le support inclus.` },
    ];
  }

  return [
    {
      question: `${name} est-il compatible avec tous les braseros Atelier LBF ?`,
      answer: `Oui, ${name} est conçu pour être compatible avec l'ensemble de la gamme Atelier LBF (L'Obélix, Le Coffy, Le Morris, Le Fermier) dans toutes les tailles (50, 80 et 100 cm).`,
    },
    {
      question: `Quelle est la garantie de ${name} ?`,
      answer: `${name} bénéficie d'une garantie fabricant de 2 ans. Fabriqué en France dans notre atelier de Moncoutant (Deux-Sèvres). SAV joignable par téléphone et email.`,
    },
    {
      question: `Comment entretenir ${name} ?`,
      answer: `Nettoyez après chaque utilisation avec un chiffon humide et séchez immédiatement. Pour les pièces en acier, appliquez un léger film d'huile si vous ne l'utilisez pas pendant plusieurs semaines.`,
    },
  ];
}

// ── Mots-clés SEO anti-cannibalisme ───────────────────────────────────────

function keywordsObelix(product: Product): string[] {
  const diameter = product.diameter ?? 80;
  const kws = [
    `brasero L'Obélix ${diameter}cm`,
    `brasero plancha Obélix ${diameter}`,
    `L'Obélix Atelier LBF ${diameter}cm`,
    `brasero socle carré ${diameter}cm`,
    `brasero range-bûches intégré`,
    `brasero acier peint ${diameter}cm`,
    `brasero plancha acier carbone ${diameter}cm`,
    `brasero artisanal ${diameter}cm France`,
    `Atelier LBF L'Obélix`,
  ];
  if (diameter === 50) {
    kws.push("petit brasero plancha 50cm", "brasero plancha compact", "brasero terrasse appartement", "brasero 2 personnes");
  } else if (diameter === 80) {
    kws.push("brasero plancha 80cm", "brasero famille 6 personnes", "brasero jardin 80cm", "brasero weekend");
  } else {
    kws.push("grand brasero plancha 100cm", "brasero 10 personnes", "brasero grande tablée", "brasero 100cm acier");
  }
  return kws;
}

function keywordsCoffy(product: Product): string[] {
  const diameter = product.diameter ?? 80;
  const kws = [
    `brasero Le Coffy ${diameter}cm`,
    `brasero plancha Coffy ${diameter}`,
    `Le Coffy Atelier LBF ${diameter}cm`,
    `brasero tripode ${diameter}cm`,
    `brasero design minimaliste`,
    `brasero 3 pieds acier`,
    `brasero plancha acier carbone ${diameter}cm`,
    `brasero artisanal Deux-Sèvres ${diameter}cm`,
    `Atelier LBF Le Coffy`,
  ];
  if (diameter === 50) {
    kws.push("petit brasero tripode 50cm", "brasero minimaliste compact", "brasero balcon design", "brasero 2 à 4 personnes");
  } else if (diameter === 80) {
    kws.push("brasero Coffy 80cm", "brasero élégant 80cm", "brasero famille design", "brasero plancha 80 design");
  } else {
    kws.push("grand brasero Coffy 100cm", "brasero plancha 100cm tripode", "brasero 100cm design", "brasero grande tablée design");
  }
  return kws;
}

function keywordsMorris(product: Product): string[] {
  const diameter = product.diameter ?? 100;
  const plancha = detectPlanchaType(product);
  return [
    `brasero Le Morris ${diameter}cm`,
    `brasero plancha Morris ${diameter}`,
    `Le Morris Atelier LBF ${diameter}cm`,
    `brasero haut de gamme ${diameter}cm`,
    `brasero plancha ${plancha} ${diameter}cm`,
    `brasero double zone cuisson`,
    `brasero plancha grille simultané`,
    `brasero professionnel jardin`,
    `brasero luxe made in France`,
    `brasero plancha ${plancha} 10mm`,
    `brasero cuisson mixte ${diameter}cm`,
    `Atelier LBF Le Morris`,
    diameter === 80 ? "brasero Morris 80cm" : "brasero Morris 100cm",
  ];
}

function keywordsFermier(product: Product): string[] {
  const diameter = product.diameter ?? 80;
  return [
    `brasero Le Fermier corten`,
    `brasero corten plancha inox`,
    `brasero acier corten ${diameter}cm`,
    `Le Fermier Atelier LBF`,
    `brasero autopatinable France`,
    `brasero sans entretien`,
    `brasero corten jardin`,
    `brasero plancha inox corten`,
    `brasero rouille protectrice`,
    `brasero Deux-Sèvres corten`,
    `brasero double zone corten`,
    `Atelier LBF corten`,
  ];
}

function keywordsGenericBrasero(product: Product): string[] {
  const diameter = product.diameter ?? 80;
  return [
    product.name,
    `brasero artisanal ${diameter}cm`,
    "brasero plancha France",
    "brasero made in France",
    "brasero artisanal Deux-Sèvres",
    "Atelier LBF",
  ];
}

function keywordsFendeur(product: Product): string[] {
  return [
    product.name,
    "fendeur à bûches artisanal",
    "fendeur bûches acier France",
    "fendeur manuel sécurisé",
    "fendeur bois chauffage brasero",
    "couper bûches sans hache",
    "fendeur bûches made in France",
    "fendeur sécurisé maillet",
    "Atelier LBF fendeur",
    "fendeur bûches Deux-Sèvres",
  ];
}

function keywordsAccessoire(product: Product): string[] {
  const nameLower = product.name.toLowerCase();
  const base = [product.name, "accessoire brasero artisanal", "Atelier LBF", "made in France"];

  if (nameLower.includes("spatule")) return [...base, "spatule plancha brasero", "spatule acier inox plancha", "ustensile brasero cuisson"];
  if (nameLower.includes("pique")) return [...base, "pique brasero feu", "tisonnier brasero artisanal", "outil feu de bois", "pique braises"];
  if (nameLower.includes("planche") || nameLower.includes("acajou")) return [...base, "planche découper acajou brasero", "planche bois présentation", "planche cuisine brasero"];
  if (nameLower.includes("kit") || nameLower.includes("ustensile")) return [...base, "kit ustensiles brasero", "set cuisson brasero", "accessoires complets brasero"];

  return base;
}

// ── Descriptions fendeur/accessoire ───────────────────────────────────────

function descFendeur(product: Product): string {
  return `Le ${product.name} est un fendeur à bûches artisanal fabriqué à la main dans notre atelier de Moncoutant (Deux-Sèvres), en acier ${product.material}. Conçu pour simplifier la préparation du bois de chauffage de votre brasero Atelier LBF, il remplace avantageusement la hache traditionnelle : plus sécurisé, moins fatigant, plus précis.

Le principe est simple : posez votre bûche sur le coin en acier, frappez avec un maillet et la bûche se fend net. Pas de geste de balancier risqué, pas de lame qui dévie sur un nœud. Les deux mains restent toujours en position sécurisée. C'est l'outil recommandé pour tous ceux qui préparent régulièrement leur bois (chêne, hêtre, charme) pour alimenter leur brasero.

Fabriqué en ${product.material} dans nos ateliers des Deux-Sèvres. Garanti 2 ans. Livraison partout en France sous 5 à 10 jours ouvrés.`;
}

function descAccessoire(product: Product): string {
  const nameLower = product.name.toLowerCase();

  if (nameLower.includes("spatule")) {
    return `La ${product.name} est l'outil de cuisson indispensable pour votre brasero plancha Atelier LBF. Sa lame en acier, suffisamment fine pour glisser sous les aliments sans les abîmer et suffisamment rigide pour retourner une entrecôte, est conçue pour les planchas de 50 à 100 cm. Compatible avec les planchas acier carbone et inox.

Utilisez-la pour retourner vos viandes et poissons, déplacer les aliments entre zones chaude et tiède, gratter les résidus pour entretenir le culottage et nettoyer la surface de plancha en fin de cuisson. Le manche long garantit une prise en main sécurisée loin des surfaces chaudes. Fabriquée en France, garantie 2 ans.`;
  }

  if (nameLower.includes("pique")) {
    return `La ${product.name} est l'accessoire de gestion du feu pour votre brasero Atelier LBF. Sa longueur permet de manipuler les bûches et les braises sans approcher les mains des flammes, depuis une position confortable debout derrière le brasero.

Repositionnez les bûches pour optimiser la combustion, écartez les braises pour créer des zones de chaleur différente, guidez le feu vers la plancha ou la grille selon vos besoins de cuisson. L'acier utilisé résiste aux températures du foyer (plus de 800°C au cœur des braises). Fabriquée en France dans notre atelier de Moncoutant (79). Garantie 2 ans.`;
  }

  if (nameLower.includes("planche") || nameLower.includes("acajou")) {
    return `La ${product.name} en bois d'acajou est l'accessoire de présentation et de découpe pour compléter votre expérience brasero. L'acajou est un bois tropical à grain serré, naturellement résistant à l'humidité et peu poreux — les jus de viande n'imprègnent pas en profondeur, les bactéries ne s'y installent pas facilement.

Utilisez cette planche pour découper les viandes grillées directement à table, dresser vos plateaux de charcuteries en apéritif ou préparer vos légumes avant cuisson. Son format est pensé pour s'intégrer naturellement aux repas autour du brasero. Compatible avec tous les modèles Atelier LBF. Garantie 2 ans.`;
  }

  if (nameLower.includes("kit") || nameLower.includes("ustensile")) {
    return `Le ${product.name} regroupe tous les ustensiles essentiels pour cuisiner sur votre brasero Atelier LBF. Conçu pour fonctionner avec les planchas en acier carbone et inox de 50 à 100 cm, ce kit vous équipe pour griller, retourner, servir et entretenir votre plancha sans manquer d'outil.

Chaque pièce est fabriquée avec des matériaux résistants à la chaleur intense du feu de bois. Compatible avec l'ensemble de la gamme Atelier LBF (L'Obélix, Le Coffy, Le Morris, Le Fermier). Fabriqué en France, garanti 2 ans.`;
  }

  return `${product.name} — accessoire artisanal pour brasero Atelier LBF, fabriqué en France à Moncoutant (Deux-Sèvres). Conçu pour s'intégrer à la gamme L'Obélix, Le Coffy, Le Morris et Le Fermier en 50, 80 et 100 cm. Matériaux de qualité, garanti 2 ans, livraison soignée.`;
}

// ── Fonction principale ────────────────────────────────────────────────────

export function generateProductSEO(product: Product): ProductSEO {
  if (product.category === "brasero") {
    const model = detectModel(product);
    switch (model) {
      case "obelix":
        return { description: descObelix(product), faq: faqObelix(product), keywords: keywordsObelix(product) };
      case "coffy":
        return { description: descCoffy(product), faq: faqCoffy(product), keywords: keywordsCoffy(product) };
      case "morris":
        return { description: descMorris(product), faq: faqMorris(product), keywords: keywordsMorris(product) };
      case "fermier":
        return { description: descFermier(product), faq: faqFermier(product), keywords: keywordsFermier(product) };
      default:
        return { description: descGenericBrasero(product), faq: faqGenericBrasero(product), keywords: keywordsGenericBrasero(product) };
    }
  }

  if (product.category === "fendeur") {
    return { description: descFendeur(product), faq: faqFendeur(product), keywords: keywordsFendeur(product) };
  }

  // accessoire, range-buches, etc.
  return { description: descAccessoire(product), faq: faqAccessoire(product), keywords: keywordsAccessoire(product) };
}

// ── Meta title anti-cannibalisme ───────────────────────────────────────────

export function generateProductMetaTitle(product: Product): string {
  const diameter = product.diameter ? ` ${product.diameter}cm` : "";
  const price = product.price;

  if (product.category === "brasero") {
    const model = detectModel(product);
    switch (model) {
      case "obelix":
        return `Brasero L'Obélix${diameter} | Socle carré, plancha acier carbone | Atelier LBF — ${price}€`;
      case "coffy":
        return `Brasero Le Coffy${diameter} | Design tripode, plancha acier carbone | Atelier LBF — ${price}€`;
      case "morris":
        return `Brasero Le Morris${diameter} | Haut de gamme, double zone cuisson | Atelier LBF — ${price}€`;
      case "fermier":
        return `Brasero Le Fermier | Acier corten, plancha inox | Sans entretien | Atelier LBF — ${price}€`;
      default:
        return `${product.name} | Brasero plancha artisanal${diameter} | Atelier LBF — ${price}€`;
    }
  }

  if (product.category === "fendeur") {
    return `${product.name} | Fendeur à bûches sécurisé, fabriqué en France | Atelier LBF — ${price}€`;
  }

  return `${product.name} | Accessoire brasero artisanal | Atelier LBF — ${price}€`;
}

// ── Meta description ≤ 155 caractères ─────────────────────────────────────

export function generateProductMetaDescription(product: Product): string {
  const diameter = product.diameter ? ` Ø${product.diameter}cm` : "";
  const price = product.price;
  let desc: string;

  if (product.category === "brasero") {
    const model = detectModel(product);
    const plancha = detectPlanchaType(product);
    const guests = product.diameter && product.diameter >= 100 ? "10 à 12" : product.diameter && product.diameter >= 80 ? "6 à 8" : "2 à 4";

    switch (model) {
      case "obelix":
        desc = `Brasero L'Obélix${diameter} : socle carré range-bûches, plancha ${plancha} 8mm. ${guests} pers. Fabriqué à la main en France. ${price}€ livraison incluse.`;
        break;
      case "coffy":
        desc = `Brasero Le Coffy${diameter} : design tripode minimaliste, plancha ${plancha} 8mm. ${guests} pers. Made in France. ${price}€ livré monté.`;
        break;
      case "morris":
        desc = `Brasero Le Morris${diameter} : double zone cuisson (plancha + grille simultané), plancha ${plancha} 10mm. ${guests} pers. Atelier LBF. ${price}€.`;
        break;
      case "fermier":
        desc = `Brasero Le Fermier${diameter} : acier corten sans entretien, plancha inox 8mm. ${guests} pers. Unique dans la gamme. Fabriqué en France. ${price}€.`;
        break;
      default:
        desc = `${product.name}${diameter} : brasero plancha artisanal, fabriqué à la main en France. ${guests} pers. ${price}€ livraison incluse. Garantie 2 ans.`;
    }
  } else if (product.category === "fendeur") {
    desc = `${product.name} : fendeur à bûches artisanal, plus sécurisé qu'une hache. Fabriqué en France dans les Deux-Sèvres. ${price}€. Garantie 2 ans.`;
  } else {
    desc = `${product.name} : accessoire brasero artisanal, compatible tous modèles Atelier LBF. Fabriqué en France. ${price}€. Garanti 2 ans.`;
  }

  return desc.length > 155 ? desc.slice(0, 152) + "..." : desc;
}
