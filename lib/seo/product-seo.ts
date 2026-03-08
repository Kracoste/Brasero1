/**
 * SEO dynamique par produit — descriptions longues, FAQ, meta tags
 * Génère du contenu SEO ultra-optimisé basé sur le nom, la catégorie,
 * le matériau, la taille et les variantes du produit.
 */

import type { Product } from "@/lib/schema";

// ── Types ──────────────────────────────────────────────────────────────────

type ProductSEO = {
  description: string;
  faq: Array<{ question: string; answer: string }>;
  keywords: string[];
};

// ── Détection du matériau et de la finition ────────────────────────────────

function detectFinish(product: Product): {
  material: string;
  materialLabel: string;
  planchaType: string;
  planchaLabel: string;
} {
  const name = product.name.toLowerCase();
  const mat = product.material.toLowerCase();
  const specs = product.specs;
  const painting = (specs as Record<string, unknown>)?.painting as string | undefined;

  let material = "acier";
  let materialLabel = "en acier";
  let planchaType = "inox";
  let planchaLabel = "plancha inox";

  // Détection matériau principal
  if (mat.includes("corten") || name.includes("corten")) {
    material = "corten";
    materialLabel = "en acier corten";
  } else if (painting || mat.includes("peint") || name.includes("peint")) {
    material = "peint";
    materialLabel = "en acier peint";
  }

  // Détection plancha
  const planchaMat = (specs as Record<string, unknown>)?.planchaMaterial as string | undefined;
  if (planchaMat === "acier" || name.includes("carbone")) {
    planchaType = "carbone";
    planchaLabel = "plancha acier carbone";
  }

  return { material, materialLabel, planchaType, planchaLabel };
}

// ── Descriptions SEO par catégorie ─────────────────────────────────────────

function generateBraseroDescription(product: Product): string {
  const { materialLabel, planchaLabel } = detectFinish(product);
  const diameterStr = product.diameter ? `${product.diameter} cm` : "";
  const modelName = product.name;

  return `Le ${modelName} est un brasero artisanal rond ${materialLabel} de ${diameterStr} de diamètre, entièrement fabriqué à la main dans notre atelier de Moncoutant (Deux-Sèvres). Conçu pour transformer votre jardin ou terrasse en véritable espace de convivialité, ce brasero multifonction vous permet de profiter d'un feu de bois chaleureux tout en cuisinant grâce à sa ${planchaLabel} amovible et sa grille de cuisson incluse.

Chaque ${modelName} est découpé au laser, formé et soudé par nos artisans avec un savoir-faire transmis de génération en génération. ${product.material.includes("corten") || product.material.toLowerCase().includes("corten") ? "L'acier corten développe naturellement une patine de rouille protectrice qui rend chaque brasero unique et le protège des intempéries sans aucun entretien." : product.material.toLowerCase().includes("peint") ? "La finition peinte offre un rendu élégant et une protection durable contre la corrosion, pour un brasero au look soigné saison après saison." : "L'acier brut de haute qualité garantit une robustesse exceptionnelle et une excellente diffusion de la chaleur pour des cuissons parfaites."}

Disponible en 3 diamètres (50 cm, 80 cm et 100 cm), le ${modelName} s'adapte à tous les espaces extérieurs. Que vous organisiez un dîner intimiste à deux ou une grande soirée barbecue entre amis, ce brasero artisanal français est votre allié pour des moments inoubliables en plein air.

Livré avec grille de cuisson, garantie 2 ans, livraison soignée partout en France sous 5 à 10 jours ouvrés.`;
}

function generateFendeurDescription(product: Product): string {
  return `Le ${product.name} est un fendeur à bûches robuste et sécurisé, fabriqué artisanalement en France dans notre atelier de Moncoutant (Deux-Sèvres). Conçu pour simplifier la préparation de votre bois de chauffage, ce fendeur manuel vous permet de couper vos bûches rapidement et en toute sécurité, sans effort excessif.

Fabriqué en acier de haute qualité, le ${product.name} est pensé pour durer des années. Sa conception robuste permet de fendre des bûches de différentes tailles avec précision. Idéal pour les propriétaires de braseros, cheminées, poêles à bois ou inserts, il vous garantit un approvisionnement en bois de chauffage toujours prêt.

Un outil indispensable fabriqué en France, garanti 2 ans, avec livraison soignée partout en France.`;
}

