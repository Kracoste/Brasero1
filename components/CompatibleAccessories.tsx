'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type CompatibleProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: { url?: string; src?: string; alt?: string }[];
  category?: string;
};

type CompatibleAccessoriesProps = {
  compatibleSlugs?: string[];
  onSelectionChange?: (accessories: CompatibleProduct[]) => void;
  productCategory?: string;
  preloadedProducts?: CompatibleProduct[];
};

export function CompatibleAccessories({ 
  compatibleSlugs = [],
  onSelectionChange,
  productCategory = 'brasero',
  preloadedProducts
}: CompatibleAccessoriesProps) {
  const [products, setProducts] = useState<CompatibleProduct[]>(preloadedProducts || []);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(!preloadedProducts || preloadedProducts.length === 0);
  const [error, setError] = useState(false);
  const [debug, setDebug] = useState<string>('');
  
  // Stabiliser la référence des slugs pour éviter les re-renders inutiles
  const slugsKey = useMemo(() => JSON.stringify([...compatibleSlugs].sort()), [compatibleSlugs]);
  const fetchedRef = useRef<string | null>(preloadedProducts && preloadedProducts.length > 0 ? slugsKey : null);

  useEffect(() => {
    // Si les données sont déjà préchargées, ne rien faire
    if (preloadedProducts && preloadedProducts.length > 0) {
      setProducts(preloadedProducts);
      setLoading(false);
      fetchedRef.current = slugsKey;
      return;
    }

    // Éviter les requêtes dupliquées pour les mêmes slugs
    if (fetchedRef.current === slugsKey) return;
    
    const slugs: string[] = JSON.parse(slugsKey);
    if (slugs.length === 0) {
      setDebug('No compatible slugs provided');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProducts = async (retry = 0) => {
      try {
        setError(false);
        setDebug(`Attempt ${retry + 1}/5 - Fetching slugs: ${slugs.join(', ')}`);
        
        const supabase = createClient();
        
        console.log(`[CompatibleAccessories] Fetching products for slugs:`, slugs, `(attempt ${retry + 1}/5)`);
        
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('id, slug, name, price, images, category')
          .in('slug', slugs)
          .order('name');

        if (cancelled) return;

        if (fetchError) {
          console.error('[CompatibleAccessories] Fetch error:', fetchError);
          setDebug(`Error: ${fetchError.message}`);
          
          // Retry up to 4 times with exponential backoff
          if (retry < 4) {
            const delay = Math.min(1000 * Math.pow(2, retry), 8000); // Max 8s
            console.log(`[CompatibleAccessories] Retrying in ${delay}ms...`);
            setDebug(`Retrying in ${delay}ms... (${retry + 1}/5)`);
            setTimeout(() => fetchProducts(retry + 1), delay);
            return;
          }
          
          console.error('[CompatibleAccessories] Max retries reached, showing error');
          setDebug('Max retries reached - data not available');
          setError(true);
          
        } else if (data && data.length > 0) {
          console.log(`[CompatibleAccessories] Successfully loaded ${data.length} products`);
          setDebug(`Loaded ${data.length} products successfully`);
          setProducts(data);
          fetchedRef.current = slugsKey;
          
        } else if (data && data.length === 0) {
          // Empty result - could be transient or data doesn't exist
          if (retry < 4) {
            console.warn('[CompatibleAccessories] Empty result, retrying...');
            const delay = Math.min(1000 * Math.pow(2, retry), 8000);
            setDebug(`Empty result, retrying in ${delay}ms... (${retry + 1}/5)`);
            setTimeout(() => fetchProducts(retry + 1), delay);
            return;
          } else {
            console.warn('[CompatibleAccessories] No products found after all retries');
            setDebug(`No products found in database for slugs: ${slugs.join(', ')}`);
          }
        }
        
      } catch (err) {
        console.error('[CompatibleAccessories] Exception:', err);
        setDebug(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`);
        
        if (!cancelled && retry < 4) {
          const delay = Math.min(1500 * Math.pow(2, retry), 8000);
          setDebug(`Exception, retrying in ${delay}ms... (${retry + 1}/5)`);
          setTimeout(() => fetchProducts(retry + 1), delay);
          return;
        }
        if (!cancelled) setError(true);
        
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => { cancelled = true; };
  }, [slugsKey]);

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
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"></div>
            <p className="text-slate-500">Chargement...</p>
          </div>
          {debug && process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-slate-400 font-mono">{debug}</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-slate-200 rounded-xl p-6 my-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Produits compatibles</h2>
        <div className="space-y-2">
          <p className="text-red-500 text-sm">Impossible de charger les produits.</p>
          {debug && (
            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer hover:text-slate-700">Voir les détails</summary>
              <pre className="mt-2 p-2 bg-slate-50 rounded font-mono overflow-x-auto">{debug}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    // Don't show anything if no products found - they may not be set up yet
    if (debug && process.env.NODE_ENV === 'development') {
      return (
        <div className="border border-slate-200 rounded-xl p-4 my-6 bg-slate-50">
          <p className="text-xs text-slate-500">
            <strong>Dev Info:</strong> No compatible accessories configured for this product.
          </p>
          <p className="text-xs text-slate-400 mt-1">{debug}</p>
        </div>
      );
    }
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
          // Support both formats: { url: ... } and { src: ... }
          const getImageUrl = () => {
            if (!Array.isArray(product.images) || product.images.length === 0) {
              return '/logo/placeholder.png';
            }
            const firstImage = product.images[0] as { url?: string; src?: string };
            return firstImage.url || firstImage.src || '/logo/placeholder.png';
          };
          const firstImage = getImageUrl();
          const isSelected = selectedProducts.has(product.slug);

          return (
            <label
              key={product.slug}
              className={`flex items-center gap-2 sm:gap-4 cursor-pointer p-3 sm:p-4 transition ${
                isSelected ? 'bg-green-50' : 'hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleProduct(product.slug)}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded border-slate-300 text-green-600 focus:ring-green-500 flex-shrink-0"
              />
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 bg-white overflow-hidden rounded-lg border border-slate-200">
                <Image
                  src={firstImage}
                  alt={product.name}
                  fill
                  className="object-contain p-1 sm:p-2"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide">
                  {product.category === 'brasero' ? 'Braséro' : 'Accessoire'}
                </span>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{product.name}</h3>
                <p className="text-base sm:text-xl font-bold text-green-600 mt-0.5 sm:mt-1">
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
