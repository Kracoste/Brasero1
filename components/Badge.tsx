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
        ? "bg-black/10 text-white/80"
        : "border border-white/30 text-white/70",
      className,
    )}
    {...props}
  />
);
