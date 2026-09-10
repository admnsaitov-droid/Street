import { getLocaleCodes } from '@/utils/locales'
import {
  buildUrlset,
  fetchArticles,
  fetchLines,
  fetchPackages,
  UrlEntry,
  XML_HEADERS,
} from '@/utils/sitemap'

// "Pages" sitemap: static pages + line, article and package detail pages.
// Products live in their own sitemap (sitemap-products.xml).
export const revalidate = 3600

// Purely static marketing/legal pages. They have no Strapi update date, so we
// deliberately omit <lastmod> rather than emit the generation time (which would
// tell Google every page changed on every rebuild).
const STATIC_PAGES: { path: string; priority: number; changeFrequency: UrlEntry['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projects', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/distribution', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-use', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookie-policy', priority: 0.3, changeFrequency: 'yearly' },
]

export async function GET() {
  const [locales, lines, articles, packages] = await Promise.all([
    getLocaleCodes(),
    fetchLines(),
    fetchArticles(),
    fetchPackages(),
  ])

  const entries: UrlEntry[] = []

  for (const locale of locales) {
    for (const page of STATIC_PAGES) {
      entries.push({
        path: `/${locale}${page.path}`,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    }

    // Content index pages carry the real update date of their single-type.
    entries.push({
      path: `/${locale}/lines`,
      lastModified: lines.pageUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    })
    entries.push({
      path: `/${locale}/articles`,
      lastModified: articles.pageUpdatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
    entries.push({
      path: `/${locale}/packages`,
      lastModified: packages.pageUpdatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    })

    for (const line of lines.lines) {
      entries.push({
        path: `/${locale}/lines/${line.slug}`,
        lastModified: line.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }

    for (const article of articles.articles) {
      entries.push({
        path: `/${locale}/articles/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }

    for (const pkg of packages.packages) {
      entries.push({
        path: `/${locale}/packages/${pkg.slug}`,
        lastModified: pkg.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return new Response(buildUrlset(entries), { headers: XML_HEADERS })
}
