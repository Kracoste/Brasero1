'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Price } from '@/components/Price';

type StickyAddToCartProps = {
  productName: string;
  price: number;
  onAdd: () => void;
  disabled?: boolean;
  onDemand?: boolean;
};

export function StickyAddToCart({ productName, price, onAdd, disabled, onDemand }: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = 600;
    const handleScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (onDemand) return null;

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] transition-transform duration-200 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 truncate">{productName}</p>
          <Price amount={price} className="text-lg font-bold text-slate-900" />
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="flex items-center gap-2 rounded-full bg-gradient-to-br from-[#0f172a] to-[#475569] px-5 py-2.5 font-semibold text-white shadow-md active:scale-95 transition disabled:opacity-60"
        >
          <ShoppingCart size={18} />
          <span className="text-sm">Ajouter</span>
        </button>
      </div>
    </div>
  );
}
