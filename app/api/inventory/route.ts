import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidUUID } from '@/lib/validation';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET - Vérifier la disponibilité d'un produit
 * Query params: product_id ou slug
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting public (60 requêtes/min)
    const clientIP = getClientIP(request.headers);
    if (!checkRateLimit(`inventory-${clientIP}`, 60, 60000)) {
      return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const slug = searchParams.get('slug');

    if (!productId && !slug) {
      return NextResponse.json(
        { error: 'product_id ou slug requis' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Si slug fourni, récupérer le product_id
    let finalProductId = productId;
    if (slug && !productId) {
      const { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!product) {
        return NextResponse.json(
          { error: 'Produit introuvable' },
          { status: 404 }
        );
      }

      finalProductId = product.id;
    }

    if (finalProductId && !isValidUUID(finalProductId)) {
      return NextResponse.json(
        { error: 'ID produit invalide' },
        { status: 400 }
      );
    }

    // Récupérer l'inventaire
    const { data: inventory, error } = await supabase
      .from('inventory')
      .select('quantity, reserved, low_stock_threshold')
      .eq('product_id', finalProductId)
      .single();

    if (error || !inventory) {
      // Pas d'inventaire = stock illimité (produits virtuels ou sur commande)
      return NextResponse.json({
        available: true,
        quantity: null,
        isLowStock: false,
        message: 'Sur commande',
      });
    }

    const availableQuantity = inventory.quantity - inventory.reserved;
    const isLowStock = availableQuantity <= inventory.low_stock_threshold;

    return NextResponse.json({
      available: availableQuantity > 0,
      quantity: availableQuantity,
      isLowStock,
      message: availableQuantity > 0
        ? isLowStock
          ? 'Stock limité'
          : 'En stock'
        : 'Rupture de stock',
    });
  } catch (error) {
    console.error('[Inventory API] Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
