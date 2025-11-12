export type Review = {
  name: string;
  role: string;
  quote: string;
  note: number;
};

export const reviews: Review[] = [
  {
    name: "Stéphanie L.",
    role: "Maison d'hôtes à Niort",
    quote:
      "Le braséro Origine 100 sublime nos soirées clientes. Le niveau de finition et la douceur du service client sont irréprochables.",
    note: 5,
  },
  {
    name: "Karim D.",
    role: "Chef à domicile",
    quote:
      "J'utilise l'anneau plancha sur le Signature 80 pour toutes mes prestations. La montée en température est ultra régulière.",
    note: 5,
  },
  {
    name: "Lucie & Martin",
    role: "Propriétaires d'un gîte",
    quote:
      "Nous voulions un feu extérieur sécurisé et esthétique. Horizon 60 coche toutes les cases et l'équipe a été d'un grand conseil.",
    note: 5,
  },
  {
    name: "Clément R.",
    role: "Paysagiste",
    quote:
      "La fabrication locale est tangible : soudures parfaites, acier lourd. Mes clients sont fiers d'afficher le badge Made in France.",
    note: 5,
  },
];
