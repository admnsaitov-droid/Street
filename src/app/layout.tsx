import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { Golos_Text } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { HtmlLangSetter } from "@/components/HtmlLangSetter";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: 'swap',
});

const golosText = Golos_Text({
  subsets: ["latin"],
  variable: "--font-golos-text",
  display: 'swap',
});

const sageGrotesk = localFont({
    src: '../../public/fonts/Sage-Grotesk.woff2',
    variable: "--font-sage-grotesk",
    display: 'swap',
  });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="gtm-script" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
          `}</Script>
        )}
        {/*
          No Draco prefetch here. The decoder used to come from gstatic.com, so
          warming that cross-origin connection early was worth ~750KB on every
          route. It now ships from this project's own origin (public/draco/,
          ADR-0108), so a prefetch in the root layout would only pull it down on
          the nine page types that carry no 3D scene at all. The four that do
          fetch it same-origin, on an already-warm connection, while the loader
          curtain is up.
        */}
      </head>
      <body className={`${onest.variable} ${golosText.variable} ${sageGrotesk.variable}`} style={{ margin: 0, padding: 0 }}>
        <noscript>
          {process.env.NEXT_PUBLIC_GTM_ID && (
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
          )}
        </noscript>
        <HtmlLangSetter />
        {children}
      </body>
    </html>
  );
}
