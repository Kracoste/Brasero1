'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Price } from '@/components/Price';

type CrossSellProduct = {
  slug: string;
  name: string;
  price: number;
  image: string | null;
};

export function CartCrossSell() {
  const { items } = useCart();
  const [suggestions, setSuggestions] = useState<CrossSellProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slugs = items.map((i) => i.product_slug).filter(Boolean);
    if (slugs.length === 0) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    fetch('/api/cross-sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs }),
    })
      .then((r) => r.json())
      .then((data) => setSuggestions(data.products || []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [items]);

  if (loading || suggestions.length === 0) return null;

  return (
    <div className="mt-10 pt-8 border-t border-slate-200">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Pensez aussi à ces accessoires compatibles
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {suggestions.slice(0, 4).map((product) => (
          <Link
            key={product.slug}
            href={`/produits/${product.slug}`}
            className="group block border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
          >
            <div className="relative h-24 bg-slate-50">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 200px"
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
              )}
            </div>
            <div className="p-2.5">
              <p className="text-xs font-semibold text-slate-900 line-clamp-1 group-hover:text-[#0f172a] transition-colors">
                {product.name}
              </p>
              <Price amount={product.price} className="text-sm text-slate-700 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
