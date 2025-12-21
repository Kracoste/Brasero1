-- Table pour le suivi des visites
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  page TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT visitor_id_length CHECK (char_length(visitor_id) <= 64)
);

CREATE INDEX IF NOT EXISTS idx_visits_created_at ON public.visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_visitor_id ON public.visits(visitor_id);

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert" ON public.visits;
DROP POLICY IF EXISTS "Allow admin read" ON public.visits;

CREATE POLICY "Allow anonymous insert" ON public.visits
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin read" ON public.visits
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE OR REPLACE VIEW public.visit_stats AS
SELECT 
  COUNT(*) AS total_visits,
  COUNT(DISTINCT visitor_id) AS unique_visitors,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS visits_today,
  COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) AS visits_this_month,
  COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('year', CURRENT_DATE)) AS visits_this_year
FROM public.visits;
