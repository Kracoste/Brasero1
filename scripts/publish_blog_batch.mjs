/**
 * Publie 3 nouveaux articles de blog dans la table blog_posts.
 * Articles SEO-optimisés, anti-cannibalisme par rapport aux 18 articles existants.
 * Usage : node scripts/publish_blog_batch.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
for (const line of envContent.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].replace(/^["']|["']$/g, '');
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing env'); process.exit(1); }

const supabase = createClient(url, key, { auth: { persistSession: false } });

const readArticle = (filename) =>
  readFileSync(resolve(process.cwd(), 'docs/blog', filename), 'utf-8').trim();

const posts = [
  {
    slug: 'premier-feu-rodage-brasero',
    title: 'Premier feu : le rituel d\'allumage et de rodage de votre brasero (étape par étape)',
    meta_title: 'Premier feu brasero : rituel d\'allumage et de rodage',
    meta_description: 'Comment réussir le premier feu de votre brasero artisanal : préparation, rodage de l\'acier, méthode upside-down, première cuisson. Le guide complet par un artisan français.',
    category: 'guide',
    excerpt: 'Le premier feu d\'un brasero artisanal n\'est pas un simple feu de camp. C\'est un rituel technique qui conditionne la durée de vie de l\'acier et la qualité de toutes les cuissons à venir.',
    author: 'Hugo Allou — Atelier LBF',
    is_published: true,
    read_time: 12,
    tags: ['brasero', 'premier feu', 'rodage', 'allumage', 'guide débutant', 'artisan'],
    related_products: ['brasero-coffy-80', 'brasero-en-acier-80-lemorris', 'brasero-acier-100-l-obelix'],
    related_articles: [
      'comment-culotter-plancha-acier-carbone',
      'temperature-cuisson-brasero-plancha',
      'meilleur-bois-brasero-comparatif',
    ],
    cta_product_slug: 'brasero-coffy-80',
    cta_text: 'Découvrir nos braseros artisanaux',
    content: readArticle('premier-feu-rodage-brasero.md'),
  },
  {
    slug: 'distance-securite-brasero-reglementation',
    title: 'Distances de sécurité brasero : la réglementation française (mur, voisin, arbre, abri)',
    meta_title: 'Distances de sécurité brasero : réglementation française complète',
    meta_description: 'Tout sur la réglementation française du brasero : distances de sécurité voisin, arbres, façade, arrêtés préfectoraux et municipaux, trouble de voisinage. Guide complet 2026.',
    category: 'reglementation',
    excerpt: 'Avant d\'allumer un feu chez vous, mieux vaut savoir ce que la loi française autorise. Distances de sécurité, arrêtés préfectoraux, droits des voisins : le tour complet de la réglementation.',
    author: 'Hugo Allou — Atelier LBF',
    is_published: true,
    read_time: 14,
    tags: ['brasero', 'réglementation', 'sécurité', 'voisinage', 'distances', 'arrêté préfectoral', 'PLU'],
    related_products: ['brasero-coffy-80', 'brasero-acier-100-l-obelix'],
    related_articles: [
      'brasero-terrasse-bois-securite',
      'amenager-coin-brasero-jardin',
      'meilleur-bois-brasero-comparatif',
    ],
    cta_product_slug: 'brasero-acier-100-l-obelix',
    cta_text: 'Voir nos braseros artisanaux',
    content: readArticle('distance-securite-brasero-reglementation.md'),
  },
  {
    slug: 'brasero-vs-plancha-electrique',
    title: 'Brasero ou plancha électrique : pourquoi le feu de bois change tout',
    meta_title: 'Brasero vs plancha électrique : le comparatif honnête',
    meta_description: 'Brasero plancha au feu de bois ou plancha électrique : comparatif technique, gustatif, économique et environnemental. Coût total sur 10 et 20 ans. Le choix selon votre profil.',
    category: 'comparatif',
    excerpt: 'Vous hésitez entre une plancha électrique de marque et un brasero artisanal. Comparatif sans complaisance : technique, goût, coût total sur 20 ans, et la dimension expérience que personne ne mesure.',
    author: 'Hugo Allou — Atelier LBF',
    is_published: true,
    read_time: 13,
    tags: ['brasero', 'plancha électrique', 'comparatif', 'cuisson extérieure', 'feu de bois', 'achat'],
    related_products: ['brasero-coffy-80', 'brasero-en-acier-80-lemorris', 'brasero-acier-100-l-obelix'],
    related_articles: [
      'brasero-plancha-vs-barbecue',
      'pourquoi-brasero-artisanal-francais',
      'temperature-cuisson-brasero-plancha',
    ],
    cta_product_slug: 'brasero-coffy-80',
    cta_text: 'Découvrir nos braseros artisanaux',
    content: readArticle('brasero-vs-plancha-electrique.md'),
  },
];

const now = new Date().toISOString();

let success = 0;
let failed = 0;

for (const post of posts) {
  const payload = { ...post, published_at: now };
  const { data, error } = await supabase
    .from('blog_posts')
    .upsert(payload, { onConflict: 'slug' })
    .select();

  if (error) {
    console.error(`✗ ${post.slug} —`, error.message);
    failed++;
  } else {
    console.log(`✓ Publié : ${data[0].slug}`);
    console.log(`  https://www.atelier-lbf.fr/blog/${data[0].slug}`);
    success++;
  }
}

console.log(`\n${success}/${posts.length} articles publiés${failed > 0 ? `, ${failed} échec(s)` : ''}`);
