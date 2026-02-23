import type { Metadata } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "@/styles/globals.css";

import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsProvider } from "@/components/SiteSettingsProvider";

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
        {/* Critical: Block Google Translate banner BEFORE it renders */}
        <style dangerouslySetInnerHTML={{ __html: `
          .goog-te-banner-frame, iframe.goog-te-banner-frame,
          .skiptranslate, body > .skiptranslate,
          #goog-gt-tt, .goog-te-balloon-frame, .goog-te-gadget {
            display:none!important; height:0!important; max-height:0!important;
            overflow:hidden!important; visibility:hidden!important;
            border:0!important; margin:0!important; padding:0!important;
            position:absolute!important; left:-9999px!important; top:-9999px!important;
          }
          body { top:0!important; position:static!important; margin-top:0!important; padding-top:0!important; }
          html { margin-top:0!important; padding-top:0!important; }
          html.translated-ltr, html.translated-rtl { margin-top:0!important; overflow:visible!important; }
          html.translated-ltr body, html.translated-rtl body { top:0!important; position:static!important; }
        `}} />
        {/* Google Translate — loaded via next/script for proper hydration */}
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
      <body suppressHydrationWarning className={`${geistSans.variable} ${displayFont.variable} antialiased`}>
        {/* GT container — hidden off-screen */}
        <div id="google_translate_element" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }} />
        {/* Inline script: force body.top=0 whenever GT tries to change it */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){
          function fix(){
            document.body.style.setProperty('top','0','important');
            document.body.style.setProperty('position','static','important');
            document.body.style.setProperty('margin-top','0','important');
            document.documentElement.style.setProperty('margin-top','0','important');
          }
          fix();
          new MutationObserver(fix).observe(document.body,{attributes:true,attributeFilter:['style']});
          new MutationObserver(fix).observe(document.documentElement,{attributes:true,attributeFilter:['style']});
        })();`}} />
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
        {/* Google Translate: callback then script, afterInteractive ensures client execution */}
        <Script id="gt-init" strategy="beforeInteractive">{`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'fr',
              includedLanguages: 'fr,en,de,es,nl',
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}</Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
