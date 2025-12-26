import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';

// POST: Upload une image vers Supabase Storage
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Utiliser le client admin pour bypass RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const bucket = formData.get('bucket') as string || 'products';

    if (!file || !fileName) {
      return NextResponse.json({ error: 'Fichier et nom requis' }, { status: 400 });
    }

    // Normaliser le nom du fichier pour supprimer les accents et caractères spéciaux
    const sanitizedFileName = fileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-zA-Z0-9._-]/g, '_'); // Remplacer les caractères spéciaux par _

    // Upload vers Storage avec le client admin (bypass RLS)
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from(bucket)
      .upload(sanitizedFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Récupérer l'URL publique
    const { data: urlData } = adminClient.storage
      .from(bucket)
      .getPublicUrl(sanitizedFileName);

    return NextResponse.json({ 
      success: true,
      publicUrl: urlData.publicUrl,
      path: uploadData.path
    });
  } catch (error) {
    console.error('Erreur upload storage:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE: Supprimer une image de Storage
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const bucket = searchParams.get('bucket') || 'products';

    if (!fileName) {
      return NextResponse.json({ error: 'Nom de fichier requis' }, { status: 400 });
    }

    // Utiliser le client admin pour bypass RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }

    const { error } = await adminClient.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur delete storage:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
