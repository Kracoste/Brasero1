import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement>;

export const Section = ({ className, ...props }: SectionProps) => (
  <section className={cn("py-16 sm:py-20", className)} {...props} />
);
