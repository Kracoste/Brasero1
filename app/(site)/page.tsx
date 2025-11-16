import Image from "next/image";
import Link from "next/link";

import { FadeIn } from "@/components/FadeIn";
import { HeroMenu } from "@/components/HeroMenu";
import { ProductCard } from "@/components/ProductCard";
import { braseros } from "@/content/products";

const services = [
  {
    title: "Livraison gratuite",
    subtitle: "France métropolitaine",
  },
  {
    title: "Retours faciles",
    subtitle: "30 jours pour changer d'avis",
  },
  {
    title: "Support 7/7",
    subtitle: "Artisans disponibles",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-50 to-slate-100">
        <HeroMenu />
      </section>

      <section className="bg-[#f6f6f9] pb-24 pt-8">
        <div className="mx-auto w-[95%] max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[#ff5751]">Notre catalogue</p>
            <h2 className="font-display text-4xl font-semibold text-[#111827]">
              Braséros & fendeur à bûches
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {braseros.map((product) => (
              <FadeIn key={product.slug}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
