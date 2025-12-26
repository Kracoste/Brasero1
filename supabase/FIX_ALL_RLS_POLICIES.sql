-- ⚠️ SCRIPT COMPLET POUR CORRIGER TOUTES LES POLICIES RLS ⚠️
-- Corrige l'erreur: "infinite recursion detected in policy for relation 'profiles'"
-- 
-- Ce script supprime toutes les références à profiles.role dans les policies
-- et utilise une approche plus simple.

-- ============================================================================
-- ÉTAPE 1: CORRIGER LA TABLE PROFILES
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "admin_full_access" ON profiles;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- ÉTAPE 2: CORRIGER LA TABLE PRODUCTS (si RLS est activé)
-- ============================================================================
-- D'abord, supprimer les policies existantes qui pourraient référencer profiles
DROP POLICY IF EXISTS "admin_products_all" ON products;
DROP POLICY IF EXISTS "Admin full access to products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Public read access" ON products;

-- Vérifier si RLS est activé sur products
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'products'
  ) THEN
    -- Désactiver RLS sur products (les produits sont publics en lecture)
    -- Les modifications admin passent par service_role
    ALTER TABLE products DISABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- ============================================================================
-- ÉTAPE 3: CORRIGER LA TABLE ORDERS
-- ============================================================================
DROP POLICY IF EXISTS "admin_orders_all" ON orders;
DROP POLICY IF EXISTS "Admin full access to orders" ON orders;
DROP POLICY IF EXISTS "user_orders_select" ON orders;
DROP POLICY IF EXISTS "user_orders_insert" ON orders;
DROP POLICY IF EXISTS "user_orders_update_pending" ON orders;
DROP POLICY IF EXISTS "user_orders_delete_pending" ON orders;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "user_orders_select" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer des commandes
CREATE POLICY "user_orders_insert" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leurs commandes en attente
CREATE POLICY "user_orders_update_pending" ON orders
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status IN ('pending', 'cancelled'));

-- Les utilisateurs peuvent supprimer leurs commandes en attente
CREATE POLICY "user_orders_delete_pending" ON orders
  FOR DELETE USING (auth.uid() = user_id AND status = 'pending');

-- NOTE: Les admins accèdent aux commandes via le service_role key (API routes)

-- ============================================================================
-- ÉTAPE 4: CORRIGER LA TABLE VISITS
-- ============================================================================
DROP POLICY IF EXISTS "Allow anonymous insert" ON visits;
DROP POLICY IF EXISTS "Allow admin read" ON visits;

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut insérer des visites (tracking anonyme)
CREATE POLICY "Allow anonymous insert" ON visits
  FOR INSERT WITH CHECK (true);

-- Pour la lecture, les admins passent par service_role (API routes)
-- Pas de policy SELECT pour éviter les problèmes de récursion

-- ============================================================================
-- ÉTAPE 5: VÉRIFICATION
-- ============================================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename IN ('profiles', 'products', 'orders', 'visits')
ORDER BY tablename, policyname;

-- ============================================================================
-- TERMINÉ !
-- ============================================================================
-- IMPORTANT: Les opérations admin (lecture de tous les profils, commandes, etc.)
-- doivent passer par des API routes qui utilisent le service_role key.
