import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { Golos_Text } from "next/font/google";
import localFont from "next/font/local";

import GlobalStyles, { SmartCSSGrid } from "@/styles";

import { Lvh } from "@/hooks/useLvh";
import { generateMetadata } from "@/utils/generateMetadata";

// import { AnimatedRouterLayout } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { StyledComponentsLayout } from "@/layouts/StyledComponentsLayout";
import { AssetsLoaderLayout } from "@/layouts/AssetsLoaderLayout/AssetsLoaderLayout";
import { CanvasLayout } from "@/layouts/CanvasLayout/CanvasLayout";
import { Cookie } from "@/components/Cookie";
import { ScrollLayout } from "@/layouts/ScrollLayout/ScrollLayout";
import { AnimatedRouterLayout } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { Header } from "@/components/Header/Header";
import { getLocaleCodes } from "@/utils/locales";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { DynamicScrollRevealWrapper } from "@/components/ScrollRevealWrapper/DynamicScrollRevealWrapper";
import { Footer } from "@/components/Footer/Footer";
import { SuccessModal } from "@/components/Modals/SuccessModal/SuccessModal";
import { ErrorModal } from "@/components/Modals/ErrorModal/ErrorModal";
import { FullScreenPlayer } from "@/components/FullScreenPlayer/FullScreenPlayer";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
});

const golosText = Golos_Text({
  subsets: ["latin"],
  variable: "--font-golos-text",
});

const sageGrotesk = localFont({
    src: '../../../public/fonts/Sage-Grotesk.woff2',
    variable: "--font-sage-grotesk",
  });

export const metadata: Metadata = generateMetadata({});

// Generate static params for all supported locales
export async function generateStaticParams() {
  const locales = await getLocaleCodes();
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${onest.variable} ${golosText.variable} ${sageGrotesk.variable}`} style={{ opacity: 0 }}>
          <NextIntlClientProvider messages={messages}>
            <StyledComponentsLayout>
              <ScrollLayout>
                <SmartCSSGrid />
                <Lvh />
                <GlobalStyles />
                <AssetsLoaderLayout>
                  <Cookie />
                  <AnimatedRouterLayout>
                    <Header />
                    <SuccessModal />
                    <ErrorModal />
                    <FullScreenPlayer />
                    {/* canvas layout */}
                    <DynamicScrollRevealWrapper>
                        {children}
                        <ContactForm />
                    </DynamicScrollRevealWrapper>
                    <Footer />
                  </AnimatedRouterLayout>
                </AssetsLoaderLayout>
              </ScrollLayout>
            </StyledComponentsLayout>
          </NextIntlClientProvider>
      </body>
    </html>
  );
}
