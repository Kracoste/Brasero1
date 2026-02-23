-- Ajouter la colonne variants (JSONB) à la table products
-- Format : [{ "label": "Ø60 cm", "diameter": 60, "price": 590, "weight": "25 kg" }, ...]
-- Si variants est null ou vide, le produit n'a pas de variantes (comportement classique)

ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT NULL;

-- Vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name = 'variants';
