import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: '/info/blog', destination: '/blog', permanent: true },
      { source: '/info/contact', destination: '/contact', permanent: true },
      // Anti-cannibalisation : rediriger les doublons vers les pages canoniques
      { source: '/livraison-france', destination: '/livraison', permanent: true },
      { source: '/info/accessoires', destination: '/produits?category=accessoire', permanent: true },
      { source: '/info/braseros-exterieurs', destination: '/produits?category=brasero', permanent: true },

      // Redirections sous-fiches variantes → fiches produit par diamètre
      // Obélix 50cm
      { source: '/brasero-plancha/l-obelix-peint-50-inox', destination: '/produits/brasero-obelix-50', permanent: true },
      { source: '/brasero-plancha/l-obelix-corten-50-inox', destination: '/produits/brasero-obelix-50', permanent: true },
      { source: '/brasero-plancha/l-obelix-peint-50-acier', destination: '/produits/brasero-obelix-50', permanent: true },
      { source: '/brasero-plancha/l-obelix-corten-50-acier', destination: '/produits/brasero-obelix-50', permanent: true },
      // Obélix 80cm
      { source: '/brasero-plancha/l-obelix-peint-80-inox', destination: '/produits/brasero-obelix-80', permanent: true },
      { source: '/brasero-plancha/l-obelix-corten-80-inox', destination: '/produits/brasero-obelix-80', permanent: true },
      { source: '/brasero-plancha/l-obelix-peint-80-acier', destination: '/produits/brasero-obelix-80', permanent: true },
      { source: '/brasero-plancha/l-obelix-corten-80-acier', destination: '/produits/brasero-obelix-80', permanent: true },
      // Obélix 100cm (parent)
      { source: '/brasero-plancha/l-obelix-peint-100-inox', destination: '/produits/brasero-acier-100-l-obelix', permanent: true },
      { source: '/brasero-plancha/l-obelix-corten-100-inox', destination: '/produits/brasero-acier-100-l-obelix', permanent: true },
      { source: '/brasero-plancha/l-obelix-corten-100-acier', destination: '/produits/brasero-acier-100-l-obelix', permanent: true },
      // Coffy 50cm
      { source: '/brasero-plancha/le-coffy-peint-50-acier', destination: '/produits/brasero-coffy-50', permanent: true },
      // Coffy 80cm
      { source: '/brasero-plancha/le-coffy-peint-80-acier', destination: '/produits/brasero-coffy-80', permanent: true },
      // Coffy 100cm (parent)
      { source: '/brasero-plancha/le-coffy-peint-100-acier', destination: '/produits/brasero-coffy', permanent: true },
      // Morris 100cm
      { source: '/brasero-plancha/le-morris-peint-100-inox', destination: '/produits/brasero-morris-100', permanent: true },
      { source: '/brasero-plancha/le-morris-corten-100-inox', destination: '/produits/brasero-morris-100', permanent: true },
      { source: '/brasero-plancha/le-morris-peint-100-acier', destination: '/produits/brasero-morris-100', permanent: true },
      { source: '/brasero-plancha/le-morris-corten-100-acier', destination: '/produits/brasero-morris-100', permanent: true },
      // Morris 80cm (parent)
      { source: '/brasero-plancha/le-morris-corten-80-inox', destination: '/produits/brasero-en-acier-80-lemorris', permanent: true },
      { source: '/brasero-plancha/le-morris-peint-80-acier', destination: '/produits/brasero-en-acier-80-lemorris', permanent: true },
      { source: '/brasero-plancha/le-morris-corten-80-acier', destination: '/produits/brasero-en-acier-80-lemorris', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      new URL("https://images.unsplash.com/**"),
      new URL("https://kxztmjqxsskvbqcohtgj.supabase.co/**"),
    ],
    // Réduire le cache des images pour permettre les mises à jour plus rapides
    minimumCacheTTL: 86400,
    // En développement local, les IPs NAT64 (IPv6) de Supabase sont rejetées
    // par la protection SSRF de Next.js. On désactive l'optimisation en dev.
    // En production (Vercel), l'optimisation reste active.
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
