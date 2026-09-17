---
tags: [workflow, launch, stable]
updated: 2026-09-17
---

# Workflow — Ship

The pre-launch gate. Skill: `ship-check`. Command: `/ship`.

Anything unchecked is **reported as unchecked**, never assumed to pass.

## Gates

| # | Gate | Passes when |
|---|---|---|
| 1 | **Builds and obeys the rules** | `.claude/scripts/verify.sh` — no FAILs beyond [[baseline-debt]]; `yarn lint`, `npx tsc --noEmit`, `yarn build` clean |
| 2 | **Correct** | [[qa-verification]] across every route, all five locales, on the **production build** (`yarn build && yarn start`) |
| 3 | **Findable** | content in the server HTML; every route in `src/app/sitemap.ts`; `robots.ts` open; unique metadata per page; JSON-LD validates |
| 4 | **Fast** | measured Lighthouse mobile — LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms; scenes at 60fps on a mid-range phone |
| 5 | **Usable** | keyboard pass, visible focus, AA contrast, 44px targets, no overflow at 360px |
| 6 | **Nothing leaks** | `API_URL`, `RESEND_API_KEY`, `RECIPIENT_EMAIL`, `TELEGRAM_*` server-only; `.env` git-ignored; every var set on the host |
| 7 | **Deploys** | `output: 'standalone'` build runs; domain + HTTPS; Strapi reachable from the server; a real page, form and image verified live |

## The ones that actually fail here

- **`NEXT_PUBLIC_BASEURL` unset.** Ten call sites read it; `.env` declares
  `NEXT_PUBLIC_BASE_URL`. Unset, every canonical, hreflang, OG URL and sitemap
  entry falls back to the hardcoded production literal — which looks fine in
  production and is wrong everywhere else. Verify the **rendered** canonical on
  the deployed site, not the code. [[environment-variables]]
- **OG images 404.** `createMetadataGenerator` builds `/api/media…`, which does
  not exist. Check a real share preview. [[seo-metadata]]
- **A missing sitemap entry.** Routes get added; `staticPages` does not.
  Cross-check `src/app/[locale]/*/page.tsx` against `sitemap.ts` every time.
- **Strapi unreachable from the deploy target.** It is plain HTTP on a fixed IP.
  If the server cannot reach `API_URL`, every page renders its fallback and the
  site looks empty but returns 200. Check a content-bearing page, not just `/`.
- **The contact form.** Two endpoints (`/api/send`, `/api/send-main`), two
  different forms. Submit both on production and confirm the email **and** the
  Telegram message arrive. `RECIPIENT_EMAIL` missing takes the route down at
  module load.
- **Dev-only checks.** `removeConsole` only runs in production; the sitemap's
  debug logging and the middleware log disappear there. Test what ships.
- **A staging `noindex` or `disallow: /` surviving launch.** The most expensive
  one-line mistake in this list.
- **Replacing a live site with an incomplete redirect map.** Stop and finish it —
  [[site-migration]], `src/redirects.mjs`.

## Deploy specifics

- Build output is `standalone`; `sharp` is a dependency for image optimisation.
- Remote image hosts are pinned in `next.config.mjs` — a new media host must be
  added there or images silently fail.
- Env vars must be present **at build time** for anything `NEXT_PUBLIC_`, since
  they are inlined into the bundle.

## Reporting

Each gate as **passed** / **failed-and-fixed** / **not-verified-because**, with
the measured performance numbers. Then a [[changelog]] entry for the launch.

## Related

[[qa-verification]] · [[seo-metadata]] · [[site-migration]] · [[optimize-3d-scene]] · [[environment-variables]]