function generateAccessoireDescription(product: Product): string {
  const name = product.name.toLowerCase();

  if (name.includes("pique")) {
    return `La ${product.name} est un accessoire indispensable pour votre brasero artisanal. Fabriquée en France dans notre atelier de Moncoutant, cette pique de qualité professionnelle vous permet de manipuler vos braises et aliments avec précision au-dessus du feu. Robuste et ergonomique, elle complète parfaitement votre équipement de cuisson au brasero. Garantie 2 ans.`;
  }
  if (name.includes("spatule")) {
    return `La ${product.name} est l'accessoire de cuisson idéal pour votre brasero et plancha. Fabriquée artisanalement en France, cette spatule professionnelle vous offre un contrôle parfait pour retourner viandes, légumes et poissons sur votre plancha ou grille de brasero. Manche ergonomique, acier de qualité, conçue pour durer. Garantie 2 ans.`;
  }
  if (name.includes("plancha") || name.includes("découper") || name.includes("acajou")) {
    return `La ${product.name} en bois d'acajou est un accessoire haut de gamme pour compléter votre expérience de cuisson au brasero. Ce bois noble offre une surface de découpe élégante et durable, résistante aux entailles. Parfaite pour préparer et présenter vos viandes, fromages et accompagnements lors de vos soirées barbecue au brasero. Un objet artisanal qui allie fonctionnalité et esthétique.`;
  }
  if (name.includes("kit") || name.includes("ustensile")) {
    return `Le ${product.name} regroupe tous les accessoires essentiels pour cuisiner sur votre brasero artisanal. Ce kit complet vous équipe pour griller, retourner et servir vos préparations avec aisance. Chaque ustensile est fabriqué avec des matériaux de qualité pour résister à la chaleur intense du feu de bois. L'ensemble idéal pour profiter pleinement de votre brasero. Fabriqué en France, garanti 2 ans.`;
  }

  return `${product.name} — accessoire artisanal pour brasero, fabriqué en France dans notre atelier de Moncoutant (Deux-Sèvres). Conçu pour compléter votre brasero et améliorer votre expérience de cuisson en extérieur. Matériaux de qualité, garanti 2 ans, livraison soignée partout en France.`;
}

// ── FAQ SEO par catégorie ──────────────────────────────────────────────────

