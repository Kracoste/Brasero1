import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getAllVariantSlugs } from '@/lib/variant-slugs';
import { mapSupabaseProduct } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.atelier-lbf.fr';
  const supabase = await createClient();

  // Récupérer tous les produits
  const { data: products } = await supabase
    .from('products')
    .select('slug, updated_at')
    .order('updated_at', { ascending: false });

  const productUrls: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${baseUrl}/produits/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Pages statiques principales — priorités optimisées SEO
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/produits`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brasero-multifonction`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/made-in-france`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fabrication`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/atelier`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/qualite`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/garantie`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/accessoires`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/livraison`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    // /livraison-france redirigé 301 vers /livraison (anti-cannibalisation)
    {
      url: `${baseUrl}/recettes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    // /info/faq est déjà dans infoPages
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/retours`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Pages info
  const infoPages: MetadataRoute.Sitemap = [
    'a-propos-de-nous',
    'astuces-conseils',
    'bulletin-information',
    'commande-affaires',
    'commander',
    'confidentialite-politique',
    'donnees-entreprise-contact',
    'expedition',
    'faq',
    'paiement',
    'produits-sur-mesure',
    'retourner',
    'service-clientele',
  ].map((slug) => ({
    url: `${baseUrl}/info/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  // Articles de blog
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, published_at, updated_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  const blogUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...(blogPosts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  // Recettes publiées
  const { data: recipes } = await supabase
    .from('recipes')
    .select('slug, published_at, updated_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  const recipeUrls: MetadataRoute.Sitemap = (recipes || []).map((recipe) => ({
    url: `${baseUrl}/recettes/${recipe.slug}`,
    lastModified: recipe.updated_at ? new Date(recipe.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // SEO-21 : Récupérer les variantes /brasero-plancha/[variantSlug]
  const { data: productsWithConfigs } = await supabase
    .from('products')
    .select('slug, name, updated_at, configurations, variants, specs, category, material, diameter')
    .order('updated_at', { ascending: false });

  const braseroPlancha: MetadataRoute.Sitemap = [];
  for (const rawProduct of productsWithConfigs || []) {
    const product = mapSupabaseProduct(rawProduct);
    if (!product) continue;
    const variantSlugs = getAllVariantSlugs(product);
    for (const { variantSlug } of variantSlugs) {
      braseroPlancha.push({
        url: `${baseUrl}/brasero-plancha/${variantSlug}`,
        lastModified: rawProduct.updated_at ? new Date(rawProduct.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  }

  return [...staticPages, ...infoPages, ...productUrls, ...blogUrls, ...recipeUrls, ...braseroPlancha];
}
