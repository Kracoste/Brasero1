'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  category: string;
  is_published: boolean;
  published_at: string | null;
  read_time: number;
  created_at: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  cuisson: 'Cuisson',
  guide: 'Guide',
  entretien: 'Entretien',
  inspiration: 'Inspiration',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/blog')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function togglePublish(post: BlogPost) {
    const newState = !post.is_published;
    await fetch('/api/admin/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: post.id,
        is_published: newState,
        ...(newState && !post.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
      }),
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, is_published: newState, published_at: newState ? (p.published_at || new Date().toISOString()) : p.published_at }
          : p
      )
    );
  }

  async function deletePost(id: string) {
    if (!confirm('Supprimer cet article ?')) return;
    await fetch('/api/admin/blog', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog</h1>
          <p className="text-slate-600 mt-1">
            {posts.length} article{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/blog/generer"
            className="inline-flex items-center gap-2 bg-white border border-[#8B4513] text-[#8B4513] px-4 py-2.5 rounded-lg hover:bg-[#f6f1e9] transition-colors text-sm font-medium"
          >
            <Sparkles size={16} />
            Générer avec l&apos;IA
          </Link>
          <Link
            href="/admin/blog/nouveau"
            className="inline-flex items-center gap-2 bg-[#8B4513] text-white px-4 py-2.5 rounded-lg hover:bg-[#6d3610] transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Nouvel article
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Chargement...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">Aucun article pour le moment.</p>
          <Link
            href="/admin/blog/nouveau"
            className="text-[#8B4513] font-medium hover:underline"
          >
            Créer votre premier article
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-sm text-slate-600">
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">
                  Catégorie
                </th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="font-medium text-slate-900 hover:text-[#8B4513]"
                    >
                      {post.title}
                    </Link>
                    <span className="block text-xs text-slate-400 mt-0.5">
                      /blog/{post.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-[#f6f1e9] text-[#8B4513] px-2 py-1 rounded">
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('fr-FR')
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(post)}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                        post.is_published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {post.is_published ? (
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
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="p-1.5 text-slate-400 hover:text-[#8B4513] transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
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
