-- ============================================
-- SCRIPT DE RÉINITIALISATION DES STATISTIQUES
-- ============================================
-- Exécutez ce script dans le SQL Editor de Supabase
-- pour réinitialiser toutes les statistiques d'analytics

-- 1. Ajouter les nouvelles colonnes si elles n'existent pas
ALTER TABLE visitor_sessions 
ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;

ALTER TABLE visitor_sessions 
ADD COLUMN IF NOT EXISTS correlated_visitor_id UUID;

ALTER TABLE visitor_sessions 
ADD COLUMN IF NOT EXISTS is_returning_by_ip BOOLEAN DEFAULT FALSE;

-- 2. Créer un index sur ip_address pour améliorer les performances de corrélation
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_ip_address 
ON visitor_sessions(ip_address);

CREATE INDEX IF NOT EXISTS idx_visitor_sessions_ip_browser_os 
ON visitor_sessions(ip_address, browser, os);

-- 3. Réinitialiser les tables d'analytics
TRUNCATE TABLE page_views CASCADE;
TRUNCATE TABLE conversion_events CASCADE;
TRUNCATE TABLE visitor_sessions CASCADE;

-- 4. Vérifier que les tables sont vides
SELECT 'visitor_sessions' as table_name, COUNT(*) as count FROM visitor_sessions
UNION ALL
SELECT 'page_views' as table_name, COUNT(*) as count FROM page_views
UNION ALL
SELECT 'conversion_events' as table_name, COUNT(*) as count FROM conversion_events;

-- ============================================
-- OPTIONNEL: Réinitialiser aussi les commandes
-- ============================================
-- ATTENTION: Cela supprime l'historique des ventes !
-- Décommentez les lignes ci-dessous si nécessaire

-- TRUNCATE TABLE order_items CASCADE;
-- TRUNCATE TABLE orders CASCADE;
