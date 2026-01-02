'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth-context';

// Types
type ConversionEventType = 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'checkout_start' | 'purchase';

type ProductData = {
  slug: string;
  name: string;
  price: number;
};

type CartData = {
  total: number;
  itemsCount: number;
};

type OrderData = {
  orderId: string;
  total: number;
  itemsCount: number;
};

type AnalyticsContextType = {
  sessionId: string | null;
  visitorId: string | null;
  trackProductView: (product: ProductData) => void;
  trackAddToCart: (product: ProductData, quantity?: number, cart?: CartData) => void;
  trackRemoveFromCart: (product: ProductData, quantity?: number, cart?: CartData) => void;
  trackCheckoutStart: (cart: CartData) => void;
  trackPurchase: (order: OrderData) => void;
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Générer un fingerprint simple du navigateur
function generateFingerprint(): string {
  if (typeof window === 'undefined') return '';
  
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ];
  
  return btoa(components.join('|')).slice(0, 32);
}

// Générer ou récupérer le visitor ID
function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  
  let visitorId = localStorage.getItem('analytics_visitor_id');
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('analytics_visitor_id', visitorId);
  }
  return visitorId;
}

// Récupérer la session ID stockée
function getStoredSession(): { id: string; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  
  const stored = sessionStorage.getItem('analytics_session');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Stocker la session
function storeSession(id: string) {
  if (typeof window === 'undefined') return;
  
  sessionStorage.setItem('analytics_session', JSON.stringify({
    id,
    timestamp: Date.now(),
  }));
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const lastTrackedPath = useRef<string>('');
  const isTracking = useRef(false);

  // Initialiser le visitor ID au montage
  useEffect(() => {
    const id = getOrCreateVisitorId();
    setVisitorId(id);
    
    // Vérifier s'il y a une session existante
    const storedSession = getStoredSession();
    if (storedSession) {
      // Session valide si moins de 30 min
      const isValid = Date.now() - storedSession.timestamp < 30 * 60 * 1000;
      if (isValid) {
        setSessionId(storedSession.id);
      }
    }
  }, []);

  // Tracker les pages vues
  useEffect(() => {
    if (!visitorId || !pathname) return;
    if (pathname === lastTrackedPath.current) return;
    if (isTracking.current) return;

    const trackPageView = async () => {
      isTracking.current = true;
      lastTrackedPath.current = pathname;

      try {
        const response = await fetch('/api/analytics/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId,
            sessionId: sessionId || undefined,
            page: pathname,
            pageTitle: document.title,
            referrer: document.referrer || null,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            userEmail: user?.email,
            userId: user?.id,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.sessionId) {
            setSessionId(data.sessionId);
            storeSession(data.sessionId);
          }
        }
      } catch (error) {
        console.debug('Analytics tracking failed:', error);
      } finally {
        isTracking.current = false;
      }
    };

    trackPageView();
  }, [pathname, visitorId, sessionId, user]);

  // Fonction pour envoyer un événement de conversion
  const sendConversionEvent = useCallback(async (
    eventType: ConversionEventType,
    data: {
      productSlug?: string;
      productName?: string;
      productPrice?: number;
      quantity?: number;
      orderId?: string;
      orderTotal?: number;
      orderItemsCount?: number;
      cartTotal?: number;
      cartItemsCount?: number;
    }
  ) => {
    if (!sessionId || !visitorId) return;

    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          visitorId,
          eventType,
          userId: user?.id,
          ...data,
        }),
      });
    } catch (error) {
      console.debug('Conversion event failed:', error);
    }
  }, [sessionId, visitorId, user]);

  // Méthodes de tracking exposées
  const trackProductView = useCallback((product: ProductData) => {
    sendConversionEvent('product_view', {
      productSlug: product.slug,
      productName: product.name,
      productPrice: product.price,
    });
  }, [sendConversionEvent]);

  const trackAddToCart = useCallback((product: ProductData, quantity = 1, cart?: CartData) => {
    sendConversionEvent('add_to_cart', {
      productSlug: product.slug,
      productName: product.name,
      productPrice: product.price,
      quantity,
      cartTotal: cart?.total,
      cartItemsCount: cart?.itemsCount,
    });
  }, [sendConversionEvent]);

  const trackRemoveFromCart = useCallback((product: ProductData, quantity = 1, cart?: CartData) => {
    sendConversionEvent('remove_from_cart', {
      productSlug: product.slug,
      productName: product.name,
      productPrice: product.price,
      quantity,
      cartTotal: cart?.total,
      cartItemsCount: cart?.itemsCount,
    });
  }, [sendConversionEvent]);

  const trackCheckoutStart = useCallback((cart: CartData) => {
    sendConversionEvent('checkout_start', {
      cartTotal: cart.total,
      cartItemsCount: cart.itemsCount,
    });
  }, [sendConversionEvent]);

  const trackPurchase = useCallback((order: OrderData) => {
    sendConversionEvent('purchase', {
      orderId: order.orderId,
      orderTotal: order.total,
      orderItemsCount: order.itemsCount,
    });
  }, [sendConversionEvent]);

  return (
    <AnalyticsContext.Provider value={{
      sessionId,
      visitorId,
      trackProductView,
      trackAddToCart,
      trackRemoveFromCart,
      trackCheckoutStart,
      trackPurchase,
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
