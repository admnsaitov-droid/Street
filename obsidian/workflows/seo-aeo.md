---
tags: [workflow, seo, stable]
updated: 2026-09-17
---

# Workflow — SEO & Answer-Engine Visibility

Skills: `seo-audit`, `schema-markup`, `aeo-visibility`. Command: `/seo`.
Agent: `seo-auditor`. The implementation reference is [[seo-metadata]].

## Fix these first

They are known, they are in [[baseline-debt]], and they blunt everything else:

1. **`NEXT_PUBLIC_BASEURL` is not the variable `.env` declares.** Canonicals,
   hreflang, OG URLs, robots and the sitemap all fall back to a hardcoded
   production literal. On preview and staging that means production canonicals
   pointing away from the page being crawled.
2. **OG images 404** — `createMetadataGenerator` builds `/api/media…`, an
   endpoint that does not exist. Every social share is imageless.
3. **Product schema ships an empty `offers.url`.** `ProductView` is a client
   component and reads `window.location.href`, which is `''` during the server
   render — so the JSON-LD a crawler sees has no offer URL on the commercial
   pages.

## Audit checklist

**Crawlability** — pages are server components, so content is in the HTML.
Verify with `view-source`, not DevTools. Animated headings keep a hidden SEO copy
([[text-motion]]); confirm it is present and that `showSeoText` is not `true`.
WebGL scenes are `ssr: false` and contain nothing indexable.

**Coverage** — every `src/app/[locale]/**/page.tsx` appears in
`src/app/sitemap.ts`, for all five locales. This drifts constantly.

**Metadata** — unique title and description per page and per locale, sourced from
Strapi with a real fallback. Titles are brand-prefixed automatically; do not
double-prefix in the CMS.

**Hreflang** — `generateHreflangTags` emits alternates for `en es fr de fi`.
Check a rendered page, not the code.

**Structured data** — Organization + WebSite site-wide, Article on articles,
BreadcrumbList via `Breadcrumbs`. Validate the rendered JSON-LD. Product and FAQ
are the obvious gaps.

**Headings** — one `<h1>`, no skipped levels. `TLine` keeps the tag you pass, so
this is about what you passed.

**Internal linking** — through `AnimLink` or `next/link`. A raw `<a href="/x">`
loses the locale prefix and produces a 404-ish redirect chain.

**Performance** — LCP is usually a Strapi image or a scene. [[optimize-3d-scene]].

**Robots** — `src/app/robots.ts` allows `/` and disallows `/_next/`, `/api/`,
`/admin/`, `/login/`, `/dashboard/`. Verify nothing staging-ish survives.

## Answer-engine visibility (AEO)

The site should be quotable, not just rankable.

- **Answer-first content.** A section that opens with the answer and then
  elaborates gets cited; a section that builds to a conclusion does not. That is
  a CMS-content decision — raise it with whoever writes the copy in Strapi.
- **Entity consistency.** Name, description, contact details and social profiles
  identical across the Organization schema, the footer, and any off-site profile.
  The Organization schema in `src/app/[locale]/layout.tsx` currently has an
  **empty `sameAs`** array — social URLs are commented out. Filling it is the
  cheapest entity win available.
- **AI crawler access.** They are not blocked today. Decide deliberately whether
  to keep it that way, and consider an `llms.txt`.
- **Structured data is what gets parsed.** Product and FAQ schema would do more
  for AI answers than any copy change.

## Reporting

Ranked findings: what is broken, what it costs, the fix. Apply the code fixes;
flag the CMS-content ones for the client. Log anything notable in [[changelog]].

## Related

[[seo-metadata]] · [[html-semantics]] · [[site-migration]] · [[ship]] · [[baseline-debt]]
