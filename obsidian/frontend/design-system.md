---
tags: [frontend, design-system, stable, decision]
updated: 2026-09-17
---

# Design System

Styling is **styled-components 6** with a two-tier colour token system and a
viewport-scaling sizing system. ADR-0101 records why this project does not use
the kit's three-tier CSS convention.

Everything is exported from `@/styles` (`src/styles/index.ts`).

## Colours — two tiers

| Tier | Where | What |
|---|---|---|
| 1 — Literals | `src/styles/colors.ts` → `_colors` | **the only place a hex or rgba may appear** |
| 2 — Tokens | the same file → `colors` | `toVars(_colors)` maps each key to `var(--color-<key>)` |

`printVars(_colors, 'color')` emits the variables into `:root` from
`GlobalStyles`. So `colors.blue` is the string `var(--color-blue)`, and the
literal lives in exactly one place.

```ts
import { colors } from "@/styles";
const Title = styled.h2`color: ${colors.blue};`   // ✅
const Title = styled.h2`color: #0040DD;`          // ❌ verify.sh FAILs this
```

The current palette:

```
white100 #FFFFFF · black100 #000000 · background rgba(255,255,255,.9)
blue #0040DD · blue90 #99B3F1 · red #FF0021
gray #6F7685 · gray90 #868D9C · gray700 #B7BCCA · bgGray #E9EDF1
```

**Adding a colour = adding a key to `_colors`.** The variable and the accessor
are generated; nothing else to touch.

> Names describe appearance (`blue`, `gray90`), not role. That is the cost
> ADR-0101 accepts: a re-theme would need a semantic layer inserted. The site is
> single-theme with no dark mode, so it has not been worth it.

## Sizing — `rm()` and the scaling grid

**Every dimension goes through `rm()`.** A raw `px` in a styled-component is
almost always a bug.

```ts
import { rm, em, media } from "@/styles";
const Box = styled.div`
  padding: ${rm(56)} ${rm(32)};
  ${media.xsm`padding: ${rm(24)} ${rm(16)};`}
`;
```

How it works — `initSmartCSSGrid` in `src/styles/grid/grid.tsx`, configured in
`src/styles/index.ts`:

- `rm(px)` → `px / 16` **rem**. `em(px)` → the same in `em`.
- `PrintGrid` sets the root `font-size` **per breakpoint in `vw`**, so 1rem
  tracks the viewport and a layout measured at a breakpoint holds proportionally
  below it.
- `AdaptiveGrid` handles **above** the largest breakpoint: it interpolates the
  root font size up from 16px with `scaleUpCoeff: 0.6666`, recalculated through
  `useResizeLoop`.

Current configuration:

| Breakpoint | Width | `related` override |
|---|---|---|
| `xlg` | 1920 | — |
| `lg` | 1440 | — |
| `md` | 768 | — |
| `xsm` | 576 | 360 |

`related.xsm = 360` means below 576px the scale is computed against a 360px
design width, so mobile designs measured at 360 translate directly.

`media.<key>` produces a **`max-width`** query — they cascade downward. Never
hand-write an `@media`.

## Viewport height

`src/styles/utils.ts` exports `heightLvh(n)`, `minHeightLvh(n)`,
`marginTopLvh(n)`, `marginBottomLvh(n)`. Each emits a `vh` → `lvh` →
`calc(var(--vh, 1lvh) * n)` ladder; `--vh` is written by `<Lvh />`
(`src/hooks/useLvh.tsx`), mounted once in the locale layout. Use them for
anything full-height so a collapsing mobile URL bar does not resize the layout.

## Fonts

`src/styles/fonts.ts` exports `fontOnest(weight)`, `fontGolosText(weight)`,
`fontSageGrotesk(weight)` — each a CSS block bound to a `--font-*` variable set
by `next/font` in `src/app/layout.tsx` (Onest and Golos Text from Google, Sage
Grotesk local woff2).

```ts
const Title = styled.h2`${fontSageGrotesk(600)}`;
```

Never write `font-family` directly.

## Where a style goes

| Situation | Goes where |
|---|---|
| Styling one element | a `styled.x` in that component's file, named `Styled<Thing>` |
| A repeated pattern with structure | a component under `src/components/` |
| A new colour | `_colors` in `src/styles/colors.ts` |
| A global reset, a third-party override (`.lenis`, the cookie banner) | `GlobalStyles` in `src/styles/index.ts` |

`GlobalStyles` holds resets and global overrides only — component styles do not
live there.

## SSR

`StyledComponentsLayout` (`src/layouts/StyledComponentsLayout.tsx`) plus
`compiler.styledComponents: true` in `next.config.mjs` handle server rendering.
Styled-components requires a client boundary, which is one reason several views
carry `"use client"` — see [[baseline-debt]].

## Related

[[component-conventions]] · [[motion-system]] · [[folder-structure]] · [[decisions-log]]
