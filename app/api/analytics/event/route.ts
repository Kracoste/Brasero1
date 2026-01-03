import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getSupabaseAdminClient, hasSupabaseAdminCredentials } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIP, RATE_LIMIT_PRESETS } from "@/lib/rate-limit";
import { 
  isValidUUID, 
  isValidPrice, 
  isValidQuantity, 
  sanitizeString,
  isAllowedOrigin 
} from "@/lib/validation";

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
    // SÉCURITÉ : Vérification de l'origine (centralisée)
    // ============================================
    const origin = headersList.get('origin');
    
    if (process.env.NODE_ENV === 'production' && origin && !isAllowedOrigin(origin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // ============================================
    // SÉCURITÉ : Rate Limiting (utilise l'utilitaire partagé)
    // ============================================
    const clientIP = getClientIP(headersList);
    const { maxRequests, windowMs } = RATE_LIMIT_PRESETS.analytics;
    
    if (!checkRateLimit(clientIP, maxRequests, windowMs)) {
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
      if (process.env.NODE_ENV === 'development') {
        console.error("Failed to record conversion event", error);
      }
      return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Conversion event error", error);
    }
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
