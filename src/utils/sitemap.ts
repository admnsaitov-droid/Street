/**
 * Shared helpers for building the sitemap index and its child sitemaps.
 *
 * Data is fetched from the app's own `/api/*` proxy routes (same shape the
 * pages consume) and normalised down to per-locale update dates, so
 * `<lastmod>` always reflects the real Strapi update date of each entity —
 * in the locale the URL points at — instead of the sitemap generation time.
 */

// Base URL used both for the canonical page URLs and for the internal API
// self-calls performed during sitemap generation (the API routes live on the
// same domain as the site).
export const SITEMAP_BASE_URL =
  process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'

const API_BASE = process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'

// One revalidation cadence for the sitemap routes AND their inner fetches.
// The inner fetch must carry it explicitly: a cached fetch with no revalidate
// would keep serving the same payload to every route regeneration, which is
// exactly the "published in Strapi but <lastmod> never moves" failure.
export const SITEMAP_REVALIDATE = 600

export const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400',
}

/** Update date per locale, e.g. `{ en: '2026-…', es: null }`. */
export type LocaleDates = Record<string, string | null>

export interface SitemapItem {
  slug: string
  dates: LocaleDates
}

async function fetchJson(path: string): Promise<any | null> {
  // One retry: the Strapi proxy occasionally times out under the parallel
  // load of a sitemap regeneration, and a silently dropped locale would
  // silently roll <lastmod> back to an older locale's date.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(8000),
        next: { revalidate: SITEMAP_REVALIDATE },
      })
      if (!res.ok) {
        console.warn(`[sitemap] ${path} -> ${res.status}`)
        continue
      }
      return await res.json()
    } catch (error) {
      console.warn(`[sitemap] ${path} failed (attempt ${attempt + 1}):`, error)
    }
  }
  return null
}

/** The date for a locale's URL, falling back to the newest across locales. */
export function pickDate(dates: LocaleDates | undefined, locale: string): string | null {
  if (!dates) return null
  return dates[locale] ?? maxDate(...Object.values(dates))
}

/** Newest date across every locale of every item. */
export function maxOverItems(...groups: (LocaleDates | undefined)[]): string | null {
  const all: (string | null)[] = []
  for (const dates of groups) {
    if (dates) all.push(...Object.values(dates))
  }
  return maxDate(...all)
}

/**
 * Static single-type pages. Each has a Strapi single-type behind it whose
 * `updatedAt` moves when the page is edited and republished — that is the
 * page's real <lastmod>.
 */
const PAGE_SOURCES: {
  path: string
  endpoint: string
  pick: (data: any) => string | null
}[] = [
  { path: '', endpoint: '/api/get-home-data', pick: (d) => d?.updatedAt ?? null },
  { path: '/about', endpoint: '/api/get-about', pick: (d) => d?.aboutPage?.updatedAt ?? null },
  { path: '/contact', endpoint: '/api/get-contact-page-data', pick: (d) => d?.updatedAt ?? null },
  { path: '/projects', endpoint: '/api/get-projects-page-data', pick: (d) => d?.projectsPage?.updatedAt ?? null },
  { path: '/distribution', endpoint: '/api/get-distribution-page-data', pick: (d) => d?.distributionPage?.updatedAt ?? null },
  { path: '/privacy-policy', endpoint: '/api/get-privacy-policy-page-data', pick: (d) => d?.privacyPolicyPage?.updatedAt ?? null },
  { path: '/terms-of-use', endpoint: '/api/get-terms-of-use-page-data', pick: (d) => d?.termsOfUsePage?.updatedAt ?? null },
  { path: '/cookie-policy', endpoint: '/api/get-cookie-policy-page-data', pick: (d) => d?.cookiePolicyPage?.updatedAt ?? null },
]

/** `path -> { locale -> updatedAt }` for every static single-type page. */
export async function fetchStaticPageDates(locales: string[]): Promise<Map<string, LocaleDates>> {
  const result = new Map<string, LocaleDates>()
  for (const source of PAGE_SOURCES) {
    const dates: LocaleDates = {}
    await Promise.all(
      locales.map(async (locale) => {
        const data = await fetchJson(`${source.endpoint}?locale=${locale}`)
        dates[locale] = data ? source.pick(data) : null
      }),
    )
    result.set(source.path, dates)
  }
  return result
}

