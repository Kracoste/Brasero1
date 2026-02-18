/**
 * Système de FAQ dynamique et contextuelle pour les produits.
 * 
 * Les FAQ sont générées automatiquement en fonction de :
 * - Le type de produit (braséro, accessoire, fendeur, range-bûches)
 * - Le matériau (corten, acier peint/thermolaqué, inox, acier brut)
 * - Le type de plancha (acier, inox) si applicable
 * - Les spécifications du produit
 * 
 * Quand le client choisira une variante (corten vs peint, plancha inox vs acier),
 * la FAQ changera automatiquement via getProductFAQ() en passant les options sélectionnées.
 */

import type { Product } from "@/lib/schema";

export type FAQItem = {
  question: string;
  answer: string;
};

// ────────────────────────────────────────────────────────────────────────────────
// Détection du type de matériau à partir du produit
// ────────────────────────────────────────────────────────────────────────────────

export type MaterialType = "corten" | "acier-peint" | "acier-brut" | "inox" | "galvanise" | "autre";
export type PlanchaType = "acier" | "inox" | "aucune";

/**
 * Détecte le type de matériau d'un produit à partir de son champ `material` et `specs`.
 */
export function detectMaterial(product: Product): MaterialType {
  const mat = (product.material || "").toLowerCase();
  const specAcier = (product.specs?.acier || "").toLowerCase();

  if (mat.includes("corten") || specAcier.includes("corten")) return "corten";
  if (mat.includes("inox") || specAcier.includes("inox")) return "inox";
  if (mat.includes("galvanisé") || mat.includes("galva") || specAcier.includes("galva")) return "galvanise";
  if (
    mat.includes("thermolaqué") ||
    mat.includes("verni") ||
    mat.includes("peint") ||
    product.specs?.painting
  ) return "acier-peint";
  if (mat.includes("acier brut") || specAcier.includes("acier brut")) return "acier-brut";

  return "autre";
}

/**
 * Détecte si le produit a une plancha ou est une plancha, et quel type.
 * Priorité : specs.planchaMaterial (défini par l'admin) > nom/slug > accessoires compatibles
 */
export function detectPlanchaType(product: Product): PlanchaType {
  // 1. Priorité absolue : le champ planchaMaterial défini dans le dashboard admin
  if (product.specs?.planchaMaterial === "inox") return "inox";
  if (product.specs?.planchaMaterial === "acier") return "acier";

  const name = (product.name || "").toLowerCase();
  const slug = (product.slug || "").toLowerCase();
  const mat = (product.material || "").toLowerCase();
  const specAcier = (product.specs?.acier || "").toLowerCase();

  // 2. C'est une plancha elle-même
  if (name.includes("plancha") || slug.includes("plancha")) {
    if (mat.includes("inox") || specAcier.includes("inox") || slug.includes("inox")) return "inox";
    return "acier";
  }

  // 3. Braséro compatible plancha — vérifier dans les accessoires compatibles
  const accessories = product.specs?.compatibleAccessories || [];
  const hasPlanchaAcier = accessories.some((a: string) => a.includes("plancha-acier"));
  const hasPlanchaInox = accessories.some((a: string) => a.includes("plancha-inox"));

  if (hasPlanchaInox) return "inox";
  if (hasPlanchaAcier) return "acier";

  return "aucune";
}

// ────────────────────────────────────────────────────────────────────────────────
// Banque de FAQ par thème — rédigées SEO pour un utilisateur novice
// ────────────────────────────────────────────────────────────────────────────────

