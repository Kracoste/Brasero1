-- Étape 1 : Supprimer l'ancienne contrainte CHECK sur discount_type
ALTER TABLE public.coupons
  DROP CONSTRAINT IF EXISTS coupons_discount_type_check;

-- Étape 2 : Ajouter la nouvelle contrainte avec free_shipping et shipping_discount
ALTER TABLE public.coupons
  ADD CONSTRAINT coupons_discount_type_check
  CHECK (discount_type IN ('percentage', 'fixed', 'free_shipping', 'shipping_discount'));

-- Vérification : lister la contrainte
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.coupons'::regclass
AND conname = 'coupons_discount_type_check';
