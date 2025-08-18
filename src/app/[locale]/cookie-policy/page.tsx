import { getStrapiData } from "@/utils/strapi";
import CookiePolicyView from "@/views/CookiePolicyView/CookiePolicyView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale) => {
      const data = await getStrapiData('get-cookie-policy-page-data', locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure
      return data?.cookiePolicyPage?.content?.metadata;
    },
    getPath: (locale) => `/${locale}/cookie-policy`,
    fallback: {
      title: 'Cookie Policy',
      description: 'Cookie Policy'
    }
});

export default async function CookiePolicyPage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    const data = await getStrapiData('get-cookie-policy-page-data', locale)

    console.log(data)

    return (
      <CookiePolicyView data={data?.cookiePolicyPage?.content} />
    );
  } 