/**
 * Base de connaissances FAQ du chatbot Atelier LBF
 * Réponses pré-écrites organisées par catégorie
 */

export type FaqEntry = {
  keywords: string[];
  question: string;
  answer: string;
  category: string;
};

export type ProductRecommendation = {
  slug: string;
  reason: string;
};

export const FAQ_ENTRIES: FaqEntry[] = [
  // ─── LIVRAISON ───
  {
    keywords: ['livraison', 'livrer', 'délai', 'expédition', 'envoi', 'recevoir', 'combien de temps', 'quand', 'expedition'],
    question: 'Quels sont les délais de livraison ?',
    answer: 'Nos braseros sont fabriqués artisanalement à la commande. Comptez **2 à 4 semaines** au total (fabrication et livraison incluses) pour la France métropolitaine, et **3 à 5 semaines** pour la Belgique, le Luxembourg, la Suisse et l\'Allemagne. Vous recevrez un email de suivi dès l\'expédition.',
    category: 'livraison',
  },
  {
    keywords: ['frais de livraison', 'prix livraison', 'cout livraison', 'coût livraison', 'gratuit', 'frais de port', 'port'],
    question: 'La livraison est-elle gratuite ?',
    answer: 'La **livraison est offerte** sur l\'ensemble de nos braseros en France métropolitaine. Pour les accessoires seuls, les frais de port sont calculés en fonction du poids.',
    category: 'livraison',
  },
  {
    keywords: ['suivi', 'tracking', 'suivre', 'colis', 'où en est'],
    question: 'Comment suivre ma commande ?',
    answer: 'Dès l\'expédition de votre commande, vous recevrez un **email avec le numéro de suivi** du transporteur. Vous pouvez également suivre votre commande depuis votre espace client sur notre site.',
    category: 'livraison',
  },
  {
    keywords: ['international', 'étranger', 'belgique', 'suisse', 'europe', 'hors france'],
    question: 'Livrez-vous à l\'étranger ?',
    answer: 'Nous livrons principalement en **France métropolitaine**. Pour une livraison en Belgique, Suisse ou ailleurs en Europe, contactez-nous par email à atelier-lbf@outlook.fr pour un devis personnalisé.',
    category: 'livraison',
  },

  // ─── GARANTIE & SAV ───
  {
    keywords: ['garantie', 'garanti', 'ans', 'durée garantie', 'sav'],
    question: 'Quelle est la garantie sur les braseros ?',
    answer: 'Tous nos braseros bénéficient d\'une **garantie de 2 ans** couvrant les défauts de fabrication. L\'acier corten développe naturellement une patine de rouille protectrice, ce n\'est pas un défaut mais une caractéristique recherchée.',
    category: 'garantie',
  },
  {
    keywords: ['retour', 'rembours', 'renvoyer', 'échanger', 'échange', 'rétractation', 'retractation'],
    question: 'Puis-je retourner mon brasero ?',
    answer: 'Vous disposez d\'un **droit de rétractation de 14 jours** après réception. Le produit doit être retourné dans son emballage d\'origine, non utilisé. Les frais de retour sont à votre charge en raison du poids et de la taille des braseros. Contactez-nous à atelier-lbf@outlook.fr pour organiser le retour.',
    category: 'garantie',
  },

  // ─── ENTRETIEN ───
  {
    keywords: ['entretien', 'entretenir', 'nettoyer', 'nettoyage', 'rouille', 'oxydation', 'patine', 'protéger'],
    question: 'Comment entretenir mon brasero ?',
    answer: 'L\'entretien dépend du matériau :\n\n• **Acier peint** : nettoyez avec un chiffon humide après refroidissement. Évitez les produits abrasifs. La peinture haute température protège l\'acier.\n• **Acier corten** : aucun entretien nécessaire ! La patine de rouille se forme naturellement et **protège l\'acier**. C\'est un matériau auto-protecteur.\n\nPour la **plancha** : nettoyez-la à chaud avec une spatule et un peu d\'eau. Huilez légèrement après chaque utilisation.',
    category: 'entretien',
  },
  {
    keywords: ['corten', 'rouille', 'oxyd', 'patine', 'couleur'],
    question: 'Le corten va-t-il rouiller ?',
    answer: 'Oui, et c\'est normal ! L\'**acier corten** développe une **patine de rouille protectrice** au fil des semaines. Cette couche d\'oxyde empêche la corrosion de pénétrer plus en profondeur. La couleur évolue du orange vif vers un brun profond. C\'est un matériau utilisé en architecture et en art pour sa beauté naturelle.',
    category: 'entretien',
  },
  {
    keywords: ['plancha', 'cuisson', 'griller', 'cuisiner', 'inox', 'acier carbone'],
    question: 'Comment utiliser la plancha ?',
    answer: 'Nos planchas se posent directement sur le brasero :\n\n1. **Allumez le feu** et laissez chauffer 15-20 min\n2. **Huilez légèrement** la surface de cuisson\n3. **Cuisinez** viandes, poissons, légumes comme sur une plancha classique\n4. **Nettoyez à chaud** avec une spatule\n\n• La **plancha acier carbone** chauffe vite et culotte avec le temps\n• La **plancha inox** (Morris) est plus facile à nettoyer et ne rouille pas',
    category: 'entretien',
  },

  // ─── PAIEMENT ───
  {
    keywords: ['paiement', 'payer', 'cb', 'carte', 'virement', 'paypal', 'moyen de paiement'],
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'Nous acceptons les **cartes bancaires** (Visa, Mastercard, CB) via notre plateforme sécurisée **Stripe**. Le paiement est 100% sécurisé avec chiffrement SSL.',
    category: 'paiement',
  },
  {
    keywords: ['plusieurs fois', 'facilité', 'échelonné', 'mensualité', '3 fois', '4 fois', '3x', '4x'],
    question: 'Puis-je payer en plusieurs fois ?',
    answer: 'Actuellement, nous ne proposons pas le paiement en plusieurs fois. Le règlement s\'effectue **en une seule fois** par carte bancaire au moment de la commande.',
    category: 'paiement',
  },

  // ─── FABRICATION ───
  {
    keywords: ['fabrication', 'fabriqué', 'made in france', 'artisan', 'atelier', 'français', 'france', 'où'],
    question: 'Où sont fabriqués vos braseros ?',
    answer: 'Tous nos braseros sont **fabriqués artisanalement en France**, dans notre atelier. Chaque pièce est découpée, soudée et assemblée à la main par nos artisans. C\'est du **100% Made in France**, de la matière première à l\'expédition.',
    category: 'fabrication',
  },
  {
    keywords: ['acier', 'matière', 'matériau', 'épaisseur', 'qualité', 'résistance', 'solide'],
    question: 'Quel acier utilisez-vous ?',
    answer: 'Nous utilisons de l\'**acier de forte épaisseur** (3 à 10mm selon les modèles) pour garantir une durabilité exceptionnelle :\n\n• **Acier peint** haute température (Obélix, Coffy, Morris)\n• **Acier corten** auto-patiné (Fermier, Fendeur)\n• **Plancha inox 10mm** sur le Morris pour une cuisson premium\n\nCes épaisseurs sont bien supérieures aux braseros industriels classiques.',
    category: 'fabrication',
  },

  // ─── CHOIX DU MODÈLE ───
  {
    keywords: ['quel brasero', 'choisir', 'conseil', 'recommand', 'lequel', 'différence', 'comparaison', 'comparer', 'aide', 'besoin'],
    question: 'Quel brasero choisir ?',
    answer: 'Voici un guide rapide selon vos besoins :\n\n🔥 **L\'Obélix** — Le plus pratique, avec son socle carré range-bûches intégré. Idéal si vous voulez un brasero fonctionnel. À partir de 850€.\n\n🔥 **Le Coffy** — Le plus design, avec son tripode élégant. Parfait pour une terrasse moderne. À partir de 850€.\n\n🔥 **Le Morris** — Le premium, avec sa plancha inox 10mm double zone de cuisson. Pour les passionnés de cuisine au feu. À partir de 3200€.\n\n🔥 **Le Fermier** — L\'authentique en corten, sans entretien. Patine naturelle unique. 1550€.\n\nVous pouvez me dire combien de personnes vous recevez habituellement et votre budget, je vous orienterai !',
    category: 'choix',
  },
  {
    keywords: ['taille', 'diamètre', '50', '80', '100', 'petit', 'grand', 'combien de personnes', 'convive', 'invité'],
    question: 'Quelle taille choisir ?',
    answer: 'Le choix du diamètre dépend du nombre de convives :\n\n• **50 cm** — Idéal pour **2 à 4 personnes**, terrasse ou balcon\n• **80 cm** — Parfait pour **6 à 8 personnes**, le plus polyvalent\n• **100 cm** — Pour **10 à 15 personnes**, grandes tablées et événements\n\nLe 80 cm est notre **best-seller**, c\'est le meilleur compromis taille/prix.',
    category: 'choix',
  },
  {
    keywords: ['budget', 'prix', 'combien', 'cher', 'coût', 'tarif', 'moins cher', 'pas cher', 'entrée de gamme'],
    question: 'Quels sont vos prix ?',
    answer: 'Nos prix varient selon le modèle et la taille :\n\n• **L\'Obélix** : 850€ (50cm) · 1 400€ (80cm) · 1 850€ (100cm)\n• **Le Coffy** : 850€ (50cm) · 1 300€ (80cm) · 1 649€ (100cm)\n• **Le Morris** : 3 200€ (80cm) · 3 700€ (100cm)\n• **Le Fermier** : 1 550€ (80cm)\n• **Fendeur à bûches** : 80€\n\nTous les prix incluent la **plancha** et la **livraison offerte** en France.',
    category: 'choix',
  },

  // ─── PERSONNALISATION ───
  {
    keywords: ['personnalis', 'custom', 'graver', 'gravure', 'logo', 'texte', 'unique'],
    question: 'Puis-je personnaliser mon brasero ?',
    answer: 'Oui ! Certains de nos modèles proposent la **personnalisation** des faces du socle. Vous pouvez ajouter un texte, un logo ou une image de votre choix. Le supplément dépend du type de personnalisation. Configurez votre brasero directement sur la fiche produit.',
    category: 'personnalisation',
  },

  // ─── BOIS & UTILISATION ───
  {
    keywords: ['bois', 'bûche', 'charbon', 'combustible', 'quel bois', 'allumer', 'allumage'],
    question: 'Quel bois utiliser ?',
    answer: 'Utilisez du **bois sec** (taux d\'humidité < 20%) pour une bonne combustion :\n\n• **Recommandé** : chêne, hêtre, charme, frêne (bois durs)\n• **À éviter** : résineux (pin, sapin) qui encrassent et projettent des étincelles\n• **Jamais** : bois traité, peint ou aggloméré\n\nPour l\'allumage, utilisez du petit bois sec et des allume-feux naturels. Nos braseros fonctionnent exclusivement au **bois de chauffage**.',
    category: 'utilisation',
  },

  // ─── CONTACT ───
  {
    keywords: ['contact', 'email', 'mail', 'téléphone', 'appeler', 'joindre', 'question', 'parler'],
    question: 'Comment vous contacter ?',
    answer: 'Vous pouvez nous contacter :\n\n• **Par email** : atelier-lbf@outlook.fr\n• **Via le formulaire** de contact sur notre site\n\nNous répondons généralement sous **24 à 48h** en jours ouvrés.',
    category: 'contact',
  },

  // ─── RENSEIGNEMENTS / RAPPEL ───
  {
    keywords: ['renseignement', 'rappel', 'rappeler', 'appeler', 'plus d\'info', 'information', 'en savoir plus'],
    question: 'Souhaitez-vous plus de renseignements ?',
    answer: 'Bien sûr ! Laissez-nous votre email et votre numéro de téléphone via le formulaire ci-dessous, et nous vous recontacterons dans les plus brefs délais pour répondre à toutes vos questions.',
    category: 'contact',
  },

  // ─── ACCESSOIRES ───
  {
    keywords: ['accessoire', 'spatule', 'pique', 'ustensile', 'planche', 'découpe', 'kit'],
    question: 'Quels accessoires proposez-vous ?',
    answer: 'Nous proposons des accessoires artisanaux assortis à nos braseros :\n\n• **Spatule** — en acier forgé, idéale pour la plancha\n• **Pique à viande** — pour retourner et servir\n• **Planche à découper** — en bois d\'acajou massif\n• **Kit ustensiles** — l\'ensemble complet pour cuisiner au brasero\n\nTous nos accessoires sont manufacturés en France avec les mêmes standards de qualité.',
    category: 'accessoires',
  },
];

