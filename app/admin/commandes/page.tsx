'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Package, MapPin, Calendar, Eye, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

type OrderItem = {
  product_name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  notes: string;
};

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-800', icon: Clock },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(
        (data || []).map((order: any) => ({
          id: order.id,
          user_id: order.user_id,
          customer_name: order.customer_name || 'Client inconnu',
          customer_email: order.customer_email || '',
          customer_phone: order.customer_phone || '',
          shipping_address: order.shipping_address || '',
          shipping_city: order.shipping_city || '',
          shipping_postal_code: order.shipping_postal_code || '',
          items: order.items || [],
          subtotal: order.subtotal || 0,
          shipping_cost: order.shipping_cost || 0,
          total: order.total || 0,
          status: order.status || 'pending',
          created_at: order.created_at,
          notes: order.notes || '',
        }))
      );
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Mettre à jour l'état local
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as Order['status'] });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 rounded"></div>
          <div className="h-12 w-full bg-slate-200 rounded-lg"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Commandes</h1>
        <p className="text-slate-600 mt-1">Gérez et suivez toutes les commandes</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou n° commande..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:outline-none bg-white"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmées</option>
          <option value="shipped">Expédiées</option>
          <option value="delivered">Livrées</option>
          <option value="cancelled">Annulées</option>
        </select>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-600">Total</p>
          <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p className="text-sm text-amber-600">En attente</p>
          <p className="text-2xl font-bold text-amber-700">
            {orders.filter((o) => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-600">Confirmées</p>
          <p className="text-2xl font-bold text-blue-700">
            {orders.filter((o) => o.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <p className="text-sm text-purple-600">Expédiées</p>
          <p className="text-2xl font-bold text-purple-700">
            {orders.filter((o) => o.status === 'shipped').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-600">Livrées</p>
          <p className="text-2xl font-bold text-green-700">
            {orders.filter((o) => o.status === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Clock;
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-slate-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusConfig[order.status]?.color
                        }`}
                      >
                        <StatusIcon size={12} />
                        {statusConfig[order.status]?.label}
                      </span>
                    </div>
                    <p className="text-slate-600">{order.customer_name}</p>
                    <p className="text-sm text-slate-500">{order.customer_email}</p>
                  </div>

                  <div className="flex flex-col md:items-end gap-1">
                    <p className="text-xl font-bold text-slate-900">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(order.created_at)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {order.items?.length || 0} article{(order.items?.length || 0) > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Package className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500">
              {search || statusFilter !== 'all'
                ? 'Aucune commande trouvée pour ces critères'
                : 'Aucune commande pour le moment'}
            </p>
          </div>
        )}
      </div>

      {/* Modal détail commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Commande #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </h2>
                <p className="text-sm text-slate-500">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Statut */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Statut de la commande
              </label>
              <select
                value={selectedOrder.status}
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>

            {/* Infos client */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Informations client</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Nom</p>
                  <p className="font-medium text-slate-900">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="text-slate-500">Téléphone</p>
                  <p className="font-medium text-slate-900">{selectedOrder.customer_phone || 'Non renseigné'}</p>
                </div>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin size={18} />
                Adresse de livraison
              </h3>
              <p className="text-slate-700">{selectedOrder.shipping_address}</p>
              <p className="text-slate-700">
                {selectedOrder.shipping_postal_code} {selectedOrder.shipping_city}
              </p>
            </div>

            {/* Articles commandés */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Package size={18} />
                Articles commandés
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                          Produit
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">
                          Qté
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                          Prix
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-slate-900">{item.product_name}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-center text-slate-500">Aucun article</p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="bg-slate-900 text-white rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Sous-total</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Frais de livraison</span>
                <span>{formatCurrency(selectedOrder.shipping_cost)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold pt-2 border-t border-slate-700">
                <span>Total</span>
                <span>{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="mt-4 p-4 bg-amber-50 rounded-xl">
                <p className="text-sm font-medium text-amber-800">Note du client :</p>
                <p className="text-sm text-amber-700">{selectedOrder.notes}</p>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
