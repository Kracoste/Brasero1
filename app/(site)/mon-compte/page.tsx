'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AUTH_ROUTES } from '@/lib/auth';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';

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

export default function MonComptePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push(AUTH_ROUTES.login);
        return;
      }

      setUser(user);

      // Récupérer le profil via l'API (évite les problèmes RLS)
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      }

      setLoading(false);
    };

    getUser();
  }, [router]);

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
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        setProfile(data.profile);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <Section className="py-24">
        <Container>
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-clay-900 border-t-transparent"></div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="py-24">
      <Container className="max-w-3xl">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="font-display text-3xl font-semibold text-slate-900">Mon compte</h1>
            <p className="mt-2 text-slate-600">Gérez vos informations personnelles</p>
          </div>

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
                    value={user?.email || ''}
                    disabled
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-slate-500"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    L'email ne peut pas être modifié
                  </p>
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
                    defaultValue={profile?.first_name || ''}
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
                    defaultValue={profile?.last_name || ''}
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
                    defaultValue={profile?.phone || ''}
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
                    defaultValue={profile?.address || ''}
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
                      defaultValue={profile?.postal_code || ''}
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
                      defaultValue={profile?.city || ''}
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
                    defaultValue={profile?.country || 'France'}
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
      </Container>
    </Section>
  );
}
