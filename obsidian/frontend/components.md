---
tags: [frontend, catalog, stable]
updated: 2026-09-17
---

# Component Catalog

Every shared component in `src/components/`, what it is for, and how to use it.
A component added without an entry here is an incomplete change.
Placement rules: [[component-conventions]] · [[folder-structure]].

## 🔒 Motion primitives — `src/components/Springs/` (protected)

The contract is in [[motion-system]]. **Do not edit these files** — wrap them.

| Component | Props of note | Use it for |
|---|---|---|
| `Spring` | `enabled`, `from`, `to`, `tag` | any state-driven tween |
| `Inview` | `mode: always \| once \| forward`, `delayIn/Out`, `trigger`, `innerTag`, `disableOnMobile` | reveal on entering the viewport |
| `SpringTrigger` | `mode: scrub \| toggle`, `start`, `end`, `onChange`, `frameInterval` | scroll-driven motion |
| `ProgressTrigger` | `onChange` | raw scroll progress, no styling |
| `Hover` | `from`, `to` | hover — auto-disabled on touch |
| `Handle` | — | smooth swap when children change |
| `config.ts` | `springsConfig.mobileWidth`, `disableOnMobile.*` | the one place mobile gating is configured |

All of them gate on `useAssetsLoader().fullyLoaded` and `useIsRerouting()` — they
stay still until the loader is done and freeze during page transitions. Every one
takes `tag` / `innerTag`: pass the real semantic element.

## 🔒 Text motion — `src/components/Text/` (protected)

| Component | Use it for |
|---|---|
| `TLine` | **the default.** `TextEngine` pre-configured with the house line reveal (y 100→0, 80ms stagger, 1200ms easeOutCubic, overflow clip) |
| `TextEngine` | direct use when you need line/word/char control, custom staggers, or a non-default mode |
| `TextProgress` | text driven by scroll progress rather than a trigger |

Both keep an SEO copy of the text in the DOM (`seo`, `showSeoText`) — that is
what keeps animated headings crawlable. Traps: [[text-motion]]. Full API:
[[text-engine-reference]].

## Project motion wrappers — `src/components/animated/`

Built **on** the engine; this is where project-specific motion belongs.

| Component | Purpose |
|---|---|
| `AnimatedText` | text reveal with project defaults |
| `AnimatedContent` | generic content reveal (`AnimatedGrid`). Rows only exist after client-side measurement, so until they do it renders a visually-hidden plain-text copy of its children (rows container `aria-hidden` meanwhile) — that copy is what the server HTML and non-JS crawlers see. Once the rows render the copy is dropped and the rows are exposed, so the rendered DOM holds the text once (it used to read "Title Title") |
| `AnimatedTranslate` | translate-in wrapper |
| `AnimatedDivider` | line that draws itself in |
| `AnimatedLink` / `UnderlineLink` | link with hover underline motion |
| `MaskImageAppear` / `ScaleImageAppear` | image reveals (mask wipe / scale) |
| `AccordionText` | expand/collapse copy |

## UI primitives — `src/components/Ui/`

| Component | Notes |
|---|---|
| `buttons/BlueButton` · `WhiteButton` · `SimpleButton` | the three house buttons |
| `Inputs/ContactInput` · `SimpleInput` · `SimpleTextarea` | form controls. Default ids come from `useId()` (never `Math.random()`, which differed between server and client and broke `<label htmlFor>`) |
| `checkbox/SimpleCheckbox` | — |

## Shared infrastructure

