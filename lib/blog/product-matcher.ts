import { createClient as createSupabaseJsClient, type SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

let publicReadClient: SupabaseClient | null = null;
function getPublicReadClient(): SupabaseClient {
  if (publicReadClient) return publicReadClient;
  publicReadClient = createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }) },
    },
  );
  return publicReadClient;
}

async function getReadClient() {
  try {
    return await createClient();
  } catch {
    return getPublicReadClient();
  }
}

/**
 * Matche un article de blog avec le brasero le plus pertinent.
 *
 * Positionnement gamme :
 * - Le Coffy   → entrée de gamme, premier brasero, petit budget, balcon
 * - Le Fermier → famille, jardin, convivial, recettes, particulier classique
 * - L'Obélix   → restaurant sobre/épuré, CHR, professionnel fonctionnel (taille 100)
 * - Le Morris  → restaurant design/iconique, haut de gamme pro, premium (taille 100)
 *
 * L'idée : varier les recommandations selon le sujet réel de l'article
 * pour éviter la sur-poussée d'un seul produit (bon pour le SEO et l'utilisateur).
 */

type ModelKey = "coffy" | "fermier" | "obelix" | "morris";

type Rule = {
  model: ModelKey;
  keywords: string[];
  weight: number;
};

const RULES: Rule[] = [
  // Coffy — entrée de gamme, accessible
  {
    model: "coffy",
    weight: 3,
    keywords: [
      "premier brasero",
      "débuter",
      "débutant",
      "petit budget",
      "pas cher",
      "entrée de gamme",
      "abordable",
      "découverte",
      "balcon",
      "petit espace",
      "petit jardin",
      "appartement",
      "compact",
    ],
  },
  // Fermier — famille / particulier classique
  {
    model: "fermier",
    weight: 3,
    keywords: [
      "famille",
      "familial",
      "weekend",
      "convivial",
      "conviviale",
      "jardin",
      "recette",
      "recettes",
      "barbecue familial",
      "repas du dimanche",
      "entre amis",
      "traditionnel",
      "rustique",
      "champêtre",
      "terrasse",
    ],
  },
  // Obélix — pro sobre, fonctionnel
  {
    model: "obelix",
    weight: 4,
    keywords: [
      "restaurant",
      "restaurateur",
      "professionnel",
      "professionnelle",
      "chr",
      "cafés hôtels restaurants",
      "brasserie",
      "traiteur",
      "cantine",
      "collectivité",
      "grande capacité",
      "service continu",
      "robuste",
      "fonctionnel",
    ],
  },
  // Morris — pro design, iconique, premium
  {
    model: "morris",
    weight: 5, // léger bonus pour que "restaurant design/iconique" l'emporte sur obelix
    keywords: [
      "iconique",
      "design",
      "designer",
      "architecte",
      "premium",
      "haut de gamme",
      "signature",
      "événement",
      "événementiel",
      "mariage",
      "restaurant étoilé",
      "chef étoilé",
      "restaurant gastronomique",
      "prestige",
      "exclusif",
      "rooftop",
    ],
  },
];

function scoreText(text: string): Record<ModelKey, number> {
  const lower = text.toLowerCase();
  const scores: Record<ModelKey, number> = { coffy: 0, fermier: 0, obelix: 0, morris: 0 };

  for (const rule of RULES) {
    for (const kw of rule.keywords) {
      const matches = lower.split(kw).length - 1;
      if (matches > 0) {
        scores[rule.model] += matches * rule.weight;
      }
    }
  }
  return scores;
}

/**
 * Fallback déterministe (hash du slug) pour varier si aucun score ne se démarque.
 * Évite que tous les articles sans mots-clés retombent sur le même produit.
 */
function fallbackByHash(slug: string): ModelKey {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const models: ModelKey[] = ["fermier", "coffy", "obelix", "morris"];
  return models[Math.abs(hash) % models.length];
}

export function pickModelForArticle(input: {
  slug: string;
  title: string;
  content: string;
  category?: string;
}): ModelKey {
  const text = `${input.title}\n${input.title}\n${input.content}`;
  const scores = scoreText(text);

  let best: ModelKey = "fermier";
  let bestScore = -1;
  for (const key of Object.keys(scores) as ModelKey[]) {
    if (scores[key] > bestScore) {
      bestScore = scores[key];
      best = key;
    }
  }

  if (bestScore <= 0) {
    return fallbackByHash(input.slug);
  }
  return best;
}

/**
 * Résout le slug Supabase réel du modèle (cherche par pattern sur le slug).
 * Les slugs DB peuvent varier (le-fermier, l-obelix, etc.), on fait un ILIKE.
 */
export async function resolveProductSlug(model: ModelKey): Promise<string | null> {
  const supabase = await getReadClient();
  const patterns: Record<ModelKey, string> = {
    coffy: "%coffy%",
    fermier: "%fermier%",
    obelix: "%obelix%",
    morris: "%morris%",
  };

  const { data } = await supabase
    .from("products")
    .select("slug")
    .ilike("slug", patterns[model])
    .limit(1)
    .maybeSingle();

  return data?.slug ?? null;
}

export async function pickProductSlugForArticle(input: {
  slug: string;
  title: string;
  content: string;
  category?: string;
}): Promise<string | null> {
  const model = pickModelForArticle(input);
  return resolveProductSlug(model);
}

/**
 * Version recette : titre + description + ingrédients + instructions + catégorie.
 * Utilise le même scoring de mots-clés que pour les articles.
 */
export async function pickProductSlugForRecipe(input: {
  slug: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category?: string;
}): Promise<string | null> {
  const content = [
    input.description,
    input.category ?? "",
    input.ingredients.join(" "),
    input.instructions.join(" "),
  ].join("\n");

  const model = pickModelForArticle({
    slug: input.slug,
    title: input.title,
    content,
    category: input.category,
  });
  return resolveProductSlug(model);
}
