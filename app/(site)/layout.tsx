import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CartProvider } from "@/lib/cart-context";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-clay-50 via-white to-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
