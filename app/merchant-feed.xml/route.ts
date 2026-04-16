import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mapSupabaseProduct } from '@/lib/utils';
import { PRODUCT_COLUMNS } from '@/lib/data/products';
import { getAllVariantSlugs } from '@/lib/variant-slugs';
import type { Product } from '@/lib/schema';

export const revalidate = 3600; // Revalidate every hour

const BASE_URL = 'https://www.atelier-lbf.fr';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'brasero': return 'Maison et jardin > Chauffage extérieur > Braseros';
    case 'plancha': return 'Maison et jardin > Barbecues et grillades > Planchas';
    case 'grille': return 'Maison et jardin > Barbecues et grillades > Grilles de cuisson';
    case 'fendeur': return 'Maison et jardin > Outils de jardin > Fendeurs à bûches';
    case 'accessoire': return 'Maison et jardin > Barbecues et grillades > Accessoires barbecue';
    case 'range-buches': return 'Maison et jardin > Rangement extérieur > Range-bûches';
    default: return 'Maison et jardin > Chauffage extérieur';
  }
}

function getGoogleCategory(category: string): string {
  switch (category) {
    case 'brasero': return '3399'; // Outdoor heating > Fire pits
    case 'plancha': return '4632'; // Outdoor cooking > Griddles
    case 'grille': return '4564'; // Outdoor cooking > Accessories (grilles)
    case 'fendeur': return '3798'; // Tools > Axes
    case 'accessoire': return '4564'; // Outdoor cooking > Accessories
    case 'range-buches': return '6433'; // Firewood storage
    default: return '3399';
  }
}

function getMaterialLabel(product: Product): string {
  const mat = product.material?.toLowerCase() || '';
  if (mat.includes('corten')) return 'Acier Corten';
  if (mat.includes('inox')) return 'Acier Inoxydable';
  return 'Acier';
}

function getAvailability(product: Product): string {
  if (product.onDemand) return 'preorder';
  if (product.availability?.toLowerCase().includes('stock')) return 'in_stock';
  return 'in_stock';
}

function buildProductItem(
  id: string,
  title: string,
  description: string,
  link: string,
  imageLink: string,
  additionalImages: string[],
  price: number,
  comparePrice: number | undefined,
  availability: string,
  category: string,
  material: string,
  weight: string | undefined,
  condition: string,
  brand: string,
): string {
  const priceFmt = `${price.toFixed(2)} EUR`;
  const salePriceFmt = comparePrice && comparePrice > price
    ? `<g:sale_price>${price.toFixed(2)} EUR</g:sale_price>\n      <g:price>${comparePrice.toFixed(2)} EUR</g:price>`
    : `<g:price>${priceFmt}</g:price>`;

  const additionalImageTags = additionalImages
    .slice(0, 9) // Google max 10 images total
    .map(url => `      <g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`)
    .join('\n');

  return `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description.slice(0, 5000))}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
${additionalImageTags ? additionalImageTags + '\n' : ''}      ${salePriceFmt}
      <g:availability>${availability}</g:availability>
      <g:condition>${condition}</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:product_type>${escapeXml(category)}</g:product_type>
      <g:google_product_category>${getGoogleCategory(category)}</g:google_product_category>
      <g:material>${escapeXml(material)}</g:material>
${weight ? `      <g:shipping_weight>${escapeXml(weight)} kg</g:shipping_weight>\n` : ''}      <g:shipping>
        <g:country>FR</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
      <g:identifier_exists>false</g:identifier_exists>
      <g:custom_label_0>Made in France</g:custom_label_0>
      <g:custom_label_1>${escapeXml(category)}</g:custom_label_1>
    </item>`;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: rawProducts } = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .order('popularScore', { ascending: false });

    if (!rawProducts || rawProducts.length === 0) {
      return new NextResponse('<feed/>', {
        headers: { 'Content-Type': 'application/xml' },
      });
    }

    const products = rawProducts
      .map(mapSupabaseProduct)
      .filter(Boolean) as Product[];

    const items: string[] = [];

    for (const product of products) {
      const mainImage = product.images?.[0]?.src || '';
      const additionalImages = (product.images || []).slice(1).map(img => img.src);
      const description = product.shortDescription || product.description || product.name;
      const material = getMaterialLabel(product);
      const availability = getAvailability(product);
      const categoryLabel = getCategoryLabel(product.category);
      const weight = product.weight ? String(product.weight) : undefined;

      // Base product item
      items.push(buildProductItem(
        `product-${product.slug}`,
        product.name,
        description,
        `${BASE_URL}/produits/${product.slug}`,
        mainImage,
        additionalImages,
        product.price,
        product.comparePrice || undefined,
        availability,
        categoryLabel,
        material,
        weight,
        'new',
        'Atelier LBF',
      ));

      // Variant items (brasero-plancha sub-pages)
      if (product.configurations) {
        const variantSlugs = getAllVariantSlugs(product);

        for (const variant of variantSlugs) {
          const config = product.configurations[variant.configKey];
          if (!config) continue;

          const diameterData = config.diameters?.[variant.diameter];
          if (!diameterData) continue;

          const variantPrice = diameterData.price || product.price;
          const variantWeight = diameterData.weight ? String(diameterData.weight) : weight;

          // Variant-specific images or fallback to config images
          const configImages = config.images || product.images || [];
          const variantMainImage = configImages[0]?.src || mainImage;
          const variantAdditionalImages = configImages.slice(1).map((img: { src: string }) => img.src);

          // Build variant title
          const finishLabel = variant.finish === 'corten' ? 'Acier Corten' : 'Acier Peint Noir';
          const planchaLabel = variant.plancha === 'inox' ? 'Plancha Inox' : 'Plancha Acier Carbone';
          const variantTitle = `${product.name} ${finishLabel} Ø${variant.diameter}cm ${planchaLabel}`;

          const variantDescription = diameterData.description || description;
          const variantMaterial = variant.finish === 'corten' ? 'Acier Corten' : 'Acier Peint';

          items.push(buildProductItem(
            `variant-${variant.variantSlug}`,
            variantTitle,
            variantDescription,
            `${BASE_URL}/brasero-plancha/${variant.variantSlug}`,
            variantMainImage,
            variantAdditionalImages,
            variantPrice,
            undefined,
            availability,
            categoryLabel,
            variantMaterial,
            variantWeight,
            'new',
            'Atelier LBF',
          ));
        }
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Atelier LBF — Braseros artisanaux Made in France</title>
    <link>${BASE_URL}</link>
    <description>Braseros artisanaux en acier corten et acier peint, fabriqués à la main dans les Deux-Sèvres. Planchas, fendeurs, accessoires.</description>
${items.join('\n')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Merchant feed error:', error);
    return new NextResponse('<feed/>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
