'use client';

import Image from "next/image";
import Link from "next/link";

import { Price } from "@/components/Price";
import type { Product } from "@/lib/schema";
import "@/styles/product-card.css";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const image = product.images[0];

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
            className="product-card__image-el"
          />
        </div>
        <div className="product-card__content">
          <span className="product-card__status">EN STOCK</span>
          <h3 className="product-card__name">{product.name}</h3>
          <Price amount={product.price} className="product-card__price" tone="light" />
          <Link href={`/produits/${product.slug}`} className="product-card__cta">
            Voir les détails
          </Link>
        </div>
      </div>
    </article>
  );
};
