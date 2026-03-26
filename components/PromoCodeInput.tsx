"use client";

import { FormEvent, useState } from "react";

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

export const PromoCodeInput = ({ cartTotal, email, onApply, onRemove }: PromoCodeInputProps) => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);

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

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Code promo invalide");
        return;
      }

      const couponData: CouponData = {
        code: trimmed,
        discount: data.discount,
        discountType: data.discountType,
        discountValue: data.discountValue,
      };

      setAppliedCoupon(couponData);
      setStatus("success");
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
    onRemove();
  };

  const formatDiscount = (coupon: CouponData) => {
    if (coupon.discountType === "percentage") {
      return `-${coupon.discountValue}%`;
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
          className="flex-1 min-w-0 border border-slate-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B4513] focus:border-[#8B4513]"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading" || !code.trim()}
          className="bg-[#8B4513] text-white rounded-r-lg px-4 py-2 text-sm font-medium hover:bg-[#723A10] disabled:opacity-50 transition-colors whitespace-nowrap"
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
