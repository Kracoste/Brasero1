'use client';

import { useEffect, useState } from 'react';
import { Store, Truck, CreditCard, Bell, Shield, Save, Check } from 'lucide-react';
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from '@/lib/site-settings-defaults';

type UiSettings = SiteSettings & {
  emailOnNewOrder: boolean;
  emailOnLowStock: boolean;
  lowStockThreshold: number;
};

const DEFAULT_UI_SETTINGS: UiSettings = {
  ...DEFAULT_SITE_SETTINGS,
  emailOnNewOrder: true,
  emailOnLowStock: true,
  lowStockThreshold: 5,
};

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // États pour les paramètres
  const [settings, setSettings] = useState<UiSettings>(DEFAULT_UI_SETTINGS);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/site-settings', { cache: 'no-store' });
        if (!response.ok) throw new Error('Impossible de charger les paramètres');
        const data = (await response.json()) as SiteSettings;
        setSettings((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (error) {
        console.error('Erreur chargement paramètres:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { emailOnNewOrder, emailOnLowStock, lowStockThreshold, ...siteSettings } = settings;
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });
      if (!response.ok) throw new Error('Impossible de sauvegarder les paramètres');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erreur sauvegarde paramètres:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Store },
    { id: 'shipping', label: 'Livraison', icon: Truck },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ];

  if (initialLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-56 rounded bg-slate-200" />
          <div className="h-64 rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
          <p className="text-slate-600 mt-1">Configurez votre boutique</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check size={18} />
              Enregistré
            </>
          ) : saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save size={18} />
              Enregistrer
            </>
          )}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar des onglets */}
        <div className="w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contenu */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Store size={20} />
                Informations de la boutique
              </h2>
              
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom de la boutique
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Adresse
                  </label>
                  <textarea
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Truck size={20} />
                Paramètres de livraison
              </h2>
              
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Seuil de livraison gratuite (€)
                  </label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <p className="mt-1 text-sm text-slate-500">
                    Les commandes au-dessus de ce montant bénéficient de la livraison gratuite.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Frais de livraison standard (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.standardShippingCost}
                    onChange={(e) => setSettings({ ...settings, standardShippingCost: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Frais de livraison express (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.expressShippingCost}
                    onChange={(e) => setSettings({ ...settings, expressShippingCost: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CreditCard size={20} />
                Moyens de paiement
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Carte bancaire</p>
                      <p className="text-sm text-slate-500">Visa, Mastercard, CB</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Activé
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">
                      💳
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">PayPal</p>
                      <p className="text-sm text-slate-500">Paiement sécurisé PayPal</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Activé
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                      🏦
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Virement bancaire</p>
                      <p className="text-sm text-slate-500">Pour les commandes importantes</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Activé
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 mt-4">
                Pour modifier les paramètres de paiement, contactez votre prestataire de paiement.
              </p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Bell size={20} />
                Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Nouvelle commande</p>
                    <p className="text-sm text-slate-500">Recevoir un email à chaque nouvelle commande</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailOnNewOrder}
                      onChange={(e) => setSettings({ ...settings, emailOnNewOrder: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Stock faible</p>
                    <p className="text-sm text-slate-500">Alerte quand un produit atteint le seuil minimum</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailOnLowStock}
                      onChange={(e) => setSettings({ ...settings, emailOnLowStock: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Seuil de stock faible
                  </label>
                  <input
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Shield size={20} />
                Sécurité
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <p className="font-medium text-slate-900">Authentification</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Votre compte est protégé par l&apos;authentification Supabase.
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <Check size={14} />
                    Sécurisé
                  </span>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-lg">
                  <p className="font-medium text-slate-900">Connexions SSL</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Toutes les connexions sont chiffrées via HTTPS.
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <Check size={14} />
                    Actif
                  </span>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-lg">
                  <p className="font-medium text-slate-900">Changer le mot de passe</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Modifiez votre mot de passe administrateur.
                  </p>
                  <button className="mt-3 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                    Changer le mot de passe
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
