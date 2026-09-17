---
tags: [frontend, hook, wip]
updated: 2026-09-17
---

# Hook — {{title}}

> Template — duplicate when documenting a hook or store that needs more than a
> row in [[hooks]], and link it from there.

- **File:** `src/hooks/{{title}}.ts` *(stores: `src/store/`,
  `src/animationStore/`, or beside their layout)*
- **Status:** #wip

## Purpose

What state or behaviour this encapsulates, and why it is not inline code.

## Signature

```ts
function {{title}}(/* args */): /* return */
```

| Param | Type | Default | Description |
|---|---|---|---|
| | | | |

**Returns:** …

## Usage

```tsx
const … = {{title}}(…)
```

## Notes

- **Server safety** — what happens with no `window`. Most of these need a
  `typeof window === "undefined"` guard.
- **Cleanup** — what it unsubscribes, and when. Listeners, observers, rAF
  handles, timeouts.
- **Per-frame work** — goes through `useLoop` / `useLoopInView`, never a bare
  `requestAnimationFrame`. Remember `useLoop`'s default `framerate` is 100ms.
- **Depends on** — which stores or contexts (`useAssetsLoader`, `useIsRerouting`,
  `useScroll`, …).

## Related

[[hooks]] · [[motion-system]] ·
