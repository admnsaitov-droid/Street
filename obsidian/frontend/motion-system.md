---
tags: [frontend, motion, stable]
updated: 2026-09-17
---

# Motion System

Every animation on this site is a `@react-spring/web` spring rendered through one
of six primitives in `src/components/Springs/`, or through the text engine in
`src/components/Text/`. Both directories are **protected** (`paths.protected`) —
consume them, wrap them, do not edit them (ADR-0105).

## The two global gates

Nothing animates until both are satisfied. If an animation is not firing, check
these before anything else.

| Gate | From | Meaning |
|---|---|---|
| `fullyLoaded` | `useAssetsLoader()` — React context in `layouts/AssetsLoaderLayout` | the loader has finished and handed over |
| `isRerouting` | `useIsRerouting()` — React context in `layouts/AnimatedRouterLayout` | a page transition is in flight; motion freezes. Debounced: `delayIn` 500ms, `delayOut` 0 |

`Inview`, `Spring` and `TLine` read both internally. **Do not re-implement the
gating in a component** — pass `enabled` for your own conditions only.

## The primitives

All of them take `tag` (the semantic element, from the `Tags` union in
`Springs/Spring.tsx`), `from`, `to`, `config`, `enabled`, `style` and any
`HTMLAttributes`. All forward a ref to the outer element.

### `Spring` — state-driven

```tsx
<Spring tag="section" enabled={isOpen} from={{ opacity: 0 }} to={{ opacity: 1 }} />
```

| Prop | Default | Notes |
|---|---|---|
| `mode` | `"always"` | `once` latches after the first play · `forward` only plays scrolling down |
| `delayIn` / `delayOut` | `0` | ms |
| `immediateOut` | `false` | skip the exit animation |
| `disableOnMobile` | `false` | ORed with `springsConfig.disableOnMobile.spring` |

Gates on `fullyLoaded` only — it has no viewport awareness. Use `Inview` for that.

### `Inview` — reveal on entering the viewport

```tsx
<Inview tag="section" mode="once" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} />
```

| Prop | Default | Notes |
|---|---|---|
| `mode` | `"always"` | **`once` is what you almost always want** for a reveal |
| `trigger` | — | a ref to watch *instead of* this element |
| `innerTag` / `innerClassName` | — | when set, the spring applies to an inner element and the outer stays static |
| `immediateOut` | `true` | note the default differs from `Spring` |

Visibility comes from `useDynamicInView` (IntersectionObserver). `mode="forward"`
additionally attaches a `scroll` listener.

### `SpringTrigger` — scroll-driven

```tsx
<SpringTrigger tag="div" mode="scrub" start="top bottom" end="bottom top"
  from={{ y: 0 }} to={{ y: -120 }} />
```

| Prop | Default | Notes |
|---|---|---|
| `mode` | `"scrub"` | `scrub` interpolates continuously · `toggle` snaps once progress hits 1 |
| `start` / `end` | `"top bottom"` / `"bottom top"` | see the position grammar below |
| `trigger` | — | measure a different element |
| `onChange` | — | `({ progress, interpolatedProgress })` |
| `frameInterval` | `10` | ms between measurements |
| `innerTag` | `"div"` | **always renders an inner wrapper** — the spring lands on it, not on `tag` |
| `config` | `{ duration: 1, easing: linear }` | effectively instant: scrub follows scroll exactly |

> `SpringTrigger` always nests `innerTag` inside `tag`. Two elements render, and
> your `className` lands on the outer one.

### Position grammar

`start` and `end` read as **`"<element edge> <viewport edge>"`** and only these
nine combinations exist (`TriggerPos` in `useSpringTrigger.ts`):

```
top|center|bottom  ×  top|center|bottom
```

`"top bottom"` = the element's top reaching the viewport's bottom. Anything
outside the union is a type error, not a silent fallback.

### `ProgressTrigger` — progress only

No styling, just `onChange`. Use it to drive a value you apply yourself.

### `Hover`

`from` → `to` on pointer enter/leave, with optional `trigger`.
`springsConfig.disableOnMobile.hover` is `true`, so it is **off below 768px** —
never put essential information behind a hover.

### `Handle` — smooth swap on content change

Caches the previous children, fades out, swaps, fades in. Defaults:
`from {opacity:0}` / `to {opacity:1}`, `config: gentle`.

> ⚠️ `Handle` accepts a `tag` prop and **ignores it** — it always renders a
> `div`. Do not rely on it for semantics.

## Mobile gating

One place: `src/components/Springs/config.ts`.

```ts
springsConfig = { mobileWidth: 768, disableOnMobile: {
  hover: true, inview: false, spring: false, springtrigger: false } }
```

A component's `disableOnMobile` is **ORed** with the global flag — a component
can opt out on mobile, it cannot opt back in. Change the policy centrally, not
with a per-component sprinkle.

## Rules

1. **Springs only.** No `@keyframes`, no second animation library. `verify.sh`
   FAILs both. The one exception is a `transition` declaration in a
   styled-component for a discrete state change (hover colour, opacity, a few-px
   nudge). Five legacy keyframe blocks predate this — [[baseline-debt]].
2. **Transform and opacity only.** Animating width/height/top/margin puts layout
   on every frame.
3. **Pass the real element.** `tag="section"`, `tag="h2"`, `tag="li"` — the
   `Tags` union covers ~60 elements. A `div` is a last resort.
4. **Content exists regardless of motion state.** Reveals change appearance,
   never presence. The text engine keeps a hidden SEO copy for this reason.
5. **No bare `requestAnimationFrame`.** Use `useLoop` / `useLoopInView`.
6. **`useSpringTriggerDepricated` is dead.** Do not import it.

## Known gaps

- **No `prefers-reduced-motion` handling anywhere in the codebase.** The kit's
  ADR-0002 expects a reduced-motion path that jumps to the end state; this
  project has none. Adding it means one media-query check inside the primitives,
  which are protected — so it needs sign-off.
- **No shared ticker** — ADR-0103.

## Related

[[text-motion]] · [[text-engine-reference]] · [[motion-bindings]] · [[smooth-scroll]] · [[components]]
