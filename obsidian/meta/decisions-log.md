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
   required scenes ready, cap 8s**. *(The cap became 5s, measured from
   navigation start rather than from mount, in ADR-0110.)*

~~The high-res earth swap on the two globes registers a `pendingWarmups` entry so
it is part of "ready", and its material is compiled and uploaded through
`warmupMaterial` *before* it goes on the mesh.~~ **Superseded by ADR-0109** — the
swap is gone, and with it `pendingWarmups` and `warmupMaterial`. Points 1–3 above
still describe the code.

**Consequences.** The trade is explicit: **the curtain gets longer, the scroll
stops freezing.** Measured warm-cache at 4× CPU: home's curtain 2.16s → 4.95s and
its worst scroll frame 2476ms → 42ms; distribution's curtain 3.53s → 4.10s and
its scroll long-tasks 127ms → 0. Numbers in [[changelog]].

**Amended 2026-09-17, after the first version shipped two regressions.** Both were
reported from the running site, not caught by the harness, and both are worth
keeping as warnings:

1. **The gate registered against the wrong scene.** `PlanetModel` hardcoded its
   `SceneType`, but **both globes render the same component** — HomeView's
   `Composition` imports it from `DistributionView/`. Home therefore registered
   its warmup as `distribution`, its curtain never waited, and the upload landed
   on the first scroll. There was also a second, *unreferenced* copy of
   `PlanetModel` under `HomeView/screens/Globe/components/` which looked like
   the one home used; it has been deleted. Nothing in a shared component may
   assume which page it is on.
2. **Moving a freeze into the curtain is not fixing it.** Gating worked on
   distribution and simply relocated a 2.3s stall from the scroll to the loader,
   where it froze the logo animation instead. Skill §3.5 says exactly this. The
   fix was to make the work small (ADR-0109), not to hide it.

A third lesson is in the code: `warmupScene`'s texture upload was wrapped in a
silent `catch {}`. When it turned out not to be running at all, the silence is
what hid it — a prewarm that fails quietly reads as success. It now warns outside
production.

The cap is the safety valve — gating on scene-ready is a promise about the
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


---

## ADR-0109 — The globe ships 2048² maps, and no separate high-res model

**Date.** 2026-09-17 · **Status.** Accepted · Supersedes the high-res swap that
ADR-0107 tried to schedule around. Decided with the maintainer.

**Context.** The globe's texture budget was the whole problem, and it was far
larger than anything in the code suggested:

| file | maps | on disk | in VRAM | upload @4× CPU |
|---|---|---|---|---|
| `high_res_earth.glb` | 8000² diffuse, 8000² roughness, **10000² normal** | 11.2MB | ~900MB | **2250ms** |
| `low_res_earth.glb` | 6000² × 3 | 1.09MB | ~430MB | ~900ms |
| `earth_lights.glb` | 4000² night | 184KB | ~64MB | ~290ms |

`high_res_earth.glb` was fetched **only for its material** — its geometry was
decoded and thrown away. `earth_lights.glb` likewise existed for one texture. And
the "low-res" fallback was 6000², so the swap bought almost no visible detail for
11MB and a 2.25s main-thread stall. The globe renders at most ~800px tall; a
10000² normal map is roughly 150× more texels than can ever be sampled.

**Decision.** Extract the maps from the GLBs, re-encode them at **2048×2048**
webp, and load them with `useTexture` — which suspends, so they resolve inside
the scene's own `Suspense` boundary and are uploaded by the normal prewarm.
`low_res_earth.glb` is kept **for its geometry only**; its maps are replaced
before the first draw, so they never upload. `high_res_earth.glb` and
`earth_lights.glb` are no longer fetched at runtime.

Encoding: `dwebp` to PNG, then `cwebp -resize 2048 2048 -m 6` at q88 (diffuse,
night), q92 (normal — lossy normals band at lower quality), q82 (roughness).
Source files stay in `public/models/` so the maps can be re-cut.

**Consequences.** Texture download for the globe goes **11.2MB + 184KB → 548KB**,
VRAM ~1.4GB → ~67MB, and the upload from ~3.4s → ~0.6s. Both reported freezes
are gone: home blocks **0ms** after the curtain (was a single 2600ms task), and
distribution's worst in-curtain task is **637ms**, down from 2322ms.