const FAQ_ACIER_CORTEN: FAQItem[] = [
  {
    question: "Qu'est-ce que l'acier Corten ?",
    answer:
      "L'acier Corten (aussi appelé acier autopatinable) est un alliage spécial contenant du cuivre, du chrome et du nickel. Contrairement à l'acier classique, il développe une couche de rouille protectrice en surface qui empêche la corrosion de pénétrer plus en profondeur. C'est ce qui lui donne sa couleur brun-orangé caractéristique. Il est utilisé dans l'architecture, la sculpture et les braséros haut de gamme pour sa durabilité exceptionnelle et son esthétique naturelle.",
  },
  {
    question: "Combien de temps met l'acier Corten pour développer sa patine naturelle ?",
    answer:
      "La patine de l'acier Corten se développe progressivement en 6 à 24 mois selon les conditions climatiques. Les premières semaines, vous verrez une rouille orangée vive qui s'assombrira au fil du temps pour devenir brun foncé. L'alternance pluie/soleil accélère le processus. Si vous souhaitez accélérer la patine, vous pouvez humidifier régulièrement la surface pendant les premières semaines. Une fois stabilisée, la patine protège le braséro pendant des décennies.",
  },
  {
    question: "L'acier Corten rouille-t-il jusqu'à se percer ?",
    answer:
      "Non, c'est la grande différence avec l'acier ordinaire. L'acier Corten forme une couche d'oxyde protectrice auto-cicatrisante de quelques dixièmes de millimètre. Cette couche stoppe naturellement la progression de la corrosion. Avec une épaisseur de 3 à 5 mm sur nos braséros, la durée de vie se compte en plusieurs décennies, même en extérieur permanent.",
  },
  {
    question: "La patine du Corten tache-t-elle le sol ?",
    answer:
      "Durant la phase de développement de la patine (les premiers mois), des coulures de rouille peuvent marquer les surfaces claires (pierre, béton, bois). Nous recommandons de placer votre braséro sur un tapis de protection, une dalle ou une surface qui ne craint pas les traces. Une fois la patine stabilisée, les coulures diminuent considérablement. Les taches existantes peuvent être nettoyées avec un produit anti-rouille du commerce.",
  },
  {
    question: "Comment entretenir mon braséro en acier Corten ?",
    answer:
      "L'acier Corten ne nécessite quasiment aucun entretien, c'est son principal avantage. Après chaque utilisation, videz les cendres une fois refroidies. Évitez de laisser de l'eau stagner dans la cuve (assurez-vous que le trou d'évacuation n'est pas bouché). Ne peignez jamais la surface et ne la poncez pas, car vous détruiriez la couche protectrice. En cas de non-utilisation prolongée, une simple housse de protection suffit. Le Corten est conçu pour vivre en extérieur toute l'année.",
  },
  {
    question: "Peut-on cuisiner sur un braséro en acier Corten ?",
    answer:
      "Absolument ! L'acier Corten supporte des températures très élevées (plus de 600°C) sans se déformer. Vous pouvez utiliser une plancha, une grille ou un anneau de cuisson posé directement sur le braséro. La rouille du Corten n'est pas toxique et ne migre pas vers les aliments via les accessoires de cuisson. C'est un matériau approuvé pour un usage extérieur alimentaire indirect.",
  },
];

const FAQ_ACIER_PEINT: FAQItem[] = [
  {
    question: "Comment entretenir un braséro en acier peint (thermolaqué) ?",
    answer:
      "Après chaque utilisation, laissez le braséro refroidir complètement puis videz les cendres. Nettoyez l'intérieur avec une brosse métallique douce pour retirer les résidus. La peinture haute température résiste jusqu'à 600°C, mais des retouches peuvent être nécessaires après une saison d'usage intensif. Utilisez une bombe de peinture haute température (disponible en quincaillerie) pour les zones écaillées. Stockez-le à l'abri ou sous housse en hiver.",
  },
  {
    question: "La peinture du braséro va-t-elle s'écailler avec la chaleur ?",
    answer:
      "Nos braséros sont recouverts d'une peinture thermolaquée haute température résistante jusqu'à 600°C. À l'intérieur de la cuve, au contact direct des flammes, la peinture peut évoluer avec le temps — c'est normal et n'affecte pas la solidité du braséro. L'extérieur conserve son aspect beaucoup plus longtemps. En cas de micro-écaillages, une retouche avec une peinture haute température remet le braséro à neuf en quelques minutes.",
  },
  {
    question: "Quelle est la différence entre un braséro Corten et un braséro peint ?",
    answer:
      "Le braséro en acier Corten développe une patine de rouille naturelle qui le protège sans aucun entretien. Son aspect évolue au fil des saisons pour un rendu unique et organique. Le braséro peint (thermolaqué) offre un aspect plus lisse et moderne avec un choix de coloris. Il nécessite un entretien léger (retouches de peinture possibles) mais reste plus abordable. Les deux sont fabriqués en France dans le même atelier et offrent les mêmes performances de chauffe.",
  },
  {
    question: "Mon braséro peint peut-il rester dehors toute l'année ?",
    answer:
      "Oui, à condition de le protéger avec une housse ou de le stocker à l'abri pendant les mois d'hiver rigoureux. La peinture thermolaquée résiste aux intempéries courantes, mais l'humidité prolongée peut provoquer des points de rouille sous les éventuels éclats de peinture. Un simple coup d'antirouille suivi d'une retouche de peinture haute température suffit pour le remettre en état.",
  },
  {
    question: "Peut-on cuisiner sur un braséro en acier peint ?",
    answer:
      "Oui, vous pouvez poser une plancha ou une grille sur votre braséro peint pour cuisiner. La peinture haute température ne dégage aucune substance nocive. La chaleur intense est concentrée à l'intérieur de la cuve, là où les accessoires de cuisson prennent le relais. C'est un excellent choix pour les soirées barbecue et plancha entre amis.",
  },
];

