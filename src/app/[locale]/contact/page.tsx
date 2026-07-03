import { getStrapiData } from "@/utils/strapi";
import { ContactView } from "@/views/ContactView/ContactView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";
import contactPageFrTranslation from "@/views/ContactView/contactPageFrTranslation";

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

    const strapiData = await getStrapiData('get-contact-page-data', locale)

    // For fr locale, merge hardcoded French text with Strapi data.
    // Strapi fields always win so real data (phone, address, map) is never overridden.
    let data = strapiData
    if (locale === 'fr') {
      const fr = contactPageFrTranslation
      data = {
        ...strapiData,
        ...fr,
        contactForm: { ...strapiData?.contactForm, ...fr.contactForm },
        getInTouchBlock: { ...strapiData?.getInTouchBlock, ...fr.getInTouchBlock },
      }
    }

    return (
      <ContactView data={data} />
    );
  } 