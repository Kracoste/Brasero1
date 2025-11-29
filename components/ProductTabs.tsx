"use client";

import { useRef, useState } from "react";

import { AccessoryGrid } from "@/components/AccessoryGrid";
import type { Product } from "@/lib/schema";
import { cn } from "@/lib/utils";

type ProductTabsProps = {
  product: Product;
  accessories?: Product[];
};

const tabs = [
  { id: "description", label: "Description du produit" },
  { id: "specifications", label: "Spécifications" },
  { id: "garantie", label: "Garantie" },
  { id: "critiques", label: "Critiques" },
];

export const ProductTabs = ({ product, accessories = [] }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");
  const descriptionRef = useRef<HTMLDivElement>(null);
  const warrantyRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const tabToRef: Record<string, React.RefObject<HTMLDivElement>> = {
    description: descriptionRef,
    specifications: descriptionRef,
    garantie: warrantyRef,
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
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]">
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed text-[15px]">{product.description}</p>
              <p className="leading-relaxed text-[15px]">
                Ce braséro est entièrement fabriqué à la main dans notre atelier de Moncoutant, dans les Deux-Sèvres. Chaque pièce est unique et porte les marques du travail artisanal : soudures parfaitement exécutées, finitions soignées et contrôle qualité rigoureux avant expédition.
              </p>
              <p className="leading-relaxed text-[15px]">
                L'acier utilisé développe naturellement une patine protectrice au fil du temps, lui conférant un aspect authentique et une résistance accrue aux intempéries. Idéal pour créer une ambiance chaleureuse lors de vos soirées en extérieur, ce braséro devient rapidement le point central de votre jardin ou terrasse.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-base font-semibold text-gray-900">Spécifications</h3>
              </div>
              <dl className="text-sm text-gray-700">
                {[
                  { label: "Marque", value: "France Braseros" },
                  { label: "Fabrication", value: product.madeIn },
                  { label: "Matière", value: product.material },
                  { label: "Diamètre", value: `${product.diameter} cm` },
                  { label: "Hauteur", value: `${product.height} cm` },
                  { label: "Épaisseur", value: `${product.thickness} mm` },
                  { label: "Poids", value: `${product.weight} kg` },
                  { label: "Acier", value: product.specs.acier },
                  { label: "Épaisseur bol", value: product.specs.epaisseur },
                  { label: "Dimensions", value: product.specs.dimensions },
                  product.specs.compatibilite ? { label: "Compatibilité", value: product.specs.compatibilite } : null,
                ]
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

        <div ref={warrantyRef} className="space-y-6 text-gray-600 scroll-mt-32">
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h4 className="text-lg font-semibold text-green-800">{product.warranty}</h4>
            <p className="mt-2 text-green-700">
              Votre braséro est couvert par notre garantie fabricant couvrant tout défaut de fabrication ou de matériau.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Ce que couvre la garantie :</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Défauts de fabrication (soudures, assemblage)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Défauts de matériau (perforation prématurée, fissures)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Problèmes structurels affectant la stabilité</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Ce que ne couvre pas la garantie :</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gray-400">✗</span>
                <span>Usure normale et patine naturelle de l'acier corten</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">✗</span>
                <span>Dommages causés par une mauvaise utilisation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">✗</span>
                <span>Modifications apportées au produit</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">
            Pour toute demande de garantie, contactez notre service client avec votre numéro de commande et des photos du problème constaté.
          </p>
        </div>

        <div ref={reviewsRef} className="space-y-6 scroll-mt-32">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-gray-900">4.8</div>
            <div>
              <div className="flex text-yellow-400">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className={i === 4 ? "text-yellow-200" : ""}>
                    {star}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500">Basé sur 47 avis clients</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "Jean-Pierre M.",
                date: "15 novembre 2025",
                rating: 5,
                comment: "Excellent braséro, la qualité de fabrication est remarquable. Les soudures sont parfaites et la patine se développe magnifiquement. Livraison rapide et bien emballé.",
              },
              {
                name: "Marie L.",
                date: "3 novembre 2025",
                rating: 5,
                comment: "Nous avons passé de superbes soirées autour de ce braséro. La chaleur est bien diffusée et le design s'intègre parfaitement dans notre jardin. Je recommande !",
              },
              {
                name: "Thomas D.",
                date: "28 octobre 2025",
                rating: 4,
                comment: "Très beau produit, robuste et bien fini. J'enlève une étoile car le délai de livraison était un peu long, mais la qualité vaut l'attente.",
              },
            ].map((review, index) => (
              <div key={index} className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{review.name}</span>
                    <span className="text-yellow-400">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>

          <button className="text-sm font-medium text-orange-600 hover:text-orange-700">
            Voir tous les avis →
          </button>
        </div>
      </div>
    </div>
  );
};
