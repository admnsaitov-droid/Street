---
tags: [meta, changelog]
updated: 2026-10-01
---

# Changelog

Notable changes to **this project**. Newest first. One entry per meaningful
change: dependencies, architecture, conventions, launches.

Format: `## YYYY-MM-DD — short title` followed by what changed and why it
mattered. Link the ADR when there is one.

---

## 2026-10-01 (2) — Strapi data cache, real 404s, per-locale sitemap

- **Content caching (ADR-0117).** All Strapi reads now go through `fetch` with a
  300s revalidate and the `strapi` tag — the twenty `/api/get-*` routes via the
  new `src/app/api/_lib/fetchStrapi.ts`, page renders via `getStrapiData`, and
  the sitemap. Warm page TTFB 25–45ms (was 0.2–1.1s cold / up to 3.1s on prod),
  warm API 3–7ms. New `POST /api/revalidate` (env `REVALIDATE_SECRET`) purges
  everything on a Strapi publish webhook. `getStrapiData` uses an
  `AbortController` timeout so the browser path still works on Safari <16.
- **Unknown slugs are real 404s.** Product/line/package/article routes call
  `notFound()` when Strapi returns an empty entity; before, every bad URL was an
  empty 200 page (verified on prod). Failed requests (`null`) still degrade.
- **Sitemap emits a URL only in locales that list it** — it was emitting every
  slug for all five locales, e.g. `/de/articles/<en-only article>`. All 810
  sitemap URLs now return 200 (was 10 empty/404).
- **`.env.example` committed** (no secret values), including `REVALIDATE_SECRET`
  and `NEXT_PUBLIC_SUPPORT_EMAIL`.

---

## 2026-10-01 — Restored main's July–September work lost in the den merge

The 2026-09-29 merge of `textura/den` used `--allow-unrelated-histories` and
resolved all 84 conflicts in den's favour. The two repos **do** share a base —
this repo's root `fd10313` is den's `e45e7dc` (2026-07-03) — and den's
September work never contained this repo's July–September commits, so taking
den silently reverted them. Redone as a true 3-way merge (ADR-0116): 3 real
conflicts instead of 84, applied as a forward fix (no history rewrite).

Restored:
- **`robots.ts` no longer disallows `/_next/`** — the re-added line blocked
  Googlebot from the JS/CSS chunks and `/_next/image`.
- **Next 14.2.25** (security floor — CVE-2025-29927 middleware bypass); lockfiles
  now updated too, the original bump only touched `package.json`.
- **Titles:** `<title> | Street Barbell`, Home without the brand
  (`skipBrandSuffix`). The `Street Barbell: ` prefix was the July state, not a
  den decision.
- **Metadata from the `metadata` component** for line/product/package (the
  original 2026-09-10 version, which also resolves the OG media object before
  the path).
- **"Explore the line"** (`SameLineProducts`) on product pages + the `linesData`
  fetch in the product route.
- Distributor logo sizing/original colours, the package "send request" button
  → `/contact`, null-safety in Article/Articles/Policy/Contact/Lines/Packages
  views, AnimatedText unused imports.

Also:
- The Distribution `<h1>` had a per-page visually-hidden copy from main *and*
  now the generic `AnimatedGrid` copy — the per-page one is removed (one text
  copy, no `aria-hidden` wrapper hiding it from screen readers).
- `og:image`: `/placeholder.jpg` (what `getMediaStrapiPath` returns for empty
  media) now falls through to the site default `/open-graph.png` instead of
  becoming a 404 on the Strapi host.
- `next.config` `admin.streetbarbell.com` remote pattern had `port: '443'`,
  which never matches (Next compares against `url.port`, `''` for default
  https) — removed, so it works as a fallback when `NEXT_PUBLIC_IMAGE_URL` is
  unset.

Verified on a local production build: robots, titles on 6 page types, one `<h1>`
with text on 5 page types, absolute og:image URLs, explore-the-line links,
sitemap `<lastmod>`. `verify.sh` 4 FAIL / 6 WARN — unchanged baseline.

---

## 2026-09-29 (2) — SEO fix set: sitemap lastmod, metadata fields, crawlable animated headings

- **`<lastmod>` now moves when Strapi publishes.** The static single-type pages
  (home, about, contact, projects, distribution, the three policies) had no
  `<lastmod>` at all — a publish never changed the sitemap. `fetchStaticPageDates`
  reads each single-type's `updatedAt`, per locale; lines/articles/packages/
  products dates are per-locale too (a URL's date is its own locale's, falling
  back to the newest across locales). Revalidation dropped to 600s on all three
  sitemap routes and is set explicitly on the inner fetches; `fetchJson` retries
  once so a flaky locale request can't silently roll dates back.
- **Page metadata now reads the `metadata` component.** Lines list, line,
  product, package and articles-list routes were reading on-page copy
  (`name`/`title`/`description`) while the SEO team's `metadata`
  (metatitle/metadescription/metakeywords/openGraph) sat unused — articles list
  even read fields that don't exist (`newsPage.metatitle`). All five now prefer
  `…metadata.*` with the old fields as fallback. Individual articles have no
  metadata component and keep title/description.
