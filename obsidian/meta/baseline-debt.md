---
tags: [meta, todo, stable]
updated: 2026-09-17
---

# Baseline Debt

What `.claude/scripts/verify.sh` reports on the codebase **as it was when the
vault was installed** (2026-09-17), with a judgement on each. This exists so the
first FAIL anyone sees is understood rather than ignored — and so the list can
only shrink.

> Baseline: **4 FAIL · 6 WARN · 0 SKIP**. Zero SKIPs means the stack profile is
> complete — every check that could apply, applied.

## FAILs

### 1. Env vars read outside a validated module — ~30 sites

Every `process.env.API_URL` in `src/app/api/*`, plus `RESEND_API_KEY`,
`RECIPIENT_EMAIL`, `TELEGRAM_*`. **Real.** The reads themselves are server-side
and safe; what is missing is one module that validates them at boot. ADR-0104.
Fixing this also fixes the `NEXT_PUBLIC_BASEURL` / `NEXT_PUBLIC_BASE_URL`
mismatch — see [[environment-variables]]. **Highest value fix in the repo.**

### 2. Explicit `any` — ~20 sites

`src/app/sitemap.ts`, `src/utils/{createMetadataGenerator,getMediaStrapiPath,strapi,math,generateStructuredData}.ts`,
`src/styles/{utils.ts,grid/grid.tsx}`. **Real, and hidden**: `.eslintrc.json`
disables `@typescript-eslint/no-explicit-any`, so `yarn lint` passes over all of
it. Most of these are Strapi response shapes; typing them in `src/types/` would
retire the majority at once. The two in `src/styles` are generic-helper
internals and are defensible.

### 3. CSS `@keyframes` — 4 blocks

*(was 5 — `global-error.tsx`'s `fadeIn` went when that page was rewritten,
ADR-0112.)*

| File | What |
|---|---|
| `src/components/Skeleton/SkeletonLoader.tsx` | `shimmer` |
| `src/components/FullScreenPlayer/FullScreenPlayer.tsx` | `spin` |
| `src/views/DistributionView/components/CountryPanel/CountryPanelMobile.tsx` | `fadeIn`, `slideUp` |

**Legacy, low risk.** Three are indefinite loaders/spinners, which is the one
case a keyframe genuinely suits; the two in `CountryPanelMobile` are entrance
animations and should become `Inview`/`Spring`. Do not add a sixth. Migrate one
when you are already editing its file.

### 4. Hardcoded colour in an inline style — 2 sites

`HomeView/screens/Lines/components/Preview.tsx:179` and
`PackageView/components/Overview/components/ProductPreview.tsx:135` — both
`backgroundColor: '#EAECF2 !important'`. **Real and trivial**: add the value to
`_colors` in `src/styles/colors.ts` and use `colors.*`.

## WARNs

| Warning | Count | Judgement |
|---|---|---|
| `"use client"` on a view | 10 | **Real.** `HomeView`, `AboutView`, `ArticlesView`, `ContactView` and several `ProductView` pieces are client components wholesale. Each one drags its entire subtree into the bundle. Split the leaf that needs interactivity when you next touch one; do not add an eleventh. |
| `console.log` in source | ~40 | Was mostly `src/app/sitemap.ts` (deleted 2026-09-29 with its logging; the route-based sitemap replaced it) and the middleware. `removeConsole` strips the rest in production builds — noise hygiene, not a leak. |
| Click handler on a non-interactive element | 11 | **Real accessibility bug.** The 3D zoom controls in `ProductScene`/`PackageScene`, the menu items in `Header/Menu.tsx`, and the policy checkbox rows in both contact forms are `div`/`span` with `onClick` — not keyboard reachable. Make them `<button>`. |
| Raw `<a>` for an internal link | 1 | `src/components/Cookie.tsx:68` → `/privacy-policy`. Also missing the locale prefix. Use `next/link`. |
| Hex literal in source | ~25 | `not-found.tsx` and `global-error.tsx` style themselves inline on purpose — they must render when the app shell is broken. Acceptable; the rest are WebGL material colours, which the rule explicitly allows. |
| TODO / FIXME | 3 | `SwiperFrameByFrame.tsx`, `Degree360.tsx`, `useDynamicInView.ts`. |

