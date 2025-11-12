import type { LucideIcon } from "lucide-react";
import {
  Axe,
  Box,
  ChefHat,
  Droplet,
  Factory,
  Feather,
  Flame,
  Leaf,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Truck,
  Wind,
  Wrench,
} from "lucide-react";

import type { Product } from "@/lib/schema";

const iconMap: Record<string, LucideIcon> = {
  Flame,
  ShieldCheck,
  Leaf,
  Wind,
  Sun,
  Wrench,
  Sparkles,
  ChefHat,
  Factory,
  Feather,
  Droplet,
  Target,
  Axe,
  Shield,
  Box,
  Truck,
};

type FeatureListProps = {
  product: Product;
};

export const FeatureList = ({ product }: FeatureListProps) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {product.features.map((feature) => {
      const Icon = iconMap[feature.icon] ?? Sparkles;
      return (
        <div
          key={feature.title}
          className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white/70 p-4"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-clay-900/10 text-clay-900">
            <Icon size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-clay-900">{feature.title}</p>
            <p className="text-sm text-slate-500">{feature.description}</p>
          </div>
        </div>
      );
    })}
  </div>
);
