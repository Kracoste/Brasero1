"use client";

import { useRef, useState, useMemo } from "react";
import { Users, Flame, Box, Ruler, Weight, Paintbrush, CookingPot, Layers } from "lucide-react";

import { AccessoryGrid } from "@/components/AccessoryGrid";
import { FAQ } from "@/components/FAQ";
import { ProductSeoContent } from "@/components/ProductSeoContent";
import { getProductFAQ, type FAQOptions } from "@/lib/product-faq";
import type { Product } from "@/lib/schema";
import { cn, formatDimensions } from "@/lib/utils";

type SpecsOverrides = {
  diameter?: number;
  height?: number;
  length?: number;
  width?: number;
  weight?: string | number;
  finish?: 'corten' | 'peint';
  paintType?: string;
  planchaMaterial?: 'acier' | 'inox';
  bowlThickness?: number;
  baseThickness?: number;
};

type ProductTabsProps = {
  product: Product;
  accessories?: Product[];
  /** Options pour la FAQ dynamique (quand le client change de variante) */
  faqOptions?: FAQOptions;
  /** Overrides de specs quand le client sélectionne une variante */
  specsOverrides?: SpecsOverrides;
  /** Description override depuis la sous-fiche de configuration */
  overrideDescription?: string;
  /** FAQ override depuis la sous-fiche de configuration */
  overrideFAQ?: { question: string; answer: string }[];
  /** Caractéristiques override depuis la sous-fiche de configuration */
  overrideCharacteristics?: { label: string; value: string }[];
  /** Contenu SEO override depuis la sous-fiche ou le diamètre */
  overrideSeoContent?: { sections: { title: string; blocks?: { subtitle?: string; text?: string }[]; bullets?: string[] }[] };
};

