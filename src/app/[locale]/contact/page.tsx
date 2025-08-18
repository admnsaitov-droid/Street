import { getStrapiData } from "@/utils/strapi";
import { ContactView } from "@/views/ContactView/ContactView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale) => {
      const data = await getStrapiData('get-contact-page-data', locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure
      return data?.metadata;
    },
    getPath: (locale) => `/${locale}/contact`,
    fallback: {
      title: 'Contact Us',
      description: 'Contact us'
    }
  });
  

export default async function ContactPage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    const data = await getStrapiData('get-contact-page-data', locale)

    return (
      <ContactView data={data} />
    );
  } 