| Component | Purpose |
|---|---|
| `Header/` | header, `Menu`, `LanguageSelect`, and the `MegaMenus/` (products + packages, desktop and mobile) with `FadeContainer` for the backdrop |
| `Footer/` | site footer, receives `initialData` from the locale layout |
| `ContactForm/` | the global contact form rendered after every page's content |
| `Modals/SuccessModal` · `ErrorModal` | form result, driven by the zustand store |
| `FullScreenPlayer/` | global image/video lightbox with gallery paging, driven by the store |
| `MediaComponent/` | picks image vs video, routes media URLs, and owns the loading placeholder. Takes `priority` (above-the-fold), `sizes` — **pass `sizes`**, or `fill` images ask the optimiser for the largest device width — and `placeholderTone` (`dark` only for slots over dark art, e.g. the home hero video) |
| `Skeleton/MediaPlaceholder` | the shade that holds a media slot from the first paint until the image or video is ready. No delay timer; it fades out on load. `tone="dark"` for slots over dark art. Positions itself absolutely, so **the parent must be positioned** |
| `Scene/SceneGestureHint` | the "use two fingers to rotate" overlay for touch devices, in the style map embeds use. One finger scrolls the page, two drive the scene; this explains that the first time someone tries one. `pointer-events: none` — it only watches |
| `Skeleton/PlaceholderImage` | **use this instead of a bare `next/image`** for content imagery. A drop-in that renders the placeholder and the image as *siblings* — no wrapper element, so it swaps in without touching a layout rule. **Resets on `src` change**, so a slot that swaps image (the header mega-menus, on hover) shows the skeleton again rather than the stale one |
| `ProductView/.../ColorPaletreCompact` | the colour picker for **narrow layouts** (≤`md`). Renders inside `ProductScene`'s glassy toolbar next to the zoom buttons: one trigger, a sheet with Main/Accent tabs and swatches, closes on select, outside tap or Escape. Below `xsm` the label and chevron drop and it becomes a rectangle of the picked colour. Where a product has both palettes the label carries the mode (`Main · …`), because several products return identical main and accent lists |
| `ProductView/.../ColoPaletre` (`ColorPaletre`) | the always-open palette in the corner of the configurator, **desktop only** (above `md`). Narrow layouts use `ColorPaletreCompact` in the scene's toolbar instead |
| `Skeleton/VideoPlayer` | video + poster. The poster goes through **`next/image`**, never the `<video poster>` attribute — as an attribute the browser fetches the Strapi original (8.1MB for the home hero). Takes `priority`, `sizes` and `placeholderTone`. The poster state is **seeded from the prop, not set in an effect** — as effect-set state it was missing from the SSR HTML, so `priority` had nothing to preload and the request started 2.6s late (ADR-0111) |
| `Skeleton/` (rest) | `SkeletonIcon`, `SceneSkeleton` in use. **`SkeletonImage` and `SkeletonVideo` have no call sites** — dead code, and `SkeletonImage` carries a `delay = 300` that is the opposite of what a placeholder should do |
| `StructuredData/` | renders the JSON-LD graph; used at routes and the layout |
| `Breadcrumbs/` | breadcrumb trail + its `BreadcrumbList` schema. Takes `tone` — pass `"dark"` on a hero that sits on a dark surface (distributors), or the current-page label is black on black. The trail inherits the colour; links dim with opacity |
| `ScrollRevealWrapper/DynamicScrollRevealWrapper` | wraps page content in the scroll-reveal behaviour, dynamically imported |
| `LinesGrid/` | the lines grid + `LineCard` / `LinesInfoCard`, shared by home and the lines page |
| `FrameByFrame/` | scroll- and drag-driven frame sequences: `FrameByFrame`, `Degree360`, `SwiperFrameByFrame`, canvas 2D/WebGL painters, `Placeholder` |
| `Clouds/SphereClouds` | the cloud shell used by both globes |
| `Cookie` | cookie-consent banner (styled in `GlobalStyles`) |
| `HtmlLangSetter` | syncs `<html lang>` with the active locale |

## Feature components

Components used by exactly one view live in `src/views/<Name>View/components/`
and do not need an entry here. Promote one to `src/components/` the moment a
second view imports it.

## Related

[[component-conventions]] · [[motion-system]] · [[design-system]] · [[hooks]]
