-- ============================================
-- Ajout de l'option gravure sur les produits
-- À exécuter dans le SQL Editor de Supabase
-- ============================================

-- 1. Ajouter les colonnes gravure à la table products
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS engraving_available BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS engraving_price DECIMAL(10,2) DEFAULT 0;

-- 2. Commentaires pour documentation
COMMENT ON COLUMN products.engraving_available IS 'Si true, le client peut ajouter une gravure personnalisée sur ce produit';
COMMENT ON COLUMN products.engraving_price IS 'Prix de l''option gravure en euros (ex: 25.00)';

-- Vérification
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
  AND column_name IN ('engraving_available', 'engraving_price');
