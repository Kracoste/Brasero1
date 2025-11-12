import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

export const Badge = ({ variant = "default", className, ...props }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
      variant === "default"
        ? "bg-clay-600/10 text-clay-700"
        : "border border-clay-300 text-clay-600",
      className,
    )}
    {...props}
  />
);
