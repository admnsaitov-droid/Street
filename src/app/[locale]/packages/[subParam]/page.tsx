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
      // SEO fields live in the package's `metadata` component;
      // hero.title/mainDescription are the on-page copy, kept only as fallback.
      const meta = data?.package?.metadata;

      const metadata = {
        metatitle: meta?.metatitle || data?.package?.hero?.title,
        metadescription: meta?.metadescription || data?.package?.mainDescription,
        metakeywords: meta?.metakeywords,
        openGraph: meta?.openGraph?.url
          ? meta.openGraph
          : { url: getMediaStrapiPath(data?.package?.mainMediaLeft?.poster) }
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