import type { Product } from "@/lib/schema";

type SeoSection = {
  title: string;
  blocks?: { subtitle?: string; text?: string }[];
  bullets?: string[];
};

type ProductSeoContentProps = {
  seoContent: { sections: SeoSection[] };
};

export const ProductSeoContent = ({ seoContent }: ProductSeoContentProps) => {
  if (!seoContent?.sections?.length) return null;

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <div className="space-y-8">
        {seoContent.sections.map((section, sIdx) => (
          <section key={sIdx}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {section.title}
            </h2>

            {/* Blocs texte avec sous-titres */}
            {section.blocks && section.blocks.length > 0 && (
              <div className="space-y-4">
                {section.blocks.map((block, bIdx) => (
                  <div key={bIdx}>
                    {block.subtitle && (
                      <h3 className="text-base font-semibold text-gray-800 mb-1.5">
                        {block.subtitle}
                      </h3>
                    )}
                    {block.text && (
                      <p className="text-sm leading-relaxed text-gray-600">
                        {block.text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Liste à puces */}
            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-3 space-y-2">
                {section.bullets.map((bullet, bulletIdx) => (
                  <li
                    key={bulletIdx}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-amber-600 mt-1 flex-shrink-0">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};
