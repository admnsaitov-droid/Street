---
paths:
  - "src/components/**/*.tsx"
  - "src/views/**/*.tsx"
  - "src/layouts/**/*.tsx"
  - "src/app/**/*.tsx"
  - "src/hooks/**/*.ts"
description: Motion rules — springs only, through the vendored Springs/Text engines
---

# Motion in this project

Full notes: `obsidian/frontend/motion-system.md` · `obsidian/frontend/text-motion.md`
Bindings: `@react-spring/web` (`bindings.motion`) and the **local** text engine
`src/components/Text/TextEngine.tsx` (`bindings.textMotion`).

- **All real motion is spring-based**, through `@react-spring/web` and the
  primitives in `src/components/Springs/`. Text animates through `TextEngine` /
  `TLine`, never through a hand-rolled per-character animator.
- **Banned:** `@keyframes`, and **any second animation library** (framer-motion,
  gsap, anime.js, motion/react…). `verify.sh` FAILs on both.
  Five legacy `@keyframes` blocks predate this rule — see
  `obsidian/meta/baseline-debt.md`. Do not add a sixth; migrate one when you
  touch its file.
- **The only CSS exception:** a `transition` declaration inside a
  styled-component for a simple discrete state change — hover/focus colour,
  opacity, border, a few-px nudge. Everything scroll-driven, revealing,
  staggered or layout-affecting stays a spring.
- **`src/components/Springs/` and `src/components/Text/` are protected**
  (`paths.protected`). Consume them, wrap them, do not edit them without
  sign-off. See `.claude/rules/engine-protected.md`.

## Picking a primitive

| Need | Primitive |
|------|-----------|
| Reveal on scroll-into-view | `Inview` (`mode="once" \| "always" \| "forward"`) |
| Continuous scroll motion (parallax, progress) | `SpringTrigger` (`mode="scrub"`) |
| Snap at a scroll point | `SpringTrigger` (`mode="toggle"`) |
| Raw scroll progress as a number | `useSpringTrigger` / `useProgressTrigger` |
| Hover | `Hover` — auto-disabled on touch via `springsConfig.disableOnMobile` |
| Smooth swap when content changes | `Handle` |
| Any state-driven tween | `Spring` (`enabled` toggles `from` → `to`) |
| Heading / copy reveal | `TLine`, or `TextEngine` directly for line/word/char control |

`useSpringTriggerDepricated.ts` is exactly what its name says — do not import it
into new code.

## Non-negotiables

- **Transform and opacity only.** Animating width/height/top/margin puts layout
  on every frame.
- **Content exists regardless of motion state.** Reveals change appearance, never
  presence — `TextEngine` keeps an SEO copy in the DOM (`seo`, `showSeoText`),
  which is what keeps animated headings crawlable.
- Every animation wrapper takes a semantic element — pass the real one
  (`tag="section"`, `tag="h2"`, `tag="li"`), never leave it a `div`.
- Motion waits for the loader: the primitives already gate on
  `useAssetsLoader().fullyLoaded` and `useIsRerouting()`. Do not re-implement
  that gating in a component.
- Mobile gating is central, in `src/components/Springs/config.ts` — change it
  there, not with a per-component `disableOnMobile` sprinkle.
- **No new `requestAnimationFrame` loops.** Use `useLoop` / `useLoopInView`.
  (The project has no single shared ticker — see ADR-0103 before adding one.)
