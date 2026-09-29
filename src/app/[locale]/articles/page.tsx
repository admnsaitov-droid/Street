import { getStrapiData } from "@/utils/strapi";
import { ArticlesView } from "@/views/ArticlesView/ArticlesView";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale: string) => {
      const data = await getStrapiData('get-news-page-data', locale);
      return data;
    },
    // SEO fields live in the `metadata` component, not on the page itself
    // (newsPage only carries `Title`).
    transformData: (data) => ({
      metatitle: data?.newsPage?.metadata?.metatitle || data?.newsPage?.Title,
      metadescription: data?.newsPage?.metadata?.metadescription,
      metakeywords: data?.newsPage?.metadata?.metakeywords,
      openGraph: data?.newsPage?.metadata?.openGraph,
    }),
    getPath: (locale: string) => `/${locale}/articles`,
    fallback: {
      title: 'News & Articles | Street Barbell',
      description: 'Latest news, training tips and articles from Street Barbell.',
    },
});

export default async function ArticlesPage({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;

    const data = await getStrapiData('get-articles', locale)
    const pageData = await getStrapiData('get-news-page-data', locale)

    return (
        <ArticlesView data={data} pageData={pageData?.newsPage} />
    );
  } 