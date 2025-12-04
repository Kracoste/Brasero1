import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import { siteConfig } from "@/lib/site";

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

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    template: "%s | Brasero Atelier",
    default: "Brasero Atelier — Braséros premium Made in France",
  },
  description: siteConfig.description,
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
    title: "Brasero Atelier — Fabriqué à Moncoutant (79)",
    description: siteConfig.description,
    url: baseUrl.href,
    siteName: "Brasero Atelier",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Brasero Atelier",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brasero Atelier",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "Moncoutant",
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
