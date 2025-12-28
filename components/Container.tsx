import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export const Container = ({ className, ...props }: ContainerProps) => (
  <div className={cn("mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-16", className)} {...props} />
);
