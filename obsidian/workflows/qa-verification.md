---
tags: [workflow, qa, stable]
updated: 2026-09-17
---

# Workflow — QA & Verification

How work is checked before it is called done. Skill: `qa-verify`. Command: `/qa`.

## Layer 1 — mechanical

```bash
.claude/scripts/verify.sh            # whole src/
.claude/scripts/verify.sh src/views  # scoped
yarn lint
yarn build
npx tsc --noEmit                     # no package script for this
```

- **FAIL** — must be zero *new* ones. The four standing FAILs are documented in
  [[baseline-debt]]; anything beyond them is yours.
- **WARN** — a judgement call. Fix it or justify it in the summary.
- **SKIP** — should be zero here. A SKIP means `stack.json` lost a value.

The header line names the framework, source root, motion and styling bindings the
script used. If it surprises you, fix the profile before trusting the result.

> [!warning] `yarn lint` is a weak gate here
> `.eslintrc.json` disables `no-explicit-any`, `no-unused-vars`,
> `no-unused-expressions`, `ban-ts-comment` and `prefer-const`. A clean lint says
> very little. `verify.sh` is the real check.

## Layer 2 — judgement

A script cannot see a design or weigh a motion choice. Walk these:

**Design fidelity** — against the actual Figma frame, re-fetched, not your own
earlier summary. Desktop and mobile.

**Tokens** — no literal colour outside `_colors`; no raw `px` where `rm()`
belongs; no hand-written `@media`; no direct `font-family`.

**Motion** — the right primitive (`Inview mode="once"` for a reveal, not
`mode="always"`); a real element in every `tag`; transform/opacity only; text
through `TLine` with `justify-content` set if it is centred; leading ≥ 1.1 under
`overflow`.

**Semantics & a11y** — one `<h1>`; real `<button>` for anything clickable;
`alt` on every image; keyboard reachable; nothing important behind `Hover`
(disabled below 768px).

**Responsive** — check 1920, 1440, 768, 576 and **360**. `related.xsm = 360`
means mobile is scaled against a 360px design width.

**Client JS** — did a view gain `"use client"`? Did a heavy import land outside
`next/dynamic`? Ten views already carry the boundary; do not make it eleven.

**Data** — does the page still render when `getStrapiData` returns `null`? Test
it by stopping Strapi or pointing `API_URL` at nothing.

**Locales** — check at least one non-`en` locale. Missing translations and
layout overflow show up there first.

## The loop

1. Layer 1; fix every new FAIL.
2. Layer 2 section by section, fixing as you go.
3. Re-run layer 1 — fixes introduce violations.
4. Repeat until clean.

## Check the production build

`yarn build && yarn start`, not the dev server. Dev hides hydration errors,
prerender gaps, `removeConsole` differences and asset-path mistakes.

## Reporting

State plainly: what failed and was fixed, which WARNs were kept and why, what
could not be verified (no design, no device, Strapi unavailable), and whether the
production build was actually run.

**Never report a clean pass you did not achieve.**

## Related

[[ai-agent-guide]] · [[new-page]] · [[ship]] · [[baseline-debt]]
