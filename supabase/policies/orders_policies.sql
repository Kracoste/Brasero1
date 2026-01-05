-- Row Level Security policies for the "orders" table
-- NOTE: Les admins accèdent aux commandes via le service_role key (admin client),
-- donc pas besoin de policy RLS pour les admins. Cela évite la récursion infinie
-- avec la table profiles.

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "user_orders_update_pending" ON public.orders;
DROP POLICY IF EXISTS "user_orders_delete_pending" ON public.orders;
DROP POLICY IF EXISTS "admin_orders_all" ON public.orders;
DROP POLICY IF EXISTS "user_orders_select" ON public.orders;
DROP POLICY IF EXISTS "user_orders_insert" ON public.orders;

-- SUPPRIMÉ: La policy admin_orders_all causait une récursion infinie avec profiles.role
-- L'accès admin se fait désormais uniquement via le client admin (service_role key)
-- qui bypass automatiquement RLS.

CREATE POLICY "user_orders_select" ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_orders_insert" ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_orders_update_pending" ON public.orders
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (
    auth.uid() = user_id
    AND status IN ('pending', 'cancelled')
  );

CREATE POLICY "user_orders_delete_pending" ON public.orders
  FOR DELETE
  USING (auth.uid() = user_id AND status = 'pending');
