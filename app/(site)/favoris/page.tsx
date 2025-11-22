import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { Heart } from 'lucide-react';

export const metadata = {
  title: 'Mes Favoris - Brasero.fr',
  description: 'Retrouvez tous vos produits favoris',
};

export default async function FavorisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/connexion?redirect=/favoris');
  }

  return (
    <main>
      <Section>
        <Container>
          <div className="py-12">
            <div className="mb-8 flex items-center gap-3">
              <Heart className="h-8 w-8 text-[#ff5751]" />
              <h1 className="text-3xl font-bold text-white">Mes Favoris</h1>
            </div>
            
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-8 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="text-lg text-slate-400">
                Vous n'avez pas encore de produits favoris.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Explorez notre catalogue et ajoutez vos braséros préférés à vos favoris !
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
