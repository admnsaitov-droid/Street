import { getStrapiData } from "@/utils/strapi";
import { ArticleView } from "@/views/ArticleView/ArticleView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";
import { generateArticleSchema } from "@/utils/generateStructuredData";
import { StructuredData } from "@/components/StructuredData";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale: string, slug: string) => {
      const data = await getStrapiData('get-article?slug=' + slug, locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure

      const metadata = {
        metatitle: data?.article?.title,
        metadescription: data?.article?.description || data?.article?.title,
        openGraph: {
          url: getMediaStrapiPath(data?.article?.mainMedia?.poster)
        }
      }

      return metadata;
    },
    getPath: (locale: string, slug: string): string => `/${locale}/articles/${slug}`,
    ogType: 'article',
    fallback: {
      title: 'Article | Street Barbell',
      description: 'Read the latest articles, training tips and news from Street Barbell.'
    }
});

export default async function LineDetailPage({
    params,
  }: {
    params: Promise<{ locale: string; slug: string }>;
  }) {
    const { locale, slug } = await params;

    const data = await getStrapiData('get-article?slug=' + slug, locale);
    const article = data?.article;

    const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com';
    const articleSchema = article ? generateArticleSchema({
      headline: article.title,
      description: article.description || article.title,
      url: `${baseUrl}/${locale}/articles/${slug}`,
      datePublished: article.date || article.createdAt || new Date().toISOString(),
      dateModified: article.updatedAt,
      author: article.author?.name ? { name: article.author.name, type: 'Person' } : { name: 'Street Barbell', type: 'Organization' },
      publisher: { name: 'Street Barbell', logo: `${baseUrl}/open-graph.png` },
      image: article.mainMedia?.poster ? [getMediaStrapiPath(article.mainMedia.poster)] : undefined,
    }) : null;

    return (
      <>
        {articleSchema && <StructuredData schemas={[articleSchema]} />}
        <ArticleView data={article} />
      </>
    );
  } 