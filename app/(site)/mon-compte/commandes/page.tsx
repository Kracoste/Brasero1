'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { useAuth } from '@/lib/auth-context';
import { AUTH_ROUTES } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';
import { Package, Truck, CheckCircle, Clock, Hammer, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

// Types
interface OrderItem {
  product_name: string;
  product_slug: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  currency: string;
  items: OrderItem[];
  tracking_number?: string;
  carrier?: string;
  shipped_at?: string;
  delivered_at?: string;
  customer_name?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
}

// Étapes du suivi de commande
const ORDER_STEPS = [
  { key: 'pending', label: 'Commande reçue', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  { key: 'processing', label: 'En cours de fabrication', icon: Hammer, color: 'text-amber-600', bg: 'bg-amber-100' },
  { key: 'shipped', label: 'Expédiée', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { key: 'delivered', label: 'Livrée', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
];

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
  };
  return map[status] ?? 0;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Commande reçue',
    confirmed: 'Commande confirmée',
    processing: 'En cours de fabrication',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    refunded: 'Remboursée',
  };
  return labels[status] || status;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-amber-100 text-amber-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Composant de suivi étape par étape
function OrderTracker({ status }: { status: string }) {
  const currentStep = getStepIndex(status);

  if (status === 'cancelled' || status === 'refunded') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        <span className="font-medium">{getStatusLabel(status)}</span>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        {ORDER_STEPS.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-1 items-center">
              {/* Cercle */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    isCompleted
                      ? `${step.bg} ${step.color}`
                      : 'bg-gray-100 text-gray-400'
                  } ${isCurrent ? 'ring-2 ring-offset-2 ring-current' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center max-w-[80px] ${
                    isCompleted ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Ligne de connexion */}
              {index < ORDER_STEPS.length - 1 && (
                <div className="flex-1 mx-2 mt-[-20px]">
                  <div
                    className={`h-0.5 w-full transition-all ${
                      index < currentStep ? 'bg-emerald-400' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Composant pour une commande
function OrderCard({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header cliquable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Package className="h-6 w-6 text-slate-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">
              Commande #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
          <span className="font-semibold text-slate-900">
            {order.total_amount.toFixed(2)} €
          </span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Détails dépliables */}
      {isOpen && (
        <div className="border-t border-slate-100 px-5 pb-5">
          {/* Tracker de statut */}
          <OrderTracker status={order.status} />

          {/* Infos tracking */}
          {order.tracking_number && (
            <div className="mt-4 rounded-lg bg-indigo-50 p-4">
              <p className="text-sm font-semibold text-indigo-800">📦 Suivi de livraison</p>
              <p className="mt-1 text-sm text-indigo-700">
                Transporteur : <span className="font-medium">{order.carrier || 'DB Schenker'}</span>
              </p>
              <p className="text-sm text-indigo-700">
                N° de suivi : <span className="font-mono font-medium">{order.tracking_number}</span>
              </p>
              {order.shipped_at && (
                <p className="text-sm text-indigo-700">
                  Expédiée le : {formatDateTime(order.shipped_at)}
                </p>
              )}
            </div>
          )}

          {order.delivered_at && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-800">✅ Livrée le {formatDateTime(order.delivered_at)}</p>
            </div>
          )}

          {/* Articles */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Articles commandés</p>
            <div className="space-y-2">
              {(order.items || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                      {item.quantity}x
                    </span>
                    {item.product_slug ? (
                      <Link
                        href={`/produits/${item.product_slug}`}
                        className="text-sm font-medium text-slate-900 hover:text-amber-700 hover:underline"
                      >
                        {item.product_name}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-slate-900">
                        {item.product_name}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {item.total_price.toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm font-semibold text-slate-700">Total</span>
            <span className="text-lg font-bold text-slate-900">{order.total_amount.toFixed(2)} €</span>
          </div>

          {/* Adresse de livraison */}
          {order.shipping_address && (
            <div className="mt-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-700">Adresse de livraison :</p>
              <p className="mt-1">{order.shipping_address}</p>
              {order.shipping_postal_code && order.shipping_city && (
                <p>{order.shipping_postal_code} {order.shipping_city}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MesCommandesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rediriger si pas connecté
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = `${AUTH_ROUTES.login}?redirectTo=/mon-compte/commandes`;
    }
  }, [user, authLoading]);

  // Charger les commandes
  useEffect(() => {
    async function loadOrders() {
      if (!user) return;

      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('id, created_at, status, total_amount, currency, items, tracking_number, carrier, shipped_at, delivered_at, customer_name, shipping_address, shipping_city, shipping_postal_code')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Erreur chargement commandes:', fetchError);
          setError('Impossible de charger vos commandes');
          return;
        }

        setOrders(data || []);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadOrders();
    }
  }, [user]);

  // Skeleton pour les commandes
  const OrderSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-100" />
              <div>
                <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-28 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-6 w-24 bg-slate-100 rounded-full" />
              <div className="h-5 w-16 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Pas connecté et auth terminé → redirection gérée par useEffect
  if (!authLoading && !user) {
    return null;
  }

  return (
    <Section className="py-24">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/mon-compte"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-semibold text-slate-900">Mes commandes</h1>
            <p className="mt-1 text-slate-600">Suivez l&apos;état de vos commandes</p>
          </div>
        </div>

        {/* Contenu */}
        {authLoading || loading ? (
          <OrderSkeleton />
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm font-semibold text-red-600 hover:text-red-800 underline"
            >
              Réessayer
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-slate-300" />
            <h2 className="mt-4 font-display text-xl font-semibold text-slate-900">
              Aucune commande
            </h2>
            <p className="mt-2 text-slate-600">
              Vous n&apos;avez pas encore passé de commande.
            </p>
            <Link
              href="/produits"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
