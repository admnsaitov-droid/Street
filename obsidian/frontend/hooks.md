---
tags: [frontend, catalog, stable]
updated: 2026-09-17
---

# Hooks Catalog

Everything in `src/hooks/`, plus the context hooks exposed by the layout layers.

## Motion & loop

| Hook | Returns | Notes |
|---|---|---|
| `useLoop(onRender, { framerate, onMount, onUnMount })` | — | A rAF loop with a frame-interval throttle. **Starts its own `requestAnimationFrame`** — there is no shared ticker (ADR-0103). Default `framerate` is 100ms, which is 10fps: pass a real value for smooth work. |
| `useLoopInView` | — | `useLoop` that only runs while the element is on screen. Prefer it for anything decorative. |
| `useResizeLoop` | — | Re-runs a callback on resize. |
| `useSpringTrigger(opts)` | `{ progress, interpolatedProgress }` + refs | The scroll-trigger engine behind `SpringTrigger`. `start`/`end` use the `"<element> <viewport>"` grammar (`"top bottom"`, `"bottom top"`). |
| `useProgressTrigger` | progress | Lighter progress-only variant. |
| `useSpringTriggerDepricated` | — | ⛔ Legacy. Do not import into new code. |
| `useDynamicInView({ trigger })` | `[ref, inView]` | IntersectionObserver-based visibility, accepts an external trigger element. |
| `useInViewRef` | `[ref, inView]` | Minimal in-view check. |

## Viewport

| Hook | Returns | Notes |
|---|---|---|
| `useWindowSize` / `useWindowWidth` | `{ width, height }` / `number` | Shared subscription — never add a per-component resize listener. |
| `useLvh` + `<Lvh />` | — | Writes `--vh` so `heightLvh()` survives a collapsing mobile URL bar. Mounted once in the locale layout. |

## 3D scenes

| Hook | Returns | Notes |
|---|---|---|
| `useSceneManager` | scene lifecycle helpers | **Unused** — no call sites in `src/`. Left in place, not wired to anything. |
| `useSceneReady(type)` | — | Runs *inside* the `<Canvas>`, in the same `Suspense` boundary as the models, so it fires once every suspended asset has resolved. Prewarms the scene — `initTexture` for every texture, `compileAsync` for every program, one throwaway render — then sets `isSceneReady` in `src/animationStore`. |
| `useLazyScene(type, opts)` | `{ containerRef, isInView, shouldLoad, progress, isLoading }` | `shouldLoad` is **always true** — the scene mounts at page load so it warms behind the loader curtain. The observer only drives `isInView` → `frameloop`. ADR-0107. |
| `useRequireScene(type, enabled)` | — | Called from the **view**, not the scene. Declares that this page owns a scene so the loader curtain waits for it. Must be the view: the scenes are `next/dynamic` chunks that mount after the first commit. |
| `useProgressiveLoading` | `{ progress, isLoading }` | Drives `SceneSkeleton`'s fake progress bar off `isSceneReady`. |

## State — contexts and stores

Two of these are **React context**, not zustand. Mixing them up is the most
common mistake when wiring a new component.

| Accessor | Kind | From | Gives |
|---|---|---|---|
| `useAssetsLoader()` | **context** | `layouts/AssetsLoaderLayout` | `{ loading, progress, currentFile, loaded, fullyLoaded }` — the gate every motion primitive waits on |
| `useIsRerouting(delayIn=500, delayOut=0)` | **context** | `layouts/AnimatedRouterLayout` | `true` while a page transition runs; motion freezes |
| `useAnimRouter()` / `useAnimatedRouter()` | **context** | same | navigate with the transition |
| `useLayoutState` | zustand | `layouts/AssetsLoaderLayout` | `{ fullyLoaded }` — a mirror of the context, for non-React readers (`ScrollLayout`) |
| `useScroll` | zustand | `layouts/ScrollLayout/useScroll` | `{ lenis, setLenis, isEnableScroll, start, stop }` — [[smooth-scroll]] |
| `useLoadingStore` (default export) | zustand | `store/store.tsx` | loading flags, form success/error modals, cursor, mega-menu open |
| `useVideoPlayerStore` | zustand | `store/store.tsx` | the full-screen image/video player and its gallery |
| `useColorStore` | zustand | `store/store.tsx` | product colour/material selection |
| `useAnimationStore` (default export) | zustand | `animationStore/` | `isSceneReady` per `SceneType` (`home` · `distribution` · `product` · `package`), plus `requiredScenes` — the scenes the current page declared, which the loader curtain waits on |
| `usePreview` | zustand | `views/HomeView/screens/Lines/components/Preview.tsx` | view-local |
| `useProductPreview` | zustand | `views/PackageView/components/Overview/components/ProductPreview.tsx` | view-local |

Eight zustand stores in total. Before adding a ninth, check whether one of the
three in `store/store.tsx` already covers the concern.

## Rules

- One concern per hook; compose rather than adding options.
- Clean up on unmount — listeners, observers, rAF handles. A leak here shows up
  as jank three pages later.
- Anything per-frame goes through `useLoop` / `useLoopInView`, never a bare
  `requestAnimationFrame` in a component.

## Related

[[data-flow]] · [[motion-system]] · [[components]]
