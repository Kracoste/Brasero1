import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { devError } from '@/lib/supabase/utils';

const MAX = 200;
const str = (v: unknown) => (typeof v === 'string' ? v.trim().slice(0, MAX) : '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = str(body.email).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';
    const client_type = str(body.client_type) || 'particulier';
    const civilite = str(body.civilite);
    const prenom = str(body.prenom);
    const nom = str(body.nom);
    const phone = str(body.phone);
    const address = str(body.address);
    const address_line2 = str(body.address_line2);
    const postal_code = str(body.postal_code);
    const city = str(body.city);
    const country = str(body.country) || 'France';
    const emailRedirectTo = typeof body.emailRedirectTo === 'string' ? body.emailRedirectTo : undefined;

    if (!email || !password || !prenom || !nom || !address || !postal_code || !city) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          client_type,
          civilite,
          prenom,
          nom,
          full_name: `${prenom} ${nom}`,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userId = data.user?.id;
    if (userId) {
      const admin = getSupabaseAdminClient();
      if (admin) {
        // Profil
        await admin.from('profiles').upsert({
          id: userId,
          email,
          first_name: prenom,
          last_name: nom,
          phone: phone || null,
          address,
          address_line2: address_line2 || null,
          postal_code,
          city,
          country,
          updated_at: new Date().toISOString(),
        });
        // Adresse par défaut dans le carnet
        await admin.from('user_addresses').insert({
          user_id: userId,
          label: 'Adresse principale',
          first_name: prenom,
          last_name: nom,
          phone: phone || null,
          address,
          address_line2: address_line2 || null,
          postal_code,
          city,
          country,
          is_default: true,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    devError('signup route:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
