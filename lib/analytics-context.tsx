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

// ============================================
// DÉTECTION DES BOTS (améliore la précision)
// ============================================
const BOT_PATTERNS = [
  'bot', 'crawl', 'spider', 'slurp', 'mediapartners',
  'googlebot', 'bingbot', 'yandex', 'baidu', 'duckduck',
  'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'telegrambot', 'discordbot', 'slackbot',
  'pingdom', 'uptimerobot', 'headless', 'phantom', 'selenium',
  'puppeteer', 'lighthouse', 'pagespeed', 'gtmetrix',
];

function isBot(): boolean {
  if (typeof navigator === 'undefined') return true;
  
  const ua = navigator.userAgent.toLowerCase();
  
  // Vérifier les patterns de bot
  if (BOT_PATTERNS.some(pattern => ua.includes(pattern))) return true;
  
  // Vérifier webdriver (automation)
  if ((navigator as any).webdriver) return true;
  
  // Vérifier les plugins (les bots n'en ont généralement pas)
  if (navigator.plugins && navigator.plugins.length === 0 && !ua.includes('mobile')) {
    // Desktop sans plugins = probablement headless
    return true;
  }
  
  return false;
}

// ============================================
// FINGERPRINT (identification plus précise)
// ============================================
function generateFingerprint(): string {
  if (typeof window === 'undefined') return '';
  
  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.languages?.join(',') || '',
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    (navigator as any).deviceMemory || 0,
    // Canvas fingerprint simplifié
    (() => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('fp', 2, 2);
        return canvas.toDataURL().slice(-50);
      } catch {
        return '';
      }
    })(),
  ];
  
  // Hash simple
  let hash = 0;
  const str = components.join('|');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ============================================
// VISITOR ID avec fingerprint
// ============================================
function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  
  const fingerprint = generateFingerprint();
  const storageKey = 'analytics_visitor_id';
  const fpKey = 'analytics_fingerprint';
  
  let visitorId = localStorage.getItem(storageKey);
  const storedFingerprint = localStorage.getItem(fpKey);
  
  // Si le fingerprint a changé significativement, c'est peut-être un nouveau visiteur
  // Mais on garde l'ancien ID pour la continuité (le fingerprint peut varier légèrement)
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(storageKey, visitorId);
    localStorage.setItem(fpKey, fingerprint);
  } else if (!storedFingerprint) {
    localStorage.setItem(fpKey, fingerprint);
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
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // NE PAS TRACKER les bots et admins
  // ============================================
  const shouldTrack = useCallback(() => {
    // Ne pas tracker les bots
    if (isBot()) return false;
    // Ne pas tracker les admins
    if (isAdmin) return false;
    // Ne pas tracker les pages admin
    if (pathname?.startsWith('/admin')) return false;
    return true;
  }, [isAdmin, pathname]);

  // Initialiser le visitor ID au montage
  useEffect(() => {
    // Skip si bot détecté
    if (isBot()) return;
    
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

  // ============================================
  // HEARTBEAT pour mesurer la durée réelle
  // ============================================
  useEffect(() => {
    if (!sessionId || !shouldTrack()) return;

    // Envoyer un heartbeat toutes les 30 secondes
    heartbeatInterval.current = setInterval(async () => {
      try {
        await fetch('/api/analytics/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
          keepalive: true, // Permet d'envoyer même si l'onglet se ferme
        });
      } catch {
        // Silencieux
      }
    }, 30000);

    // Cleanup
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, [sessionId, shouldTrack]);

  // Envoyer un dernier heartbeat quand l'utilisateur quitte
  useEffect(() => {
    if (!sessionId) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && sessionId) {
        // Utiliser sendBeacon pour garantir l'envoi
        navigator.sendBeacon('/api/analytics/heartbeat', JSON.stringify({ sessionId, isLeaving: true }));
      }
    };

    const handleBeforeUnload = () => {
      if (sessionId) {
        navigator.sendBeacon('/api/analytics/heartbeat', JSON.stringify({ sessionId, isLeaving: true }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

  // Tracker les pages vues
  useEffect(() => {
    if (!visitorId || !pathname) return;
    if (pathname === lastTrackedPath.current) return;
    if (isTracking.current) return;
    if (!shouldTrack()) return;

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
