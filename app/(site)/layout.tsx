import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatingCart } from "@/components/FloatingCart";
import { VisitTracker } from "@/components/VisitTracker";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="flex min-h-screen flex-col bg-white text-slate-900">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingCart />
          <VisitTracker />
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}
