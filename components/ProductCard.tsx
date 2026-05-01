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
  /** Overrides visuels calculés par les filtres (image/prix de la sous-fiche) */
  cardOverrides?: CardOverrides;
  reviewStats?: { average: number; count: number } | null;
};

export const ProductCard = ({ product, className, cardOverrides }: ProductCardProps) => {
  const image = cardOverrides?.image ?? product.images[0];
  const { toggleFavorite, isFavorite } = useFavorites();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const displayPrice = cardOverrides?.price ?? product.price;
  const displayName = cardOverrides?.name ?? product.name;
  const displayDescription = cardOverrides?.shortDescription ?? product.shortDescription;

  const handleToggleFavorite = async () => {
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
    <article className={`product-card ${className ?? ""}`}>
      <div className="product-card__body">
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
            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400 text-sm">
              Image non disponible
            </div>
          )}
        </div>
        <div className="product-card__content">
          <span className="product-card__status">EN STOCK</span>
          <div className="product-card__name-wrapper">
            <h3 className="product-card__name">{displayName}</h3>
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
          <p className="product-card__description">{displayDescription}</p>
          {!product.onDemand ? (
            <Price amount={displayPrice} className="product-card__price" tone="light" showHT />
          ) : (
            <div className="product-card__price-placeholder" style={{ height: '2.5rem' }} />
          )}
          <div className="product-card__actions">
            {product.onDemand ? (
              <Link href="/contact" className="product-card__btn product-card__btn--primary">
                Demander un devis
              </Link>
            ) : (
              <Link href={`/produits/${product.slug}`} className="product-card__btn product-card__btn--primary">
                Voir les détails
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
