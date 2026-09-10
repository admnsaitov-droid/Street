/**
 * Shared helpers for building the sitemap index and its child sitemaps.
 *
 * Data is fetched from the app's own `/api/*` proxy routes (same shape the
 * pages consume) and normalised down to `{ slug, updatedAt }`, so `<lastmod>`
 * always reflects the real Strapi update date of each entity instead of the
 * sitemap generation time.
 */

// Base URL used both for the canonical page URLs and for the internal API
// self-calls performed during sitemap generation (the API routes live on the
// same domain as the site).
export const SITEMAP_BASE_URL =
  process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'

const API_BASE = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'

export const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
}

export interface SitemapItem {
  slug: string
  updatedAt: string | null
}

async function fetchJson(path: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      console.warn(`[sitemap] ${path} -> ${res.status}`)
      return null
    }
    return await res.json()
  } catch (error) {
    console.warn(`[sitemap] ${path} failed:`, error)
    return null
  }
}

/**
 * Lines list. The real line entity is nested under `wrapper.linii`, and every
 * line carries its products, so we harvest both from a single request and
 * dedupe products across lines (keeping the most recent updatedAt).
 */
export async function fetchLines(): Promise<{
  pageUpdatedAt: string | null
  lines: SitemapItem[]
  products: SitemapItem[]
}> {
  const data = await fetchJson('/api/get-lines?locale=en')
  const wrappers = data?.linesPageData?.lines
  const pageUpdatedAt: string | null = data?.linesPageData?.updatedAt ?? null

  if (!Array.isArray(wrappers)) {
    return { pageUpdatedAt, lines: [], products: [] }
  }

  const lines: SitemapItem[] = []
  const productMap = new Map<string, string | null>()

  for (const wrapper of wrappers) {
    const line = wrapper?.linii
    if (!line?.slug) continue

    lines.push({ slug: line.slug, updatedAt: line.updatedAt ?? null })

    if (Array.isArray(line.products)) {
      for (const product of line.products) {
        if (!product?.slug) continue
        const next: string | null = product.updatedAt ?? null
        const prev = productMap.get(product.slug)
        // First time we see the product, or a newer updatedAt across lines.
        if (prev === undefined || (next !== null && (prev === null || next > prev))) {
          productMap.set(product.slug, next)
        }
      }
    }
  }

  const products = Array.from(productMap, ([slug, updatedAt]) => ({ slug, updatedAt }))
  return { pageUpdatedAt, lines, products }
}

export async function fetchArticles(): Promise<{
  pageUpdatedAt: string | null
  articles: SitemapItem[]
}> {
  const data = await fetchJson('/api/get-articles?locale=en')
  if (!Array.isArray(data)) {
    return { pageUpdatedAt: null, articles: [] }
  }

  const articles: SitemapItem[] = data
    .filter((article: any) => article?.slug)
    .map((article: any) => ({
      slug: article.slug,
      updatedAt: article.updatedAt ?? article.createdAt ?? null,
    }))

  // The articles list page changes whenever its newest article changes.
  const pageUpdatedAt = maxDate(...articles.map((article) => article.updatedAt))
  return { pageUpdatedAt, articles }
}

export async function fetchPackages(): Promise<{
  pageUpdatedAt: string | null
  packages: SitemapItem[]
}> {
  const data = await fetchJson('/api/get-packages-data?locale=en')
  const pageUpdatedAt: string | null = data?.updatedAt ?? null
  const list = data?.package

  if (!Array.isArray(list)) {
    return { pageUpdatedAt, packages: [] }
  }

  // Individual packages carry no updatedAt, so fall back to the packages
  // single-type update date.
  const packages: SitemapItem[] = list
    .filter((pkg: any) => pkg?.slug)
    .map((pkg: any) => ({ slug: pkg.slug, updatedAt: pkg.updatedAt ?? pageUpdatedAt }))

  return { pageUpdatedAt, packages }
}

/** Latest of a set of ISO date strings (ISO-8601 UTC sorts lexicographically). */
export function maxDate(...dates: (string | null | undefined)[]): string | null {
  let max: string | null = null
  for (const date of dates) {
    if (date && (max === null || date > max)) max = date
  }
  return max
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toIso(value: string | Date | null | undefined): string | null {
  if (!value) return null
  const date = typeof value === 'string' ? new Date(value) : value
  return isNaN(date.getTime()) ? null : date.toISOString()
}

export interface UrlEntry {
  /** Path appended to the base URL, e.g. `/en/lines/sb-standard-line`. */
  path: string
  lastModified?: string | Date | null
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export function buildUrlset(entries: UrlEntry[]): string {
  const urls = entries
    .map((entry) => {
      const loc = escapeXml(`${SITEMAP_BASE_URL}${entry.path}`)
      const lastmod = toIso(entry.lastModified)
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        // Omit <lastmod> entirely when we have no real date — a fake, ever
        // changing date makes Google distrust the signal and stop re-crawling.
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        entry.changeFrequency ? `    <changefreq>${entry.changeFrequency}</changefreq>` : null,
        entry.priority !== undefined ? `    <priority>${entry.priority}</priority>` : null,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function buildSitemapIndex(
  children: { path: string; lastModified?: string | Date | null }[],
): string {
  const items = children
    .map((child) => {
      const loc = escapeXml(`${SITEMAP_BASE_URL}${child.path}`)
      const lastmod = toIso(child.lastModified)
      return [
        '  <sitemap>',
        `    <loc>${loc}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        '  </sitemap>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`
}
