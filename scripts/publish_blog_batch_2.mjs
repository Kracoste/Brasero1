/**
 * Publie 5 nouveaux articles de blog dans la table blog_posts.
 * Articles SEO-optimisés, anti-cannibalisme par rapport aux 21 articles existants.
 * Usage : node scripts/publish_blog_batch_2.mjs
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
    slug: 'brasero-corten-bord-mer-air-salin',
    title: 'Brasero corten en bord de mer : tient-il l\'air salin ?',
    meta_title: 'Brasero corten en bord de mer : guide complet 2026',
    meta_description: 'Le corten résiste-t-il aux embruns ? Guide complet pour propriétaires en bord de mer : préparation, patination, entretien, retours d\'expérience par région côtière française.',
    category: 'guide',
    excerpt: 'Une question qui revient chaque mois à l\'atelier : "Je vis en bord de mer. Le corten va-t-il tenir ?" Réponse complète, basée sur 5 ans de retours clients en Bretagne, Vendée, Côte d\'Azur et Corse.',
    author: 'Hugo Allou — Atelier LBF',
    is_published: true,
    read_time: 12,
    tags: ['brasero', 'corten', 'bord de mer', 'air salin', 'climat côtier', 'Bretagne', 'Méditerranée'],
    related_products: ['le-fermier', 'brasero-acier-100-l-obelix'],
    related_articles: [
      'brasero-corten-avantages-inconvenients',
      'brasero-corten-taches-terrasse-solutions',
      'pourquoi-brasero-artisanal-francais',
    ],
    cta_product_slug: 'le-fermier',
    cta_text: 'Découvrir nos braseros corten artisanaux',
    content: readArticle('brasero-corten-bord-mer-air-salin.md'),
  },
  {
    slug: 'cuisson-feu-bois-gout-fume-plancha',
    title: 'Cuisson au feu de bois : la science du goût fumé sur plancha',
    meta_title: 'Cuisson au feu de bois : la science du goût fumé',
    meta_description: 'Pourquoi une côte de bœuf au brasero a un goût qu\'aucune plancha électrique ne peut reproduire ? Réponse scientifique : Maillard, phénols, furanes, rayonnement infrarouge. Le guide gastronomique complet.',
    category: 'gastronomie',
    excerpt: 'Pourquoi une côte de bœuf au brasero a-t-elle un goût qu\'aucune plancha électrique ne peut reproduire ? Ce n\'est pas du folklore. C\'est de la science : Maillard amplifié, bain de fumée, rayonnement infrarouge.',
    author: 'Hugo Allou — Atelier LBF',
    is_published: true,
    read_time: 13,
    tags: ['brasero', 'plancha', 'cuisson', 'feu de bois', 'gastronomie', 'Maillard', 'fumée', 'goût'],
    related_products: ['brasero-en-acier-80-lemorris', 'brasero-coffy-80', 'brasero-acier-100-l-obelix'],
    related_articles: [
      'temperature-cuisson-brasero-plancha',
      'meilleur-bois-brasero-comparatif',
      'viandes-rouges-brasero-plancha',
    ],
    cta_product_slug: 'brasero-en-acier-80-lemorris',
    cta_text: 'Découvrir nos braseros pour cuisine fine',
    content: readArticle('cuisson-feu-bois-gout-fume-plancha.md'),
  },
  {
    slug: 'legumes-poissons-brasero-plancha-cuissons-delicates',
    title: 'Légumes et poissons au brasero plancha : les cuissons délicates',
    meta_title: 'Légumes et poissons au brasero plancha : guide complet',
    meta_description: 'Le brasero n\'est pas réservé aux côtes de bœuf. Saint-Jacques, dorade, asperges, fruits caramélisés : maîtriser les cuissons délicates au feu de bois grâce aux zones thermiques. Guide chef.',
    category: 'gastronomie',
    excerpt: 'Le brasero plancha est l\'un des meilleurs outils existants pour les cuissons délicates : poissons fragiles, fruits de mer, légumes qui se défont, fruits qui caramélisent. Guide des techniques de chef.',
    author: 'Hugo Allou — Atelier LBF',
    is_published: true,
    read_time: 14,
    tags: ['brasero', 'plancha', 'poisson', 'légumes', 'saint-jacques', 'cuisson délicate', 'recettes'],
    related_products: ['brasero-en-acier-80-lemorris', 'brasero-coffy-80', 'brasero-acier-100-l-obelix'],
    related_articles: [
      'temperature-cuisson-brasero-plancha',
      'comment-culotter-plancha-acier-carbone',
      'cuisson-feu-bois-gout-fume-plancha',
    ],
    cta_product_slug: 'brasero-en-acier-80-lemorris',
    cta_text: 'Voir nos braseros pour cuissons fines',
    content: readArticle('legumes-poissons-brasero-plancha-cuissons-delicates.md'),
  },
  {
    slug: 'prix-brasero-artisanal-decryptage',
    title: 'Combien coûte un vrai brasero artisanal ? La transparence sur les prix',
    meta_title: 'Prix brasero artisanal : décryptage complet (2026)',
    meta_description: 'Pourquoi un brasero artisanal coûte 1800€ quand on en trouve à 299€ ? Décomposition transparente : matière, main-d\'œuvre, marges. Coût total sur 20 ans. Comment reconnaître le vrai artisanal.',
    category: 'achat',
    excerpt: 'Pourquoi un brasero artisanal coûte 1 800 € quand on en trouve à 299 € sur Amazon ? Décomposition transparente : où va l\'argent, matière, main-d\'œuvre, marges. La vérité d\'un fabricant français.',
    author: 'Hugo Allou — Atelier LBF',
    is_published: true,
    read_time: 13,
    tags: ['brasero', 'prix', 'artisanal', 'made in france', 'décryptage', 'achat', 'transparence'],
    related_products: ['brasero-coffy-80', 'brasero-en-acier-80-lemorris', 'brasero-acier-100-l-obelix'],
    related_articles: [
      'pourquoi-brasero-artisanal-francais',
      'premier-brasero-guide-debutant',
      'brasero-vs-plancha-electrique',
    ],
    cta_product_slug: 'brasero-coffy-80',
    cta_text: 'Voir nos braseros artisanaux français',
    content: readArticle('prix-brasero-artisanal-decryptage.md'),
  },
  {
    slug: 'brasero-hiver-cuisiner-chauffer-dehors',
    title: 'Brasero en hiver : cuisiner et se chauffer dehors quand il fait froid',
    meta_title: 'Brasero en hiver : usage actif, cuisine et chauffage extérieur',
    meta_description: 'L\'erreur de 90% des propriétaires : ranger leur brasero dès octobre. Guide complet pour utiliser activement son brasero en hiver : allumage, cuissons hivernales, confort des invités, sécurité.',
    category: 'guide',
    excerpt: 'L\'erreur de 90% des propriétaires de brasero : le ranger dès octobre. La vraie magie d\'un brasero, beaucoup la ratent : c\'est sa puissance en hiver. Guide complet pour 365 jours d\'usage par an.',
    author: 'Hugo Allou — Atelier LBF',
    is_published: true,
    read_time: 12,
    tags: ['brasero', 'hiver', 'chauffage extérieur', 'cuisson hiver', 'gibier', 'soirée hiver'],
    related_products: ['brasero-en-acier-80-lemorris', 'brasero-acier-100-l-obelix', 'le-fermier'],
    related_articles: [
      'preparer-brasero-hiver-hivernage',
      'meilleur-bois-brasero-comparatif',
      'distance-securite-brasero-reglementation',
    ],
    cta_product_slug: 'brasero-en-acier-80-lemorris',
    cta_text: 'Découvrir nos braseros pour 365 jours par an',
    content: readArticle('brasero-hiver-cuisiner-chauffer-dehors.md'),
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
