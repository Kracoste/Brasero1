'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Trash2, Eye, EyeOff, ChefHat, Clock } from 'lucide-react';

type Recipe = {
  id: string;
  slug: string;
  title: string;
  category: string;
  is_published: boolean;
  published_at: string | null;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  featured_image: { src: string; alt: string } | null;
  created_at: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  viandes: 'Viandes',
  poissons: 'Poissons',
  legumes: 'Légumes',
  desserts: 'Desserts',
  brunch: 'Brunch',
};

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/recipes')
      .then((r) => r.json())
      .then((data) => {
        setRecipes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function togglePublish(recipe: Recipe) {
    const newState = !recipe.is_published;
    await fetch('/api/admin/recipes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: recipe.id,
        is_published: newState,
        ...(newState && !recipe.published_at ? { published_at: new Date().toISOString() } : {}),
      }),
    });
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === recipe.id
          ? { ...r, is_published: newState, published_at: newState ? r.published_at || new Date().toISOString() : r.published_at }
          : r,
      ),
    );
  }

  async function deleteRecipe(id: string) {
    if (!confirm('Supprimer cette recette ?')) return;
    await fetch('/api/admin/recipes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ChefHat size={24} className="text-[#8B4513]" /> Recettes
          </h1>
          <p className="text-slate-600 mt-1">
            {recipes.length} recette{recipes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Chargement...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <ChefHat size={40} className="mx-auto text-slate-400 mb-3" />
          <p className="text-slate-500 mb-2">Aucune recette pour le moment.</p>
          <p className="text-xs text-slate-400">Les recettes sont créées via la base de données puis éditables ici.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-sm text-slate-600">
                <th className="px-4 py-3 font-medium">Recette</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Catégorie</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Temps / Pers.</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {recipe.featured_image?.src ? (
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                          <Image src={recipe.featured_image.src} alt={recipe.featured_image.alt} fill className="object-cover" sizes="48px" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <ChefHat size={20} className="text-slate-400" />
                        </div>
                      )}
                      <div>
                        <Link href={`/admin/recettes/${recipe.id}`} className="font-medium text-slate-900 hover:text-[#8B4513]">
                          {recipe.title}
                        </Link>
                        <span className="block text-xs text-slate-400 mt-0.5">/recettes/{recipe.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-[#f6f1e9] text-[#8B4513] px-2 py-1 rounded">
                      {CATEGORY_LABELS[recipe.category] || recipe.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                    </span>{' '}
                    · {recipe.servings} pers.
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(recipe)}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                        recipe.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {recipe.is_published ? (
                        <>
                          <Eye size={12} /> Publié
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} /> Brouillon
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/recettes/${recipe.id}`} className="p-1.5 text-slate-400 hover:text-[#8B4513]" title="Modifier">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => deleteRecipe(recipe.id)} className="p-1.5 text-slate-400 hover:text-red-500" title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
