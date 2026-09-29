---
tags: [architecture, stable, decision]
updated: 2026-09-17
---

# The Stack Profile

`.claude/stack.json` is this project's shape in machine-readable form — the
single source of truth for paths, packages and commands. ADR-0007.

> [!important] The habit that matters
> **Resolve every path and package name from the profile**, not from a note. A
> note can go stale between refactors; a wrong path written into a new file is
> found much later.

```bash
cat .claude/stack.json
```

## What reads it

| Reader | Uses |
|---|---|
| `.claude/scripts/verify.sh` | every path, extension, binding, capability and convention — it decides which checks run and prints them in its header |
| `.claude/scripts/hooks/*` | `adapted`, `framework.name` — the session-start message |
| `.claude/skills/*` | `commands.*`, `paths.*`, `bindings.*` |
| `.claude/rules/*` | their `paths:` frontmatter, retargeted by `/adapt` |
| You | before writing any file |

## The field groups

Full descriptions: `.claude/stack.schema.json`.

| Group | Answers | Here |
|---|---|---|
| `framework` | which framework, version, render model | nextjs 14.2.23, server-components |
| `language`, `packageManager` | is `any` checkable; which command prefix | ts, yarn |
| `paths` | where routes, views, components, styles, server code, env and protected zones live | see below |
| `extensions` | which file types are source | `.tsx`, `.ts` |
| `bindings` | the concrete package for motion, text, scroll, styling, image, link, router, metadata, and the public env prefix | see below |
| `capabilities` | what the framework can do | all true except `islands` |
| `conventions` | which kit conventions are on | `tokenTiers` off (ADR-0101) |
| `commands` | verbatim shell commands | `yarn …` |
| `notes` | what the fields cannot say | 25 entries — **read them** |

`notes[]` is not decoration. It records the `BASEURL` spelling trap, the stale
`package-lock.json`, the missing env module, the absent shared ticker, the
`serverComponentsExternalPackages` trap that 500'd every page (ADR-0106), the
vendored Draco decoder (ADR-0108), where 3D prewarm lives (ADR-0107), and the
globe's 2048² texture set plus the fact that both globes share one component
(ADR-0109), and the media-loading rules — placeholders, `sizes`, posters through
the optimiser, nothing refetching what the server rendered (ADR-0110) — what the
loader curtain may and may not gate on, and the measured Lighthouse baseline
(ADR-0111).

## Keeping it true

A profile that lies is worse than none: `verify.sh` skips checks silently and
agents write into paths that no longer exist.

- Moved a directory, added a package, renamed a script → **update the profile in
  the same turn.** The `Stop` hook asks; `vault-librarian` can do it.
- After a Next.js major or a migration → **re-run `/adapt`** ([[adapt-stack]]).
- `verify.sh` prints its profile header on every run. If that header surprises
  you, fix the profile before trusting the result.

## Resolved profile

Written by `/adapt` on **2026-09-17**. Source of truth: `.claude/stack.json`.

**Framework:** `nextjs` — Next.js App Router **14.2.23**, render model
**server-components**.
**Language / package manager:** TypeScript / **yarn** (both lockfiles are
committed; `yarn.lock` is the maintained one).
**Project kind:** marketing-site — Street Barbell, a five-locale product site
with WebGL scenes and a Strapi backend.

| Path | Value |
|---|---|
| source | `src` |
| routes | `src/app` (pages under `src/app/[locale]`) |
| views | `src/views` |
| components | `src/components` |
| styles | `src/styles` |
| assets | *(none — content assets come from Strapi)* |
| static root | `public` |
| server | `src/app/api` |
| env | *(none yet — ADR-0104)* |
| protected | `src/components/Springs/**`, `src/components/Text/**` |
| route entry glob | `page.tsx` |
| route allowed imports | `@/utils/strapi`, `@/utils/createMetadataGenerator`, `@/utils/getMediaStrapiPath`, `@/utils/generateStructuredData`, `@/components/StructuredData` |

| Binding | Value |
|---|---|
| styling | `styled-components` 6 |
| motion | `@react-spring/web` 9 |
| text motion | `local-text-engine` — `src/components/Text/TextEngine.tsx` |
| smooth scroll | `lenis` |
| state | `zustand` 5 |
| image / link / router | `next/image` · `next/link` · `next/navigation` |
| metadata | `next-metadata` (via `createMetadataGenerator`) |
| validation | *(none — ADR-0104)* |
| public env prefix | `NEXT_PUBLIC_` |

**Capabilities:** ssr ✅ · server components ✅ · file routing ✅ · API routes ✅ ·
image optimisation ✅ · metadata API ✅ · islands ❌

**Commands:** `yarn` · `yarn dev` · `yarn build` · `yarn lint` ·
`npx tsc --noEmit` · *(no test command)*

> [!warning] `yarn start` does not work on this project
> `next.config.mjs` sets `output: 'standalone'`, and Next refuses to run
> `next start` against it. A local production run is:
> ```bash
> yarn build
> cp -R public .next/standalone/public
> cp -R .next/static .next/standalone/.next/static
> cd .next/standalone && node server.js
> ```
> `commands.start` in the profile records the last line. Corrected 2026-09-17.

**Conventions switched off:** `tokenTiers` — this project uses a two-tier
styled-components token system instead of the kit's three-tier CSS-variable
convention. See [[decisions-log]] ADR-0101.

### Judgement calls made during adaptation

| Call | Why |
|---|---|
| `paths.protected` = `Springs/**` + `Text/**` | Both are vendored from the next14 starter, consumed everywhere, and not per-site code. Editing them silently changes every animation on the site. ADR-0102 in spirit; flip the list in `stack.json` if the team decides to own them. |
| Added `paths.routeAllowedImports` to the schema and `verify.sh` | Routes here load data and metadata at the route, which is what [[data-flow]] prescribes — but the stock delegation check allowed only view + framework imports and failed all 15 pages. ADR-0102. |
| `bindings.textMotion` = `local-text-engine` | The kit's React default is the `spring-text-engine` package; this project vendored an equivalent locally before the kit arrived. Consistency beats preference. |
| `paths.assets` = `null` | Content assets live in Strapi. `public/` holds 3D models, textures, fonts, favicons and OG images only. |
| `paths.env` = `null` | No validated env module exists. Recorded honestly so `verify.sh` FAILs instead of silently skipping. ADR-0104. |
| `commands.typecheck` = `npx tsc --noEmit` | Not a `package.json` script, but a real and runnable command. |

### What still needs a decision

See [[baseline-debt]] for the full list with file references.

## Related

[[adapt-stack]] · [[folder-structure]] · [[tech-stack]] · [[system-overview]] · [[baseline-debt]]
