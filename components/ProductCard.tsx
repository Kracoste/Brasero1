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
        "group grid gap-6 rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-slate-200/30 transition hover:-translate-y-1 hover:border-clay-200 hover:shadow-xl",
        isHorizontal ? "md:grid-cols-[1.1fr_0.9fr]" : "",
      )}
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-100">
        <Badge className="absolute left-4 top-4 bg-white/90 text-xs font-semibold text-clay-900 shadow">
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
          <Badge variant="outline">{product.badge}</Badge>
          <span className="text-xs uppercase tracking-wide text-slate-400">
            {product.category === "brasero" ? "Braséro" : "Accessoire"}
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-clay-900">{product.name}</h3>
          <p className="mt-2 text-sm text-slate-500">{product.shortDescription}</p>
        </div>
        <Price amount={product.price} />
        <Link
          href={`/produits/${product.slug}`}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-clay-900 via-clay-700 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-clay-900/30 transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
        >
          <span aria-hidden className="transition duration-300 group-hover:rotate-12">🔥</span>
          Voir le produit
        </Link>
      </div>
    </article>
  );
};
