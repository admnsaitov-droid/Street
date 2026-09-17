---
tags: [architecture, stable]
updated: 2026-09-17
---

# Tech Stack

Every dependency, what it does, and why it is here. The authoritative
machine-readable list is `package.json`; this note is the *why*.

## Core framework

| Package | Version | Role |
|---|---|---|
| `next` | 14.2.23 | App Router, server components, API routes, image optimisation, metadata API |
| `react` / `react-dom` | 18 | — |
| `typescript` | 5 | `strict: true`; `@/*` → `src/*` |
| `next-intl` | 4.3.4 | Locale-prefixed routing (`/[locale]/…`) + middleware. Locale list: [[routing-views]] |

> [!warning] Next 14.2, not 15
> `params` is typed as a `Promise` in this codebase's page signatures and pages
> are awaited accordingly. Verify any routing, metadata or middleware API against
> the installed version before writing it.

## Styling

| Package | Version | Role |
|---|---|---|
| `styled-components` | 6.1 | All component styling; SSR via `StyledComponentsLayout` + `compiler.styledComponents` |

Tokens and the `rm()` responsive-scaling grid: [[design-system]].
Fonts: Onest + Golos Text (`next/font/google`) and Sage Grotesk (local woff2),
bound to `--font-*` in `src/app/layout.tsx`.

## Motion — the heart of the kit

| Package | Version | Role |
|---|---|---|
| `@react-spring/web` | 9.7 | Spring physics — drives **all** motion |
| *(vendored)* `src/components/Text/TextEngine.tsx` | — | Split-text engine: line/word/char reveal, scroll progress, SEO copy |
| `lenis` | 1.1 | Smooth scrolling, driven from `ScrollLayout` |
| `@react-hook/window-size` | 3.1 | Shared window-size subscription |
| `resize-observer-polyfill` | 1.5 | ResizeObserver floor for older Safari |

No second animation library, no CSS keyframes (ADR-0002, and the five legacy
exceptions in [[baseline-debt]]). See [[motion-system]] and [[motion-bindings]].

## 3D / WebGL

| Package | Version | Role |
|---|---|---|
| `three` | 0.172 | Renderer for the four scenes (home globe, distribution globe, product, package) |
| `@react-three/fiber` | 8.17 | React renderer for three.js |
| `@react-three/drei` | 9.121 | Loaders, controls, helpers. `useGLTF` defaults its Draco decoder to Google's CDN — every call site here passes `DRACO_DECODER_PATH` instead. ADR-0108 |
| `tunnel-rat` | 0.1 | ⚠️ **unused** — nothing imports it. Pairs with the equally unused `src/layouts/CanvasLayout/`. Removable |
| `leva` | 0.10 | Dev-only scene tweaking — must never be visible in production UI |

Scenes load through `next/dynamic` with `ssr: false` (`DynamicScene`,
`DynamicProductScene`, `DynamicPackageScene`). Readiness is tracked per scene in
`src/animationStore`. Before any performance work: [[optimize-3d-scene]].

**Vendored, not a dependency.** `public/draco/` holds `draco_decoder.js`,
`draco_decoder.wasm` and `draco_wasm_wrapper.js`, copied from
`node_modules/three/examples/jsm/libs/draco/gltf`. **Refresh them whenever
`three` is upgraded** — a decoder from a different three generation is the kind
of breakage that only shows up on one compressed model. ADR-0108.

Per-tier DPR and renderer flags come from `src/utils/deviceTier.ts`; the prewarm
that keeps compilation off the scroll path is `src/utils/warmupScene.ts`. See
[[utils]] and ADR-0107.

## State, data & integrations

| Package | Version | Role |
|---|---|---|
| `zustand` | 5.0 | Two stores — UI/loading/player/colour, and per-scene readiness ([[data-flow]]) |
| `axios` | 1.11 | Strapi calls from `src/app/api/*` and `src/utils/strapi.ts`; externalised via `serverComponentsExternalPackages` |
| `resend` | 4.7 | Contact-form email |
| `swiper` | 11.2 | Galleries and mobile carousels |
| `react-cookie-consent` | 9.0 | Cookie banner, styled in `GlobalStyles` |
| `@googlemaps/js-api-loader` | 1.16 | Contact-page map — see `GOOGLE_MAPS_SETUP.md` |
| `sharp` | 0.34 | Image optimisation in the standalone build |

**No validation library is installed.** Request bodies are destructured
unvalidated — see ADR-0104 and [[api-architecture]].

## Tooling

| Package | Role |
|---|---|
| `eslint` 8 + `eslint-config-next` | `next/core-web-vitals` + `next/typescript` |
| `copy-webpack-plugin` | Copies Cesium assets into the build |

> [!warning] The lint config disables the rules this kit relies on
> `.eslintrc.json` turns off `no-explicit-any`, `no-unused-vars`,
> `no-unused-expressions`, `ban-ts-comment` and `prefer-const`. `yarn lint`
> therefore passes over exactly the things `verify.sh` FAILs on. Treat
> `verify.sh` as the real gate until that is revisited.

## Build & runtime

`output: 'standalone'`, `swcMinify`, `compress`, `poweredByHeader: false`,
`removeConsole` in production. Remote image hosts are pinned in `next.config.mjs`
(localhost:1337, `153.92.1.45:1337`, and `NEXT_PUBLIC_IMAGE_URL`). No `engines`
field or `.nvmrc` — the Node floor is unpinned.

## Deliberately held back

| Package | Held at | Why |
|---|---|---|
| `next` | 14.2.23 | The app is written against 14.2 App Router semantics; a 15/16 move is a planned migration, not a bump. Re-run `/adapt` after it. |
| `three` + `@react-three/fiber` | 0.172 / 8.x | R3F 9 requires React 19. Locked together with the React 18 floor. |

## Not installed — decided per project

| Need | Choice | Playbook |
|---|---|---|
| CMS | **Strapi** (external, self-hosted) | [[cms]] · [[site-map]] |
| Database | none in this repo — Strapi owns it | [[database]] |
| Auth | none — public marketing site | `auth` skill |
| Analytics | Google Tag Manager (`NEXT_PUBLIC_GTM_ID`) | — |
| Email | Resend + a Telegram mirror | [[api-architecture]] |
| Testing | none | — |

## Related

[[stack-profile]] · [[system-overview]] · [[motion-bindings]] · [[baseline-debt]]
