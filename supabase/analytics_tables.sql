-- =====================================================
-- SYSTÈME D'ANALYTICS AVANCÉ POUR E-COMMERCE
-- =====================================================
-- Ce script crée les tables nécessaires pour un tracking
-- précis des visiteurs, sessions et conversions.
-- 
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- 1. TABLE DES SESSIONS DE VISITE
-- Une session = une visite continue sur le site (timeout 30 min)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Identification du visiteur
  visitor_id TEXT NOT NULL,                    -- ID unique du navigateur (localStorage)
  fingerprint TEXT,                            -- Fingerprint navigateur pour déduplication
  ip_address TEXT,                             -- Adresse IP (hashée pour RGPD)
  
  -- Informations techniques
  user_agent TEXT,
  device_type TEXT,                            -- 'desktop', 'mobile', 'tablet'
  browser TEXT,                                -- 'Chrome', 'Safari', etc.
  os TEXT,                                     -- 'Windows', 'macOS', 'iOS', etc.
  screen_resolution TEXT,                      -- '1920x1080'
  language TEXT,                               -- 'fr', 'en', etc.
  
  -- Lien avec utilisateur connecté (nullable)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,                             -- Pour référence rapide
  
  -- Source du trafic
  referrer TEXT,                               -- D'où vient le visiteur
  utm_source TEXT,                             -- google, facebook, etc.
  utm_medium TEXT,                             -- cpc, organic, social, etc.
  utm_campaign TEXT,                           -- Nom de la campagne
  entry_page TEXT NOT NULL DEFAULT '/',        -- Première page visitée
  
  -- Métriques de session
  page_count INTEGER DEFAULT 1,                -- Nombre de pages vues
  duration_seconds INTEGER DEFAULT 0,          -- Durée totale de la session
  is_bounce BOOLEAN DEFAULT true,              -- True si 1 seule page vue
  
  -- Exclusion admin
  is_admin BOOLEAN DEFAULT false,              -- True si c'est un admin (à exclure des stats)
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  
  -- Contraintes
  CONSTRAINT visitor_id_length CHECK (char_length(visitor_id) <= 64)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON public.visitor_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON public.visitor_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.visitor_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_is_admin ON public.visitor_sessions(is_admin);
CREATE INDEX IF NOT EXISTS idx_sessions_not_admin ON public.visitor_sessions(started_at DESC) WHERE is_admin = false;


-- 2. TABLE DES PAGES VUES
-- Chaque page vue dans une session
-- =====================================================
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Lien avec la session
  session_id UUID NOT NULL REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  
  -- Informations de la page
  page_path TEXT NOT NULL,                     -- /produits/brasero-classique
  page_title TEXT,                             -- Titre de la page
  page_type TEXT,                              -- 'home', 'product', 'category', 'cart', 'checkout'
  
  -- Pour les pages produit
  product_slug TEXT,                           -- Slug du produit si page produit
  product_name TEXT,                           -- Nom du produit
  product_price DECIMAL(10,2),                 -- Prix du produit
  
  -- Temps passé
  time_on_page_seconds INTEGER,                -- Temps passé sur cette page
  
  -- Timestamp
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON public.page_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON public.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_product_slug ON public.page_views(product_slug) WHERE product_slug IS NOT NULL;