## Not caught by any check, found during adaptation

- **`NEXT_PUBLIC_BASEURL` vs `NEXT_PUBLIC_BASE_URL`** — canonical URLs, hreflang,
  sitemap, robots and OG tags all fall through to a hardcoded literal.
  [[environment-variables]].
- **Unvalidated request bodies** in `src/app/api/send/route.ts` and
  `send-main/route.ts` — destructured straight from JSON and interpolated into
  an HTML email. No validation library is installed.
- ~~**`src/app/api/proxy-media/route.ts` fetches an arbitrary `url` parameter**
  with no host allowlist.~~ **Fixed 2026-09-29** — allowlisted to the Strapi
  hosts, streams instead of buffering, forwards `Range`.
- **`.eslintrc.json` disables** `no-explicit-any`, `no-unused-vars`,
  `no-unused-expressions`, `ban-ts-comment` and `prefer-const` — `yarn lint` is
  a much weaker gate than it looks. Treat `verify.sh` as the real one.
- **Both `yarn.lock` and `package-lock.json` are committed.** yarn is the
  maintained one.
- **No `.env.example`, no `engines`/`.nvmrc`, no tests.**

## Found by reading the source (2026-09-17)

Bugs and surprises no check catches. Each is also noted in its topic note.

| Finding | Where | Effect |
|---|---|---|
| ~~OG image URLs point at `/api/media`, which does not exist~~ **fixed 2026-09-29**: OG images now point straight at the Strapi upload | `utils/createMetadataGenerator.ts` | was: every Strapi-sourced OG image 404s |
| Product schema emits an empty `offers.url` | `views/ProductView/ProductView.tsx` | built from `window.location.href` in a client component → `''` in the server-rendered JSON-LD |
| `get-contact-data` endpoint has no callers | `app/api/get-contact-data/` | dead route |
| Organization schema has an empty `sameAs` | `app/[locale]/layout.tsx` | social profiles are commented out; weakest possible entity signal |
| `Handle` accepts `tag` and ignores it | `components/Springs/Handle.tsx` | always renders a `div`; unusable where semantics matter |
| `useLoop` defaults to `framerate: 100` | `hooks/useLoop.ts` | 10fps unless the caller overrides it |
| `SpringTrigger` always nests `innerTag` | `components/Springs/SpringTrigger.tsx` | two elements render; `className` lands on the outer one |
| `columnGap` is inert on multi-word text | `components/Text/TextEngine.tsx` | word spacing is a hardcoded `0.25em` span |
| No `prefers-reduced-motion` handling anywhere | all of `src/` | accessibility gap; the fix lives inside protected files |
| `src/layouts/CanvasLayout/` + `tunnel-rat` unused | — | dead code and a dead dependency |
| Unused `.glb`/`.hdr` assets in `public/models` | `test.glb`, `earth_old.glb`, `solar.glb`, `testHdr2-5.hdr`, and now `high_res_earth.glb` (11.2MB) + `earth_lights.glb` | deployed but not fetched. The last two are deliberately kept as the source art the 2K globe maps were cut from (ADR-0109); the rest are just dead weight |
| `public/cesium/` copied into the build | `copy-webpack-plugin` in `next.config.mjs` | confirm it is still used; large if not |
| `useSpringTriggerDepricated.ts` still present | `src/hooks/` | 305 lines of dead code |
| Product page still fails hydration | `ProductView/components/Hero` subtree | React #418/#423 remain on that one page; the other twelve are clean. Narrowed to Hero's children, not isolated. ADR-0114 |
| Google Maps `RefererNotAllowedMapError` | projects + contact | the API key's HTTP-referrer allowlist does not include the serving origin. Production must list the real domain; the map's failure state is designed now (ADR-0112) so it degrades cleanly |
| Product CMS returns identical `mainColors` and `accentColors` | Strapi product content | measured on `mb-729-vertical-press`: twelve identical colours in both lists, and both material defaults named "Material Color". Switching mode therefore changes nothing visible in the list — a content fix, not a code one |
| `SkeletonImage` / `SkeletonVideo` unused | `src/components/Skeleton/` | no call sites. `SkeletonImage` also delays revealing the image by 300ms, which is what a placeholder should never do. Media now goes through `MediaPlaceholder` (ADR-0110) |
| Strapi serves `/uploads` with `Cache-Control: max-age=300` | nginx on the Strapi host | content-hashed URLs should be `max-age=31536000, immutable`. Mitigated app-side with `images.minimumCacheTTL`, but the browser still re-validates every 5 minutes |
| `NEXT_PUBLIC_SUPPORT_EMAIL` is unset | both error pages | they fall back to `info@streetbarbell.com`, which is a **guess**. Set it. ADR-0112 |
| Mobile Lighthouse is 47–74, bound by JavaScript | whole app | `bootup-time` **6.0s** at 4× CPU, 300KiB unused JS, 240ms render-blocking, 1,625 DOM elements, 1,480ms root response. The loader curtain was **measured and ruled out** (disabling it moves mobile LCP ~0.1s). Needs bundle work — code-splitting, what three.js/drei pull in, the vendored text engine, the styled-components runtime. ADR-0111 |
| Hydration never completes under CDP network throttling | whole app | At ≤3000kbps emulated bandwidth the loader curtain never lifts — `Loader`'s mount effect never runs, so its timers never fire, on `/en/lines` and `/en/contact` (but not `/en/privacy-policy`). **Verified against commit `6f57977`, so it pre-dates the 2026-09-18 media work.** Unthrottled it is fine. Either a real slow-connection hydration problem or an artefact of `Network.emulateNetworkConditions`; it makes throttled measurement unreliable, so use request-level delays instead (`perf/delayimg.mjs`) |
| Strapi generates only a 245px `thumbnail` format | Strapi upload config | a 2940px source has no intermediate sizes, so Next's optimiser always starts from the full original — several are 8–23MB |

