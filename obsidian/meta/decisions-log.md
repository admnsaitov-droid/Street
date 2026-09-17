---
tags: [meta, decision, stable]
updated: 2026-09-17
---

# Decisions Log (ADRs)

Why the conventions are what they are.

- **ADR-0001 … ADR-0016** are inherited from the kit. Notes link them by number,
  so the numbers stay stable.
- **ADR-0101 …** are **this project's**, at the bottom of this note. Several
  amend an inherited ADR for this codebase — 0101 (tokens), 0102 (route
  imports), 0103 (render loop), 0104 (env), 0105 (protected engines).

Amending an inherited decision is fine: write a new ADR that supersedes it rather
than editing the old one. Template: [[templates/adr-note]].

---

## ADR-0001 — The vault is the single source of truth for conventions

**Context.** Conventions spread across a README, a few comments and one long
prompt drift apart within weeks, and an agent reading any one of them writes
inconsistent code.

**Decision.** All conventions live in `obsidian/`, linked and navigable. Root
files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`) are thin shims carrying the hard
rules and pointing here.

**Consequences.** One place to update, one place to read. The vault must be kept
current — enforced by the `Stop` hook (ADR-0006) and the `vault-librarian` agent.
It costs tokens on every session; that is the trade for first-pass-correct code.

---

## ADR-0002 — All real motion is spring-based, through exactly one binding

**Context.** Immersive sites live or die on how motion *feels*. Time-based
keyframes cannot be interrupted, do not respond to velocity, and read as
mechanical. A codebase that accumulates a second and third animation library ends
up with three motion languages and no consistent feel.

**Decision.** Every real motion is spring physics, through a single binding
recorded in `stack.json → bindings.motion`. `@keyframes` are banned outright. Any
animation library that is not the configured binding is banned — including the
ones this kit would otherwise recommend.

**Consequences.** Motion is consistent and interruptible. Adding a library
"just for this one thing" is a hard-rule violation that `verify.sh` FAILs. When a
project already has a binding, that one wins over the kit's default — consistency
outranks preference. See [[motion-system]], [[motion-bindings]].

---

## ADR-0003 — Routes delegate to views

**Context.** Route files are the most framework-coupled files in any codebase.
When UI logic lives in them, a framework upgrade or a migration rewrites the
entire site.

**Decision.** A route/page file is a few lines: load data, render a view. All UI
logic lives in `paths.views`.

**Consequences.** The UI survives framework changes and ports between stacks
almost unchanged — which is what makes this kit portable at all. It adds one file
per route. `verify.sh` FAILs a route importing anything but a view.
See [[routing-views]].

---

## ADR-0004 — Design tokens in three strict tiers

**Context.** Two-tier systems (primitive → utility) make re-theming a
find-and-replace, and "just this one hex" accumulates until a rebrand is a
rewrite.

**Decision.** Tier 1 primitives (`--raw-*`, literals only) → Tier 2 semantic
roles (purpose-named, the themeable layer) → the theme binding, which is always
exactly `--<namespace>-<role>: var(--<role>)`. No tier may be skipped.

**Consequences.** Re-theming is one block of Tier 2 overrides. The indirection
looks redundant until you try to theme without it — an inlining theme layer
freezes a literal at build time and silently breaks theming. The grammar is
identical in every project using this kit, so token names are predictable without
reading the file. See [[design-system]].

---

## ADR-0005 — One shared render loop

**Context.** Every scroll-driven component starting its own
`requestAnimationFrame` gives a page with twenty of them twenty loops, twenty
layout reads per frame, and jank that no individual component looks responsible
for.

**Decision.** One reference-counted, app-wide ticker. Everything per-frame
subscribes; the smooth-scroll library is driven *by* it rather than running its
own loop. Resize listeners are shared the same way. The ticker is an extension
point, never protected code.

**Consequences.** An idle page costs nothing; a hidden tab renders nothing.
Per-frame work is measurable in one place. Components must not call
`requestAnimationFrame` directly. See [[motion-system]], [[data-flow]].

---

## ADR-0006 — Hooks enforce the workflow, not good intentions

**Context.** "Read the docs first, update them after" is advice, and advice is
skipped under pressure — by humans and models alike.

**Decision.** Three Claude Code hooks in `.claude/settings.json`: `SessionStart`
points at the vault (or at `/adapt` when the kit is unfitted), `UserPromptSubmit`
reminds before every request, `Stop` blocks **once per turn** to confirm the docs
were updated.

**Consequences.** The workflow happens without anyone asking for it. The `Stop`
hook is bounded by a session-keyed marker file, so it cannot loop. Every turn
costs some extra context. Disable or edit with `/hooks`.

---

## ADR-0007 — A stack profile instead of a framework lock

**Context.** The kit's predecessor was a Next.js starter: every rule, script and
skill named `src/app`, `next/image`, `NEXT_PUBLIC_`. All of it correct, none of
it portable — and every one of those references becomes a lie after a framework
migration.

**Decision.** One machine-readable profile, `.claude/stack.json`, holds the
framework, paths, bindings, capabilities, conventions and commands. Rules, skills
and `verify.sh` read from it. Prose stays neutral; the profile carries the
specifics. `/adapt` writes it by detection, not assumption.

**Consequences.** The same kit runs on Next, Astro, SvelteKit, Nuxt, a Vite SPA
or plain HTML. A stale profile is now a real failure mode — it silently disables
checks — so updating it is part of any change that moves a path (ADR-0010, and
the `Stop` hook). Agents must resolve paths from the profile rather than from
documentation examples, which is a habit that needs stating loudly and often.
See [[stack-profile]], [[adapt-stack]].

---

## ADR-0008 — The motion layer is a contract, not a shipped library

**Context.** A drop-in kit cannot ship React components to a Svelte project. But
"use springs, figure it out" produces a different vocabulary in every project,
which defeats the point of a shared system.

**Decision.** The kit specifies the **primitive contract** — `Inview`,
`SpringTrigger`, `Hover`, `Handle`, plus the ticker and the text recipe — with
identical names, props and semantics in every framework. The implementation is
built per project against `bindings.motion`.

**Consequences.** A page written in one stack reads the same in another, and a
developer moving between projects already knows the vocabulary. It costs a build
step per project (the `/motion` command). Where a framework has no
children-wrapping component model, the same names appear as directives, actions
or hooks. See [[motion-system]].

---

## ADR-0009 — Text motion is split-and-stagger, with the traps written down

**Context.** Per-character and per-line text reveals are the signature move of an
immersive site, and they are re-implemented badly every time. Two failures are
near-universal: a flex split container that ignores `text-align`, and clipped
overflow shaving descenders when leading is tight.

**Decision.** Text animates through `bindings.textMotion` — `spring-text-engine`
on React, the documented split-and-stagger recipe elsewhere, built once as a
shared component. The traps are hard rule 3 and are checked mechanically where a
script can see them.

**Consequences.** Text motion is consistent and the two classic bugs are caught
before review. A bespoke per-section text animator is a rule violation.
See [[text-motion]].

---

## ADR-0010 — `verify.sh` skips what it cannot check, and says so

**Context.** A mechanical checker that assumes one framework either fails
constantly on another or, worse, passes because its checks silently matched
nothing.

**Decision.** Every check declares its preconditions from `stack.json`. If they
are not met the check prints **SKIP**, and skips are counted in the summary. An
unadapted profile prints a warning banner and runs only the universal checks.

**Consequences.** A clean run means something. A SKIP is a prompt: either the
stack genuinely lacks the concept, or the profile is incomplete. Silence is never
mistaken for a pass.

---

## ADR-0011 — External calls run server-side, behind one envelope

**Context.** A key in the browser is a key that is public, and every endpoint
inventing its own response shape means every caller invents its own error
handling.

**Decision.** Third-party calls run in server code; the browser calls only
same-origin endpoints. Secrets are server-only env vars behind a validated env
module. Input is schema-validated. Responses are `{ data }` or
`{ error: { code, message } }` via a shared handler.

**Consequences.** Secrets cannot leak by refactor. Clients share one error path.
On a stack with **no server**, this rule becomes a warning instead: there is no
safe place for a secret in the repo at all, and that must be said out loud rather
than worked around. See [[api-architecture]].

---

## ADR-0012 — A repeated pattern is a component, not a CSS class

**Context.** "This looks repeated" answered with a global CSS class produces a
second, undocumented design system inside the stylesheet.

**Decision.** One-offs use utilities. Repetition with structure becomes a
component. `@layer components` is reserved for pseudo-elements, third-party DOM
overrides and selectors utilities cannot express. The token file holds tokens and
base resets only.

**Consequences.** The token file stays a few hundred lines forever. Styling stays
where the markup is. See [[design-system]].

---

## ADR-0013 — One narrow exception for CSS transitions

**Context.** Wiring a spring for a colour fade on hover costs a client component
and a hook for no perceptible benefit.

**Decision.** CSS `transition-*` is allowed for simple discrete state changes —
hover/focus colour, opacity, border, a few-px nudge — under three conditions:
token-backed timing, `transition-*` only (never `@keyframes`), and living in the
class attribute rather than a CSS file. Everything scroll-driven, revealing,
staggered or layout-affecting stays a spring.

**Consequences.** The common trivial case stops being ceremonial. The boundary is
narrow and checkable — untokenised transitions WARN. See [[design-system]].

---

## ADR-0014 — Semantic HTML, and structured data as JSON-LD only

**Context.** Animation wrappers erase semantics by default (everything becomes a
`div`), and microdata scattered through markup is unmaintainable and easy to get
subtly wrong.

**Decision.** The tag carries meaning, the class carries looks. Every animation
primitive takes a semantic element and it is always passed. Structured data is
JSON-LD from one shared builder, rendered into the server HTML — never microdata,
never inline script tags scattered through components.

**Consequences.** Accessibility and SEO come from the markup rather than from a
later audit. `verify.sh` WARNs on a wrapper rendering as a `div`.
See [[html-semantics]], [[seo-metadata]].

---

## ADR-0015 — No CMS, database or auth vendor is prescribed

**Context.** The right CMS for an in-app Node framework is the wrong one for a
static site, and the right database for a long-lived server is the wrong one for
serverless. A kit that picks for you is wrong on a large fraction of projects.

**Decision.** The kit ships the *decision procedure* — how to choose against the
render model and runtime, and how to wire it identically once chosen (server-side
fetching, generated types, content through props, media in object storage) — and
no vendor.

**Consequences.** Every project makes and records its own choice as an ADR. The
skills stay useful across vendors. Nothing is installed until it is needed.
See [[cms]], [[database]].

---

## ADR-0016 — The kit ships no application code

**Context.** A starter repo can only start a project. This system has to be
droppable into a codebase that already exists, mid-life, without a rewrite.

**Decision.** The kit is documentation plus an execution layer: `obsidian/`,
`.claude/`, and three root shims. No components, no dependencies, no build
config, no framework.

**Consequences.** It can be added to any project at any point, and removed by
deleting three paths. The cost is that the motion layer must be *built* on first
use rather than imported (ADR-0008), and a brand-new project still needs its
framework scaffolded separately. The kit's value is the conventions and the
enforcement, not the boilerplate.

---

# Street Barbell — project decisions

The kit's ADRs above are inherited and their numbers are stable. This project's
decisions start at **ADR-0101**.

---

## ADR-0101 — Design tokens stay two-tier, in styled-components

**Date.** 2026-09-17 · **Status.** Accepted · Amends ADR-0004 for this project.

**Context.** The kit's ADR-0004 specifies three CSS-variable tiers
(`--raw-*` primitive → semantic role → theme binding), written for a Tailwind v4
token file. This project styles entirely with styled-components and already has a
working token system: `_colors` in `src/styles/colors.ts` holds the literals,
`toVars()` turns each key into `var(--color-<key>)`, and `printVars()` emits them
into `:root` from `GlobalStyles`. Sizing goes through `rm()`/`em()`/`media` from
the SmartCSSGrid rather than spacing tokens. The site is single-theme and has no
dark mode.

**Decision.** Set `conventions.tokenTiers: false` and keep the existing two-tier
system. `.claude/rules/design-tokens.md` documents *this* system instead of the
Tailwind one. The architecture is not changed.

**Consequences.** The token-tier checks in `verify.sh` skip, and the
"hardcoded colour" check still catches literals in markup, which is the rule that
actually matters here. The cost is that a future re-theme would need a semantic
layer added between `_colors` and the components — `colors.blue` names an
appearance, not a role. Revisit if a second theme is ever required.

---

## ADR-0102 — Routes may import the data, metadata and SEO modules

**Date.** 2026-09-17 · **Status.** Accepted · Extends ADR-0003.

**Context.** Every page here does exactly what [[data-flow]] prescribes: load at
the route, render the view with props. It does that through `getStrapiData`,
`createMetadataGenerator`, `getMediaStrapiPath`, `generateStructuredData` and the
`StructuredData` component. The stock delegation check in `verify.sh` allowed
only view and framework imports, so it FAILed all 15 pages — a gate that fails
everything is a gate nobody reads.

**Decision.** Add `paths.routeAllowedImports` to `stack.schema.json` and
`.claude/stack.json`, and teach `verify.sh` to exclude those specifiers. The list
holds five modules, all route-level data/metadata/SEO concerns.

**Consequences.** The check keeps its teeth: a route importing a UI component
still FAILs, which is the violation ADR-0003 exists to catch. The risk is the
list growing into a loophole — **never add a component that renders page content
to it.** Growth in that list is a signal that a route is doing view work.

---

## ADR-0103 — There is no shared render loop, and that is recorded, not fixed

**Date.** 2026-09-17 · **Status.** Accepted (known deviation) · Deviates from ADR-0005.

**Context.** ADR-0005 requires one reference-counted `requestAnimationFrame` that
every per-frame subscriber shares. This project instead has `useLoop`, which
starts a rAF per subscriber, plus Lenis running its own loop in `ScrollLayout`
and `@react-three/fiber` running its own per canvas. The site ships and performs
acceptably today.

**Decision.** Record the deviation rather than refactor a shipped animation
system. `useLoop` / `useLoopInView` remain the only sanctioned way to run
per-frame work; no component may call `requestAnimationFrame` directly.

**Consequences.** Frame cost scales with the number of animated components rather
than staying flat, and `useLoop`'s 100ms default framerate is a trap (10fps) that
callers must override. Consolidating onto one ticker is a worthwhile future
change, and it is a breaking one for every `useLoop` caller — do it deliberately,
not incidentally. Until then, prefer `useLoopInView` so off-screen work stops.

---

## ADR-0104 — The missing validated env module is debt, recorded honestly

**Date.** 2026-09-17 · **Status.** Open · Relates to ADR-0011.

**Context.** `src/` contains 52 direct `process.env` reads across API routes,
the sitemap, layouts and components. There is no env module, no schema
validation, no `.env.example`, and no validation library installed. Separately,
ten call sites read `NEXT_PUBLIC_BASEURL` while `.env` declares
`NEXT_PUBLIC_BASE_URL`, so canonical URLs, hreflang, the sitemap, robots and OG
tags all silently fall through to a hardcoded production literal.

**Decision.** Record `paths.env: null` truthfully so `verify.sh` **FAILs** the
env check rather than skipping it. Do not paper over it by adding more reads.

**Consequences.** The baseline has a standing FAIL that is a real finding, not
noise. Clearing it means one module (`src/config/env.ts`) that parses and exports
the variables, a committed `.env.example`, resolving the `BASEURL` spelling in
code and on every host at once, and validating the two contact-form request
bodies. That is the highest-value next change in this repo — see
[[baseline-debt]].

---

## ADR-0105 — `src/components/Springs` and `src/components/Text` are vendored

**Date.** 2026-09-17 · **Status.** Accepted · Applies ADR-0002 and ADR-0008.

**Context.** Both directories came from the next14 starter this project was built
on, not from per-site work. `TextEngine.tsx` alone is 1381 lines, and every
animated element on the site consumes one of these primitives. An edit inside
them changes behaviour on every page at once, usually invisibly.

**Decision.** List both in `paths.protected`. `verify.sh` FAILs on any `git diff`
there. Extension happens by wrapping — `src/components/animated/` and
`Text/TLine.tsx` are the house examples. The hooks (`src/hooks/useSpringTrigger`,
`useDynamicInView`, `useLoop`) are deliberately **not** protected; they are the
supported extension point.

**Consequences.** Genuine engine bugs need explicit sign-off to fix, which is the
intended friction. If the team decides to own these files as project code, remove
them from `paths.protected` and supersede this ADR.

---

## ADR-0106 — `axios` must never sit in `serverComponentsExternalPackages`

**Date.** 2026-09-17 · **Status.** Accepted.

**Context.** Every route returned HTTP 500 in dev *and* production with
`Element type is invalid: expected a string … but got: undefined`, while
`yarn build` exited 0 and the root layout prerendered correctly. Bisecting
pointed at `Header` and `Footer` independently; both are innocent.

The real chain: `next.config.mjs` listed `'axios'` in
`experimental.serverComponentsExternalPackages`. axios 1.11 is `"type": "module"`,
so externalising it produces an **ESM external**, and webpack marks any module
importing an ESM external as an **async module**. `src/utils/strapi.ts` imports
axios, so it became async — and so did everything importing it: `Header`,
`Footer`, `Menu`, both mega menus. Those are `'use client'` files, so they were
emitted as client references with `"async": true` in the client-reference
manifest, and Next 14.2's SSR flight client resolves an async client reference to
`undefined`. React then threw on the first one it tried to render.

The diagnosis came from patching the throw site in
`next/dist/compiled/next-server/app-page.runtime.dev.js` to print
`oZ(t.componentStack)` and the unresolved lazy payload; the manifest then showed
exactly two async client modules, `Header.tsx` and `Footer.tsx`.

**Decision.** Remove `'axios'` from `serverComponentsExternalPackages` and keep a
comment in `next.config.mjs` saying why. Do not add a package to that list unless
it genuinely cannot be bundled (native bindings, a large server-only SDK) — and
never one that a client component's import graph can reach.

**Consequences.** axios is bundled rather than externalised, which is what it was
doing before the option was added. The failure mode is worth remembering because
nothing about the error names the config: the build passes, the message blames a
component, and the component is fine. The general rule is **an ESM external
turns its whole importer graph async, and async client references do not render
on the server in Next 14**.

---

## ADR-0107 — The loader curtain is gated on scene-ready, not on a timer

**Date.** 2026-09-17 · **Status.** Accepted · Applies the `optimize-3d-scene`
skill §3.

**Context.** The reported symptom was that the first scroll through the site
stuttered and the second was smooth. Measured on a production build at 4× CPU
throttle, the pages carrying a scene blocked the main thread for **1.4–2.6 s** in
a single task during a scroll pass, and linked 5–12 shader programs mid-scroll.

Two causes. `useLazyScene` only mounted the `<Canvas>` once its container was
100px from the viewport, so WebGL context creation, the GLTF fetch and decode,
the HDR environment load, shader compilation and texture upload all landed on a
scroll boundary. And the loader curtain was a fixed `setTimeout(…, 1000)` that
preloaded nothing and knew nothing about the scenes — `useLoadAssets` was called
with every asset list commented out.

**Decision.** Three changes, together:

1. `useLazyScene` returns `shouldLoad: true` from the first render. The
   `IntersectionObserver` stays, but now only drives `isInView` → `frameloop`,
   so an off-screen scene is mounted and warm while drawing nothing.
2. A view declares the scene it owns with `useRequireScene(type, enabled)`. It
   must be the **view**, not the scene component: the scenes are `next/dynamic`
   chunks that mount after the first commit, and the curtain would otherwise
   find an empty registry and hand off early.
3. `useSceneReady` stopped polling `gl.info` and now really prewarms —
   `initTexture` for every texture, `compileAsync` for every program, one
   throwaway render — then reports ready. The curtain lifts on **min 1s, all
   required scenes ready, cap 8s**.

The high-res earth swap on the two globes registers a `pendingWarmups` entry so
it is part of "ready", and its material is compiled and uploaded through
`warmupMaterial` *before* it goes on the mesh — assigning a cold material
recompiles the program inside whatever frame is running.

**Consequences.** The trade is explicit: **the curtain gets longer, the scroll
stops freezing.** Measured warm-cache at 4× CPU: home's curtain 2.16s → 4.34s and
its worst scroll frame 2476ms → 33ms; distribution's curtain 3.53s → 7.02s and
its scroll long-tasks 127ms → 0. Numbers in [[changelog]].

The 8s cap is the safety valve — gating on scene-ready is a promise about the
network that cannot be kept, so a slow or failed model must never strand a
visitor behind a black screen. When the cap fires, the old behaviour returns for
that visit.

The curtain is now almost entirely `public/models/high_res_earth.glb`: 11.2MB, of
which **11.05MB is textures** (7.3MB normal map, 2.6MB diffuse, 1.2MB roughness)
and which is fetched only for its material — the geometry is discarded. Halving
those maps, or dropping the normal map, would roughly halve the curtain. That is
a look change and needs design sign-off, so it is recorded rather than done.

---

## ADR-0108 — The Draco decoder is served from this project, not a CDN

**Date.** 2026-09-17 · **Status.** Accepted · Applies the `optimize-3d-scene`
skill §12.

**Context.** Both `PlanetModel`s hardcoded
`dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/')`,
and every `useGLTF` call used drei's default, which is the same CDN. Three of the
four scenes load `KHR_draco_mesh_compression` models, so a third-party
round-trip sat in front of every one of them before a triangle could decode.

**Decision.** Vendor `three/examples/jsm/libs/draco/gltf` into `public/draco/`
and route every loader through `DRACO_DECODER_PATH` from
`src/utils/dracoDecoder.ts`.

**Consequences.** ~760KB of decoder is served from the project's own origin,
already warm from the same connection. The files must be refreshed when `three`
is upgraded — that is the maintenance cost, and it is noted in
[[tech-stack]]. `high_res_earth.glb` turned out to carry no Draco at all, so its
imperative `GLTFLoader` no longer constructs a `DRACOLoader`.
