-- RLS Policies pour cart et cart_items
-- À exécuter dans Supabase SQL Editor

-- Activer RLS sur les tables
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can view their own cart" ON cart;
DROP POLICY IF EXISTS "Users can create their own cart" ON cart;
DROP POLICY IF EXISTS "Users can update their own cart" ON cart;
DROP POLICY IF EXISTS "Users can delete their own cart" ON cart;

DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;

DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;

-- Policies pour la table cart
CREATE POLICY "Users can view their own cart" ON cart
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart" ON cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON cart
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart" ON cart
  FOR DELETE USING (auth.uid() = user_id);

-- Policies pour la table cart_items
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cart WHERE cart.id = cart_items.cart_id AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM cart WHERE cart.id = cart_items.cart_id AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM cart WHERE cart.id = cart_items.cart_id AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM cart WHERE cart.id = cart_items.cart_id AND cart.user_id = auth.uid()
    )
  );

-- Policies pour la table favorites
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);
