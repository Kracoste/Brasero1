'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type ClientActiveCoupon = {
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping' | 'shipping_discount' | 'shipping_percent';
  discount_value: number;
  applicable_products: string[] | null;
};

export type ProductCouponInfo = {
  code: string;
  /** Label de réduction produit (ex: "100€", "10%") */
  label: string;
  /** Label livraison si le coupon est de type livraison */
  shippingLabel?: string;
  /** Prix après réduction (identique au prix si coupon livraison) */
  discountedPrice: number;
  /** Pourcentage de remise */
  discountPercent: number;
};

const ActiveCouponsContext = createContext<ClientActiveCoupon[]>([]);

export function ActiveCouponsProvider({ children }: { children: ReactNode }) {
  const [coupons, setCoupons] = useState<ClientActiveCoupon[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/coupons/active-products')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { if (!cancelled && Array.isArray(data)) setCoupons(data); })
      .catch(() => { /* silent */ });
    return () => { cancelled = true; };
  }, []);

  return (
    <ActiveCouponsContext.Provider value={coupons}>
      {children}
    </ActiveCouponsContext.Provider>
  );
}

/**
 * Retourne le meilleur coupon applicable à un produit donné (plus grosse réduc)
 * ou null si aucun coupon ne s'applique.
 */
export function useProductCoupon(productSlug: string, productPrice: number): ProductCouponInfo | null {
  const coupons = useContext(ActiveCouponsContext);
  if (!coupons.length) return null;

  let best: ProductCouponInfo | null = null;

  for (const coupon of coupons) {
    const applicable =
      !coupon.applicable_products ||
      coupon.applicable_products.length === 0 ||
      coupon.applicable_products.includes(productSlug);
    if (!applicable) continue;

    let discountAmount = 0;
    let label = '';
    let shippingLabel: string | undefined;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (productPrice * coupon.discount_value) / 100;
      label = `${coupon.discount_value}%`;
    } else if (coupon.discount_type === 'fixed') {
      discountAmount = Math.min(coupon.discount_value, productPrice);
      label = `${coupon.discount_value}€`;
    } else if (coupon.discount_type === 'free_shipping') {
      shippingLabel = 'Livraison offerte';
      label = '';
    } else if (coupon.discount_type === 'shipping_discount') {
      shippingLabel = `-${coupon.discount_value}€ livraison`;
      label = '';
    } else if (coupon.discount_type === 'shipping_percent') {
      shippingLabel = `-${coupon.discount_value}% livraison`;
      label = '';
    } else {
      continue;
    }

    const isShippingOnly = coupon.discount_type === 'free_shipping' || coupon.discount_type === 'shipping_discount' || coupon.discount_type === 'shipping_percent';
    if (!best || (!isShippingOnly && discountAmount > (productPrice - best.discountedPrice))) {
      best = {
        code: coupon.code,
        label,
        shippingLabel,
        discountedPrice: Math.max(0, productPrice - discountAmount),
        discountPercent: Math.round(discountAmount > 0 ? (discountAmount / productPrice) * 100 : 0),
      };
    } else if (isShippingOnly && best !== null && !best.shippingLabel) {
      (best as ProductCouponInfo).shippingLabel = shippingLabel;
    }
  }

  return best;
}
