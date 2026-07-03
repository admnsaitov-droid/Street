import type { Metadata } from "next";

import GlobalStyles, { SmartCSSGrid } from "@/styles";

import { Lvh } from "@/hooks/useLvh";
import { generateMetadata } from "@/utils/generateMetadata";

// import { AnimatedRouterLayout } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { StyledComponentsLayout } from "@/layouts/StyledComponentsLayout";
import { AssetsLoaderLayout } from "@/layouts/AssetsLoaderLayout/AssetsLoaderLayout";
import { Cookie } from "@/components/Cookie";
import { ScrollLayout } from "@/layouts/ScrollLayout/ScrollLayout";
import { AnimatedRouterLayout } from "@/layouts/AnimatedRouterLayout/AnimatedRouterLayout";
import { Header } from "@/components/Header/Header";
import { getLocaleCodes } from "@/utils/locales";
import { getStrapiData } from "@/utils/strapi";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { DynamicScrollRevealWrapper } from "@/components/ScrollRevealWrapper/DynamicScrollRevealWrapper";
import { Footer } from "@/components/Footer/Footer";
import { SuccessModal } from "@/components/Modals/SuccessModal/SuccessModal";
import { ErrorModal } from "@/components/Modals/ErrorModal/ErrorModal";
import { FullScreenPlayer } from "@/components/FullScreenPlayer/FullScreenPlayer";
import { FadeContainer } from "@/components/Header/MegaMenus/FadeContainer";
import { StructuredData } from "@/components/StructuredData";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/utils/generateStructuredData";

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

  const [headerData, footerData] = await Promise.all([
    getStrapiData('get-header-data', locale),
    getStrapiData('get-footer-data', locale),
  ]);
  
  // Generate structured data for the site with error handling
  let organizationSchema = null;
  let websiteSchema = null;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com';
    const contactPhone = footerData?.data?.companyData?.phone;
    const contactEmail = footerData?.data?.companyData?.mail;
    organizationSchema = generateOrganizationSchema({
      name: 'Street Barbell',
      url: baseUrl,
      logo: `${baseUrl}/open-graph.png`,
      description: 'Street Barbell is a barbell brand that makes high-quality barbell products.',
      sameAs: [
        // Add your social media URLs here
        // 'https://www.facebook.com/streetbarbell',
        // 'https://www.instagram.com/streetbarbell',
        // 'https://twitter.com/streetbarbell'
      ],
      ...(contactPhone || contactEmail ? {
        contactPoint: {
          telephone: contactPhone,
          email: contactEmail,
          contactType: 'customer service',
        }
      } : {}),
    });
    
    websiteSchema = generateWebSiteSchema({
      name: 'Street Barbell',
      url: baseUrl,
      description: 'Street Barbell is a barbell brand that makes high-quality barbell products.',
    });
  } catch (error) {
    console.error('Error generating structured data:', error);
  }

  // Filter out null schemas
  const schemas = [organizationSchema, websiteSchema].filter(Boolean);

  return (
    <>
      {schemas.length > 0 && <StructuredData schemas={schemas} />}
      <NextIntlClientProvider messages={messages}>
            <StyledComponentsLayout>
              <ScrollLayout>
                <SmartCSSGrid />
                <Lvh />
                <GlobalStyles />
                <AssetsLoaderLayout>
                  <Cookie />
                  <AnimatedRouterLayout>
                    <Header initialData={headerData} />
                    <FadeContainer />
                    <SuccessModal />
                    <ErrorModal />
                    <FullScreenPlayer />
                    <main>
                    <DynamicScrollRevealWrapper>
                        {children}
                        <ContactForm />
                    </DynamicScrollRevealWrapper>
                    </main>
                    <Footer initialData={footerData?.data} />
                  </AnimatedRouterLayout>
                </AssetsLoaderLayout>
              </ScrollLayout>
            </StyledComponentsLayout>
          </NextIntlClientProvider>
    </>
  );
}
