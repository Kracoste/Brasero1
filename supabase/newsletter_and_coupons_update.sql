-- Table newsletter_subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Activer RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Politique : seul le service_role peut insérer/lire
CREATE POLICY "Service role full access on newsletter"
  ON newsletter_subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Ajouter la colonne applicable_products à coupons si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coupons' AND column_name = 'applicable_products'
  ) THEN
    ALTER TABLE coupons ADD COLUMN applicable_products TEXT[] DEFAULT NULL;
    COMMENT ON COLUMN coupons.applicable_products IS 'Array de slugs produits. NULL = tous les produits.';
  END IF;
END $$;
