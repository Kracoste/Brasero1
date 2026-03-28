import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import ReassuranceBar from "@/components/ReassuranceBar";
import { FloatingCart } from "@/components/FloatingCart";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Commitments } from "@/components/Commitments";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { AuthProvider } from "@/lib/auth-context";
import { AnalyticsProvider } from "@/lib/analytics-context";
import { getSiteSettings } from "@/lib/site-settings";

type SiteLayoutProps = {
  children: ReactNode;
};

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const settings = await getSiteSettings();

  return (
    <AuthProvider>
      <AnalyticsProvider>
        <CartProvider>
          <FavoritesProvider>
            <div className="flex min-h-screen flex-col text-slate-900 overflow-x-hidden">
              <ReassuranceBar />
              <Header />
              <main className="flex-1 overflow-x-hidden">{children}</main>
              <Commitments />
              <Footer storeName={settings.storeName} atelierCity={settings.atelier.city} />
              <FloatingCart />
              <ExitIntentPopup />
              <WhatsAppButton />
            </div>
          </FavoritesProvider>
        </CartProvider>
      </AnalyticsProvider>
    </AuthProvider>
  );
}
