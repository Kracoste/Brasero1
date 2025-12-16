import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display-variable",
});

const baseUrl = new URL("https://brasero-atelier.fr");

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const titleBase = `${settings.storeName} — Braséros premium Made in France`;

  return {
    metadataBase: baseUrl,
    title: {
      template: `%s | ${settings.storeName}`,
      default: titleBase,
    },
    description: `${settings.storeName} fabrique vos braséros à ${settings.storeAddress}.`,
    alternates: {
      canonical: baseUrl.href,
    },
    keywords: [
      "brasero corten",
      "brasero français",
      "atelier Moncoutant",
      "plancha extérieure",
      "fendeur à bûches",
    ],
    openGraph: {
      title: `${settings.storeName} — Fabriqué à ${settings.atelier.city} (79)`,
      description: `${settings.storeName} fabrique vos braséros à ${settings.storeAddress}.`,
      url: baseUrl.href,
      siteName: settings.storeName,
      images: [
        {
          url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: settings.storeName,
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.storeName,
      description: `${settings.storeName} fabrique vos braséros à ${settings.storeAddress}.`,
      images: [
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.storeName,
    url: baseUrl.href,
    email: settings.storeEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.storeAddress,
      addressLocality: settings.atelier.city,
      postalCode: "79320",
      addressCountry: "FR",
    },
  };

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <SiteSettingsProvider value={settings}>
          {children}
          <Analytics />
          <SpeedInsights />
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
