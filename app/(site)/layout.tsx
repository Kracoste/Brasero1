import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatingCart } from "@/components/FloatingCart";
import { CartProvider } from "@/lib/cart-context";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-[#0a0a0a] to-[#111]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingCart />
      </div>
    </CartProvider>
  );
}
