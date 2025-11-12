import type { Review } from "@/content/reviews";
import { cn } from "@/lib/utils";

type ReviewProps = {
  review: Review;
  className?: string;
};

export const ReviewCard = ({ review, className }: ReviewProps) => (
  <figure
    className={cn(
      "flex h-full flex-col justify-between rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-lg shadow-slate-200/30",
      className,
    )}
  >
    <blockquote className="text-base text-slate-600">“{review.quote}”</blockquote>
    <figcaption className="mt-6">
      <p className="font-semibold text-clay-900">{review.name}</p>
      <p className="text-sm text-slate-500">{review.role}</p>
    </figcaption>
  </figure>
);
