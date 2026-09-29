---
paths:
  - "src/app/**"
  - "src/views/**"
  - "src/layouts/**"
  - "src/middleware.ts"
  - "src/i18n.ts"
  - "src/config/locales.ts"
description: Routes delegate to views; locale-prefixed App Router; server-first
---

# Routing & views

Full note: `obsidian/frontend/routing-views.md`. Real paths: `src/app`
(`paths.routes`) and `src/views` (`paths.views`).

> **Next.js 14.2 App Router.** Verify an API against the installed version before
> writing routing, metadata or middleware code — `params` is a Promise in this
> codebase's page signatures, and that alone breaks copy-pasted Next 13 examples.

## The shape of a route

Every page lives under `src/app/[locale]/…/page.tsx` and is a few lines:

```tsx
export const generateMetadata = createMetadataGenerator({ … });

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await getStrapiData('get-x-data', locale);
  return <XView data={data} />;
}
```

- **Routes delegate.** A route file may import its view, and the route-level
  data/metadata/SEO modules listed in `paths.routeAllowedImports`
  (`@/utils/strapi`, `@/utils/createMetadataGenerator`,
  `@/utils/getMediaStrapiPath`, `@/utils/generateStructuredData`,
  `@/components/StructuredData`). **Nothing else.** Importing a UI component into
  a route is the violation this rule exists to catch, and `verify.sh` FAILs it.
- **Views do not fetch.** The route loads; the view receives props. Views live in
  `src/views/<Name>View/` and split into `screens/` (full-width page sections) or
  `components/` (pieces used by that view only).
- **Data loads at the route** through `getStrapiData`, which calls this app's own
  `src/app/api/*` endpoints — never Strapi directly from a view.
- **Always handle null data.** `getStrapiData` returns `null` on failure by
  design so a page degrades instead of crashing. Give every page a fallback
  shape, as `src/app/[locale]/page.tsx` does.

## Locales

`src/config/locales.ts` is the static source of truth (`en es fr de fi`) and the
only one safe in the Edge middleware. `src/middleware.ts` (next-intl,
`localePrefix: 'always'`) and `src/i18n.ts` must agree with it; `NEXT_PUBLIC_LOCALES`
and Strapi are the other two sources, and drift between them shows up as a 404.
Adding a locale means touching `src/config/locales.ts` first.

## Server-first

- Server-render by default; push `"use client"` to the leaf that needs it.
  Several top-level views are client components today (see
  `obsidian/meta/baseline-debt.md`) — do not add more, and split a leaf out when
  you touch one.
- Heavy client work (3D scenes, Swiper, maps) loads through `next/dynamic` with
  `ssr: false`, as `DynamicScene` and `DynamicScrollRevealWrapper` already do.

## Metadata & SEO

- Metadata comes from `createMetadataGenerator` per route — never hand-written
  `<meta>` tags in a component.
- **Add every new route to the sitemap (`src/utils/sitemap.ts` +
  `src/app/sitemap-pages.xml/route.ts`) in the same change.** That is the
  single most common drift in this repo.
- Structured data goes through `@/utils/generateStructuredData` and the
  `StructuredData` component, at the route or layout.
- `src/redirects.mjs` holds redirects; middleware stays thin — routing and
  locale negotiation only, never authorisation or business logic.
