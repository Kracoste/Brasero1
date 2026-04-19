'use client';

import { useState } from 'react';
import { AUTH_ROUTES } from '@/lib/auth';
import { isValidName, validatePassword, isValidEmail } from '@/lib/validation';
import Link from 'next/link';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';

export default function InscriptionPage() {
  const [clientType, setClientType] = useState<'particulier' | 'professionnel'>('particulier');
  const [civilite, setCivilite] = useState<'M' | 'Mme' | ''>('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('France');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!civilite) {
      setError('Veuillez sélectionner votre civilité');
      setLoading(false);
      return;
    }

    // Utilisation des validations centralisées
    if (!isValidName(prenom)) {
      setError('Le prénom ne doit contenir que des lettres');
      setLoading(false);
      return;
    }

    if (!isValidName(nom)) {
      setError('Le nom ne doit contenir que des lettres');
      setLoading(false);
      return;
    }

    // Validation de l'email
    if (!isValidEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      setLoading(false);
      return;
    }

    // Validation renforcée du mot de passe avec la fonction centralisée
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (!address.trim() || !postalCode.trim() || !city.trim()) {
      setError('L\'adresse, le code postal et la ville sont obligatoires');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          client_type: clientType,
          civilite,
          prenom,
          nom,
          phone,
          address,
          address_line2: addressLine2,
          postal_code: postalCode,
          city,
          country,
          emailRedirectTo: `${window.location.origin}${AUTH_ROUTES.callback}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Inscription échouée');

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
            <h2 className="font-display text-2xl font-semibold text-emerald-900">
              Inscription réussie ! 🎉
            </h2>
            <p className="mt-4 text-sm text-emerald-800">
              Un email de confirmation vous a été envoyé. Vérifiez votre boîte mail et cliquez sur
              le lien pour activer votre compte.
            </p>
            <div className="mt-6">
              <Link
                href={AUTH_ROUTES.login}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Aller à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8">
        <div>
          <h2 className="mt-6 text-center font-display text-3xl font-semibold text-slate-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/connexion" className="font-medium text-[#CD853F] hover:text-[#8B4513]">
              Connectez-vous !
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Type de client */}
            <div className="flex items-center gap-4">
              <label className="block text-sm font-semibold text-slate-800">
                Je suis :
              </label>
              <div className="relative">
                <select
                  value={clientType}
                  onChange={(e) => setClientType(e.target.value as 'particulier' | 'professionnel')}
                  className="appearance-none rounded-none border-2 border-slate-800 bg-white px-4 py-2 pr-10 text-sm font-medium text-slate-800 focus:border-[#CD853F] focus:outline-none"
                >
                  <option value="particulier">Un particulier</option>
                  <option value="professionnel">Un professionnel</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>
            </div>

            {/* Civilité */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="civilite"
                  value="M"
                  checked={civilite === 'M'}
                  onChange={(e) => setCivilite(e.target.value as 'M')}
                  className="h-5 w-5 border-2 border-slate-400 text-slate-800 focus:ring-[#CD853F]"
                />
                <span className="text-sm text-slate-700">M</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="civilite"
                  value="Mme"
                  checked={civilite === 'Mme'}
                  onChange={(e) => setCivilite(e.target.value as 'Mme')}
                  className="h-5 w-5 border-2 border-slate-400 text-slate-800 focus:ring-[#CD853F]"
                />
                <span className="text-sm text-slate-700">Mme</span>
              </label>
            </div>

            {/* Prénom */}
            <div>
              <label htmlFor="prenom" className="block text-sm font-semibold text-slate-800">
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="mt-2 block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#CD853F] focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                Seules les lettres et le point (.), suivi d'un espace, sont autorisés.
              </p>
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="nom" className="block text-sm font-semibold text-slate-800">
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="mt-2 block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#CD853F] focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                Seules les lettres et le point (.), suivi d'un espace, sont autorisés.
              </p>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#CD853F] focus:outline-none"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
                Mot de passe
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 placeholder-slate-400 focus:border-[#CD853F] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B4513] hover:text-[#CD853F]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">Au moins 5 caractères</p>
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-800">
                Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#CD853F] focus:outline-none"
                placeholder="06 12 34 56 78"
              />
            </div>

            {/* Adresse */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-800">
                Adresse *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2 block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#CD853F] focus:outline-none"
                placeholder="12 rue de la République"
              />
            </div>

            <div>
              <label htmlFor="address_line2" className="block text-sm font-semibold text-slate-800">
                Complément (optionnel)
              </label>
              <input
                id="address_line2"
                name="address_line2"
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="mt-2 block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#CD853F] focus:outline-none"
                placeholder="Bâtiment, étage..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="postal_code" className="block text-sm font-semibold text-slate-800">
                  Code postal *
                </label>
                <input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="mt-2 block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#CD853F] focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="city" className="block text-sm font-semibold text-slate-800">
                  Ville *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2 block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#CD853F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-slate-800">
                Pays *
              </label>
              <select
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-2 block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#CD853F] focus:outline-none"
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Allemagne">Allemagne</option>
              </select>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-800">
                Confirmer le mot de passe
              </label>
              <div className="relative mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-none border-2 border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 placeholder-slate-400 focus:border-[#CD853F] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B4513] hover:text-[#CD853F]"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-gradient-to-br from-[#8B4513] to-[#CD853F] px-4 py-3 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#CD853F] focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Inscription en cours...' : "S'inscrire"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
