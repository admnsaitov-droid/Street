---
tags: [architecture, stack-specific, stable]
updated: 2026-09-17
---

# Site Map — route → view → endpoint

The single page that answers "where do I change this?". Every route is
locale-prefixed (`/en`, `/es`, `/fr`, `/de`, `/fi`).

## Pages

| Route | View | Strapi endpoint(s) |
|---|---|---|
| `/[locale]` | `HomeView` | `get-home-data` |
| `/[locale]/about` | `AboutView` | `get-about` |
| `/[locale]/packages` | `PackagesView` | `get-packages-data` |
| `/[locale]/packages/[subParam]` | `PackageView` | `get-package-data?slug=` |
| `/[locale]/lines` | `LinesView` | `get-lines` |
| `/[locale]/lines/[slug]` | `LineView` | `get-line-data?slug=` |
| `/[locale]/products/[slug]` | `ProductView` | `get-product-data?slug=`, `get-product-specifications` |
| `/[locale]/projects` | `ProjectsView` | `get-projects-page-data` |
| `/[locale]/distribution` | `DistributionView` | `get-distribution-page-data` |
| `/[locale]/articles` | `ArticlesView` | `get-articles`, `get-news-page-data` |
| `/[locale]/articles/[slug]` | `ArticleView` | `get-article?slug=` |
| `/[locale]/contact` | `ContactView` | `get-contact-page-data` |
| `/[locale]/privacy-policy` | `PrivacyPolicyView` | `get-privacy-policy-page-data` |
| `/[locale]/terms-of-use` | `TermsOfUseView` | `get-terms-of-use-page-data` |
| `/[locale]/cookie-policy` | `CookiePolicyView` | `get-cookie-policy-page-data` |

> There is no `/products` index route — products are reached through their line.

## Shell endpoints

Fetched once in `src/app/[locale]/layout.tsx` and passed down as `initialData`:
`get-header-data`, `get-footer-data`.

`get-contact-data` exists as a route but **nothing calls it** — the only dead
endpoint in the API layer.

## Non-content endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/send` · `POST /api/send-main` | Contact form → Resend email + Telegram mirror |
| `GET /api/proxy-media?url=` | Streams Strapi media over HTTPS (Strapi is served over plain HTTP) |

## Screens per view

`HomeView` is the largest: `Hero · Achievements · Packages (+PackagesMobile) ·
Lines · Benefits · About · Globe · LatestNews`. `AboutView`:
`Hero · History · Inspiration · Purpose`. `PackagesView`: `Hero · Package`.
`ContactView`: `GetInTouch · ContactForm · ContactMap`.

## WebGL scenes

Four, all lazy-loaded with `next/dynamic` (`ssr: false`) and tracked in
`src/animationStore` (`SceneType`):

| Scene | Where | Assets |
|---|---|---|
| `home` | `HomeView/screens/Globe` | `low_res_earth.glb` (**geometry only**) + the 2048² maps in `public/models/textures/`, `sky.hdr`, trackers |
| `distribution` | `DistributionView/components/Scene` | the same globe + atmosphere, stars, markers, `adams.hdr` |
| `product` | `ProductView/components/Scene` | `productModel.glb`, colour/material swapping |
| `package` | `PackageView/components/Hero` | `package.glb`, zoom controls |

Both globes render **one shared component**, `DistributionView/components/PlanetModel`
— HomeView's `Composition` imports it from there. Nothing in it may assume which
page it is on; assuming that is what broke the loader gate once (ADR-0107).

Each scene mounts **its own `<Canvas>`** inside its view — there is no shared
canvas. The canvas mounts at **page load**, not when the container nears the
viewport, so its shader compilation and texture upload happen behind the loader
curtain rather than on a scroll boundary; the view declares it with
`useRequireScene` and the curtain waits (ADR-0107). `SceneSkeleton` covers the
wait, `frameloop` flips between `"always"` and `"demand"` on visibility, and
`SceneReadyDetector` prewarms the scene and reports readiness into
`useAnimationStore`.

`src/layouts/CanvasLayout/` and the `tunnel-rat` dependency implement a shared
persistent canvas — **both are unused**, left over from the starter.

Performance work goes through [[optimize-3d-scene]].

## Adding a page

1. `src/app/[locale]/<path>/page.tsx` — thin, `createMetadataGenerator` +
   `getStrapiData`, delegates to the view.
2. `src/app/api/get-<thing>/route.ts` if it needs new Strapi content.
3. `src/views/<Name>View/` for the UI.
4. **Add it to `src/app/sitemap.ts`** and to the table above.
5. Add a redirect to `src/redirects.mjs` if it replaces an old URL.

Full playbook: [[new-page]].

## Related

[[folder-structure]] · [[routing-views]] · [[data-flow]] · [[seo-metadata]]
