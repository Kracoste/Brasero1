-- ============================================================================
-- ANTI-ABUS : vérification par adresse de livraison + IP
-- Un même utilisateur physique ne peut pas contourner la limite en créant
-- plusieurs comptes avec des emails différents.
-- ============================================================================

-- Ajouter les colonnes de fingerprint anti-abus
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coupon_uses' AND column_name = 'shipping_hash'
  ) THEN
    ALTER TABLE coupon_uses ADD COLUMN shipping_hash TEXT;
    COMMENT ON COLUMN coupon_uses.shipping_hash IS 'SHA-256 de "prénom|nom|adresse|code_postal" normalisé (minuscules, sans espaces superflus). Permet de détecter le multi-compte sur une même adresse.';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coupon_uses' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE coupon_uses ADD COLUMN ip_address TEXT;
    COMMENT ON COLUMN coupon_uses.ip_address IS 'Adresse IP du client au moment de l''utilisation.';
  END IF;
END $$;

-- Index pour la vérification par adresse de livraison
CREATE INDEX IF NOT EXISTS idx_coupon_uses_coupon_shipping ON coupon_uses(coupon_id, shipping_hash)
  WHERE shipping_hash IS NOT NULL;
