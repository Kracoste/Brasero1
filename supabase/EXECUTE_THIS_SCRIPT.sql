-- ⚠️ SCRIPT À EXÉCUTER DANS SUPABASE SQL EDITOR ⚠️
-- Pour corriger l'erreur: "infinite recursion detected in policy for relation 'profiles'"
-- 
-- INSTRUCTIONS:
-- 1. Aller sur: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
-- 2. Copier-coller ce script complet
-- 3. Cliquer sur "Run" (Exécuter)
-- 4. Vérifier qu'il n'y a pas d'erreurs
-- 5. Tester l'édition de produit sur votre site

-- ============================================================================
-- ÉTAPE 1: Supprimer toutes les policies existantes sur profiles
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- ============================================================================
-- ÉTAPE 2: S'assurer que RLS est activé
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ÉTAPE 3: Créer des policies SIMPLES sans récursion
-- ============================================================================

-- Policy pour que chaque utilisateur puisse voir son propre profil
-- Utilise UNIQUEMENT auth.uid() = id sans référence circulaire
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy pour que chaque utilisateur puisse mettre à jour son propre profil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE 
  USING (auth.uid() = id);

-- Policy pour permettre l'insertion du profil lors de la création du compte
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- ÉTAPE 4: Vérifier les policies créées
-- ============================================================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- ============================================================================
-- TERMINÉ ! 
-- ============================================================================
-- Les policies sont maintenant simples et ne créent plus de récursion.
-- Les admins accèdent aux profiles via les API routes avec service_role key.
