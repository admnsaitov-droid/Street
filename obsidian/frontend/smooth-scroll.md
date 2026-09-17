---
tags: [frontend, motion, stable]
updated: 2026-09-17
---

# Smooth Scroll

Lenis drives page scrolling, mounted once in
`src/layouts/ScrollLayout/ScrollLayout.tsx`, which sits high in the app shell
(above the loader and the router transition).

## The pieces

| Piece | Where | What |
|---|---|---|
| `ScrollLayout` | `layouts/ScrollLayout/ScrollLayout.tsx` | renders the wrapper `div`s plus a headless `ScrollController` |
| `useScroll` | `layouts/ScrollLayout/useScroll.ts` | zustand store: `{ lenis, setLenis, isEnableScroll, start, stop }` |
| `scrollTo` | `utils/scrollTo.ts` | the one programmatic scroll entry point |
| `window.lenis` | — | the instance is also exposed globally (debugging) |

`ScrollController` constructs `new Lenis({ smoothWheel: true })`, jumps to the
top on mount, and runs its **own recursive `requestAnimationFrame`** calling
`lenis.raf(time)` — one of the loops ADR-0103 records.

## Locking scroll

Always through the store, never by mutating the DOM from a component:

```ts
const { start, stop } = useScroll();
stop();   // modal open
start();  // modal closed
```

`isEnableScroll` drives two things together: `lenis.start()/stop()` **and**
`enableNativeScroll()`, which fixes `body` at the saved offset (`position: fixed;
top: -Ypx`) and restores it afterwards.

> It deliberately does **not** set `overflow: hidden` — that breaks touch
> scrolling inside nested `overflow: auto` regions such as the mobile product
> menu. Do not "fix" that by adding it back.

## Scrolling to something

```ts
import { scrollTo } from "@/utils/scrollTo";
scrollTo("section-id");          // smooth
scrollTo("section-id", true);    // instant
scrollTo(0);                     // numeric offset
```

It disables scroll for the duration, then re-enables after 100ms, and uses
native `window.scrollTo` (Lenis intercepts it). It needs a real `id` on the
target element — give a section an `id` if it is a scroll destination.

Hash links are handled for you: `ScrollController` watches `usePathname()` for a
`#fragment` and calls `scrollTo(hash, true)` 300ms after the route settles.

## Interaction with page transitions

`AnimatedRouterLayout` records `window.scrollY` per pathname and restores it with
`scrollTo(y)` on return. If you add a route that should always open at the top,
that is where to look.

## Rules

- **One writer.** Only `ScrollLayout` constructs or destroys Lenis. Components
  read `useScroll` and call `start`/`stop`.
- Never call `window.scrollTo` directly — use `scrollTo`, or the lock/restore
  bookkeeping desynchronises.
- Never add a second smooth-scroll library ([[motion-bindings]]).
- Scroll-driven animation goes through `SpringTrigger` / `useSpringTrigger`,
  which measure with `getBoundingClientRect` inside `useLoopInView` — not through
  a `scroll` event listener.

## Related

[[motion-system]] · [[data-flow]] · [[utils]] · [[hooks]]
