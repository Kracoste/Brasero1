-- Ajout d'une colonne JSONB pour persister la personnalisation (images/textes par face)
-- choisie par l'utilisateur sur un article du panier. Sans cette colonne,
-- les personnalisations sont perdues à chaque rechargement depuis la DB.
ALTER TABLE cart_items
  ADD COLUMN IF NOT EXISTS customization jsonb;
