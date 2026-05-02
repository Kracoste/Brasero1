'use client';

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";

import { Price } from "@/components/Price";
import { useFavorites } from "@/lib/favorites-context";
import type { Product } from "@/lib/schema";
import { type CardOverrides } from "@/lib/utils";
import "@/styles/product-card.css";

type ProductCardProps = {
  product: Product;
  className?: string;
  cardOverrides?: CardOverrides;
  reviewStats?: { average: number; count: number } | null;
};

export const ProductCard = ({ product, className, cardOverrides }: ProductCardProps) => {
  const image = cardOverrides?.image ?? product.images[0];
  const { toggleFavorite, isFavorite } = useFavorites();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const displayPrice = cardOverrides?.price ?? product.price;
  const displayName = cardOverrides?.name ?? product.name;

  const href = product.onDemand ? "/contact" : `/produits/${product.slug}`;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favoriteLoading) return;
    setFavoriteLoading(true);
    try {
      await toggleFavorite({
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: image?.src,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <Link href={href} className={`product-card ${className ?? ""}`}>
      <div className="product-card__image">
        {image?.src ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            fill
            sizes="(max-width: 480px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 20vw"
            placeholder={image.blurDataURL ? "blur" : "empty"}
            blurDataURL={image.blurDataURL}
            className="product-card__image-el"
            style={{
              objectFit: 'contain',
              transform: `scale(${(product.specs?.imageScale || 110) / 100})`,
            }}
          />
        ) : (
          <div className="product-card__image-fallback">Image non disponible</div>
        )}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="product-card__favorite-btn"
          aria-label={isFavorite(product.slug) ? "Retirer des favoris" : "Ajouter aux favoris"}
          disabled={favoriteLoading}
        >
          <Heart
            className="product-card__favorite-icon"
            fill={isFavorite(product.slug) ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        </button>
      </div>
      <div className="product-card__content">
        <h3 className="product-card__name">{displayName}</h3>
        {!product.onDemand ? (
          <Price amount={displayPrice} className="product-card__price" tone="light" />
        ) : (
          <span className="product-card__price product-card__price--ondemand">Sur demande</span>
        )}
      </div>
    </Link>
  );
};
