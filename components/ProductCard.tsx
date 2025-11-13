'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Price } from "@/components/Price";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/schema";
import { cn } from "@/lib/utils";

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
      console.error('Error adding to cart:', error);
      setAdding(false);
    }
  };

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[40px] bg-gradient-to-b from-[#e9e9e9] via-[#c8c8c8] to-[#0d0d0d] shadow-[0_40px_70px_rgba(0,0,0,0.55)] transition hover:-translate-y-1",
        className,
      )}
    >
      <Link href={`/produits/${product.slug}`}>
        <div className="relative h-80 w-full overflow-hidden bg-[radial-gradient(circle_at_top,_#f5f5f5_0%,_#d0d0d0_55%,_#0d0d0d_100%)]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            className="object-contain p-6 drop-shadow-[0_35px_60px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-105 mix-blend-multiply"
          />
        </div>
      </Link>
      <div className="relative -mt-12 px-6 pb-8">
        <div className="rounded-[32px] bg-gradient-to-b from-[#1b1b1b]/95 to-[#050505] px-6 py-8 text-white shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 text-emerald-200">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
            <span className="text-sm font-semibold uppercase tracking-wide">En stock</span>
          </div>
          <div className="mt-4">
            <Link href={`/produits/${product.slug}`}>
              <h3 className="text-2xl font-semibold text-[#ffcc70] hover:text-[#ffd98a]">{product.name}</h3>
            </Link>
          </div>
          <div className="mt-4">
            <Price amount={product.price} className="text-white text-3xl" />
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#8B4513] via-[#A0522D] to-[#CD853F] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-black/40 transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 disabled:opacity-70"
          >
            {adding ? 'Ajouté !' : 'Ajouter au panier'}
          </button>
          <Link
            href={`/produits/${product.slug}`}
            className="mt-4 block text-center text-sm font-semibold uppercase tracking-wide text-white/70 hover:text-white"
          >
            Voir les détails
          </Link>
        </div>
      </div>
    </article>
  );
};
