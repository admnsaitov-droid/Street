---
tags: [meta, changelog]
updated: 2026-09-17
---

# Changelog

Notable changes to **this project**. Newest first. One entry per meaningful
change: dependencies, architecture, conventions, launches.

Format: `## YYYY-MM-DD — short title` followed by what changed and why it
mattered. Link the ADR when there is one.

---

## 2026-09-17 — Vault rewritten against the codebase

The notes inherited from the kit described an *ideal* project, not this one. Every
note was rewritten from the source, so the vault is now a description of what is
actually in `src/`.

**Rewritten from code:** [[motion-system]] (real props, defaults and the two
gates) · [[text-motion]] · [[text-engine-reference]] (the local 1381-line
`TextEngine`, replacing the kit's reference for an npm package that is not
installed) · [[motion-bindings]] · [[smooth-scroll]] · [[design-system]] ·
[[component-conventions]] · [[html-semantics]] · [[seo-metadata]] ·
[[routing-views]] · [[system-overview]] · [[data-flow]] · all four backend notes
· all eleven workflows · all three templates · [[meta/README]] and the MOC.

**Errors in the first pass, corrected:**

- The shell does **not** use `CanvasLayout`/`tunnel-rat` — both are unused
  leftovers. Each of the four scenes mounts its own `<Canvas>` with
  `useLazyScene` and a `frameloop` toggle.
- There are **eight** zustand stores, not two, and the two most important pieces
  of state (`fullyLoaded`, `isRerouting`) are **React context**, not zustand.
- 23 API route handlers, not 21. 14 hooks, not 15. 609 redirects, not 614.
- [[data-flow]] and [[system-overview]] still described a single shared
  ticker — the thing ADR-0103 exists to say this project does *not* have.

**Found while reading the source** (added to [[baseline-debt]] and the relevant
notes):

- `createMetadataGenerator` builds OG image URLs as `/api/media…`, an endpoint
  that does not exist — every Strapi-sourced OG image 404s.
- Product schema emits an empty `offers.url` — `ProductView` is a client
  component reading `window.location.href`, which is `''` in the server render.
- `get-contact-data` is a route with no callers — the one dead endpoint.
- The Organization schema ships an **empty `sameAs`** — social profiles are
  commented out.
- `Handle` accepts a `tag` prop and ignores it, always rendering a `div`.
- `useLoop`'s default `framerate` is 100ms — 10fps — and callers must override it.
- `SpringTrigger` always renders a second nested element (`innerTag`).
- `TextEngine`'s `columnGap` is inert on multi-word text; spacing is a fixed
  `0.25em` span.
- No `prefers-reduced-motion` handling exists anywhere in the codebase.

**Convention change:** the kit's neutrality rule was dropped deliberately —
notes name real files, real components and real bugs. Recorded in
[[meta/README]]. The cost is that notes now go stale on refactor, which the
maintenance rules and the `Stop` hook exist to catch.

---

## 2026-09-17 — AI Design Vault installed and adapted to Next.js 14

The kit was dropped into an existing, shipping codebase and fitted to it. **No
application code was changed** — the architecture as it stands is the reference,
and the system was written around it.

**Installed:** `obsidian/`, `.claude/`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`.

**Adapted** (`/adapt`): `.claude/stack.json` now records Next.js 14.2.23 App
Router, server-components render model, TypeScript, yarn, and the real paths —
`src/app` routes, `src/views` views, `src/app/api` server, `src/styles` tokens,
`src/components/{Springs,Text}` protected. Bindings: `@react-spring/web`, the
local `TextEngine`, `lenis`, `zustand`, `styled-components`, `next/*`. Profile:
[[stack-profile]].

**All six path-scoped rules in `.claude/rules/` were rewritten** to describe this
codebase — its token system, its route shape, its Strapi API layer, its vendored
engines — instead of the kit's framework-neutral defaults.

**Extended the kit:** added `paths.routeAllowedImports` to the schema and
`verify.sh` so route-level data/metadata/SEO imports pass while a UI import in a
route still FAILs (ADR-0102).

**Decisions recorded:** ADR-0101 (two-tier styled-components tokens, not three
CSS tiers) · ADR-0102 (route import allowlist) · ADR-0103 (no shared ticker —
recorded, not refactored) · ADR-0104 (missing env module is open debt) ·
ADR-0105 (Springs + Text are vendored).

**Documented:** [[site-map]] (route → view → endpoint, new), [[baseline-debt]]
(new), [[tech-stack]], [[folder-structure]], [[environment-variables]],
[[components]], [[hooks]], [[utils]].

**Root entry points:** `README.md` gained a pointer block to the vault, the stack
profile and `verify.sh`, with the next14-starter's original docs demoted to an
appendix. `AGENTS.md` gained a project header and a pointer to the three standing
deviations (ADR-0101/0103/0104) so an agent does not "fix" a known FAIL.

**Baseline:** `verify.sh` reports 4 FAIL / 6 WARN / **0 SKIP**. Zero skips means
the profile is complete. Every FAIL is real and itemised in [[baseline-debt]].

---

## Baseline — the kit as delivered

The project starts with the AI Design Vault kit installed:

- `obsidian/` — this vault: conventions, decisions, playbooks (framework-neutral
  as delivered; rewritten against this codebase the same day)
- `.claude/` — the execution layer: hooks, path-scoped rules, skills, agents,
  slash commands, `verify.sh`, and `stack.json`
- Root entry points: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`

Unlike a fresh install, this one arrived into a codebase that was already
shipping: five locales, fifteen pages, four WebGL scenes and a Strapi backend.
Nothing about the application was inherited from the kit and nothing about it was
changed by the kit. What was inherited is the way of working: spring motion
through one binding, routes delegating to views, server-first rendering, semantic
SEO-correct markup, and verification before anything is called done.
