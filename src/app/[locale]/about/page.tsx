import { getStrapiData } from "@/utils/strapi";
import { AboutView } from "@/views/AboutView/AboutView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({
  getMetadata: async (locale) => {
    const data = await getStrapiData('get-about', locale);
    return data;
  },
  transformData: (data) => {
    // Extract metadata from the specific path in your data structure
    return data?.aboutPage?.metadata;
  },
  getPath: (locale) => `/${locale}/about`,
  fallback: {
    title: 'About Us | Street Barbell',
    description: 'Learn more about us'
  }
});

export default async function AboutPage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    const data = await getStrapiData('get-about', locale)

    return (
        <AboutView data={data} />
    );
  } 