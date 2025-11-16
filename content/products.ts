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
        src: "/brasero4.png",
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
    slug: "brasero-canyon-70",
    name: "Braséro Canyon 70",
    category: "brasero",
    price: 760,
    shortDescription: "Silhouette sculpturale et large rebord pour jouer avec les braises.",
    description:
      "Canyon 70 trouve l'équilibre parfait entre le format signature 80 et nos versions compactes. Sa vasque conique crée un tirage naturel, tandis que le plateau inférieur accueille les bûches à portée de main. Il s'intègre aussi bien sur un deck en bois que sur une terrasse minérale.",
    madeIn: "France",
    material: "Acier corten patiné",
    diameter: 70,
    thickness: 4,
    height: 40,
    weight: 40,
    warranty: "Garantie 4 ans structure",
    availability: "Assemblé à la demande (10 jours)",
    shipping: "Livraison premium avec prise de rendez-vous",
    popularScore: 76,
    badge: "Édition jardin",
    specs: {
      acier: "Corten patiné 4 mm",
      epaisseur: "4 mm",
      dimensions: "Ø 70 cm x H 40 cm",
      poids: "40 kg",
      compatibilite: "Plancha 68 cm",
    },
    highlights: [
      "Plateau bois intégré",
      "Ligne conique graphique",
      "Drainage central invisible",
    ],
    features: [
      {
        icon: "Droplet",
        title: "Drainage discret",
        description: "Soudure cachée au centre pour évacuer l'eau sans marquer la terrasse.",
      },
      {
        icon: "Layers",
        title: "Double plateau",
        description: "Rangez bûches et accessoires sur l'étage inférieur découpé au laser.",
      },
      {
        icon: "Compass",
        title: "Design radial",
        description: "Rebord incliné qui diffuse la chaleur doucement vers les convives.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
        alt: "Braséro Canyon 70 sur terrasse en bois",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
        alt: "Détail du rebord corten",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        alt: "Braséro Canyon 70 au coucher du soleil",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "Peut-on retirer le plateau inférieur ?",
        answer:
          "Oui, il est boulonné pour faciliter le nettoyage ou alléger l'ensemble lors du transport.",
      },
      {
        question: "La patine corten tache-t-elle ?",
        answer:
          "Nous stabilisons chaque pièce avant expédition. Un tapis en fibre de coco suffit si vous avez un bois très clair.",
      },
      {
        question: "Quel combustible privilégier ?",
        answer:
          "Des bûches de 25 à 30 cm permettent d'alimenter régulièrement le foyer sans dépasser du rebord.",
      },
    ],
  },
  {
    slug: "brasero-nomade-45",
    name: "Braséro Nomade 45",
    category: "brasero",
    price: 320,
    shortDescription: "Format léger avec poignée intégrée pour suivre vos escapades.",
    description:
      "Nomade 45 concentre l'esprit Brasero Atelier dans un disque de 45 cm qui se range dans votre coffre. Sa cuve double peau limite les transferts thermiques vers le sol, l'idéal pour une soirée improvisée au bord d'un lac ou dans un jardin urbain.",
    madeIn: "France",
    material: "Acier galvanisé thermolaqué",
    diameter: 45,
    thickness: 3,
    height: 28,
    weight: 16,
    warranty: "Garantie 2 ans structure",
    availability: "Expédié sous 48h",
    shipping: "Livraison express en point relais ou domicile",
    popularScore: 68,
    badge: "Nomade",
    specs: {
      acier: "Galva thermolaqué 3 mm",
      epaisseur: "3 mm",
      dimensions: "Ø 45 cm x H 28 cm",
      poids: "16 kg",
      compatibilite: "Grille pliable 42 cm",
    },
    highlights: [
      "Poignée ceinture",
      "Pieds repliables",
      "Sac de transport inclus",
    ],
    features: [
      {
        icon: "Suitcase",
        title: "Ultra portable",
        description: "Pieds rabattables et housse toile waxée pour protéger l'acier.",
      },
      {
        icon: "Thermometer",
        title: "Double peau isolante",
        description: "Préserve les revêtements fragiles et limite les traces au sol.",
      },
      {
        icon: "Bolt",
        title: "Montage express",
        description: "Deux vis papillon suffisent pour verrouiller le croisillon central.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1437623889155-075d40e2e59f?auto=format&fit=crop&w=1200&q=80",
        alt: "Braséro Nomade 45 posé sur un ponton",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        alt: "Transport du braséro Nomade dans son sac",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
        alt: "Détail de la poignée ceinture",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "Convient-il aux plages ?",
        answer:
          "Oui, la double peau isole du sable chaud. Rincez simplement la cuve après usage pour retirer le sel.",
      },
      {
        question: "Peut-on utiliser du charbon de bois ?",
        answer:
          "Oui, mais préférez un mélange bois + charbon pour préserver la montée en température homogène.",
      },
      {
        question: "Comment nettoyer la housse ?",
        answer:
          "Elle se lave à l'eau savonneuse tiède, puis laissez sécher à l'air libre avant de replier les pieds.",
      },
    ],
  },
  {
    slug: "brasero-atlas-90",
    name: "Braséro Atlas 90",
    category: "brasero",
    price: 990,
    shortDescription: "Un disque monumental avec plateau log pour scenographier vos repas.",
    description:
      "Atlas 90 associe une vasque corten de 4 mm et une base en H qui sert de range-bûches. Il est pensé pour rester dehors toute l'année et créer un point lumineux spectaculaire au centre du jardin. Sa lèvre interne double diffuse la chaleur comme un anneau inversé.",
    madeIn: "France",
    material: "Acier corten laminé",
    diameter: 90,
    thickness: 4,
    height: 44,
    weight: 55,
    warranty: "Garantie 5 ans structure",
    availability: "Délai atelier 10 jours",
    shipping: "Livraison palette sur rendez-vous",
    popularScore: 88,
    badge: "Edition signature",
    specs: {
      acier: "Corten laminé 4 mm",
      epaisseur: "4 mm",
      dimensions: "Ø 90 cm x H 44 cm",
      poids: "55 kg",
      compatibilite: "Anneau plancha 86 cm",
    },
    highlights: [
      "Anneau double feu",
      "Plateau log intégré",
      "Résiste aux embruns marins",
    ],
    features: [
      {
        icon: "ShieldCheck",
        title: "Structure blindée",
        description: "Renforts invisibles sous la vasque pour encaisser les charges lourdes.",
      },
      {
        icon: "Flame",
        title: "Lèvres concentriques",
        description: "La chaleur se répartit en deux couronnes parfaites pour la cuisson lente.",
      },
      {
        icon: "Layers",
        title: "Socle technique",
        description: "Rangements ventilés pour stocker des bûches sèches à portée de main.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1200&q=80",
        alt: "Braséro Atlas 90 et son plateau de rangement",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
        alt: "Zoom sur l'acier corten patiné du Braséro Atlas",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
        alt: "Plateau log rempli autour du feu",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "Peut-il rester dehors toute l'année ?",
        answer:
          "Oui, l'acier corten se stabilise naturellement. Évacuez simplement les cendres pour préserver la vasque.",
      },
      {
        question: "Quel bois privilégier ?",
        answer:
          "Des bûches de 33 cm bien sèches offrent la combustion la plus régulière pour alimenter les deux couronnes.",
      },
      {
        question: "Comment nettoyer le plateau inférieur ?",
        answer:
          "Il se retire grâce à deux vis moletées pour permettre un dépoussiérage complet une fois par saison.",
      },
    ],
  },
  {
    slug: "brasero-zenith-50",
    name: "Braséro Zénith 50",
    category: "brasero",
    price: 370,
    shortDescription: "Une capsule compacte avec anneau lumineux intégré.",
    description:
      "Zénith 50 concentre un foyer généreux dans un diamètre de 50 cm. Sa base ajourée cache une lumière LED rechargeable pour souligner les contours du feu les soirs d'été.",
    madeIn: "France",
    material: "Acier inox thermolaqué",
    diameter: 50,
    thickness: 3,
    height: 32,
    weight: 20,
    warranty: "Garantie 2 ans structure",
    availability: "Expédié sous 72h",
    shipping: "Livraison standard partout en France",
    popularScore: 64,
    badge: "Compact lumineux",
    specs: {
      acier: "Inox thermolaqué 3 mm",
      epaisseur: "3 mm",
      dimensions: "Ø 50 cm x H 32 cm",
      poids: "20 kg",
      compatibilite: "Grille inox 48 cm",
    },
    highlights: [
      "Base éclairée",
      "Poignées intégrées",
      "Recharge USB-C",
    ],
    features: [
      {
        icon: "Battery",
        title: "LED autonome",
        description: "Jusqu'à 12 h d'ambiance lumineuse avec intensité réglable.",
      },
      {
        icon: "Feather",
        title: "Ultra léger",
        description: "20 kg seulement pour changer d'emplacement facilement.",
      },
      {
        icon: "Sun",
        title: "Finition satinée",
        description: "Thermolaquage texturé résistant aux traces de doigts.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
        alt: "Braséro Zénith 50 allumé sur une terrasse",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
        alt: "Détail de l'anneau lumineux du Zénith 50",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "La LED supporte-t-elle la chaleur ?",
        answer:
          "Oui, l'éclairage est isolé par une double paroi et reste froid. Il se recharge via USB-C.",
      },
      {
        question: "Peut-on couper la lumière ?",
        answer:
          "Bien sûr, l'interrupteur discret à l'arrière permet de l'allumer uniquement quand vous le souhaitez.",
      },
      {
        question: "Convient-il aux balcons ?",
        answer:
          "Avec son diamètre de 50 cm et ses pieds isolants, il respecte les surfaces sensibles.",
      },
    ],
  },
  {
    slug: "brasero-dune-75",
    name: "Braséro Dune 75",
    category: "brasero",
    price: 680,
    shortDescription: "Inspiration désertique avec courbes asymétriques.",
    description:
      "Dune 75 présente une silhouette asymétrique rappelant une dune sculptée par le vent. Sa cuve profonde canalise les braises au centre, idéale pour les longues veillées.",
    madeIn: "France",
    material: "Acier corten patiné",
    diameter: 75,
    thickness: 4,
    height: 48,
    weight: 44,
    warranty: "Garantie 4 ans structure",
    availability: "Assemblé puis livré en 8 jours",
    shipping: "Transport spécialisé avec suivi",
    popularScore: 74,
    badge: "Edition désert",
    specs: {
      acier: "Corten patiné 4 mm",
      epaisseur: "4 mm",
      dimensions: "Ø 75 cm x H 48 cm",
      poids: "44 kg",
      compatibilite: "Cloche coupe-vent 70 cm",
    },
    highlights: [
      "Cuve asymétrique",
      "Pare-étincelles intégré",
      "Base pivotante",
    ],
    features: [
      {
        icon: "Wind",
        title: "Pare-étincelles discret",
        description: "Lame inox affleurante qui canalise les projections même par vent léger.",
      },
      {
        icon: "Compass",
        title: "Base pivotante",
        description: "Tournez la Dune pour orienter la flamme vers vos convives.",
      },
      {
        icon: "Sparkles",
        title: "Patine évolutive",
        description: "Chaque pièce développe une teinte unique au fil des saisons.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        alt: "Braséro Dune 75 au crépuscule",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
        alt: "Courbes asymétriques de la Dune 75",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "Est-elle stable malgré la forme asymétrique ?",
        answer:
          "Oui, la base pivotante comporte trois points d'ancrage larges qui maintiennent l'ensemble.",
      },
      {
        question: "Peut-on ajouter une grille ?",
        answer:
          "Nous proposons une grille en demi-lune qui se fixe sur la lèvre la plus haute.",
      },
      {
        question: "La patine tache-t-elle ?",
        answer:
          "Comme tout corten, quelques pigments peuvent ruisseler les premiers mois. Utilisez le plateau fourni si nécessaire.",
      },
    ],
  },
  {
    slug: "brasero-lumina-65",
    name: "Braséro Lumina 65",
    category: "brasero",
    price: 540,
    shortDescription: "Format vertical avec niches pour bougies et accessoires.",
    description:
      "Lumina 65 allie une vasque de 65 cm et un fût perforé accueillant des photophores. L'effet est magique : les flammes se reflètent sur les perforations et doublent la lumière autour du feu.",
    madeIn: "France",
    material: "Acier brut verni",
    diameter: 65,
    thickness: 3,
    height: 70,
    weight: 36,
    warranty: "Garantie 3 ans structure",
    availability: "Production 5 jours ouvrés",
    shipping: "Livraison standard avec tracking",
    popularScore: 71,
    badge: "Illumination",
    specs: {
      acier: "Acier brut verni 3 mm",
      epaisseur: "3 mm",
      dimensions: "Ø 65 cm x H 70 cm",
      poids: "36 kg",
      compatibilite: "Grille suspendue 60 cm",
    },
    highlights: [
      "Fût perforé lumineux",
      "Niches accessoires",
      "Rebord anti-coulure",
    ],
    features: [
      {
        icon: "Lightbulb",
        title: "Jeu d'ombres",
        description: "Perforations coniques créant une constellation tout autour du foyer.",
      },
      {
        icon: "Box",
        title: "Rangements latéraux",
        description: "Rangez allume-feu, bougies et verres dans les niches dédiées.",
      },
      {
        icon: "Droplet",
        title: "Rebord canalisation",
        description: "Un discret retour évacue les jus de cuisson et protège la base.",
      },
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
        alt: "Braséro Lumina 65 avec niches éclairées",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
      {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        alt: "Détail des perforations lumineuses",
        width: 1200,
        height: 900,
        blurDataURL: blurPlaceholder,
      },
    ],
    location: moncoutant,
    faq: [
      {
        question: "Les niches chauffent-elles ?",
        answer:
          "Elles restent tièdes grâce à une double cloison isolante, idéales pour les bougies ou accessoires.",
      },
      {
        question: "Peut-on fixer Lumina au sol ?",
        answer:
          "Oui, trois perçages sont dissimulés à la base pour une fixation permanente.",
      },
      {
        question: "Quel entretien prévoir ?",
        answer:
          "Essuyez le vernis avec un chiffon microfibre et graissez légèrement la vasque tous les débuts de saison.",
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
        src: "/fendeur.png",
        alt: "Fendeur à bûches sur billot",
        width: 900,
        height: 1600,
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
