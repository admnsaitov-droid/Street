import { getLocaleCodes } from '@/utils/locales'
import { buildUrlset, fetchLines, listedIn, pickDate, UrlEntry, XML_HEADERS } from '@/utils/sitemap'

// Dedicated products sitemap. It is large (all products across every line and
// locale); its own <lastmod> in the index lets Google skip re-crawls when
// nothing changed.
// Rendered per request from cached, tagged data: an ISR `revalidate` here would
// ignore the publish webhook (Next 14.2 never tag-invalidates a cached route
// handler). See the caching note in src/utils/sitemap.ts and ADR-0117.
export const dynamic = 'force-dynamic'

export async function GET() {
  const locales = await getLocaleCodes()
  const { products, loaded } = await fetchLines(locales)

  const entries: UrlEntry[] = []
  for (const locale of locales) {
    for (const product of products) {
      if (!listedIn(product, locale, loaded)) continue
      entries.push({
        path: `/${locale}/products/${product.slug}`,
        lastModified: pickDate(product.dates, locale),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return new Response(buildUrlset(entries), { headers: XML_HEADERS })
}
