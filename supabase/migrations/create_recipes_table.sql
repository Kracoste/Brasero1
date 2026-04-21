-- Table des recettes : contenu SEO optimisé + schema Recipe Google
-- Chaque recette a sa propre page /recettes/[slug] pour maximiser
-- l'indexation et bénéficier des résultats enrichis (étoiles, image dans SERP).

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  meta_title text,
  meta_description text,

  -- Contenu
  category text NOT NULL, -- viandes | poissons | legumes | desserts | brunch
  excerpt text,
  description text NOT NULL, -- intro de la recette, markdown
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb, -- [{quantity, unit, name}]
  instructions jsonb NOT NULL DEFAULT '[]'::jsonb, -- [{step, text}]
  tips text, -- conseils du chef, markdown

  -- Données Recipe schema
  prep_time_minutes integer NOT NULL DEFAULT 15,
  cook_time_minutes integer NOT NULL DEFAULT 20,
  servings integer NOT NULL DEFAULT 4,
  difficulty text NOT NULL DEFAULT 'facile', -- facile | moyen | expert

  -- Image et produits liés
  featured_image jsonb, -- { src, alt }
  related_product_slug text, -- produit Atelier LBF recommandé

  -- Tags et SEO
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  keywords text[] NOT NULL DEFAULT ARRAY[]::text[],

  -- Publication
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  author text NOT NULL DEFAULT 'L''équipe LBF',

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS recipes_slug_idx ON recipes(slug);
CREATE INDEX IF NOT EXISTS recipes_published_idx ON recipes(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS recipes_category_idx ON recipes(category) WHERE is_published = true;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_recipes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS recipes_updated_at_trigger ON recipes;
CREATE TRIGGER recipes_updated_at_trigger
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_recipes_updated_at();

-- RLS : lecture publique des recettes publiées
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "recipes_public_read_published" ON recipes;
CREATE POLICY "recipes_public_read_published" ON recipes
  FOR SELECT
  USING (is_published = true);

-- Les admins gèrent via la service_role_key (bypass RLS) côté API

-- Bucket de stockage pour les images de recettes (créé automatiquement à l'usage)
-- Si besoin de créer manuellement :
-- INSERT INTO storage.buckets (id, name, public) VALUES ('recipes', 'recipes', true)
-- ON CONFLICT (id) DO NOTHING;
