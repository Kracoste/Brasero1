-- Ajouter la colonne on_demand à la table products si elle n'existe pas déjà
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS on_demand BOOLEAN DEFAULT FALSE;

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_products_on_demand ON products(on_demand);

-- Ajouter un commentaire sur la colonne
COMMENT ON COLUMN products.on_demand IS 'Indique si le produit est disponible uniquement sur demande';