/**
 * Messages par défaut
 */
export const GREETING_MESSAGE = 'Bonjour ! 👋 Je suis l\'assistant de l\'**Atelier LBF**. Je peux vous renseigner sur nos braseros artisanaux, vous aider à choisir le modèle idéal, ou répondre à vos questions sur la livraison, l\'entretien et la garantie. Comment puis-je vous aider ?';

export const FALLBACK_MESSAGE = 'Je n\'ai pas trouvé de réponse précise à votre question. Voici ce que je vous suggère :\n\n• Reformulez votre question avec des mots-clés (ex: livraison, entretien, prix…)\n• Consultez notre [FAQ complète](/faq)\n• Contactez-nous à **atelier-lbf@outlook.fr**\n\nJe reste à votre disposition !';

/**
 * Recherche la meilleure réponse FAQ pour un message utilisateur
 */
export function findBestFaqMatch(userMessage: string): FaqEntry | null {
  const normalized = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  let bestMatch: FaqEntry | null = null;
  let bestScore = 0;

  for (const entry of FAQ_ENTRIES) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalized.includes(normalizedKeyword)) {
        score += normalizedKeyword.length; // Longer matches = more specific
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Require a minimum score to avoid false matches
  return bestScore >= 3 ? bestMatch : null;
}

/**
 * Détecte si l'utilisateur cherche une recommandation produit
 */
export function wantsProductRecommendation(message: string): boolean {
  const triggers = [
    'quel brasero', 'choisir', 'recommand', 'conseil', 'lequel',
    'obélix', 'obelix', 'coffy', 'morris', 'fermier',
    'voir les produits', 'catalogue', 'modèle', 'modele',
    'prix', 'tarif', 'combien coûte', 'combien coute',
    'stock', 'disponible', 'disponibilité',
    'fendeur', 'accessoire', 'spatule', 'plancha',
  ];
  const normalized = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return triggers.some(t => normalized.includes(t.normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
}
