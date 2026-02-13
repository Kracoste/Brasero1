'use client';

import { useEffect, useState } from 'react';
import { Package, Eye, Truck, CheckCircle, XCircle, Clock, Hammer, Send, X, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';

type OrderItem = {
  product_name: string;
  product_slug?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type Order = {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
  tracking_number: string | null;
  carrier: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  shipping_address: string | null;
  shipping_address_line2: string | null;
  shipping_postal_code: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  delivery_message: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  confirmation_email_sent: boolean;
  currency: string;
};

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  pending: { label: 'Commande reçue', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', icon: Clock },
  confirmed: { label: 'Confirmée', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', icon: CheckCircle },
  processing: { label: 'En fabrication', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', icon: Hammer },
  shipped: { label: 'Expédiée', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200', icon: Truck },
  delivered: { label: 'Livrée', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', icon: XCircle },
  refunded: { label: 'Remboursée', color: 'text-gray-700', bgColor: 'bg-gray-50 border-gray-200', icon: XCircle },
};

const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ============================================================
// Composant modal détail / gestion d'une commande
// ============================================================
function OrderDetailModal({
  order,
  onClose,
  onUpdate,
}: {
  order: Order;
  onClose: () => void;
  onUpdate: (updated: Order) => void;
}) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [carrier, setCarrier] = useState(order.carrier || 'DB Schenker');
  const [sendEmail, setSendEmail] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const currentStepIndex = statusFlow.indexOf(order.status);
  const newStepIndex = statusFlow.indexOf(status);
  const isStatusChanged = status !== order.status;
  const isTrackingChanged = trackingNumber !== (order.tracking_number || '');
  const isCarrierChanged = carrier !== (order.carrier || 'DB Schenker');
  const hasChanges = isStatusChanged || isTrackingChanged || isCarrierChanged;

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    setFeedback(null);

    try {
      const body: Record<string, unknown> = {};
      if (isStatusChanged) body.status = status;
      if (isTrackingChanged) body.tracking_number = trackingNumber;
      if (isCarrierChanged) body.carrier = carrier;
      if (sendEmail && status === 'shipped' && isStatusChanged) body.send_email = true;

      const res = await fetch(`/api/admin/orders?id=${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur serveur');
      }

      const data = await res.json();
      onUpdate(data.order);

      let msg = 'Commande mise à jour';
      if (data.email_sent?.success) {
        msg += ' — Email d\'expédition envoyé au client ✉️';
      } else if (data.email_sent && !data.email_sent.success) {
        msg += ' — ⚠️ Erreur envoi email: ' + (data.email_sent.error || 'inconnue');
      }

      setFeedback({ type: 'success', message: msg });
    } catch (err) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Erreur inconnue' });
    } finally {
      setSaving(false);
    }
  };

  const sc = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = sc.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Commande #{order.id.slice(0, 8).toUpperCase()}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{formatDateTime(order.created_at)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Statut actuel */}
          <div className={`flex items-center gap-3 p-4 rounded-xl border ${sc.bgColor}`}>
            <StatusIcon size={22} className={sc.color} />
            <span className={`font-semibold ${sc.color}`}>{sc.label}</span>
          </div>

          {/* Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Client</p>
              <p className="font-medium text-slate-900">{order.customer_name || '—'}</p>
              <p className="text-sm text-slate-600">{order.customer_email || '—'}</p>
              {order.customer_phone && (
                <p className="text-sm text-slate-600">{order.customer_phone}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Livraison</p>
              <p className="text-sm text-slate-700">{order.shipping_address || '—'}</p>
              {order.shipping_address_line2 && (
                <p className="text-sm text-slate-600">{order.shipping_address_line2}</p>
              )}
              <p className="text-sm text-slate-700">
                {[order.shipping_postal_code, order.shipping_city].filter(Boolean).join(' ')}
              </p>
              {order.shipping_country && (
                <p className="text-sm text-slate-600">{order.shipping_country}</p>
              )}
            </div>
          </div>

          {order.delivery_message && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-600 uppercase mb-1">Message du client</p>
              <p className="text-sm text-amber-800">{order.delivery_message}</p>
            </div>
          )}

          {/* Articles */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Articles</p>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                      {item.quantity}×
                    </span>
                    <span className="text-sm font-medium text-slate-900">{item.product_name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {formatCurrency(item.total_price)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Total</span>
              <span className="text-lg font-bold text-slate-900">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {/* Stripe */}
          {order.stripe_payment_intent && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Paiement Stripe</p>
              <p className="text-xs font-mono text-slate-500">{order.stripe_payment_intent}</p>
            </div>
          )}

          <hr className="border-slate-200" />

          {/* ============ GESTION DU STATUT ============ */}
          <div>
            <p className="text-sm font-bold text-slate-900 mb-3">📋 Mettre à jour le statut</p>

            {/* Boutons de progression rapide */}
            <div className="flex flex-wrap gap-2 mb-4">
              {statusFlow.map((s, idx) => {
                const cfg = statusConfig[s];
                const Icon = cfg.icon;
                const isActive = s === status;
                const isPast = idx <= statusFlow.indexOf(order.status);

                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all
                      ${isActive
                        ? `${cfg.bgColor} ${cfg.color} ring-2 ring-offset-1 ring-current`
                        : isPast
                          ? 'bg-slate-50 text-slate-400 border-slate-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    <Icon size={16} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* Annulé / Remboursé */}
            <div className="flex gap-2 mb-4">
              {['cancelled', 'refunded'].map((s) => {
                const cfg = statusConfig[s];
                const Icon = cfg.icon;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                      ${s === status
                        ? `${cfg.bgColor} ${cfg.color} ring-2 ring-offset-1 ring-current`
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    <Icon size={14} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            {/* Tracking (visible si statut shipped ou si déjà un tracking) */}
            {(status === 'shipped' || status === 'delivered' || order.tracking_number) && (
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase">Informations d'expédition</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Transporteur</label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="DB Schenker">DB Schenker</option>
                      <option value="Chronopost">Chronopost</option>
                      <option value="Colissimo">Colissimo</option>
                      <option value="DPD">DPD</option>
                      <option value="GLS">GLS</option>
                      <option value="UPS">UPS</option>
                      <option value="FedEx">FedEx</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">N° de suivi</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Ex: 76890123456789"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Option envoyer email */}
            {status === 'shipped' && isStatusChanged && (
              <label className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-sm font-medium text-indigo-800">Envoyer un email au client</p>
                  <p className="text-xs text-indigo-600">
                    Le client recevra un email avec le numéro de suivi
                  </p>
                </div>
                <Send size={18} className="ml-auto text-indigo-400" />
              </label>
            )}

            {/* Feedback */}
            {feedback && (
              <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {feedback.message}
              </div>
            )}

            {/* Bouton sauvegarder */}
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900 hover:bg-slate-800"
            >
              {saving ? 'Enregistrement...' : hasChanges ? 'Enregistrer les modifications' : 'Aucune modification'}
            </button>
          </div>

          {/* Dates */}
          <div className="text-xs text-slate-400 space-y-1">
            <p>Créée le {formatDateTime(order.created_at)}</p>
            {order.shipped_at && <p>Expédiée le {formatDateTime(order.shipped_at)}</p>}
            {order.delivered_at && <p>Livrée le {formatDateTime(order.delivered_at)}</p>}
            {order.confirmation_email_sent && <p>✉️ Email de confirmation envoyé</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Page principale admin commandes
// ============================================================
export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Erreur chargement');
      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setSelectedOrder(updatedOrder);
  };

  // Filtrage
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      (order.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Compteurs par statut
  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Commandes</h1>
        <p className="text-slate-600 mt-1">
          {orders.length} commande{orders.length > 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { key: 'pending', label: 'En attente', color: 'bg-blue-500' },
          { key: 'processing', label: 'En fabrication', color: 'bg-amber-500' },
          { key: 'shipped', label: 'Expédiées', color: 'bg-indigo-500' },
          { key: 'delivered', label: 'Livrées', color: 'bg-emerald-500' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? 'all' : key)}
            className={`rounded-xl border p-4 text-left transition-all ${
              filterStatus === key
                ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className={`h-2 w-8 rounded-full ${color} mb-2`} />
            <p className="text-2xl font-bold text-slate-900">{statusCounts[key] || 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {/* Barre de recherche */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou n° commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="processing">En fabrication</option>
          <option value="shipped">Expédiées</option>
          <option value="delivered">Livrées</option>
          <option value="cancelled">Annulées</option>
          <option value="refunded">Remboursées</option>
        </select>
      </div>

      {/* Liste des commandes */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">
            {orders.length === 0 ? 'Aucune commande' : 'Aucun résultat'}
          </h3>
          <p className="text-slate-600 mt-1">
            {orders.length === 0
              ? 'Les commandes apparaîtront ici.'
              : 'Essayez de modifier vos filtres.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            const Icon = sc.icon;

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${sc.bgColor}`}>
                      <Icon size={20} className={sc.color} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.customer_name || 'Client'} — {order.customer_email || ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 pl-15 sm:pl-0">
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{formatCurrency(order.total_amount)}</p>
                      <p className="text-xs text-slate-400">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${sc.bgColor} ${sc.color}`}>
                      <Icon size={14} />
                      {sc.label}
                    </span>
                  </div>
                </div>

                {/* Résumé articles */}
                <div className="mt-3 flex flex-wrap gap-2 pl-15">
                  {(order.items || []).slice(0, 3).map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-slate-50 rounded-full px-3 py-1 text-xs text-slate-600">
                      {item.quantity}× {item.product_name}
                    </span>
                  ))}
                  {(order.items || []).length > 3 && (
                    <span className="text-xs text-slate-400 py-1">
                      +{(order.items || []).length - 3} autre{(order.items || []).length - 3 > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Tracking si présent */}
                {order.tracking_number && (
                  <div className="mt-2 flex items-center gap-2 pl-15">
                    <Truck size={14} className="text-indigo-500" />
                    <span className="text-xs text-indigo-600 font-mono">
                      {order.carrier || 'Transporteur'}: {order.tracking_number}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
}
