import { getStrapiData } from "@/utils/strapi";
import { LineView } from "@/views/LineView/LineView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale: string, slug: string) => {
      const data = await getStrapiData('get-line-data?slug=' + slug, locale);
      return data;
    },
    transformData: (data) => {
      // SEO fields live in the line's `metadata` component; name/description
      // are the on-page copy, kept only as fallback.
      const meta = data?.line?.metadata;

      const metadata = {
        metatitle: meta?.metatitle || data?.line?.name,
        metadescription: meta?.metadescription || data?.line?.description,
        metakeywords: meta?.metakeywords,
        openGraph: meta?.openGraph?.url
          ? meta.openGraph
          : { url: getMediaStrapiPath(data?.line?.mainMedia?.poster) }
      }

      return metadata;
    },
    getPath: (locale: string, slug: string): string => `/${locale}/lines/${slug}`,
    fallback: {
      title: 'Line',
      description: 'Line'
    }
});

export default async function LineDetailPage({
    params,
  }: {
    params: Promise<{ locale: string; slug: string }>;
  }) {
    const { locale, slug } = await params;

    // Fetch specific package data using both slug and subParam
    const data = await getStrapiData('get-line-data?slug=' + slug, locale)
  
    return (
      <LineView data={data} />
    );
  } 