- **`AnimatedGrid` headings exist for crawlers.** The component renders rows
  only after client-side measurement, so every heading built with it (the
  Distribution and Projects `<h1>` among them) was an **empty element in the
  server HTML**. It now always renders a visually-hidden plain-text copy of its
  children (TextEngine's `seo` idea); the animated rows are `aria-hidden`.
  Verified: `/en/distribution` and `/en/projects` now serve their `<h1>` text.

---

## 2026-09-29 — textura/den merged in; distributor grouping; media fixes; content audit

- **Merged the `textura/den` repository into `main`** (`--allow-unrelated-histories`
  — remote `textura` added). Den won every conflict except the sitemap: the
  route-based index stayed and den's legacy `app/sitemap.ts` was deleted
  (ADR-0115); the old Globe `PlanetModel` was dropped too.
  **Correction (2026-10-01):** the repos *do* share an ancestor, and "den won
  every conflict" reverted this repo's July–September work — including
  `SameLineProducts`, which was this repo's feature, not dead den code.
  Repaired in the 2026-10-01 entry; see ADR-0116.
- **Distributors are grouped by country.** Several distributors can share one
  country (Benelux ×3, USA ×3) and rendered as stacked, half-clickable markers.
  `Trackers` now dedupes to one marker per country; selecting a country shows
  every distributor in it — a scrollable card group on desktop
  (`CountryPanel`), the full list in the mobile popup (`CountryPanelMobile`).
  New helper: `getDynamicLocationsByCountry` in `dynamicDataTransformer.ts`.
- **`proxy-media` hardened**: host allowlist (was an open SSRF proxy), streams
  instead of buffering whole files, forwards `Range` so video seeks work.
- **OG images fixed**: `createMetadataGenerator` pointed at a nonexistent
  `/api/media` route; now uses the Strapi upload URL directly.
- **Content audit** of all 5 locales × 129 products shipped to
  `docs/content-audit-2026-09-29.md`: swapped gallery/reference images
  (MB 7.69↔7.70, 7.72←7.71, 7.103←7.102, kids 7.06.1←7.06), `mb-779` existing
  only in EN, one product with no 3D model, EN-only distributor descriptions in
  every locale, untranslated legal pages (fr/de/fi), and the heavy-media list
  (50MB home video, 42MB `.MOV`, 6MB muscle PNGs).

---

## 2026-09-18 — Configurator layout corrections

- **The desktop colour palette is back where it was.** The always-open palette
  returns to the corner of the configurator above `md`; the compact control in
  the glassy toolbar is now **narrow layouts only**. `ColorPaletre` is
  referenced again, so it is no longer dead code.
- **The colour sheet outranks the image rail.** `ProductGallery`'s selector is
  `z-index: 50` and the toolbar was `20` — and because the toolbar is a stacking
  context the sheet could not climb out of it, so the dropdown opened *behind*
  the thumbnails on a phone. The toolbar is now `60`.
- **The distributors headline is smaller on desktop**: `rm(100)` → `rm(64)`, and
  `lg` `rm(80)` → `rm(56)`. The `md` (56) and `xsm` (32) sizes are untouched, so
  the scale stays monotonic — setting desktop below the tablet size would have
  made a tablet render larger type than a laptop.

---

## 2026-09-18 — Site-wide audit: every page was failing hydration

An audit of all thirteen page types (console errors, page errors, failed
requests, DOM sanity) found **zero clean pages**. Now **twelve of thirteen** are
clean. ADR-0114.

### What was wrong

| defect | where | effect |
|---|---|---|
| `DynamicScrollRevealWrapper` wraps children in two divs on desktop, none on mobile — from a width the server reports as 0 | the shell, so **every page** | React #418/#423: the whole DOM torn down and rebuilt on load |
| Header logo swapped asset on width | every page | same, plus a visible logo swap |
| `width`-conditional markup in 10 views | about, home, distribution, packages, contact… | same |
| `<div>` inside `<p>` | all three policy pages | invalid HTML; the browser repairs it, hydration then disagrees |
| `is3d` passed to a styled `<button>` | product | non-transient prop reaching the DOM |
| `href={`/products/${route}`}` with an empty route | anything with a product preview | prefetched `/en/products` → **404** |
| `<video src="">` | package | `NotSupportedError: The element has no supported sources` |
| kebab-case SVG attributes (`stroke-width`, `fill-opacity`…) | 16 files | React warnings on render |

### The pattern

`useWindowWidth()` returns **0 on the server** and the real width on the
client's first paint. Any markup branching on it renders two different trees.
New `useMounted()` gates those branches with **desktop as the server
assumption** — see ADR-0114 for the polarity, which is easy to invert.

### Also in this batch

- **Distributors breadcrumbs** are readable: `Breadcrumbs` takes `tone="dark"`
  for heroes on dark surfaces, and the trail inherits its colour.
- **The home hero no longer arrives late.** The content wrapper faded in with
  react-spring's default config *underneath* the curtain, so on a slow frame the
  hero was still part-transparent after the reveal — which is the inconsistent
  lag that was reported. The curtain wipe is the transition now; the content
  does not fade. The mobile dark overlay also flashed on desktop because
  `0 <= 768`; it waits for a real measurement.
- **The colour sheet on touch** is centred on the viewport (it was clipped off
  the left edge), scrollable, and a **5-column grid of colour chips** — no hex
  text, names kept as the accessible name and tooltip. The zoom tooltip moved
  below the toolbar so it cannot collide with it.
- **Two-finger gestures on touch devices.** One finger scrolls the page, two
  rotate and zoom, and `SceneGestureHint` says so the first time someone tries
  one finger — the pattern map embeds use. The scene also auto-rotates slowly
  until the visitor takes over. Gated on `useTouchDevice()`
  (`(hover: none) and (pointer: coarse)`), **not width**, so a narrow window on
  a laptop keeps its mouse behaviour.
- **Main/accent** left exactly as it was, per instruction: the backend returns
  one list and the app maps it into both.

### Still open

- The **product** page reports one hydration mismatch inside its `Hero`
  subtree — narrowed but not isolated.
- **Google Maps** returns `RefererNotAllowedMapError` on projects and contact:
  the API key's HTTP-referrer allowlist does not include the origin. Production
  needs the real domain listed. The map's failure state now shows properly
  rather than leaving a blank box.

---

## 2026-09-18 — The colour control joins the configurator toolbar

- **One row, one surface.** `ColorPaletreCompact` now renders inside
  `ProductScene`'s glassy `StyledActions` bar, alongside zoom out / reset / zoom
  in — same 44px box, same white fill and radius. **Superseded the same day:**
  the desktop palette was restored to its corner and the compact control is
  narrow-layouts-only — see "Configurator layout corrections" above. `ColorPaletre`
  is referenced again.
- **On a phone it is just the colour.** Below `xsm` the label and chevron drop
  away and the trigger becomes a rectangle of the picked colour.
- **The mode is legible.** Where a product has both palettes the trigger reads
  `Main · <colour>` / `Accent · <colour>`.
- **Error pages** are centred, and the line "It's on our side, not yours —
  nothing you did caused it." is gone from both.

### "Switching between main and accent doesn't work" — measured, and it is data

The control is correct. Driving it through a real browser:

| step | result |
|---|---|
| open in Main | tab `Main` active, 13 options, selected `Material Color` |
| switch to Accent | tab `Accent` active, selection tracked separately |
| pick `#bb1e10` in Accent | trigger → `#bb1e10`, swatch red |
| switch back to Main | trigger → `Material Color`, swatch dark |

Selection is genuinely per-mode. What makes it *look* broken is the content:
`get-product-data` returns **identical `mainColors` and `accentColors`** for this
product (twelve colours, same order, same values), and both material defaults are
named "Material Color". So the list does not change when you switch, and before
this change the only sign anything happened was the tab highlight. The trigger
label now carries the mode; the duplicate lists are a CMS fix.

---

## 2026-09-18 — Failure states, the compact colour picker, and a static hero

A batch of reported defects. ADR-0112 (failure states) and ADR-0113 (a
correction to the bot check).

### Fixed

- **Mega-menu hover images showed nothing happening.** `PlaceholderImage` never
  reset when its `src` changed, so the old image simply sat there until the new
  bytes arrived. It now resets on source change, so a swapping slot shows the
  skeleton again — which is what makes the hover read as a change.
- **The 500 page.** New `src/app/[locale]/error.tsx`: branded, keeps the shell,
  short copy that says it is our fault, retry, a way home, and a **Report this**
  mailto carrying the page URL and the error digest. `global-error.tsx` rewritten
  to match — and **without its `@keyframes` block**, which retires one of the
  standing `verify.sh` failures (5 blocks → 4).
- **Distributors headline overlapped the cards.** The country panel is absolutely
  positioned `rm(440)` wide at `right: rm(50)`; the headline is now capped at
  `calc(100% - rm(480))` above `md` and full width below it, where the panel
  stacks. Type size unchanged.
- **The selected distributor card was black on a dark page.** Now white with
  dark text, tokenised, on both desktop and mobile.
- **The projects map rendered an empty box when it failed.** It now holds its
  space in `colors.mediaPlaceholder` with one line of copy.
- **The colour picker was missing from the configurator below 768px.** New
  `ColorPaletreCompact`: one trigger showing the current colour, opening a sheet
  with the Main/Accent tabs and the swatch list; picking applies and closes.
  Closes on outside tap and Escape, 44px touch targets. The duplicate palette
  that sat below the hero on mobile is gone.
- **The home hero no longer animates in.** Content is present the instant the
  curtain lifts. The headline still renders through `AnimatedGrid` — it is what
  lays the words out, and removing it re-flowed the line breaks — but with
  `from` equal to `to`, so there is no reveal.

### A regression found and removed

`isBot()` (added the same day) checked `navigator.webdriver`. That flag is true
in **any** automation-controlled browser: it silently removed the hero scene
from every Puppeteer screenshot — several verification passes had been looking
at a page with no globe without anyone noticing — and would do the same to a
real visitor whose browser sets it. It did not even catch Lighthouse, which does
not set the flag. Removed; `canRenderWebGL()` covers the real case by testing
capability instead of identity. ADR-0113.

### Media slowness: it is the origin, not the app

Measured against the Strapi host:

| | measured |
|---|---|
| 1.4KB SVG, end to end | **707ms** (TLS handshake alone 470ms) |
| 8.1MB PNG original | TTFB 1.44s, total **3.68s**, ~2.5MB/s |
| `Cache-Control` on immutable, content-hashed uploads | **`max-age=300`** |
| CDN | none — plain nginx, no cache headers from any edge |
| derivative sizes | only a 245px `thumbnail` for a 2940px source |

Every cache miss pays ~0.7s of pure latency before a byte of payload, and the
optimiser must start from the full original every time. The app side is already
doing its part (optimiser, 30-day TTL, real `sizes`, preloaded hero). **The
remaining fixes are on the server**: a CDN in front of `/uploads`,
`max-age=31536000, immutable`, and Strapi's responsive formats enabled.

---

## 2026-09-18 — Lighthouse: four pages scoring 0 → every page measured, SEO 100

Reported: after the loader reveals the page there is another second or two
before content appears; a micro-freeze in the loader animation; and a request to
get every PageSpeed parameter into the green, desktop first then mobile.
ADR-0111.

### The reveal showed an unfinished hero

The curtain waited for the 3D scene but **not for the hero image**, so it lifted
onto a placeholder. And `VideoPlayer` set its poster in an effect, so the poster
was absent from the server-rendered HTML — `priority` had nothing to preload and
the request did not start until **+2.6s**, then took 4.5s to optimise (the
source is an 8.1MB PNG). Now the poster is seeded from the prop, renders
server-side with a `rel=preload fetchPriority=high`, and above-the-fold media
holds the curtain through the new `useRequireMedia`. The reveal shows a finished
hero.

### Loader micro-freeze

Texture uploads ran back to back — a single ~600ms task while the curtain was
animating. Now one upload per frame: during-curtain blocked time **2715ms →
1786ms**, worst task **681ms → 463ms**. Reduced, not eliminated; the rest is JS
parse and the HDR PMREM pass.

### Lighthouse, desktop (production build, warm image cache)

| page | before | after | LCP | TBT | CLS | SEO |
|---|---|---|---|---|---|---|
| home | **0** | **78** | 1.9s | 180ms | 0 | 100 |
| about | 92 | **93** | 1.3s | 140ms | 0 | 100 |
| package | **0** | **91** | 1.6s | 40ms | 0 | 100 |
| lines | 88 | **92** | 1.4s | 40ms | 0 | 100 |
| product | **0** | **92** | 1.4s | 40ms | 0 | 100 |
| distribution | **0** | **83** | 2.5s | 30ms | 0 | 100 |
| article | 88 | **89** | 1.6s | 0ms | 0 | 100 |
| contact | 83 | **85** | 1.9s | 130ms | 0 | 100 |

The four zeros were not a scoring quirk: those pages gate the curtain on a 3D
scene, and **anything without usable WebGL never reports one ready**, so they sat
behind the curtain for the full cap and Lighthouse recorded no LCP at all. Fixed
by `canRenderWebGL()` — never gate on something that cannot happen. **SEO is now
100 on every page type** (was 91–92 on half of them) and CLS is 0 everywhere.

Also: bots never mount a scene (`optimize-3d-scene` §1), home's below-the-fold
globe no longer gates the curtain, and card images carry real `sizes` instead of
`100vw` — Lighthouse estimated 1,126KiB of oversized images before, 62KiB after.

### Lighthouse, mobile — and a rejected theory

| page | perf | LCP | TBT |
|---|---|---|---|
| home | 47 | 9.1s | 780ms |
| about | 60 | 5.5s | 570ms |
| package | 66 | 7.1s | 320ms |
| lines | 67 | 6.7s | 320ms |
| product | 60 | 6.2s | 570ms |
| distribution | 70 | 9.0s | 160ms |
| article | 74 | 6.7s | 110ms |
| contact | 54 | 8.2s | 580ms |

**The loader is not the mobile bottleneck.** Disabling the curtain entirely
moved mobile LCP by ~0.1s (home 9.1→9.0s, about 5.5→5.6s, product 6.2→6.3s).
What costs is **JavaScript**: `bootup-time` **6.0s** at 4× CPU, 300KiB unused JS,
240ms render-blocking, 1,625 DOM elements, and a 1,480ms root-document response.
Mobile green needs bundle work — code-splitting, trimming what three.js/drei
pull in, the vendored text engine, the styled-components runtime — which is its
own piece of work, not a tuning pass. Recorded rather than half-started.

---

## 2026-09-18 — Media placeholders, image delivery, and faster navigation

Reported: the home page still stuttered between the hero and the second section,
media slots showed nothing while loading, images and videos were very slow, and
some page transitions took 3–4s. All four had overlapping causes. ADR-0110.

**The main thread was already clean** — a slow, human-speed scroll through the
top of the home page showed 0 long tasks. What read as a freeze was media
arriving late and popping in.

### What was wrong

| finding | cost |
|---|---|
| Home hero poster set as the raw `<video poster>` attribute | **8.1MB PNG, 3.2s** — the attribute is not optimisable |
| Strapi serves `/uploads` with `Cache-Control: max-age=300` | Next re-fetched and re-encoded the originals **every 5 minutes** |
| `/placeholder.jpg` did not exist | ~1.3s per missing-media slot, on a failing optimise |
| `Header`/`Footer` refetched data they already had as `initialData` | ~1.5s of duplicate requests per page load |
| four mega-menus fetched on mount while closed | ~2s more on the critical path |
| `TransitionBg` waited a fixed 500ms **before** `router.push` | half a second before a navigation even started |
| `MediaComponent`'s image path | no placeholder at all |
| the loader curtain's cap started at **component mount** | on a slow connection hydration is late, so the black screen outlasted the cap |

### Measured, 4× CPU throttle, production build

| | before | after |
|---|---|---|
| home slow scroll | 2600ms freeze | **one 118ms task** |
| navigation (6 header links) | 1672–2396ms | **543–1283ms** |
| `/placeholder.jpg` | 1337ms | **78ms** |
| warm Strapi images | 3240ms | **≤99ms** |
| hero poster transfer | 8.1MB raw | optimised AVIF/WebP at the slot's width |

On a throttled 900kbps connection the hero now shows a grey placeholder block
with the header and headline already readable, instead of empty space.

### Changed

- **New `MediaPlaceholder`** — renders on the first paint, fades out on load, no
  delay timer. Wired into both `MediaComponent` paths and `VideoPlayer`.
- **New `PlaceholderImage`** *(added in the 18th's second pass)* — a drop-in for
  `next/image` for content imagery that does not go through `MediaComponent`.
  Swapped into nine components: `LineCard`, `ArticleCard`, home `Lines`,
  `ProductCard`, package `Overview`, `ProductGallery`,
  `ProductDescriptionSection` and both header mega-menus. The first pass had
  left all of these bare.
- **The placeholder shade is now light and tokenised** — `mediaPlaceholder`
  `#F2F4F8`, `mediaPlaceholderShimmer`, `mediaPlaceholderDark` in `_colors`. The
  first pass defaulted to a near-black block and hardcoded the literals, which
  both read as heavy and broke the no-hardcoded-values rule. `SkeletonLoader`'s
  sweep is now `--color-shimmer` with a white default so one loader works on
  light and dark surfaces.
- **`VideoPlayer` posters go through `next/image`**; `preload="metadata"` on the
  video so it stops competing with the poster for bandwidth.
- **`sizes` is a prop on `MediaComponent`** and `priority` is set on the home
  hero.
- **`images.minimumCacheTTL: 30 days`** in `next.config.mjs`.
- **`public/placeholder.jpg` created** (774 bytes, neutral grey).
- **`Header`/`Footer` no longer refetch** when `initialData` is present.
- **New `onIdle` util**; the four mega-menus use it instead of fetching on mount.
- **`TransitionBg` starts the navigation in the same frame as the curtain.**
- **The curtain cap is measured from navigation start** and is now 5s, not 8s —
  the globe's textures are 20× smaller since ADR-0109, so a scene that has not
  reported ready in 5s is not going to.

### Still open — outside this repo

- Strapi's nginx sends `max-age=300` on content-hashed, immutable upload URLs.
  It should send `max-age=31536000, immutable`.
- Strapi generates only a 245px `thumbnail` for a 2940px source, so the
  optimiser always starts from the full original (some are 8–23MB).
- SVG logos come raw from that origin, ~0.7–1.3s each, above the fold on every
  page. `next/image` passes SVG through unless `dangerouslyAllowSVG` is set,
  which is an XSS consideration for CMS-uploaded files — a team decision.
- `SkeletonImage` and `SkeletonVideo` have no call sites; `SkeletonImage`'s
  `delay = 300` is the opposite of what a placeholder should do. Delete or fix.

---

## 2026-09-17 — The globe's textures were the freeze (correcting the entry below)

The prewarm change below was reported broken from the running site: **distribution
froze on first load, home froze on scroll.** Both were real, both were mine, and
the harness had missed them because it only measured *scroll* windows — a freeze
while the loader curtain is still up is a freeze the visitor still sees.

### What was actually wrong

1. **The warmup gate registered against the wrong scene.** `PlanetModel`
   hardcoded its `SceneType`, but **both globes render the same component** —
   `HomeView`'s `Composition` imports it from `DistributionView/`. Home
   registered its warmup as `distribution`, so home's curtain never waited and
   the texture upload landed on the first scroll. A second, completely
   unreferenced copy of `PlanetModel` sat under
   `HomeView/screens/Globe/components/` and made this look impossible; it has
   been deleted.
2. **Gating the curtain moved the stall, it did not remove it.** On distribution
   the gate worked — and put a 2322ms upload behind a curtain whose logo
   animation then froze for 2.3s.
3. **The prewarm's `catch {}` was silent**, so when `initTexture` was not running
   at all, nothing said so. It now warns outside production.

### The real cost

| file | maps | on disk | VRAM | upload @4× CPU |
|---|---|---|---|---|
| `high_res_earth.glb` | 8000², 8000², **10000²** | 11.2MB | ~900MB | **2250ms** |
| `low_res_earth.glb` | 6000² × 3 | 1.09MB | ~430MB | ~900ms |
| `earth_lights.glb` | 4000² | 184KB | ~64MB | ~290ms |

The 11.2MB model was downloaded **only for its material** — its geometry was
discarded — and the "low-res" fallback was already 6000², so the swap bought
almost nothing visible. The globe renders ~800px tall.

### The fix

All four maps re-encoded at **2048×2048** webp and loaded with `useTexture`
(which suspends, so the existing prewarm uploads them behind the curtain).
`low_res_earth.glb` is kept for its geometry only; `high_res_earth.glb` and
`earth_lights.glb` are no longer fetched. ADR-0109.

| | before | after |
|---|---|---|
| globe texture download | 11.4MB | **548KB** |
| globe VRAM | ~1.4GB | **~67MB** |
| home — blocked after curtain | 3056ms (worst 2600ms) | **0ms** |
| home — worst scroll frame | 2476ms | **42ms** |
| distribution — worst in-curtain task | 2322ms | **637ms** |
| distribution — curtain | 7.77s | **4.10s** |

Across all 13 page types: **zero shader programs linked during scroll**, worst
scroll frame 133ms (home) and ≤50ms everywhere else.

Also removed, because the swap they existed for is gone: `pendingWarmups` /
`beginWarmup` / `endWarmup` on the animation store, and `warmupMaterial`.

### Still open

- The curtain is still ~4-5s at 4× CPU throttle (roughly a third of that
  unthrottled) and is now a *spread* of JS parse, Draco decode, HDR PMREM and
  ~600ms of uploads rather than one stall. `adams.hdr` (1.6MB) and `sky.hdr`
  (1.28MB) are equirect HDRs PMREM'd at runtime; pre-baking them to KTX2
  cubemaps is the next lever.
- The CMS product/package models (8–22MB, uncompressed, slow Strapi origin)
  are unchanged and remain the cold-load cost on those two pages.

---

## 2026-09-17 — Every page rendered again, and the first scroll stopped freezing

Two things, in that order: the site was returning HTTP 500 on every route, and
once it rendered, the first scroll through any page carrying a 3D scene froze.

### The 500 on every route

`next.config.mjs` listed `'axios'` in `serverComponentsExternalPackages`. axios
1.11 is an ESM package, so externalising it made every importer a webpack async
module — including `src/utils/strapi.ts`, and through it `Header`, `Footer`,
`Menu` and both mega menus. Async client references do not resolve in Next
14.2's SSR flight client, so React threw
`Element type is invalid … got: undefined` on the first one. Removing the entry
fixed all 63 prerendered pages and all five locales. See [[decisions-log]]
ADR-0106.

### First-scroll micro-freezes

Baseline, production standalone build, warm HTTP cache, 4× CPU throttle, two
wheel-driven scroll passes per page:

| page | worst scroll frame | scroll long-tasks | programs linked mid-scroll |
|---|---|---|---|
| home | **2476ms** → **33ms** | 4941ms → **57ms** | 5 → **0** |
| distribution | 24.9ms → **18.5ms** | 127ms → **0ms** | 6 → **0** |
| package | 25.8ms → 26.7ms | 0 → 0 | 12 → **0** |
| product | 18.1ms → 18.6ms | 0 → 0 | 11 → **0** |

Home lost all six of its "bad" (>100ms) frames. On a **cold** cache the first
measurement also showed 1.7s (product) and 2.3s (package) blocks; those pages are
network-bound rather than compile-bound — see the open items below.

What changed:

- **Scenes mount at page load, not at `rootMargin: 100px`.** [[hooks]]
  `useLazyScene` now returns `shouldLoad: true` always; the observer still drives
  `isInView` → `frameloop`, so an off-screen scene is warm but draws nothing.
- **The loader curtain waits for the scene.** New `useRequireScene` lets a view
  declare the scene it owns; `Loader` hands off on *min 1s · scenes ready · cap
  8s* instead of a hardcoded `setTimeout(…, 1000)`.
- **`useSceneReady` actually prewarms** — `initTexture` for every texture,
  `compileAsync` for every program, one throwaway render — instead of polling
  `gl.info` and guessing 500ms after the first frame.
- ~~**The high-res earth swap is warmed before it is assigned.**~~ **Superseded**
  — the swap itself was removed; see the entry above and ADR-0109.
- **DPR is clamped and the renderer flags are tiered** — new
  `src/utils/deviceTier.ts`, read once at construction by all four canvases:
  mobile `[0.75, 1]` + `antialias: false`, tablet `[0.75, 1.25]`, desktop
  `[0.75, 1.5]` + `powerPreference: "high-performance"`. Previously no scene set
  `dpr` at all, so a 3× phone rendered ~9× the fragments.
- **The Draco decoder is served from `public/draco/`** instead of
  `gstatic.com`, and the two `rel="prefetch"` links in `src/app/layout.tsx` that
  warmed the gstatic connection are **removed** — they were pulling ~750KB
  cross-origin on all thirteen page types, nine of which carry no 3D at all.
  ADR-0108.
- **The grid breakpoints moved to `src/styles/grid/breakpoints.ts`** so
  `deviceTier.ts` reads the same numbers `media.*` switches on rather than
  repeating them. `initSmartCSSGrid` is now pinned to `<Grid>` — `grid` and
  `related` share one type parameter, and inferring from the narrower `related`
  drops `media.lg`. Verified identical: root font-size at 1920/1440/900/390/320
  and no horizontal overflow at any of them.

The trade, stated plainly: the curtain is longer. Home 2.16s → 4.95s,
distribution 3.53s → 4.10s (4× CPU throttle; roughly a third of that
unthrottled). ADR-0107. **Superseded in part — see the entry above: the first
version of this shipped two regressions.**

### Measurement notes

Three readings had to be thrown away before these numbers held, and the reasons
are worth keeping:

- A first "after" run looked clean because a bug in the new hand-off effect
  meant the curtain never lifted at all — `isLoaded` was in the effect's
  dependency array, so setting it re-ran the effect and the cleanup cleared its
  own pending timer. **Screenshot the page; do not trust the counters alone.**
- The product and package models come from Strapi at ~750KB/s (the package model
  is 8.4MB / 11s cold), so a cold-cache run measures that download, not the
  compile work. The harness grew a `--warm` mode for this.
- The harness drives a **real, GPU-backed Chrome** — headless falls back to
  SwiftShader, which makes every GPU-side number meaningless. To keep it off the
  operator's screen it launches with `--window-position=-4000,-4000` plus
  `--disable-features=CalculateNativeWinOcclusion` (without the second flag an
  offscreen window gets occlusion-throttled and the frame numbers are wrong).
- The harness settled a fixed 4s after `load`, which used to outlast the 1.1s
  curtain and no longer does; the page's normal entrance work then fell inside
  the first scroll window and read as jank that was not there. It now settles
  from the curtain lift.

### Still open

- ~~`public/models/high_res_earth.glb` is 11.2MB…~~ **Done — see the entry
  above.** The maps ship at 2048² and the model is no longer fetched. ADR-0109.
- The CMS-hosted product and package models (8–22MB, uncompressed delivery from
  the Strapi host) are the cold-load cost on those two pages. A CDN in front of
  Strapi, plus `--texture-compress ktx2` on export, is the fix.
- Skill §4/§5 (one shared rAF ticker, per-tier frame budget) remains open —
  ADR-0103.
- Skill §8 (one key light + IBL) was **not** done: home and distribution each run
  `ambientLight` + `directionalLight` + an HDR `Environment`, and product adds a
  `pointLight`. Cutting them is a visible look change with no measured win here,
  so it was left alone deliberately.

---

## 2026-09-17 — Scroll-performance investigation (paused, no code changed)

Audited the project against the `optimize-3d-scene` skill, installed
dependencies, and produced a production build. **No application code was
changed** — every file touched during diagnosis was restored.

**Blocked:** the app returns HTTP 500 on every page in both dev and production
(`Element type is invalid ... got: undefined`), narrowed to `Header` and
`Footer` independently. No measurement was possible. See [[baseline-debt]].

**Established without measuring:** the loader preloads and compiles nothing (its
asset lists are commented out and its progress is a hardcoded 1s timer), and the
four WebGL scenes are constructed mid-scroll at `rootMargin: 100px` — together
these explain the reported first-scroll micro-freezes. No scene clamps `dpr`.

**Profile fix:** `commands.start` was `yarn start`, which cannot run this
project — `next.config.mjs` sets `output: 'standalone'` and Next refuses. It now
records the real standalone command. See [[stack-profile]].

A measurement harness (puppeteer-core, two scroll passes per page, long tasks +
frame deltas + WebGL program-link timestamps) was written but not yet run; its
location and the resume plan are in `PERF-SESSION-HANDOFF.md`.

---

## 2026-09-17 — Vault rewritten against the codebase

The notes inherited from the kit described an *ideal* project, not this one. Every
note was rewritten from the source, so the vault is now a description of what is
actually in `src/`.

**Rewritten from code:** [[motion-system]] (real props, defaults and the two
gates) · [[text-motion]] · [[text-engine-reference]] (the local 1381-line
`TextEngine`, replacing the kit's reference for an npm package that is not
installed) · [[motion-bindings]] · [[smooth-scroll]] · [[design-system]] ·
[[component-conventions]] · [[html-semantics]] · [[seo-metadata]] ·
[[routing-views]] · [[system-overview]] · [[data-flow]] · all four backend notes
· all eleven workflows · all three templates · [[meta/README]] and the MOC.

**Errors in the first pass, corrected:**

- The shell does **not** use `CanvasLayout`/`tunnel-rat` — both are unused
  leftovers. Each of the four scenes mounts its own `<Canvas>` with
  `useLazyScene` and a `frameloop` toggle.
- There are **eight** zustand stores, not two, and the two most important pieces
  of state (`fullyLoaded`, `isRerouting`) are **React context**, not zustand.
- 23 API route handlers, not 21. 14 hooks, not 15. 609 redirects, not 614.
- [[data-flow]] and [[system-overview]] still described a single shared
  ticker — the thing ADR-0103 exists to say this project does *not* have.

**Found while reading the source** (added to [[baseline-debt]] and the relevant
notes):

- `createMetadataGenerator` builds OG image URLs as `/api/media…`, an endpoint
  that does not exist — every Strapi-sourced OG image 404s.
- Product schema emits an empty `offers.url` — `ProductView` is a client
  component reading `window.location.href`, which is `''` in the server render.
- `get-contact-data` is a route with no callers — the one dead endpoint.
- The Organization schema ships an **empty `sameAs`** — social profiles are
  commented out.
- `Handle` accepts a `tag` prop and ignores it, always rendering a `div`.
- `useLoop`'s default `framerate` is 100ms — 10fps — and callers must override it.
- `SpringTrigger` always renders a second nested element (`innerTag`).
- `TextEngine`'s `columnGap` is inert on multi-word text; spacing is a fixed
  `0.25em` span.
- No `prefers-reduced-motion` handling exists anywhere in the codebase.

**Convention change:** the kit's neutrality rule was dropped deliberately —
notes name real files, real components and real bugs. Recorded in
[[meta/README]]. The cost is that notes now go stale on refactor, which the
maintenance rules and the `Stop` hook exist to catch.

---

## 2026-09-17 — AI Design Vault installed and adapted to Next.js 14

The kit was dropped into an existing, shipping codebase and fitted to it. **No
application code was changed** — the architecture as it stands is the reference,
and the system was written around it.

**Installed:** `obsidian/`, `.claude/`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`.

**Adapted** (`/adapt`): `.claude/stack.json` now records Next.js 14.2.23 App
Router, server-components render model, TypeScript, yarn, and the real paths —
`src/app` routes, `src/views` views, `src/app/api` server, `src/styles` tokens,
`src/components/{Springs,Text}` protected. Bindings: `@react-spring/web`, the
local `TextEngine`, `lenis`, `zustand`, `styled-components`, `next/*`. Profile:
[[stack-profile]].

**All six path-scoped rules in `.claude/rules/` were rewritten** to describe this
codebase — its token system, its route shape, its Strapi API layer, its vendored
engines — instead of the kit's framework-neutral defaults.

**Extended the kit:** added `paths.routeAllowedImports` to the schema and
`verify.sh` so route-level data/metadata/SEO imports pass while a UI import in a
route still FAILs (ADR-0102).

**Decisions recorded:** ADR-0101 (two-tier styled-components tokens, not three
CSS tiers) · ADR-0102 (route import allowlist) · ADR-0103 (no shared ticker —
recorded, not refactored) · ADR-0104 (missing env module is open debt) ·
ADR-0105 (Springs + Text are vendored).

**Documented:** [[site-map]] (route → view → endpoint, new), [[baseline-debt]]
(new), [[tech-stack]], [[folder-structure]], [[environment-variables]],
[[components]], [[hooks]], [[utils]].

**Root entry points:** `README.md` gained a pointer block to the vault, the stack
profile and `verify.sh`, with the next14-starter's original docs demoted to an
appendix. `AGENTS.md` gained a project header and a pointer to the three standing
deviations (ADR-0101/0103/0104) so an agent does not "fix" a known FAIL.

**Baseline:** `verify.sh` reports 4 FAIL / 6 WARN / **0 SKIP**. Zero skips means
the profile is complete. Every FAIL is real and itemised in [[baseline-debt]].

---

## Baseline — the kit as delivered

The project starts with the AI Design Vault kit installed:

- `obsidian/` — this vault: conventions, decisions, playbooks (framework-neutral
  as delivered; rewritten against this codebase the same day)
- `.claude/` — the execution layer: hooks, path-scoped rules, skills, agents,
  slash commands, `verify.sh`, and `stack.json`
- Root entry points: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`

Unlike a fresh install, this one arrived into a codebase that was already
shipping: five locales, fifteen pages, four WebGL scenes and a Strapi backend.
Nothing about the application was inherited from the kit and nothing about it was
changed by the kit. What was inherited is the way of working: spring motion
through one binding, routes delegating to views, server-first rendering, semantic
SEO-correct markup, and verification before anything is called done.
