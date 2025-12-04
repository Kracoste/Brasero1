-- Créer la table visits pour tracker les visites du site
-- Exécutez ce SQL dans votre dashboard Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour accélérer les requêtes
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_visitor_id ON visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visits_page ON visits(page);

-- Activer RLS (Row Level Security)
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Permettre à tout le monde d'insérer des visites (anonyme)
CREATE POLICY "Allow anonymous inserts" ON visits
  FOR INSERT
  WITH CHECK (true);

-- Permettre seulement aux admins de lire les visites
CREATE POLICY "Allow admin to read visits" ON visits
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
