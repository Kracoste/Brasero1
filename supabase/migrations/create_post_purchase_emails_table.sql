CREATE TABLE IF NOT EXISTS post_purchase_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  email_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  recipient_email TEXT NOT NULL,
  UNIQUE(order_id, email_type)
);

CREATE INDEX idx_post_purchase_order ON post_purchase_emails(order_id);