export const ProductTabs = ({ product, accessories = [], faqOptions, specsOverrides, overrideDescription, overrideFAQ, overrideCharacteristics, overrideSeoContent }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Générer la FAQ dynamique en fonction du produit et des options (variantes)
  const dynamicFAQ = useMemo(
    () => getProductFAQ(product, faqOptions),
    [product, faqOptions]
  );

  // Valeurs effectives (overridées par la variante sélectionnée ou valeurs du produit)
  const effectiveDiameter = specsOverrides?.diameter ?? product.diameter;
  const effectiveHeight = specsOverrides?.height ?? product.height;
  const effectiveLength = specsOverrides?.length;
  const effectiveWidth = specsOverrides?.width;
  const effectiveWeight = specsOverrides?.weight ?? (product.specs?.poids || (product.weight ? `${product.weight} kg` : undefined));
  const effectivePlanchaMaterial = specsOverrides?.planchaMaterial ?? product.specs?.planchaMaterial;
  const effectivePainting = specsOverrides?.finish === 'peint'
    ? (specsOverrides?.paintType || product.specs?.painting || 'Thermolaqué')
    : (specsOverrides?.finish === 'corten' ? undefined : product.specs?.painting);
  const effectiveMaterial = specsOverrides?.finish === 'corten'
    ? 'Acier Corten'
    : specsOverrides?.finish === 'peint'
      ? 'Acier peint'
      : product.material;

  // FAQ : priorité override (sous-fiche) > FAQ dynamique générée
  const effectiveFAQ = overrideFAQ && overrideFAQ.length > 0 ? overrideFAQ : dynamicFAQ;

  // Caractéristiques : priorité override (sous-fiche) > produit
  const effectiveCharacteristics = overrideCharacteristics && overrideCharacteristics.length > 0
    ? overrideCharacteristics
    : product.specs?.characteristics;
  const hasCharacteristics = effectiveCharacteristics && effectiveCharacteristics.length > 0;

  // Description : priorité override (sous-fiche) > produit
  const effectiveDescription = overrideDescription || product.description;

  // Construire les onglets dynamiquement
  const tabs = [
    { id: "description", label: "Description du produit" },
    { id: "specifications", label: "Spécifications" },
    ...(hasCharacteristics ? [{ id: "characteristics", label: "Caractéristiques" }] : []),
    ...(effectiveFAQ.length > 0 ? [{ id: "faq", label: "FAQ" }] : []),
    { id: "critiques", label: "Critiques" },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (contentRef.current) {
      requestAnimationFrame(() => {
        contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <div className="space-y-0">
      {/* Onglets */}
      <div className="flex flex-wrap gap-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "pb-4 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Carrousel accessoires sous les boutons */}
      {accessories.length > 0 && (
        <div className="pt-3">
          <AccessoryGrid
            products={accessories}
            title="Accessoires compatibles"
            subtitle="Commandez aussi ces indispensables pour compléter votre braséro."
          />
        </div>
      )}

      {/* Contenu des onglets — un seul onglet visible à la fois */}
      <div ref={contentRef} className="py-6 scroll-mt-32">

        {/* === DESCRIPTION === */}
        {(activeTab === "description" || activeTab === "specifications") && (
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(450px,1.2fr)]">
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed text-[15px]">{effectiveDescription}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm h-fit">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-base font-semibold text-gray-900">Spécifications</h3>
              </div>

              {/* Caractéristiques avec icônes */}
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  {product.category === "brasero" && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Users className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Convives</p>
                        <p className="font-semibold text-gray-900">{product.specs?.numberOfGuests || "6-8 personnes"}</p>
                      </div>
                    </div>
                  )}
                  {product.category === "brasero" && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Flame className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Combustible</p>
                        <p className="font-semibold text-gray-900">{product.specs?.fuel || "Bois"}</p>
                      </div>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Box className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Matière</p>
                        <p className="font-semibold text-gray-900">{effectiveMaterial}</p>
                      </div>
                    </div>
                  )}
                  {(effectiveLength || effectiveWidth || product.length || product.width || effectiveHeight || effectiveDiameter) && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Ruler className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Dimensions</p>
                        <p className="font-semibold text-gray-900">{formatDimensions({ ...product, diameter: effectiveDiameter, height: effectiveHeight, length: effectiveLength ?? product.length, width: effectiveWidth ?? product.width })}</p>
                      </div>
                    </div>
                  )}
                  {effectiveWeight && product.category === "brasero" && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Weight className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Poids</p>
                        <p className="font-semibold text-gray-900">{effectiveWeight}</p>
                      </div>
                    </div>
                  )}
                  {product.bowlThickness && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Layers className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Épaisseur bol</p>
                        <p className="font-semibold text-gray-900">{product.bowlThickness} mm</p>
                      </div>
                    </div>
                  )}
                  {product.baseThickness && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Layers className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Épaisseur socle</p>
                        <p className="font-semibold text-gray-900">{product.baseThickness} mm</p>
                      </div>
                    </div>
                  )}
                  {effectivePainting && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Paintbrush className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Peinture</p>
                        <p className="font-semibold text-gray-900">{effectivePainting}</p>
                      </div>
                    </div>
                  )}
                  {effectivePlanchaMaterial && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <CookingPot className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Plancha</p>
                        <p className="font-semibold text-gray-900">{effectivePlanchaMaterial === 'inox' ? 'Inox' : 'Acier'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <dl className="text-sm text-gray-700">
                {(product.customSpecs ??
                  [
                    { label: "Marque", value: "France Braseros" },
                    { label: "Fabrication", value: product.madeIn },
                    { label: "Matière", value: effectiveMaterial },
                    { label: "Diamètre", value: `${effectiveDiameter} cm` },
                    { label: "Hauteur", value: `${effectiveHeight} cm` },
                    { label: "Épaisseur", value: `${product.thickness} mm` },
                    effectiveWeight ? { label: "Poids", value: effectiveWeight } : { label: "Poids", value: `${product.weight} kg` },
                    product.bowlThickness ? { label: "Épaisseur bol", value: `${product.bowlThickness} mm` } : (product.specs?.epaisseur ? { label: "Épaisseur bol", value: product.specs.epaisseur } : null),
                    product.baseThickness ? { label: "Épaisseur socle", value: `${product.baseThickness} mm` } : null,
                    product.specs?.acier ? { label: "Acier", value: product.specs.acier } : null,
                    product.specs?.dimensions ? { label: "Dimensions", value: product.specs.dimensions } : null,
                    product.specs?.compatibilite ? { label: "Compatibilité", value: product.specs.compatibilite } : null,
                    effectivePlanchaMaterial ? { label: "Matière plancha", value: effectivePlanchaMaterial === 'inox' ? 'Inox' : 'Acier' } : null,
                    effectivePainting ? { label: "Peinture", value: effectivePainting } : null,
                  ])!
                  .filter(Boolean)
                  .map((item, idx) => (
                    <div
                      key={item!.label}
                      className={cn(
                        "grid grid-cols-[1fr_1.1fr] gap-3 px-4 py-3",
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      )}
                    >
                      <dt className="font-medium text-gray-900">{item!.label}</dt>
                      <dd className="text-gray-700">{item!.value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        )}

        {/* === CARACTÉRISTIQUES === */}
        {activeTab === "characteristics" && hasCharacteristics && (
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 uppercase tracking-wide mb-8">
              Caractéristiques
            </h2>
            <div className="max-w-3xl">
              {/* En-tête nom du produit */}
              <div className="border-b-2 border-slate-900 pb-3 mb-0">
                <p className="font-display font-bold text-slate-900 uppercase text-sm tracking-widest">{product.name}</p>
              </div>
              {/* Lignes */}
              <dl className="divide-y divide-slate-200">
                {effectiveCharacteristics!.map((item: { label: string; value: string }, idx: number) => (
                  <div
                    key={item.label}
                    className="flex items-baseline justify-between py-4 gap-8"
                  >
                    <dt className="text-sm font-semibold text-slate-900 shrink-0">{item.label}</dt>
                    <dd className="text-sm text-slate-600 text-right">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* === FAQ === */}
        {activeTab === "faq" && effectiveFAQ.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Questions fréquentes</h2>
              <p className="text-sm text-gray-500 mb-6">
                Tout ce que vous devez savoir sur ce produit
              </p>
              <FAQ items={effectiveFAQ} />
            </div>

            {/* JSON-LD FAQPage pour le SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: effectiveFAQ.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: item.answer,
                    },
                  })),
                }),
              }}
            />
          </div>
        )}

        {/* === CRITIQUES === */}
        {activeTab === "critiques" && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Les avis clients seront bientôt disponibles.</p>
          </div>
        )}
      </div>

      {/* Contenu SEO riche — toujours visible sous les onglets */}
      {(overrideSeoContent || product.seoContent) && (
        <ProductSeoContent seoContent={overrideSeoContent || product.seoContent!} />
      )}
    </div>
  );
};
