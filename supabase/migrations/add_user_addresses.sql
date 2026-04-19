-- Table user_addresses : carnet d'adresses multiples par utilisateur
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  address_line2 TEXT,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'France',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_addresses_one_default
  ON public.user_addresses(user_id) WHERE is_default = TRUE;

ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_addresses_select_own" ON public.user_addresses;
CREATE POLICY "user_addresses_select_own" ON public.user_addresses
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_addresses_insert_own" ON public.user_addresses;
CREATE POLICY "user_addresses_insert_own" ON public.user_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_addresses_update_own" ON public.user_addresses;
CREATE POLICY "user_addresses_update_own" ON public.user_addresses
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_addresses_delete_own" ON public.user_addresses;
CREATE POLICY "user_addresses_delete_own" ON public.user_addresses
  FOR DELETE USING (auth.uid() = user_id);
