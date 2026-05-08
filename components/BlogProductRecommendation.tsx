import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { mapSupabaseProduct } from "@/lib/utils";

type Props = {
  productSlug: string;
  ctaText?: string | null;
  variant?: "inline" | "footer";
};

export async function BlogProductRecommendation({ productSlug, ctaText, variant = "footer" }: Props) {
  const supabase = await createClient();
  const { data: raw } = await supabase
    .from("products")
    .select("*")
    .eq("slug", productSlug)
    .single();

  const product = mapSupabaseProduct(raw);
  if (!product) return null;

  const image = product.images?.[0];
  const price = product.price;
  const label = ctaText || `Découvrir ${product.name}`;

  if (variant === "inline") {
    return (
      <aside className="my-10 flex flex-col sm:flex-row items-center gap-5 p-5 bg-[#f4f1ec] border-l-2 border-[#8b2d2d] not-prose">
        {image && (
          <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden bg-white">
            <Image src={image.src} alt={image.alt || product.name} fill className="object-cover" sizes="112px" />
          </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-[#8b2d2d] font-semibold mb-1">Notre recommandation</p>
          <h3 className="text-lg font-display font-semibold text-slate-900 mb-1">{product.name}</h3>
          {product.shortDescription && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">{product.shortDescription}</p>
          )}
          <Link
            href={`/produits/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#8b2d2d] hover:text-[#6e2323]"
          >
            {label}
            <ArrowRight size={14} />
          </Link>
        </div>
      </aside>
    );
  }

  // ─── Variant "footer" : carte premium éditoriale ────────────────────
  return (
    <aside className="mt-16 mb-4 not-prose">
      <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[#8b2d2d] font-semibold mb-5">
        Produit recommandé
      </p>
      <div className="grid sm:grid-cols-[1fr_1fr] gap-0 bg-[#f4f1ec]">
        {image && (
          <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[420px] bg-[#ebe6df]">
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        )}
        <div className="p-7 sm:p-10 flex flex-col justify-center">
          <h3 className="text-2xl sm:text-[1.7rem] font-display font-semibold text-slate-900 leading-tight mb-4">
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="text-[0.95rem] text-slate-700 leading-relaxed mb-6 line-clamp-5">
              {product.shortDescription}
            </p>
          )}
          {price && (
            <p className="text-sm text-slate-600 mb-5">
              à partir de{" "}
              <span className="text-slate-900 font-semibold tracking-tight">
                {price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €
              </span>
            </p>
          )}
          <Link
            href={`/produits/${product.slug}`}
            className="inline-flex items-center gap-3 bg-[#0f172a] text-white hover:bg-[#1e293b] font-medium tracking-[0.15em] uppercase px-6 py-4 text-[0.72rem] transition-colors w-fit max-w-full whitespace-nowrap overflow-hidden"
          >
            <span className="truncate">{label}</span>
            <ArrowRight size={14} className="flex-shrink-0" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
