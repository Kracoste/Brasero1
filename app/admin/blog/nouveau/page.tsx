'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    category: 'guide',
    excerpt: '',
    content: '',
    author: "L'équipe LBF",
    read_time: 5,
    tags: '',
    related_products: '',
    cta_product_slug: '',
    cta_text: '',
    is_published: false,
  });

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function handleTitleChange(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim())
        : [],
      related_products: form.related_products
        ? form.related_products.split(',').map((t) => t.trim())
        : [],
      published_at: form.is_published ? new Date().toISOString() : null,
    };

    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/blog/${data.id}`);
    } else {
      const err = await res.json();
      alert(`Erreur: ${err.error}`);
      setSaving(false);
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/blog"
          className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Nouvel article</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Titre *
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            placeholder="Comment culotter une plancha en acier carbone"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Slug URL
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Category + Read time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Catégorie
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            >
              <option value="cuisson">Cuisson</option>
              <option value="guide">Guide</option>
              <option value="entretien">Entretien</option>
              <option value="inspiration">Inspiration</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Temps de lecture (min)
            </label>
            <input
              type="number"
              min={1}
              value={form.read_time}
              onChange={(e) =>
                setForm({ ...form, read_time: parseInt(e.target.value) || 5 })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Meta title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Meta Title SEO
          </label>
          <input
            type="text"
            value={form.meta_title}
            onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            placeholder="Laisser vide pour utiliser le titre"
          />
          <p className="text-xs text-slate-400 mt-1">
            {(form.meta_title || form.title).length}/60 caractères
          </p>
        </div>

        {/* Meta description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Meta Description SEO
          </label>
          <textarea
            rows={2}
            value={form.meta_description}
            onChange={(e) =>
              setForm({ ...form, meta_description: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            placeholder="Description pour Google (max 160 car.)"
          />
          <p className="text-xs text-slate-400 mt-1">
            {form.meta_description.length}/160 caractères
          </p>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Extrait (chapô)
          </label>
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            placeholder="Résumé affiché dans la liste des articles et en haut de l'article"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contenu (Markdown) *
          </label>
          <textarea
            rows={20}
            required
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none font-mono text-sm"
            placeholder="## Titre de section&#10;&#10;Paragraphe de texte avec **gras** et [lien](/url).&#10;&#10;- Point 1&#10;- Point 2"
          />
          <p className="text-xs text-slate-400 mt-1">
            Markdown supporté : ## H2, ### H3, **gras**, - listes,
            [texte](/lien)
          </p>
        </div>

        {/* Related products */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Produits liés (slugs, séparés par des virgules)
          </label>
          <input
            type="text"
            value={form.related_products}
            onChange={(e) =>
              setForm({ ...form, related_products: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            placeholder="brasero-acier-100-l-obelix, brasero-en-acier-80-lemorris"
          />
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              CTA — Slug produit
            </label>
            <input
              type="text"
              value={form.cta_product_slug}
              onChange={(e) =>
                setForm({ ...form, cta_product_slug: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
              placeholder="brasero-acier-100-l-obelix"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              CTA — Texte
            </label>
            <input
              type="text"
              value={form.cta_text}
              onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
              placeholder="Découvrir L'Obélix →"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tags (séparés par des virgules)
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            placeholder="plancha, acier carbone, entretien"
          />
        </div>

        {/* Publish toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_published"
            checked={form.is_published}
            onChange={(e) =>
              setForm({ ...form, is_published: e.target.checked })
            }
            className="w-4 h-4 accent-[#8B4513]"
          />
          <label htmlFor="is_published" className="text-sm text-slate-700">
            Publier immédiatement
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#8B4513] text-white px-6 py-2.5 rounded-lg hover:bg-[#6d3610] transition-colors font-medium disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link
            href="/admin/blog"
            className="px-6 py-2.5 text-slate-600 hover:text-slate-900 transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
