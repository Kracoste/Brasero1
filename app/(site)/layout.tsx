import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatingCart } from "@/components/FloatingCart";
import { VisitTracker } from "@/components/VisitTracker";
import { Commitments } from "@/components/Commitments";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { AuthProvider } from "@/lib/auth-context";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <div className="flex min-h-screen flex-col text-slate-900 overflow-x-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden">{children}</main>
            <Commitments />
            <Footer />
            <FloatingCart />
            <VisitTracker />
          </div>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
