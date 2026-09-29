---
tags: [workflow, ai, stable]
updated: 2026-09-17
---

# AI Agent Guide

Rules of engagement for AI agents (Claude Code, Cursor) working in this repo.

## Read this first

> [!important] The architecture is the reference
> This is a shipping site. The vault was written **around** the existing
> codebase, not to reform it. Document and extend what is here; do not
> restructure it. Where a kit convention and this codebase disagree, there is an
> ADR saying which wins — [[decisions-log]] ADR-0101 … 0105.

> [!warning] Next.js 14.2, not 15 or 16
> `params` is a `Promise` and pages `await` it. Verify routing, metadata and
> middleware APIs against the installed version, not memory. Confidently writing
> another major's API is the most common failure here.

> [!tip] Before "fixing" a `verify.sh` FAIL
> Four FAILs are standing baseline debt with known causes. Read
> [[baseline-debt]] first — fixing one is welcome, but it is a deliberate piece
> of work, not incidental cleanup.

## Source-of-truth hierarchy

| Layer | Files | Purpose |
|---|---|---|
| **The profile** | `.claude/stack.json` | paths, bindings, capabilities, commands |
| **This vault** | `obsidian/**` | how work is done here, and why |
| **AI entry points** | `AGENTS.md`, `CLAUDE.md`, `.cursorrules` | the hard rules + a pointer here |
| **Execution layer** | `.claude/**` | commands, path-scoped rules, skills, agents, hooks, `verify.sh` — [[agent-harness]] |

## Hard rules

1. **Springs only**, through `@react-spring/web` and the primitives in
   `src/components/Springs/`. No `@keyframes`, no second animation library. A
   `transition` declaration in a styled-component is allowed for discrete
   hover/focus state. [[motion-system]]
2. **`src/components/Springs/` and `src/components/Text/` are protected.**
   Consume, wrap, never edit without sign-off. ADR-0105.
3. **Text goes through `TLine`**, with its traps: the container is flex (pair
   alignment with `justify-content`), `overflow` clips to the line-height box
   (leading ≥ 1.1), `children` must be a plain string. [[text-motion]]
4. **No hardcoded values.** Colours from `colors.*` (`src/styles/colors.ts`),
   every dimension through `rm()`, breakpoints through `media.*`, fonts through
   the `font*()` helpers. Content arrives as props. [[design-system]]
5. **Routes delegate to views.** A route may import its view plus the five
   modules in `paths.routeAllowedImports` — nothing else. [[routing-views]]
6. **Server-first.** `"use client"` on the leaf that needs it, never on a view.
7. **No new `any`.** Note `.eslintrc.json` disables the rule, so `yarn lint` will
   not catch you — `verify.sh` will.
8. **`next/link` or `AnimLink` for internal links, `next/image` for images.**
   A raw `<a href="/…">` also loses the locale prefix. For *content* imagery
   reach for `MediaComponent` (CMS media) or `Skeleton/PlaceholderImage`, not a
   bare `next/image` — a media slot must never be blank while it loads
   (ADR-0110).
9. **`API_URL` and every secret stay server-side**, read only inside
   `src/app/api/*`. The browser calls same-origin `/api/*` and nothing else.
   [[api-architecture]]
10. **Semantic markup**, and a real element in every motion wrapper's `tag`.
    [[html-semantics]]
11. **Verify before reporting done** — `.claude/scripts/verify.sh`, then
    `yarn lint` and `yarn build`. No new FAILs, and say what you left.
    [[qa-verification]]
12. **A performance request touching a WebGL scene → the `optimize-3d-scene`
    skill first.** Do not improvise an order of fixes. [[optimize-3d-scene]]
13. **Add every new route to `src/app/sitemap.ts` in the same change.**

## Before you write anything

```bash
cat .claude/stack.json          # paths, bindings, commands
```

Then the note for the task: [[site-map]] to find where something lives,
[[motion-system]] before animating, [[design-system]] before styling,
[[api-architecture]] before touching an endpoint, [[new-page]] to build a page.

## Where to look

| Question | Note |
|---|---|
| Where does this page/endpoint live? | [[site-map]] |
| What are the paths and commands? | [[stack-profile]] |
| How is the app assembled? | [[system-overview]], [[folder-structure]] |
| What's in the stack and why? | [[tech-stack]] |
| How do I add a page? | [[new-page]] |
| How does motion work? | [[motion-system]], [[text-motion]], [[text-engine-reference]] |
| How do I style something? | [[design-system]] |
| What already exists? | [[components]], [[hooks]], [[utils]] |
| How does content get here? | [[cms]], [[api-architecture]], [[data-flow]] |
| The 3D scene lags | [[optimize-3d-scene]] |
| How do I check my work? | [[qa-verification]] |
| SEO / AI visibility | [[seo-metadata]], [[seo-aeo]] |
| Is it ready to launch? | [[ship]] |
| Why is this FAIL here? | [[baseline-debt]] |
| Why was X decided? | [[decisions-log]] |

## After making changes

- New dependency → [[tech-stack]] + [[changelog]].
- Architectural choice → an ADR in [[decisions-log]] (this project's start at 0101).
- New component/hook/util → the relevant catalog note.
- New page → [[site-map]] **and** `src/app/sitemap.ts`.
- A path, package or command changed → `.claude/stack.json`.
- Fixed something in [[baseline-debt]] → delete its entry.

The `vault-librarian` agent does this pass on request.

## Automated enforcement

Three hooks in `.claude/settings.json` run without being asked (ADR-0006):

| Hook | Fires | Effect |
|---|---|---|
| `SessionStart` | new chat / resume | points at the vault and names the framework |
| `UserPromptSubmit` | every request | reminds you to consult the right guide and resolve paths from the profile |
| `Stop` | end of every turn | blocks **once** to confirm the vault was updated |

The `Stop` hook is keyed by session id and cannot loop. `/hooks` to review or
disable.

## Related

[[agent-harness]] · [[stack-profile]] · [[qa-verification]] · [[new-page]] · [[baseline-debt]]
