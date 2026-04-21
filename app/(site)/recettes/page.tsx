import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, ChefHat } from "lucide-react";

import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/Section";
import { generateBreadcrumbSchema } from "@/lib/seo/schemas";
import { getAllPublishedRecipes, RECIPE_CATEGORIES } from "@/lib/data/recipes";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Recettes au brasero plancha : viandes, poissons, légumes | Atelier LBF",
  description:
    "Découvrez nos recettes testées au brasero plancha : côte de bœuf, magret, bar grillé, Saint-Jacques, légumes rôtis. Temps de cuisson, marinades et astuces d'atelier.",
  keywords: [
    "recette brasero",
    "recette plancha",
    "cuisson brasero plancha",
    "recette feu de bois",
    "grillades brasero",
    "plancha acier carbone recette",
  ],
  openGraph: {
    title: "Recettes au brasero plancha | Atelier LBF",
    description: "Des recettes simples et précises pour cuisiner au brasero comme un chef.",
    type: "website",
    locale: "fr_FR",
  },
  alternates: { canonical: "/recettes" },
};

export default async function RecettesPage() {
  const recipes = await getAllPublishedRecipes();
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Recettes au brasero", url: "/recettes" },
  ]);

  const recipesByCategory = RECIPE_CATEGORIES.map((cat) => ({
    ...cat,
    recipes: recipes.filter((r) => r.category === cat.slug),
  })).filter((cat) => cat.recipes.length > 0);

  return (
    <Section className="pb-24 pt-10">
      <JsonLd data={breadcrumb} />
      <Container className="space-y-10">
        <div className="space-y-3 max-w-3xl">
          <p className="text-sm uppercase tracking-wide text-slate-500">Recettes</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900">
            Recettes au brasero plancha
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Des recettes testées dans notre atelier, pensées pour la cuisson au feu de bois et à la plancha.
            Viandes saisies, poissons délicats, légumes caramélisés — chaque recette indique temps de cuisson,
            ingrédients et astuces pour réussir à tous les coups.
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">Nos recettes arrivent très bientôt.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {recipesByCategory.map((cat) => (
              <section key={cat.slug} id={cat.slug} className="space-y-5">
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">{cat.label}</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.recipes.map((recipe) => {
                    const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
                    return (
                      <Link
                        key={recipe.id}
                        href={`/recettes/${recipe.slug}`}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <div className="relative aspect-[4/3] bg-slate-100">
                          {recipe.featured_image?.src ? (
                            <Image
                              src={recipe.featured_image.src}
                              alt={recipe.featured_image.alt}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                              <ChefHat size={40} />
                            </div>
                          )}
                        </div>
                        <div className="p-5 space-y-2">
                          <h3 className="font-semibold text-slate-900 group-hover:text-[#8B4513] transition-colors">
                            {recipe.title}
                          </h3>
                          {recipe.excerpt && (
                            <p className="text-sm text-slate-600 line-clamp-2">{recipe.excerpt}</p>
                          )}
                          <div className="flex items-center gap-4 pt-1 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Clock size={14} /> {totalTime} min
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Users size={14} /> {recipe.servings} pers.
                            </span>
                            <span className="capitalize text-[#8B4513] font-medium">{recipe.difficulty}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
