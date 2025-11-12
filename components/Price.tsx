import { formatCurrency } from "@/lib/utils";

type PriceProps = {
  amount: number;
  className?: string;
};

export const Price = ({ amount, className }: PriceProps) => (
  <p className={className}>
    <span className="text-2xl font-semibold text-slate-900">{formatCurrency(amount)}</span>
    <span className="ml-1 text-sm text-slate-500">TTC</span>
  </p>
);
