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
| `AnimatedContent` | generic content reveal |
| `AnimatedTranslate` | translate-in wrapper |
| `AnimatedDivider` | line that draws itself in |
| `AnimatedLink` / `UnderlineLink` | link with hover underline motion |
| `MaskImageAppear` / `ScaleImageAppear` | image reveals (mask wipe / scale) |
| `AccordionText` | expand/collapse copy |

## UI primitives — `src/components/Ui/`

| Component | Notes |
|---|---|
| `buttons/BlueButton` · `WhiteButton` · `SimpleButton` | the three house buttons |
| `Inputs/ContactInput` · `SimpleInput` · `SimpleTextarea` | form controls |
| `checkbox/SimpleCheckbox` | — |

## Shared infrastructure

| Component | Purpose |
|---|---|
| `Header/` | header, `Menu`, `LanguageSelect`, and the `MegaMenus/` (products + packages, desktop and mobile) with `FadeContainer` for the backdrop |
| `Footer/` | site footer, receives `initialData` from the locale layout |
| `ContactForm/` | the global contact form rendered after every page's content |
| `Modals/SuccessModal` · `ErrorModal` | form result, driven by the zustand store |
| `FullScreenPlayer/` | global image/video lightbox with gallery paging, driven by the store |
| `MediaComponent/` | picks image vs video and routes media URLs |
| `Skeleton/` | `SkeletonImage`, `SkeletonVideo`, `SkeletonIcon`, `SceneSkeleton`, `VideoPlayer` — loading placeholders that mirror the final layout |
| `StructuredData/` | renders the JSON-LD graph; used at routes and the layout |
| `Breadcrumbs/` | breadcrumb trail + its schema |
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