The look is the trade, and it is small: compared side by side at 1280×800 the
globe is indistinguishable — continents, coastlines, night city lights, clouds
and the rim/night shader all read the same. Mobile gains the most, since it
previously uploaded the 6000² set and now uploads 2048².

Because the swap is gone, so is the machinery ADR-0107 added for it:
`pendingWarmups`/`beginWarmup`/`endWarmup` on the animation store, and
`warmupMaterial`. Deleted rather than left dormant.

**What is left in the curtain** is no longer one stall but a spread: JS parse and
compile, Draco geometry decode, the `Environment` HDR's PMREM pass
(`adams.hdr` 1.6MB, `sky.hdr` 1.28MB, both equirect) and ~600ms of remaining
uploads. Pre-baking the environments to KTX2 cubemaps is the next lever if the
loader needs to get shorter.

---

## ADR-0110 — Media shows a placeholder, and posters go through the optimiser

**Date.** 2026-09-18 · **Status.** Accepted.

**Context.** Three reports, one root: media slots sat empty while their bytes
arrived, images "loaded very very slowly", and page transitions took seconds.
Measured against the production build:

| finding | cost |
|---|---|
| Home hero poster set as the raw `<video poster>` attribute | **8.1MB PNG, 3.2s** — `poster` is not optimisable, so the browser fetched the Strapi original |
| Strapi's nginx serves `/uploads` with `Cache-Control: max-age=300` | Next derives its optimised-image TTL from upstream, so it **re-fetched and re-encoded** those originals every five minutes |
| `getMediaStrapiPath` falls back to `/placeholder.jpg` | the file **did not exist** — every missing-media slot spent ~1.3s on a failing optimise |
| `Header`/`Footer` refetched on mount | they already receive server-rendered `initialData`; ~1.5s of duplicate requests per page load |
| four mega-menus fetched on mount | always mounted, always closed — ~2s more, for panels nobody had opened |
| `TransitionBg.show()` | waited a fixed **500ms before** calling `router.push`, so every navigation paid half a second before any work started |
| `MediaComponent`'s image path | no placeholder at all |

**Decision.**

1. **A placeholder is the default, not an add-on.** `MediaPlaceholder` renders on
   the first paint and fades out on load, in both the image and video paths.
   There is no delay timer — `SkeletonImage`'s `delay = 300` is what made the
   old skeleton read as lingering, and that component is unused anyway.
   Content imagery that does not go through `MediaComponent` uses
   **`PlaceholderImage`**, a drop-in for `next/image` that renders the
   placeholder as a *sibling* — no wrapper element, so it swaps in without
   touching a layout rule, at the cost of requiring a positioned parent (which
   every `fill` image already has).
2. **Posters go through `next/image`.** `VideoPlayer` renders the poster as an
   `<Image fill>` above the video and fades it when the video can play.
3. **`images.minimumCacheTTL` was 30 days**, so an expensive optimise is paid once
   per asset per deployment rather than every five minutes. *Superseded by
   ADR-0118: now 1 day — 30 days also became the browser `max-age`, and
   "Replace media" keeps the URL.*
4. **`sizes` is a first-class prop on `MediaComponent`**, and `priority` is set
   on hero media.
5. **Nothing fetches on mount that the server already rendered**, and anything a
   closed panel needs waits for `onIdle`.
6. **The navigation starts in the same frame as the curtain**, which is what
   covering the screen is for.

**Amended 2026-09-18.** The first pass covered `MediaComponent` but left every
direct `next/image` call site bare — the line, article and product cards among
them — and defaulted the placeholder to a near-black shade, which read as heavy
rather than as a hint. Now: the default tone is **light**, the shades are
tokens (`mediaPlaceholder`, `mediaPlaceholderShimmer`, `mediaPlaceholderDark` in
`_colors`) rather than the literals the first pass hardcoded, and nine card and
gallery components render through `PlaceholderImage`. `SkeletonLoader`'s sweep
became `--color-shimmer` with a white default, because a white shimmer over a
near-white placeholder is invisible.

**Consequences.** Measured at 4× CPU throttle on the production build: home's
slow scroll goes from a 2600ms freeze to a single 118ms task; navigation from
1672–2396ms to 543–1283ms; the placeholder asset from 1337ms to 78ms; warm
Strapi images from 3240ms to ≤99ms. On a throttled 900kbps connection the hero
slot now shows a grey block with the text and header already readable, instead
of empty space.

