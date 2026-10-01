---
paths:
  - "src/app/api/**"
  - "src/utils/strapi.ts"
  - "src/utils/locales.ts"
  - "src/store/**"
  - "src/animationStore/**"
description: Strapi content layer and client state conventions
---

# Data layer

Full notes: `obsidian/backend/cms.md` · `obsidian/backend/api-architecture.md`

## Content — Strapi, through this app's own API

```
Strapi (API_URL, server-only)
   └─ src/app/api/_lib/fetchStrapi.ts  ← the only place API_URL is read (cached, tag `strapi`)
        └─ src/app/api/get-*/route.ts
             └─ getStrapiData(path, locale)  (src/utils/strapi.ts — also cached server-side)
                  └─ route file (server component)  ──props──►  view
```

- **There is no Strapi SDK and no generated types.** Responses are `any` today.
  When you add a typed shape, put it in `src/types/` and narrow at the endpoint,
  not in the view.
- **One endpoint per content query**, named `get-<thing>-data`. Adding a Strapi
  collection means adding a route under `src/app/api/` — the browser never talks
  to Strapi directly.
- **Every response must survive being `null`.** `getStrapiData` swallows errors
  by design; pages provide fallbacks.
- **Media URLs** go through `getMediaStrapiPath`, and `proxy-media` exists
  because Strapi is served over plain HTTP from a fixed IP. Do not hardcode
  `153.92.1.45` anywhere new — `next.config.mjs` and `NEXT_PUBLIC_IMAGE_URL`
  already carry it.
- **Locales:** every content call is locale-scoped. `src/utils/locales.ts` reads
  them from Strapi with `src/config/locales.ts` as the static fallback.

## Client state — eight zustand stores + two contexts

| Accessor | Where | Holds |
|---|---|---|
| `useLoadingStore` *(default)* | `src/store/store.tsx` | loading flags, form success/error modals, cursor, mega-menu |
| `useVideoPlayerStore` | `src/store/store.tsx` | full-screen image/video player + gallery |
| `useColorStore` | `src/store/store.tsx` | product colour/material selection |
| `useAnimationStore` *(default)* | `src/animationStore/` | `isSceneReady` per scene |
| `useScroll` | `src/layouts/ScrollLayout/useScroll.ts` | Lenis instance + `isEnableScroll` |
| `useLayoutState` | `src/layouts/AssetsLoaderLayout/` | `fullyLoaded` mirror |
| `usePreview`, `useProductPreview` | inside their views | view-local |

`fullyLoaded` and `isRerouting` are **React context** (`useAssetsLoader()`,
`useIsRerouting()`), not zustand.

- One writer per concern; components read. Scroll lock is `useScroll().stop()`,
  never a direct DOM mutation.
- **Do not add a ninth store** for something the three in `store/store.tsx`
  already cover.

## Forms

`src/app/api/send` and `send-main` send through Resend and mirror to Telegram
(non-blocking). Submission results surface through the store's modal flags, not
local component state.
