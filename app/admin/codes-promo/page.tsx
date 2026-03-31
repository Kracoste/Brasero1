'use client';

import { useState, useEffect, useCallback } from 'react';
import { Ticket, Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Coupon = {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number | null;
  max_uses: number | null;
  max_uses_per_user: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  show_in_banner: boolean;
  created_at: string;
  applicable_products: string[] | null;
};

type ProductOption = {
  slug: string;
  name: string;
};

type CouponForm = {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number | null;
  max_uses: number | null;
  max_uses_per_user: number | null;
  expires_at: string | null;
  is_active: boolean;
  show_in_banner: boolean;
};

const emptyCouponForm: CouponForm = {
  code: '',
  discount_type: 'percentage',
  discount_value: 0,
  min_purchase_amount: null,
  max_uses: null,
  max_uses_per_user: 1,
  expires_at: null,
  is_active: true,
  show_in_banner: false,
};

export default function AdminCodesPromo() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponForm>(emptyCouponForm);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      if (!res.ok) throw new Error('Erreur chargement');
      const data = await res.json();
      setCoupons(data || []);
    } catch (err) {
      console.error('Erreur chargement coupons:', err);
      showToast('Erreur lors du chargement des codes promo', 'error');
    }
    setLoading(false);
  }, [showToast]);

  const fetchProducts = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('slug, name')
      .order('name');

    if (error) {
      console.error('Erreur chargement produits:', error);
    } else {
      setProducts(data || []);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, [fetchCoupons, fetchProducts]);

  const resetForm = () => {
    setForm(emptyCouponForm);
    setSelectedProducts([]);
    setEditingId(null);
    setShowForm(false);
  };

  const startCreate = () => {
    setForm(emptyCouponForm);
    setSelectedProducts([]);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (coupon: Coupon) => {
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_purchase_amount: coupon.min_purchase_amount,
      max_uses: coupon.max_uses,
      max_uses_per_user: coupon.max_uses_per_user,
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : null,
      is_active: coupon.is_active,
      show_in_banner: coupon.show_in_banner,
    });
    setSelectedProducts(coupon.applicable_products || []);
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) {
      showToast('Le code promo est obligatoire', 'error');
      return;
    }
    if (form.discount_value <= 0) {
      showToast('La valeur de remise doit être supérieure à 0', 'error');
      return;
    }

    setSaving(true);

    const payload = {
      ...(editingId ? { id: editingId } : {}),
      code: form.code.toUpperCase().trim(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      min_purchase_amount: form.min_purchase_amount || null,
      max_uses: form.max_uses || null,
      max_uses_per_user: form.max_uses_per_user || null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
      show_in_banner: form.show_in_banner,
      applicable_products: selectedProducts.length > 0 ? selectedProducts : null,
    };

    try {
      const res = await fetch('/api/admin/coupons', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Erreur lors de la sauvegarde', 'error');
      } else {
        showToast(editingId ? 'Code promo mis à jour' : 'Code promo créé', 'success');
        resetForm();
        fetchCoupons();
      }
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      showToast('Erreur réseau', 'error');
    }
    setSaving(false);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: coupon.id, is_active: !coupon.is_active }),
      });

      if (!res.ok) {
        showToast('Erreur lors du changement de statut', 'error');
      } else {
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, is_active: !c.is_active } : c))
        );
      }
    } catch {
      showToast('Erreur réseau', 'error');
    }
  };

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(`Supprimer le code promo "${coupon.code}" ?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${coupon.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        showToast('Erreur lors de la suppression', 'error');
      } else {
        setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
        showToast('Code promo supprimé', 'success');
        if (editingId === coupon.id) resetForm();
      }
    } catch {
      showToast('Erreur réseau', 'error');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatValue = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') return `${coupon.discount_value}%`;
    return `${coupon.discount_value} €`;
  };

  const toggleProductSelection = (slug: string) => {
    setSelectedProducts((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const isExpired = (coupon: Coupon) => {
    if (!coupon.expires_at) return false;
    return new Date(coupon.expires_at) < new Date();
  };

  const isMaxedOut = (coupon: Coupon) => {
    if (coupon.max_uses === null) return false;
    return coupon.current_uses >= coupon.max_uses;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Codes promo</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Gérez vos codes promotionnels ({coupons.length} code{coupons.length !== 1 ? 's' : ''})
          </p>
        </div>
        {!showForm && (
          <button
            onClick={startCreate}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition text-sm sm:text-base"
          >
            <Plus size={20} />
            <span>Nouveau code promo</span>
          </button>
        )}
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Ticket size={20} />
            {editingId ? 'Modifier le code promo' : 'Nouveau code promo'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="EX: PROMO2024"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 uppercase"
              />
            </div>

            {/* Type de remise */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type de remise</label>
              <select
                value={form.discount_type}
                onChange={(e) =>
                  setForm({ ...form, discount_type: e.target.value as 'percentage' | 'fixed' })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (€)</option>
              </select>
            </div>

            {/* Valeur */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Valeur {form.discount_type === 'percentage' ? '(%)' : '(€)'} *
              </label>
              <input
                type="number"
                min="0"
                step={form.discount_type === 'percentage' ? '1' : '0.01'}
                value={form.discount_value || ''}
                onChange={(e) => setForm({ ...form, discount_value: parseFloat(e.target.value) || 0 })}
                placeholder="10"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            {/* Min achat */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Montant min. d&apos;achat (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.min_purchase_amount ?? ''}
                onChange={(e) =>
                  setForm({ ...form, min_purchase_amount: e.target.value ? parseFloat(e.target.value) : null })
                }
                placeholder="Aucun minimum"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            {/* Max utilisations globales */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Utilisations max. (total)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.max_uses ?? ''}
                onChange={(e) =>
                  setForm({ ...form, max_uses: e.target.value ? parseInt(e.target.value) : null })
                }
                placeholder="Illimité"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <p className="text-xs text-slate-400 mt-0.5">Nombre total de fois que le code peut être utilisé</p>
            </div>

            {/* Max utilisations par utilisateur */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Max. par utilisateur
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={form.max_uses_per_user ?? ''}
                onChange={(e) =>
                  setForm({ ...form, max_uses_per_user: e.target.value ? parseInt(e.target.value) : null })
                }
                placeholder="Illimité"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <p className="text-xs text-slate-400 mt-0.5">Combien de fois un même email peut utiliser ce code</p>
            </div>

            {/* Date d'expiration */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date d&apos;expiration</label>
              <input
                type="datetime-local"
                value={form.expires_at || ''}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value || null })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            {/* Actif */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                <span className="text-sm font-medium text-slate-700">Actif</span>
              </label>
            </div>

            {/* Afficher dans la bannière */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.show_in_banner}
                  onChange={(e) => setForm({ ...form, show_in_banner: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-[#8B4513] focus:ring-[#8B4513]"
                />
                <span className="text-sm font-medium text-slate-700">Afficher dans la bannière</span>
              </label>
              <span className="text-xs text-slate-400 ml-2" title="Le code sera affiché en haut du site. Un seul code peut être affiché à la fois.">?</span>
            </div>
          </div>

          {/* Produits applicables */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Produits applicables
              <span className="text-slate-400 font-normal ml-1">(vide = tous les produits)</span>
            </label>
            {products.length > 0 ? (
              <div className="border border-slate-300 rounded-lg p-3 max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {products.map((p) => (
                  <label key={p.slug} className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(p.slug)}
                      onChange={() => toggleProductSelection(p.slug)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                    />
                    <span className="text-sm text-slate-700 truncate">{p.name}</span>
                    <span className="text-xs text-slate-400 truncate">({p.slug})</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Aucun produit trouvé</p>
            )}
            {selectedProducts.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {selectedProducts.length} produit{selectedProducts.length > 1 ? 's' : ''} sélectionné{selectedProducts.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Actions form */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-slate-800 transition text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer'}
            </button>
            <button
              onClick={resetForm}
              className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <Ticket className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 text-lg">Aucun code promo</p>
          <p className="text-slate-400 text-sm mt-1">Créez votre premier code promo pour commencer</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Valeur</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Min. achat</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Utilisations</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Limite/user</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Expire le</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Produits</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Statut</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition ${
                      !coupon.is_active ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {coupon.discount_type === 'percentage' ? 'Pourcentage' : 'Fixe'}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{formatValue(coupon)}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {coupon.min_purchase_amount ? `${coupon.min_purchase_amount} €` : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {coupon.current_uses}
                      {coupon.max_uses !== null ? ` / ${coupon.max_uses}` : ' / \u221E'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {coupon.max_uses_per_user !== null ? `${coupon.max_uses_per_user}x` : '\u221E'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={isExpired(coupon) ? 'text-red-500' : 'text-slate-600'}>
                        {formatDate(coupon.expires_at)}
                        {isExpired(coupon) && (
                          <span className="block text-xs text-red-400">Expiré</span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {coupon.applicable_products && coupon.applicable_products.length > 0 ? (
                        <span className="text-xs" title={coupon.applicable_products.join(', ')}>
                          {coupon.applicable_products.length} produit{coupon.applicable_products.length > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Tous</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {coupon.is_active && !isExpired(coupon) && !isMaxedOut(coupon) ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full">
                          {!coupon.is_active ? 'Inactif' : isExpired(coupon) ? 'Expiré' : 'Épuisé'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition"
                          title={coupon.is_active ? 'Désactiver' : 'Activer'}
                        >
                          {coupon.is_active ? (
                            <ToggleRight size={18} className="text-green-600" />
                          ) : (
                            <ToggleLeft size={18} className="text-slate-400" />
                          )}
                        </button>
                        <button
                          onClick={() => startEdit(coupon)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition"
                          title="Modifier"
                        >
                          <Pencil size={16} className="text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition"
                          title="Supprimer"
                        >
                          <Trash2 size={16} className="text-red-400 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
