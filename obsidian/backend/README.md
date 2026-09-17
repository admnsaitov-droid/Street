---
tags: [backend, moc, stable]
updated: 2026-09-17
---

# Backend Overview

There is no backend *application* here — this is a Next.js frontend with a thin
server layer in front of a self-hosted Strapi.

```
browser ──► /api/*  (src/app/api, 23 route handlers)
                │
                ├─► Strapi           20 content proxies, API_URL server-only
                ├─► Resend + Telegram   2 contact-form endpoints
                └─► arbitrary media  1 proxy (proxy-media)
```

## The notes

- [[api-architecture]] — the endpoint shape, `getStrapiData`, the form
  endpoints, secrets, and the two security gaps worth knowing about
- [[cms]] — Strapi: how it connects, what it returns, media, failure behaviour
- [[database]] — there isn't one, and what to do if that changes

## The rules, in one place

1. **The browser only calls same-origin `/api/*`.** No third-party origin is
   called from client code, ever.
2. **Secrets are server-only** — `API_URL`, `RESEND_API_KEY`, `RECIPIENT_EMAIL`,
   `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. A `NEXT_PUBLIC_` prefix on any of
   them is a published secret.
3. **Every outbound call has a timeout** (10s is the house value).
4. **Content failures return `null`, not an exception.** Pages degrade.
5. **Validate anything with a request body.** Neither form endpoint does today —
   ADR-0104.
6. **Data loads at the route**, never in a view or a component.

## Known gaps

Both are recorded in [[baseline-debt]] and ADR-0104:

- No validated env module; 52 scattered `process.env` reads.
- No request-body validation on `send` / `send-main`, and no host allowlist on
  `proxy-media`.

## Related

[[data-flow]] · [[site-map]] · [[environment-variables]] · [[stack-profile]]
