---
tags: [architecture, config, stable]
updated: 2026-10-01
---

# Environment Variables

## Rules

- Secrets live in a git-ignored `.env` locally and in the host's environment
  settings in production. `.env` is ignored by `.gitignore`; never commit it.
- **`NEXT_PUBLIC_` is a security boundary, not a naming style.** Anything behind
  it is baked into the browser bundle. Anything without it is server-only.
- **There is no validated env module yet** (`paths.env` is `null`). 52
  `process.env` reads are scattered across `src/`, so `verify.sh` FAILs the env
  check by design until one exists — see ADR-0104 and [[baseline-debt]].
- **`.env.example`** (committed 2026-10-01) lists every variable with no secret values. Keep it in step with this table.

## Current variables

| Name | Scope | Purpose |
|---|---|---|
| `API_URL` | **server** | Strapi origin. Read for content only in `src/app/api/_lib/fetchStrapi.ts` (plus `src/utils/locales.ts`). The single most important variable — every page is empty without it. |
| `NEXT_PUBLIC_IMAGE_URL` | public | Strapi media host. Parsed in `next.config.mjs` to build an `images.remotePatterns` entry — a malformed value breaks the build. |
| `NEXT_PUBLIC_BASE_URL` | public | Site origin, used by `src/utils/strapi.ts` for server-side self-calls. |
| `NEXT_PUBLIC_BASEURL` | public | ⚠️ **A different variable.** What the other ten call sites actually read: `metadataBase`, canonical URLs, hreflang, sitemap, robots, breadcrumbs, article schema. |
| `NEXT_PUBLIC_LOCALES` | public | Comma-separated locale list read by `src/i18n.ts`. Must agree with `src/config/locales.ts`. |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | public | Declared in `.env`; not currently read in `src/`. |
| `LOCALES` | server | Declared in `.env`; not currently read in `src/`. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | public | Contact-page map. Public by necessity — **must** stay HTTP-referrer-restricted in the Google console. See `GOOGLE_MAPS_SETUP.md`. **Allowed referrers must include `https://www.streetbarbell.com/*`** — on 2026-10-02 production returned `RefererNotAllowedMapError` for that origin on every load, so the contact and projects maps were blank (Google Cloud → Credentials → key → Website restrictions; add `https://streetbarbell.com/*` too). |
| `NEXT_PUBLIC_GTM_ID` | public | Google Tag Manager container, injected in `src/app/layout.tsx`. |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | public | ⚠️ **Not set yet.** Where the "Report this" button on both error pages sends people. Unset, they fall back to `info@streetbarbell.com`, which is a **guess** — set it or the reports go nowhere. Read by `src/app/[locale]/error.tsx` and `src/app/global-error.tsx`. ADR-0112. |
| `RESEND_API_KEY` | **server** | Contact-form email. `src/app/api/send*` throws at module load if `RECIPIENT_EMAIL` is missing. |
| `RECIPIENT_EMAIL` | **server** | Contact-form destination. |
| `TELEGRAM_BOT_TOKEN` | **server** | Contact-form mirror to Telegram. |
| `TELEGRAM_CHAT_ID` | **server** | — |
| `REVALIDATE_SECRET` | **server** | Shared secret for `POST /api/revalidate` (header `x-revalidate-secret`), sent by the Strapi publish webhook. Unset → endpoint disabled (503); content then refreshes on the 300s TTL. Generate with `openssl rand -hex 32`. ADR-0117. |

> [!warning] `NEXT_PUBLIC_BASEURL` vs `NEXT_PUBLIC_BASE_URL`
> `.env` declares the underscored spelling; ten call sites read the unspaced one.
> Those sites are therefore falling through to the hardcoded literal
> `'https://www.streetbarbell.com'`. It happens to be correct in production and
> wrong everywhere else — previews and staging emit production canonicals.
> Fixing it means picking one spelling and changing both the code and every
> host environment together.

## When adding one

1. Decide the scope first — a secret must not gain a `NEXT_PUBLIC_` prefix.
2. Read it server-side only, inside `src/app/api/*`.
3. Add a row to the table above.
4. Set it on the host for every environment that needs it.
5. Add a [[changelog]] entry.

## Related

[[stack-profile]] · [[api-architecture]] · [[seo-metadata]] · [[baseline-debt]]
