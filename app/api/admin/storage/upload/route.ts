import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAccess } from '@/lib/auth';
import { ALLOWED_STORAGE_BUCKETS, sanitizeFileName, devError } from '@/lib/supabase/utils';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

// Augmenter le timeout pour les uploads
export const maxDuration = 30;

async function validateFileMagicBytes(file: File): Promise<boolean> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer.slice(0, 12));
  const mimeType = file.type;

  if (mimeType === 'image/jpeg') {
    return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  }
  if (mimeType === 'image/png') {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
  }
  if (mimeType === 'image/webp') {
    const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    return riff === 'RIFF' && webp === 'WEBP';
  }
  if (mimeType === 'image/gif') {
    return bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
  }
  if (mimeType === 'image/avif') {
    // AVIF: ftyp box at offset 4
    const ftyp = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
    return ftyp === 'ftyp';
  }
  return false;
}

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

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Utiliser le client admin pour bypass RLS
    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }

    const isAdmin = await verifyAdminAccess(user.id, user.email, adminClient);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const bucket = formData.get('bucket') as string || 'products';

    if (!file || !fileName) {
      return NextResponse.json({ error: 'Fichier et nom requis' }, { status: 400 });
    }

    // Valider le type MIME (images uniquement — SVG exclu car vecteur XSS)
    const ALLOWED_MIME_TYPES = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
    ];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Type de fichier non autorisé. Images uniquement (JPEG, PNG, WebP, GIF, AVIF).' }, { status: 400 });
    }

    // Vérifier les magic bytes pour valider le vrai format du fichier
    const magicBytesOk = await validateFileMagicBytes(file);
    if (!magicBytesOk) {
      return NextResponse.json({ error: 'Format de fichier invalide' }, { status: 400 });
    }

    // Limiter la taille (10 Mo max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 400 });
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
        cacheControl: '0',
        upsert: true
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
    // Rate limiting pour éviter les suppressions massives (20/minute)
    const clientIP = getClientIP(request.headers);
    if (!checkRateLimit(`storage-delete-${clientIP}`, 20, 60000)) {
      return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }, { status: 429 });
    }

    // Vérifier l'authentification admin
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Utiliser le client admin pour bypass RLS (obtenu plus bas, mais vérifié ici d'abord)
    const adminClientDel = getSupabaseAdminClient();
    if (!adminClientDel) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }

    const isAdminDel = await verifyAdminAccess(user.id, user.email, adminClientDel);
    if (!isAdminDel) {
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

    // Sanitize le nom du fichier pour éviter les path traversal
    const sanitizedFileName = sanitizeFileName(fileName);

    const { error } = await adminClientDel.storage
      .from(bucket)
      .remove([sanitizedFileName]);

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
