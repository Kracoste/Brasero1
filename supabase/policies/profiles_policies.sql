-- Corriger la récursion infinie sur la table profiles
-- À exécuter dans Supabase SQL Editor

-- Supprimer toutes les policies existantes sur profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Désactiver temporairement RLS pour nettoyer
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Réactiver RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Créer des policies simples sans récursion
-- Policy pour que chaque utilisateur puisse voir son propre profil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy pour que chaque utilisateur puisse mettre à jour son propre profil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy pour permettre l'insertion du profil lors de la création du compte
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- OPTIONNEL: Si vous voulez que les admins puissent voir tous les profils
-- vous devez le faire via le service_role key (admin client) et non via RLS