const FAQ_ENTRETIEN_BRASERO_GENERAL: FAQItem[] = [
  {
    question: "Comment allumer correctement un braséro ?",
    answer:
      "Placez du petit bois sec ou des allume-feux naturels au centre de la cuve. Ajoutez progressivement des bûches de taille croissante en laissant de l'espace entre elles pour la circulation de l'air. Évitez les liquides inflammables (essence, alcool à brûler) qui sont dangereux et abîment le métal. Attendez que les premières braises se forment (environ 30 minutes) avant de poser une plancha ou une grille pour cuisiner.",
  },
  {
    question: "Quel bois utiliser dans un braséro ?",
    answer:
      "Privilégiez du bois de feuillus secs (chêne, hêtre, charme, frêne) avec un taux d'humidité inférieur à 20%. Ces essences produisent de belles braises durables et peu de fumée. Évitez les résineux (pin, sapin, épicéa) qui projettent des étincelles et encrassent la cuve. Les bûches de 25 à 33 cm sont idéales. Le bois densifié (bûches compressées) est aussi un excellent choix pour un feu propre et performant.",
  },
  {
    question: "Où installer son braséro en toute sécurité ?",
    answer:
      "Installez votre braséro sur une surface plane, stable et non combustible (dalle béton, gravier, carrelage). Éloignez-le d'au moins 2 mètres de toute matière inflammable (murs en bois, haies, mobilier de jardin, parasols). Ne l'utilisez jamais dans un espace clos ou sous un auvent bas. Prévoyez un extincteur ou un seau d'eau à proximité. Vérifiez la réglementation locale (certaines communes réglementent les feux en extérieur).",
  },
  {
    question: "Comment éteindre un braséro ?",
    answer:
      "Laissez les braises se consumer naturellement sans ajouter de bois, c'est la méthode la plus sûre. Si vous devez l'éteindre rapidement, étouffez les braises avec du sable ou de la terre. Évitez de verser de l'eau froide sur un braséro brûlant car le choc thermique peut déformer l'acier. Ne jetez jamais les cendres chaudes à la poubelle : attendez 48h minimum ou arrosez-les abondamment.",
  },
  {
    question: "Un braséro chauffe-t-il vraiment ?",
    answer:
      "Oui ! Un braséro de 60 à 100 cm de diamètre peut chauffer un rayon de 3 à 5 mètres autour de lui par rayonnement. La chaleur est diffusée de manière agréable et homogène grâce à la forme de la vasque. C'est une solution idéale pour prolonger vos soirées en extérieur au printemps et en automne, et même en hiver pour les plus courageux. Avec de bonnes braises, un braséro peut maintenir une chaleur confortable pendant 2 à 3 heures.",
  },
];

const FAQ_PLANCHA_ACIER: FAQItem[] = [
  {
    question: "Comment entretenir une plancha en acier ?",
    answer:
      "Après chaque utilisation, grattez les résidus à chaud avec une spatule métallique pendant que la plancha est encore tiède. Versez un peu d'eau pour créer de la vapeur qui décolle les graisses (attention aux éclaboussures). Une fois la plancha refroidie, appliquez une fine couche d'huile alimentaire (tournesol ou colza) avec un chiffon pour créer un film protecteur anti-rouille. Ce « culottage » s'améliore avec le temps et rend la plancha naturellement antiadhésive.",
  },
  {
    question: "Ma plancha en acier a rouillé, est-ce grave ?",
    answer:
      "Non, c'est tout à fait normal et récupérable. L'acier brut réagit à l'humidité. Frottez les zones rouillées avec une brosse métallique ou du papier de verre grain fin, puis huilez généreusement toute la surface. Refaites une première cuisson à vide (chauffez 20 min puis huilez) pour reconstituer le culottage. Pour éviter la rouille, huilez toujours votre plancha après nettoyage et stockez-la à l'abri de l'humidité.",
  },
  {
    question: "Qu'est-ce que le culottage d'une plancha acier ?",
    answer:
      "Le culottage est la couche protectrice noire qui se forme naturellement sur l'acier au fil des cuissons. C'est une polymérisation des huiles de cuisson qui rend la surface antiadhésive et la protège de la rouille — comme une poêle en fonte. Pour accélérer le culottage initial : chauffez la plancha à vide, badigeonnez d'huile, laissez fumer, essuyez et recommencez 3-4 fois. Plus vous cuisinez, meilleur sera le culottage.",
  },
];

