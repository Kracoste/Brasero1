-- Ajouter le type shipping_percent (réduction livraison en pourcentage)
ALTER TABLE public.coupons
  DROP CONSTRAINT IF EXISTS coupons_discount_type_check;

ALTER TABLE public.coupons
  ADD CONSTRAINT coupons_discount_type_check
  CHECK (discount_type IN ('percentage', 'fixed', 'free_shipping', 'shipping_discount', 'shipping_percent'));
