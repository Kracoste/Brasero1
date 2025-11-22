import { cn, formatCurrency } from "@/lib/utils";

type PriceProps = {
  amount: number;
  className?: string;
  tone?: "light" | "dark";
};

const toneClasses = {
  light: {
    wrapper: "text-white",
    detail: "text-slate-300",
  },
  dark: {
    wrapper: "text-white",
    detail: "text-slate-400",
  },
} as const;

export const Price = ({ amount, className, tone = "dark" }: PriceProps) => {
  const palette = toneClasses[tone];

  return (
    <p className={cn(palette.wrapper, className)}>
      <span className="text-2xl font-semibold">{formatCurrency(amount)}</span>
      <span className={cn("ml-1 text-sm opacity-80", palette.detail)}>TTC</span>
    </p>
  );
};
