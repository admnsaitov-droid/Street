import { getLocaleCodes } from '@/utils/locales'
import {
  buildUrlset,
  fetchArticles,
  fetchLines,
  fetchPackages,
  fetchStaticPageDates,
  pickDate,
  UrlEntry,
  XML_HEADERS,
} from '@/utils/sitemap'

// "Pages" sitemap: static pages + line, article and package detail pages.
// Products live in their own sitemap (sitemap-products.xml).
export const revalidate = 600

// Priorities/changefreq for the static single-type pages. Their <lastmod>
// comes from the single-type's own updatedAt (per locale), so publishing an
// edit in Strapi moves the date within the revalidation window (10 min).
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
  const locales = await getLocaleCodes()
  const [pageDates, lines, articles, packages] = await Promise.all([
    fetchStaticPageDates(locales),
    fetchLines(locales),
    fetchArticles(locales),
    fetchPackages(locales),
  ])

  const entries: UrlEntry[] = []

  for (const locale of locales) {
    for (const page of STATIC_PAGES) {
      entries.push({
        path: `/${locale}${page.path}`,
        lastModified: pickDate(pageDates.get(page.path), locale),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    }

    // Content index pages carry the real update date of their single-type.
    entries.push({
      path: `/${locale}/lines`,
      lastModified: pickDate(lines.pageUpdatedAt, locale),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
    entries.push({
      path: `/${locale}/articles`,
      lastModified: pickDate(articles.pageUpdatedAt, locale),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
    entries.push({
      path: `/${locale}/packages`,
      lastModified: pickDate(packages.pageUpdatedAt, locale),
      changeFrequency: 'monthly',
      priority: 0.8,
    })

    for (const line of lines.lines) {
      entries.push({
        path: `/${locale}/lines/${line.slug}`,
        lastModified: pickDate(line.dates, locale),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }

    for (const article of articles.articles) {
      entries.push({
        path: `/${locale}/articles/${article.slug}`,
        lastModified: pickDate(article.dates, locale),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }

    for (const pkg of packages.packages) {
      entries.push({
        path: `/${locale}/packages/${pkg.slug}`,
        lastModified: pickDate(pkg.dates, locale),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return new Response(buildUrlset(entries), { headers: XML_HEADERS })
}
