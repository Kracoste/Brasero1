'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Image as ImageIcon, Package, Database, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  comparePrice?: number;
  discountPercent?: number;
  cardImage: string;
  inStock: boolean;
  created_at: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [_cacheBuster, setCacheBuster] = useState(Date.now());
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    
    // Rafraîchir les données et les images quand la fenêtre reprend le focus
    const handleFocus = () => {
      setCacheBuster(Date.now());
      fetchProducts();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      // Utiliser l'API route pour bypass RLS + timestamp pour éviter le cache
      const response = await fetch(`/api/admin/products?_t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        console.error('Error fetching products:', await response.text());
        setProducts([]);
        return;
      }
      const data = await response.json();

      const mappedProducts: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price,
        comparePrice: p.comparePrice || p.compare_price,
        discountPercent: p.discountPercent || p.discount_percent,
        cardImage: p.cardImage || p.card_image || p.images?.[0]?.src || '',
        inStock: p.inStock ?? p.in_stock ?? true,
        created_at: p.created_at,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      // Utiliser l'API route pour bypass RLS
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const handleSync = async () => {
    if (!confirm('Synchroniser les produits depuis content/products.ts vers Supabase?\n\nCela mettra à jour les specs (compatibleAccessories) des produits existants.')) {
      return;
    }

    setSyncing(true);
    setSyncResult(null);

    try {
      const response = await fetch('/api/admin/sync-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSyncResult(`✅ Sync réussie!\n- ${data.results.updated} produits mis à jour\n- ${data.results.inserted} produits insérés\n- ${data.results.skipped} ignorés\n${data.results.errors.length > 0 ? `- ${data.results.errors.length} erreurs` : ''}`);
        // Refresh products list
        fetchProducts();
      } else {
        setSyncResult(`❌ Erreur: ${data.error || 'Sync échouée'}`);
      }
    } catch (error) {
      setSyncResult(`❌ Exception: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Produits</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Gérez votre catalogue ({products.length} produits)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            title="Synchroniser les produits depuis content/products.ts vers Supabase"
          >
            <RefreshCw size={20} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'Sync...' : 'Sync DB'}</span>
          </button>
          <Link
            href="/admin/produits/nouveau"
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition text-sm sm:text-base"
          >
            <Plus size={20} />
            <span>Ajouter un produit</span>
          </Link>
        </div>
      </div>

      {/* Sync Result */}
      {syncResult && (
        <div className={`mb-6 p-4 rounded-lg border ${
          syncResult.startsWith('✅') 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <pre className="text-sm whitespace-pre-wrap font-mono">{syncResult}</pre>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{products.length}</p>
              <p className="text-sm text-slate-500">Total produits</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {products.filter(p => p.inStock).length}
              </p>
              <p className="text-sm text-slate-500">En stock</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Package className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {products.filter(p => p.discountPercent && p.discountPercent > 0).length}
              </p>
              <p className="text-sm text-slate-500">En promotion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="all">Toutes les catégories</option>
            <option value="brasero">Braséros</option>
            <option value="accessoire">Accessoires</option>
            <option value="fendeur">Fendeur à bûches</option>
          </select>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-600">Chargement des produits...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.cardImage ? (
                          <img
                            src={product.cardImage}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="text-slate-400" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{product.name}</p>
                        <p className="text-sm text-slate-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">
                      {product.category === 'brasero'
                        ? 'Braséro'
                        : product.category === 'accessoire'
                        ? 'Accessoire'
                        : 'Fendeur'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{formatCurrency(product.price)}</p>
                    {product.comparePrice && (
                      <p className="text-sm text-slate-500 line-through">
                        {formatCurrency(product.comparePrice)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.inStock ? 'En stock' : 'Rupture'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/produits/${product.id}`}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 text-slate-600">Aucun produit trouvé</p>
            <Link
              href="/admin/produits/nouveau"
              className="mt-4 inline-flex items-center gap-2 text-slate-900 hover:underline"
            >
              <Plus size={16} />
              Ajouter votre premier produit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
