import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AUTH_ROUTES } from '@/lib/auth';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { ProfileForm } from '@/components/ProfileForm';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

export default async function MonComptePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(AUTH_ROUTES.login);
  }

  // Récupérer le profil avec le client admin (bypass RLS)
  const adminClient = getSupabaseAdminClient();
  let profile = null;

  if (adminClient) {
    const { data } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    profile = data;
  }

  return (
    <Section className="py-24">
      <Container className="max-w-3xl">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Mon compte</h1>
          <p className="mt-2 text-slate-600">Gérez vos informations personnelles</p>
        </div>

        <div className="mt-8">
          <ProfileForm user={user} initialProfile={profile} />
        </div>
      </Container>
    </Section>
  );
}
