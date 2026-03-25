'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { BlogFeaturedImageUpload } from '@/components/admin/BlogImageUpload';
import BlogContentEditor from '@/components/admin/BlogContentEditor';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  category: string;
  content: string;
  excerpt: string | null;
  author: string;
  published_at: string | null;
  is_published: boolean;
  read_time: number;
  tags: string[];
  related_products: string[];
  cta_product_slug: string | null;
  cta_text: string | null;
  featured_image: { src: string; alt: string } | null;
};

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [featuredImage, setFeaturedImage] = useState<{ src: string; alt: string } | null>(null);
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
    published_at: null as string | null,
  });

  useEffect(() => {
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then((posts: BlogPost[]) => {
        const post = posts.find((p) => p.id === id);
        if (post) {
          setForm({
            title: post.title,
            slug: post.slug,
            meta_title: post.meta_title || '',
            meta_description: post.meta_description || '',
            category: post.category,
            excerpt: post.excerpt || '',
            content: post.content,
            author: post.author,
            read_time: post.read_time,
            tags: (post.tags || []).join(', '),
            related_products: (post.related_products || []).join(', '),
            cta_product_slug: post.cta_product_slug || '',
            cta_text: post.cta_text || '',
            is_published: post.is_published,
            published_at: post.published_at,
          });
          setFeaturedImage(post.featured_image || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      id,
      title: form.title,
      slug: form.slug,
      featured_image: featuredImage,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      category: form.category,
      excerpt: form.excerpt || null,
      content: form.content,
      author: form.author,
      read_time: form.read_time,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      related_products: form.related_products
        ? form.related_products.split(',').map((t) => t.trim())
        : [],
      cta_product_slug: form.cta_product_slug || null,
      cta_text: form.cta_text || null,
      is_published: form.is_published,
      ...(form.is_published && !form.published_at
        ? { published_at: new Date().toISOString() }
        : {}),
    };

    const res = await fetch('/api/admin/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSaving(false);
    } else {
      const err = await res.json();
      alert(`Erreur: ${err.error}`);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Modifier l&apos;article</h1>
        </div>
        {form.is_published && form.slug && (
          <Link
            href={`/blog/${form.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-sm text-[#8B4513] hover:underline"
          >
            Voir sur le site
            <ExternalLink size={14} />
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Titre *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Slug URL</label>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Temps de lecture (min)</label>
            <input
              type="number"
              min={1}
              value={form.read_time}
              onChange={(e) => setForm({ ...form, read_time: parseInt(e.target.value) || 5 })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title SEO</label>
          <input
            type="text"
            value={form.meta_title}
            onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">{(form.meta_title || form.title).length}/60 caractères</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description SEO</label>
          <textarea
            rows={2}
            value={form.meta_description}
            onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">{form.meta_description.length}/160 caractères</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Extrait (chapô)</label>
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
          />
        </div>

        <BlogFeaturedImageUpload value={featuredImage} onChange={setFeaturedImage} />

        <BlogContentEditor
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Produits liés (slugs)</label>
          <input
            type="text"
            value={form.related_products}
            onChange={(e) => setForm({ ...form, related_products: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CTA — Slug produit</label>
            <input
              type="text"
              value={form.cta_product_slug}
              onChange={(e) => setForm({ ...form, cta_product_slug: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">CTA — Texte</label>
            <input
              type="text"
              value={form.cta_text}
              onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_published"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            className="w-4 h-4 accent-[#8B4513]"
          />
          <label htmlFor="is_published" className="text-sm text-slate-700">
            Publié
          </label>
        </div>

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
            Retour
          </Link>
        </div>
      </form>
    </div>
  );
}