const FAQ_PLANCHA_INOX: FAQItem[] = [
  {
    question: "Comment entretenir une plancha en inox ?",
    answer:
      "La plancha inox est la plus facile à entretenir. Après cuisson, versez un verre d'eau sur la surface encore chaude pour décoller les résidus par choc thermique (attention aux éclaboussures). Grattez avec une spatule inox ou une éponge non abrasive. Pour les traces tenaces, utilisez du vinaigre blanc tiède ou un produit spécial inox. Séchez bien la plancha après nettoyage. L'inox ne nécessite pas de huilage, mais un léger film d'huile avant stockage prolongé est recommandé.",
  },
  {
    question: "La plancha inox attache-t-elle les aliments ?",
    answer:
      "L'inox peut accrocher les aliments si la plancha n'est pas assez chaude. Le secret : préchauffez votre plancha pendant 10-15 minutes, déposez un filet d'huile, puis posez vos aliments. Attendez que la croûte de cuisson se forme naturellement avant de retourner — si ça colle, c'est que ce n'est pas encore prêt. L'inox ne se culotte pas comme l'acier, mais avec la bonne technique, la cuisson est tout aussi réussie.",
  },
  {
    question: "Quelle est la différence entre une plancha inox et une plancha en acier ?",
    answer:
      "La plancha en acier chauffe plus vite, offre une meilleure conductivité thermique et développe un culottage antiadhésif naturel avec le temps. En revanche, elle nécessite un entretien régulier (huilage) pour éviter la rouille. La plancha inox est inoxydable, très hygiénique et facile à nettoyer, mais elle chauffe un peu moins uniformément et n'a pas de culottage naturel. L'acier est le choix des puristes de la cuisson, l'inox celui de la praticité au quotidien.",
  },
];

const FAQ_ACCESSOIRE_GENERAL: FAQItem[] = [
  {
    question: "Les accessoires sont-ils compatibles avec tous les braséros ?",
    answer:
      "Nos accessoires sont conçus spécifiquement pour les braséros Atelier LBF. Chaque accessoire est disponible en différents diamètres (45, 55, 60, 70, 75, 80, 90, 100 cm) pour s'adapter parfaitement à votre modèle. Vérifiez le diamètre de compatibilité indiqué dans la fiche produit. En cas de doute, contactez-nous avec la référence de votre braséro et nous vous conseillerons.",
  },
  {
    question: "Peut-on utiliser les accessoires avec un braséro d'une autre marque ?",
    answer:
      "Nos accessoires sont optimisés pour nos braséros, mais certains (grilles, pinces, gants) sont universels. Pour les planchas et anneaux de cuisson, le diamètre doit correspondre exactement à celui de votre braséro. Si vous n'êtes pas sûr de la compatibilité, envoyez-nous les dimensions de votre braséro via notre formulaire de contact.",
  },
];

const FAQ_FENDEUR: FAQItem[] = [
  {
    question: "Comment utiliser un fendeur à bûches en toute sécurité ?",
    answer:
      "Placez le fendeur sur une surface plane et stable. Positionnez la bûche verticalement dans le fendeur, puis utilisez un maillet ou une masse pour frapper le dessus de la bûche. Portez toujours des gants de protection et des chaussures fermées. Ne forcez jamais sur des bûches trop grosses pour la capacité du fendeur. Fendez toujours avec le fil du bois pour faciliter la découpe.",
  },
  {
    question: "Quelles bûches peut-on fendre avec ce fendeur ?",
    answer:
      "Notre fendeur est conçu pour des bûches de 20 à 50 cm de diamètre, en bois de feuillus (chêne, hêtre, charme) ou de résineux. Le bois vert (fraîchement coupé) se fend plus facilement que le bois sec. Pour des bûches très noueuses ou de gros diamètre, plusieurs passages peuvent être nécessaires.",
  },
];

// ────────────────────────────────────────────────────────────────────────────────
// Fonction principale : génère la FAQ contextuelle pour un produit
// ────────────────────────────────────────────────────────────────────────────────

