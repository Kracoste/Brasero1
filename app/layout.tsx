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

const baseUrl = new URL("https://www.atelier-lbf.fr");

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
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google Translate */}
        <script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" defer />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'fr',
                  includedLanguages: 'fr,en,de,es,nl',
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W8ZKW7WD');`,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} antialiased`}>
        {/* Google Translate element (hidden) — wrapper suppresses hydration mismatch caused by GT injecting nodes */}
        <div suppressHydrationWarning>
          <div id="google_translate_element" style={{ display: 'none' }} />
        </div>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W8ZKW7WD"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