function generateBraseroFAQ(product: Product): Array<{ question: string; answer: string }> {
  const { materialLabel, planchaLabel } = detectFinish(product);
  const diameterStr = product.diameter ? `${product.diameter} cm` : "";
  const modelName = product.name;

  return [
    {
      question: `Quelles sont les dimensions du brasero ${modelName} ?`,
      answer: `Le ${modelName} est disponible en 3 diamètres : 50 cm, 80 cm et 100 cm. ${product.diameter ? `Le modèle présenté fait ${diameterStr} de diamètre.` : ""} ${product.height ? `Sa hauteur est de ${product.height} cm.` : ""} ${product.weight ? `Il pèse environ ${product.weight} kg.` : ""}`,
    },
    {
      question: `Le brasero ${modelName} est-il compatible avec une plancha ?`,
      answer: `Oui, le ${modelName} est livré avec une ${planchaLabel} amovible et une grille de cuisson. Vous pouvez ainsi passer du barbecue à la plancha en quelques secondes. La plancha se retire facilement pour profiter uniquement du feu de bois.`,
    },
    {
      question: `En quel matériau est fabriqué le ${modelName} ?`,
      answer: `Le ${modelName} est fabriqué ${materialLabel} de haute qualité dans notre atelier de Moncoutant (Deux-Sèvres). ${product.material.toLowerCase().includes("corten") ? "L'acier corten développe une patine de rouille naturelle qui protège le brasero sans entretien et lui donne un aspect unique au fil du temps." : product.material.toLowerCase().includes("peint") ? "La finition peinte offre une protection durable et un rendu élégant." : "L'acier brut garantit robustesse et excellente diffusion de la chaleur."}`,
    },
    {
      question: `Comment entretenir le brasero ${modelName} ?`,
      answer: `${product.material.toLowerCase().includes("corten") ? `Le ${modelName} en acier corten ne nécessite aucun entretien particulier. La patine de rouille le protège naturellement. Videz simplement les cendres après chaque utilisation et rangez la plancha à l'abri.` : `Après chaque utilisation, videz les cendres du ${modelName} et nettoyez la grille et la plancha. En hiver, protégez-le avec une housse ou rangez-le à l'abri pour prolonger sa durée de vie.`}`,
    },
    {
      question: `Quel bois utiliser dans le brasero ${modelName} ?`,
      answer: `Utilisez du bois sec de feuillus (chêne, hêtre, charme) avec un taux d'humidité inférieur à 20%. Évitez les bois résineux (pin, sapin) qui produisent des étincelles et encrassent la grille. Les bûches compressées sont aussi adaptées au ${modelName}.`,
    },
    {
      question: `Combien de personnes peuvent manger avec le brasero ${modelName} ?`,
      answer: `${product.diameter && product.diameter >= 100 ? `Le ${modelName} de ${diameterStr} est idéal pour 8 à 12 personnes. Sa grande surface de cuisson permet de griller viandes, légumes et poissons pour toute la tablée.` : product.diameter && product.diameter >= 80 ? `Le ${modelName} de ${diameterStr} convient parfaitement pour 4 à 8 personnes. Une taille idéale pour les repas en famille ou entre amis.` : `Le ${modelName} de ${diameterStr} est parfait pour 2 à 4 personnes. Compact et pratique, il s'adapte aux petits jardins et terrasses.`}`,
    },
    {
      question: `Le ${modelName} est-il livré monté ?`,
      answer: `Oui, le ${modelName} est livré entièrement assemblé et prêt à l'emploi. La grille et la plancha sont incluses. L'emballage renforcé (carton double cannelure, mousse haute densité) garantit une livraison en parfait état. Livraison sous 5 à 10 jours ouvrés en France.`,
    },
    {
      question: `Quelle est la garantie du brasero ${modelName} ?`,
      answer: `Le ${modelName} bénéficie d'une garantie fabricant de 2 ans couvrant tous les défauts de fabrication. Notre SAV est joignable par téléphone et email pour toute question. Nous proposons également des pièces détachées si nécessaire.`,
    },
  ];
}

function generateFendeurFAQ(product: Product): Array<{ question: string; answer: string }> {
  return [
    {
      question: `Comment fonctionne le fendeur à bûches ${product.name} ?`,
      answer: `Le ${product.name} est un fendeur manuel simple et efficace. Placez votre bûche sur le support, puis utilisez la force de frappe pour la fendre en deux. Sa conception robuste en acier permet de fendre des bûches jusqu'à 40 cm de diamètre en toute sécurité.`,
    },
    {
      question: `Le fendeur ${product.name} est-il sécurisé ?`,
      answer: `Oui, le ${product.name} est conçu avec la sécurité comme priorité. Sa base stable empêche tout basculement et son système de guidage assure une coupe droite à chaque frappe. Beaucoup plus sûr qu'une hache traditionnelle.`,
    },
    {
      question: `Quelle est la garantie du fendeur ${product.name} ?`,
      answer: `Le ${product.name} est garanti 2 ans par notre atelier de Moncoutant. Cette garantie couvre tous les défauts de fabrication. En cas de problème, notre SAV est à votre disposition.`,
    },
  ];
}

function generateAccessoireFAQ(product: Product): Array<{ question: string; answer: string }> {
  return [
    {
      question: `${product.name} est-il compatible avec tous les braseros Atelier LBF ?`,
      answer: `Oui, ${product.name} est conçu pour être compatible avec l'ensemble de notre gamme de braseros (Le Morris, Le Fermier, L'Obélix) dans toutes les tailles (50 cm, 80 cm, 100 cm).`,
    },
    {
      question: `Quelle est la garantie sur ${product.name} ?`,
      answer: `${product.name} bénéficie de la même garantie fabricant de 2 ans que tous nos produits. Fabriqué en France dans notre atelier de Moncoutant.`,
    },
  ];
}

// ── Mots-clés SEO par produit ──────────────────────────────────────────────

