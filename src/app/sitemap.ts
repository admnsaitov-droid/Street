import { MetadataRoute } from 'next'
import { getLocaleCodes } from '@/utils/locales'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'
  const locales = await getLocaleCodes()
  
  // Static pages that exist for all locales
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/products',
    '/packages',
    '/lines',
    '/projects',
    '/distribution',
    '/articles',
    '/privacy-policy',
    '/terms-of-use',
    '/cookie-policy'
  ]
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Generate entries for each locale and page combination
  for (const locale of locales) {
    for (const page of staticPages) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8, // Home page gets highest priority
      })
    }
  }
  
  // TODO: Add dynamic pages from Strapi (articles, products, packages, etc.)
  // This would require fetching data from your Strapi API
  // Example:
  // const articles = await getStrapiData('get-articles-sitemap', 'en')
  // for (const article of articles) {
  //   for (const locale of locales) {
  //     sitemapEntries.push({
  //       url: `${baseUrl}/${locale}/articles/${article.slug}`,
  //       lastModified: new Date(article.updatedAt),
  //       changeFrequency: 'monthly',
  //       priority: 0.6,
  //     })
  //   }
  // }
  
  return sitemapEntries
}
