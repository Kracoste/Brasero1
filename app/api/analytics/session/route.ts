import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createHash } from "crypto";

import { getSupabaseAdminClient, hasSupabaseAdminCredentials } from "@/lib/supabase/admin";
import { ADMIN_EMAILS } from "@/lib/auth";
import { checkRateLimit, getClientIP, RATE_LIMIT_PRESETS } from "@/lib/rate-limit";
import { 
  isValidUUID, 
  isValidPrice, 
  sanitizeString, 
  sanitizePagePath,
  isAllowedOrigin 
} from "@/lib/validation";

// ============================================
// Constantes locales
// ============================================
const MAX_TITLE_LENGTH = 200;

// Types
type SessionPayload = {
  visitorId: string;
  sessionId?: string;
  page: string;
  pageTitle?: string;
  pageType?: string;
  productSlug?: string;
  productName?: string;
  productPrice?: number;
  referrer?: string | null;
  screenResolution?: string;
  language?: string;
  userEmail?: string;
  userId?: string;
};

// Helpers
const sanitizeText = (value?: string | null, maxLength = 512) => {
  if (!value) return undefined;
  return value.replace(/[<>\"'`;\\]/g, '').slice(0, maxLength);
};

const hashIP = (ip: string): string => {
  // Utiliser une clé secrète pour le hash (plus sécurisé)
  const secret = process.env.ANALYTICS_SECRET || process.env.NEXT_PUBLIC_SUPABASE_URL || 'fallback-secret';
  return createHash('sha256').update(ip + secret).digest('hex').slice(0, 32);
};

const parseUserAgent = (ua: string) => {
  let deviceType = 'desktop';
  let browser = 'Unknown';
  let os = 'Unknown';

  // Device type
  if (/mobile/i.test(ua)) deviceType = 'mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

  // Browser
  if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) browser = 'Chrome';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/edge|edg/i.test(ua)) browser = 'Edge';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  // OS
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua) && !/android/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

  return { deviceType, browser, os };
};

const parseReferrer = (referrer: string | null) => {
  if (!referrer) return { referrer: null, utmSource: null, utmMedium: null, utmCampaign: null };
  
  try {
    const url = new URL(referrer);
    const utmSource = url.searchParams.get('utm_source');
    const utmMedium = url.searchParams.get('utm_medium');
    const utmCampaign = url.searchParams.get('utm_campaign');
    
    return {
      referrer: url.hostname,
      utmSource,
      utmMedium,
      utmCampaign,
    };
  } catch {
    return { referrer, utmSource: null, utmMedium: null, utmCampaign: null };
  }
};

// Vérifier si c'est un admin
const isAdmin = (email?: string): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// SESSION TIMEOUT: 30 minutes
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

