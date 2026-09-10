import {
  buildSitemapIndex,
  fetchArticles,
  fetchLines,
  fetchPackages,
  maxDate,
  XML_HEADERS,
} from '@/utils/sitemap'

// Sitemap index. Splits the site into a "pages" sitemap (static pages, lines,
// articles, packages) and a large, rarely-changing "products" sitemap so Google
// can re-crawl each independently.
export const revalidate = 3600

export async function GET() {
  const [lines, articles, packages] = await Promise.all([
    fetchLines(),
    fetchArticles(),
    fetchPackages(),
  ])

  // Child <lastmod> = newest entity inside each child sitemap, so Google skips
  // re-crawling a child that hasn't actually changed.
  const pagesLastmod = maxDate(
    lines.pageUpdatedAt,
    ...lines.lines.map((line) => line.updatedAt),
    articles.pageUpdatedAt,
    packages.pageUpdatedAt,
    ...packages.packages.map((pkg) => pkg.updatedAt),
  )
  const productsLastmod = maxDate(...lines.products.map((product) => product.updatedAt))

  const xml = buildSitemapIndex([
    { path: '/sitemap-pages.xml', lastModified: pagesLastmod },
    { path: '/sitemap-products.xml', lastModified: productsLastmod },
  ])

  return new Response(xml, { headers: XML_HEADERS })
}
