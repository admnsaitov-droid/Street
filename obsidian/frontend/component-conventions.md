---
tags: [frontend, stable]
updated: 2026-09-17
---

# Component Conventions

How components are written and placed here, taken from what the codebase already
does consistently.

## File and export shape

```
src/components/LinesGrid/
├── LinesGrid.tsx                 ← export const LinesGrid
└── components/
    ├── LineCard.tsx
    └── LinesInfoCard.tsx
```

- **One component per file, folder named after the component**, filename matching.
- **Named exports**, always: `export const LinesGrid = …`. No default exports for
  components. (`TextEngine` and `TextProgress` are the vendored exceptions.)
- Props typed inline or as a local `interface <Name>Props`. No `any` in new code.
- Styled-components declared in the same file, above the component, named
  `Styled<Thing>` — `StyledTitle`, `StyledContent`, `StyledImageContainer`. Export
  one only when another file needs to target it.

## Where a component goes

| Scope | Location |
|---|---|
| Used by one view | `src/views/<Name>View/components/` |
| A full-width section of one page | `src/views/<Name>View/screens/<Section>/` |
| Used by two or more views | `src/components/<Name>/` |
| A motion wrapper built on the engine | `src/components/animated/` |
| A button, input, checkbox | `src/components/Ui/` |

Promote a component out of a view the moment a second view imports it — do not
reach across into another view's folder.

## Client boundaries

- Views receive data as **props from the route**; components never fetch.
- `"use client"` goes on the **leaf that needs it**, not on a view. 26 files carry
  it today and 10 of those are views or top-level pieces — that is debt
  ([[baseline-debt]]), not the pattern to copy.
- Anything with a WebGL canvas, Swiper, or Google Maps loads through
  `next/dynamic` with `ssr: false`, as `DynamicScene`, `DynamicProductScene`,
  `DynamicPackageScene` and `DynamicScrollRevealWrapper` do.

## Content

- **No literal copy, numbers or image paths inside a component.** Content arrives
  as props, sourced from Strapi at the route.
- **Interface texts (buttons, labels, breadcrumbs, aria-labels, error/404
  copy) come from Strapi's "Тексты интерфейса" single type** via
  `useUiStrings()` (`src/components/UiStrings/UiStringsProvider.tsx`) — never a
  literal in JSX (ADR-0119). New text = a field in the Strapi schema + every
  locale in its `seed/ui-strings.json` + the English default in
  `src/config/uiStrings.ts`; the next Strapi deploy fills it everywhere.
- Older translated UI strings still live next to their component in a
  `*Translations.ts` file (`contactFormTranslations.ts`,
  `successModalTranslations.ts`, `errorModalTranslations.ts`,
  `cookieTranslations.ts`, `sameLineProductsTranslations.ts`) — translated, but
  not editable in the admin. Don't add new ones; move them to the Strapi type
  when you touch them.
- Every async surface needs `loading` / `error` / `empty` states. The `Skeleton/`
  components exist for this and should mirror the final layout.

## Motion in a component

- Reach for a primitive, not a `useSpring` of your own: [[motion-system]].
- Pass the semantic element into the primitive's `tag` prop.
- Text goes through `TLine`, never `Inview` around a heading.

## Props

- Keep the surface small; compose instead of adding a twelfth boolean.
- Booleans default to `false` and read positively (`disableOnMobile`, not
  `enableOnDesktop`).
- Forward a ref when a parent may need to measure or trigger the element — the
  motion primitives all do.

## Naming

| Thing | Convention | Example |
|---|---|---|
| Component | PascalCase | `LocationCard` |
| View | `<Name>View` | `DistributionView` |
| Screen | PascalCase section name | `Achievements` |
| Hook | `use<Thing>` | `useSpringTrigger` |
| Styled | `Styled<Thing>` | `StyledTitleContainer` |
| Store | `use<Thing>Store` | `useVideoPlayerStore` |

## Related

[[components]] · [[design-system]] · [[motion-system]] · [[folder-structure]] · [[routing-views]]
