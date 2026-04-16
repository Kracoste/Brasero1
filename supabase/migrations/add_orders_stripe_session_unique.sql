-- Idempotence du webhook Stripe : empêche l'insertion de 2 commandes
-- pour la même session Stripe lors de webhooks concurrents.
-- À exécuter depuis le Dashboard Supabase (SQL Editor).

-- Nettoyer d'abord les éventuels doublons historiques (garde la plus ancienne)
DELETE FROM orders a
USING orders b
WHERE a.stripe_session_id = b.stripe_session_id
  AND a.stripe_session_id IS NOT NULL
  AND a.id > b.id;

-- Contrainte d'unicité
CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session_id_unique
  ON orders (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;
