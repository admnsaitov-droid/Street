---
tags: [workflow, template, stable]
updated: 2026-09-17
---

# Prompt Template — New Page or Section

Copy, replace the `[PLACEHOLDERS]`, delete what does not apply, hand it over.
Because the conventions live in the vault and the hooks load them automatically,
this says **what** to build, not how to write it.

---

```text
Build [PAGE OR SECTION NAME] for Street Barbell.

DESIGN
Figma: [URL / node ID]  (desktop + mobile frames)
[Or: no design — follow the pattern in src/views/[SIMILAR]View/]

ROUTE
Path: /[locale]/[PATH]
[Dynamic? params: locale + [slug]]
[New page? Add to src/app/sitemap.ts and obsidian/architecture/site-map.md]
[Replacing an old URL? Add a redirect to src/redirects.mjs]

CONTENT
Strapi endpoint: [get-thing-data]  [exists / needs creating]
Shape: [top-level keys you expect]
Fallback when null: [what should render]

SECTIONS
1. [Section] — [what it shows] — [motion: reveal on enter / parallax / none]
2. …

MOTION
[Anything beyond the defaults. Otherwise: use the primitives per
 obsidian/frontend/motion-system.md]

3D
[Scene needed? Which model? Otherwise delete this block.]

NOTES
[Anything unusual: a new colour, a locale-specific layout, an existing
 component to reuse, a performance constraint.]
```

---

## What you get back

- A thin route under `src/app/[locale]/`, delegating to a view.
- The view in `src/views/<Name>View/` with `screens/` or `components/`.
- The API endpoint if one was needed.
- The sitemap entry and the [[site-map]] row.
- `verify.sh` / `yarn lint` / `yarn build` run, with the results stated.
- A summary of assumptions, any colours added to `_colors`, and anything that
  could not map to an existing component or token.

## Writing a good request

- **Say what, not how.** "A testimonials section with a horizontal scroll
  carousel" — not "use a scrub trigger with a parallel spring".
- **Name the view.** Routes delegate; iteration happens on the view.
- **Point at a similar existing page** when there is one. `HomeView` and
  `PackagesView` are the richest examples.
- **Only cite a vault note to override a convention.** The hooks pull in the
  right guide on their own.
- **Say if content is not ready.** The answer is a fallback shape, not invented
  copy.

## Related

[[new-page]] · [[site-map]] · [[motion-system]] · [[design-system]]
