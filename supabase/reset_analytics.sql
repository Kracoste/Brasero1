-- ============================================
-- SCRIPT DE RÉINITIALISATION DES STATISTIQUES
-- ============================================
-- Exécutez ce script dans le SQL Editor de Supabase
-- pour réinitialiser toutes les statistiques d'analytics

-- 1. Ajouter la colonne ended_at si elle n'existe pas
ALTER TABLE visitor_sessions 
ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;

-- 2. Réinitialiser les tables d'analytics
TRUNCATE TABLE page_views CASCADE;
TRUNCATE TABLE conversion_events CASCADE;
TRUNCATE TABLE visitor_sessions CASCADE;

-- 3. Vérifier que les tables sont vides
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
