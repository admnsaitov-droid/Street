import { getStrapiData } from "@/utils/strapi";
import PrivacyPolicyView from "@/views/PrivacyPolicyView/PrivacyPolicyView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale) => {
      const data = await getStrapiData('get-privacy-policy-page-data', locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure
      return data?.privacyPolicyPage?.content?.metadata;
    },
    getPath: (locale) => `/${locale}/privacy-policy`,
    fallback: {
      title: 'Privacy Policy',
      description: 'Privacy Policy'
    }
});

export default async function PrivacyPolicyPage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    const data = await getStrapiData('get-privacy-policy-page-data', locale)

    return (
      <PrivacyPolicyView data={data?.privacyPolicyPage?.content} />
    );
  } 