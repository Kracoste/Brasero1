import { cn, formatCurrency } from "@/lib/utils";

type PriceProps = {
  amount: number;
  className?: string;
  tone?: "light" | "dark";
  showHT?: boolean;
};

const toneClasses = {
  light: {
    wrapper: "text-[#2d2d2d]",
    detail: "text-slate-600",
  },
  dark: {
    wrapper: "text-[#2d2d2d]",
    detail: "text-slate-600",
  },
} as const;

export const Price = ({ amount, className, tone = "dark", showHT = false }: PriceProps) => {
  const palette = toneClasses[tone];
  const amountHT = amount / 1.2;

  return (
    <span className={cn(palette.wrapper, className)}>
      <span className="text-2xl font-semibold">{formatCurrency(amount)}</span>
      <span className={cn("ml-1 text-sm opacity-80", palette.detail)}>TTC</span>
      {showHT && (
        <>
          <br />
          <span className={cn("text-sm", palette.detail)}>
            {formatCurrency(amountHT)} HT
          </span>
        </>
      )}
    </span>
  );
};
