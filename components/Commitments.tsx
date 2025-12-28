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
  <div className="py-12">
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-16">
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-white mb-4">
                <Icon className="h-10 w-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