function generateBraseroKeywords(product: Product): string[] {
  const { material } = detectFinish(product);
  const modelName = product.name.toLowerCase();
  const diameterStr = product.diameter ? `${product.diameter}cm` : "";

  const keywords = [
    product.name,
    `brasero ${modelName}`,
    "brasero artisanal",
    "brasero rond",
    "brasero français",
    "brasero made in France",
    "brasero barbecue plancha",
    "brasero multifonction",
    "brasero cuisson",
    "brasero chauffage extérieur",
    "brasero jardin",
    "brasero terrasse",
  ];

  if (material === "corten") {
    keywords.push("brasero corten", "brasero acier corten", "brasero rouille");
  } else if (material === "peint") {
    keywords.push("brasero acier peint", "brasero noir");
  } else {
    keywords.push("brasero acier", "brasero acier brut");
  }

  if (diameterStr) {
    keywords.push(`brasero ${diameterStr}`, `grand brasero`, `brasero ${product.diameter && product.diameter >= 100 ? "grande taille" : product.diameter && product.diameter >= 80 ? "moyen" : "petit"}`);
  }

  keywords.push("Atelier LBF");
  return keywords;
}

function generateFendeurKeywords(product: Product): string[] {
  return [
    product.name,
    "fendeur à bûches",
    "fendeur bois",
    "fendeur manuel",
    "fendeur bûches français",
    "fendeur bois de chauffage",
    "couper bûches",
    "fendeur artisanal",
    "fendeur made in France",
    "Atelier LBF",
  ];
}

function generateAccessoireKeywords(product: Product): string[] {
  const name = product.name.toLowerCase();
  const keywords = [
    product.name,
    "accessoire brasero",
    "accessoire cuisson brasero",
  ];

  if (name.includes("pique")) keywords.push("pique brasero", "tisonnier brasero", "outil feu");
  if (name.includes("spatule")) keywords.push("spatule plancha", "spatule barbecue", "spatule brasero");
  if (name.includes("plancha") || name.includes("découper") || name.includes("acajou")) keywords.push("planche à découper acajou", "planche bois brasero", "planche présentation");
  if (name.includes("kit") || name.includes("ustensile")) keywords.push("kit ustensiles brasero", "set barbecue", "kit cuisson brasero");

  keywords.push("Atelier LBF", "made in France");
  return keywords;
}

// ── Fonction principale — point d'entrée ───────────────────────────────────

export function generateProductSEO(product: Product): ProductSEO {
  switch (product.category) {
    case "brasero":
      return {
        description: generateBraseroDescription(product),
        faq: generateBraseroFAQ(product),
        keywords: generateBraseroKeywords(product),
      };
    case "fendeur":
      return {
        description: generateFendeurDescription(product),
        faq: generateFendeurFAQ(product),
        keywords: generateFendeurKeywords(product),
      };
    case "accessoire":
    case "range-buches":
    default:
      return {
        description: generateAccessoireDescription(product),
        faq: generateAccessoireFAQ(product),
        keywords: generateAccessoireKeywords(product),
      };
  }
}

// ── Meta title/description optimisés ───────────────────────────────────────

export function generateProductMetaTitle(product: Product): string {
  const { materialLabel } = detectFinish(product);
  const diameterStr = product.diameter ? ` ${product.diameter}cm` : "";

  switch (product.category) {
    case "brasero":
      return `${product.name} | Brasero rond artisanal ${materialLabel}${diameterStr} | Barbecue & Plancha | Atelier LBF`;
    case "fendeur":
      return `${product.name} | Fendeur à bûches artisanal Made in France | Atelier LBF`;
    case "accessoire":
    case "range-buches":
    default:
      return `${product.name} | Accessoire brasero artisanal | Atelier LBF`;
  }
}

export function generateProductMetaDescription(product: Product): string {
  const { materialLabel, planchaLabel } = detectFinish(product);
  const diameterStr = product.diameter ? `${product.diameter}cm` : "";

  switch (product.category) {
    case "brasero":
      return `${product.name} : brasero rond artisanal ${materialLabel} de ${diameterStr}, ${planchaLabel} amovible et grille incluse. Fabriqué à la main en France. À partir de ${product.price}€. Garantie 2 ans, livraison soignée.`;
    case "fendeur":
      return `${product.name} : fendeur à bûches robuste et sécurisé, fabriqué artisanalement en France. ${product.price}€. Garantie 2 ans, livraison France.`;
    case "accessoire":
    case "range-buches":
    default:
      return `${product.name} : accessoire artisanal pour brasero, fabriqué en France. ${product.price}€. Compatible avec tous nos braseros. Garantie 2 ans.`;
  }
}
