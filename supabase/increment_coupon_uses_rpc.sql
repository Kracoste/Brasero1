-- RPC d'incrément atomique du compteur de coupon
-- Version simple : incrément du compteur global
CREATE OR REPLACE FUNCTION increment_coupon_uses(p_code TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE coupons SET current_uses = current_uses + 1 WHERE code = p_code;
$$;

-- RPC de réservation atomique du coupon (vérification + incrément en une seule transaction)
-- Retourne TRUE si la réservation a réussi, FALSE si le coupon est épuisé ou expiré.
-- Utiliser cette RPC AVANT de créer la session Stripe pour éviter la race condition TOCTOU.
CREATE OR REPLACE FUNCTION try_reserve_coupon(
  p_code TEXT,
  p_email TEXT,
  p_shipping_hash TEXT,
  p_ip TEXT,
  p_stripe_session_placeholder TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_coupon RECORD;
  v_user_count INTEGER;
  v_address_count INTEGER;
BEGIN
  -- Verrouiller la ligne du coupon pour éviter les lectures concurrentes
  SELECT id, max_uses, current_uses, max_uses_per_user, expires_at, is_active
  INTO v_coupon
  FROM coupons
  WHERE code = p_code
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Vérifications atomiques
  IF NOT v_coupon.is_active THEN
    RETURN FALSE;
  END IF;

  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < NOW() THEN
    RETURN FALSE;
  END IF;

  IF v_coupon.max_uses IS NOT NULL AND v_coupon.current_uses >= v_coupon.max_uses THEN
    RETURN FALSE;
  END IF;

  -- Vérification par utilisateur (email)
  IF v_coupon.max_uses_per_user IS NOT NULL AND p_email IS NOT NULL THEN
    SELECT COUNT(*) INTO v_user_count
    FROM coupon_uses
    WHERE coupon_id = v_coupon.id AND email = lower(trim(p_email));

    IF v_user_count >= v_coupon.max_uses_per_user THEN
      RETURN FALSE;
    END IF;
  END IF;

  -- Vérification anti-multi-compte par adresse
  IF v_coupon.max_uses_per_user IS NOT NULL AND p_shipping_hash IS NOT NULL THEN
    SELECT COUNT(*) INTO v_address_count
    FROM coupon_uses
    WHERE coupon_id = v_coupon.id AND shipping_hash = p_shipping_hash;

    IF v_address_count >= v_coupon.max_uses_per_user THEN
      RETURN FALSE;
    END IF;
  END IF;

  -- Incrémenter le compteur
  UPDATE coupons SET current_uses = current_uses + 1 WHERE id = v_coupon.id;

  -- Enregistrer l'usage (session placeholder sera mis à jour par le webhook)
  INSERT INTO coupon_uses (coupon_id, email, stripe_session_id, shipping_hash, ip_address)
  VALUES (
    v_coupon.id,
    lower(trim(p_email)),
    p_stripe_session_placeholder,
    NULLIF(p_shipping_hash, ''),
    NULLIF(p_ip, '')
  );

  RETURN TRUE;
END;
$$;

-- RPC pour mettre à jour le stripe_session_id dans coupon_uses après création de la session
CREATE OR REPLACE FUNCTION update_coupon_use_session(
  p_placeholder TEXT,
  p_real_session_id TEXT
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE coupon_uses SET stripe_session_id = p_real_session_id
  WHERE stripe_session_id = p_placeholder;
$$;

-- RPC pour annuler une réservation (en cas d'échec de création de session Stripe)
CREATE OR REPLACE FUNCTION cancel_coupon_reservation(
  p_code TEXT,
  p_placeholder TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM coupon_uses WHERE stripe_session_id = p_placeholder;
  UPDATE coupons SET current_uses = GREATEST(current_uses - 1, 0) WHERE code = p_code;
END;
$$;
