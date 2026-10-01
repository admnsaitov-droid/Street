---
tags: [frontend, seo, stable]
updated: 2026-09-17
---

# SEO & Metadata

Five locales, locale-prefixed URLs, content from Strapi. Every piece of the SEO
surface is generated — nothing is hand-written in a component.

## Per-route metadata

Every page exports `generateMetadata` built by `createMetadataGenerator`:

```tsx
export const generateMetadata = createMetadataGenerator({
  getMetadata: async (locale) => getStrapiData('get-home-data', locale),
  getPath: (locale) => `/${locale}`,
  fallback: { title: 'Street Barbell - Home', description: '…' },
});
```

| Option | Purpose |
|---|---|
| `getMetadata` | async fetch; receives `locale` plus every other route param in order |
| `getPath` | the canonical path for this route, locale included |
| `fallback` | `title` / `description` / `keywords` when Strapi is unreachable |
| `transformData` | pull metadata out of a non-standard response shape |
| `ogType` | `'website'` (default) or `'article'` |

It reads `metadata.metatitle`, `metadescription`, `metakeywords` and `openGraph`
from the Strapi payload, falls back on error (twice — fetch failure and generation
failure are both handled), and delegates to `generateMetadata` in
`src/utils/generateMetadata.ts`, which builds title (`<title> | Street Barbell`
suffix; skipped when the title already contains the brand, and on Home via
`skipBrandSuffix: true`), description, keywords, canonical,
OpenGraph, Twitter card and `alternates`.

`generateHreflangTags` fills `alternates.languages` across all five locales.

OG images point straight at the Strapi upload
(`${NEXT_PUBLIC_IMAGE_URL}${metadata.openGraph.url}`, absolute URLs passed
through). Fixed 2026-09-29 — it previously built `/api/media${…}`, a route that
never existed, so every Strapi-sourced OG image 404'd.

## Base URL

Everything canonical is built from
`process.env.NEXT_PUBLIC_BASEURL || 'https://www.streetbarbell.com'`, and that
variable is not the one `.env` declares — see [[environment-variables]]. The
practical effect: previews and staging emit **production** canonicals, hreflang
and OG URLs.

`metadataBase` is set once in `src/app/layout.tsx` from the same variable.

## Sitemap and robots

- The sitemap is a **route-based index**, not `app/sitemap.ts` (deleted
  2026-09-29 — the two claimed the same `/sitemap.xml` URL; ADR-0115):
  - `src/app/sitemap.xml/route.ts` — index pointing at the two children, each
    with a real `<lastmod>` (newest entity inside) so Google skips unchanged
    children.
  - `src/app/sitemap-pages.xml/route.ts` — static pages, lines, articles,
    packages × 5 locales.
  - `src/app/sitemap-products.xml/route.ts` — the large, rarely-changing
    product set.
  - `src/utils/sitemap.ts` — shared fetchers (`fetchStaticPageDates`,
    `fetchLines`, `fetchArticles`, `fetchPackages`), XML builders,
    `pickDate`/`maxDate`/`maxOverItems`, `XML_HEADERS`.
- **`<lastmod>` is per locale and covers every page.** Each fetcher queries all
  five locales; a URL's `<lastmod>` is that locale's own `updatedAt` (falling
  back to the newest across locales). The static single-type pages (home,
  about, contact, projects, distribution, the three policies) get theirs from
  their single-type's `updatedAt` via `fetchStaticPageDates` — they used to
  have none, which is why a Strapi publish never moved the sitemap.
- **A URL is emitted only in locales whose list contains it** (`listedIn`).
  Emitting every slug for all five locales listed pages that don't exist in
  that locale (an EN-only article under `/de/…`). If a locale's list can't be
  fetched, that locale falls back to emitting everything rather than vanishing
  from the sitemap. Checked 2026-10-01: all 810 sitemap URLs return 200.
