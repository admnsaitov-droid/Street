import { getStrapiData } from "@/utils/strapi";
import { ProductView } from "@/views/ProductView/ProductView";
import { getMediaStrapiPath } from "@/utils/getMediaStrapiPath";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({
    getMetadata: async (locale: string, slug: string) => {
      const data = await getStrapiData('get-product-data?slug=' + slug, locale);
      return data;
    },
    transformData: (data) => {
      // Extract metadata from the specific path in your data structure

      const metadata = {
        metatitle: data?.product?.name,
        metadescription: data?.product?.previewDescription,
        openGraph: {
          url: getMediaStrapiPath(data?.product?.previewImage)
        }
      }

      return metadata;
    },
    getPath: (locale: string, slug: string): string => `/${locale}/products/${slug}`,
    fallback: {
      title: 'Product',
      description: 'Product'
    }
});

export default async function ProductDetailPage({
    params,
  }: {
    params: Promise<{ locale: string; slug: string }>;
  }) {
    const { locale, slug } = await params;

    const [data, specResponse] = await Promise.all([
      getStrapiData('get-product-data?slug=' + slug, locale),
      getStrapiData('get-product-specifications', locale),
    ]);

    const specificationTexts = specResponse?.data ?? null;

    return (
      <ProductView data={data} specificationTexts={specificationTexts} />
    );
  } 