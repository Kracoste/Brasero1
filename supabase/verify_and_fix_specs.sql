-- ⚠️ SCRIPT DE VÉRIFICATION ET CORRECTION DE LA COLONNE SPECS ⚠️
-- Exécutez ce script dans Supabase SQL Editor pour vérifier et corriger le problème
-- des produits compatibles qui disparaissent après rafraîchissement.
--
-- ⚠️ CE SCRIPT EST ESSENTIEL SI LES ACCESSOIRES COMPATIBLES NE SONT PAS SAUVEGARDÉS ⚠️

-- ============================================================================
-- ÉTAPE 1: Ajouter la colonne specs si elle n'existe pas
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'specs'
  ) THEN
    ALTER TABLE products ADD COLUMN specs JSONB DEFAULT NULL;
    RAISE NOTICE '✅ Colonne specs AJOUTÉE à la table products';
  ELSE
    RAISE NOTICE '✅ La colonne specs existe déjà';
  END IF;
END $$;

-- ============================================================================
-- ÉTAPE 2: Vérifier la structure de la colonne
-- ============================================================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'specs';

-- ============================================================================
-- ÉTAPE 3: Créer un index pour les performances (si pas existant)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_specs ON products USING GIN (specs);

-- ============================================================================
-- ÉTAPE 4: Vérifier les produits avec des specs
-- ============================================================================
SELECT 
  id, 
  name, 
  slug,
  specs,
  specs->'compatibleAccessories' as compatible_accessories
FROM products
WHERE specs IS NOT NULL
ORDER BY name
LIMIT 20;

-- ============================================================================
-- ÉTAPE 5: Vérifier tous les produits (même ceux sans specs)
-- ============================================================================
SELECT 
  id, 
  name, 
  slug,
  CASE 
    WHEN specs IS NULL THEN 'NULL (pas de specs)'
    WHEN specs->'compatibleAccessories' IS NULL THEN 'specs sans compatibleAccessories'
    ELSE 'OK - ' || (specs->'compatibleAccessories')::text
  END as status_compatible_accessories
FROM products
ORDER BY name
LIMIT 50;

-- ============================================================================
-- TEST OPTIONNEL: Pour tester l'écriture dans specs
-- Décommentez et modifiez avec un vrai slug de produit:
-- ============================================================================
-- UPDATE products 
-- SET specs = jsonb_build_object('compatibleAccessories', ARRAY['accessoire-test'])
-- WHERE slug = 'votre-slug-produit';

-- Puis vérifiez:
-- SELECT slug, specs FROM products WHERE slug = 'votre-slug-produit';

-- ============================================================================
-- RÉSULTAT ATTENDU:
-- ============================================================================
-- - La colonne specs doit être de type JSONB
-- - Les produits avec des accessoires compatibles doivent avoir:
--   specs: {"compatibleAccessories": ["slug-accessoire-1", "slug-accessoire-2"]}
-- 
-- SI LA COLONNE N'EXISTAIT PAS:
-- - Elle vient d'être créée
-- - Retournez sur l'admin, éditez un produit, ajoutez des accessoires compatibles
-- - Sauvegardez et vérifiez que les accessoires sont bien affichés
-- ============================================================================
