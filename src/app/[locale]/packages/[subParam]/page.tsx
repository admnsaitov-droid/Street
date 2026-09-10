import { getStrapiData } from "@/utils/strapi";
import { PackageView } from "@/views/PackageView/PackageView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale: string, subParam: string) => {
      const data = await getStrapiData('get-package-data?slug=' + subParam, locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure

      // Prefer an explicitly set OG image, otherwise fall back to the package media.
      // Select the media object before resolving the path, since getMediaStrapiPath
      // returns a truthy placeholder for empty media (which would break a path-level ||).
      const ogMedia = data?.package?.metadata?.openGraph || data?.package?.mainMediaLeft?.poster;

      const metadata = {
        metatitle: data?.package?.metadata?.metatitle || data?.package?.hero?.title,
        metadescription: data?.package?.metadata?.metadescription || data?.package?.mainDescription,
        metakeywords: data?.package?.metadata?.metakeywords,
        openGraph: {
          url: getMediaStrapiPath(ogMedia)
        }
      }

      return metadata;
    },
    getPath: (locale: string, subParam: string): string => `/${locale}/packages/${subParam}`,
    fallback: {
      title: 'Package',
      description: 'Package'
    }
});

export default async function PackageDetailPage({
    params,
  }: {
    params: Promise<{ locale: string; subParam: string }>;
  }) {
    const { locale, subParam } = await params;

    // Fetch specific package data using both slug and subParam
    const data = await getStrapiData('get-package-data?slug=' + subParam, locale)
  
    return (
      <PackageView data={data} />
    );
  } 