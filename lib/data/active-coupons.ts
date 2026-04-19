import { createClient } from '@/lib/supabase/server';

export type ActiveCoupon = {
  code: string;
  discount_type: 'percentage' | 'fixed' | 'free_shipping' | 'shipping_discount' | 'shipping_percent';
  discount_value: number;
  applicable_products: string[] | null;
  show_in_banner: boolean;
};

export type ProductCouponInfo = {
  code: string;
  /** Label de réduction affiché dans la bulle (ex: "-100€", "-10%") */
  label: string;
  /** Prix après remise appliquée sur le prix de base du produit */
  discountedPrice: number;
  /** Pourcentage de remise pour la ribbon */
  discountPercent: number;
};

/**
 * Récupère tous les coupons actifs (hors coupons livraison, qui ne modifient pas
 * le prix des produits). Utilisé pour afficher le prix barré automatiquement.
 */
export async function getActiveProductCoupons(): Promise<ActiveCoupon[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('coupons')
    .select('code, discount_type, discount_value, applicable_products, show_in_banner, expires_at, max_uses, current_uses')
    .eq('is_active', true)
    .eq('show_on_products', true)
    .in('discount_type', ['percentage', 'fixed']);

  if (!data) return [];

  const now = new Date();
  return data
    .filter((c) => {
      if (c.expires_at && new Date(c.expires_at) < now) return false;
      if (c.max_uses && c.current_uses >= c.max_uses) return false;
      return true;
    })
    .map((c) => ({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: Number(c.discount_value),
      applicable_products: c.applicable_products,
      show_in_banner: c.show_in_banner,
    }));
}

/**
 * Pour un produit donné, calcule la meilleure remise applicable parmi les coupons actifs.
 * Retourne null si aucun coupon ne s'applique.
 */
export function getBestCouponForProduct(
  productSlug: string,
  productPrice: number,
  coupons: ActiveCoupon[],
): ProductCouponInfo | null {
  let best: ProductCouponInfo | null = null;

  for (const coupon of coupons) {
    const isApplicable =
      !coupon.applicable_products ||
      coupon.applicable_products.length === 0 ||
      coupon.applicable_products.includes(productSlug);

    if (!isApplicable) continue;

    let discountAmount = 0;
    let label = '';
    if (coupon.discount_type === 'percentage') {
      discountAmount = (productPrice * coupon.discount_value) / 100;
      label = `${coupon.discount_value}%`;
    } else if (coupon.discount_type === 'fixed') {
      discountAmount = Math.min(coupon.discount_value, productPrice);
      label = `${coupon.discount_value}€`;
    } else {
      continue;
    }

    const discountedPrice = Math.max(0, productPrice - discountAmount);
    const discountPercent = Math.round((discountAmount / productPrice) * 100);

    if (!best || discountAmount > (productPrice - best.discountedPrice)) {
      best = {
        code: coupon.code,
        label,
        discountedPrice,
        discountPercent,
      };
    }
  }

  return best;
}
