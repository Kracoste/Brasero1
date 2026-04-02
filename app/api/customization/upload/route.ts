import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { sanitizeFileName, devError } from '@/lib/supabase/utils';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

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

const BUCKET = 'customizations';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request.headers);
    if (!checkRateLimit(`customization-upload-${clientIP}`, 20, 60000)) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans quelques instants.' },
        { status: 429 }
      );
    }

    const adminClient = getSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const face = formData.get('face') as string;

    if (!file) {
      return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
    }

    if (!face || !['1', '2', '3', '4'].includes(face)) {
      return NextResponse.json({ error: 'Face invalide (1-4)' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format non autorisé. Utilisez JPG ou PNG.' },
        { status: 400 }
      );
    }

    // Vérifier les magic bytes pour valider le vrai format du fichier
    const magicBytesOk = await validateFileMagicBytes(file);
    if (!magicBytesOk) {
      return NextResponse.json({ error: 'Format de fichier invalide' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 400 });
    }

    // Nom unique pour éviter les collisions
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const sanitizedOriginal = sanitizeFileName(file.name);
    const storagePath = `face-${face}/${timestamp}-${randomId}-${sanitizedOriginal}.${ext}`;

    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from(BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      devError('Erreur upload personnalisation:', uploadError);
      return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
    }

    const { data: urlData } = adminClient.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      publicUrl: urlData.publicUrl,
      path: uploadData.path,
      fileName: file.name,
    });
  } catch (error) {
    devError('Erreur upload personnalisation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
