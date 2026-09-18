---
tags: [workflow, performance, 3d, stable]
updated: 2026-09-17
---

# Workflow — Optimise a 3D Scene

Skill: `optimize-3d-scene`. **Invoke it before improvising** — the order of fixes
matters more than any individual fix.

## The four scenes

| `SceneType` | Where | Notable cost |
|---|---|---|
| `home` | `views/HomeView/screens/Globe/components/Scene.tsx` | `low_res_earth.glb` + `high_res_earth.glb`, atmosphere shell, trackers |
| `distribution` | `views/DistributionView/components/Scene.tsx` | earth + `Atmosphere` + `Stars` + per-location markers, HDR environment |
| `product` | `views/ProductView/components/Scene/ProductScene.tsx` | `productModel.glb`, runtime colour/material swapping |
| `package` | `views/PackageView/components/Hero/PackageScene.tsx` | `package.glb`, zoom/reset controls |

All are `@react-three/fiber` + `@react-three/drei`, three 0.172, each with **its
own `<Canvas>`** — there is no shared canvas (`src/layouts/CanvasLayout` and
`tunnel-rat` are unused).

## What is already in place

Do not re-invent these; check they are wired before adding anything.

| Mechanism | Where | Effect |
|---|---|---|
| `next/dynamic` + `ssr: false` | `DynamicScene.tsx` / `DynamicProductScene.tsx` / `DynamicPackageScene.tsx` | three.js never enters the server bundle |
| `useLazyScene(sceneType, …)` | `src/hooks/` | `shouldLoad` is **always true** — the scene mounts at page load so it prewarms behind the loader curtain. The IntersectionObserver now only drives `isInView`. ADR-0107 |
| `useRequireScene(type, enabled)` in the **view** | `src/hooks/` | declares the page's scene so the loader curtain waits for it (min 1s · ready · cap 8s) |
| `frameloop={isInView ? "always" : "demand"}` | every `<Canvas>` | **the single biggest win** — an off-screen scene stops rendering |
| `SceneSkeleton` + `useProgressiveLoading` | `components/Skeleton/`, `src/hooks/` | a progress-bearing placeholder instead of a blank canvas |
| `SceneReadyDetector` → `useSceneReady` → `useAnimationStore` | inside every `<Canvas>` | real prewarm: `initTexture` for every texture, `compileAsync` for every program, one throwaway render — *then* `isSceneReady` |
| `warmupScene` | `src/utils/warmupScene.ts` | the prewarm itself: `initTexture` every texture, `compileAsync` every program, one throwaway render. Failures **warn** outside production — a silent prewarm failure reads as success |
| `DRACO_DECODER_PATH` → `public/draco/` | `src/utils/dracoDecoder.ts` | decoder served from this origin, not gstatic. There is deliberately **no prefetch** in the root layout any more — see the comment there. ADR-0108 |
| `getDeviceTier` / `getSceneDpr` / `getSceneGlFlags` | `src/utils/deviceTier.ts` | DPR clamped per tier (mobile `[0.75,1]`, tablet `[0.75,1.25]`, desktop `[0.75,1.5]`), `antialias: false` on mobile, `powerPreference: "high-performance"` on desktop only. Read **once at construction** |

## Order of fixes

1. **Confirm the scene is actually the cost.** Profile before changing anything —
   a janky page is often the text engine re-splitting or a `useLoop` at the wrong
   framerate, not the GPU.
2. **Is `frameloop` demand-gated off-screen?** If a scene renders while scrolled
   away, nothing else matters.
3. ~~**Prewarm at load, not mid-scroll.**~~ **Done (2026-09-17).** The curtain
   waits for every scene the view registered, and each scene uploads its
   textures and compiles its programs behind it. If a program links during a
   scroll again, that is a regression — measure it, do not re-architect.
   **Moving a stall into the curtain is not fixing it** (skill §3.5): the first
   attempt did exactly that and froze the loader logo for 2.3s instead. Measure
   the curtain window too, not only the scroll.
4. ~~**DPR budget.**~~ **Done (2026-09-17)** — all four canvases read `dpr` and
   the renderer flags from `src/utils/deviceTier.ts`.
5. **Check the texture *dimensions*, not the file size.** This is where the whole
   problem was hiding: `high_res_earth.glb` was 11.2MB on disk but **8000²,
   8000² and 10000²** in memory — ~900MB of VRAM and 2.25s to upload, for a
   globe that renders ~800px tall. A heavily-compressed webp tells you nothing
   about upload cost; `webpinfo` does. The maps now ship at 2048² outside the
   models (ADR-0109), and `low_res_earth.glb` is loaded for geometry only.
6. **Textures.** `public/models/hdr/` and `public/textures/` hold several HDRs
   (`testHdr*.hdr`, `hadrMap.hdr`) — confirm which are still referenced; an HDR
   environment is expensive on mobile and often replaceable with a lighting rig.
7. **Particles / bloom / postprocessing** — budget them per device tier, or drop
   them below a width threshold.
8. **Scroll-driven transforms belong on the GPU** — drive uniforms, don't rebuild
   geometry per frame.
9. **Strip the scene for bots.** It carries no indexable content; a crawler
   should not pay for it.

## Project-specific traps

- **`leva` is a dependency.** Dev-only tweaking UI — make sure no panel ships.
- **`public/cesium/`** is copied into the build by `copy-webpack-plugin`. Confirm
  it is still used; if not, that is a large, free win.
- **Several unused `.glb` and `.hdr` files** sit in `public/models` (`test.glb`,
  `earth_old.glb`, `solar.glb`, `testHdr2-5.hdr`). They are not bundled, but they
  are deployed — check before assuming they are needed.
- **Scene readiness gates other motion.** Changing when `isSceneReady` fires can
  stall reveals elsewhere on the page.
- **`useLoop` defaults to `framerate: 100`** — 10fps. Anything driving a scene
  must pass a real value, and prefer `useLoopInView`.

## Measuring

Production build only (`yarn build && yarn start`). A mid-range Android, not a
desktop throttle. Watch frame time during scroll, not the average FPS.

## Related

[[motion-system]] · [[qa-verification]] · [[ship]] · [[tech-stack]] · [[site-map]]
