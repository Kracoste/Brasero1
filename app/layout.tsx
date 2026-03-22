import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a1a1a",
};

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
          url: `${baseUrl.href}Produits/og-brasero.webp`,
          width: 1200,
          height: 630,
          alt: `Brasero plancha artisanal en acier corten avec range-bûches — ${settings.storeName}`,
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
        `${baseUrl.href}Produits/og-brasero.webp`,
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
        {/* Critical: Block Google Translate banner BEFORE it renders */}
        <style dangerouslySetInnerHTML={{ __html: `
          .goog-te-banner-frame, iframe.goog-te-banner-frame,
          #goog-gt-tt, .goog-te-balloon-frame,
          .VIpgJd-ZVi9od-ORHb-OEVmcd, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf,
          .VIpgJd-ZVi9od-SmfZ-hSRGPd, .VIpgJd-ZVi9od-xl07Ob-lTBxed,
          div.skiptranslate, body > .skiptranslate {
            display:none!important; height:0!important; max-height:0!important; width:0!important;
            overflow:hidden!important; visibility:hidden!important; opacity:0!important;
            border:0!important; margin:0!important; padding:0!important;
            position:fixed!important; left:-9999px!important; top:-9999px!important;
            z-index:-1!important; pointer-events:none!important;
          }
          body { top:0!important; bottom:auto!important; position:static!important; margin-top:0!important; padding-top:0!important; margin-bottom:0!important; padding-bottom:0!important; }
          html { margin-top:0!important; padding-top:0!important; margin-bottom:0!important; padding-bottom:0!important; }
          html.translated-ltr, html.translated-rtl { margin-top:0!important; overflow:visible!important; }
          html.translated-ltr body, html.translated-rtl body { top:0!important; position:static!important; }
        `}} />
        {/* Google Tag Manager - must load immediately on every page */}
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W8ZKW7WD');` }} />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${displayFont.variable} antialiased`}>
        {/* GT container — hidden off-screen */}
        <div id="google_translate_element" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }} />
        {/* Inline script: force body position and hide GT bars (top & bottom) */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){
          function fix(){
            var b=document.body.style,h=document.documentElement.style;
            b.setProperty('top','0','important');
            b.setProperty('bottom','auto','important');
            b.setProperty('position','static','important');
            b.setProperty('margin-top','0','important');
            b.setProperty('margin-bottom','0','important');
            b.setProperty('padding-bottom','0','important');
            h.setProperty('margin-top','0','important');
            h.setProperty('margin-bottom','0','important');
            var sels='.goog-te-banner-frame,iframe.goog-te-banner-frame,div.skiptranslate,body>.skiptranslate,#goog-gt-tt,.goog-te-balloon-frame,[class*=VIpgJd-ZVi9od]';
            document.querySelectorAll(sels).forEach(function(e){
              e.style.setProperty('display','none','important');
              e.style.setProperty('height','0','important');
              e.style.setProperty('width','0','important');
              e.style.setProperty('visibility','hidden','important');
              e.style.setProperty('position','fixed','important');
              e.style.setProperty('left','-9999px','important');
              e.style.setProperty('top','-9999px','important');
              e.style.setProperty('z-index','-1','important');
            });
          }
          fix();
          new MutationObserver(fix).observe(document.body,{attributes:true,attributeFilter:['style'],childList:true});
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
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
