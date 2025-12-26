'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';

type Profile = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
};

type ProfileFormProps = {
  user: User;
  initialProfile: Profile | null;
};

export function ProfileForm({ user, initialProfile }: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const updates = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      postal_code: formData.get('postal_code') as string,
      city: formData.get('city') as string,
      country: formData.get('country') as string,
    };

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    }

    setSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Message de succès/erreur */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de connexion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Informations de connexion</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-slate-500"
              />
              <p className="mt-1 text-xs text-slate-500">L'email ne peut pas être modifié</p>
            </div>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Informations personnelles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-slate-700">
                Prénom
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                defaultValue={initialProfile?.first_name || ''}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-clay-900 focus:outline-none focus:ring-clay-900"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-slate-700">
                Nom
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                defaultValue={initialProfile?.last_name || ''}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-clay-900 focus:outline-none focus:ring-clay-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={initialProfile?.phone || ''}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-clay-900 focus:outline-none focus:ring-clay-900"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>
        </div>

        {/* Adresse de livraison */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Adresse de livraison</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                Adresse
              </label>
              <input
                type="text"
                id="address"
                name="address"
                defaultValue={initialProfile?.address || ''}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-clay-900 focus:outline-none focus:ring-clay-900"
                placeholder="12 rue de la République"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-slate-700">
                  Code postal
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  defaultValue={initialProfile?.postal_code || ''}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-clay-900 focus:outline-none focus:ring-clay-900"
                  placeholder="75001"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={initialProfile?.city || ''}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-clay-900 focus:outline-none focus:ring-clay-900"
                  placeholder="Paris"
                />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-slate-700">
                Pays
              </label>
              <input
                type="text"
                id="country"
                name="country"
                defaultValue={initialProfile?.country || 'France'}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-clay-900 focus:outline-none focus:ring-clay-900"
              />
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-clay-900 px-6 py-3 text-sm font-semibold text-white hover:bg-clay-800 focus:outline-none focus:ring-2 focus:ring-clay-900 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
