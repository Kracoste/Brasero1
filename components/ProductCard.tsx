'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Price } from "@/components/Price";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/schema";
import "@/styles/product-card.css";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const image = product.images[0];
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addItem({
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: image.src,
      });
      setTimeout(() => setAdding(false), 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAdding(false);
    }
  };

  return (
    <article className={`product-card ${className ?? ""}`}>
      <div className="product-card__body">
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        <div className="product-card__image">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            className="object-contain p-6 drop-shadow-[0_35px_60px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="product-card__content">
          <div className="product-card__status">
            <span className="product-card__status-dot" />
            <span>En stock</span>
          </div>
          <div className="product-card__meta">
            <small>France Braseros</small>
            <h3 className="product-card__name">{product.name}</h3>
          </div>
          <div className="product-card__price">
            <Price amount={product.price} />
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="product-card__button"
          >
            {adding ? "Ajouté !" : "Ajouter au panier"}
          </button>
          <Link
            href={`/produits/${product.slug}`}
            className="product-card__cta"
          >
            Voir les détails
          </Link>
        </div>
      </div>
    </article>
  );
};