**What this does not fix, because it is not in this repo.** Strapi sends
`max-age=300` on upload URLs. (Located 2026-09-30: it is not nginx but the
Strapi repo's `config/plugins.ts` → `upload.providerOptions.localServer.maxage`.
The upload URLs are **not** immutable — "Replace media" keeps the hash — so the
fix there is 1 day without `immutable`, ADR-0118; pending that repo's commit +
redeploy.)
Strapi is also generating only a 245px
`thumbnail` format for a 2940px source, so the optimiser always starts from the
full-size original. And SVG logos still come raw from that origin (~0.7–1.3s
each, above the fold on every page) because `next/image` passes SVG through
unless `dangerouslyAllowSVG` is set — which is a real XSS consideration for
CMS-uploaded files and is therefore a decision for the team, not a default.

---

## ADR-0111 — The curtain waits for the hero, and never for the impossible

**Date.** 2026-09-18 · **Status.** Accepted · Refines ADR-0107.

**Context.** Three findings, measured on the production build.

1. **The reveal showed an unfinished hero.** The curtain waited for the 3D scene
   but not for the hero image, so it lifted onto a placeholder and the visitor
   watched the LCP element arrive a second or two later. Worse, `VideoPlayer`
   set its poster in an effect, so the poster was **absent from the
   server-rendered HTML** — `priority` had nothing to preload and the request
   did not start until +2.6s.
2. **A scene that cannot render held the curtain to its cap.** Anything without
   usable WebGL — headless Chrome, Lighthouse, PageSpeed Insights — never
   reports a scene ready. Those pages sat behind the curtain for the full cap
   and Lighthouse recorded **no Largest Contentful Paint at all**: `home`,
   `package`, `product` and `distribution` each scored **0** for performance.
3. **Gating on a below-the-fold scene is a bad trade.** Home's globe is seven
   sections down, yet it held a full-screen curtain in front of the hero.

**Decision.**

- **The poster renders server-side.** `VideoPlayer` seeds its poster state from
  the prop instead of an effect, so it is in the first HTML and Next emits its
  `rel=preload`.
- **Above-the-fold media gates the curtain**, through `useRequireMedia` and
  `requiredMedia`/`readyMedia` on the animation store. Only `priority` media
  registers; below-the-fold imagery keeps its placeholder.
- **Only a scene that can actually render may gate.** `useRequireScene` checks
  `canRenderWebGL()` and `isBot()` and registers nothing otherwise. Waiting for
  something impossible is the one case where the gate is pure cost.
- **A bot never mounts a scene at all** (`optimize-3d-scene` §1), so the three.js
  chunk is never fetched. The check is client-side on purpose: reading
  `headers()` would opt every page out of static generation, and the
  server-rendered HTML stays byte-identical for everyone.
- **Home's globe no longer gates.** It still mounts at page load and prewarms in
  the background, which is what keeps the scroll smooth; it simply finishes
  after the reveal. Hero scenes — product, package, distribution — still gate,
  because there the scene *is* the hero.
- **Texture uploads are chunked one per frame** so the curtain's own animation
  keeps running.

**Consequences.** Desktop Lighthouse went from four pages scoring **0** to every
page measured, SEO **100 everywhere**, CLS 0 everywhere, LCP ≤2.5s. Numbers in
[[changelog]].

**What this is not.** The bot check is not cloaking — the HTML is identical and
only a decorative WebGL layer is skipped. And it does not detect Lighthouse:
Lighthouse sends an ordinary mobile Chrome user agent. What fixes the
measurement is `canRenderWebGL()`, which is a correctness fix that happens to
apply there.

**Measured and rejected: "the loader curtain is the mobile bottleneck."** It is
not. Disabling the curtain entirely changed mobile LCP by about 0.1s (home
9.1→9.0s, about 5.5→5.6s, product 6.2→6.3s). Mobile is bound by **JavaScript
execution** — `bootup-time` 6.0s at 4× CPU, 300KiB of unused JS — not by the
loader. Any future attempt to buy mobile performance by shortening the curtain
is chasing the wrong thing.

---

