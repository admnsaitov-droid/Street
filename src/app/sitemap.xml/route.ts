import { getLocaleCodes } from '@/utils/locales'
import {
  buildSitemapIndex,
  fetchArticles,
  fetchLines,
  fetchPackages,
  fetchStaticPageDates,
  maxOverItems,
  XML_HEADERS,
} from '@/utils/sitemap'

// Sitemap index. Splits the site into a "pages" sitemap (static pages, lines,
// articles, packages) and a large, rarely-changing "products" sitemap so Google
// can re-crawl each independently.
// Rendered per request from cached, tagged data: an ISR `revalidate` here would
// ignore the publish webhook (Next 14.2 never tag-invalidates a cached route
// handler). See the caching note in src/utils/sitemap.ts and ADR-0117.
export const dynamic = 'force-dynamic'

export async function GET() {
  const locales = await getLocaleCodes()
  const [pageDates, lines, articles, packages] = await Promise.all([
    fetchStaticPageDates(locales),
    fetchLines(locales),
    fetchArticles(locales),
    fetchPackages(locales),
  ])

  // Child <lastmod> = newest entity inside each child sitemap, so Google skips
  // re-crawling a child that hasn't actually changed.
  const pagesLastmod = maxOverItems(
    ...Array.from(pageDates.values()),
    lines.pageUpdatedAt,
    ...lines.lines.map((line) => line.dates),
    articles.pageUpdatedAt,
    ...articles.articles.map((article) => article.dates),
    packages.pageUpdatedAt,
    ...packages.packages.map((pkg) => pkg.dates),
  )
  const productsLastmod = maxOverItems(...lines.products.map((product) => product.dates))

  const xml = buildSitemapIndex([
    { path: '/sitemap-pages.xml', lastModified: pagesLastmod },
    { path: '/sitemap-products.xml', lastModified: productsLastmod },
  ])

  return new Response(xml, { headers: XML_HEADERS })
}
