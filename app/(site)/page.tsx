import { HeroMenu } from "@/components/HeroMenu";
import { ProductShowcase } from "@/components/ProductShowcase";

export default function HomePage() {
  return (
    <>
      <section>
        <HeroMenu />
      </section>

      <section className="bg-gradient-to-b from-[#090b12] via-[#030306] to-[#000000] pb-24 pt-12">
        <div className="w-full space-y-10 px-2 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-3 text-center text-white">
            <p className="text-xs uppercase tracking-[0.5em] text-[#ff8c74] opacity-80">
              Notre catalogue
            </p>
            <h2 className="font-display text-4xl font-semibold text-[#f7f2e9]">
              Braséros & fendeur à bûches
            </h2>
          </div>
          <ProductShowcase />
        </div>
      </section>
    </>
  );
}
