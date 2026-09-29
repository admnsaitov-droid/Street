---
paths:
  - "src/components/Springs/**"
  - "src/components/Text/**"
description: Do-not-modify zone — the vendored motion and text engines
---

# STOP — this is the vendored motion engine

`src/components/Springs/**` and `src/components/Text/**` are listed in
`.claude/stack.json → paths.protected`. They came from the next14 starter, every
animated element in the site consumes them, and they are **not** per-site code.

- Consume them; never modify them. Need different behaviour? Compose a wrapper
  alongside, in the normal component tree — `TLine` is the house example of
  wrapping `TextEngine` with project defaults.
- `.claude/scripts/verify.sh` FAILs if `git diff` shows changes in either path.
- Hooks (`src/hooks/useSpringTrigger.ts`, `useDynamicInView.ts`, `useLoop.ts`)
  are **not** protected — they are the supported extension point.

Contents:

| File | What it is |
|---|---|
| `Springs/Spring.tsx` | state-driven `from` → `to` wrapper, `Tags` type |
| `Springs/Inview.tsx` | viewport reveal, modes `always` / `once` / `forward` |
| `Springs/SpringTrigger.tsx` | scroll-driven, modes `scrub` / `toggle` |
| `Springs/Hover.tsx` | hover, touch-disabled |
| `Springs/Handle.tsx` | smooth swap on content change |
| `Springs/ProgressTrigger.tsx` | raw progress emitter |
| `Springs/config.ts` | mobile breakpoint + per-primitive mobile gating |
| `Text/TextEngine.tsx` | the split-text engine (line/word/char, SEO copy) |
| `Text/TextProgress.tsx` | scroll-progress text variant |
| `Text/TLine.tsx` | the project's configured wrapper — **use this one** |

If a change genuinely belongs in the engine, say so explicitly, explain why a
wrapper cannot work, and get sign-off before touching a file.

Reference: `obsidian/frontend/motion-system.md` · `obsidian/frontend/text-motion.md`
