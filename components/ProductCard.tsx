import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/Badge";
import { Price } from "@/components/Price";
import type { Product } from "@/lib/schema";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  orientation?: "vertical" | "horizontal";
};

export const ProductCard = ({ product, orientation = "vertical" }: ProductCardProps) => {
  const image = product.images[0];
  const isHorizontal = orientation === "horizontal";

  return (
    <article
      className={cn(
        "group grid gap-6 rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_rgba(5,5,5,0.9))] p-6 text-white shadow-xl shadow-black/50 transition hover:-translate-y-1 hover:border-amber-400/40",
        isHorizontal ? "md:grid-cols-[1.1fr_0.9fr]" : "",
      )}
    >
      <div className="relative overflow-hidden rounded-2xl bg-black/40">
        <Badge className="absolute left-4 top-4 bg-white/90 text-xs font-semibold uppercase tracking-wide text-clay-900 shadow">
          Made in France
        </Badge>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-white/40 text-white/70">
            {product.badge}
          </Badge>
          <span className="text-xs uppercase tracking-wide text-white/50">
            {product.category === "brasero" ? "Braséro" : "Accessoire"}
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-white">{product.name}</h3>
          <p className="mt-2 text-sm text-white/70">{product.shortDescription}</p>
        </div>
        <Price amount={product.price} className="text-white" />
        <Link
          href={`/produits/${product.slug}`}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-clay-900 via-clay-700 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-clay-900/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
        >
          Ajouter au panier
        </Link>
      </div>
    </article>
  );
};
