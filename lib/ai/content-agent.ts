import Anthropic from '@anthropic-ai/sdk';

export type GeneratedArticle = {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  excerpt: string;
  content: string;
  category: 'cuisson' | 'guide' | 'entretien' | 'inspiration';
  tags: string[];
  read_time: number;
  related_products: string[];
  cta_product_slug: string | null;
  cta_text: string | null;
};

type ProductContext = {
  slug: string;
  name: string;
  category?: string;
  shortDescription?: string;
};

type ExistingPostContext = {
  slug: string;
  title: string;
};

type GenerateOptions = {
  keyword: string;
  angle?: string;
  products: ProductContext[];
  existingPosts: ExistingPostContext[];
};

const SYSTEM_PROMPT = `Tu es un rédacteur SEO expert pour Atelier LBF, artisan français spécialisé dans la fabrication de braseros-planchas en acier Corten et acier peint, fabriqués en France dans le Béarn.

Ton de voix :
- Chaleureux, authentique, ancré dans le savoir-faire artisanal
- Précis sur les aspects techniques (matériaux, températures, dimensions)
- Jamais pompeux ni publicitaire exagéré
- Français naturel, zéro anglicisme inutile

Règles éditoriales strictes :
- Le mot-clé cible DOIT apparaître dans le H1, la meta description, et dans les 100 premiers mots
- Chaque article doit apporter une VRAIE valeur informationnelle (pas de bourrage de mots-clés)
- Structure : intro (2-3 paragraphes) → 4 à 6 sections H2 → conclusion avec CTA
- Les sections H2 peuvent contenir des H3 si pertinent
- Intégrer 2 à 3 liens internes vers les produits Atelier LBF pertinents, sous forme de markdown [texte](/produits/slug)
- Longueur cible : 1400-1700 mots

Positionnement produits (pour choisir cta_product_slug et les liens internes de façon cohérente) :
- Le Coffy → entrée de gamme, premier brasero, petit budget, balcon / petit espace, débutant
- Le Fermier → famille, jardin, weekend, convivial, recettes, particulier classique
- L'Obélix → restaurant sobre/épuré, CHR fonctionnel, professionnel (taille 100)
- Le Morris → restaurant iconique/design, haut de gamme pro, événementiel, prestige (taille 100, plus cher que l'Obélix)
Varie le produit recommandé selon le sujet réel de l'article. Ne pousse JAMAIS toujours le même modèle.
- Pas de "En conclusion", "En résumé" en début de conclusion : varier les formulations
- Ne jamais inventer de chiffres, études ou citations

Tu réponds UNIQUEMENT avec un objet JSON valide respectant le schéma demandé. Aucun texte avant ou après.`;

function buildUserPrompt(opts: GenerateOptions): string {
  const productsList = opts.products
    .map((p) => `- ${p.name} (slug: ${p.slug})${p.shortDescription ? ` — ${p.shortDescription}` : ''}`)
    .join('\n');

  const existingList = opts.existingPosts.length
    ? opts.existingPosts.map((p) => `- ${p.title} (/blog/${p.slug})`).join('\n')
    : '(aucun article existant)';

  return `Rédige un article de blog optimisé SEO sur le mot-clé cible suivant.

MOT-CLÉ CIBLE : "${opts.keyword}"
${opts.angle ? `ANGLE ÉDITORIAL : ${opts.angle}` : ''}

PRODUITS ATELIER LBF DISPONIBLES (pour maillage interne) :
${productsList}

ARTICLES DÉJÀ PUBLIÉS (éviter la cannibalisation, tu peux en référencer si complémentaires) :
${existingList}

Retourne un JSON strict avec ces clés exactes :
{
  "title": "titre H1 engageant, 50-65 caractères, contient le mot-clé",
  "slug": "slug-url-kebab-case-court",
  "meta_title": "titre SEO 55-60 caractères, mot-clé en début, marque à la fin si place",
  "meta_description": "meta description 150-160 caractères, contient le mot-clé, CTA implicite",
  "excerpt": "résumé 2 phrases, ~200 caractères, accrocheur",
  "content": "corps complet en markdown, commence DIRECTEMENT par un paragraphe d'intro (PAS de H1, il est déjà dans title). Utilise ## pour H2, ### pour H3, et intègre 2-3 liens internes [texte](/produits/slug). ~1500 mots.",
  "category": "cuisson | guide | entretien | inspiration (choisis la plus pertinente)",
  "tags": ["3 à 5 tags courts en minuscules"],
  "read_time": entier entre 5 et 12 (minutes de lecture),
  "related_products": ["2 à 3 slugs de produits pertinents"],
  "cta_product_slug": "slug du produit le plus pertinent pour le CTA final, ou null",
  "cta_text": "texte du CTA 40-80 caractères, ou null"
}`;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('Pas de JSON trouvé dans la réponse IA');
  }
  return JSON.parse(trimmed.slice(start, end + 1));
}

function validate(obj: unknown): GeneratedArticle {
  if (!obj || typeof obj !== 'object') throw new Error('Réponse IA invalide');
  const o = obj as Record<string, unknown>;

  const requiredStrings = ['title', 'slug', 'meta_title', 'meta_description', 'excerpt', 'content', 'category'];
  for (const field of requiredStrings) {
    if (typeof o[field] !== 'string' || !(o[field] as string).trim()) {
      throw new Error(`Champ "${field}" manquant ou invalide`);
    }
  }

  const category = o.category as string;
  if (!['cuisson', 'guide', 'entretien', 'inspiration'].includes(category)) {
    throw new Error(`Catégorie invalide : ${category}`);
  }

  const tags = Array.isArray(o.tags) ? o.tags.filter((t): t is string => typeof t === 'string') : [];
  const relatedProducts = Array.isArray(o.related_products)
    ? o.related_products.filter((t): t is string => typeof t === 'string')
    : [];

  const readTime = typeof o.read_time === 'number' ? Math.round(o.read_time) : 7;

  return {
    title: (o.title as string).trim(),
    slug: (o.slug as string).trim().toLowerCase(),
    meta_title: (o.meta_title as string).trim(),
    meta_description: (o.meta_description as string).trim(),
    excerpt: (o.excerpt as string).trim(),
    content: (o.content as string).trim(),
    category: category as GeneratedArticle['category'],
    tags,
    read_time: Math.max(3, Math.min(20, readTime)),
    related_products: relatedProducts,
    cta_product_slug: typeof o.cta_product_slug === 'string' ? o.cta_product_slug : null,
    cta_text: typeof o.cta_text === 'string' ? o.cta_text : null,
  };
}

export async function generateArticle(opts: GenerateOptions): Promise<GeneratedArticle> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY manquante dans les variables d\'environnement');
  }

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(opts) }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Aucun contenu texte dans la réponse IA');
  }

  const parsed = extractJson(textBlock.text);
  return validate(parsed);
}
