import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CartItem {
  name: string;
  price: number;
  slug: string;
  imageUrl?: string;
}

interface SaveCartBody {
  email: string;
  items: CartItem[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveCartBody = await request.json();

    if (!body.email || !body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: 'Email et items sont requis' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Format email invalide' },
        { status: 400 }
      );
    }

    if (body.items.length === 0) {
      return NextResponse.json(
        { error: 'Le panier ne peut pas être vide' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from('abandoned_carts')
      .upsert(
        {
          email: body.email.toLowerCase().trim(),
          items: body.items,
          email_sent: false,
          email_sent_at: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('Erreur sauvegarde panier abandonné:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde du panier' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur API save cart:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
