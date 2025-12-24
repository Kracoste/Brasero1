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
  className?: string;
  size?: "default" | "compact";
};

export function AddToFavoritesButton({ product, className = "", size = "default" }: AddToFavoritesButtonProps) {
  const { isFavorite, toggleFavorite, favoriteCount } = useFavorites();
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
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={isInFavorites ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`flex items-center justify-center p-2 transition hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      <Heart
        size={24}
        className={`pointer-events-none ${isInFavorites ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-400"}`}
      />
    </button>
  );
}
