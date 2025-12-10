'use client';

import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { ProductCard } from '@/components/ProductCard';
import { useFavorites } from '@/lib/favorites-context';
import { products } from '@/content/products';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavorisPage() {
  const { favorites, loading, isFavorite } = useFavorites();

  // Récupérer les produits complets à partir des slugs favoris
  const favoriteProducts = products.filter(product => 
    isFavorite(product.slug)
  );

  if (loading) {
    return (
      <main>
        <Section>
          <Container>
            <div className="py-12 text-center">
              <p className="text-slate-400">Chargement...</p>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  return (
    <main>
      <Section>
        <Container>
          <div className="py-12">
            <div className="mb-8 flex items-center gap-3">
              <Heart className="h-8 w-8 text-[#ff5751]" />
              <h1 className="text-3xl font-bold text-slate-900">Mes Favoris</h1>
            </div>
            
            {favoriteProducts.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
                <Heart className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <p className="text-lg text-slate-700 mb-4">
                  Vous n'avez pas encore de produits favoris.
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  Explorez notre catalogue et ajoutez vos braséros préférés à vos favoris !
                </p>
                <Link
                  href="/produits"
                  className="inline-block rounded-full bg-[#ff5751] px-6 py-3 font-semibold text-white hover:bg-[#ff4741] transition"
                >
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {favoriteProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}
