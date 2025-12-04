'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Search, Edit, Trash2, Image as ImageIcon, Package, Database } from 'lucide-react';
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
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } else {
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
      }
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
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Produits</h1>
          <p className="text-slate-600 mt-1">
            Gérez votre catalogue de produits ({products.length} produits)
          </p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
        >
          <Plus size={20} />
          Ajouter un produit
        </Link>
      </div>

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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
