---
tags: [frontend, stable]
updated: 2026-09-17
---

# Routing & Views

`src/app` holds routes. `src/views` holds the UI. The split is what keeps the
site portable across framework generations (ADR-0003).

> **Next.js 14.2 App Router.** `params` is a `Promise` in this codebase and pages
> `await` it. Verify routing, metadata and middleware APIs against the installed
> version rather than memory — a Next 13 or 15 example will not work here.

## The shape of a route

```tsx
// src/app/[locale]/products/[slug]/page.tsx
import { ProductView } from "@/views/ProductView/ProductView";
import { getStrapiData } from "@/utils/strapi";
import { createMetadataGenerator } from "@/utils/createMetadataGenerator";

export const generateMetadata = createMetadataGenerator({ … });

export default async function Page({ params }: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const data = await getStrapiData(`get-product-data?slug=${slug}`, locale);
  return <ProductView data={data ?? fallback} />;
}
```

**A route file may import:** its view, and the five modules in
`paths.routeAllowedImports` — `@/utils/strapi`, `@/utils/createMetadataGenerator`,
`@/utils/getMediaStrapiPath`, `@/utils/generateStructuredData`,
`@/components/StructuredData`. Nothing else. Importing a UI component into a
route is the violation the check exists to catch (ADR-0102).

**Always handle `null`.** `getStrapiData` swallows errors and returns `null` by
design, so a page degrades instead of crashing. Give every page a fallback shape.

## Views

```
src/views/<Name>View/
├── <Name>View.tsx        ← composes the page from props
├── screens/<Section>/    ← full-width page sections
└── components/           ← pieces used only by this view
```

- **Views do not fetch.** Props in, UI out.
- One view per route. The route → view → endpoint table is [[site-map]].
- `screens/` is used by the larger pages (`HomeView`, `AboutView`, `PackagesView`,
  `ContactView`); smaller views just have `components/`.

## The app shell

`src/app/layout.tsx` is minimal: `<html>`, `next/font` variables, GTM, Draco
decoder prefetch, `metadataBase`, `HtmlLangSetter`.

`src/app/[locale]/layout.tsx` is the real shell and nests, in order:

```
NextIntlClientProvider → StyledComponentsLayout → ScrollLayout (Lenis)
  → SmartCSSGrid + Lvh + GlobalStyles
  → AssetsLoaderLayout            fullyLoaded gate
    → AnimatedRouterLayout        isRerouting gate + TransitionBg
      → Header · FadeContainer · SuccessModal · ErrorModal · FullScreenPlayer
      → <main> → DynamicScrollRevealWrapper → {children} + ContactForm
      → Footer
```

The order is load-bearing — the motion gates depend on the loader sitting above
the router transition. Header and footer data are fetched **once here** and
passed down as `initialData`; never refetch them per page.

## Navigation

| Use | For |
|---|---|
| `AnimLink` (`layouts/AnimatedRouterLayout`) | in-app navigation that should play the transition. Adds the locale prefix automatically |
| `next/link` | plain client-side navigation |
| `useAnimRouter()` | programmatic navigation with the transition |
| `useIsRerouting()` | read whether a transition is running |

`AnimLink` calls `preventDefault()` and routes through `routeChangeStart`, which
shows `TransitionBg`, pushes the route, and restores the saved scroll position
per pathname.

## Locales

`src/config/locales.ts` is the static source of truth — `['en','es','fr','de','fi']`,
default `en`. It is the only list safe inside the Edge middleware.

Three sources must agree: that file, `NEXT_PUBLIC_LOCALES`, and Strapi
(`src/utils/locales.ts`). `src/i18n.ts` prefers the env var and falls back to the
static config specifically so a slow Strapi cannot 404 local development. Drift
between them shows up as a 404 on a valid URL.

`src/middleware.ts` runs next-intl with `localePrefix: 'always'` and matches
everything except `api`, `_next`, `_vercel`, `favicon.ico` and files with an
extension. **Keep it thin** — routing and locale negotiation only.

## Server-first

- Routes and views are server components by default.
- `"use client"` belongs on the leaf that needs it. Ten top-level views/pieces
  carry it today; that is debt ([[baseline-debt]]), not the pattern.
- Anything with a canvas, Swiper or Google Maps loads via `next/dynamic` with
  `ssr: false`.

## Adding a page

Full playbook: [[new-page]]. In short — route file, API endpoint if new content
is needed, view, **sitemap entry**, [[site-map]] row, and a redirect if it
replaces an old URL.

## Related

[[site-map]] · [[folder-structure]] · [[seo-metadata]] · [[component-conventions]] · [[data-flow]]
