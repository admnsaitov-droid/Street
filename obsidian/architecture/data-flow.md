---
tags: [architecture, stable]
updated: 2026-09-17
---

# Data Flow

How content, state, scroll and motion move through this app. Four flows, kept
deliberately separate.

## 1. Content — top down, always

```
Strapi  (API_URL, server-only)
   ▼
src/app/api/get-*/route.ts            20 proxies, the only readers of API_URL
   ▼
getStrapiData(path, locale)           src/utils/strapi.ts — dedupes, 10s timeout,
   ▼                                  returns null on failure
route file  ──props──►  view  ──props──►  components
```

- **Views do not fetch.** The route loads; the view receives.
- **Components never hold content.** No literal copy, numbers or image paths —
  props, always. Non-editorial UI strings live in a sibling `*Translations.ts`
  file keyed by locale ([[component-conventions]]).
- **Every page needs a fallback shape.** `getStrapiData` swallows errors by
  design, so `null` is a normal value, not an exception. `src/app/[locale]/page.tsx`
  is the reference implementation.
- **Header and footer load once**, in `src/app/[locale]/layout.tsx`, and flow down
  as `initialData`. Never refetch them per page.
- Async surfaces get loading/error/empty states — the `Skeleton/` components exist
  for this and should mirror the final layout.

Endpoint table: [[site-map]]. Conventions: [[api-architecture]].

## 2. Motion — many loops, no shared ticker

```
Lenis                      its own recursive rAF, started in ScrollController
useLoop / useLoopInView    one rAF per subscriber  (framerate default 100ms!)
<Canvas> × 4               one rAF each, gated by frameloop "always" | "demand"
```

This **deviates from the kit's one-ticker rule** and is recorded as ADR-0103
rather than refactored. What still holds:

- **No component calls `requestAnimationFrame` directly.** Use `useLoop` or, for
  anything decorative, `useLoopInView` so off-screen work stops.
- **`useLoop`'s default `framerate` is 100ms — 10fps.** Pass a real value.
- Scroll position is read with `getBoundingClientRect` **inside the loop**
  (`useSpringTrigger`), never in a `scroll` handler that also writes styles.
- Frame cost scales with the number of animated components. Consolidating onto
  one ticker is a worthwhile, breaking, deliberate change — not an incidental one.

## 3. State — eight stores, two contexts

The two most important pieces of state are **React context**, not zustand:

| Value | Kind | Source | Meaning |
|---|---|---|---|
| `fullyLoaded` | context | `useAssetsLoader()` | the loader is done; motion is released |
| `isRerouting` | context | `useIsRerouting()` | a page transition is running; motion freezes |

The zustand stores: `useLoadingStore`, `useVideoPlayerStore`, `useColorStore`
(all `src/store/store.tsx`), `useAnimationStore`, `useScroll`, `useLayoutState`,
and the two view-local ones. Full table in [[hooks]].

- **One writer per concern.** Components read; the owning layout or action writes.
- **Scroll locking is a store action** — `useScroll().stop()` — never a direct DOM
  mutation. `ScrollLayout` owns the body-position bookkeeping ([[smooth-scroll]]).
- Before adding a ninth store, check the three in `src/store/store.tsx`.

## 4. Secrets and external data — server only, one direction

```
browser ──► same-origin /api/* ──► Strapi · Resend · Telegram
                  │  API_URL, RESEND_API_KEY, RECIPIENT_EMAIL,
                  │  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID read here only
                  ◄── JSON
```

Nothing in the client bundle holds a secret and the browser never calls a
third-party origin. There is no validated env module yet — ADR-0104,
[[environment-variables]].

## Boundaries worth keeping

| Boundary | Why |
|---|---|
| route ↔ view | the framework's API stops at the route |
| view ↔ component | content flows down as props; components stay pure |
| store ↔ component | one writer, many readers |
| client ↔ server | secrets and third-party calls never cross into the bundle |

## Related

[[system-overview]] · [[site-map]] · [[motion-system]] · [[smooth-scroll]] · [[api-architecture]] · [[hooks]]
