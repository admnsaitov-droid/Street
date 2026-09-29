---
tags: [frontend, motion, stable]
updated: 2026-09-17
---

# Text Motion

Animated headings and copy go through the vendored engine in
`src/components/Text/`. Never hand-roll a per-character animator, and never
animate text with `Inview` when it should be split.

## Which one

| Component | Use it for |
|---|---|
| **`TLine`** | **the default.** The house line reveal, pre-configured |
| `TextEngine` | word/letter control, custom staggers, a non-default mode |
| `TextProgress` | text driven by scroll progress instead of visibility |

`TLine` is a ~30-line wrapper (`src/components/Text/TLine.tsx`) that is worth
reading once, because it is the template for any other wrapper you add:

```tsx
<TextEngine
  enabled={fullyLoaded && !isRerouting && enabled}
  lineIn={{ y: 0, opacity: 1 }}
  lineOut={{ y: 100, opacity: 0 }}
  lineStagger={80}
  lineConfig={{ duration: 1200, easing: easings.easeOutCubic }}
  overflow
  showSeoText={false}
  seo
  columnGap={0.6}
  {...props}
/>
```

Usage is `<TLine tag="h2">Some heading</TLine>`. **Children must be a plain
string** — `children: string` is the type. No elements, no fragments, no
interpolated JSX.

## The four traps

### 1. The container is `display: flex; flex-wrap: wrap`

`text-align` alone does nothing. To centre or right-align a split text you must
pass `justify-content` through `style` or a wrapping styled-component:

```tsx
<TLine tag="h2" style={{ justifyContent: "center" }}>…</TLine>
```

This is the single most common mistake with this engine.

### 2. `overflow` clips to the line-height box

`overflow` (on by default in `TLine`) sets `overflow: hidden` on the animated
wrappers so text can slide up from behind a mask. The box is the **line-height
box**, so tight leading shaves descenders. Keep `line-height` ≥ 1.1 on anything
using `overflow`.

### 3. `mode="manual"` needs an instance, or nothing happens

Modes are `once` · `forward` · `always` (default) · `manual`. `manual` animates
only when you call `playIn()` / `playOut()` on the instance handed to
`onTextEngine`. If a scroll-driven mode fits, use it — `verify.sh` FAILs
`mode="manual"` precisely because it is usually a mistake.

### 4. Spacing comes from real space spans, not `columnGap`

With more than one word the engine sets `columnGap: 0` and inserts
`<span style="width: 0.25em">&nbsp;</span>` between words. So `columnGap` only
takes effect on single-word text, and word spacing is a fixed `0.25em` you
cannot tune with that prop. Adjust letter-spacing or the font instead.

## SEO

With `seo` (default `true`) the engine renders an absolutely-positioned,
transparent, full-size `<span>` holding the unsplit text. That copy is what
crawlers and the clipboard see, and it is why an animated heading stays
crawlable. `showSeoText` turns it **red** — a debug switch, never ship it `true`.

Consequence: the visible split text and the SEO copy overlap. Do not put
`user-select` or pointer handlers on the split spans expecting them to win.

## Rules

- One `<h1>` per page. Pass the real tag: `<TLine tag="h1">`.
- The engine is protected (`paths.protected`). New behaviour = a new wrapper next
  to `TLine`, not an edit inside `TextEngine.tsx`.
- Gate with `enabled`, not by unmounting — unmounting loses the SEO copy too.

## Related

[[text-engine-reference]] · [[motion-system]] · [[html-semantics]] · [[components]]
