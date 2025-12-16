'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { ProductCard } from '@/components/ProductCard';
import { useFavorites } from '@/lib/favorites-context';
import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/schema';
import { resolveDiameter } from '@/lib/utils';

type SupabaseProduct = {
  slug: string;
  name: string;
  shortDescription?: string;
  short_description?: string;
  description?: string;
  category: string;
  price: number;
  comparePrice?: number;
  compare_price?: number;
  discountPercent?: number;
  discount_percent?: number;
  badge?: string;
  images?: Product['images'];
  material: string;
  madeIn?: string;
  made_in?: string;
  specs?: any;
  highlights?: string[];
  features?: Product['features'];
  faq?: Product['faq'];
  customSpecs?: Product['customSpecs'];
  custom_specs?: Product['customSpecs'];
  location?: Product['location'];
  diameter?: number;
  popularScore?: number;
  popular_score?: number;
};

const normalizeSpecs = (specs: any) => {
  if (!specs) return {};
  if (typeof specs === 'string') {
    try {
      return JSON.parse(specs);
    } catch {
      return {};
    }
  }
  return specs;
};

const parseNumber = (value: any, fallback = 0) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const mapProduct = (source: SupabaseProduct): Product => {
  const specs = normalizeSpecs(source.specs);
  const diameter =
    resolveDiameter({
      ...source,
      specs,
    }) ?? 0;

  return {
    diameter,
    slug: source.slug,
    name: source.name,
    shortDescription: source.shortDescription || source.short_description || '',
    description: source.description || '',
    category: (source.category as Product['category']) ?? 'brasero',
    price: source.price,
    comparePrice: source.comparePrice || source.compare_price,
    discountPercent: source.discountPercent || source.discount_percent,
    badge: source.badge || '',
    images: source.images || [],
    material: source.material,
    madeIn: (source.madeIn || source.made_in || 'France') as Product['madeIn'],
    thickness: parseNumber((source as any).thickness ?? specs?.epaisseur, 0),
    height: parseNumber((source as any).height, 0),
    weight: parseNumber((source as any).weight, 0),
    warranty: (source as any).warranty || 'Garantie 2 ans',
    availability: (source as any).availability || 'En stock',
    shipping: (source as any).shipping || '',
    popularScore: source.popularScore || source.popular_score || 50,
    specs,
    highlights: source.highlights || [],
    features: source.features || [],
    faq: source.faq || [],
    customSpecs: source.customSpecs || source.custom_specs || [],
    location: source.location || {
      city: 'Moncoutant',
      dept: '79',
      lat: 46.65,
      lng: -0.72,
    },
  };
};

export default function FavorisPage() {
  const { loading: favoritesLoading, isFavorite } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setProducts(data.map(mapProduct));
      } else {
        console.error('Error loading products for favorites:', error);
      }
      setProductsLoading(false);
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
