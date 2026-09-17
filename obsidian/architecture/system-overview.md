---
tags: [architecture, stable]
updated: 2026-09-17
---

# System Overview

## What this is

**Street Barbell** — a five-locale marketing and product site on **Next.js 14.2
App Router**. Server-rendered content from a self-hosted **Strapi**, spring-driven
motion through one vendored engine, four lazy **three.js** scenes, and
**styled-components** with a viewport-scaling grid.

Not an app: there is no auth, no database in this repo, and no user-generated
state. Everything is read, rendered and animated.

## Mental model

```
GET /fr/products/rack-01
  │
  ├─ src/middleware.ts            next-intl — resolves the locale, always prefixes
  ▼
src/app/[locale]/products/[slug]/page.tsx        ← the route. Thin.
  │  generateMetadata → createMetadataGenerator
  │  getStrapiData('get-product-data?slug=…', locale)
  │     └─► /api/get-product-data ──► Strapi  (API_URL, server-only)
  ▼
src/app/[locale]/layout.tsx  — the shell, rendered once
  │  NextIntlClientProvider → StyledComponentsLayout → ScrollLayout (Lenis)
  │  → SmartCSSGrid + Lvh + GlobalStyles
  │  → AssetsLoaderLayout        ← gate 1: fullyLoaded
  │    → AnimatedRouterLayout    ← gate 2: isRerouting
  │      → Header · modals · FullScreenPlayer
  ▼
src/views/ProductView/ProductView.tsx            ← the view. All the UI.
  │  composes screens/ and components/ from props
  ▼
Springs (Inview · SpringTrigger · Hover) + TextEngine/TLine
  │  each on its own rAF via useLoop (ADR-0103)
  ▼
Each WebGL scene mounts its OWN <Canvas> inside the view, lazily
(next/dynamic ssr:false → useLazyScene → frameloop "always" | "demand")
```

> `src/layouts/CanvasLayout/` and the `tunnel-rat` dependency are **unused
> leftovers from the starter** — nothing imports them. The persistent-canvas
> pattern they implement is not how this site works.

Two gates decide whether anything moves: **`fullyLoaded`** from
`AssetsLoaderLayout` and **`isRerouting`** from `AnimatedRouterLayout`. If an
animation is not firing, check those two before anything else.

## The five pillars

1. **Routes → views.** A route file loads data and renders a view; all UI logic
   lives in `src/views/`. [[routing-views]]
2. **One motion vocabulary.** Six primitives on `@react-spring/web`, plus one
   text engine. Both vendored and protected. [[motion-system]]
3. **One place for every value.** Colours in `_colors`, dimensions through
   `rm()`, breakpoints through `media.*`, fonts through the `font*()` helpers.
   [[design-system]]
4. **Content is server-side and defensive.** Strapi through this app's own
   `/api`; `getStrapiData` returns `null` rather than throwing, so every page
   needs a fallback. [[cms]]
5. **Semantics as an output, not a retrofit.** Animated headings keep a crawlable
   copy; every motion wrapper takes a real element. [[html-semantics]]

## Request lifecycle

1. Middleware resolves the locale and rewrites to `/[locale]/…`.
2. The route awaits `params`, fetches through `getStrapiData`, and renders its
   view with the result — or a fallback shape if Strapi returned `null`.
3. The shell has already established the intl provider, styled-components SSR,
   Lenis, the grid, `--vh` and global styles.
4. Any 3D scene on the page mounts immediately and prewarms — textures
   uploaded, programs compiled, one frame drawn — behind the loader curtain.
5. The curtain lifts (min 1s · scenes prewarmed · cap 8s); `fullyLoaded` flips;
   motion is released. ADR-0107.
6. Views compose sections; primitives animate; a scene draws only while
   `isInView` (`frameloop`), but it is already compiled by then.
7. Content is in the server-rendered HTML regardless of motion state.

## Rendering strategy

Server components by default. `"use client"` belongs on the leaf that needs it —
ten top-level views carry it today, which is debt ([[baseline-debt]]), not the
pattern. Anything with a canvas, Swiper or Google Maps loads through
`next/dynamic` with `ssr: false`.

## Related

[[stack-profile]] · [[site-map]] · [[folder-structure]] · [[data-flow]] · [[motion-system]]
