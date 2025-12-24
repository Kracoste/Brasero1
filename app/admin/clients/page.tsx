'use client';

import { useEffect, useState } from 'react';
import { Users, Mail, Calendar, ShoppingBag, Search, Trash2 } from 'lucide-react';

type Client = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  role: string;
  orders_count?: number;
  total_spent?: number;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/admin/clients');
        const data = await response.json();
        
        if (response.ok) {
          setClients(data.clients || []);
        } else {
          console.error('Erreur lors du chargement des clients:', data.error);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const filteredClients = clients.filter(client => 
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (clientId: string, nextRole: string) => {
    if (!nextRole) return;
    setUpdatingRole(clientId);
    const previousClients = clients;
    setClients(prev =>
      prev.map(client => (client.id === clientId ? { ...client, role: nextRole } : client)),
    );

    try {
      const response = await fetch('/api/admin/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, role: nextRole }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        console.error('Erreur mise à jour rôle:', data.error);
        setClients(previousClients);
      }
    } catch (error) {
      console.error('Erreur mise à jour rôle:', error);
      setClients(previousClients);
    }
    setUpdatingRole(null);
  };

  const handleDelete = async (clientId: string) => {
    const confirmDelete = window.confirm(
      "Supprimer ce client ? Cette action supprimera aussi ses favoris.",
    );
    if (!confirmDelete) return;

    setDeletingId(clientId);
    const previousClients = clients;
    setClients(prev => prev.filter(client => client.id !== clientId));

    try {
      const response = await fetch(`/api/admin/clients?clientId=${clientId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        console.error('Erreur suppression client:', data.error);
        setClients(previousClients);
      }
    } catch (error) {
      console.error('Erreur suppression client:', error);
      setClients(previousClients);
    }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <p className="text-slate-600 mt-1">Gérez votre base de clients</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total clients</p>
              <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Nouveaux ce mois</p>
              <p className="text-2xl font-bold text-slate-900">
                {clients.filter(c => {
                  const createdAt = new Date(c.created_at);
                  const now = new Date();
                  return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Admins</p>
              <p className="text-2xl font-bold text-slate-900">
                {clients.filter(c => c.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Aucun client trouvé</h3>
          <p className="text-slate-600 mt-1">
            {searchTerm ? 'Aucun résultat pour cette recherche.' : 'Vos clients apparaîtront ici.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Client</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Téléphone</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Inscrit le</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Rôle</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">
                          {(client.full_name || client.email || '?')[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-slate-900">
                        {client.full_name || 'Sans nom'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={16} />
                      {client.email || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {client.phone || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={16} />
                      {formatDate(client.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        client.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {client.role === 'admin' ? 'Admin' : 'Client'}
                      </span>
                      <select
                        value={client.role}
                        onChange={(e) => handleRoleChange(client.id, e.target.value)}
                        className="rounded-lg border border-slate-200 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        disabled={updatingRole === client.id || deletingId === client.id}
                      >
                        <option value="user">Client</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(client.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      disabled={deletingId === client.id}
                    >
                      <Trash2 size={16} />
                      {deletingId === client.id ? 'Suppression...' : 'Supprimer'}
                    </button>
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