/**
 * Lines list, per locale. The real line entity is nested under
 * `wrapper.linii`, and every line carries its products, so we harvest both
 * from a single request per locale and dedupe products across lines (keeping
 * the most recent updatedAt).
 */
export async function fetchLines(locales: string[]): Promise<{
  pageUpdatedAt: LocaleDates
  lines: SitemapItem[]
  products: SitemapItem[]
}> {
  const pageUpdatedAt: LocaleDates = {}
  const lineMap = new Map<string, LocaleDates>()
  const productMap = new Map<string, LocaleDates>()

  await Promise.all(
    locales.map(async (locale) => {
      const data = await fetchJson(`/api/get-lines?locale=${locale}`)
      pageUpdatedAt[locale] = data?.linesPageData?.updatedAt ?? null

      const wrappers = data?.linesPageData?.lines
      if (!Array.isArray(wrappers)) return

      for (const wrapper of wrappers) {
        const line = wrapper?.linii
        if (!line?.slug) continue

        const lineDates = lineMap.get(line.slug) ?? {}
        lineDates[locale] = line.updatedAt ?? null
        lineMap.set(line.slug, lineDates)

        if (!Array.isArray(line.products)) continue
        for (const product of line.products) {
          if (!product?.slug) continue
          const next: string | null = product.updatedAt ?? null
          const dates = productMap.get(product.slug) ?? {}
          const prev = dates[locale]
          // First time we see the product in this locale, or a newer
          // updatedAt across lines.
          if (prev === undefined || (next !== null && (prev === null || next > prev))) {
            dates[locale] = next
          }
          productMap.set(product.slug, dates)
        }
      }
    }),
  )

  const lines = Array.from(lineMap, ([slug, dates]) => ({ slug, dates }))
  const products = Array.from(productMap, ([slug, dates]) => ({ slug, dates }))
  return { pageUpdatedAt, lines, products }
}

export async function fetchArticles(locales: string[]): Promise<{
  pageUpdatedAt: LocaleDates
  articles: SitemapItem[]
}> {
  const articleMap = new Map<string, LocaleDates>()

  await Promise.all(
    locales.map(async (locale) => {
      const data = await fetchJson(`/api/get-articles?locale=${locale}`)
      if (!Array.isArray(data)) return
      for (const article of data) {
        if (!article?.slug) continue
        const dates = articleMap.get(article.slug) ?? {}
        dates[locale] = article.updatedAt ?? article.createdAt ?? null
        articleMap.set(article.slug, dates)
      }
    }),
  )

  const articles = Array.from(articleMap, ([slug, dates]) => ({ slug, dates }))
  // The articles list page changes whenever its newest article changes.
  const pageUpdatedAt: LocaleDates = {}
  for (const locale of locales) {
    pageUpdatedAt[locale] = maxDate(...articles.map((article) => article.dates[locale]))
  }
  return { pageUpdatedAt, articles }
}

export async function fetchPackages(locales: string[]): Promise<{
  pageUpdatedAt: LocaleDates
  packages: SitemapItem[]
}> {
  const pageUpdatedAt: LocaleDates = {}
  const packageMap = new Map<string, LocaleDates>()

  await Promise.all(
    locales.map(async (locale) => {
      const data = await fetchJson(`/api/get-packages-data?locale=${locale}`)
      pageUpdatedAt[locale] = data?.updatedAt ?? null
      const list = data?.package
      if (!Array.isArray(list)) return
      for (const pkg of list) {
        if (!pkg?.slug) continue
        const dates = packageMap.get(pkg.slug) ?? {}
        // Individual packages carry no updatedAt, so fall back to the
        // packages single-type update date.
        dates[locale] = pkg.updatedAt ?? pageUpdatedAt[locale]
        packageMap.set(pkg.slug, dates)
      }
    }),
  )

  const packages = Array.from(packageMap, ([slug, dates]) => ({ slug, dates }))
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
