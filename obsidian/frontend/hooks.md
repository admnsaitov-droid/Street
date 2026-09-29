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
| `useWindowSize` / `useWindowWidth` | `{ width, height }` / `number` | Shared subscription — never add a per-component resize listener. ⚠️ **Returns 0 on the server.** Any *markup* that branches on it must be gated with `useMounted` or it fails hydration — ADR-0114. |
| `useMounted()` | `boolean` | False on the server and the first client render. The guard for width-conditional markup: `{(!mounted \|\| width > 768) && <Desktop/>}` and `{mounted && width <= 768 && <Mobile/>}`. Desktop is the server assumption; inverting the polarity makes the server render the mobile branch. |
| `useTouchDevice()` | `boolean` | A real touch device — `(hover: none) and (pointer: coarse)`, read once. **Not a width check**: a narrow window on a laptop still has a mouse and keeps dragging the 3D scenes normally. |
| `useLvh` + `<Lvh />` | — | Writes `--vh` so `heightLvh()` survives a collapsing mobile URL bar. Mounted once in the locale layout. |

## 3D scenes

| Hook | Returns | Notes |
|---|---|---|
| `useSceneManager` | scene lifecycle helpers | **Unused** — no call sites in `src/`. Left in place, not wired to anything. |
| `useSceneReady(type)` | — | Runs *inside* the `<Canvas>`, in the same `Suspense` boundary as the models, so it fires once every suspended asset has resolved. Prewarms the scene — `initTexture` for every texture, `compileAsync` for every program, one throwaway render — then sets `isSceneReady` in `src/animationStore`. |
| `useLazyScene(type, opts)` | `{ containerRef, isInView, shouldLoad, progress, isLoading }` | `shouldLoad` is true for everyone who can render it (false for bots and clients without usable WebGL) — the scene mounts at page load so it warms behind the loader curtain. The observer only drives `isInView` → `frameloop`. ADR-0107. |
| `useRequireScene(type, enabled)` | — | Called from the **view**, not the scene. Declares that this page owns a scene so the loader curtain waits for it. Must be the view: the scenes are `next/dynamic` chunks that mount after the first commit. Registers **nothing** for a bot or a client without usable WebGL — waiting for a scene that can never render is pure cost (ADR-0111). Only *hero* scenes gate; home's below-the-fold globe does not. |
| `useRequireMedia(id, enabled, isReady)` | — | The same gate for above-the-fold imagery. Only `priority` media registers, so the curtain reveals a finished hero instead of a placeholder. |
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
| `useAnimationStore` (default export) | zustand | `animationStore/` | `isSceneReady` per `SceneType` (`home` · `distribution` · `product` · `package`); `requiredScenes`; and `requiredMedia` / `readyMedia` for above-the-fold imagery. The loader curtain waits on all three (ADR-0111) |
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
