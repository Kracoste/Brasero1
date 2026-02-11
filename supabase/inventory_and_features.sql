-- ============================================================================
-- GESTION DES STOCKS ET COMMANDES
-- ============================================================================

-- Table pour gérer l'inventaire des produits
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  reserved INTEGER DEFAULT 0, -- Quantité réservée pendant checkout
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(product_id)
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON inventory(quantity) WHERE quantity <= low_stock_threshold;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_updated_at();

-- ============================================================================
-- AMÉLIORATION TABLE ORDERS
-- ============================================================================

-- Ajouter colonnes manquantes si elles n'existent pas
DO $$
BEGIN
  -- Statut de commande
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='status') THEN
    ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;
  
  -- Numéro de suivi
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='tracking_number') THEN
    ALTER TABLE orders ADD COLUMN tracking_number TEXT;
  END IF;
  
  -- Transporteur
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='carrier') THEN
    ALTER TABLE orders ADD COLUMN carrier TEXT;
  END IF;
  
  -- Date d'expédition
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipped_at') THEN
    ALTER TABLE orders ADD COLUMN shipped_at TIMESTAMPTZ;
  END IF;
  
  -- Date de livraison
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='delivered_at') THEN
    ALTER TABLE orders ADD COLUMN delivered_at TIMESTAMPTZ;
  END IF;
  
  -- Notes internes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='internal_notes') THEN
    ALTER TABLE orders ADD COLUMN internal_notes TEXT;
  END IF;
  
  -- Email envoyé
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='confirmation_email_sent') THEN
    ALTER TABLE orders ADD COLUMN confirmation_email_sent BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_email_sent') THEN
    ALTER TABLE orders ADD COLUMN shipping_email_sent BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Index sur statut pour filtres admin
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================================================
-- TABLE COUPONS (Codes promo)
-- ============================================================================

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER, -- NULL = illimité
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT positive_discount CHECK (discount_value > 0),
  CONSTRAINT valid_uses CHECK (current_uses >= 0 AND (max_uses IS NULL OR current_uses <= max_uses))
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_coupons_expires_at ON coupons(expires_at) WHERE is_active = true;

-- ============================================================================
-- TABLE REVIEWS (Avis clients)
-- ============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  moderator_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved) WHERE is_approved = true;

-- Trigger pour updated_at
CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_updated_at();

-- ============================================================================
-- TABLE EMAIL_LOGS (Historique emails envoyés)
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT NOT NULL, -- 'order_confirmation', 'order_shipped', etc.
  recipient_email TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'failed', 'bounced'
  provider_id TEXT, -- ID du provider (Resend, SendGrid, etc.)
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Inventory: Lecture publique, écriture admin uniquement
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view inventory" ON inventory
  FOR SELECT USING (true);

-- Reviews: Lecture publique (approuvées), écriture utilisateurs authentifiés
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can insert their own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Coupons: Lecture publique (actifs), gestion admin
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active coupons" ON coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Email logs: Admin uniquement
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- FONCTIONS UTILITAIRES
-- ============================================================================

-- Fonction pour réserver du stock (lors du checkout)
CREATE OR REPLACE FUNCTION reserve_stock(
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available INTEGER;
BEGIN
  -- Vérifier la disponibilité
  SELECT (quantity - reserved) INTO v_available
  FROM inventory
  WHERE product_id = p_product_id
  FOR UPDATE;
  
  IF v_available IS NULL OR v_available < p_quantity THEN
    RETURN false;
  END IF;
  
  -- Réserver la quantité
  UPDATE inventory
  SET reserved = reserved + p_quantity
  WHERE product_id = p_product_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour libérer du stock réservé (si checkout annulé)
CREATE OR REPLACE FUNCTION release_reserved_stock(
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE inventory
  SET reserved = GREATEST(0, reserved - p_quantity)
  WHERE product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour décrémenter le stock (commande confirmée)
CREATE OR REPLACE FUNCTION decrement_stock(
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available INTEGER;
BEGIN
  -- Vérifier et décrémenter
  UPDATE inventory
  SET 
    quantity = quantity - p_quantity,
    reserved = GREATEST(0, reserved - p_quantity)
  WHERE product_id = p_product_id
    AND (quantity - reserved) >= 0
  RETURNING quantity INTO v_available;
  
  RETURN v_available IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DONNÉES INITIALES
-- ============================================================================

-- Initialiser l'inventaire pour les produits existants
INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, 
  CASE 
    WHEN category = 'brasero' THEN 10
    WHEN category = 'accessoire' THEN 50
    ELSE 20
  END as quantity,
  CASE 
    WHEN category = 'brasero' THEN 3
    WHEN category = 'accessoire' THEN 10
    ELSE 5
  END as low_stock_threshold
FROM products
WHERE NOT EXISTS (
  SELECT 1 FROM inventory WHERE inventory.product_id = products.id
);

COMMENT ON TABLE inventory IS 'Gestion des stocks produits avec réservation pendant checkout';
COMMENT ON TABLE reviews IS 'Avis clients avec modération';
COMMENT ON TABLE coupons IS 'Codes promo et réductions';
COMMENT ON TABLE email_logs IS 'Historique des emails transactionnels envoyés';
