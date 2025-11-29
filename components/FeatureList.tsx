import type { LucideIcon } from "lucide-react";
import {
  Axe,
  Battery,
  Box,
  Briefcase,
  ChefHat,
  Droplet,
  Factory,
  Feather,
  Flame,
  Hand,
  Leaf,
  Lightbulb,
  Ruler,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Thermometer,
  Truck,
  Utensils,
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
  Thermometer,
  Hand,
  Ruler,
  Utensils,
  Lightbulb,
  Battery,
  Briefcase,
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
          className="flex items-start gap-4 p-4"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Icon size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        </div>
      );
    })}
  </div>
);
