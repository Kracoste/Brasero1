-- ============================================================================
-- LIMITE D'UTILISATION PAR UTILISATEUR POUR LES CODES PROMO
-- ============================================================================

-- 1. Ajouter la colonne max_uses_per_user à la table coupons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coupons' AND column_name = 'max_uses_per_user'
  ) THEN
    ALTER TABLE coupons ADD COLUMN max_uses_per_user INTEGER DEFAULT NULL;
    COMMENT ON COLUMN coupons.max_uses_per_user IS 'Nombre max d''utilisations par email. NULL = illimité.';
  END IF;
END $$;

-- 2. Créer la table de suivi des utilisations par email
CREATE TABLE IF NOT EXISTS coupon_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  used_at TIMESTAMPTZ DEFAULT now(),
  stripe_session_id TEXT
);

-- Index pour vérifier rapidement les usages par coupon+email
CREATE INDEX IF NOT EXISTS idx_coupon_uses_coupon_email ON coupon_uses(coupon_id, email);
CREATE INDEX IF NOT EXISTS idx_coupon_uses_email ON coupon_uses(email);

-- RLS : pas d'accès public, uniquement via service_role
ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;

-- Pas de policy = seul le service_role (admin) peut lire/écrire
