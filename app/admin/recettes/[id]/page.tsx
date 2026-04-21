'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Upload, Loader2, X, Plus, Trash2 } from 'lucide-react';

type Ingredient = { quantity: string; unit: string; name: string };
type Instruction = { step: number; text: string };

type Recipe = {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  category: string;
  excerpt: string | null;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tips: string | null;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  difficulty: string;
  featured_image: { src: string; alt: string } | null;
  related_product_slug: string | null;
  tags: string[];
  keywords: string[];
  is_published: boolean;
  author: string;
};

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!params.id) return;
    fetch('/api/admin/recipes')
      .then((r) => r.json())
      .then((data: Recipe[]) => {
        const found = data.find((r) => r.id === params.id);
        if (found) setRecipe(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  function update<K extends keyof Recipe>(field: K, value: Recipe[K]) {
    setRecipe((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleImageUpload(file: File) {
    if (!recipe) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `${recipe.slug}/${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, '-')}`);
      formData.append('bucket', 'recipes');

      const res = await fetch('/api/admin/storage/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        alert(`Erreur upload : ${data.error}`);
        return;
      }
      update('featured_image', { src: data.publicUrl, alt: recipe.featured_image?.alt || recipe.title });
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!recipe) return;
    setSaving(true);
    const res = await fetch('/api/admin/recipes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...recipe }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(`Erreur : ${err.error}`);
    } else {
      router.push('/admin/recettes');
    }
    setSaving(false);
  }

  function addIngredient() {
    if (!recipe) return;
    update('ingredients', [...recipe.ingredients, { quantity: '', unit: '', name: '' }]);
  }
  function removeIngredient(idx: number) {
    if (!recipe) return;
    update('ingredients', recipe.ingredients.filter((_, i) => i !== idx));
  }
  function updateIngredient(idx: number, field: keyof Ingredient, value: string) {
    if (!recipe) return;
    update('ingredients', recipe.ingredients.map((ing, i) => (i === idx ? { ...ing, [field]: value } : ing)));
  }

  function addInstruction() {
    if (!recipe) return;
    update('instructions', [...recipe.instructions, { step: recipe.instructions.length + 1, text: '' }]);
  }
  function removeInstruction(idx: number) {
    if (!recipe) return;
    const newList = recipe.instructions.filter((_, i) => i !== idx).map((inst, i) => ({ ...inst, step: i + 1 }));
    update('instructions', newList);
  }
  function updateInstruction(idx: number, text: string) {
    if (!recipe) return;
    update('instructions', recipe.instructions.map((inst, i) => (i === idx ? { ...inst, text } : inst)));
  }

  if (loading) return <div className="p-8 text-slate-500">Chargement...</div>;
  if (!recipe) return <div className="p-8 text-slate-500">Recette introuvable.</div>;

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <Link href="/admin/recettes" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#8B4513] mb-6">
        <ArrowLeft size={16} /> Retour aux recettes
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{recipe.title}</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#8B4513] text-white px-5 py-2.5 rounded-lg hover:bg-[#6d3610] disabled:opacity-50 text-sm font-medium"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Enregistrer
        </button>
      </div>

      <div className="space-y-6">
        {/* Image */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">Image principale</label>
          {recipe.featured_image?.src ? (
            <div className="space-y-3">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-100">
                <Image src={recipe.featured_image.src} alt={recipe.featured_image.alt} fill className="object-cover" sizes="800px" />
                <button
                  onClick={() => update('featured_image', null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
              <input
                type="text"
                value={recipe.featured_image.alt}
                onChange={(e) => update('featured_image', { src: recipe.featured_image!.src, alt: e.target.value })}
                placeholder="Texte alternatif (important pour SEO)"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-sm text-[#8B4513] hover:underline"
              >
                Remplacer l&apos;image
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full aspect-[16/10] border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-[#8B4513] hover:text-[#8B4513] transition-colors"
            >
              {uploading ? (
                <Loader2 size={32} className="animate-spin" />
              ) : (
                <>
                  <Upload size={32} />
                  <span className="text-sm font-medium">Cliquer pour uploader</span>
                  <span className="text-xs">JPG, PNG, WebP — max 10 Mo</span>
                </>
              )}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = '';
            }}
          />
        </div>

        {/* Champs principaux */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Titre</label>
            <input
              type="text"
              value={recipe.title}
              onChange={(e) => update('title', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Slug URL</label>
              <input
                type="text"
                value={recipe.slug}
                onChange={(e) => update('slug', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Catégorie</label>
              <select
                value={recipe.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="viandes">Viandes</option>
                <option value="poissons">Poissons</option>
                <option value="legumes">Légumes</option>
                <option value="desserts">Desserts</option>
                <option value="brunch">Brunch</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Prép (min)</label>
              <input
                type="number"
                value={recipe.prep_time_minutes}
                onChange={(e) => update('prep_time_minutes', parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Cuisson (min)</label>
              <input
                type="number"
                value={recipe.cook_time_minutes}
                onChange={(e) => update('cook_time_minutes', parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Personnes</label>
              <input
                type="number"
                value={recipe.servings}
                onChange={(e) => update('servings', parseInt(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Difficulté</label>
              <select
                value={recipe.difficulty}
                onChange={(e) => update('difficulty', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="facile">Facile</option>
                <option value="moyen">Moyen</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Extrait (description courte)</label>
            <textarea
              value={recipe.excerpt || ''}
              onChange={(e) => update('excerpt', e.target.value)}
              rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Description complète</label>
            <textarea
              value={recipe.description}
              onChange={(e) => update('description', e.target.value)}
              rows={6}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Ingrédients */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Ingrédients</h2>
            <button onClick={addIngredient} className="text-sm text-[#8B4513] hover:underline inline-flex items-center gap-1">
              <Plus size={14} /> Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(i, 'quantity', e.target.value)}
                  placeholder="Qté"
                  className="w-20 border border-slate-300 rounded px-2 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
                  placeholder="unité"
                  className="w-24 border border-slate-300 rounded px-2 py-1.5 text-sm"
                />
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                  placeholder="Ingrédient"
                  className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm"
                />
                <button onClick={() => removeIngredient(i)} className="text-red-500 hover:text-red-700 p-1.5">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Étapes */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Étapes de préparation</h2>
            <button onClick={addInstruction} className="text-sm text-[#8B4513] hover:underline inline-flex items-center gap-1">
              <Plus size={14} /> Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {recipe.instructions.map((inst, i) => (
              <div key={i} className="flex gap-2">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8B4513] text-white flex items-center justify-center text-sm font-semibold">
                  {inst.step}
                </span>
                <textarea
                  value={inst.text}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                  rows={2}
                  className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm"
                />
                <button onClick={() => removeInstruction(i)} className="text-red-500 hover:text-red-700 p-1.5">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Astuces + produit lié */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Astuces du chef</label>
            <textarea
              value={recipe.tips || ''}
              onChange={(e) => update('tips', e.target.value)}
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Produit Atelier LBF recommandé (slug)
            </label>
            <input
              type="text"
              value={recipe.related_product_slug || ''}
              onChange={(e) => update('related_product_slug', e.target.value)}
              placeholder="ex: brasero-obelix-80"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">SEO</h2>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Meta title</label>
            <input
              type="text"
              value={recipe.meta_title || ''}
              onChange={(e) => update('meta_title', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Meta description</label>
            <textarea
              value={recipe.meta_description || ''}
              onChange={(e) => update('meta_description', e.target.value)}
              rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
