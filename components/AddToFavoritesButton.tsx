'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/favorites-context';

type AddToFavoritesButtonProps = {
  product: {
    slug: string;
    name: string;
    price: number;
    images: { src: string }[];
  };
};

export function AddToFavoritesButton({ product }: AddToFavoritesButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleFavorite({
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0]?.src,
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const isInFavorites = isFavorite(product.slug);

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center justify-center gap-2 rounded-full border px-6 py-3 font-semibold transition ${
        isInFavorites
          ? 'border-[#ff5751] bg-[#ff5751] text-white hover:bg-[#ff4741]'
          : 'border-slate-700 bg-black text-slate-300 hover:border-[#ff5751] hover:text-[#ff5751]'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Heart
        size={20}
        className={isInFavorites ? 'fill-white' : ''}
      />
      <span>{isInFavorites ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
    </button>
  );
}
