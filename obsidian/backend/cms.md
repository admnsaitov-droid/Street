---
tags: [backend, cms, stable]
updated: 2026-09-17
---

# CMS — Strapi

All editorial content comes from a **self-hosted Strapi** instance, external to
this repo. This repo contains no CMS code, no schema and no admin — only the
proxy layer that reads from it.

## How it connects

```
Strapi  (API_URL — server-only, plain HTTP on a fixed IP)
   │
   ├─ src/app/api/get-*/route.ts        the only readers of API_URL
   │
   └─ getStrapiData(path, locale)       src/utils/strapi.ts
         │
         └─ route file → view → components
```

Nothing in the browser knows Strapi exists. Full endpoint table: [[site-map]];
endpoint conventions: [[api-architecture]].

## Content model, as this app consumes it

Each page has its own Strapi endpoint returning one nested payload. The shapes
are not documented here because they are not typed anywhere — the app reads them
defensively with optional chaining:

```tsx
const heroData = homeData?.hero;
const achievementsData = homeData?.achievements;
```

Known top-level keys on `get-home-data`: `hero`, `achievements`, `packages`,
`benefits`, `about`, `globe`, `latestNews`, `linesBlock`. Metadata lives under a
`metadata` key (`metatitle`, `metadescription`, `metakeywords`, `openGraph`) on
every page payload — that is what `createMetadataGenerator` reads.

Collections with slugs: **lines**, **products** (nested under lines),
**packages**, **articles**.

> **There are no generated types.** Responses are `any` end to end. Typing them
> in `src/types/` and narrowing at the endpoint is the highest-leverage cleanup
> available — it would retire most of the `explicit any` FAILs at once
> ([[baseline-debt]]).

## Localisation

Every content request carries `?locale=`. Strapi holds a translation per locale;
`src/utils/locales.ts` can read the list from Strapi, with
`src/config/locales.ts` as the static fallback. See [[routing-views]].

**Interface texts** live in the Strapi single type `ui-string` ("Тексты
интерфейса", localized, no draft/publish — edits are live). The Strapi repo
seeds it on every boot from `src/api/ui-string/seed/ui-strings.json`: only
**empty** fields of each configured locale are filled, admin edits are never
overwritten, missing locales are created, public `find` is granted. So a deploy
of a new field is translated in all locales with no manual entry. Clearing a
field in the admin means it is refilled from the seed on the next boot.
ADR-0119.

## Media

- Strapi serves media over **plain HTTP** from a fixed IP, so:
  - `next.config.mjs` pins `127.0.0.1:1337`, `153.92.1.45:1337` (http and https)
    and whatever `NEXT_PUBLIC_IMAGE_URL` parses to, in `images.remotePatterns`.
  - `/api/proxy-media?url=` streams media through the HTTPS origin.
  - `getMediaStrapiPath(media)` resolves a Strapi media object to a URL.
- **Do not hardcode the IP anywhere new.** It already appears in two places too
  many.
- Uploads go to Strapi, never into this repo.

## Failure behaviour

`getStrapiData` returns `null` on any failure — timeout, 500, network. Every page
therefore needs a fallback shape, and the site stays up with empty sections when
Strapi is down. Preserve that: a page that throws on missing content is a
regression.

## Changing content structure

Strapi is the schema owner. When a field is added there:

1. Confirm the endpoint returns it (the proxies pass the payload through
   untouched — usually no change needed).
2. Read it in the view via the props already flowing down.
3. If it is a new *collection*, add an endpoint ([[api-architecture]]) and a row
   in [[site-map]].
4. Update the fallback shape on the route so a null does not break the page.

## Related

[[api-architecture]] · [[site-map]] · [[database]] · [[data-flow]] · [[tech-stack]]
