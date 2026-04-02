-- Table pour stocker les demandes de rappel du chatbot
CREATE TABLE IF NOT EXISTS callback_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  context TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour lister les demandes en attente
CREATE INDEX IF NOT EXISTS idx_callback_requests_status ON callback_requests (status, created_at DESC);

-- RLS
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;

-- Politique : tout le monde peut insérer (visiteurs anonymes)
CREATE POLICY "Anyone can insert callback requests"
  ON callback_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique : seuls les admins peuvent lire/modifier
CREATE POLICY "Only admins can read callback requests"
  ON callback_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Only admins can update callback requests"
  ON callback_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
