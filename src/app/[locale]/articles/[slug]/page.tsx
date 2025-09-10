import { getStrapiData } from "@/utils/strapi";
import { ArticleView } from "@/views/ArticleView/ArticleView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale: string, slug: string) => {
      const data = await getStrapiData('get-article?slug=' + slug, locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure

      const metadata = {
        metatitle: data?.article?.title,
        metadescription: data?.article?.title,
        openGraph: {
          url: getMediaStrapiPath(data?.article?.mainMedia?.poster)
        }
      }

      return metadata;
    },
    getPath: (locale: string, slug: string): string => `/${locale}/articles/${slug}`,
    fallback: {
      title: 'Article',
      description: 'Article'
    }
});

export default async function LineDetailPage({
    params,
  }: {
    params: Promise<{ locale: string; slug: string }>;
  }) {
    const { locale, slug } = await params;

    // Fetch specific package data using both slug and subParam
    const data = await getStrapiData('get-article?slug=' + slug, locale)
  
    return (
      <ArticleView data={data?.article} />
    );
  } 