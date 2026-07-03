import { getStrapiData } from "@/utils/strapi";
import TermsOfUseView from "@/views/TermsOfUseView/TermsOfUseView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale) => {
      const data = await getStrapiData('get-terms-of-use-page-data', locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure
      return data?.termsOfUsePage?.content?.metadata;
    },
    getPath: (locale) => `/${locale}/terms-of-use`,
    fallback: {
      title: 'Terms of Use',
      description: 'Terms of Use'
    }
});

export default async function TermsOfUsePage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    const data = await getStrapiData('get-terms-of-use-page-data', locale)

    return (
      <TermsOfUseView data={data?.termsOfUsePage?.content} />
    );
  } 