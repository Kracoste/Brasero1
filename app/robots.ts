import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.atelier-lbf.fr';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/image'],
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/panier',
          '/panier/',
          '/favoris',
          '/mon-compte/',
          '/commande/',
          '/_next/static/',
          '/secrets/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
