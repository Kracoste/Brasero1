import { cn, formatCurrency } from "@/lib/utils";

type PriceProps = {
  amount: number;
  className?: string;
  tone?: "light" | "dark";
};

const toneClasses = {
  light: {
    wrapper: "text-[#f5f0e6]",
    detail: "text-[#c8c0b0]",
  },
  dark: {
    wrapper: "text-[#111827]",
    detail: "text-[#6b7280]",
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