## ~~Blocking: the app does not render~~ — fixed 2026-09-17

Every page returned HTTP 500 in dev and in production with
`Element type is invalid … got: undefined`, while `yarn build` exited 0.

**Cause:** `next.config.mjs` listed `'axios'` in
`experimental.serverComponentsExternalPackages`. axios 1.11 is an ESM package, so
externalising it made every importer an async webpack module — `src/utils/strapi.ts`,
and through it `Header`, `Footer`, `Menu` and both mega menus, which are
`'use client'`. Async client references do not resolve in Next 14.2's SSR flight
client. `Header` and `Footer` looked guilty because they were the first two such
modules the layout rendered; neither was at fault. The npm-vs-yarn lockfile
theory was wrong — both resolve axios 1.11.0.

**Fix:** remove the entry. All 63 prerendered pages and all five locales render.
See [[decisions-log]] ADR-0106.

## ~~Scroll performance: the loader warms up nothing~~ — fixed 2026-09-17

The loader was a fixed ~1.1s curtain that preloaded nothing (`useLoadAssets` was
called with every asset list commented out; `Loader.tsx` ignored `progress` for a
hardcoded `setTimeout(…, 1000)`), and `useLazyScene` mounted each `<Canvas>` at
`rootMargin: 100px`, so GLTF decode, HDR load, shader compile and texture upload
all landed on a scroll boundary.

Both are fixed — scenes mount at page load and the curtain waits for them to
finish prewarming. Measured before/after in [[changelog]]; the trade and the
remaining asset-side work are in [[decisions-log]] ADR-0107.

**What is still true:** `useLoadAssets` remains called with empty lists. It is now
unused rather than misleading — the curtain is driven by scene readiness, not by
its `progress`. Either give it the page's hero images or delete it.


## Rules for this note

1. Fix something → delete its entry here in the same change.
2. `verify.sh` reports something new → it is a regression, not baseline. Fix it;
   do not add it here.
3. A FAIL that is genuinely wrong for this project → an ADR, not an entry here.

## Related

[[decisions-log]] · [[qa-verification]] · [[changelog]] · [[environment-variables]]
