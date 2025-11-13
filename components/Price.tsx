import { cn, formatCurrency } from "@/lib/utils";

type PriceProps = {
  amount: number;
  className?: string;
};

export const Price = ({ amount, className }: PriceProps) => (
  <p className={cn("text-white", className)}>
    <span className="text-2xl font-semibold">{formatCurrency(amount)}</span>
    <span className="ml-1 text-sm opacity-70">TTC</span>
  </p>
);
