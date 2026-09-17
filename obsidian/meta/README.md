---
tags: [meta, stable]
updated: 2026-09-17
---

# Meta — How this vault works

Documentation *about* the documentation.

## Purpose

The vault is this project's **second brain**. Any contributor — human or AI —
should be able to understand how Street Barbell is built without
reverse-engineering `src/`. The code is the *what*; this vault is the *why* and
*how*.

## Structure

```
obsidian/
├── README.md       ← vault home / Map of Content
├── meta/           ← docs about the docs, changelog, decisions, baseline debt
├── architecture/   ← the stack profile, structure, site map, data flow, env
├── frontend/       ← routing, styling, motion, the text engine, components
├── backend/        ← the API layer, Strapi, (no) database
├── workflows/      ← repeatable playbooks & AI agent rules
└── templates/      ← note templates for components, hooks, ADRs
```

## The rule that governs these notes

> [!important] Every note describes **this codebase**
> Not an ideal, not the kit's defaults, not another project. If a note says a
> component exists, it exists. If it names a path, that path is real. If it
> describes a convention, the code follows it — or the note says explicitly that
> it does not, and links the ADR or the [[baseline-debt]] entry.
>
> The kit these notes came from was framework-neutral by design. That neutrality
> was **deliberately traded away** when it was fitted to this project: neutral
> prose that is true of nothing in particular is worse than accurate prose that
> needs updating after a refactor.

The consequence is that these notes **go stale**. That is the accepted cost, and
it is why the maintenance rules below are not optional.

## Conventions

- **Wikilinks** — link generously. A wikilink to a note that does not exist yet
  is fine; it marks something worth documenting.
- **Frontmatter** — every note carries `tags` and an `updated` date.
- **One concept per note.**
- **Name real things.** `colors.blue`, `rm(32)`, `src/app/api/get-home-data/` —
  not `<the token>`, `<spacing helper>`, `<the endpoint>`.
- **Record what is broken**, not only what is intended. A note that describes the
  intent while the code does something else is the failure mode this vault
  exists to prevent.

## Maintenance rules

1. Dependency change → [[tech-stack]] + [[changelog]].
2. Architectural choice → an ADR in [[decisions-log]], numbered from 0101.
3. Component / hook / util added → the relevant catalog note.
4. Page added → [[site-map]] **and** `src/app/sitemap.ts`.
5. Path, package or command changed → **`.claude/stack.json`**. A stale profile
   silently disables checks in `verify.sh`; that is worse than a stale paragraph.
6. Something in [[baseline-debt]] fixed → delete its entry.
7. [[motion-system]] and [[text-engine-reference]] must stay true to the code in
   `src/components/Springs/` and `src/components/Text/` — they are the notes most
   likely to be trusted without checking.

The `vault-librarian` agent does this pass on request, and the `Stop` hook asks
after every turn.

## Which notes are inherited, which are ours

- **[[decisions-log]]** ships with ADR-0001…0016 from the kit; ADR-0101… are this
  project's. Keep both.
- **[[changelog]]** is this project's history only.
- **[[site-map]]** and **[[baseline-debt]]** did not exist in the kit — they were
  written for this codebase and are the two most project-specific notes here.
- Everything else was rewritten against `src/` on 2026-09-17.

## Related

[[README]] · [[ai-agent-guide]] · [[stack-profile]] · [[baseline-debt]]
