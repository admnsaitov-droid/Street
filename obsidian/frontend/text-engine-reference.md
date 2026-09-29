---
tags: [frontend, motion, reference, stable, do-not-modify]
updated: 2026-09-17
---

# TextEngine — API Reference

The vendored split-text engine at **`src/components/Text/TextEngine.tsx`**
(1381 lines) and **`TextProgress.tsx`** (834 lines). Both are in
`paths.protected` — this note documents them so you never need to open them.

Prefer [[text-motion]] for the practical guide; this is the exhaustive surface.

## Import

```tsx
import TextEngine, { tengine, VarTextTag } from "@/components/Text/TextEngine";
import { TLine } from "@/components/Text/TLine";      // the house wrapper
import TextProgress from "@/components/Text/TextProgress";
```

`TextEngine` and `TextProgress` are **default exports**. `TLine` is named.

## Structure it renders

```
<tag>                                     display:flex; flex-wrap:wrap; position:relative
  <span>seoText</span>                    absolute, transparent, full-size  (seo)
  per word:
    WrapLine → Line → WrapWord → Word → [WrapLetter → Letter]…
                                          each inline-block, overflow:hidden when `overflow`
    <span>&nbsp;</span>                   0.25em, between words
```

Six animatable layers, each with its own in/out values, config, delay and
stagger: **wrapLine · line · wrapWord · word · wrapLetter · letter**.

## Props — `EngineProps`

### Content & container

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `string` | — | **required, plain string only** |
| `tag` | `HtmlTags` | `"span"` | the `Tags` union from `Springs/Spring.tsx` |
| `as` | `HtmlTags` | — | alias used by the `tengine` factory |
| `columnGap` | `number \| "inherit"` | `0.3` | em. **Only applies to single-word text** |
| `overflow` | `boolean` | `false` | `overflow:hidden` on the wrappers — `TLine` sets it `true` |
| `style`, `className` | | | land on the container |

### Behaviour

| Prop | Type | Default | Notes |
|---|---|---|---|
| `enabled` | `boolean` | `true` | gate; `TLine` wires `fullyLoaded && !isRerouting` |
| `mode` | `"once" \| "forward" \| "always" \| "manual"` | `"always"` | `manual` requires `onTextEngine` |
| `immediateOut` | `boolean` | `true` | skip the exit animation |
| `enableInOutDelayesOnRerender` | `boolean` | `false` | re-apply delays when children change |

Visibility comes from `useInView` (`@react-spring/web`); `forward` also tracks
scroll direction.

### SEO

| Prop | Type | Default | Notes |
|---|---|---|---|
| `seo` | `boolean` | `true` | render the hidden unsplit copy |
| `showSeoText` | `boolean` | `false` | renders it **red** — debug only |

### Animation values

Plain react-spring style objects. Per layer, `*In` is the target and `*Out` the
resting/exit state. All default `{}`.

`wrapLineIn/Out` · `lineIn/Out` · `wrapWordIn/Out` · `wordIn/Out` ·
`wrapLetterIn/Out` · `letterIn/Out`

> A layer with empty values does not animate. Setting only `lineIn` without
> `lineOut` means there is no starting state — set both.

### Spring configs

`lineConfig` · `wordConfig` · `letterConfig` (default `{}`), each overridable per
direction: `lineConfigIn` / `lineConfigOut`, and the same for word and letter.

`TLine` uses `{ duration: 1200, easing: easings.easeOutCubic }` — a **duration
tween**, not physics. That is the house feel; match it in new wrappers.

### Delays and staggers (ms)

| Group | Props | Default |
|---|---|---|
| Global | `delayIn`, `delayOut` | `0` |
| Per layer | `lineDelayIn/Out`, `wordDelayIn/Out`, `letterDelayIn/Out` | `0` |
| Stagger | `lineStagger`, `wordStagger`, `letterStagger` | **`100`** |
| Stagger per direction | `lineStaggerIn/Out`, `wordStaggerIn/Out`, `letterStaggerIn/Out` | `0` |

Stagger multiplies by index, so a long heading with `letterStagger: 100` takes
seconds to finish. `TLine` uses `lineStagger: 80`.

### Class name hooks

`wrapLineClassName` · `lineClassName` · `wrapWordClassName` · `wordClassName` ·
`wrapLetterClassName` · `letterClassName` — for styling a layer without touching
the engine.

### Callbacks

| Prop | Signature |
|---|---|
| `onTextEngine` | `(instance: RefObject<TextEngineInstance>) => void` |
| `onTextStart` / `onTextChange` / `onTextResolve` | `(type, result, ctrl) => void` |
| `onTextFullyPlayed` | `(type: "in" \| "out") => void` |

`type` is a `TextEngineRenderType`: `line · lineWrap · word · wordWrap · letter ·
letterWrap`.

### `TextEngineInstance`

```ts
{ mode?, enabled?, lines?, words?, letters?,
  playIn(): void, playOut(): void, togglePause(): void }
```

The only way to drive `mode="manual"`.

## `TextProgress`

Same six layers and class hooks, driven by **scroll progress** instead of
visibility. Differences from `TextEngine`:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `mode` | `"once" \| "always" \| "manual"` | `"always"` | no `forward` |
| `type` | `"toggle" \| "interpolate"` | `"toggle"` | how progress maps to values |
| `interpolationStaggerCoefficient` | `number` | `0.3` | stagger spread across progress |
| `trigger` | `RefObject \| null` | — | element to measure |
| `start` / `end` | `TriggerPos` | — | the nine-value grammar from [[motion-system]] |

It has no delay or stagger-per-direction props — progress is the clock. Its ref
exposes `{ progress: RefObject<number> }`.

## Secondary exports

| Export | What it does |
|---|---|
| `tengine` | Proxy factory: `tengine.h2`, `tengine.p`, … pre-bound to a tag |
| `getTextFactory(Component)` | Build the same factory for a custom wrapper |
| `VarTextTag` | forwardRef wrapper rendering any tag from the `Tags` union |
| `useResizeObserver(ref, cb)` | the engine's internal resize hook |
| `calcLinesRefs(containerRef)` | groups word spans into visual lines |
| `isNotEmpty(obj)` | `Object.keys(obj).length > 0` |
| `HtmlTags`, `TextEngineRenderType`, `TextEngineHandlerType`, `TextEngineInstance`, `EngineProps` | types |

## Gotchas

- **`children` must be a string.** Interpolated JSX throws or renders nothing.
- **Flex container** — `text-align` will not align it. See [[text-motion]].
- **`overflow` clips to the line-height box** — keep leading ≥ 1.1.
- **`columnGap` is inert on multi-word text** — spacing is a fixed `0.25em` span.
- **Re-splitting on resize** is driven by `ResizeObserver`; very frequent width
  changes (an animating container) will thrash it. Animate a parent, not the
  text container's width.
- **Both files are protected.** Wrap, do not edit (ADR-0105).

## Related

[[text-motion]] · [[motion-system]] · [[components]] · [[decisions-log]]
