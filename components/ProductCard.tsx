'use client';

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState, memo } from "react";

import { Price } from "@/components/Price";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import type { Product } from "@/lib/schema";
import { formatCurrency, type CardOverrides } from "@/lib/utils";
import "@/styles/product-card.css";

type ProductCardProps = {
  product: Product;
  className?: string;
  /** Overrides visuels calculés par les filtres (image/prix de la sous-fiche) */
  cardOverrides?: CardOverrides;
};

export const ProductCard = memo(function ProductCard({ product, className, cardOverrides }: ProductCardProps) {
  const image = cardOverrides?.image ?? product.images[0];
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [adding, setAdding] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const displayPrice = cardOverrides?.price ?? product.price;
  const displayName = cardOverrides?.name ?? product.name;
  const displayDescription = cardOverrides?.shortDescription ?? product.shortDescription;
  const isPromo = typeof product.discountPercent === "number" && product.discountPercent > 0 && !!product.comparePrice;

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

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem({
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: image.src,
      });
      setTimeout(() => setAdding(false), 900);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAdding(false);
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
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
          {isPromo && (
            <span className="product-card__promo-ribbon">-{product.discountPercent}%</span>
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
          {isPromo ? (
            <div className="product-card__promo-pricing">
              <div className="product-card__promo-current">
                <span>{formatCurrency(displayPrice)}</span>
                <span className="product-card__promo-note">après remise</span>
              </div>
              <span className="product-card__promo-old">{formatCurrency(product.comparePrice!)} HT</span>
            </div>
          ) : !product.onDemand ? (
            <Price amount={displayPrice} className="product-card__price" tone="light" />
          ) : (
            <div className="product-card__price-placeholder" style={{ height: '2.5rem' }} />
          )}
          <div className="product-card__actions">
            {product.onDemand ? (
              <>
                <Link href="/contact" className="product-card__btn product-card__btn--primary">
                  Sur demande
                </Link>
                <Link href={`/produits/${product.slug}`} className="product-card__cta">
                  Voir les détails
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="product-card__btn product-card__btn--primary"
                >
                  {adding ? "Ajouté au panier" : "Ajouter au panier"}
                </button>
                <Link href={`/produits/${product.slug}`} className="product-card__cta">
                  Voir les détails
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});
