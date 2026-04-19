-- Étendre le type de coupons pour supporter la livraison gratuite
-- et la réduction sur les frais de livraison.
--
-- Types existants :
--   - 'percentage'         : -X% sur le panier
--   - 'fixed'              : -X€ sur le panier
-- Types ajoutés :
--   - 'free_shipping'      : livraison 100% offerte (discount_value ignoré)
--   - 'shipping_discount'  : -X€ sur les frais de livraison (ex: discount_value = 40)

ALTER TABLE public.coupons
  DROP CONSTRAINT IF EXISTS coupons_discount_type_check;

ALTER TABLE public.coupons
  ADD CONSTRAINT coupons_discount_type_check
  CHECK (discount_type IN ('percentage', 'fixed', 'free_shipping', 'shipping_discount'));
