---
tags: [workflow, seo, stable]
updated: 2026-09-17
---

# Workflow — Site Migration

Skill: `site-migration`. Command: `/migrate-site`.

## This site has already been migrated

Street Barbell replaced an earlier site, and the evidence is
**`src/redirects.mjs` — 609 redirects** wired into `next.config.mjs → redirects()`.
Read it before assuming anything about URL structure.

The old shape, as the map reveals it:

| Old | New |
|---|---|
| `/about`, `/contacts`, `/privacy-policy`, `/terms-conditions` | unprefixed → `/en/…` |
| `/our-installations` | `/en/projects` |
| `/category/line/sb-<name>-line` | `/en/lines/sb-<name>-line` |
| `/category/news` | `/en/articles` |
| `/category/projects/:path*` | `/en/distribution` |
| `/small`, `/medium`, `/large` | `/en/packages/<size>` |
| ~100 country paths (`/austria`, `/bahrain`, …) | `/en/distribution` |
| `/3dlayouts`, `/test` | `/en` |

All `permanent: true` (308).

**Consequences for any change you make:**

- **Never delete an entry from `redirects.mjs`.** Each one is a live inbound link
  or an indexed URL. The file only grows.
- The unprefixed → `/en/` redirects exist because `localePrefix: 'always'` leaves
  no unprefixed canonical. Any new top-level path needs the same treatment if it
  ever existed on the old site.
- Country paths collapsing into `/en/distribution` is deliberate consolidation,
  not laziness. Do not "restore" them as pages without a ranking reason.

## If another migration happens

1. **Crawl the live site first** and keep the inventory — every URL, its title,
   and its traffic. After cutover you cannot recover what you did not record.
2. **Snapshot rankings and Search Console** before touching DNS.
3. **Build the redirect map from the crawl**, not from the sitemap — the sitemap
   never had the long tail. Every old URL maps to the closest live equivalent, or
   to a relevant parent. A blanket redirect to the homepage is treated as a soft
   404.
4. **Add them to `src/redirects.mjs`**, `permanent: true`, and test each one
   against the production build.
5. **Keep the metadata**. Titles and descriptions that ranked should survive the
   rebuild unless there is a reason to change them.
6. **Post-launch:** re-crawl, watch Search Console coverage and 404s daily for
   two weeks, and compare against the snapshot from step 2.

## The failures that cost rankings

- Cutover with an incomplete redirect map. Stop and finish it.
- A staging `noindex` or `disallow: /` surviving launch.
- Changing URL structure and metadata in the same release, so nothing can be
  attributed when traffic drops.
- Redirect chains — old → intermediate → new. Map straight to the destination.

## Related

[[seo-aeo]] · [[seo-metadata]] · [[ship]] · [[routing-views]]
