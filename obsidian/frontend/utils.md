---
tags: [frontend, catalog, stable]
updated: 2026-09-17
---

# Utility Catalog

Everything in `src/utils/`. Pure where possible; the data helpers are the
exception and are marked as such.

## Content & media

| Function | Purpose |
|---|---|
| `getStrapiData(path, locale)` | **The only client-facing content entry point.** Calls this app's own `/api/<path>?locale=…`, dedupes in-flight requests by URL, 10s timeout, returns `null` on failure instead of throwing. Uses `fetch`; server-side it is cached (300s, tag `strapi`, ADR-0117). |
| `getMediaStrapiPath(media)` | Resolves a Strapi media object to a usable URL. |
| `strapi.ts → getBaseUrl()` | Server: `NEXT_PUBLIC_BASEURL` → `NEXT_PUBLIC_BASE_URL` → `localhost:3000`. Client: `window.location.origin`. |

## SEO

| Function | Purpose |
|---|---|
| `createMetadataGenerator({ getMetadata, getPath, fallback })` | The per-route metadata factory. Every page uses it; nothing hand-writes `<meta>`. |
| `generateMetadata(props)` | The underlying builder — title (`<title> | Street Barbell` suffix, skipped when the brand is already in the title or `skipBrandSuffix` is set — Home), description, OG, Twitter, canonical, alternates. |
| `generateHreflangTags(...)` | `hreflang` alternates across the five locales. |
| `generateStructuredData.ts` | `generateOrganizationSchema`, `generateWebSiteSchema`, `generateArticleSchema`, `combineSchemas`, `generateStructuredDataScript` — the JSON-LD builders. |
| `localizedUrl(...)` | Builds a locale-prefixed URL. |
| `locales.ts` | `getLocaleCodes`, `getDefaultLocale`, `getStrapiLocales` — locale list with `src/config/locales.ts` as the static fallback. |
| `sitemap.ts` | Sitemap data + XML: `fetchStaticPageDates`, `fetchLines`, `fetchArticles`, `fetchPackages` (per-locale `updatedAt`, each also returns the `loaded` locale set), `listedIn` (emit a URL only in locales that list the item), `pickDate`/`maxDate`/`maxOverItems`, `buildUrlset`/`buildSitemapIndex`. Fetches are cached and tagged `strapi`. See [[seo-metadata]]. |
| `../config/cache.ts` | `CONTENT_REVALIDATE` (300s) and `CONTENT_CACHE_TAG` (`strapi`) — the one TTL/tag shared by `fetchStrapi`, `getStrapiData` and the sitemap (ADR-0117). |

## Maths & animation

| Function | Purpose |
|---|---|
| `math.ts` | `lerp`, `clamp`, `debounce`, `interpolate` (numeric + unit-aware) |
| `sNoise.ts` | simplex noise for the WebGL scenes |
| `spherePosition.ts` | lat/lon → 3D position for the globe markers |
| `scrollTo(...)` | **the one programmatic scroll entry point** — Lenis-aware ([[smooth-scroll]]) |
| `dateFormat.ts` | article/news date formatting |

## 3D / performance

| Function | Purpose |
|---|---|
| `deviceTier.ts` | `getDeviceTier()` (`mobile` \| `tablet` \| `desktop`, thresholds read from `src/styles/grid/breakpoints.ts`), `getSceneDpr(tier)`, `getSceneGlFlags(tier)`, `prefersReducedMotion()`. **Read once at scene construction**, never on resize — all four canvases read DPR and renderer flags from here so the values cannot drift apart. ADR-0107. |
| `warmupScene.ts` | `warmupScene(gl, scene, camera)` — uploads every texture **one per frame**, compiles every program, renders one throwaway frame, then the scene counts as ready. The per-frame yield is deliberate: uploading back to back was a single ~600ms task while the loader was animating, which showed as a hitch in the logo. `collectSceneTextures` / `initSceneTextures` are the pieces. A failed upload **warns** outside production rather than passing silently: a prewarm that fails quietly reads as success, which is how a non-running prewarm once hid. |
| `onIdle(run, timeout)` | `src/utils/onIdle.ts` — runs work once the browser is idle, with a hard deadline, and returns a cancel function. For data a component needs *eventually* but not to paint: the header's four mega-menus are always mounted but closed, and each fetched on mount, putting ~2s of requests on every page load's critical path. |
| `isBot()` / `canRenderWebGL()` | `src/utils/isBot.ts` — client-side checks. A bot never mounts a scene (`optimize-3d-scene` §1) and a client without usable WebGL never gates the loader curtain on one. Client-side on purpose: reading `headers()` would opt every page out of static generation. **`isBot()` matches the user agent only** — it deliberately does *not* check `navigator.webdriver`, which is true in any automation-controlled browser and silently stripped the hero scene (ADR-0113). Prefer `canRenderWebGL()`: capability, not identity. |
| `dracoDecoder.ts` | `DRACO_DECODER_PATH` — the project's own `/draco/`, not Google's CDN. Every `useGLTF` and `GLTFLoader` goes through it. ADR-0108. |

## Communications

| Function | Purpose |
|---|---|
| `telegram.ts → sendTelegramMessage(payload)` | Server-only. Mirrors a contact submission to Telegram; called non-blocking so a Telegram failure never fails the form. |

## Styling helpers

Live in `src/styles/`, not here: `rm`, `em`, `media` (from `@/styles`),
`heightLvh` / `minHeightLvh` / `marginTopLvh` and `toVars` / `printVars`
(`src/styles/utils.ts`). See [[design-system]].

## Rules

- Pure: same input, same output, no DOM writes, no module state. `strapi.ts` is
  the deliberate exception (its request cache) — keep new helpers pure.
- No React imports. A util that needs one is a hook.
- Named exports, one concern per file.

## Related

[[folder-structure]] · [[seo-metadata]] · [[component-conventions]]
