'use client';

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import { Price } from "@/components/Price";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/schema";
import { formatCurrency } from "@/lib/utils";
import "@/styles/product-card.css";

type ProductCardProps = {
  product: Product;
  className?: string;
};

const FAVORITES_STORAGE_KEY = "brasero:favorites";

const readFavorites = () => {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((item): item is string => typeof item === "string"));
    }
    return new Set<string>();
  } catch {
    return new Set<string>();
  }
};

const persistFavorites = (favorites: Set<string>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
};

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const image = product.images[0];
  const { addItem, loading } = useCart();
  const [adding, setAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const isPromo = typeof product.discountPercent === "number" && product.discountPercent > 0 && !!product.comparePrice;

  useEffect(() => {
    const favorites = readFavorites();
    setIsFavorite(favorites.has(product.slug));
  }, [product.slug]);

  const toggleFavorite = () => {
    if (typeof window === "undefined") return;
    setIsFavorite((prev) => {
      const favorites = readFavorites();
      if (prev) {
        favorites.delete(product.slug);
      } else {
        favorites.add(product.slug);
      }
      persistFavorites(favorites);
      return !prev;
    });
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
            placeholder="blur"
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
              onClick={toggleFavorite}
              className="product-card__favorite-btn"
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart
                className="product-card__favorite-icon"
                fill={isFavorite ? "currentColor" : "none"}
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
