'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AUTH_ROUTES, REDIRECT_PARAM } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateName = (value: string) => {
    return /^[a-zA-ZÀ-ÿ\s.]+$/.test(value);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!civilite) {
      setError('Veuillez sélectionner votre civilité');
      setLoading(false);
      return;
    }

    if (!validateName(prenom)) {
      setError('Le prénom ne doit contenir que des lettres');
      setLoading(false);
      return;
    }

    if (!validateName(nom)) {
      setError('Le nom ne doit contenir que des lettres');
      setLoading(false);
      return;
    }

    if (password.length < 5) {
      setError('Le mot de passe doit contenir au moins 5 caractères');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${AUTH_ROUTES.callback}`,
          data: {
            client_type: clientType,
            civilite: civilite,
            prenom: prenom,
            nom: nom,
            full_name: `${prenom} ${nom}`,
          },
        },
      });

      if (error) throw error;

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
