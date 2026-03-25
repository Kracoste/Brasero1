import Link from 'next/link';
import type { Product } from '@/lib/schema';
import { getAllVariantSlugs } from '@/lib/variant-slugs';

const FINISH_LABELS: Record<string, string> = {
  corten: 'Acier Corten',
  peint: 'Acier Peint',
};

const PLANCHA_LABELS: Record<string, string> = {
  acier: 'Plancha Acier',
  inox: 'Plancha Inox',
};

type VariantLinksProps = {
  product: Product;
};

export function VariantLinks({ product }: VariantLinksProps) {
  const variants = getAllVariantSlugs(product);
  if (variants.length === 0) return null;

  const shortName = product.specs?.shortName || product.name;

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <h2 className="font-display text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-2">
          Toutes les configurations du {shortName}
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Choisissez la finition, le diamètre et le type de plancha qui vous conviennent.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {variants.map(({ variantSlug, diameter, finish, plancha }) => (
            <Link
              key={variantSlug}
              href={`/brasero-plancha/${variantSlug}`}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-[#CD853F] hover:shadow-md transition-all group"
            >
              <div>
                <span className="font-medium text-slate-900 group-hover:text-[#CD853F] transition-colors text-sm">
                  {shortName} — {FINISH_LABELS[finish] || finish}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  {PLANCHA_LABELS[plancha] || plancha} · {diameter} cm
                </span>
              </div>
              <span className="text-[#CD853F] text-sm font-medium">
                Voir &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
