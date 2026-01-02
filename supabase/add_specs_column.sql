-- ⚠️ SCRIPT POUR AJOUTER LA COLONNE SPECS À LA TABLE PRODUCTS ⚠️
-- Ce script ajoute la colonne specs de type JSONB si elle n'existe pas déjà.
-- Cette colonne stocke les données supplémentaires du produit comme:
-- - compatibleAccessories (liste des slugs des accessoires compatibles)
-- - format (rond, hexagonal, carré)
-- - painting (peinture)
-- - numberOfGuests (nombre de convives)
-- - fuelType (types de combustible)

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
    RAISE NOTICE 'Colonne specs ajoutée à la table products';
  ELSE
    RAISE NOTICE 'La colonne specs existe déjà dans la table products';
  END IF;
END $$;

-- ============================================================================
-- ÉTAPE 2: Créer un index sur la colonne specs pour améliorer les performances
-- (optionnel mais recommandé pour les recherches JSONB)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_specs ON products USING GIN (specs);

-- ============================================================================
-- ÉTAPE 3: Vérifier que la colonne a été créée correctement
-- ============================================================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'specs';

-- ============================================================================
-- TERMINÉ ! 
-- ============================================================================
-- Après avoir exécuté ce script, les specs (y compris compatibleAccessories)
-- seront correctement stockées et persistées.
