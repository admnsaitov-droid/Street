---
tags: [workflow, ai, stable]
updated: 2026-09-17
---

# The Agent Harness (`.claude/`)

The vault is the project's **knowledge**. `.claude/` is its **execution layer** —
the profile, commands, rules, skills, agents and scripts that turn knowledge into
something an agent actually runs.

```
.claude/
├── stack.json         # THIS PROJECT'S SHAPE — read before writing any file
├── stack.schema.json  # what each field means
├── settings.json      # hooks + permissions
├── scripts/
│   ├── verify.sh        # mechanical rule checks — the only executable gate
│   ├── detect-stack.sh  # evidence for /adapt
│   ├── stack.sh         # shared stack.json reader (jq → node → python3)
│   └── hooks/           # session-start · user-prompt · stop
├── rules/             # path-scoped context, auto-loaded per file touched
├── skills/            # procedures, loaded on demand by name or description
├── agents/            # subagents with their own context window
└── commands/          # slash commands — thin entry points a human types
```

## Which mechanism for what

| Mechanism | Loads when | Use for |
|---|---|---|
| **The profile** (`stack.json`) | read explicitly | paths, packages, commands — the facts |
| **Vault note** | an agent reads it | the *why*, reference, decisions |
| **Rule** (`rules/*.md`) | Claude reads a file matching `paths:` | short, non-negotiable constraints for that area |
| **Skill** (`skills/*/SKILL.md`) | invoked by name, or matched by description | multi-step procedures |
| **Agent** (`agents/*.md`) | delegated to | parallel or context-heavy work |
| **Command** (`commands/*.md`) | a human types `/name` | entry points to the above |
| **Hook** (`settings.json`) | a lifecycle event | enforcement that must not depend on the model deciding |

> [!warning] Path-scoped rules fire on **read**, not write
> A `paths:`-scoped rule enters context when Claude *reads* a matching file — not
> when it creates one. A file written from scratch may never trigger its rule, and
> rules are not re-injected after `/compact` until a matching file is read again.
> So rules reinforce; they do not guarantee. Anything that must hold regardless
> belongs in `verify.sh` or a hook.
>
> Their globs are **retargeted by `/adapt`**. A rule still pointing at a path this
> project does not have is dead weight in every context window — fix or delete it.
>
> `motion.md` and `design-tokens.md` deliberately overlap on
> `src/{components,views}/**/*.tsx`: both conventions matter when writing a
> component, and the combined cost is a few KB of context per file read.

## Commands

`/adapt` · `/motion` · `/new-page` · `/section` · `/qa` · `/ship` · `/seo` ·
`/cms` · `/data` · `/migrate-site`

## Rules

All six were **rewritten for this codebase** during `/adapt` — they name real
paths and real packages, not the kit's neutral defaults.

| Rule | Scoped to | Carries |
|---|---|---|
| `motion.md` | `src/{components,views,layouts,app}/**/*.tsx`, `src/hooks` | springs-only, the primitive table, the protected engines, mobile gating |
| `design-tokens.md` | `src/styles/**`, components, views, layouts | `colors.*`, `rm()`/`em()`/`media`, where a style goes |
| `routing-views.md` | `src/app/**`, `src/views/**`, `src/layouts/**`, middleware, i18n | the route shape, `routeAllowedImports`, locales, server-first |
| `api-env.md` | `src/app/api/**`, `utils/strapi.ts`, `utils/telegram.ts`, `next.config.mjs` | the endpoint shape, secrets, the unvalidated bodies, the `BASEURL` trap |
| `engine-protected.md` | `src/components/Springs/**`, `src/components/Text/**` | do-not-modify, with the file-by-file inventory |
| `data-layer.md` | `src/app/api/**`, `utils/strapi.ts`, both store folders | the Strapi flow, the eight zustand stores, forms |

## Skills

| Skill | Invoke when | Note |
|---|---|---|
| `stack-adapt` | first session, or after an upgrade | [[adapt-stack]] |
| `motion-system` | no motion layer, or extending it | [[motion-system]] |
| `qa-verify` | after any UI work, before committing | [[qa-verification]] |
| `figma-to-section` | a Figma URL or frame arrives | [[figma-to-code]] |
| `headless-cms` | adding/changing the CMS | [[cms]] |
| `database` | database, migrations, RLS | [[database]] |
| `auth` | the project needs real user accounts | |
| `seo-audit` | SEO health check or launch prep | [[seo-aeo]] |
| `schema-markup` | structured data | [[seo-aeo]] |
| `aeo-visibility` | AI/answer-engine visibility | [[seo-aeo]] |
| `site-migration` | rebuilding an existing live site | [[site-migration]] |
| `ship-check` | pre-launch gate | [[ship]] |
| `optimize-3d-scene` | perf work on a three.js/WebGL scene | [[optimize-3d-scene]] |

## Agents

| Agent | Use for |
|---|---|
| `section-builder` | one Figma section each, in parallel |
| `motion-reviewer` | auditing animation-heavy work |
| `vault-librarian` | syncing the vault **and the profile** after a change |
| `seo-auditor` | a full SEO/AEO audit with fixes |

## What this project added to the kit

`paths.routeAllowedImports` — a `stack.json` field and a `verify.sh` filter that
lets a route import the project's data/metadata/SEO modules while still failing
on a UI import. Schema, profile and script were all extended together (ADR-0102).

## `verify.sh` in one paragraph

It reads `stack.json`, works out which checks can apply, and runs them: motion
(keyframes, foreign animation libraries, text traps), tokens (hardcoded values,
literals in the theme layer), architecture (route delegation, client boundaries,
`any`, env access), markup (images, links, headings, click handlers) and hygiene
(console logs, protected paths). Checks whose preconditions are unmet print
**SKIP** and are counted (ADR-0010). FAILs exit non-zero; WARNs never do.

This project reports **0 SKIPs** — every check applies. The four standing FAILs
are baseline debt with known causes: [[baseline-debt]].

## Registering something new

1. Drop it in the right `.claude/` folder.
2. Add or extend a vault note under `workflows/`.
3. Link it from [[README]] and the tables above and in [[ai-agent-guide]].
4. Log it in [[changelog]]; add an ADR if it changes how work is done.

## Related

[[ai-agent-guide]] · [[stack-profile]] · [[qa-verification]] · [[decisions-log]]
