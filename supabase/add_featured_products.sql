-- Ajouter les colonnes is_featured et featured_order à la table products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 999;

-- Créer un index pour optimiser les requêtes de produits vedettes
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured, featured_order);

-- Ajouter des commentaires sur les colonnes
COMMENT ON COLUMN products.is_featured IS 'Indique si le produit est mis en vedette sur la page d''accueil';
COMMENT ON COLUMN products.featured_order IS 'Ordre d''affichage des produits vedettes (plus petit = plus prioritaire)';