export type FAQOptions = {
  /** Forcer un type de matériau (quand le client choisit une variante) */
  overrideMaterial?: MaterialType;
  /** Forcer un type de plancha (quand le client choisit entre inox/acier) */
  overridePlanchaType?: PlanchaType;
};

/**
 * Génère la FAQ complète pour un produit, en combinant :
 * 1. Les FAQ spécifiques au produit (celles écrites manuellement dans la fiche)
 * 2. Les FAQ dynamiques basées sur le matériau et les accessoires
 * 
 * @param product - Le produit
 * @param options - Options pour forcer un matériau ou type de plancha (variantes)
 * @returns Liste de FAQ triées par pertinence
 */
export function getProductFAQ(product: Product, options?: FAQOptions): FAQItem[] {
  const material = options?.overrideMaterial ?? detectMaterial(product);
  const planchaType = options?.overridePlanchaType ?? detectPlanchaType(product);

  const faqSections: FAQItem[] = [];

  // ─── 1. FAQ matériau ───────────────────────────────────────────────────────
  if (product.category === "brasero") {
    if (material === "corten") {
      faqSections.push(...FAQ_ACIER_CORTEN);
    } else if (material === "acier-peint" || material === "galvanise") {
      faqSections.push(...FAQ_ACIER_PEINT);
    } else if (material === "acier-brut") {
      // Acier brut = mix des deux (pas de patine corten, mais pas peint non plus)
      faqSections.push(
        FAQ_ACIER_PEINT[0], // entretien acier peint applicable
        FAQ_ACIER_PEINT[2], // différence corten/peint
      );
    } else if (material === "inox") {
      faqSections.push({
        question: "Comment entretenir un braséro en inox ?",
        answer:
          "L'inox est le matériau le plus facile à entretenir. Nettoyez simplement avec de l'eau savonneuse et une éponge non abrasive après chaque utilisation. Pour les traces tenaces, utilisez du vinaigre blanc ou un produit spécial inox. L'inox ne rouille pas et conserve son éclat pendant des années sans traitement particulier.",
      });
    }

    // FAQ entretien braséro général (toujours pour les braséros)
    faqSections.push(...FAQ_ENTRETIEN_BRASERO_GENERAL);
  }

  // ─── 2. FAQ plancha (si applicable) ────────────────────────────────────────
  if (planchaType === "acier") {
    faqSections.push(...FAQ_PLANCHA_ACIER);
  } else if (planchaType === "inox") {
    faqSections.push(...FAQ_PLANCHA_INOX);
  }

  // Si c'est un braséro compatible plancha, ajouter la comparaison inox/acier
  if (product.category === "brasero" && planchaType !== "aucune") {
    // Vérifier que la FAQ comparative n'est pas déjà incluse
    const hasComparison = faqSections.some(
      (f) => f.question.toLowerCase().includes("différence entre une plancha inox")
    );
    if (!hasComparison) {
      faqSections.push(FAQ_PLANCHA_INOX[2]); // "Quelle est la différence entre..."
    }
  }

  // ─── 3. FAQ catégorie spécifique ───────────────────────────────────────────
  if (product.category === "accessoire") {
    // Si c'est une plancha, les FAQ plancha sont déjà ajoutées ci-dessus
    const isPlanchaProduct =
      product.name.toLowerCase().includes("plancha") ||
      product.slug.toLowerCase().includes("plancha");

    if (!isPlanchaProduct) {
      faqSections.push(...FAQ_ACCESSOIRE_GENERAL);
    }
  }

  if (product.category === "fendeur") {
    faqSections.push(...FAQ_FENDEUR);
  }

  // ─── 4. Dédupliquer par question ───────────────────────────────────────────
  const seen = new Set<string>();
  const uniqueFAQ: FAQItem[] = [];
  for (const item of faqSections) {
    const key = item.question.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueFAQ.push(item);
    }
  }

  return uniqueFAQ;
}

// ────────────────────────────────────────────────────────────────────────────────
// Export des banques pour usage direct si besoin
// ────────────────────────────────────────────────────────────────────────────────

export {
  FAQ_ACIER_CORTEN,
  FAQ_ACIER_PEINT,
  FAQ_ENTRETIEN_BRASERO_GENERAL,
  FAQ_PLANCHA_ACIER,
  FAQ_PLANCHA_INOX,
  FAQ_ACCESSOIRE_GENERAL,
  FAQ_FENDEUR,
};
