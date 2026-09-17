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
| `useLazyScene(sceneType, { threshold: 0.1, rootMargin: '100px' })` | `src/hooks/` | IntersectionObserver; `shouldLoad` latches true the first time the container is near the viewport |
| `frameloop={isInView ? "always" : "demand"}` | every `<Canvas>` | **the single biggest win** — an off-screen scene stops rendering |
| `SceneSkeleton` + `useProgressiveLoading` | `components/Skeleton/`, `src/hooks/` | a progress-bearing placeholder instead of a blank canvas |
| `SceneReadyDetector` → `useAnimationStore` | per view | other UI can wait on `isSceneReady` |
| Draco decoder prefetch | `src/app/layout.tsx` | `draco_wasm_wrapper.js` + `draco_decoder.wasm` from gstatic |
| `powerPreference: "high-performance"`, `antialias: true` | product + package scenes | — |

## Order of fixes

1. **Confirm the scene is actually the cost.** Profile before changing anything —
   a janky page is often the text engine re-splitting or a `useLoop` at the wrong
   framerate, not the GPU.
2. **Is `frameloop` demand-gated off-screen?** If a scene renders while scrolled
   away, nothing else matters.
3. **Prewarm at load, not mid-scroll.** Shader compilation and texture upload
   during a scroll are the classic micro-freeze. Compile materials while the
   skeleton is still showing.
4. **DPR budget.** Only the unused `OneViewCanvas` sets `dpr={[1, 2]}`; the live
   scenes do not cap it, so a 3× phone renders 9× the pixels. Capping DPR is
   usually the second-biggest win available here.
5. **Geometry.** `low_res_earth.glb` exists for a reason — make sure the low-res
   variant is what mobile actually loads. Draco-compress anything new.
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
