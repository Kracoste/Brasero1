'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { ProductCard } from '@/components/ProductCard';
import { useFavorites } from '@/lib/favorites-context';
import type { Product } from '@/lib/schema';
import { mapSupabaseProduct } from '@/lib/utils';

export default function FavorisPage() {
  const { loading: favoritesLoading, isFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(
            data
              .map((p: Record<string, unknown>) => mapSupabaseProduct(p))
              .filter(Boolean) as Product[]
          );
        } else {
          console.error('Error loading products for favorites');
        }
      } catch (error) {
        console.error('Error loading products for favorites:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const favoriteProducts = useMemo(
    () => products.filter((product) => isFavorite(product.slug)),
    [products, isFavorite],
  );

  if (favoritesLoading || productsLoading) {
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
