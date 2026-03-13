-- ⚠️ SCRIPT À EXÉCUTER DANS SUPABASE SQL EDITOR ⚠️
-- Crée la table blog_posts pour le système de blog SEO
--
-- INSTRUCTIONS:
-- 1. Aller sur: https://supabase.com/dashboard/project/kxztmjqxsskvbqcohtgj/sql/new
-- 2. Copier-coller ce script complet
-- 3. Cliquer sur "Run"

-- ============================================================================
-- TABLE blog_posts
-- ============================================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  category TEXT NOT NULL DEFAULT 'guide',
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  author TEXT DEFAULT 'L''équipe LBF',
  published_at TIMESTAMPTZ,
  is_published BOOLEAN DEFAULT false,
  featured_image JSONB,
  read_time INTEGER DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  related_products TEXT[] DEFAULT '{}',
  related_articles TEXT[] DEFAULT '{}',
  cta_product_slug TEXT,
  cta_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Lecture publique des articles publiés
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

-- Admin (service_role) peut tout faire — géré automatiquement par Supabase

-- ============================================================================
-- VÉRIFICATION
-- ============================================================================
SELECT 'Table blog_posts créée avec succès !' AS result;
