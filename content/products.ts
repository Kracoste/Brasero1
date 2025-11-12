import { productSchema, type Product } from "@/lib/schema";

const blurPlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HwAFhAIKpGZo8QAAAABJRU5ErkJggg==";

const moncoutant = {
  city: "Moncoutant",
  dept: "Deux-Sèvres",
  lat: 46.6479,
  lng: -0.6342,
} as const;

const rawProducts: Product[] = [
  {
    slug: "brasero-signature-80",
    name: "Braséro Signature 80",
    category: "brasero",
    price: 890,
    shortDescription: "La pièce maîtresse pour les grandes tablées en extérieur.",
    description:
      "Le Braséro Signature 80 offre un large foyer pour cuisiner, se réchauffer et créer un point focal convivial dans votre jardin. Forgé dans notre atelier de Moncoutant, il combine acier corten 4 mm et lignes épurées pour résister aux hivers les plus rudes.",
    madeIn: "France",
    material: "Acier corten HLE",
    diameter: 80,
    thickness: 4,
    height: 42,
    weight: 48,
    warranty: "Garantie 5 ans structure",
    availability: "Expédition sous 7 jours ouvrés",
    shipping: "Livraison suivie partout en France métropolitaine",
    popularScore: 95,
    badge: "Best-seller atelier",
    specs: {
      acier: "Corten HLE 4 mm",
      epaisseur: "4 mm",
      dimensions: "Ø 80 cm x H 42 cm",
      poids: "48 kg",
    },
    highlights: [
      "Résiste naturellement à la corrosion",
      "Bord chanfreiné sécurisant",
      "Vasque soudée à la main",
    ],
    features: [
      {
        icon: "Flame",
        title: "Diffusion homogène",
        description: "Bord incliné pour une restitution douce de la chaleur.",
      },
      {
        icon: "ShieldCheck",
        title: "Acier certifié",
        description: "Traçabilité complète de nos plaques corten européennes.",
      },
      {
        icon: "Leaf",
        title: "Usages responsables",
        description: "Compatible cuisson plancha et bois issu de forêts locales.",
      },
    ],
    images: [
      {
        src: "/LBF1.png",
        alt: "Braséro Signature 80 en situation nocturne",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        alt: "Détail d'acier corten braséro",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
        alt: "Moment convivial autour du feu",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "Comment entretenir l'acier corten ?",
        answer:
          "Une fine couche de rouille protectrice se forme naturellement. Évitez simplement l'eau stagnante et brossez légèrement chaque saison.",
      },
      {
        question: "Peut-on cuisiner directement dessus ?",
        answer:
          "Oui, il suffit d'ajouter notre anneau plancha (option) ou une grille en inox. L'acier corten supporte des températures élevées.",
      },
      {
        question: "Quelle quantité de bois prévoir ?",
        answer:
          "Un rechargement toutes les 45 minutes avec des bûches de 33 cm suffit pour maintenir un foyer généreux.",
      },
    ],
  },
  {
    slug: "brasero-horizon-60",
    name: "Braséro Horizon 60",
    category: "brasero",
    price: 590,
    shortDescription: "Compact et léger, idéal pour les terrasses urbaines.",
    description:
      "Horizon 60 condense l'expertise Brasero Atelier dans un format plus accessible. Son pied tulipe permet une circulation d'air optimale et limite les traces au sol.",
    madeIn: "France",
    material: "Acier corten HLE",
    diameter: 60,
    thickness: 3,
    height: 38,
    weight: 32,
    warranty: "Garantie 3 ans structure",
    availability: "Disponible immédiatement",
    shipping: "Livraison Express sous 72h",
    popularScore: 82,
    badge: "Edition terrasse",
    specs: {
      acier: "Corten HLE 3 mm",
      epaisseur: "3 mm",
      dimensions: "Ø 60 cm x H 38 cm",
      poids: "32 kg",
      compatibilite: "Anneau plancha 58 cm",
    },
    highlights: [
      "Pied ventilé anti-traces",
      "Idéal pour 6 à 8 convives",
      "Accessoire plancha disponible",
    ],
    features: [
      {
        icon: "Wind",
        title: "Tirage maîtrisé",
        description: "Grilles d'aération découpées au laser pour une combustion propre.",
      },
      {
        icon: "Sun",
        title: "Finition satinée",
        description: "Patine stabilisée en atelier pour un rendu uniforme.",
      },
      {
        icon: "Wrench",
        title: "Montage instantané",
        description: "Reçu soudé, aucun assemblage requis.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1200&q=80",
        alt: "Braséro Horizon 60 sur terrasse bois",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
        alt: "Détail du pied ventilé du braséro",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "Convient-il aux petits espaces ?",
        answer:
          "Oui, avec 60 cm de diamètre et un poids contenu il se déplace aisément et respecte les balcons grâce à son pied ventilé.",
      },
      {
        question: "Quelle est la durée de chauffe moyenne ?",
        answer:
          "Comptez 30 minutes pour atteindre la pleine braise, puis un ajout de deux bûches toutes les 40 minutes.",
      },
      {
        question: "Quel accessoire recommandez-vous ?",
        answer:
          "L'anneau plancha 58 cm pour saisir légumes et pièces de viande tout autour de la flamme.",
      },
    ],
  },
  {
    slug: "brasero-origine-100",
    name: "Braséro Origine 100",
    category: "brasero",
    price: 1290,
    shortDescription: "Format spectaculaire pour les événements et tables XL.",
    description:
      "Origine 100 est conçu pour les chefs de plein air : large diamètre, vasque profonde et rigole périphérique pour canaliser les jus de cuisson. C'est notre modèle le plus imposant, souvent choisi par les gîtes et restaurants.",
    madeIn: "France",
    material: "Acier corten premium",
    diameter: 100,
    thickness: 5,
    height: 45,
    weight: 62,
    warranty: "Garantie 5 ans structure",
    availability: "Fabrication à la commande (2 semaines)",
    shipping: "Livraison palette sur RDV",
    popularScore: 78,
    badge: "Format pro",
    specs: {
      acier: "Corten premium 5 mm",
      epaisseur: "5 mm",
      dimensions: "Ø 100 cm x H 45 cm",
      poids: "62 kg",
      compatibilite: "Anneau plancha 95 cm",
    },
    highlights: [
      "Rigole anti-retombées",
      "Haute inertie thermique",
      "Planche à découper intégrée (option)",
    ],
    features: [
      {
        icon: "Sparkles",
        title: "Lignes sculpturales",
        description: "Bord biseauté pour sublimer la flamme sur 360°.",
      },
      {
        icon: "ChefHat",
        title: "Pensé pour cuisiner",
        description: "Compatible grille inox XXL et accessoires gastronomiques.",
      },
      {
        icon: "Factory",
        title: "Atelier Moncoutant",
        description: "Assemblé et contrôlé à la main, chaque pièce est numérotée.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
        alt: "Braséro Origine 100 en jardin contemporain",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1200&q=80",
        alt: "Service plancha sur grand braséro",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        alt: "Détail acier corten patiné",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "Peut-on l'encastrer ?",
        answer:
          "Oui, Origine 100 peut être semi-encastré dans une terrasse en prévoyant une dalle béton 70x70 cm ventilée.",
      },
      {
        question: "Quel est le délai réel ?",
        answer:
          "Deux semaines fabrication + livraison palette sur créneau confirmé avec notre transporteur premium.",
      },
      {
        question: "Fournissez-vous une couverture ?",
        answer:
          "Une plaque d'acier galvanisé est proposée en option pour protéger la vasque lorsqu'elle n'est pas utilisée.",
      },
    ],
  },
  {
    slug: "brasero-compact-55",
    name: "Braséro Compact 55",
    category: "brasero",
    price: 420,
    shortDescription: "Le compagnon des balcons et petites terrasses.",
    description:
      "Compact 55 offre la même qualité d'acier que nos grands modèles mais dans un format léger de 24 kg. Idéal pour profiter d'un feu maîtrisé même dans les espaces réduits.",
    madeIn: "France",
    material: "Acier brut thermolaqué",
    diameter: 55,
    thickness: 3,
    height: 35,
    weight: 24,
    warranty: "Garantie 2 ans structure",
    availability: "En stock",
    shipping: "Livraison standard 4 à 5 jours",
    popularScore: 70,
    badge: "Nouveauté",
    specs: {
      acier: "Acier brut thermolaqué",
      epaisseur: "3 mm",
      dimensions: "Ø 55 cm x H 35 cm",
      poids: "24 kg",
      compatibilite: "Grille inox 50 cm",
    },
    highlights: [
      "Dessous ventilé",
      "Capot anti-pluie inclus",
      "Pieds réglables",
    ],
    features: [
      {
        icon: "Feather",
        title: "Ultra maniable",
        description: "Poignées discrètes intégrées pour le déplacer à froid.",
      },
      {
        icon: "Droplet",
        title: "Protection pluie",
        description: "Capot assorti fourni pour préserver la cuve.",
      },
      {
        icon: "Target",
        title: "Chaleur concentrée",
        description: "Vasque plus profonde pour un feu vif et rapide.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
        alt: "Braséro Compact 55 dans un patio",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1200&q=80",
        alt: "Détail poignée braséro",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
        alt: "Feu de bois sur balcon",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "Quelle surface minimale recommandez-vous ?",
        answer:
          "Un espace extérieur ventilé de 6 m² suffit, en respectant la réglementation locale de votre copropriété.",
      },
      {
        question: "Peut-on utiliser du charbon ?",
        answer:
          "Oui, l'acier thermolaqué résiste à la montée en température mais évitez l'alcool à brûler.",
      },
      {
        question: "Comment le stocker ?",
        answer:
          "Utilisez le capot fourni et, si possible, abritez-le sous un auvent pendant l'hiver.",
      },
    ],
  },
  {
    slug: "fendeur-buches-atelier",
    name: "Fendeur à bûches Atelier",
    category: "accessoire",
    price: 270,
    shortDescription: "Préparez vos bûches en toute sécurité, sans effort.",
    description:
      "Conçu pour accompagner nos braséros, ce fendeur manuel stabilise les bûches et multiplie votre force sans recourir à un outil motorisé. Acier 6 mm, lame trempée et anneaux de maintien garantissent une coupe précise.",
    madeIn: "France",
    material: "Acier brut thermolaqué",
    diameter: 0,
    thickness: 6,
    height: 62,
    weight: 18,
    warranty: "Garantie 3 ans",
    availability: "En stock",
    shipping: "Livraison suivie sous 4 jours",
    popularScore: 60,
    badge: "Atelier Moncoutant",
    specs: {
      acier: "Acier structuré 6 mm",
      epaisseur: "6 mm",
      dimensions: "H 62 cm x L 30 cm",
      poids: "18 kg",
      compatibilite: "Bûches jusqu'à 40 cm",
    },
    highlights: [
      "Sécurité accrue",
      "Aiguisage offert la première année",
      "Patins anti-vibrations",
    ],
    features: [
      {
        icon: "Axe",
        title: "Force démultipliée",
        description: "Bras de levier optimisé pour fendre sans effort excessif.",
      },
      {
        icon: "Shield",
        title: "Stabilité max",
        description: "Anneau de maintien empêchant la bûche de rebondir.",
      },
      {
        icon: "Box",
        title: "Transport facile",
        description: "Poignées latérales équilibrées pour le ranger après usage.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
        alt: "Fendeur manuel dans un atelier bois",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
        alt: "Détail de la lame trempée",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1200&q=80",
        alt: "Poignée de transport du fendeur",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "Quels bois peut-on fendre ?",
        answer:
          "Tous les bois secs jusqu'à 40 cm de hauteur. Pour le chêne très noueux, réalisez deux passes.",
      },
      {
        question: "La lame peut-elle être remplacée ?",
        answer:
          "Oui, elle est démontable et nous proposons un kit de remplacement depuis l'atelier.",
      },
      {
        question: "Faut-il l'ancrer au sol ?",
        answer:
          "Ce n'est pas obligatoire mais des perçages sont prévus pour fixer l'outil sur un billot si besoin.",
      },
    ],
  },
];

export const products = rawProducts.map((product) => productSchema.parse(product));

export const braseros = products.filter((product) => product.category === "brasero");

export const featuredProduct = products.find((product) => product.slug === "brasero-signature-80")!;
