---
tags: [frontend, motion, stable, decision]
updated: 2026-09-17
---

# Motion Bindings

What implements motion here, and why nothing else may be added. ADR-0002.

## This project

| Capability | Binding | Where |
|---|---|---|
| Spring physics | **`@react-spring/web`** 9.7 | `stack.json → bindings.motion` |
| Text motion | **local engine** (`local-text-engine`) | `src/components/Text/` |
| Smooth scroll | **`lenis`** 1.1 | `src/layouts/ScrollLayout/` |
| Loop | `useLoop` / `useLoopInView` | `src/hooks/` |

There is no ambiguity to resolve and nothing to install. The binding was chosen
before this vault arrived, every component consumes it, and **a binding already
installed wins**.

## The rule

**One animation system.** `verify.sh` FAILs on an import from framer-motion,
gsap, anime.js, motion/react, popmotion, AOS, locomotive-scroll, ScrollMagic,
react-transition-group or any other animation package. Not a style preference —
a codebase speaking three motion languages cannot be reasoned about, and each
library adds its own render loop on top of the ones already running (ADR-0103).

If something cannot be expressed with the primitives, the answer is a **new
wrapper in `src/components/animated/`**, not a new dependency.

## Why react-spring here

It satisfies the invariant a binding must meet:

1. **Spring physics** — mass/tension/friction, not only duration curves.
2. **Interruptible** — retargeting mid-flight resolves from the current value.
3. **Imperative per-frame updates** — `api.start()` can be driven from a scroll
   progress number, which is what `useSpringTrigger` does.
4. **Transform/opacity output** without forcing layout.
5. **Runs in a Next client component** and tree-shakes.

> Worth knowing: much of this site uses react-spring in **duration mode**, not
> physics. `TLine` runs `{ duration: 1200, easing: easeOutCubic }` and
> `SpringTrigger` defaults to `{ duration: 1 }` so scrub follows scroll exactly.
> That is a deliberate house feel, not a misconfiguration — match it rather than
> introducing physics configs into an otherwise tweened page.

## Version constraint

`@react-spring/web` 9 is pinned by the React 18 floor, which is itself pinned by
`@react-three/fiber` 8 (R3F 9 needs React 19). Moving any one of the three means
moving all three. See [[tech-stack]].

## Related

[[motion-system]] · [[text-motion]] · [[smooth-scroll]] · [[tech-stack]] · [[decisions-log]]
