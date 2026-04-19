-- Supprimer les réservations "pending" abandonnées (jamais payées)
-- et décrémenter le compteur correspondant
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT cu.id, cu.coupon_id, c.code
    FROM coupon_uses cu
    JOIN coupons c ON c.id = cu.coupon_id
    WHERE cu.stripe_session_id LIKE 'pending-%'
  LOOP
    DELETE FROM coupon_uses WHERE id = r.id;
    UPDATE coupons SET current_uses = GREATEST(current_uses - 1, 0) WHERE id = r.coupon_id;
  END LOOP;
END $$;
