import { getLocaleCodes } from '@/utils/locales'
import { buildUrlset, fetchLines, UrlEntry, XML_HEADERS } from '@/utils/sitemap'

// Dedicated products sitemap. It is large (all products across every line and
// locale) and changes rarely, so it revalidates on a slower cadence than the
// pages sitemap and its own <lastmod> in the index lets Google skip re-crawls.
export const revalidate = 86400

export async function GET() {
  const [locales, { products }] = await Promise.all([getLocaleCodes(), fetchLines()])

  const entries: UrlEntry[] = []
  for (const locale of locales) {
    for (const product of products) {
      entries.push({
        path: `/${locale}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return new Response(buildUrlset(entries), { headers: XML_HEADERS })
}
