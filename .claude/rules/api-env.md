---
paths:
  - "src/app/api/**"
  - "src/utils/strapi.ts"
  - "src/utils/telegram.ts"
  - "src/utils/getMediaStrapiPath.ts"
  - "next.config.mjs"
description: Server-side calls, secret handling and the response envelope
---

# API & secrets

Full note: `obsidian/backend/api-architecture.md`. Endpoints live in
`src/app/api` (`paths.server`). There is **no validated env module yet**
(`paths.env` is null — ADR-0104).

## The shape of this API layer

`src/app/api/*/route.ts` is a thin, locale-aware proxy in front of Strapi:

```ts
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const locale = new URL(request.url).searchParams.get('locale') || 'en';
  try {
    const response = await axios.get(`${process.env.API_URL}/api/…?locale=${locale}`,
      { headers: { Accept: 'application/json' }, timeout: 10000 });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('…', error);
    return NextResponse.json({ error: '…' }, { status: 500 });
  }
}
```

Keep new endpoints to that shape: read `locale`, call Strapi with a timeout,
return JSON, log and return a 4xx/5xx on failure. `src/utils/strapi.ts` is the
only client-side entry point and it dedupes in-flight requests by URL.

## Hard lines

- **Third-party calls run server-side.** The browser only calls same-origin
  `/api/*`. `API_URL`, `RESEND_API_KEY`, `RECIPIENT_EMAIL`, `TELEGRAM_BOT_TOKEN`
  and `TELEGRAM_CHAT_ID` are server-only and must never gain a `NEXT_PUBLIC_`
  prefix.
- **`NEXT_PUBLIC_` is a security boundary**, not a naming style. Anything behind
  it is baked into the browser bundle — `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is
  public and must stay HTTP-referrer-restricted in the Google console.
- **Validate input** on anything that accepts a body. `src/app/api/send/route.ts`
  and `send-main/route.ts` currently destructure the JSON body unvalidated and
  interpolate it into an email — the first thing to fix when you touch them.
- **Timeout every outbound call** (10s is the house value) and never leak an
  upstream stack trace to the client.
- `proxy-media/route.ts` fetches an arbitrary `url` query parameter. Any change
  there must keep — and ideally tighten — a host allowlist.

## Env vars

Until the validated env module exists, `verify.sh` FAILs every `process.env`
read outside one. Do not paper over it by adding reads; the fix is one module
(ADR-0104). When you add a variable: use it server-side, document it in
`obsidian/architecture/environment-variables.md`, and add it to `.env.example`.

**Known trap:** the code reads `NEXT_PUBLIC_BASEURL` in ten places while `.env`
declares `NEXT_PUBLIC_BASE_URL`. Canonical URLs, the sitemap and OG tags are all
falling through to the hardcoded production literal. Do not copy either spelling
without checking which one you need.
