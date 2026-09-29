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

Twenty endpoints are the same nine lines. Match it exactly when adding one:

```ts
import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const response = await axios.get(
      `${process.env.API_URL}/api/home/get-home-data?locale=${locale}`,
      { headers: { Accept: 'application/json' }, timeout: 10000 }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error getting home data:', error);
    return NextResponse.json({ error: 'Failed to get home data' }, { status: 500 });
  }
}
```

Non-negotiable parts: `dynamic = 'force-dynamic'`, the `locale` param with an
`'en'` default, the 10s timeout, and a caught error that logs and returns a
status without leaking the upstream response.

Endpoint → page mapping: [[site-map]].

## The client side

`getStrapiData(path, locale)` in `src/utils/strapi.ts` is the only caller.

- Builds `<origin>/api/<path>?locale=<locale>` — note it appends `locale` with
  `?` or `&` depending on whether `path` already has a query string, which is how
  `get-product-data?slug=x` works.
- **Dedupes in-flight requests** by full URL in a module-level `Map`, cleared on
  settle. Two components asking for the same data in one render produce one
  request.
- 10s timeout, and **returns `null` on any failure** rather than throwing.
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

`GET /api/proxy-media?url=` fetches an arbitrary URL and streams it back with
`Cache-Control: public, max-age=31536000, immutable`. It exists because Strapi
serves media over plain HTTP from a fixed IP while the site is HTTPS.

> ⚠️ **No host allowlist.** It will proxy any URL it is given. Any change here
> should add one — restrict it to the Strapi host from `NEXT_PUBLIC_IMAGE_URL`.

Note the `/api/media` path referenced by `createMetadataGenerator` does not
exist — see [[seo-metadata]].

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
