import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "kxztmjqxsskvbqcohtgj.supabase.co",
      },
    ],
    // Réduire le cache des images pour permettre les mises à jour plus rapides
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
