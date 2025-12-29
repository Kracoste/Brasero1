'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type CompatibleProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: any[];
  category: string;
};

type CompatibleAccessoriesProps = {
  productSlug: string;
  compatibleSlugs?: string[];
  onSelectionChange?: (accessories: CompatibleProduct[]) => void;
  productCategory?: string;
};

export function CompatibleAccessories({ 
  productSlug, 
  compatibleSlugs = [],
  onSelectionChange,
  productCategory = 'brasero'
}: CompatibleAccessoriesProps) {
  const [products, setProducts] = useState<CompatibleProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        
        // Charger les produits compatibles par leurs slugs
        if (compatibleSlugs.length > 0) {
          const { data, error } = await supabase
            .from('products')
            .select('id, slug, name, price, images, category')
            .in('slug', compatibleSlugs)
            .order('name');

          if (!error && data) {
            setProducts(data);
          }
        }
      } catch (error) {
        console.error('Erreur chargement produits compatibles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [compatibleSlugs]);

  const toggleProduct = useCallback((slug: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  }, []);

  // Notifier le parent des changements de sélection
  useEffect(() => {
    if (onSelectionChange) {
      const selectedItems = products.filter(p => selectedProducts.has(p.slug));
      onSelectionChange(selectedItems);
    }
  }, [selectedProducts, products, onSelectionChange]);

  if (loading) {
    return (
      <div className="border border-slate-200 rounded-xl p-6 my-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Produits compatibles</h2>
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const totalSelected = products
    .filter(p => selectedProducts.has(p.slug))
    .reduce((sum, p) => sum + p.price, 0);

  // Adapter le titre selon le type de produit
  const sectionTitle = productCategory === 'accessoire' 
    ? 'Produits compatibles' 
    : 'Les gens ont aussi acheté';

  return (
    <div className="border border-slate-300 rounded-lg my-6">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-300">
        <h2 className="text-lg font-bold text-slate-900">{sectionTitle}</h2>
        {selectedProducts.size > 0 && (
          <p className="text-sm text-green-600 mt-1">
            {selectedProducts.size} produit(s) sélectionné(s) : +{totalSelected.toFixed(2).replace('.', ',')} €
          </p>
        )}
      </div>
      <div className="divide-y divide-slate-300">
        {products.map((product) => {
          const firstImage = Array.isArray(product.images) && product.images[0]
            ? product.images[0].src || product.images[0]
            : '/logo/placeholder.png';
          const isSelected = selectedProducts.has(product.slug);

          return (
            <label
              key={product.slug}
              className={`flex items-center gap-4 cursor-pointer p-4 transition ${
                isSelected ? 'bg-green-50' : 'hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleProduct(product.slug)}
                className="w-6 h-6 rounded border-slate-300 text-green-600 focus:ring-green-500 flex-shrink-0"
              />
              <div className="relative w-20 h-20 flex-shrink-0 bg-white overflow-hidden rounded-lg border border-slate-200">
                <Image
                  src={firstImage}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-slate-400 uppercase tracking-wide">
                  {product.category === 'brasero' ? 'Braséro' : 'Accessoire'}
                </span>
                <h3 className="font-semibold text-slate-900 text-base">{product.name}</h3>
                <p className="text-xl font-bold text-green-600 mt-1">
                  +{product.price.toFixed(2).replace('.', ',')} €
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
