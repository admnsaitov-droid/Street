---
tags: [moc, home]
updated: 2026-09-17
---

# 🧠 Street Barbell — Project Brain

This vault is the **single source of truth for how this project works** — its
conventions, its architecture, its decisions, and the things about it that are
currently broken. Every note describes **this codebase**, by name: real paths,
real components, real endpoints.

> [!important] Two sources of truth, different jobs
> **This vault** = how the project works and why — conventions, playbooks,
> decisions, known debt.
> **`.claude/stack.json`** = the machine-readable profile — paths, bindings,
> commands. When a note and the profile disagree, the profile wins and the note
> is stale; fix it.
>
> When a note and the **code** disagree, the code wins. Fix the note in the same
> turn — see [[meta/README|Meta overview]].

> [!info] What is this project?
> **Street Barbell** — a five-locale (`en es fr de fi`) marketing and product
> site on **Next.js 14.2 App Router**, with spring-driven motion, a vendored
> split-text engine, four three.js scenes and a **Strapi** content backend.
> Content comes from Strapi through this app's own `/api` layer; nothing in the
> browser talks to Strapi directly.
>
> The documentation system around it is the **AI Design Vault** — a portable
> build system for immersive, animation-heavy websites, fitted to this codebase
> on 2026-09-17. It describes the architecture that exists; it did not change it.
>
> **New here? Read [[stack-profile]] → [[site-map]] → [[baseline-debt]].**

## 🗺️ Map of Content

### 00 — Meta
- [[meta/README|Meta overview]] — how to use and maintain this vault
- [[changelog]] — log of notable changes to **this** project
- [[decisions-log]] — Architecture Decision Records. ADR-0001…0016 are the kit's;
  **ADR-0101…0105 are this project's**, including the conventions it deviates from
- [[baseline-debt]] — what `verify.sh` reports today, and why each item is there

### 01 — Architecture
- [[stack-profile]] — **start here** — what `stack.json` is, and this project's resolved profile
- [[system-overview]] — the big picture, request lifecycle, mental model
- [[tech-stack]] — every dependency and why it is here
- [[folder-structure]] — where everything lives and what belongs where
- [[site-map]] — **route → view → Strapi endpoint**, the four WebGL scenes, and how to add a page
- [[data-flow]] — how state, scroll and motion data move through the app
- [[environment-variables]] — config & secrets handling

### 02 — Frontend
- [[routing-views]] — route → view delegation, server-first rendering
- [[design-system]] — `colors.*`, `rm()`, `media.*`, the scaling grid, fonts
- [[motion-system]] — the six Springs primitives, their real props, and the two global gates
- [[motion-bindings]] — react-spring + the local text engine + lenis, and why nothing else
- [[text-motion]] — `TLine`, and the four traps of the split-text engine
- [[text-engine-reference]] — the full `TextEngine` / `TextProgress` API
- [[smooth-scroll]] — Lenis, `useScroll`, `scrollTo`, and locking scroll
- [[component-conventions]] — how to write & place components
- [[html-semantics]] — semantic, accessible, SEO-correct markup rules
- [[seo-metadata]] — `createMetadataGenerator`, sitemap, robots, JSON-LD (and the OG-image bug)
- [[components]] — every shared component in `src/components/`
- [[hooks]] — every hook, plus the eight stores and two contexts
- [[utils]] — every helper in `src/utils/`

### 03 — Backend
- [[backend/README|Backend overview]] — the 23 endpoints, in one page
- [[api-architecture]] — the endpoint shape, `getStrapiData`, the form endpoints, secrets
- [[cms]] — Strapi: how it connects, what it returns, media, failure behaviour
- [[database]] — there isn't one, and what to do if that changes

### 04 — Workflows
- [[ai-agent-guide]] — rules of engagement for AI agents working in this repo
- [[adapt-stack]] — what `/adapt` decided here, and when to re-run it
- [[agent-harness]] — the `.claude/` execution layer: commands, rules, skills, agents
- [[new-page]] — the ten-step playbook for a page or section
- [[generic-layout-prompt]] — fill-in prompt template for a new page/section
- [[figma-to-code]] — turning a Figma frame into components
- [[qa-verification]] — how work is checked before it is called done
- [[ship]] — the pre-launch gate and deployment
- [[seo-aeo]] — the audit checklist, and the three SEO bugs to fix first
- [[site-migration]] — the 609-entry redirect map this site already carries
- [[optimize-3d-scene]] — the four scenes, what already protects them, and the order of fixes

### Templates
- [[templates/component-note|Component note template]]
- [[templates/hook-note|Hook note template]]
- [[templates/adr-note|ADR template]]

## 🏷️ Tag legend

| Tag | Meaning |
|-----|---------|
| `#stable` | Documented and reliable — safe to depend on |
| `#wip` | Work in progress / partially documented |
| `#todo` | Needs attention or is unfinished |
| `#decision` | Records or relates to an architectural decision |
| `#do-not-modify` | Code that must not be edited (a vendored engine) |
| `#stack-specific` | Content that is true only for this project's framework |

## 🔌 Obsidian setup

Open this folder (`obsidian/`) as an Obsidian vault. Recommended:
- **Graph view** — see how conventions, components and decisions connect
- **Dataview plugin** — query notes (e.g. list all `#wip` pages)
- **Templates core plugin** — point it at the `templates/` folder
