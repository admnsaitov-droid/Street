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
      // SEO fields live in the `metadata` component; the page's own
      // title/description are the on-page copy, kept only as fallback.
      const meta = data?.linesPageData?.metadata;

      const metadata = {
        metatitle: meta?.metatitle || data?.linesPageData?.title,
        metadescription: meta?.metadescription || data?.linesPageData?.description,
        metakeywords: meta?.metakeywords,
        openGraph: meta?.openGraph?.url
          ? meta.openGraph
          : { url: getMediaStrapiPath(data?.linesPageData?.mainMedia?.poster) }
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