'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Save, Store, Mail, Phone, MapPin, Globe, Truck, CreditCard } from 'lucide-react';

type SiteSettings = {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  city: string;
  postal_code: string;
  shipping_cost: number;
  free_shipping_threshold: number;
  currency: string;
  tax_rate: number;
};

export default function ParametresPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'Atelier LBF',
    site_description: 'Braséros premium Made in France',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: 'Moncoutant',
    postal_code: '79320',
    shipping_cost: 0,
    free_shipping_threshold: 0,
    currency: 'EUR',
    tax_rate: 20,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (data) {
          setSettings({
            site_name: data.site_name || 'Atelier LBF',
            site_description: data.site_description || '',
            contact_email: data.contact_email || '',
            contact_phone: data.contact_phone || '',
            address: data.address || '',
            city: data.city || 'Moncoutant',
            postal_code: data.postal_code || '79320',
            shipping_cost: data.shipping_cost || 0,
            free_shipping_threshold: data.free_shipping_threshold || 0,
            currency: data.currency || 'EUR',
            tax_rate: data.tax_rate || 20,
          });
        }
      } catch (error) {
        console.log('Paramètres par défaut utilisés');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Essayer d'abord une mise à jour
      const { error: updateError } = await supabase
        .from('settings')
        .update(settings)
        .eq('id', 1);

      if (updateError) {
        // Si pas de ligne, créer
        await supabase.from('settings').insert({ id: 1, ...settings });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
          <p className="text-slate-600 mt-1">Configurez les paramètres de votre boutique</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          } disabled:opacity-50`}
        >
          <Save size={18} />
          {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      {/* Informations générales */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Store size={20} />
          Informations générales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom du site
            </label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={settings.site_description}
              onChange={(e) => handleChange('site_description', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Mail size={20} />
          Contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email de contact
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
                placeholder="contact@exemple.fr"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="tel"
                value={settings.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
                placeholder="01 23 45 67 89"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Adresse */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin size={20} />
          Adresse
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Adresse
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
              placeholder="123 rue de l'Exemple"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                value={settings.postal_code}
                onChange={(e) => handleChange('postal_code', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                value={settings.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Livraison & Paiement */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Truck size={20} />
          Livraison & Paiement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Frais de livraison (€)
            </label>
            <input
              type="number"
              value={settings.shipping_cost}
              onChange={(e) => handleChange('shipping_cost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Livraison gratuite à partir de (€)
            </label>
            <input
              type="number"
              value={settings.free_shipping_threshold}
              onChange={(e) => handleChange('free_shipping_threshold', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
              min="0"
              step="0.01"
            />
            <p className="text-xs text-slate-500 mt-1">Mettre 0 pour désactiver</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Taux de TVA (%)
            </label>
            <input
              type="number"
              value={settings.tax_rate}
              onChange={(e) => handleChange('tax_rate', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Devise
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none bg-white"
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar ($)</option>
              <option value="GBP">Livre (£)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 Ces paramètres seront utilisés pour la configuration de votre boutique. 
          N'oubliez pas d'enregistrer après vos modifications.
        </p>
      </div>
    </div>
  );
}
