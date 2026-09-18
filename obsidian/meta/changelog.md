---
tags: [meta, changelog]
updated: 2026-09-17
---

# Changelog

Notable changes to **this project**. Newest first. One entry per meaningful
change: dependencies, architecture, conventions, launches.

Format: `## YYYY-MM-DD — short title` followed by what changed and why it
mattered. Link the ADR when there is one.

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
