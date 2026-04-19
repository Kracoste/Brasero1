'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { ProfileForm } from '@/components/ProfileForm';
import { AddressBook } from '@/components/AddressBook';
import { useAuth } from '@/lib/auth-context';
import { AUTH_ROUTES } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';

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
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, phone, address, postal_code, city, country')
          .eq('id', user.id)
          .single();
        
        if (error) {
          if (process.env.NODE_ENV === 'development') console.error('Erreur chargement profil:', error);
        }
        setProfile(data);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Erreur chargement profil:', error);
      } finally {
        setProfileLoading(false);
      }
    }

    if (user) {
      loadProfile();
    } else {
      // Auth terminé sans user = pas de profil à charger
      if (!isLoading) setProfileLoading(false);
    }
  }, [user, isLoading]);

  // Skeleton pour le profil
  const ProfileSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        <div><div className="h-4 w-20 bg-slate-200 rounded mb-2" /><div className="h-10 bg-slate-100 rounded" /></div>
        <div><div className="h-4 w-20 bg-slate-200 rounded mb-2" /><div className="h-10 bg-slate-100 rounded" /></div>
      </div>
      <div><div className="h-4 w-16 bg-slate-200 rounded mb-2" /><div className="h-10 bg-slate-100 rounded" /></div>
      <div><div className="h-4 w-24 bg-slate-200 rounded mb-2" /><div className="h-10 bg-slate-100 rounded" /></div>
      <div><div className="h-4 w-20 bg-slate-200 rounded mb-2" /><div className="h-10 bg-slate-100 rounded" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><div className="h-4 w-24 bg-slate-200 rounded mb-2" /><div className="h-10 bg-slate-100 rounded" /></div>
        <div><div className="h-4 w-12 bg-slate-200 rounded mb-2" /><div className="h-10 bg-slate-100 rounded" /></div>
      </div>
      <div className="h-12 w-40 bg-slate-200 rounded" />
    </div>
  );

  // Pas connecté et auth terminé → redirection gérée par useEffect
  if (!isLoading && !user) {
    return null;
  }

  return (
    <Section className="py-24">
      <Container className="max-w-3xl">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Mon profil</h1>
          <p className="mt-2 text-slate-600">Gérez vos informations personnelles</p>
        </div>

        <div className="mt-8">
          {isLoading || profileLoading || !user ? (
            <ProfileSkeleton />
          ) : (
            <ProfileForm user={user} initialProfile={profile} />
          )}
        </div>

        {user && (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-slate-900">Mes adresses</h2>
            <p className="mt-1 text-sm text-slate-600">Gérez vos adresses de livraison</p>
            <div className="mt-6">
              <AddressBook />
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
