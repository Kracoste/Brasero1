-- Tables pour le dashboard admin
-- Exécutez ce SQL dans votre dashboard Supabase > SQL Editor

-- ================================================
-- TABLE: orders (Commandes)
-- ================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les commandes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- RLS pour orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Les admins peuvent tout faire sur les commandes
CREATE POLICY "Admin full access to orders" ON orders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Les utilisateurs peuvent voir leurs propres commandes
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer des commandes
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- TABLE: settings (Paramètres du site)
-- ================================================
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'Atelier LBF',
  site_description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  city TEXT DEFAULT 'Moncoutant',
  postal_code TEXT DEFAULT '79320',
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  free_shipping_threshold DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  tax_rate DECIMAL(5,2) DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT settings_single_row CHECK (id = 1)
);

-- RLS pour settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent modifier les paramètres
CREATE POLICY "Admin full access to settings" ON settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Tout le monde peut lire les paramètres (pour affichage sur le site)
CREATE POLICY "Public can read settings" ON settings
  FOR SELECT
  USING (true);

-- Insérer les paramètres par défaut
INSERT INTO settings (id, site_name, site_description, city, postal_code)
VALUES (1, 'Atelier LBF', 'Braséros premium Made in France', 'Moncoutant', '79320')
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- Mise à jour de la table profiles (si nécessaire)
-- ================================================
-- Ajouter les colonnes manquantes à profiles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'address') THEN
    ALTER TABLE profiles ADD COLUMN address TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'city') THEN
    ALTER TABLE profiles ADD COLUMN city TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'postal_code') THEN
    ALTER TABLE profiles ADD COLUMN postal_code TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
END $$;