## ADR-0112 — Failure states are designed, not blank

**Date.** 2026-09-18 · **Status.** Accepted.

**Context.** Three places rendered *nothing* when something went wrong, and a
fourth rendered the wrong thing:

- `ProjectsMap` returned an empty container on error, so a failed map read as a
  hole in the page.
- There was no route-level `error.tsx`, so a render failure fell all the way to
  `global-error.tsx` — which replaces the whole document and looked nothing like
  the site.
- The header's mega-menu images never showed a placeholder when the hover
  changed their source, so the hover appeared to do nothing while the new image
  loaded.
- The selected distributor card was `rgba(0, 0, 0, 0.9)` on a page whose
  background is the dark globe — effectively no contrast.

**Decision.**

- **`src/app/[locale]/error.tsx`** — a branded error boundary that keeps the
  shell: centred, one line of copy ("This page didn't load."), a retry, a way
  home and a "Report this" mailto carrying the page URL and the error digest.
  Address comes from `NEXT_PUBLIC_SUPPORT_EMAIL`. *(The copy was trimmed and the
  layout centred later the same day; the original wording explained whose fault
  it was, which is noise on a page nobody wants to be reading.)*
- **`global-error.tsx`** rewritten to match, self-contained (it has no provider
  to lean on) and **without the `@keyframes` block** it used to carry, which
  retires one of the standing `verify.sh` failures.
- **The map failure state** holds its space with `colors.mediaPlaceholder` — the
  same shade media placeholders use — and one line of copy.
- **`PlaceholderImage` resets on `src` change**, so a swapping slot shows the
  skeleton again instead of the stale image.
- **The selected distributor card is white with dark text.**

**Consequences.** `NEXT_PUBLIC_SUPPORT_EMAIL` is new and unset; both error pages
fall back to `info@streetbarbell.com`, which is a guess — set the variable.

---

## ADR-0113 — Capability, not identity, decides whether the scene mounts

**Date.** 2026-09-18 · **Status.** Accepted · Corrects ADR-0111.

**Context.** ADR-0111 added `isBot()`, and it included a `navigator.webdriver`
check for "headless Chrome without a UA giveaway". That flag is true in **any**
automation-controlled browser. It silently removed the hero scene from every
screenshot taken through Puppeteer — which is how it was found, after several
verification passes had quietly been looking at a page with no globe — and it
would do the same to a real visitor whose browser sets the flag.

It did not even achieve what it was added for: Lighthouse drives Chrome through
`chrome-launcher`, which does not set `webdriver`, and sends an ordinary mobile
Chrome user agent.

**Decision.** Remove the `webdriver` check. `isBot()` matches on the user-agent
pattern only, which is what real crawlers actually announce. The case that
mattered — an environment that cannot render WebGL — is handled by
`canRenderWebGL()`, which tests **capability rather than identity**.

**Consequences.** A heuristic that guesses *who* is asking will misfire on
people; a check for *what the client can do* cannot. Prefer the latter. The
scene mounts again under automation, which also means screenshots taken through
the harness are trustworthy again.

---

## ADR-0114 — Width-conditional markup must agree with the server

**Date.** 2026-09-18 · **Status.** Accepted.

**Context.** Every page of the site threw React **#418** (hydration failed) and
**#423** (error hydrating a Suspense boundary) in production. A site-wide audit
of all thirteen page types found **zero clean pages**.

The cause is one pattern, repeated: `useWindowWidth()` reports **0 on the
server** and the real width on the client's first paint, so anything shaped like
`width > 768 ? <A/> : <B/>` renders two different trees and React tears the
whole thing down and rebuilds it.

The worst instance was in the shell, so it hit every page:
`DynamicScrollRevealWrapper` wraps `children` in **two divs on desktop and none
on mobile**, decided from that width. Every page was therefore server-rendered
in the mobile shape and hydrated in the desktop one.

**Decision.** A `useMounted()` hook — false on the server and during the first
client render, true after. Width-conditional **markup** is gated on it, with
**desktop as the server assumption**:

```tsx
{(!mounted || width > 768) && <DesktopOnly />}   // wide  → renders on the server
{mounted && width <= 768 && <MobileOnly />}      // narrow → never on the server
```

