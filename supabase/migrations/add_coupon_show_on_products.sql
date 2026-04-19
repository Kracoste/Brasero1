-- Ajout d'un toggle permettant à l'admin de choisir si un coupon
-- s'affiche ou non en bulle promo sur les pages produits.
-- Par défaut false pour éviter qu'un code promo privé/checkout-only
-- n'apparaisse publiquement.
ALTER TABLE coupons
  ADD COLUMN IF NOT EXISTS show_on_products boolean NOT NULL DEFAULT false;
