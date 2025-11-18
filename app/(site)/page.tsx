import { HeroMenu } from "@/components/HeroMenu";
import { ProductShowcase } from "@/components/ProductShowcase";

export default function HomePage() {
  return (
    <>
      <section>
        <HeroMenu />
      </section>

      <section className="bg-[#f6f6f9] pb-24 pt-8">
        <div className="w-full space-y-10 px-2 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[#ff5751]">Notre catalogue</p>
            <h2 className="font-display text-4xl font-semibold text-[#111827]">
              Braséros & fendeur à bûches
            </h2>
          </div>
          <ProductShowcase />
        </div>
      </section>
    </>
  );
}
