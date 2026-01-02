import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getSupabaseAdminClient, hasSupabaseAdminCredentials } from "@/lib/supabase/admin";

// ============================================
// SÉCURITÉ : Rate Limiting en mémoire
// ============================================
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requêtes par minute max

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

// ============================================
// SÉCURITÉ : Validation des entrées
// ============================================
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(str: string | undefined): boolean {
  if (!str) return false;
  return UUID_REGEX.test(str);
}

function sanitizeString(value: string | undefined | null, maxLength: number): string | undefined {
  if (!value) return undefined;
  return value.replace(/[<>\"'`;\\]/g, '').slice(0, maxLength);
}

function isValidPrice(price: any): boolean {
  if (price === undefined || price === null) return true;
  const num = Number(price);
  return !isNaN(num) && num >= 0 && num <= 1000000;
}

function isValidQuantity(qty: any): boolean {
  if (qty === undefined || qty === null) return true;
  const num = Number(qty);
  return Number.isInteger(num) && num >= 1 && num <= 1000;
}

const VALID_EVENT_TYPES = ['product_view', 'add_to_cart', 'remove_from_cart', 'checkout_start', 'purchase'] as const;
type EventType = typeof VALID_EVENT_TYPES[number];

type EventPayload = {
  sessionId: string;
  visitorId: string;
  eventType: EventType;
  productSlug?: string;
  productName?: string;
  productPrice?: number;
  quantity?: number;
  orderId?: string;
  orderTotal?: number;
  orderItemsCount?: number;
  cartTotal?: number;
  cartItemsCount?: number;
  userId?: string;
};

// POST - Enregistrer un événement de conversion
export async function POST(request: Request) {
  const adminClient = getSupabaseAdminClient();
  if (!hasSupabaseAdminCredentials() || !adminClient) {
    return NextResponse.json({ success: true, skipped: true }, { status: 200 });
  }

  try {
    const headersList = await headers();
    
    // ============================================
    // SÉCURITÉ : Vérification de l'origine
    // ============================================
    const origin = headersList.get('origin');
    const allowedOrigins = [
      'http://localhost:3000',
      'https://localhost:3000',
      'https://atelier-lbf.fr',
      'https://www.atelier-lbf.fr',
    ];
    
    if (process.env.NODE_ENV === 'production' && origin) {
      if (!allowedOrigins.some(allowed => origin.startsWith(allowed.replace('www.', '')))) {
        console.warn('Analytics Event: Origin non autorisée:', origin);
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
    
    // ============================================
    // SÉCURITÉ : Rate Limiting
    // ============================================
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIP = headersList.get("x-real-ip");
    const clientIP = forwardedFor?.split(',')[0]?.trim() || realIP || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    
    // ============================================
    // SÉCURITÉ : Validation du body
    // ============================================
    let body: EventPayload;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Valider les IDs (doivent être des UUIDs)
    if (!body.sessionId || !isValidUUID(body.sessionId)) {
      return NextResponse.json({ error: 'Invalid sessionId' }, { status: 400 });
    }
    
    if (!body.visitorId || !isValidUUID(body.visitorId)) {
      return NextResponse.json({ error: 'Invalid visitorId' }, { status: 400 });
    }
    
    // Valider le type d'événement
    if (!body.eventType || !VALID_EVENT_TYPES.includes(body.eventType)) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 });
    }
    
    // Valider les prix et quantités
    if (!isValidPrice(body.productPrice) || !isValidPrice(body.orderTotal) || !isValidPrice(body.cartTotal)) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    
    if (!isValidQuantity(body.quantity) || !isValidQuantity(body.orderItemsCount) || !isValidQuantity(body.cartItemsCount)) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    // ============================================
    // Insertion sécurisée
    // ============================================
    const { error } = await adminClient.from("conversion_events").insert({
      session_id: body.sessionId,
      visitor_id: body.visitorId,
      user_id: body.userId && isValidUUID(body.userId) ? body.userId : null,
      event_type: body.eventType,
      product_slug: sanitizeString(body.productSlug, 100),
      product_name: sanitizeString(body.productName, 200),
      product_price: body.productPrice,
      quantity: body.quantity ?? 1,
      order_id: sanitizeString(body.orderId, 100),
      order_total: body.orderTotal,
      order_items_count: body.orderItemsCount,
      cart_total: body.cartTotal,
      cart_items_count: body.cartItemsCount,
    });

    if (error) {
      console.error("Failed to record conversion event", error);
      return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error("Conversion event error", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
