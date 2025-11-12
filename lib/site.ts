export const siteConfig = {
  name: "Brasero Atelier",
  description:
    "Braseros premium fabriqués à Moncoutant (Deux-Sèvres). Acier corten, finitions haute couture et service client réactif.",
  url: "https://brasero-atelier.fr",
  ogImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  email: "atelier@brasero.fr",
  phone: "+33 5 49 00 00 00",
  address: "Rue du Moulin, 79320 Moncoutant-sur-Sèvre",
  schedules: [
    "Lun. – Ven. : 9h00 – 18h30",
    "Samedi : 10h00 – 17h00",
    "Sur rendez-vous en dehors de ces horaires",
  ],
  social: {
    instagram: "https://instagram.com/braseroatelier",
    facebook: "https://facebook.com/braseroatelier",
  },
  atelier: {
    city: "Moncoutant",
    dept: "Deux-Sèvres",
    lat: 46.6479,
    lng: -0.6342,
  },
  commitments: [
    {
      title: "Acier de qualité",
      description: "Planches HLE traçables, façonnées et contrôlées dans notre atelier.",
    },
    {
      title: "Fabrication locale",
      description: "Toutes les étapes sont réalisées à Moncoutant par notre équipe.",
    },
    {
      title: "SAV réactif",
      description: "Réponse sous 24h ouvrées, pièces détachées suivies.",
    },
    {
      title: "Livraison suivie",
      description: "Transporteurs partenaires et notifications temps réel.",
    },
  ],
};

export type SiteConfig = typeof siteConfig;
