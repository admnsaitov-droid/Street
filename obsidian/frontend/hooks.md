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
| `useSceneManager` | scene lifecycle helpers | Coordinates mount/unmount of the four scenes. |
| `useSceneReady` | readiness flag | Bridges a three.js scene to `src/animationStore`. |
| `useLazyScene` | deferred loader | Holds a scene back until it is needed. |
| `useProgressiveLoading` | progress | Staged asset loading. |

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
| `useAnimationStore` (default export) | zustand | `animationStore/` | `isSceneReady` per `SceneType` (`home` · `distribution` · `product` · `package`) |
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
