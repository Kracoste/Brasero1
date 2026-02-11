'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { ProfileForm } from '@/components/ProfileForm';
import { useAuth } from '@/lib/auth-context';
import { AUTH_ROUTES } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Package, User, ChevronRight } from 'lucide-react';

export default function MonComptePage() {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Rediriger si pas connecté
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = `${AUTH_ROUTES.login}?redirectTo=/mon-compte`;
    }
  }, [user, isLoading]);

  // Charger le profil
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(data);
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      } finally {
        setProfileLoading(false);
      }
    }

    if (user) {
      loadProfile();
    }
  }, [user]);

  // Loading state
  if (isLoading || !user) {
    return (
      <Section className="py-24">
        <Container className="max-w-3xl">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
            <p className="mt-4 text-slate-600">Chargement...</p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="py-24">
      <Container className="max-w-3xl">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Mon compte</h1>
          <p className="mt-2 text-slate-600">Gérez vos informations personnelles</p>
        </div>

        {/* Navigation rapide */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/mon-compte/commandes"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Package className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Mes commandes</p>
                <p className="text-sm text-slate-500">Suivi et historique</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <User className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Mes informations</p>
                <p className="text-sm text-slate-500">Profil et coordonnées</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {profileLoading ? (
            <div className="text-center py-8">
              <div className="h-6 w-6 mx-auto animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
            </div>
          ) : (
            <ProfileForm user={user} initialProfile={profile} />
          )}
        </div>
      </Container>
    </Section>
  );
}
