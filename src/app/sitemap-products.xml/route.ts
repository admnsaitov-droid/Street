import { getLocaleCodes } from '@/utils/locales'
import { buildUrlset, fetchLines, pickDate, UrlEntry, XML_HEADERS } from '@/utils/sitemap'

// Dedicated products sitemap. It is large (all products across every line and
// locale); its own <lastmod> in the index lets Google skip re-crawls when
// nothing changed. Same revalidation cadence as the pages sitemap so a Strapi
// publish shows up in both within minutes.
export const revalidate = 600

export async function GET() {
  const locales = await getLocaleCodes()
  const { products } = await fetchLines(locales)

  const entries: UrlEntry[] = []
  for (const locale of locales) {
    for (const product of products) {
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
