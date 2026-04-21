import type { Product } from "@/lib/schema";

const BASE_URL = "https://www.atelier-lbf.fr";

// ── Types ──────────────────────────────────────────────────────────────────

type BreadcrumbItem = { name: string; url: string };
type FAQItem = { question: string; answer: string };

type SiteSettings = {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  atelier: {
    city: string;
    department: string;
    lat: number;
    lng: number;
  };
};

// ── Zones desservies (SEO local multi-région) ──────────────────────────────

const AREA_SERVED = [
  { "@type": "AdministrativeArea" as const, name: "Deux-Sèvres" },
  { "@type": "AdministrativeArea" as const, name: "Vienne" },
  { "@type": "AdministrativeArea" as const, name: "Vendée" },
  { "@type": "AdministrativeArea" as const, name: "Charente-Maritime" },
  { "@type": "AdministrativeArea" as const, name: "Nouvelle-Aquitaine" },
  { "@type": "AdministrativeArea" as const, name: "Pays de la Loire" },
  { "@type": "Country" as const, name: "France" },
];

// ── Catégories lisibles ────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  brasero: "Braseros",
  fendeur: "Fendeurs à bûches",
  accessoire: "Accessoires",
  "range-buches": "Range-bûches",
};

// ── Organisation ───────────────────────────────────────────────────────────

export function generateOrganizationSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: settings.storeName,
    url: BASE_URL,
    email: settings.storeEmail,
    telephone: settings.storePhone,
    logo: `${BASE_URL}/logo/Logo1.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.storeAddress,
      addressLocality: settings.atelier.city,
      addressRegion: settings.atelier.department,
      postalCode: "79320",
      addressCountry: "FR",
    },
    areaServed: AREA_SERVED,
    knowsAbout: [
      "brasero artisanal",
      "brasero corten",
      "brasero acier",
      "ferronnerie d'art",
      "plancha extérieure",
      "fendeur à bûches",
    ],
  };
}

// ── VideoObject (pour l'indexation vidéo Google) ───────────────────────────

type VideoSchemaInput = {
  name: string;
  description: string;
  contentUrl: string;
  thumbnailUrl: string;
  uploadDate: string; // ISO 8601: YYYY-MM-DD
  durationSeconds: number;
};

/**
 * Génère un JSON-LD VideoObject conforme aux recommandations Google.
 * Utilisation : <JsonLd data={generateVideoSchema({ ... })} />
 * Pour que la vidéo soit indexée, contentUrl et thumbnailUrl doivent être publiques.
 */
export function generateVideoSchema(input: VideoSchemaInput) {
  const mins = Math.floor(input.durationSeconds / 60);
  const secs = input.durationSeconds % 60;
  const duration = `PT${mins}M${secs}S`;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.name,
    description: input.description,
    contentUrl: input.contentUrl.startsWith("http") ? input.contentUrl : `${BASE_URL}${input.contentUrl}`,
    thumbnailUrl: input.thumbnailUrl.startsWith("http") ? input.thumbnailUrl : `${BASE_URL}${input.thumbnailUrl}`,
    uploadDate: input.uploadDate,
    duration,
  };
}

// ── WebSite (pour la sitelinks search box Google) ──────────────────────────

export function generateWebSiteSchema(settings: SiteSettings) {
  // SEO-20 : SearchAction supprimée — /produits?q= n'est pas implémenté.
  // Une SearchAction non fonctionnelle est préjudiciable au SEO.
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: settings.storeName,
    url: BASE_URL,
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

// ── Store / LocalBusiness ──────────────────────────────────────────────────

export function generateStoreSchema(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    "@id": `${BASE_URL}/#store`,
    name: settings.storeName,
    description:
      "Boutique en ligne de braseros artisanaux manufacturés en France. Braseros en acier corten, fendeurs à bûches et accessoires.",
    url: BASE_URL,
    image: `${BASE_URL}/logo/Logo1.webp`,
    telephone: settings.storePhone,
    email: settings.storeEmail,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.atelier.city,
      addressRegion: settings.atelier.department,
      postalCode: "79320",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.atelier.lat,
      longitude: settings.atelier.lng,
    },
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Carte bancaire, Visa, Mastercard, Virement bancaire",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
    areaServed: AREA_SERVED,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Braseros et accessoires artisanaux",
      url: `${BASE_URL}/produits`,
    },
  };
}

