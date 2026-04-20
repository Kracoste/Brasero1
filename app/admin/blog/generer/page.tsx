'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Save, Loader2 } from 'lucide-react';

type GeneratedArticle = {
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  read_time: number;
  related_products: string[];
  cta_product_slug: string | null;
  cta_text: string | null;
};

export default function GenerateBlogPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [angle, setAngle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<GeneratedArticle | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setGenerating(true);
    setError(null);
    setArticle(null);

    try {
      const res = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim(), angle: angle.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur génération');
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setGenerating(false);
    }
  }

  function updateField<K extends keyof GeneratedArticle>(field: K, value: GeneratedArticle[K]) {
    setArticle((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleSaveDraft() {
    if (!article) return;
    setSaving(true);
    setError(null);

    const payload = {
      ...article,
      is_published: false,
      published_at: null,
    };

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur sauvegarde');
      router.push(`/admin/blog/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setSaving(false);
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#8B4513] mb-6"
      >
        <ArrowLeft size={16} />
        Retour au blog
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-[#8B4513]" size={24} />
          Générer un article avec l&apos;IA
        </h1>
        <p className="text-slate-600 mt-1">
          L&apos;IA rédige un brouillon SEO-optimisé. Tu relis, tu ajustes, tu publies.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Mot-clé cible <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="ex: comment allumer un brasero"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
            maxLength={200}
            required
            disabled={generating}
          />
          <p className="text-xs text-slate-500 mt-1">
            La requête exacte que tu veux cibler dans Google
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Angle éditorial <span className="text-slate-400">(optionnel)</span>
          </label>
          <input
            type="text"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            placeholder="ex: guide pratique pour débutants"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#8B4513] focus:border-transparent"
            maxLength={500}
            disabled={generating}
          />
        </div>

        <button
          type="submit"
          disabled={generating || !keyword.trim()}
          className="inline-flex items-center gap-2 bg-[#8B4513] text-white px-5 py-2.5 rounded-lg hover:bg-[#6d3610] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Génération en cours (30-60s)...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Générer l&apos;article
            </>
          )}
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
            {error}
          </p>
        )}
      </form>

      {article && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Aperçu du brouillon</h2>
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#8B4513] text-white px-4 py-2 rounded-lg hover:bg-[#6d3610] transition-colors text-sm font-medium disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Enregistrer comme brouillon
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Titre (H1)</label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            />
            <span className="text-xs text-slate-400">{article.title.length} caractères</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Slug URL</label>
              <input
                type="text"
                value={article.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Catégorie</label>
              <select
                value={article.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              >
                <option value="guide">Guide</option>
                <option value="cuisson">Cuisson</option>
                <option value="entretien">Entretien</option>
                <option value="inspiration">Inspiration</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Meta title</label>
            <input
              type="text"
              value={article.meta_title}
              onChange={(e) => updateField('meta_title', e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            />
            <span className="text-xs text-slate-400">{article.meta_title.length} caractères (idéal : 55-60)</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Meta description</label>
            <textarea
              value={article.meta_description}
              onChange={(e) => updateField('meta_description', e.target.value)}
              rows={2}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            />
            <span className="text-xs text-slate-400">{article.meta_description.length} caractères (idéal : 150-160)</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Extrait</label>
            <textarea
              value={article.excerpt}
              onChange={(e) => updateField('excerpt', e.target.value)}
              rows={2}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Contenu (markdown) — {article.content.split(/\s+/).length} mots, ~{article.read_time} min
            </label>
            <textarea
              value={article.content}
              onChange={(e) => updateField('content', e.target.value)}
              rows={20}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-[#f6f1e9] text-[#8B4513] px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Produits liés</label>
              <div className="flex flex-wrap gap-1.5">
                {article.related_products.map((slug) => (
                  <span key={slug} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">
                    {slug}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {article.cta_product_slug && (
            <div className="bg-[#f6f1e9] border border-[#e8dcc8] rounded p-3">
              <div className="text-xs font-medium text-[#8B4513] mb-1">CTA final proposé</div>
              <div className="text-sm text-slate-800">
                {article.cta_text} → <span className="font-mono text-xs">/produits/{article.cta_product_slug}</span>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            💡 Après enregistrement, tu pourras ajouter l&apos;image de couverture et publier depuis la page d&apos;édition.
          </p>
        </div>
      )}
    </div>
  );
}
