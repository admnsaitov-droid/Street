/**
 * @fileoverview Home page with locale-aware metadata generation
 * 
 * This page demonstrates how to generate metadata that includes the locale in the URL.
 * The generateMetadata function receives the same params as the page component,
 * allowing you to construct URLs that match the actual page paths.
 * 
 * Key features:
 * - Locale-aware URL construction (e.g., /en/home, /es/home)
 * - Dynamic metadata fetching from Strapi
 * - Proper OpenGraph locale formatting
 * - Error handling with fallbacks
 */

import { HomeView } from "@/views/HomeView/HomeView";
import { getStrapiData } from "@/utils/strapi";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({
  getMetadata: async (locale) => {
    const homeData = await getStrapiData('get-home-data', locale);
    return homeData;
  },
  getPath: (locale) => `/${locale}`,
  fallback: {
    title: 'Street Barbell - Home',
    description: 'Street Barbell is a barbell brand that makes high-quality barbell products.'
  }
});

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch data with graceful fallback
  const homeData = await getStrapiData('get-home-data', locale);
  
  // Provide fallback data structure if Strapi is unavailable
  const fallbackHomeData = homeData || {
    hero: null,
    achievements: null,
    packages: null,
    benefits: null,
    about: null,
    globe: null,
    latestNews: null,
    linesBlock: null
  };

  return <HomeView homeData={fallbackHomeData} footerData={{}} />;
}
