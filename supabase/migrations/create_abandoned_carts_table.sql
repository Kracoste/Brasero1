CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL DEFAULT '[]',
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_abandoned_carts_email ON abandoned_carts(email);
CREATE INDEX idx_abandoned_carts_pending ON abandoned_carts(email_sent, created_at);
