import { getStrapiData } from "@/utils/strapi";
import { ArticlesView } from "@/views/ArticlesView/ArticlesView";

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