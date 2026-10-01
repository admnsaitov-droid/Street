---
tags: [backend, stable]
updated: 2026-09-17
---

# API Architecture

`src/app/api` holds 23 Next.js route handlers. Twenty are locale-aware proxies
in front of Strapi; two send the contact form; one streams media.

**The one hard line:** the browser calls same-origin `/api/*` and nothing else.
Strapi's origin (`API_URL`) and every secret stay server-side.

## The content-proxy shape

Twenty endpoints are the same few lines. Match it exactly when adding one:

```ts
import { NextResponse, NextRequest } from 'next/server';
import { fetchStrapi } from '../_lib/fetchStrapi';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = encodeURIComponent(searchParams.get('locale') || 'en');

    // Served from the Next data cache (5 min, purged on Strapi publish) — see fetchStrapi.
    const data = await fetchStrapi(`/api/home/get-home-data?locale=${locale}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting home data:', error);
    return NextResponse.json({ error: 'Failed to get home data' }, { status: 500 });
  }
}
```

Non-negotiable parts: **Strapi is only reached through `fetchStrapi`**
(`src/app/api/_lib/fetchStrapi.ts` — the one place `API_URL` is read for
content; never `axios`/raw `fetch`, which bypass the cache), the `locale` param
with an `'en'` default, URL-encoded query values, and a caught error that logs
and returns a status without leaking the upstream response.

## Caching (ADR-0117)

Every Strapi read is a `fetch` with `next: { revalidate: CONTENT_REVALIDATE,
tags: [CONTENT_CACHE_TAG] }` (`src/config/cache.ts`: 300s, tag `strapi`) — in
`fetchStrapi`, in server-side `getStrapiData`, and in the sitemap fetchers.

- Repeat requests are served from the Next data cache: measured locally, warm
  page TTFB 25–45ms (cold 0.2–1.1s), warm `/api/get-*` 3–7ms.
- After 300s an entry is served stale once and refreshed in the background.
- **`POST /api/revalidate`** with header `x-revalidate-secret: $REVALIDATE_SECRET`
  calls `revalidateTag('strapi')` — everything refreshes at once. Wire it to a
  Strapi webhook (Settings → Webhooks, entry + media events). 401 on a wrong
  secret, 503 when `REVALIDATE_SECRET` is unset, 405 on GET.
- Only `200` responses are cached, so a Strapi error never sticks.
- Pages stay dynamically rendered (next-intl reads request headers); the win is
  the data, not a full-route cache.

Endpoint → page mapping: [[site-map]].

## The client side

`getStrapiData(path, locale)` in `src/utils/strapi.ts` is the only caller.

- Builds `<origin>/api/<path>?locale=<locale>` — note it appends `locale` with
  `?` or `&` depending on whether `path` already has a query string, which is how
  `get-product-data?slug=x` works.
- **Dedupes in-flight requests** by full URL in a module-level `Map`, cleared on
  settle. Two components asking for the same data in one render produce one
  request.
- 10s timeout (`AbortController`, not `AbortSignal.timeout`, which Safari <16
  lacks — this runs in the browser for Header/Footer/menus), and **returns
  `null` on any failure** rather than throwing.
- Uses `fetch`, not axios: server-side it carries the content cache options, so
  a page render reuses cached data instead of a round trip to `/api` and on to
  Strapi. In the browser the `next` option is ignored.
- Origin: server-side `NEXT_PUBLIC_BASEURL || NEXT_PUBLIC_BASE_URL ||
  http://localhost:3000`; client-side `window.location.origin`.

The server calling its own HTTP endpoint is a deliberate simplification — one
code path for server and client. The cost is an extra hop on every server render.

## The response envelope

There is no shared envelope. Content endpoints return Strapi's payload verbatim
on success and `{ error: string }` with a 4xx/5xx on failure; the send endpoints
return `{ success: boolean, data | error }`. **Keep new endpoints consistent with
the neighbours you are extending** rather than inventing a third shape.

## The form endpoints

| Endpoint | Called from | Body |
|---|---|---|
| `POST /api/send` | `components/ContactForm/ContactForm.tsx` (the global form) | `fullName, email, phoneNumber, subject, body, timezone, languages, utm_*` |
| `POST /api/send-main` | `views/ContactView/screens/ContactForm.tsx` (the contact page) | `firstName, lastName, email, phoneNumber, body` |

Both send through Resend from `noreply@streetbarbell.com` to `RECIPIENT_EMAIL`,
then mirror to Telegram via `sendTelegramMessage` — **non-blocking**, with a
`.catch` so a Telegram outage never fails the submission. `sendTelegramMessage`
accepts both field shapes.

Both throw at **module load** if `RECIPIENT_EMAIL` is unset, which takes the
route down at build/boot rather than at request time. That is intentional but
blunt; it is the one env check the codebase has.

> ⚠️ **Neither validates its body.** Fields are destructured straight from
> `request.json()` and interpolated into an HTML email. No schema library is
> installed. Fixing this is part of ADR-0104 — parse first, 400 on invalid.

## `proxy-media`

`GET /api/proxy-media?url=` proxies Strapi media with `Cache-Control: public,
max-age=31536000, immutable`. It exists because Strapi serves media over plain
HTTP from a fixed IP while the site is HTTPS. Since 2026-09-29 it:

- **allowlists hosts** — only `NEXT_PUBLIC_IMAGE_URL`, `API_URL` and the known
  Strapi addresses; anything else is a 403 (it used to proxy any URL — an SSRF
  hole);
- **streams the upstream body** instead of buffering it (`arrayBuffer()` held
  50MB+ videos in memory and delayed first byte until the last upstream byte);
- **forwards `Range`** and passes through `Content-Range`/`Accept-Ranges`/206,
  so video seeking works through it.

The `/api/media` path `createMetadataGenerator` used to reference never existed;
OG images now point straight at Strapi — see [[seo-metadata]].

## Secrets

| Variable | Read in |
|---|---|
| `API_URL` | the 20 content endpoints, nowhere else |
| `RESEND_API_KEY`, `RECIPIENT_EMAIL` | `send`, `send-main` |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | `utils/telegram.ts` |

None may ever gain a `NEXT_PUBLIC_` prefix. There is no validated env module yet
— [[environment-variables]], ADR-0104.

## Adding an endpoint

1. `src/app/api/get-<thing>/route.ts`, copying the shape above.
2. Call it through `getStrapiData('get-<thing>', locale)` at a **route**, never
   from a view.
3. Add a row to [[site-map]].
4. If it needs a new env var, document it in [[environment-variables]].

## Related

[[cms]] · [[site-map]] · [[data-flow]] · [[environment-variables]] · [[baseline-debt]]
