-- Add show_in_banner column to coupons table
-- Only one coupon should be shown in the banner at a time
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS show_in_banner boolean DEFAULT false;

-- Create a partial unique index to ensure only one coupon can have show_in_banner = true
CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_one_banner ON coupons (show_in_banner) WHERE show_in_banner = true;
