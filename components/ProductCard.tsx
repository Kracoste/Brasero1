'use client';

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { Price } from "@/components/Price";
import { useCart } from "@/lib/cart-context";
import { useFavorites } from "@/lib/favorites-context";
import type { Product } from "@/lib/schema";
import { formatCurrency } from "@/lib/utils";
import "@/styles/product-card.css";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const image = product.images[0];
  const { addItem, loading } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [adding, setAdding] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
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
          <Image
            src={image.src}
            alt={image.alt}
            fill
            placeholder={image.blurDataURL ? "blur" : "empty"}
            blurDataURL={image.blurDataURL}
            className="product-card__image-el"
          />
          {isPromo && (
            <span className="product-card__promo-ribbon">-{product.discountPercent}%</span>
          )}
        </div>
        <div className="product-card__content">
          <span className="product-card__status">EN STOCK</span>
          <div className="product-card__name-wrapper">
            <h3 className="product-card__name">{product.name}</h3>
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
          <p className="product-card__description">{product.shortDescription}</p>
          {isPromo ? (
            <div className="product-card__promo-pricing">
              <div className="product-card__promo-current">
                <span>{formatCurrency(product.price)}</span>
                <span className="product-card__promo-note">après remise</span>
              </div>
              <span className="product-card__promo-old">{formatCurrency(product.comparePrice!)} TTC</span>
            </div>
          ) : (
            <Price amount={product.price} className="product-card__price" tone="light" />
          )}
          <div className="product-card__actions">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding || loading}
              className="product-card__btn product-card__btn--primary"
            >
              {adding ? "Ajouté au panier" : "Ajouter au panier"}
            </button>
            <Link href={`/produits/${product.slug}`} className="product-card__cta">
              Voir les détails
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
