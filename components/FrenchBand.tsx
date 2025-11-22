import { siteConfig } from "@/lib/site";

export const FrenchBand = () => (
  <div className="rounded-full border border-rose-100 bg-gradient-to-r from-blue-50 via-white to-red-50 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
    Fabriqué en France — {siteConfig.atelier.city} (79)
  </div>
);
