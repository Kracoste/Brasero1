import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { findBestFaqMatch, wantsProductRecommendation, FALLBACK_MESSAGE } from '@/lib/chatbot/knowledge-base';

type ChatProduct = {
  slug: string;
  name: string;
  price: number;
  category: string;
  availability: string;
  image: string | null;
  diameter: number | null;
  short_description: string | null;
};

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    const userMessage = message.trim();
    let answer = '';
    let products: ChatProduct[] = [];

    // 1. Chercher dans la FAQ
    const faqMatch = findBestFaqMatch(userMessage);
    if (faqMatch) {
      answer = faqMatch.answer;
    }

    // 2. Si l'utilisateur veut des infos produit, chercher dans Supabase
    if (wantsProductRecommendation(userMessage)) {
      const supabase = await createClient();
      const { data } = await supabase
        .from('products')
        .select('slug, name, price, category, availability, images, diameter, short_description')
        .order('popularScore', { ascending: false })
        .limit(20);

      if (data && data.length > 0) {
        const normalized = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Filtrer par modèle si mentionné
        let filtered = data;
        const modelFilters: Record<string, string[]> = {
          'obelix': ['obélix', 'obelix'],
          'coffy': ['coffy'],
          'morris': ['morris'],
          'fermier': ['fermier'],
          'fendeur': ['fendeur'],
        };

        for (const [slug, terms] of Object.entries(modelFilters)) {
          if (terms.some(t => normalized.includes(t))) {
            filtered = data.filter(p => p.slug?.includes(slug) || p.name?.toLowerCase().includes(slug));
            break;
          }
        }

        // Filtrer par catégorie si mentionné
        if (normalized.includes('accessoire') || normalized.includes('spatule') || normalized.includes('ustensile')) {
          filtered = data.filter(p => p.category === 'accessoire');
        }

        // Filtrer par budget si mentionné
        const budgetMatch = normalized.match(/(\d{3,4})\s*(?:€|euro)/);
        if (budgetMatch) {
          const budget = parseInt(budgetMatch[1]);
          filtered = (filtered.length > 0 ? filtered : data).filter(p => p.price <= budget);
        }

        // Filtrer par taille si mentionné
        const sizeMatch = normalized.match(/(\d{2,3})\s*(?:cm|centimètre)/);
        if (sizeMatch) {
          const size = parseInt(sizeMatch[1]);
          filtered = (filtered.length > 0 ? filtered : data).filter(p => p.diameter === size);
        }

        products = (filtered.length > 0 ? filtered : data).slice(0, 4).map(p => ({
          slug: p.slug,
          name: p.name,
          price: p.price,
          category: p.category,
          availability: p.availability || 'En stock',
          image: p.images?.[0]?.src || null,
          diameter: p.diameter,
          short_description: p.short_description,
        }));

        // Enrichir la réponse avec les produits trouvés
        if (!answer) {
          if (filtered.length > 0 && filtered !== data) {
            answer = `Voici ce que j'ai trouvé pour vous :`;
          } else {
            answer = `Voici nos produits les plus populaires :`;
          }
        }
      }
    }

    // 3. Fallback si aucune réponse
    if (!answer && products.length === 0) {
      answer = FALLBACK_MESSAGE;
    }

    return NextResponse.json({ answer, products });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
