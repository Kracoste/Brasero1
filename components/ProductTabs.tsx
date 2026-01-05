"use client";

import { useRef, useState } from "react";
import { Users, Flame, Box, Ruler, Weight, Paintbrush } from "lucide-react";

import { AccessoryGrid } from "@/components/AccessoryGrid";
import type { Product } from "@/lib/schema";
import { cn, formatDimensions } from "@/lib/utils";

type ProductTabsProps = {
  product: Product;
  accessories?: Product[];
};

const tabs = [
  { id: "description", label: "Description du produit" },
  { id: "specifications", label: "Spécifications" },
  { id: "critiques", label: "Critiques" },
];

export const ProductTabs = ({ product, accessories = [] }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);

  const tabToRef: Record<string, React.RefObject<HTMLDivElement | null>> = {
    description: descriptionRef,
    specifications: descriptionRef,
    critiques: reviewsRef,
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    const target = tabToRef[tabId]?.current;
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
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

      {/* Contenu des onglets */}
      <div className="space-y-8 py-2">
        <div ref={descriptionRef} className="scroll-mt-32">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(450px,1.2fr)]">
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed text-[15px]">{product.description}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm h-fit">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-base font-semibold text-gray-900">Spécifications</h3>
              </div>

              {/* Caractéristiques avec icônes */}
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  {/* Convives - seulement pour braseros */}
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
                  {/* Combustible - seulement pour braseros */}
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
                  {/* Matière - pour tous les produits */}
                  {product.material && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Box className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Matière</p>
                        <p className="font-semibold text-gray-900">{product.material}</p>
                      </div>
                    </div>
                  )}
                  {/* Dimensions - pour tous les produits */}
                  {(product.length || product.width || product.height || product.diameter) && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Ruler className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Dimensions</p>
                        <p className="font-semibold text-gray-900">{formatDimensions(product as any)}</p>
                      </div>
                    </div>
                  )}
                  {/* Poids - seulement si défini */}
                  {(product.weight || product.specs?.poids) && product.category === "brasero" && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Weight className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Poids</p>
                        <p className="font-semibold text-gray-900">{product.specs?.poids || `${product.weight} kg`}</p>
                      </div>
                    </div>
                  )}
                  {/* Peinture - seulement si défini */}
                  {product.specs?.painting && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 flex-shrink-0">
                        <Paintbrush className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Peinture</p>
                        <p className="font-semibold text-gray-900">{product.specs.painting}</p>
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
                    { label: "Matière", value: product.material },
                    { label: "Diamètre", value: `${product.diameter} cm` },
                    { label: "Hauteur", value: `${product.height} cm` },
                    { label: "Épaisseur", value: `${product.thickness} mm` },
                    { label: "Poids", value: `${product.weight} kg` },
                    product.specs?.acier ? { label: "Acier", value: product.specs.acier } : null,
                    product.specs?.epaisseur ? { label: "Épaisseur bol", value: product.specs.epaisseur } : null,
                    product.specs?.dimensions ? { label: "Dimensions", value: product.specs.dimensions } : null,
                    product.specs?.compatibilite ? { label: "Compatibilité", value: product.specs.compatibilite } : null,
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
        </div>

        <div ref={reviewsRef} className="space-y-6 scroll-mt-32">
          {/* Section avis Google à venir */}
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Les avis clients seront bientôt disponibles.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
