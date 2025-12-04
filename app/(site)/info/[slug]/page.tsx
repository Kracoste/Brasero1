import { notFound } from "next/navigation";

type PageConfig = {
  title: string;
  description: string;
};

const pages: Record<string, PageConfig> = {
  "service-clientele": {
    title: "Service à la clientèle",
    description: "Retrouvez ici toutes les informations pour échanger avec notre équipe et suivre vos commandes.",
  },
  commander: {
    title: "Commander",
    description: "Comment passer commande sur notre site, du panier à la confirmation.",
  },
  paiement: {
    title: "Paiement",
    description: "Moyens de paiement acceptés, sécurité des transactions et facturation.",
  },
  expedition: {
    title: "Expédition",
    description: "Délais, transporteurs et suivi de livraison pour vos braséros et accessoires.",
  },
  retourner: {
    title: "Retourner",
    description: "Procédure de retour et conditions pour un remboursement ou un échange.",
  },
  "confidentialite-politique": {
    title: "Confidentialité & Politique",
    description: "Traitement de vos données personnelles et respect de votre vie privée.",
  },
  contact: {
    title: "Contact",
    description: "Toutes les façons de nous joindre : email, téléphone, formulaire.",
  },
  faq: {
    title: "Questions fréquemment posées",
    description: "Les réponses aux questions les plus courantes sur nos produits et services.",
  },
  "black-friday": {
    title: "Black Friday",
    description: "Nos offres spéciales Black Friday sur les braséros et accessoires.",
  },
  "braseros-bols-feu": {
    title: "Braseros bols de feu",
    description: "Notre sélection de braséros bols pour vos moments extérieurs.",
  },
  "braseros-exterieurs": {
    title: "Braseros extérieurs",
    description: "Tous nos braséros adaptés à une utilisation en extérieur.",
  },
  "chauffages-terrasse": {
    title: "Chauffages de terrasse",
    description: "Solutions de chauffage pour prolonger vos soirées sur la terrasse.",
  },
  "tables-brasero": {
    title: "Tables brasero",
    description: "Braséros intégrés dans des tables pour partager et cuisiner.",
  },
  "cheminees-jardin": {
    title: "Cheminées de jardin",
    description: "Cheminées extérieures pour créer une ambiance chaleureuse.",
  },
  "cheminees-electriques": {
    title: "Cheminées électriques",
    description: "Cheminées électriques décoratives et pratiques.",
  },
  barbecues: {
    title: "Barbecues",
    description: "Barbecues sélectionnés pour compléter vos braséros.",
  },
  accessoires: {
    title: "Accessoires",
    description: "Tous les accessoires compatibles avec nos braséros.",
  },
  ofyr: {
    title: "OFYR",
    description: "Découvrez la marque OFYR et ses produits phares.",
  },
  bonfeu: {
    title: "BonFeu",
    description: "Tout savoir sur la marque BonFeu.",
  },
  dimplex: {
    title: "Dimplex",
    description: "Les solutions chauffantes Dimplex pour l’extérieur.",
  },
  moodz: {
    title: "MOODZ",
    description: "La gamme MOODZ et ses braséros design.",
  },
  "toutes-les-marques": {
    title: "Toutes les marques",
    description: "Vue d’ensemble des marques proposées sur notre boutique.",
  },
  "commande-affaires": {
    title: "Commande d'affaires",
    description: "Services dédiés aux professionnels et commandes en volume.",
  },
  "produits-sur-mesure": {
    title: "Produits sur mesure",
    description: "Accompagnement pour vos projets braséros personnalisés.",
  },
  "cheque-cadeau": {
    title: "Chèque-cadeau",
    description: "Offrez un braséro ou un accessoire avec nos chèques-cadeaux.",
  },
  "a-propos-de-nous": {
    title: "À propos de nous",
    description: "L’histoire de Brasero Atelier et notre savoir-faire.",
  },
  "heures-douverture": {
    title: "Heures d'ouverture",
    description: "Nos horaires pour nous joindre ou visiter l’atelier.",
  },
  "donnees-entreprise-contact": {
    title: "Données sur l'entreprise et contact",
    description: "Informations légales et coordonnées complètes.",
  },
  "bulletin-information": {
    title: "Bulletin d'information",
    description: "Inscription et informations sur notre newsletter.",
  },
  "astuces-conseils": {
    title: "Astuces et conseils",
    description: "Guides pratiques pour entretenir et profiter de vos braséros.",
  },
  blog: {
    title: "Blog",
    description: "Actualités, inspirations et projets autour du feu.",
  },
};

export default function InfoPage({ params }: { params: { slug: string } }) {
  const page = pages[params.slug];

  if (!page) {
    return notFound();
  }

  return (
    <main className="bg-white text-gray-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
        <p className="text-base text-gray-700">{page.description}</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
          Contenu détaillé à venir. Si vous avez une question précise, contactez-nous : contact@braseroatelier.fr
        </div>
      </div>
    </main>
  );
}
