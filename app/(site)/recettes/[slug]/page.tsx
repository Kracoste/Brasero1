import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Users, ChefHat, ArrowLeft } from "lucide-react";

import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/Section";
import { generateBreadcrumbSchema, generateRecipeSchema } from "@/lib/seo/schemas";
import { getRecipe, getAllPublishedRecipes, RECIPE_CATEGORIES } from "@/lib/data/recipes";
import { getProduct } from "@/lib/data/products";
import { pickProductSlugForRecipe } from "@/lib/blog/product-matcher";

export const revalidate = 120;
export const dynamicParams = true;

type RecipePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) return {};

  const title = recipe.meta_title || `${recipe.title} — Recette au brasero plancha | Atelier LBF`;
  const description =
    recipe.meta_description ||
    recipe.excerpt ||
    `Recette ${recipe.title.toLowerCase()} au brasero plancha : ${recipe.prep_time_minutes + recipe.cook_time_minutes} min, ${recipe.servings} personnes. Ingrédients, étapes, astuces de l'atelier LBF.`;

  return {
    title,
    description,
    keywords: recipe.keywords,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
      url: `https://www.atelier-lbf.fr/recettes/${recipe.slug}`,
      images: recipe.featured_image
        ? [{ url: recipe.featured_image.src, alt: recipe.featured_image.alt }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: recipe.featured_image ? [recipe.featured_image.src] : undefined,
    },
    alternates: { canonical: `/recettes/${recipe.slug}` },
  };
}

export async function generateStaticParams() {
  const recipes = await getAllPublishedRecipes();
  return recipes.map((r) => ({ slug: r.slug }));
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) notFound();

  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const categoryLabel = RECIPE_CATEGORIES.find((c) => c.slug === recipe.category)?.label || recipe.category;

  // Produit recommandé : slug manuel si défini, sinon matcher auto selon le contenu
  const recommendedSlug =
    recipe.related_product_slug ||
    (await pickProductSlugForRecipe({
      slug: recipe.slug,
      title: recipe.title,
      description: recipe.description || recipe.excerpt || "",
      ingredients: recipe.ingredients.map((i) => i.name).filter(Boolean),
      instructions: recipe.instructions.map((i) => i.text).filter(Boolean),
      category: recipe.category,
    }));
  const relatedProduct = recommendedSlug ? await getProduct(recommendedSlug) : null;

  // Schemas
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Recettes", url: "/recettes" },
    { name: recipe.title, url: `/recettes/${recipe.slug}` },
  ]);

  const ingredientLines = recipe.ingredients.map((i) =>
    [i.quantity, i.unit, i.name].filter(Boolean).join(" ").trim(),
  );
  const instructionTexts = recipe.instructions.map((i) => i.text);

  const recipeSchema = generateRecipeSchema({
    name: recipe.title,
    description: recipe.excerpt || recipe.description.slice(0, 200),
    slug: recipe.slug,
    image: recipe.featured_image?.src,
    datePublished: recipe.published_at || recipe.created_at,
    prepTimeMinutes: recipe.prep_time_minutes,
    cookTimeMinutes: recipe.cook_time_minutes,
    servings: recipe.servings,
    category: categoryLabel,
    ingredients: ingredientLines,
    instructions: instructionTexts,
    keywords: recipe.keywords,
    author: recipe.author,
  });

  return (
    <Section className="pb-24 pt-6">
      <JsonLd data={breadcrumb} />
      <JsonLd data={recipeSchema} />

      <Container className="max-w-4xl space-y-8">
        <Link href="/recettes" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#0f172a]">
          <ArrowLeft size={16} />
          Toutes les recettes
        </Link>

        <header className="space-y-4">
          <span className="inline-block text-xs uppercase tracking-wide text-[#0f172a] font-semibold">
            {categoryLabel}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            {recipe.title}
          </h1>
          {recipe.excerpt && <p className="text-lg text-slate-600">{recipe.excerpt}</p>}

          <div className="flex flex-wrap gap-5 pt-2 text-sm text-slate-600 border-y border-slate-200 py-4">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={16} className="text-[#0f172a]" />
              <span>
                <strong className="text-slate-900">{totalTime} min</strong> ({recipe.prep_time_minutes} prép + {recipe.cook_time_minutes} cuisson)
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={16} className="text-[#0f172a]" />
              <span>
                Pour <strong className="text-slate-900">{recipe.servings} personnes</strong>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ChefHat size={16} className="text-[#0f172a]" />
              <span className="capitalize">
                Difficulté : <strong className="text-slate-900">{recipe.difficulty}</strong>
              </span>
            </span>
          </div>
        </header>

        {recipe.featured_image?.src && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={recipe.featured_image.src}
              alt={recipe.featured_image.alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        <div className="prose prose-slate max-w-none whitespace-pre-line">{recipe.description}</div>

        <div className="grid gap-8 md:grid-cols-[1fr_2fr] pt-4">
          <aside className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-slate-900">Ingrédients</h2>
            <ul className="space-y-2 text-sm text-slate-700 bg-[#f1f5f9] rounded-xl p-5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-semibold text-[#0f172a] whitespace-nowrap">
                    {ing.quantity} {ing.unit}
                  </span>
                  <span>{ing.name}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-slate-900">Préparation</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((inst) => (
                <li key={inst.step} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-semibold text-sm">
                    {inst.step}
                  </span>
                  <p className="text-slate-700 pt-1">{inst.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.tips && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 space-y-2">
            <h2 className="font-display text-lg font-semibold text-slate-900">Les astuces de l&apos;atelier</h2>
            <p className="text-sm text-slate-700 whitespace-pre-line">{recipe.tips}</p>
          </div>
        )}

        {relatedProduct && (
          <div className="rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#6d3610] p-8 text-white space-y-3">
            <p className="text-sm uppercase tracking-wide opacity-80">Pour réussir cette recette</p>
            <h2 className="font-display text-2xl font-semibold">{relatedProduct.name}</h2>
            <p className="text-sm opacity-90">{relatedProduct.shortDescription}</p>
            <Link
              href={`/produits/${relatedProduct.slug}`}
              className="inline-flex items-center gap-2 bg-white text-[#0f172a] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-colors"
            >
              Voir ce produit
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}
