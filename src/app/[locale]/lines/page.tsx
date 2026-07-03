import { getStrapiData } from "@/utils/strapi";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";
import { LinesView } from "@/views/LinesView/LinesView";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale: string) => {
      const data = await getStrapiData('get-lines', locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure

      const metadata = {
        metatitle: data?.linesPageData?.metatitle || data?.linesPageData?.title,
        metadescription: data?.linesPageData?.metadescription || data?.linesPageData?.description,
        openGraph: {
          url: getMediaStrapiPath(data?.linesPageData?.mainMedia?.poster)
        }
      }

      return metadata;
    },
    getPath: (locale: string): string => `/${locale}/lines`,
    fallback: {
      title: 'Line',
      description: 'Line'
    }
});

export default async function LinesPage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    // Fetch specific package data using both slug and subParam
    const data = await getStrapiData('get-lines', locale)
    
    return (
        <LinesView data={data?.linesPageData}/>
    );
  } 