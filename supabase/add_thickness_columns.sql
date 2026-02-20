-- ÉTAPE 1 : Migrer les données des colonnes camelCase vers snake_case
-- (pour ne pas perdre les valeurs existantes)
UPDATE products 
SET bowl_thickness = COALESCE(bowl_thickness, "bowlThickness"),
    base_thickness = COALESCE(base_thickness, "baseThickness")
WHERE "bowlThickness" IS NOT NULL OR "baseThickness" IS NOT NULL;

-- ÉTAPE 2 : Supprimer les colonnes camelCase en doublon
ALTER TABLE products DROP COLUMN IF EXISTS "bowlThickness";
ALTER TABLE products DROP COLUMN IF EXISTS "baseThickness";

-- Vérification : seules les colonnes snake_case doivent rester
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('bowl_thickness', 'base_thickness', 'bowlThickness', 'baseThickness');
