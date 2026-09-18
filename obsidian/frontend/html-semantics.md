---
tags: [frontend, seo, a11y, stable]
updated: 2026-09-17
---

# HTML Semantics

The markup is the accessibility and SEO story. On a site this animation-heavy it
is also the only thing a crawler or a screen reader ever sees, because none of
them run the springs.

## Rules

1. **One `<h1>` per page**, then a clean outline — never skip a level to get a
   size. Size is a style; `rm()` and the font helpers exist for that.
2. **Native elements over `div`**. `<button>` for actions, `<a>` for navigation,
   `<ul>/<li>` for lists, `<section>`/`<article>`/`<nav>`/`<header>`/`<footer>`
   for structure.
3. **Every animation wrapper takes the real element.** `Inview`, `Spring`,
   `SpringTrigger`, `TLine` and the `animated/` wrappers all accept `tag` from a
   ~60-element union. `tag="div"` is a last resort, and `verify.sh` WARNs on it.
4. **`alt` on every image.** Decorative images take `alt=""`. Content images get
   real descriptions from Strapi, not filenames.
5. **Internal links go through a component**, not a raw `<a href="/…">`:
   `next/link`, or `AnimLink` when the page transition should play. A raw `<a>`
   also loses the locale prefix.
6. **Content exists regardless of motion state** — see [[text-motion]] and
   [[motion-system]].
7. **JSON-LD, never microdata** — [[seo-metadata]].
8. **Labels on form controls.** The contact form's inputs live in
   `src/components/Ui/Inputs/`; a placeholder is not a label.

## Landmarks in this app

The shell (`src/app/[locale]/layout.tsx`) provides `<main>` around page content,
`Header` and `Footer`. A view therefore renders **sections inside `<main>`** and
must not add a second `<main>`.

## Interactive elements

Anything clickable must be focusable and operable by keyboard. A `div` with
`onClick` is neither.

```tsx
<div className="button" onClick={…}>   ❌ not focusable, no role, no Enter/Space
<button type="button" onClick={…}>     ✅
```

Eleven of these exist today — the 3D zoom controls in `ProductScene` and
`PackageScene`, the menu items in `Header/Menu.tsx`, and the policy rows in both
contact forms. They are real bugs, listed in [[baseline-debt]]. Do not add more.

## Motion-specific traps

- **`Hover` is disabled below 768px** (`springsConfig.disableOnMobile.hover`).
  Never put information or an action behind hover alone.
- **`Handle` ignores its `tag` prop and always renders a `div`** — do not use it
  where semantics matter.
- **`SpringTrigger` renders two nested elements** (`tag` plus `innerTag`,
  default `div`). Set `innerTag` when the inner element needs meaning.
- **`TextEngine` renders a flex container of spans.** A heading is still an
  `<h1>` because of `tag`, but the text inside is split — do not rely on
  `::first-line` or text selection behaving normally.
- **No `prefers-reduced-motion` support exists anywhere.** That is an
  accessibility gap, recorded in [[motion-system]].

## What `verify.sh` checks

`<img>` instead of `next/image` · missing `alt` · raw `<a href="/">` ·
`onClick` on `div`/`span` · more than one `<h1>` in a view · `tag="div"` on an
animation wrapper. All WARNs — they need a human to judge, but a new one is a
regression.

## Related

[[seo-metadata]] · [[motion-system]] · [[text-motion]] · [[component-conventions]] · [[baseline-debt]]

## Hydration-safe markup

The server renders with **no viewport**: `useWindowWidth()` reports 0. Markup
that branches on width therefore renders one tree on the server and another on
the client, and React rebuilds the whole DOM. Gate it with `useMounted()`, with
desktop as the server assumption:

```tsx
{(!mounted || width > 768) && <DesktopOnly />}
{mounted && width <= 768 && <MobileOnly />}
```

Two related rules, both of which broke real pages here:

- **Nesting must be valid.** A `<div>` inside a `<p>` is repaired by the browser
  and hydration then disagrees — use a `span` with `display: inline-block`. The
  three policy views hit this with `StyledDot`, which renders inside a rich-text
  paragraph and is now a `span`.
- **SVG attributes are camelCase in JSX**: `strokeWidth`, `fillOpacity`,
  `clipRule`. React rejects the kebab-case form.

ADR-0114.
