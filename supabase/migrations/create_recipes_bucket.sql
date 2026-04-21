-- Crée le bucket public 'recipes' pour les images de recettes
-- À exécuter dans Supabase SQL Editor

INSERT INTO storage.buckets (id, name, public)
VALUES ('recipes', 'recipes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policies : lecture publique + upload/update/delete pour utilisateurs authentifiés
-- (l'API /api/admin/storage/upload utilise de toute façon le service_role qui bypass RLS,
--  mais ces policies permettent aussi un accès client direct si besoin).

DROP POLICY IF EXISTS "recipes_public_read" ON storage.objects;
CREATE POLICY "recipes_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'recipes');

DROP POLICY IF EXISTS "recipes_auth_insert" ON storage.objects;
CREATE POLICY "recipes_auth_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'recipes');

DROP POLICY IF EXISTS "recipes_auth_update" ON storage.objects;
CREATE POLICY "recipes_auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'recipes');

DROP POLICY IF EXISTS "recipes_auth_delete" ON storage.objects;
CREATE POLICY "recipes_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'recipes');
