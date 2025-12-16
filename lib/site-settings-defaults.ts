export const STORE_SETTINGS_ID = "default";

export const DEFAULT_SITE_SETTINGS = {
  storeName: "Brasero Atelier",
  storeEmail: "contact@braseroatelier.fr",
  storePhone: "05 49 XX XX XX",
  storeAddress: "Moncoutant, 79320 France",
  schedules: [
    "Lundi – Vendredi : 9h00 – 18h00",
    "Samedi : 10h00 – 16h00",
    "Sur rendez-vous en dehors de ces horaires",
  ],
  freeShippingThreshold: 500,
  standardShippingCost: 29.9,
  expressShippingCost: 49.9,
  atelier: {
    city: "Moncoutant",
    department: "Deux-Sèvres",
    lat: 46.6479,
    lng: -0.6342,
  },
};

export type SiteSettings = typeof DEFAULT_SITE_SETTINGS;
