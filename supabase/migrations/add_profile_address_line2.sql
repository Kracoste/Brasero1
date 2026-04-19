-- Ajout du complément d'adresse au profil, pour pré-remplir le checkout
-- avec la même info que celle saisie à l'inscription.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS address_line2 TEXT;
