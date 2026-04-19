'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Check, MapPin } from 'lucide-react';

export type Address = {
  id: string;
  label: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string;
  address_line2: string | null;
  postal_code: string;
  city: string;
  country: string;
  is_default: boolean;
};

type AddressFormState = Omit<Address, 'id' | 'is_default'> & { is_default: boolean };

const emptyForm: AddressFormState = {
  label: '',
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
  address_line2: '',
  postal_code: '',
  city: '',
  country: 'France',
  is_default: false,
};

type AddressBookProps = {
  /** Si true, l'utilisateur peut sélectionner une adresse (mode checkout). */
  selectable?: boolean;
  selectedId?: string | null;
  onSelect?: (address: Address) => void;
  /** Callback quand la liste change (utile pour resélectionner la défaut au checkout). */
  onChange?: (addresses: Address[]) => void;
};

export function AddressBook({ selectable = false, selectedId, onSelect, onChange }: AddressBookProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/addresses');
      const data = await res.json();
      const list = (data.addresses || []) as Address[];
      setAddresses(list);
      onChange?.(list);
    } catch {
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [onChange]);

  useEffect(() => { load(); }, [load]);

  const startCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError(null);
  };

  const startEdit = (a: Address) => {
    setForm({
      label: a.label ?? '',
      first_name: a.first_name,
      last_name: a.last_name,
      phone: a.phone ?? '',
      address: a.address,
      address_line2: a.address_line2 ?? '',
      postal_code: a.postal_code,
      city: a.city,
      country: a.country,
      is_default: a.is_default,
    });
    setEditingId(a.id);
    setShowForm(true);
    setError(null);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const save = async () => {
    if (!form.first_name || !form.last_name || !form.address || !form.postal_code || !form.city) {
      setError('Champs obligatoires manquants');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = editingId ? { id: editingId, ...form } : form;
      const res = await fetch('/api/addresses', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      cancel();
      await load();
    } catch (e: any) {
      setError(e.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette adresse ?')) return;
    await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' });
    await load();
  };

  const setDefault = async (a: Address) => {
    await fetch('/api/addresses', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: a.id,
        first_name: a.first_name,
        last_name: a.last_name,
        phone: a.phone,
        address: a.address,
        address_line2: a.address_line2,
        postal_code: a.postal_code,
        city: a.city,
        country: a.country,
        label: a.label,
        is_default: true,
      }),
    });
    await load();
  };

  if (loading) return <div className="text-sm text-slate-500">Chargement...</div>;

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !showForm && (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          <MapPin className="mx-auto mb-2 h-8 w-8 text-slate-400" />
          Aucune adresse enregistrée
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) => {
          const isSelected = selectable && selectedId === a.id;
          return (
            <div
              key={a.id}
              onClick={() => selectable && onSelect?.(a)}
              className={`rounded-lg border p-4 transition ${
                isSelected
                  ? 'border-clay-700 bg-clay-50 ring-2 ring-clay-600'
                  : 'border-slate-200 bg-white hover:border-slate-400'
              } ${selectable ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.label && <span className="text-sm font-semibold text-slate-900">{a.label}</span>}
                    {a.is_default && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        <Check size={12} /> Par défaut
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-900">{a.first_name} {a.last_name}</p>
                  <p className="text-sm text-slate-600">{a.address}</p>
                  {a.address_line2 && <p className="text-sm text-slate-600">{a.address_line2}</p>}
                  <p className="text-sm text-slate-600">{a.postal_code} {a.city}</p>
                  <p className="text-sm text-slate-600">{a.country}</p>
                  {a.phone && <p className="mt-1 text-xs text-slate-500">{a.phone}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); startEdit(a); }}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Modifier"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); remove(a.id); }}
                    className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {!a.is_default && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setDefault(a); }}
                  className="mt-2 text-xs font-medium text-clay-700 hover:text-clay-900 underline"
                >
                  Définir par défaut
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!showForm && (
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Plus size={16} /> Ajouter une adresse
        </button>
      )}

      {showForm && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            {editingId ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
          </h3>
          <input
            type="text"
            placeholder="Libellé (Maison, Bureau...)"
            value={form.label ?? ''}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Prénom *"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Nom *"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <input
            type="tel"
            placeholder="Téléphone"
            value={form.phone ?? ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Adresse *"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Complément (bâtiment, étage...)"
            value={form.address_line2 ?? ''}
            onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Code postal *"
              value={form.postal_code}
              onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder="Ville *"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
            />
          </div>
          <select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="France">France</option>
            <option value="Belgique">Belgique</option>
            <option value="Allemagne">Allemagne</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
              className="h-4 w-4"
            />
            Définir comme adresse par défaut
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
