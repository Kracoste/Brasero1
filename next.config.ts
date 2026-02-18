import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://images.unsplash.com/**"),
      new URL("https://kxztmjqxsskvbqcohtgj.supabase.co/**"),
    ],
    // Réduire le cache des images pour permettre les mises à jour plus rapides
    minimumCacheTTL: 60,
    // En développement local, les IPs NAT64 (IPv6) de Supabase sont rejetées
    // par la protection SSRF de Next.js. On désactive l'optimisation en dev.
    // En production (Vercel), l'optimisation reste active.
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
