---
tags: [architecture, stable]
updated: 2026-09-17
---

# Folder Structure

Where everything lives in **this** project. Addresses are mirrored in
`.claude/stack.json → paths` — see [[stack-profile]].

## Repo root

```
street-barbell/
├── src/                     ← all application code
├── public/                  ← served as-is: 3D models, textures, fonts, favicons, OG
├── obsidian/                ← this vault — ALL project documentation
├── .claude/                 ← agent execution layer — see [[agent-harness]]
│   ├── stack.json           ← THIS PROJECT'S SHAPE — read it before writing files
│   ├── settings.json        ← hooks + permissions
│   ├── scripts/             ← verify.sh · detect-stack.sh · stack.sh · hooks/
│   ├── rules/               ← path-scoped context, retargeted to this codebase
│   ├── skills/ agents/ commands/
├── next.config.mjs          ← redirects, image hosts, standalone build, styled-components
├── tsconfig.json .eslintrc.json
├── AGENTS.md CLAUDE.md .cursorrules
├── README.md                ← the starter's own docs (pre-dates this vault)
└── GOOGLE_MAPS_SETUP.md
```

## `src/`

```
src/
├── app/                     ← ROUTES ONLY (paths.routes)
│   ├── layout.tsx           ← <html>, fonts, GTM, Draco prefetch
│   ├── [locale]/
│   │   ├── layout.tsx       ← the whole app shell (see below)
│   │   ├── page.tsx         ← one thin file per page, 15 of them
│   │   └── <page>/page.tsx
│   ├── api/                 ← 23 endpoints (paths.server) — the only Strapi callers
│   ├── sitemap.ts robots.ts global-error.tsx not-found.tsx
├── views/                   ← one <Name>View per route (paths.views)
│   └── <Name>View/
│       ├── <Name>View.tsx   ← composes the page
│       ├── screens/         ← full-width page sections
│       └── components/      ← pieces used only by this view
├── components/              ← shared components (paths.components)
│   ├── Springs/  Text/      ← 🔒 PROTECTED — the vendored motion engines
│   ├── animated/            ← project-level motion wrappers built on Springs
│   ├── Ui/                  ← buttons, inputs, checkbox
│   ├── Header/ Footer/ ContactForm/ Modals/ Skeleton/ …
├── layouts/                 ← app-shell layers, each one wrapping the next
│   ├── StyledComponentsLayout · ScrollLayout (Lenis) · AssetsLoaderLayout
│   ├── AnimatedRouterLayout (page transitions) · CanvasLayout (⚠️ unused)
├── hooks/                   ← 14 hooks — loop, in-view, scroll trigger, scene mgmt
├── store/ animationStore/   ← the two zustand stores
├── styles/                  ← tokens, fonts, GlobalStyles, SmartCSSGrid
├── utils/                   ← pure helpers: strapi, metadata, structured data, math
├── config/locales.ts        ← the static locale list
├── types/  i18n.ts  middleware.ts  redirects.mjs
```

### The app shell, in order

`src/app/[locale]/layout.tsx` nests these — the order is load-bearing:

```
NextIntlClientProvider → StyledComponentsLayout → ScrollLayout (Lenis)
  → SmartCSSGrid + Lvh + GlobalStyles
  → AssetsLoaderLayout            (gates every motion primitive via fullyLoaded)
    → AnimatedRouterLayout        (gates motion during transitions via isRerouting)
      → Header · FadeContainer · modals · FullScreenPlayer
      → <main> → DynamicScrollRevealWrapper → {children} + ContactForm
      → Footer
```

Header and Footer data are fetched once, in this layout, and passed down as
`initialData`. Do not refetch them per page.

## Placement rules — where does a new file go?

| I am adding… | It goes in… |
|---|---|
| A page | `src/app/[locale]/<path>/page.tsx` — thin, delegates to a view, **and a sitemap entry** |
| A page's UI | `src/views/<Name>View/` — see [[new-page]] |
| A section of one page | `src/views/<Name>View/screens/<Section>/` |
| A piece used by one view only | `src/views/<Name>View/components/` |
| A component used by 2+ views | `src/components/<Name>/` |
| A motion wrapper built on the engine | `src/components/animated/` |
| A form control or button | `src/components/Ui/` |
| A Strapi query | a new `src/app/api/get-<thing>/route.ts` |
| A custom hook | `src/hooks/` |
| A pure helper | `src/utils/` |
| A shared type | `src/types/` |
| A 3D model / texture / font | `public/models` · `public/textures` · `public/fonts` |
| A colour | `_colors` in `src/styles/colors.ts` — nowhere else |

## Do-not-modify zones

`src/components/Springs/**` and `src/components/Text/**` are vendored engines.
Consume them, wrap them (`src/components/animated/` and `Text/TLine.tsx` are the
house examples), never edit them. `verify.sh` FAILs on a diff there.

## Related

[[stack-profile]] · [[site-map]] · [[system-overview]] · [[component-conventions]] · [[agent-harness]]
