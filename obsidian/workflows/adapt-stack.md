---
tags: [workflow, stable]
updated: 2026-09-17
---

# Workflow — Adapt the Kit

Skill: `stack-adapt`. Command: `/adapt`. What it produces: [[stack-profile]].

## It has already run

`/adapt` ran on **2026-09-17** against this codebase. `.claude/stack.json` has
`"adapted": true`, all six rules in `.claude/rules/` were rewritten for this
project, and the resolved profile is in [[stack-profile]] with every judgement
call listed.

Result: **0 SKIPs** in `verify.sh` — no field was left null.

## When to run it again

| Trigger | Why |
|---|---|
| A Next.js major upgrade (14 → 15/16) | routing, metadata and middleware APIs move; `params` handling changes |
| A directory moves or is renamed | a stale path silently disables checks |
| A dependency swap (motion, styling, state) | bindings drive which `verify.sh` checks run |
| A new script in `package.json` | `commands.*` must stay verbatim |
| `verify.sh` reports SKIPs | something in the profile went null |

A stale profile is worse than no profile: checks skip silently and agents write
files into paths that no longer exist.

## What it does

1. `.claude/scripts/detect-stack.sh` — evidence: manifest, lockfiles, framework
   config, source tree.
2. Identify the framework **and its major**, confirming APIs against the
   installed version rather than memory.
3. Fill `.claude/stack.json` against `.claude/stack.schema.json`. Record only
   paths that exist.
4. Ask only what the repo cannot answer — rarely more than three questions.
5. Retarget the `paths:` frontmatter **and the prose** in every
   `.claude/rules/*.md`.
6. Record it: [[stack-profile]], [[tech-stack]], [[folder-structure]], a
   [[changelog]] entry, and an ADR for any convention switched off.
7. Prove it: `verify.sh`, `yarn lint`, `yarn build`. Read the SKIPs.

## Things this project's run decided

Re-reading these before a re-run saves rediscovering them:

- `conventions.tokenTiers: false` — styled-components, two tiers (ADR-0101).
- `paths.routeAllowedImports` was **added to the schema and `verify.sh`** so
  route-level data/metadata imports pass (ADR-0102).
- `paths.protected` = `src/components/Springs/**` + `src/components/Text/**`
  (ADR-0105).
- `paths.env: null` recorded honestly so the env check FAILs rather than skips
  (ADR-0104).
- `paths.assets: null` — content assets live in Strapi.
- `packageManager: yarn` — both lockfiles are committed; yarn is the maintained
  one.

## Related

[[stack-profile]] · [[agent-harness]] · [[decisions-log]] · [[baseline-debt]]
