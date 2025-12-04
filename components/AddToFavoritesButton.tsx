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

  const padding = size === "compact" ? "px-3 py-2 text-sm" : "px-6 py-3";
  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center justify-center gap-2 rounded-full border ${padding} font-semibold transition ${
        isInFavorites
          ? "border-transparent bg-gradient-to-r from-[#f4e1c1] via-[#c18f52] to-[#7a4b1f] text-white hover:brightness-110"
          : "border-transparent bg-gradient-to-r from-[#f4e1c1] via-[#c18f52] to-[#7a4b1f] text-white hover:brightness-110"
      } shadow-lg shadow-amber-700/20 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <div className="relative">
        <Heart
          size={20}
          className={isInFavorites ? "text-white" : "text-white"}
        />
        {favoriteCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {favoriteCount}
          </span>
        )}
      </div>
      <span className="text-white">{isInFavorites ? "Retirer des favoris" : "Ajouter aux favoris"}</span>
    </button>
  );
}
