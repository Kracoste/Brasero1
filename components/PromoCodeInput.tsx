"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

export interface CouponData {
  code: string;
  discount: number;
  discountType: string;
  discountValue: number;
}

interface PromoCodeInputProps {
  cartTotal: number;
  email?: string;
  onApply: (couponData: CouponData) => void;
  onRemove: () => void;
}

const STORAGE_KEY = "brasero:applied-coupon";

export const PromoCodeInput = ({ cartTotal, email, onApply, onRemove }: PromoCodeInputProps) => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const hasHydrated = useRef(false);

  // Réhydrater le coupon depuis sessionStorage et re-valider pour s'assurer qu'il est toujours valide
  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as CouponData;
      if (!saved?.code) return;
      (async () => {
        try {
          const response = await fetch("/api/coupons/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: saved.code, cartTotal, email: email || undefined }),
          });
          const data = await response.json();
          if (!response.ok || data.valid === false) {
            sessionStorage.removeItem(STORAGE_KEY);
            return;
          }
          const couponData: CouponData = {
            code: saved.code,
            discount: data.discount ?? 0,
            discountType: data.discountType,
            discountValue: data.discountValue ?? 0,
          };
          setAppliedCoupon(couponData);
          setStatus("success");
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(couponData));
          onApply(couponData);
        } catch {
          // silencieux : on laisse l'utilisateur ressaisir si besoin
        }
      })();
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmed = code.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed, cartTotal, email: email || undefined }),
      });

      if (response.status === 429) {
        setStatus("error");
        setErrorMessage("Trop de tentatives, réessayez plus tard");
        return;
      }

      const data = await response.json();

      if (!response.ok || data.valid === false) {
        setStatus("error");
        setErrorMessage(data.error || "Code promo invalide");
        return;
      }

      const couponData: CouponData = {
        code: trimmed,
        discount: data.discount ?? 0,
        discountType: data.discountType,
        discountValue: data.discountValue ?? 0,
      };

      setAppliedCoupon(couponData);
      setStatus("success");
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(couponData));
      }
      onApply(couponData);
    } catch {
      setStatus("error");
      setErrorMessage("Une erreur est survenue, veuillez réessayer");
    }
  };

  const handleRemove = () => {
    setCode("");
    setStatus("idle");
    setErrorMessage("");
    setAppliedCoupon(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    onRemove();
  };

  const formatDiscount = (coupon: CouponData) => {
    if (coupon.discountType === "percentage") {
      return `-${coupon.discountValue}%`;
    }
    if (coupon.discountType === "free_shipping") {
      return "Livraison offerte";
    }
    if (coupon.discountType === "shipping_discount") {
      return `-${coupon.discountValue}€ livraison`;
    }
    if (coupon.discountType === "shipping_percent") {
      return `-${coupon.discountValue}% livraison`;
    }
    return `-${coupon.discountValue}€`;
  };

  if (status === "success" && appliedCoupon) {
    return (
      <div className="flex items-center justify-between text-sm">
        <p className="text-green-600 font-medium">
          Code appliqué : {formatDiscount(appliedCoupon)}
        </p>
        <button
          type="button"
          onClick={handleRemove}
          className="text-slate-500 underline hover:text-slate-700 text-sm"
        >
          Supprimer
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code promo"
          className="flex-1 min-w-0 border border-slate-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f172a] focus:border-[#0f172a]"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading" || !code.trim()}
          className="bg-[#0f172a] text-white rounded-r-lg px-4 py-2 text-sm font-medium hover:bg-[#723A10] disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {status === "loading" ? "..." : "Appliquer"}
        </button>
      </form>
      {status === "error" && errorMessage && (
        <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