The polarity matters and is easy to get backwards: gating a wide branch as
`mounted && width > 768` makes the *server* render the mobile branch, which is
both a worse first paint for most visitors and a flash on desktop.

This applies to markup only. A width that feeds a prop, a number or a behaviour
does not change the DOM shape and needs no guard.

**Consequences.** Twelve of thirteen page types are clean. The product page still
reports one mismatch inside its `Hero` subtree, not yet isolated — recorded in
[[baseline-debt]] rather than left implied.

**Update 2026-10-02 — all clean.** A browser sweep of 14 page types × mobile and
desktop found the remaining offenders, all the same pattern: the product page
(`ProductView` mobile controls, and `SameLineProducts`' swiper/buttons/
`slidesPerView`, which full-page-failed on desktop), the home and About hero
overlays (now always rendered, CSS picks the visible one), and random
`Math.random()` input ids (now `useId()`). 28/28 page×viewport runs report no
hydration warning. Rule of thumb confirmed: if CSS can hide it, don't branch on
width at all.

Four other real defects surfaced in the same audit and were fixed: an `href` of
`/products/` built from an empty slug (prefetched, 404, on every page carrying a
product preview); `<video src="">`, which throws `NotSupportedError`; `<div>`
inside `<p>` on all three policy pages; and thirteen files of kebab-case SVG
attributes (`stroke-width`) that React rejects.

**The lesson worth keeping:** these were invisible in normal use and only showed
up when something actually read the console on every page. A page that *looks*
right can still be rebuilding its entire DOM on load.

## ADR-0115 — The sitemap is a route-based index, not `app/sitemap.ts`

**Date.** 2026-09-29 · **Status.** Accepted.

**Context.** Merging the `textura/den` branch (the second, actively developed
repository — merged with `--allow-unrelated-histories`, which ADR-0116 later showed was wrong: the repos share a base)
brought back the convention-based `src/app/sitemap.ts` while this repo already
had a hand-built sitemap index (`sitemap.xml/route.ts` + `sitemap-pages.xml` +
`sitemap-products.xml` over `src/utils/sitemap.ts`). Both claim the same
`/sitemap.xml` URL, so one had to go.

**Decision.** Keep the route-based index, delete `app/sitemap.ts`. The index
splits pages from the large, rarely-changing product set, emits a real
`<lastmod>` per child (newest entity inside), fetches Strapi through the shared
helpers instead of a hardcoded `street-barbell.vercel.app` base, and carries no
debug logging. `app/sitemap.ts` had none of that.

**Consequences.** Adding a route means touching `src/utils/sitemap.ts` /
`sitemap-pages.xml/route.ts`, not a `staticPages` array in a convention file —
[[seo-metadata]] and `.claude/rules/routing-views.md` both say so. Any future
merge from the textura repo will re-add `app/sitemap.ts`; delete it again.

## ADR-0116 — Merge the textura repo against its real base, never as unrelated histories

**Date.** 2026-10-01 · **Status.** Accepted.

**Context.** This repo started as a copy of `textura-agency/street-barbell`: its
root commit `fd10313` ("migrating street", 2026-07-03) has the same tree as
textura's `e45e7dc` (one `.md` file apart). Git does not know that, so the
2026-09-29 merge of `textura/den` ran with `--allow-unrelated-histories`, saw
84 add/add conflicts, and had no base to tell "changed here" from "unchanged
there". Resolving them all in den's favour silently reverted every file this
repo had changed since July (robots, a security bump, the title format, SEO
metadata, a product-page feature — see the 2026-10-01 changelog).

**Decision.** Before merging from the textura repo, graft the shared base:

```bash
git fetch textura <branch>
git replace --graft fd10313 e45e7dc     # local only; gives git the real base
git merge textura/<branch>              # now a true 3-way merge
git replace -d fd10313                  # optional cleanup
```

With the base in place the den merge had **3** real conflicts, not 84. Never
resolve a merge from that repo with a blanket `--ours`/`--theirs`.

**Consequences.** `refs/replace` is not pushed by default, so the graft has to
be recreated in each clone that merges. The 2026-09-29 merge commit stays in
history as-is; its damage was repaired by a forward commit, not a rewrite.

## ADR-0117 — Strapi content is cached in the Next data cache, purged by a publish webhook

**Date.** 2026-10-01 · **Status.** Accepted.

