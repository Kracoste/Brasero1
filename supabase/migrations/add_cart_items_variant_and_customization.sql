-- Ajout des colonnes manquantes sur cart_items :
--   - variant_label : libellé de variante choisi (ex: "40cm", "Rouge")
--   - customization  : JSONB pour la personnalisation (images/textes par face)
-- Sans ces colonnes, loadCart échoue avec "column does not exist" et le panier
-- de l'utilisateur connecté ne peut pas être rechargé après reconnexion.
ALTER TABLE cart_items
  ADD COLUMN IF NOT EXISTS variant_label text;

ALTER TABLE cart_items
  ADD COLUMN IF NOT EXISTS customization jsonb;
