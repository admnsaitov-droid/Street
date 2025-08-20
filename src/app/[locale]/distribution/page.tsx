import { createMetadataGenerator } from "@/utils/createMetadataGenerator";
import { getStrapiData } from "@/utils/strapi";
import { DistributionView } from "@/views/DistributionView/DistributionView";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale) => {
      const data = await getStrapiData('get-distribution-page-data', locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure
      return data?.distributionPage?.metadata;
    },
    getPath: (locale) => `/${locale}/distribution`,
    fallback: {
      title: 'Distribution',
      description: 'Distribution'
    }
});
  
export default async function DistributionPage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    const data = await getStrapiData('get-distribution-page-data', locale)

    return (
        <DistributionView data={data} />
    );
  } 