// ── Product + Offer ────────────────────────────────────────────────────────

export function generateProductSchema(
  product: Product,
  seoDescription?: string,
  reviewStats?: { average: number; count: number } | null
) {
  const reference = `REF-${product.slug.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const imageUrls = product.images.map((img) => img.src);

  const availabilityMap: Record<string, string> = {
    "En stock": "https://schema.org/InStock",
    "Sur commande": "https://schema.org/PreOrder",
    "Rupture de stock": "https://schema.org/OutOfStock",
    "Sur demande": "https://schema.org/PreOrder",
  };

  const priceValidUntil = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000
  ).toISOString().split("T")[0];

  const availabilityUrl =
    availabilityMap[product.availability] || "https://schema.org/InStock";

  const sellerObj = {
    "@type": "Organization",
    name: "Atelier LBF",
    url: BASE_URL,
  };

  const shippingDetails = {
    "@type": "OfferShippingDetails",
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "FR",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 3,
        unitCode: "d",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 5,
        maxValue: 10,
        unitCode: "d",
      },
    },
  };

  const returnPolicy = {
    "@type": "MerchantReturnPolicy",
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 14,
    returnMethod: "https://schema.org/ReturnByMail",
  };

  // Collecter tous les prix des variantes
  const variantPrices: number[] = [];
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach((v) => {
      if (v.price) variantPrices.push(v.price);
    });
  }
  if (product.configurations) {
    Object.values(product.configurations).forEach((config) => {
      if (config.diameters) {
        Object.values(config.diameters).forEach((d) => {
          if (d.price) variantPrices.push(d.price);
        });
      }
    });
  }

  // Déterminer si on a une fourchette de prix
  let offersSchema: unknown;
  if (variantPrices.length > 1) {
    const minPrice = Math.min(...variantPrices);
    const maxPrice = Math.max(...variantPrices);

    if (minPrice !== maxPrice) {
      offersSchema = {
        "@type": "AggregateOffer",
        lowPrice: minPrice,
        highPrice: maxPrice,
        priceCurrency: "EUR",
        offerCount: variantPrices.length,
        availability: availabilityUrl,
        offers: variantPrices
          .filter((p, i, arr) => arr.indexOf(p) === i) // unique prices
          .map((price) => ({
            "@type": "Offer",
            price,
            priceCurrency: "EUR",
            priceValidUntil,
            availability: availabilityUrl,
            itemCondition: "https://schema.org/NewCondition",
            seller: sellerObj,
            shippingDetails,
            hasMerchantReturnPolicy: returnPolicy,
          })),
      };
    }
  }

  // Fallback : single Offer
  if (!offersSchema) {
    offersSchema = {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      priceValidUntil,
      availability: availabilityUrl,
      itemCondition: "https://schema.org/NewCondition",
      seller: sellerObj,
      shippingDetails,
      hasMerchantReturnPolicy: returnPolicy,
    };
  }

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: seoDescription || product.description || product.shortDescription,
    image: imageUrls,
    sku: reference,
    brand: {
      "@type": "Brand",
      name: "Atelier LBF",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Atelier LBF",
      url: BASE_URL,
    },
    material: product.material,
    countryOfOrigin: {
      "@type": "Country",
      name: "France",
    },
    category: CATEGORY_LABELS[product.category] || product.category,
    offers: offersSchema,
    url: `${BASE_URL}/produits/${product.slug}`,
  };

  // AggregateRating (ajouté dynamiquement via reviewStats)
  if (reviewStats && reviewStats.count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewStats.average,
      reviewCount: reviewStats.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Dimensions
  if (product.weight) {
    schema.weight = {
      "@type": "QuantitativeValue",
      value: product.weight,
      unitCode: "KGM",
    };
  }
  if (product.height) {
    schema.height = {
      "@type": "QuantitativeValue",
      value: product.height,
      unitCode: "CMT",
    };
  }
  if (product.diameter) {
    schema.width = {
      "@type": "QuantitativeValue",
      value: product.diameter,
      unitCode: "CMT",
    };
  }

  // Propriétés additionnelles
  const additionalProperties: Array<{
    "@type": string;
    name: string;
    value: string;
  }> = [];

  if (product.thickness) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Épaisseur",
      value: `${product.thickness} mm`,
    });
  }
  if (product.bowlThickness) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Épaisseur cuve",
      value: `${product.bowlThickness} mm`,
    });
  }
  if (product.warranty) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Garantie",
      value: product.warranty,
    });
  }

  if (additionalProperties.length > 0) {
    schema.additionalProperty = additionalProperties;
  }

  return schema;
}

// ── BreadcrumbList ─────────────────────────────────────────────────────────

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export function generateProductBreadcrumb(product: Product) {
  const categoryLabel = CATEGORY_LABELS[product.category] || "Produits";
  return generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Nos produits", url: "/produits" },
    {
      name: categoryLabel,
      url: `/produits?category=${product.category}`,
    },
    { name: product.name, url: `/produits/${product.slug}` },
  ]);
}

// ── FAQPage ────────────────────────────────────────────────────────────────

export function generateFAQSchema(faqs: FAQItem[]) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ── BlogPosting (Article) ─────────────────────────────────────────────────

export function generateArticleSchema(article: {
  title: string;
  slug: string;
  excerpt: string | null;
  author: string;
  published_at: string | null;
  updated_at: string;
  featured_image?: { src: string; alt: string } | null;
  content?: string | null;
  read_time?: number | null;
}) {
  const wordCount = article.content
    ? article.content.split(/\s+/).filter(Boolean).length
    : undefined;

  // Collect all images: featured + inline from content
  const images: Array<{ "@type": string; url: string; caption?: string }> = [];

  if (article.featured_image) {
    images.push({
      "@type": "ImageObject",
      url: article.featured_image.src,
      caption: article.featured_image.alt,
    });
  }

  // Extract inline images from markdown content
  if (article.content) {
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    while ((match = imgRegex.exec(article.content)) !== null) {
      const alt = match[1];
      const src = match[2];
      if (src && !images.some((img) => img.url === src)) {
        images.push({
          "@type": "ImageObject",
          url: src,
          ...(alt ? { caption: alt } : {}),
        });
      }
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt || "",
    url: `${BASE_URL}/blog/${article.slug}`,
    datePublished: article.published_at || article.updated_at,
    dateModified: article.updated_at,
    ...(wordCount ? { wordCount } : {}),
    ...(article.read_time ? { timeRequired: `PT${article.read_time}M` } : {}),
    author: {
      "@type": "Organization",
      name: article.author || "Atelier LBF",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Atelier LBF",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo/Logo1.webp`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${article.slug}`,
    },
    ...(images.length === 1
      ? { image: images[0] }
      : images.length > 1
        ? { image: images }
        : {}),
  };
}

// ── Image ALT SEO ──────────────────────────────────────────────────────────

const VIEW_MAP: Record<string, string> = {
  face: "vue de face",
  avant: "vue de face",
  droite: "vue latérale droite",
  gauche: "vue latérale gauche",
  arriere: "vue arrière",
  arrière: "vue arrière",
  dessus: "vue de dessus",
  dessous: "vue de dessous",
  profil: "vue de profil",
};

export function generateProductImageAlt(
  product: { name: string; material: string; diameter: number; category: string },
  imageIndex: number,
  originalAlt: string
): string {
  const normalizedAlt = originalAlt.toLowerCase().trim();

  // Chercher la vue dans l'alt original
  let viewDescriptor = "";
  for (const [key, value] of Object.entries(VIEW_MAP)) {
    if (normalizedAlt.includes(key)) {
      viewDescriptor = value;
      break;
    }
  }

  // Image principale (index 0)
  if (imageIndex === 0) {
    const diameterStr = product.diameter ? ` ${product.diameter}cm` : "";
    return `${product.name} - Brasero artisanal ${product.material}${diameterStr} manufacturé en France | Atelier LBF`;
  }

  // Images secondaires
  if (viewDescriptor) {
    return `${product.name} ${viewDescriptor} - ${product.material} Made in France | Atelier LBF`;
  }

  // Fallback
  return `${product.name} - ${product.material} artisanal | Atelier LBF`;
}
