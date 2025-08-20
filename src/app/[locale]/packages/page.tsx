import { getStrapiData } from "@/utils/strapi";
import { PackagesView } from "@/views/PackagesView/PackagesView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale) => {
      const data = await getStrapiData('get-packages-data', locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure
      return data?.metadata;
    },
    getPath: (locale) => `/${locale}/packages`,
    fallback: {
      title: 'Packages',
      description: 'Packages'
    }
});

export default async function PackagesPage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    const data = await getStrapiData('get-packages-data', locale)
  
    return (
      <PackagesView data={data} />
    );
  } 