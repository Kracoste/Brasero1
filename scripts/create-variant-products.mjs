/**
 * Script pour créer les fiches produit par diamètre à partir des produits parents.
 *
 * Produits à créer :
 * - Obelix 50cm, 80cm (100cm = parent existant)
 * - Coffy 50cm, 80cm (100cm = parent existant)
 * - Morris 100cm (80cm = parent existant)
 *
 * Usage: node scripts/create-variant-products.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// All columns we need to copy
const COLUMNS = 'id, slug, name, price, compare_price, discount_percent, short_description, description, category, badge, images, material, diameter, thickness, height, weight, bowl_thickness, base_thickness, warranty, availability, shipping, popularScore, on_demand, specs, highlights, features, faq, customSpecs, location, variants, config_images, configurations, seo_content, customization, card_image, is_featured, featured_order, in_stock';

async function getProduct(slug) {
  const { data, error } = await supabase
    .from('products')
    .select(COLUMNS)
    .eq('slug', slug)
    .single();
  if (error) {
    console.error(`Error fetching ${slug}:`, error.message);
    return null;
  }
  return data;
}

/**
 * Filtre les configurations pour ne garder que celles qui ont le diamètre donné.
 * Les diamètres dans la DB sont sous config.diameters avec clés "50", "80", "100".
 * Pour le nouveau produit, on garde la config entière (faq, images, characteristics)
 * mais on ne garde que le diamètre concerné dans diameters.
 */
function filterConfigsForDiameter(configurations, diameter) {
  if (!configurations) return null;
  const dKey = String(diameter);

  const filtered = {};
  for (const [configKey, config] of Object.entries(configurations)) {
    if (config.diameters && config.diameters[dKey]) {
      // Clone config, ne garder que le diamètre voulu
      const newConfig = { ...config };
      newConfig.diameters = { [dKey]: config.diameters[dKey] };
      filtered[configKey] = newConfig;
    }
  }

  return Object.keys(filtered).length > 0 ? filtered : null;
}

/**
 * Trouve le prix le plus bas pour un diamètre donné parmi toutes les configurations.
 * Les clés diamètres sont "50", "80", "100" (pas "d50").
 */
function getLowestPriceForDiameter(configurations, diameter) {
  if (!configurations) return null;
  const dKey = String(diameter);

  let lowest = Infinity;
  for (const config of Object.values(configurations)) {
    if (config.diameters && config.diameters[dKey]) {
      const price = config.diameters[dKey].price;
      if (price && price < lowest) {
        lowest = price;
      }
    }
  }

  return lowest === Infinity ? null : lowest;
}

/**
 * Filtre le seoContent pour ne garder que celui du diamètre donné
 */
function filterSeoContent(seoContent, diameter) {
  if (!seoContent) return null;
  const dKey = String(diameter);
  if (seoContent[dKey]) {
    return { [dKey]: seoContent[dKey] };
  }
  // Try d-prefixed key too
  const dPrefixed = 'd' + dKey;
  if (seoContent[dPrefixed]) {
    return { [dPrefixed]: seoContent[dPrefixed] };
  }
  return seoContent;
}

function createChildProduct(parent, { diameter, slug, name, shortName }) {
  const configs = filterConfigsForDiameter(parent.configurations, diameter);
  const price = getLowestPriceForDiameter(parent.configurations, diameter) || parent.price;
  const seoContent = filterSeoContent(parent.seo_content, diameter);

  // Remove id, keep everything else from parent
  const { id, ...parentData } = parent;

  return {
    ...parentData,
    slug,
    name,
    diameter,
    price,
    configurations: configs,
    seo_content: seoContent,
    // Keep same images (user will change later)
    // Keep same faq, highlights, features, specs, location
    // Reset featured
    is_featured: false,
    featured_order: null,
    // Update description to mention specific diameter
    short_description: parent.short_description?.replace(
      /\d+\s*cm/i,
      `${diameter} cm`
    ) || parent.short_description,
    popularScore: Math.max(0, (parent.popularScore || 0) - 1),
  };
}

async function insertProduct(product) {
  // Check if slug already exists
  const { data: existing } = await supabase
    .from('products')
    .select('slug')
    .eq('slug', product.slug)
    .single();

  if (existing) {
    console.log(`  ⚠ Product ${product.slug} already exists, skipping`);
    return null;
  }

  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select('slug, name, price, diameter')
    .single();

  if (error) {
    console.error(`  ✗ Error inserting ${product.slug}:`, error.message);
    return null;
  }

  console.log(`  ✓ Created: ${data.name} (${data.slug}) — ${data.price}€, Ø${data.diameter}cm`);
  return data;
}

async function main() {
  console.log('=== Création des fiches produit par diamètre ===\n');

  // 1. Fetch parent products
  console.log('Fetching parent products...');
  const obelix = await getProduct('brasero-acier-100-l-obelix');
  const coffy = await getProduct('brasero-coffy');
  const morris = await getProduct('brasero-en-acier-80-lemorris');

  if (!obelix || !coffy || !morris) {
    console.error('Failed to fetch one or more parent products');
    process.exit(1);
  }

  console.log(`  Found: ${obelix.name} (Ø${obelix.diameter})`);
  console.log(`  Found: ${coffy.name} (Ø${coffy.diameter})`);
  console.log(`  Found: ${morris.name} (Ø${morris.diameter})`);
  console.log();

  // 2. Define children to create
  const children = [
    // Obelix 50cm
    createChildProduct(obelix, {
      diameter: 50,
      slug: 'brasero-obelix-50',
      name: "Brasero Plancha L'Obélix 50cm",
      shortName: "L'Obélix 50",
    }),
    // Obelix 80cm
    createChildProduct(obelix, {
      diameter: 80,
      slug: 'brasero-obelix-80',
      name: "Brasero Plancha L'Obélix 80cm",
      shortName: "L'Obélix 80",
    }),
    // Coffy 50cm
    createChildProduct(coffy, {
      diameter: 50,
      slug: 'brasero-coffy-50',
      name: 'Brasero Plancha Le Coffy 50cm',
      shortName: 'Le Coffy 50',
    }),
    // Coffy 80cm
    createChildProduct(coffy, {
      diameter: 80,
      slug: 'brasero-coffy-80',
      name: 'Brasero Plancha Le Coffy 80cm',
      shortName: 'Le Coffy 80',
    }),
    // Morris 100cm
    createChildProduct(morris, {
      diameter: 100,
      slug: 'brasero-morris-100',
      name: 'Brasero Plancha Le Morris 100cm',
      shortName: 'Le Morris 100',
    }),
  ];

  // 3. Insert children
  console.log(`Inserting ${children.length} new products...\n`);

  let created = 0;
  for (const child of children) {
    const result = await insertProduct(child);
    if (result) created++;
  }

  console.log(`\n=== Done: ${created}/${children.length} products created ===`);

  // 4. Show summary
  console.log('\nProduct structure after migration:');
  console.log('  Obélix: 50cm (new) | 80cm (new) | 100cm (parent: brasero-acier-100-l-obelix)');
  console.log('  Coffy:  50cm (new) | 80cm (new) | 100cm (parent: brasero-coffy)');
  console.log('  Morris: 80cm (parent: brasero-en-acier-80-lemorris) | 100cm (new)');
  console.log('\nReminder: Update the parent product pages and add redirects for old variant URLs.');
}

main().catch(console.error);
