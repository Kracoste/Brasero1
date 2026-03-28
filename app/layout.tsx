import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "@/styles/globals.css";

import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo/schemas";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
    description: `${settings.storeName} : braseros artisanaux en acier corten et acier, fabriqués à la main à ${settings.atelier.city} (${settings.atelier.department}). Fendeurs à bûches, planchas et accessoires. Livraison France. Garantie 2 ans.`,
    alternates: {
      canonical: baseUrl.href,
    },
    keywords: [
      "brasero artisanal",
      "brasero corten",
      "brasero français",
      "brasero made in France",
      "brasero acier",
      "brasero jardin",
      "brasero terrasse",
      "brasero extérieur",
      "plancha brasero",
      "fendeur à bûches",
      "atelier Moncoutant",
      "brasero Deux-Sèvres",
      "brasero Nouvelle-Aquitaine",
      settings.storeName,
    ],
    openGraph: {
      title: `${settings.storeName} — Braseros artisanaux fabriqués en France à ${settings.atelier.city}`,
      description: `Braseros artisanaux en acier corten, fendeurs à bûches et accessoires. Fabriqués à la main dans notre atelier de ${settings.atelier.city} (${settings.atelier.department}). Livraison France.`,
      url: baseUrl.href,
      siteName: settings.storeName,
      images: [
        {
          url: "https://www.atelier-lbf.fr/Produits/og-brasero.webp",
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
      title: `${settings.storeName} — Braseros artisanaux Made in France`,
      description: `Braseros artisanaux en acier corten, fendeurs à bûches et accessoires. Fabriqués à la main à ${settings.atelier.city}. Livraison France.`,
      images: [
        "https://www.atelier-lbf.fr/Produits/og-brasero.webp",
      ],
    },
    manifest: "/manifest.json",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const organizationSchema = generateOrganizationSchema(settings);
  const webSiteSchema = generateWebSiteSchema(settings);

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/Braserobanner.webp" as="image" type="image/webp" fetchPriority="high" />
        {/* Google Tag Manager - deferred to not block main thread */}
        <Script id="gtm-head" strategy="lazyOnload">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W8ZKW7WD');
        `}</Script>
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${displayFont.variable} antialiased`}>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
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