- **Detail pages 404 for unknown slugs.** Strapi answers an unknown slug with
  200 and an empty entity (`{product:{…no slug}}`, `{line:null}`, `{}`,
  `{article:null}`); the product/line/package/article routes now call
  `notFound()` then — they used to render an empty 200 page (a soft 404).
  `null` data means the request failed, and those pages still degrade instead of
  404ing, so a Strapi outage can't drop real pages from the index.
- Sitemap fetches carry the `strapi` cache tag too, so the publish webhook
  (ADR-0117) refreshes `<lastmod>` immediately.
- **Revalidation is 600s everywhere** — the three routes AND the inner fetches
  (`next: { revalidate: SITEMAP_REVALIDATE }`). The inner value must stay
  explicit: a cached fetch without it can keep serving one payload to every
  route regeneration, freezing `<lastmod>` forever.
- **Adding a route means adding it to the static list in
  `sitemap-pages.xml/route.ts` (via `src/utils/sitemap.ts`) in the same
  change.** This is the most common drift in this repo.
- `src/app/robots.ts` — allows `/`, disallows `/api/`, `/admin/`,
  `/login/`, `/dashboard/`, and points at `${baseUrl}/sitemap.xml`.
  **Never disallow `/_next/`.** It holds the JS/CSS chunks Googlebot needs to
  render the page and `/_next/image` — every optimised image. Blocking it makes
  Google index unrendered, imageless pages. (It was removed 2026-09-10, silently
  re-added by the 2026-09-29 merge, removed again 2026-10-01.)
- `src/redirects.mjs` feeds `next.config.mjs → redirects()`. Changing a URL means
  adding a redirect there.

## Structured data

JSON-LD only, through `src/utils/generateStructuredData.ts` and the
`StructuredData` component (which renders a `next/script` tag, and wraps multiple
schemas in an `@graph`).

| Builder | Emitted where |
|---|---|
| `generateOrganizationSchema` | `src/app/[locale]/layout.tsx` — site-wide |
| `generateWebSiteSchema` | same |
| `generateArticleSchema` | `articles/[slug]/page.tsx` |
| `generateBreadcrumbSchema` | inside the `Breadcrumbs` component |
| `generateProductSchema` | `views/ProductView/ProductView.tsx` — **inside the view**, not the route |

Also available: `combineSchemas`, `generateStructuredDataScript`.

Never write a `<script type="application/ld+json">` by hand, and never use
microdata.

> ⚠️ **Product schema emits an empty `offers.url`.** `ProductView` is a client
> component and builds it with
> `typeof window !== 'undefined' ? window.location.href : ''`, so the
> server-rendered JSON-LD — the copy a crawler reads — carries `""`. It should
> be built from the same `NEXT_PUBLIC_BASEURL` + path the canonical uses.
> It is also the only schema emitted from a view rather than a route; the other
> four follow the route/layout pattern.

## Crawlability with heavy motion

- Pages are **server components**; content is in the server-rendered HTML.
- Animated headings keep a hidden unsplit copy — [[text-motion]]. That is what
  makes `TLine` safe on an `<h1>`.
- Reveals change appearance, never presence. A component that unmounts until it
  scrolls into view is invisible to a crawler.
- WebGL scenes are `ssr: false` and carry no indexable content — anything a
  crawler must read has to exist outside the canvas.

## Localisation

`localePrefix: 'always'`, so `/en/...` is canonical and there is no unprefixed
version. `HtmlLangSetter` syncs `<html lang>` client-side — the static
`lang="en"` in `src/app/layout.tsx` is what ships in the initial HTML.

## Checklist for a new page

1. `generateMetadata` via `createMetadataGenerator`, with a real fallback.
2. Add the path to the pages sitemap (`src/utils/sitemap.ts` +
   `src/app/sitemap-pages.xml/route.ts`).
3. One `<h1>`, clean heading outline.
4. Structured data if a type fits (Product, Article, FAQ…).
5. A redirect in `src/redirects.mjs` if it replaces an old URL.
6. `alt` text on every image.

## Related

[[routing-views]] · [[html-semantics]] · [[site-map]] · [[environment-variables]] · [[baseline-debt]]
