---
paths:
  - "src/styles/**"
  - "src/components/**/*.tsx"
  - "src/views/**/*.tsx"
  - "src/layouts/**/*.tsx"
description: The styled-components token and responsive-scaling system
---

# Design tokens — this project's system

Full note: `obsidian/frontend/design-system.md`. Token entry point:
`src/styles/` (`paths.styles`). Styling binding: **styled-components**.

> This project does **not** use the kit's three-tier CSS-variable convention
> (`conventions.tokenTiers: false`, ADR-0101). It uses the two-tier
> styled-components system below. Full note: `obsidian/frontend/design-system.md`.

## The two tiers

| Tier | Where | What |
|---|---|---|
| 1 — Primitive literals | `src/styles/colors.ts` → `_colors` | the only place a hex/rgba may appear |
| 2 — Consumable token | `src/styles/colors.ts` → `colors` | `toVars(_colors)` → `var(--color-<name>)`, emitted into `:root` by `printVars` in `src/styles/index.ts` |

```ts
import { colors } from "@/styles";
const Title = styled.h2`color: ${colors.blue};`   // ✅ resolves to var(--color-blue)
const Title = styled.h2`color: #0040DD;`          // ❌ literal outside colors.ts
```

Adding a colour = add it to `_colors`. Nothing else. The CSS variable and the
`colors.*` accessor are generated.

## Sizing is a token too

Every dimension goes through the SmartCSSGrid helpers from `@/styles`:

- **`rm(px)`** — the default. Scales the value against the 1920/1440/768/576
  grid, so a design measured at 1920 holds at every width. A raw `px` in a
  styled-component is almost always a bug.
- **`em(px)`** — when the value must track font size instead.
- **`media.xlg/lg/md/xsm`** — breakpoints. Never a hand-written `@media`.
- **`heightLvh` / `minHeightLvh` / `marginTopLvh`** from `src/styles/utils.ts` —
  viewport-height values that survive a collapsing mobile URL bar.

Fonts come from `src/styles/fonts.ts` (`fontOnest`, `fontGolosText`,
`fontSageGrotesk`), bound to the `--font-*` variables set in `src/app/layout.tsx`.
Never write `font-family` directly.

## Where a style goes (first match wins)

| Situation | Goes where |
|---|---|
| One-off for a single element | a `styled.x` in that component's file |
| Repeated pattern with structure/props | a component under `src/components/` |
| A new colour | `_colors` in `src/styles/colors.ts` |
| A global reset, third-party override, or `.lenis`/cookie-banner style | `GlobalStyles` in `src/styles/index.ts` |

`src/styles/index.ts` holds resets and global overrides only — component styles
do not live there.