**Context.** Every page render called `getStrapiData` → HTTP to this site's own
public `/api/get-*` → axios → Strapi, and Header/Footer/menus did the same from
every visitor's browser. Nothing was cached: axios bypasses Next's data cache,
and all twenty routes are `force-dynamic`. Production TTFB was 0.5–3s
(`/en/lines` up to 3.1s), pages `cache-control: no-store`, CDN `DYNAMIC`.

**Decision.** All Strapi reads go through `fetch` with
`next: { revalidate: CONTENT_REVALIDATE, tags: [CONTENT_CACHE_TAG] }`
(`src/config/cache.ts`: 300s, tag `strapi`):

- `src/app/api/_lib/fetchStrapi.ts` — the only content reader of `API_URL`;
  all twenty `/api/get-*` routes use it (axios removed from them).
- `src/utils/strapi.ts` `getStrapiData` — `fetch` with the same options
  server-side (browser behaviour unchanged).
- `src/utils/sitemap.ts` fetches carry the tag.

Freshness: `POST /api/revalidate` (header `x-revalidate-secret`, env
`REVALIDATE_SECRET`, timing-safe compare) calls `revalidateTag('strapi')`.
A Strapi webhook on publish/unpublish/update/delete and media events makes
edits live immediately; without it they land within 300s.

**Consequences.**
- Measured on a local production build: warm page TTFB **25–45ms** (cold
  0.2–1.1s), warm `/api/get-*` **3–7ms** (cold 0.15–1.1s). Strapi sees at most
  one request per URL per 5 minutes instead of one per page view.
- Only `200` responses are cached (Next's own rule), so a Strapi error never
  sticks; a stale entry keeps being served if a background refresh fails.
- Pages remain dynamically rendered — next-intl reads request headers, so
  there is no full-route cache. That is a further, separate step
  (`setRequestLocale` + static params) if TTFB ever needs to go lower.
- The cache lives on the server's disk (`.next/cache/fetch-cache`); a fresh
  deploy starts cold. With several instances behind a balancer each has its
  own cache, and a webhook purges only the instance it reaches.
- **Never** reach Strapi with axios or an untagged `fetch` from the content
  path — it silently opts that read out of caching and of the webhook purge.
- **Route handlers can't be ISR'd and purged.** Next 14.2's file-system cache
  applies `revalidateTag` to cached pages and fetches but not to cached route
  handlers (`kind: "ROUTE"`), and `revalidatePath` goes through the same tag
  check. So any route handler that must follow the webhook — the sitemaps —
  is `force-dynamic` over cached, tagged data instead of having a
  `revalidate`.

## ADR-0118 — Media is cached for one day, never "immutable"

**Date.** 2026-10-01 · **Status.** Accepted. Supersedes the 30-day TTL in ADR-0110.

**Context.** Strapi upload URLs look content-hashed (`DSC_04848_1_89ec867487.webp`)
but are not: in `@strapi/upload` `replace()`, "Replace media" **keeps the
existing `hash` and `ext`** ("so the file url doesn't change when the file is
replaced"). Meanwhile:
- `images.minimumCacheTTL` was 30 days, and Next uses
  `max(upstream max-age, minimumCacheTTL)` both for its optimiser cache *and* as
  the browser `Cache-Control` of `/_next/image` — so a replaced image stayed
  stale on the site, and in visitors' browsers, for up to a month;
- the pending Strapi fix set `/uploads` to 30 days + `immutable`;
- `proxy-media` sent `max-age=31536000, immutable`.

URL versioning was considered and rejected: only about half of the media
objects the custom Strapi controllers return carry `updatedAt` (format variants
never do), so there is no reliable version key.

**Decision.** One day everywhere, no `immutable`:
`images.minimumCacheTTL = 86400`; Strapi `localServer.maxage = 86400000`
(→ `max-age=86400`); `proxy-media` `public, max-age=86400`.

**Consequences.** Re-encoding happens at most once a day per size (288× rarer
than the original 5-minute cycle). A replaced image is visible within a day. To
make one visible **immediately**, upload it as a new file and attach that
instead of using "Replace media" — a new file has a new URL. Re-linking
existing files (e.g. fixing swapped product images) is instant once the page
data refreshes (ADR-0117 webhook).
