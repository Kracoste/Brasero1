import { Truck, Headphones, ThumbsUp } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Livraison à domicile",
    description: "Livraison rapide et sécurisée"
  },
  {
    icon: Headphones,
    title: "SAV à votre écoute",
    description: "Réponse sous 24h"
  },
  {
    icon: ThumbsUp,
    title: "Nos conseils",
    description: "Experts à votre service"
  }
];

export const Commitments = () => (
  <div className="py-8 sm:py-12">
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-16">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-slate-800 text-white mb-2 sm:mb-4">
                <Icon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-xs sm:text-sm lg:text-lg font-semibold text-slate-900 mb-0.5 sm:mb-1">
                {feature.title}
              </h3>
              <p className="text-[10px] sm:text-xs lg:text-sm text-slate-600 hidden sm:block">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
