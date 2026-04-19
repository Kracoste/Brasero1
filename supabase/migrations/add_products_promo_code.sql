-- Add promo_code column to products for displaying a promo code badge
-- alongside the strikethrough price on product cards and detail pages.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS promo_code text;