// POST - Créer ou mettre à jour une session + enregistrer une page vue
export async function POST(request: Request) {
  const adminClient = getSupabaseAdminClient();
  if (!hasSupabaseAdminCredentials() || !adminClient) {
    return NextResponse.json({ success: true, skipped: true }, { status: 200 });
  }

  try {
    const headersList = await headers();
    
    // ============================================
    // SÉCURITÉ : Vérification de l'origine (centralisée)
    // ============================================
    const origin = headersList.get('origin');
    
    // En production, vérifier l'origine
    if (process.env.NODE_ENV === 'production' && origin && !isAllowedOrigin(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // ============================================
    // SÉCURITÉ : Rate Limiting par IP (utilise l'utilitaire partagé)
    // ============================================
    const clientIP = getClientIP(headersList);
    const { maxRequests, windowMs } = RATE_LIMIT_PRESETS.api;
    
    if (!checkRateLimit(clientIP, maxRequests, windowMs)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    
    // ============================================
    // SÉCURITÉ : Validation du body
    // ============================================
    let body: SessionPayload;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    
    // Valider le visitorId (doit être un UUID valide)
    if (!body.visitorId || !isValidUUID(body.visitorId)) {
      return NextResponse.json({ error: 'Invalid visitorId' }, { status: 400 });
    }
    
    // Valider le sessionId si fourni
    if (body.sessionId && !isValidUUID(body.sessionId)) {
      return NextResponse.json({ error: 'Invalid sessionId' }, { status: 400 });
    }
    
    // Valider le prix si fourni
    if (!isValidPrice(body.productPrice)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    
    // ============================================
    // SÉCURITÉ : Sanitization des données
    // ============================================
    const visitorId = body.visitorId; // Déjà validé comme UUID
    const page = sanitizePagePath(body.page);
    const pageTitle = sanitizeString(body.pageTitle, MAX_TITLE_LENGTH);
    const productSlug = sanitizeString(body.productSlug, 100);
    const productName = sanitizeString(body.productName, 200);
    const screenResolution = sanitizeString(body.screenResolution, 20);
    const language = sanitizeString(body.language, 10);

    // Informations du navigateur
    const userAgent = sanitizeText(headersList.get("user-agent"));
    const { deviceType, browser, os } = parseUserAgent(userAgent || '');
    
    // IP déjà récupérée pour le rate limiting, on la hash pour RGPD
    const hashedIP = hashIP(clientIP);
    
    // Referrer et UTM
    const rawReferrer = body.referrer ?? headersList.get("referer");
    const { referrer, utmSource, utmMedium, utmCampaign } = parseReferrer(rawReferrer);
    
    // Vérifier si admin
    const userIsAdmin = isAdmin(body.userEmail);
    
    // Chercher une session existante (moins de 30 min d'inactivité)
    const { data: existingSession } = await adminClient
      .from("visitor_sessions")
      .select("id, page_count, started_at")
      .eq("visitor_id", visitorId)
      .gte("last_activity_at", new Date(Date.now() - SESSION_TIMEOUT_MS).toISOString())
      .order("last_activity_at", { ascending: false })
      .limit(1)
      .single();

    let sessionId: string;
    let isNewSession = false;

    if (existingSession) {
      // Mettre à jour la session existante
      sessionId = existingSession.id;
      
      const durationSeconds = Math.floor(
        (Date.now() - new Date(existingSession.started_at).getTime()) / 1000
      );
      
      // Valider userId si fourni (doit être UUID)
      const validUserId = body.userId && isValidUUID(body.userId) ? body.userId : null;
      const validUserEmail = sanitizeString(body.userEmail, 255);
      
      await adminClient
        .from("visitor_sessions")
        .update({
          page_count: existingSession.page_count + 1,
          duration_seconds: durationSeconds,
          is_bounce: false, // Plus d'une page = pas un bounce
          last_activity_at: new Date().toISOString(),
          // Mettre à jour user_id si connecté
          ...(validUserId ? { user_id: validUserId, user_email: validUserEmail } : {}),
        })
        .eq("id", sessionId);
    } else {
      // Créer une nouvelle session
      isNewSession = true;
      
      // Valider userId si fourni (doit être UUID)
      const validUserId = body.userId && isValidUUID(body.userId) ? body.userId : null;
      const validUserEmail = sanitizeString(body.userEmail, 255);
      
      const { data: newSession, error: sessionError } = await adminClient
        .from("visitor_sessions")
        .insert({
          visitor_id: visitorId,
          fingerprint: `${hashedIP}-${browser}-${os}`,
          ip_address: hashedIP,
          user_agent: userAgent,
          device_type: deviceType,
          browser,
          os,
          screen_resolution: screenResolution,
          language: language,
          user_id: validUserId,
          user_email: validUserEmail,
          referrer,
          utm_source: sanitizeString(utmSource, 100),
          utm_medium: sanitizeString(utmMedium, 50),
          utm_campaign: sanitizeString(utmCampaign, 100),
          entry_page: page,
          is_admin: userIsAdmin,
        })
        .select("id")
        .single();

      if (sessionError || !newSession) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to create session", sessionError);
        }
        return NextResponse.json(
          { error: "Failed to create session" },
          { status: 500 }
        );
      }

      sessionId = newSession.id;
    }

    // Enregistrer la page vue avec données sanitizées
    const pageType = detectPageType(page);
    
    await adminClient.from("page_views").insert({
      session_id: sessionId,
      page_path: page,
      page_title: pageTitle,
      page_type: pageType,
      product_slug: productSlug,
      product_name: productName,
      product_price: isValidPrice(body.productPrice) ? body.productPrice : null,
    });

    return NextResponse.json({ 
      success: true, 
      sessionId,
      isNewSession,
    }, { status: 201 });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Analytics tracking error", error);
    }
    // Ne pas exposer les détails d'erreur en production
    return NextResponse.json(
      { error: "Tracking failed" },
      { status: 500 }
    );
  }
}

// Détecter le type de page
function detectPageType(path: string): string {
  if (path === '/') return 'home';
  if (path.startsWith('/produits/') && path.split('/').length > 2) return 'product';
  if (path === '/produits') return 'category';
  if (path.startsWith('/accessoires/') && path.split('/').length > 2) return 'accessory';
  if (path === '/accessoires') return 'category';
  if (path === '/panier') return 'cart';
  if (path === '/commande') return 'checkout';
  if (path === '/mon-compte') return 'account';
  if (path === '/favoris') return 'favorites';
  if (path === '/contact') return 'contact';
  if (path.startsWith('/recettes')) return 'recipes';
  return 'other';
}