-- 3. TABLE DES ÉVÉNEMENTS DE CONVERSION
-- Actions importantes: vue produit, ajout panier, checkout, achat
-- =====================================================
CREATE TABLE IF NOT EXISTS public.conversion_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Lien avec la session
  session_id UUID NOT NULL REFERENCES public.visitor_sessions(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Type d'événement
  event_type TEXT NOT NULL,                    -- 'product_view', 'add_to_cart', 'remove_from_cart', 'checkout_start', 'purchase'
  
  -- Données du produit (si applicable)
  product_slug TEXT,
  product_name TEXT,
  product_price DECIMAL(10,2),
  quantity INTEGER DEFAULT 1,
  
  -- Données de commande (pour 'purchase')
  order_id TEXT,
  order_total DECIMAL(10,2),
  order_items_count INTEGER,
  
  -- Données du panier (pour 'add_to_cart', 'checkout_start')
  cart_total DECIMAL(10,2),
  cart_items_count INTEGER,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_session_id ON public.conversion_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.conversion_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_product_slug ON public.conversion_events(product_slug) WHERE product_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON public.conversion_events(visitor_id);


-- 4. POLITIQUES RLS (Row Level Security)
-- =====================================================
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow insert visitor_sessions" ON public.visitor_sessions;
DROP POLICY IF EXISTS "Allow update visitor_sessions" ON public.visitor_sessions;
DROP POLICY IF EXISTS "Allow admin read visitor_sessions" ON public.visitor_sessions;

DROP POLICY IF EXISTS "Allow insert page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow admin read page_views" ON public.page_views;

DROP POLICY IF EXISTS "Allow insert conversion_events" ON public.conversion_events;
DROP POLICY IF EXISTS "Allow admin read conversion_events" ON public.conversion_events;

-- Politiques pour visitor_sessions
CREATE POLICY "Allow insert visitor_sessions" ON public.visitor_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update visitor_sessions" ON public.visitor_sessions
  FOR UPDATE USING (true);

CREATE POLICY "Allow admin read visitor_sessions" ON public.visitor_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Politiques pour page_views
CREATE POLICY "Allow insert page_views" ON public.page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read page_views" ON public.page_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Politiques pour conversion_events
CREATE POLICY "Allow insert conversion_events" ON public.conversion_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read conversion_events" ON public.conversion_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );


-- 5. VUES POUR LES STATISTIQUES
-- =====================================================

-- Vue des statistiques globales (exclut les admins)
CREATE OR REPLACE VIEW public.analytics_overview AS
SELECT 
  -- Aujourd'hui
  COUNT(*) FILTER (WHERE started_at >= CURRENT_DATE AND NOT is_admin) AS sessions_today,
  COUNT(DISTINCT visitor_id) FILTER (WHERE started_at >= CURRENT_DATE AND NOT is_admin) AS unique_visitors_today,
  
  -- Cette semaine
  COUNT(*) FILTER (WHERE started_at >= DATE_TRUNC('week', CURRENT_DATE) AND NOT is_admin) AS sessions_this_week,
  COUNT(DISTINCT visitor_id) FILTER (WHERE started_at >= DATE_TRUNC('week', CURRENT_DATE) AND NOT is_admin) AS unique_visitors_this_week,
  
  -- Ce mois
  COUNT(*) FILTER (WHERE started_at >= DATE_TRUNC('month', CURRENT_DATE) AND NOT is_admin) AS sessions_this_month,
  COUNT(DISTINCT visitor_id) FILTER (WHERE started_at >= DATE_TRUNC('month', CURRENT_DATE) AND NOT is_admin) AS unique_visitors_this_month,
  
  -- Cette année
  COUNT(*) FILTER (WHERE started_at >= DATE_TRUNC('year', CURRENT_DATE) AND NOT is_admin) AS sessions_this_year,
  COUNT(DISTINCT visitor_id) FILTER (WHERE started_at >= DATE_TRUNC('year', CURRENT_DATE) AND NOT is_admin) AS unique_visitors_this_year,
  
  -- Total
  COUNT(*) FILTER (WHERE NOT is_admin) AS total_sessions,
  COUNT(DISTINCT visitor_id) FILTER (WHERE NOT is_admin) AS total_unique_visitors,
  
  -- Métriques moyennes
  ROUND(AVG(page_count) FILTER (WHERE NOT is_admin), 1) AS avg_pages_per_session,
  ROUND(AVG(duration_seconds) FILTER (WHERE NOT is_admin AND duration_seconds > 0), 0) AS avg_session_duration_seconds,
  ROUND(100.0 * COUNT(*) FILTER (WHERE is_bounce AND NOT is_admin) / NULLIF(COUNT(*) FILTER (WHERE NOT is_admin), 0), 1) AS bounce_rate_percent

FROM public.visitor_sessions;


-- Vue du taux de conversion par étape
CREATE OR REPLACE VIEW public.conversion_funnel AS
WITH session_events AS (
  SELECT 
    s.id as session_id,
    s.started_at,
    s.is_admin,
    BOOL_OR(e.event_type = 'product_view') as has_product_view,
    BOOL_OR(e.event_type = 'add_to_cart') as has_add_to_cart,
    BOOL_OR(e.event_type = 'checkout_start') as has_checkout_start,
    BOOL_OR(e.event_type = 'purchase') as has_purchase
  FROM public.visitor_sessions s
  LEFT JOIN public.conversion_events e ON e.session_id = s.id
  WHERE NOT s.is_admin
  GROUP BY s.id, s.started_at, s.is_admin
)
SELECT 
  -- Période: Ce mois
  'this_month' as period,
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE has_product_view) as product_views,
  COUNT(*) FILTER (WHERE has_add_to_cart) as add_to_cart,
  COUNT(*) FILTER (WHERE has_checkout_start) as checkout_start,
  COUNT(*) FILTER (WHERE has_purchase) as purchases,
  -- Taux de conversion
  ROUND(100.0 * COUNT(*) FILTER (WHERE has_product_view) / NULLIF(COUNT(*), 0), 1) as view_rate,
  ROUND(100.0 * COUNT(*) FILTER (WHERE has_add_to_cart) / NULLIF(COUNT(*), 0), 1) as cart_rate,
  ROUND(100.0 * COUNT(*) FILTER (WHERE has_checkout_start) / NULLIF(COUNT(*), 0), 1) as checkout_rate,
  ROUND(100.0 * COUNT(*) FILTER (WHERE has_purchase) / NULLIF(COUNT(*), 0), 1) as purchase_rate
FROM session_events
WHERE started_at >= DATE_TRUNC('month', CURRENT_DATE);


-- Vue des produits les plus vus
CREATE OR REPLACE VIEW public.top_products_viewed AS
SELECT 
  product_slug,
  product_name,
  COUNT(*) as view_count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM public.conversion_events
WHERE event_type = 'product_view'
  AND product_slug IS NOT NULL
  AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY product_slug, product_name
ORDER BY view_count DESC
LIMIT 10;


-- Vue des produits les plus ajoutés au panier
CREATE OR REPLACE VIEW public.top_products_carted AS
SELECT 
  product_slug,
  product_name,
  COUNT(*) as cart_count,
  SUM(quantity) as total_quantity
FROM public.conversion_events
WHERE event_type = 'add_to_cart'
  AND product_slug IS NOT NULL
  AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY product_slug, product_name
ORDER BY cart_count DESC
LIMIT 10;


-- 6. FONCTION POUR NETTOYER LES ANCIENNES DONNÉES (optionnel)
-- Garde 1 an d'historique
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  -- Supprimer les sessions de plus d'un an
  DELETE FROM public.visitor_sessions
  WHERE started_at < NOW() - INTERVAL '1 year';
  
  -- Note: page_views et conversion_events sont supprimés automatiquement
  -- grâce à ON DELETE CASCADE
END;
$$ LANGUAGE plpgsql;


-- 7. MESSAGE DE SUCCÈS
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Tables analytics créées avec succès !';
  RAISE NOTICE 'Tables: visitor_sessions, page_views, conversion_events';
  RAISE NOTICE 'Vues: analytics_overview, conversion_funnel, top_products_viewed, top_products_carted';
END $$;
