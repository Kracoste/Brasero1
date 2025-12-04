'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Mail, Phone, MapPin, Calendar, Eye } from 'lucide-react';

type Client = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  created_at: string;
  orders_count: number;
  total_spent: number;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Récupérer les profils avec leurs commandes
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Pour chaque profil, compter les commandes et le total dépensé
        const clientsWithStats = await Promise.all(
          (profiles || []).map(async (profile: any) => {
            const { data: orders } = await supabase
              .from('orders')
              .select('total')
              .eq('user_id', profile.id);

            const ordersCount = orders?.length || 0;
            const totalSpent = orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;

            return {
              id: profile.id,
              email: profile.email || '',
              full_name: profile.full_name || profile.name || 'Non renseigné',
              phone: profile.phone || 'Non renseigné',
              address: profile.address || 'Non renseignée',
              city: profile.city || '',
              postal_code: profile.postal_code || '',
              created_at: profile.created_at,
              orders_count: ordersCount,
              total_spent: totalSpent,
            };
          })
        );

        setClients(clientsWithStats);
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [supabase]);

  const filteredClients = clients.filter(
    (client) =>
      client.full_name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search)
  );

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
              <div key={i} className="h-20 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
        <p className="text-slate-600 mt-1">Gérez vos clients et consultez leurs informations</p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-600">Total clients</p>
          <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-600">Clients avec commandes</p>
          <p className="text-2xl font-bold text-green-600">
            {clients.filter((c) => c.orders_count > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-600">Revenu total clients</p>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(clients.reduce((sum, c) => sum + c.total_spent, 0))}
          </p>
        </div>
      </div>

      {/* Liste des clients */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Commandes
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total dépensé
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{client.full_name}</p>
                      <p className="text-xs text-slate-500">
                        Inscrit le {formatDate(client.created_at)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p>{client.address}</p>
                        {client.postal_code && client.city && (
                          <p>{client.postal_code} {client.city}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.orders_count > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {client.orders_count} commande{client.orders_count > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(client.total_spent)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Eye size={16} />
                      Voir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  {search ? 'Aucun client trouvé pour cette recherche' : 'Aucun client pour le moment'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal détail client */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedClient.full_name}</h2>
                <p className="text-sm text-slate-500">Client depuis le {formatDate(selectedClient.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="text-slate-400" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="font-medium text-slate-900">{selectedClient.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="text-slate-400" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Téléphone</p>
                  <p className="font-medium text-slate-900">{selectedClient.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <MapPin className="text-slate-400" size={20} />
                <div>
                  <p className="text-xs text-slate-500">Adresse</p>
                  <p className="font-medium text-slate-900">{selectedClient.address}</p>
                  {selectedClient.postal_code && selectedClient.city && (
                    <p className="text-slate-600">{selectedClient.postal_code} {selectedClient.city}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-700">{selectedClient.orders_count}</p>
                  <p className="text-sm text-green-600">Commandes</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(selectedClient.total_spent)}</p>
                  <p className="text-sm text-blue-600">Total dépensé</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedClient(null)}
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
