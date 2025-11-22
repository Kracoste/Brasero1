"use client";

import { useTransition } from "react";

import { productFilterOptions, type FilterState } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ProductFiltersProps = {
  value: FilterState;
  onChange: (filters: FilterState) => void;
  total: number;
};

export const ProductFilters = ({ value, onChange, total }: ProductFiltersProps) => {
  const [pending, startTransition] = useTransition();

  const handleSelect = (key: keyof FilterState, optionValue: string | undefined) => {
    startTransition(() => {
      onChange({
        ...value,
        [key]: optionValue === "all" ? undefined : optionValue,
      });
    });
  };

  const handleReset = () => {
    startTransition(() => onChange({ sort: "popular" }));
  };

  const selectClasses =
    "w-full rounded-full border border-slate-700 bg-black px-4 py-2 text-sm font-medium text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-500";

  return (
    <div className={cn("space-y-4 rounded-3xl border border-slate-800 bg-black/80 p-6 shadow-sm")}>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-clay-900">Filtres</p>
        <p className="text-xs text-slate-500">
          {pending ? "Mise à jour…" : `${total} modèle${total > 1 ? "s" : ""} disponibles`}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs uppercase text-slate-400">Diamètre</label>
          <select
            className={selectClasses}
            value={value.diameter ?? "all"}
            onChange={(event) => handleSelect("diameter", event.target.value)}
          >
            {productFilterOptions.diameter.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase text-slate-400">Acier</label>
          <select
            className={selectClasses}
            value={value.material ?? "all"}
            onChange={(event) => handleSelect("material", event.target.value)}
          >
            {productFilterOptions.material.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase text-slate-400">Prix</label>
          <select
            className={selectClasses}
            value={value.price ?? "all"}
            onChange={(event) => handleSelect("price", event.target.value)}
          >
            {productFilterOptions.price.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase text-slate-400">Tri</label>
          <select
            className={selectClasses}
            value={value.sort ?? "popular"}
            onChange={(event) => handleSelect("sort", event.target.value)}
          >
            {productFilterOptions.sort.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={handleReset}
        className="w-full rounded-full border border-slate-700 bg-black px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-clay-300 hover:text-clay-900"
      >
        Réinitialiser
      </button>
    </div>
  );
};
