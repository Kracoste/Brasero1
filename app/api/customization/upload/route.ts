import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { sanitizeFileName, devError } from '@/lib/supabase/utils';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export const maxDuration = 30;

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
