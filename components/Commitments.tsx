import { siteConfig } from "@/lib/site";

export const Commitments = () => (
  <div className="grid gap-6 rounded-3xl border border-slate-800 bg-black/80 p-8 shadow-inner shadow-slate-100 sm:grid-cols-2 lg:grid-cols-4">
    {siteConfig.commitments.map((commitment) => (
      <div key={commitment.title}>
        <p className="text-sm font-semibold uppercase tracking-wide text-clay-900">
          {commitment.title}
        </p>
        <p className="mt-2 text-sm text-slate-500">{commitment.description}</p>
      </div>
    ))}
  </div>
);
