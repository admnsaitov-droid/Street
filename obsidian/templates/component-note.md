---
tags: [frontend, component, wip]
updated: 2026-09-17
---

# Component — {{title}}

> Template — duplicate when documenting a component that needs more than a row
> in [[components]], and link it from there.

- **File:** `src/components/{{title}}/{{title}}.tsx` *(or
  `src/views/<Name>View/components/`)*
- **Rendering:** server / `"use client"` — and why, if client
- **Status:** #wip

## Purpose

What it does and when to use it. What it is *not* for.

## Props

```ts
interface {{title}}Props {
  // …
}
```

| Prop | Type | Default | Description |
|---|---|---|---|
| | | | |

## Usage

```tsx
<{{title}} … />
```

## Notes

- **Motion:** which primitives, and why those ([[motion-system]]). Which `tag`
  it passes.
- **Styling:** which `colors.*` and `rm()` values; any `media.*` behaviour.
- **Data:** what props it expects, and what it renders when they are `null`.
- **Semantics:** which element it renders, and what it expects around it
  ([[html-semantics]]).
- **Accessibility:** labels, focus, keyboard, anything hidden behind `Hover`
  (which is off below 768px).

## Related

[[components]] · [[component-conventions]] ·
