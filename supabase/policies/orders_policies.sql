-- Row Level Security policies for the "orders" table

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;

CREATE POLICY "admin_orders_all" ON public.orders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

CREATE POLICY "user_orders_select" ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_orders_insert" ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
