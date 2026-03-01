-- Ajouter la colonne config_images (JSONB) à la table products
-- Format : { "corten-inox": [{src, alt, width, height, blurDataURL}, ...], ... }
-- Si config_images est null, le produit utilise le tableau images classique (aucun impact)
ALTER TABLE products ADD COLUMN IF NOT EXISTS config_images JSONB DEFAULT NULL;

-- Ajouter la colonne configurations (JSONB) à la table products
-- Format : { "corten-inox-80": { images: [...], description: "...", price: 1590, faq: [...], characteristics: [...], ... }, ... }
-- Sous-fiches complètes par combinaison finition × plancha × diamètre
-- Si configurations est null, le produit utilise les données classiques (images, description, faq du produit)
ALTER TABLE products ADD COLUMN IF NOT EXISTS configurations JSONB DEFAULT NULL;

-- Vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('config_images', 'configurations');
