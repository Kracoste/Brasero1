import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isAdminEmail } from '@/lib/auth';
import { ALLOWED_STORAGE_BUCKETS, sanitizeFileName, devError } from '@/lib/supabase/utils';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

// POST: Upload une image vers Supabase Storage
export async function POST(request: NextRequest) {
  try {
    // Rate limiting pour éviter les abus (30 uploads/minute max)
    const clientIP = getClientIP(request.headers);
    if (!checkRateLimit(`storage-upload-${clientIP}`, 30, 60000)) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }, { status: 429 });
    }

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

    // Valider le bucket
    if (!ALLOWED_STORAGE_BUCKETS.includes(bucket as any)) {
      return NextResponse.json({ error: 'Bucket non autorisé' }, { status: 400 });
    }

    // Sanitize le nom du fichier pour éviter les path traversal
    const sanitizedFileName = sanitizeFileName(fileName);

    // Upload vers Storage avec le client admin (bypass RLS)
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from(bucket)
      .upload(sanitizedFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      devError('Erreur upload storage:', uploadError);
      return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
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
    devError('Erreur upload storage:', error);
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

    // Valider le bucket
    if (!ALLOWED_STORAGE_BUCKETS.includes(bucket as any)) {
      return NextResponse.json({ error: 'Bucket non autorisé' }, { status: 400 });
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
      devError('Erreur suppression fichier:', error);
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    devError('Erreur delete storage:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
