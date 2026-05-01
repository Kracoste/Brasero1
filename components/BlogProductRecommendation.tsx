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
      <aside className="my-10 flex flex-col sm:flex-row items-center gap-5 p-5 bg-[#f1f5f9] border-l-4 border-[#0f172a] rounded-r-lg not-prose">
        {image && (
          <div className="relative w-28 h-28 flex-shrink-0 rounded overflow-hidden bg-white">
            <Image src={image.src} alt={image.alt || product.name} fill className="object-cover" sizes="112px" />
          </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs uppercase tracking-wider text-[#0f172a] font-semibold mb-1">Notre recommandation</p>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{product.name}</h3>
          {product.shortDescription && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">{product.shortDescription}</p>
          )}
          <Link
            href={`/produits/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0f172a] hover:text-[#475569]"
          >
            {label}
            <ArrowRight size={14} />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <div className="mt-12 border border-slate-200 rounded-lg overflow-hidden bg-white">
      <div className="grid sm:grid-cols-[260px_1fr]">
        {image && (
          <div className="relative aspect-square sm:aspect-auto bg-[#f1f5f9]">
            <Image src={image.src} alt={image.alt || product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 260px" />
          </div>
        )}
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-wider text-[#0f172a] font-semibold mb-2">Produit recommandé</p>
          <h3 className="text-xl font-display font-bold text-slate-900 mb-2">{product.name}</h3>
          {product.shortDescription && (
            <p className="text-sm text-slate-600 mb-4">{product.shortDescription}</p>
          )}
          <div className="flex items-center gap-4">
            <Link
              href={`/produits/${product.slug}`}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#0f172a] to-[#475569] text-white font-medium tracking-wide uppercase px-5 py-2.5 text-sm hover:brightness-110 transition-all"
            >
              {label}
              <ArrowRight size={14} />
            </Link>
            {price && (
              <span className="text-sm text-slate-500">
                à partir de <strong className="text-slate-900">{price.toFixed(0)} €</strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
